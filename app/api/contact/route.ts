import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db/client";
import { contactSubmissions } from "@/db/schema";
import { sendContactNotification } from "@/lib/email";
import { relayLeadToNgf } from '@/lib/ngf-lead'
import { scoreSubmission, failsBotChecks } from '@/lib/spam-filter'

// Length caps are abuse limits, not content rules: nothing here should ever
// reject a real enquiry. The longest genuine message in 120 days of real
// submissions was 2,497 characters, so 10,000 leaves 4x headroom while
// stopping a multi-megabyte body from being parsed, scored and emailed.
const contactSchema = z.object({
  name: z.string().min(2).max(200),
  email: z.string().email().max(320).optional().or(z.literal('')),
  phone: z.string().max(50).optional(),
  hasLot: z.string().max(100).optional(),
  timeline: z.string().max(100).optional(),
  homeType: z.string().max(100).optional(),
  bedrooms: z.string().max(20).optional(),
  bathrooms: z.string().max(20).optional(),
  idealBudget: z.string().max(100).optional(),
  message: z.string().max(10000).optional(),
  // Anti-spam signals, not content. Stripped before anything is stored,
  // relayed or emailed.
  _gotcha: z.string().optional(),
  renderedAt: z.number().optional(),
});

/**
 * Always answer as if the submission succeeded, even when it was filtered.
 * Telling a sender their message was dropped only teaches them what to change,
 * and a real person who somehow trips the filter still sees a normal thank-you
 * rather than an error they cannot act on.
 */
const accepted = () =>
  NextResponse.json({ message: "Inquiry submitted successfully." }, { status: 200 });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "Please complete all fields." }, { status: 400 });
    }

    const { _gotcha, renderedAt, ...data } = parsed.data;

    // 1. Hard bot checks: a field no human can see, and a fill time no human
    //    can achieve. Safe to drop outright.
    const botReason = failsBotChecks(_gotcha, renderedAt);
    if (botReason) {
      console.warn(`[spam-blocked] bot check (${botReason})`, JSON.stringify(data));
      return accepted();
    }

    // 2. Content scoring. What actually reaches this form is cold B2B sales
    //    outreach, which no honeypot catches — see lib/spam-filter.ts. Only a
    //    high score is dropped; 'suspect' is still delivered, just flagged.
    const spam = scoreSubmission(data);
    if (spam.verdict === 'spam') {
      // The ONLY record of a dropped submission, so log it whole: if the
      // scoring is ever wrong, this is how the enquiry gets recovered.
      console.warn(
        `[spam-blocked] score ${spam.score} (${spam.reasons.join(', ')})`,
        JSON.stringify(data),
      );
      return accepted();
    }
    if (spam.verdict === 'suspect') {
      console.warn(`[spam-suspect] score ${spam.score} (${spam.reasons.join(', ')}) from ${data.name}`);
    }

    // DB insert is optional — silently skip if DATABASE_URL is not configured
    if (process.env.DATABASE_URL) {
      try {
        const db = getDb();
        await db.insert(contactSubmissions).values({
          name: data.name,
          email: data.email ?? "",
          phone: data.phone ?? "",
          hasLot: data.hasLot ?? "",
          timeline: data.timeline ?? "",
          homeType: data.homeType ?? "",
          bedrooms: data.bedrooms ?? "",
          bathrooms: data.bathrooms ?? "",
          idealBudget: data.idealBudget ?? "",
          message: data.message ?? "",
        });
      } catch (dbError) {
        console.warn("DB insert skipped:", dbError);
      }
    }

    // Persist to the central NGF lead store as the system of record — the
    // site's own DB insert above is best-effort (its catch only warns).
    await relayLeadToNgf("contact", data);

    await sendContactNotification({
      ...data,
      email: data.email ?? "",
      phone: data.phone ?? "",
      spamNotice: spam.verdict === 'suspect' ? spam.reasons.join(', ') : undefined,
    });

    return NextResponse.json({ message: "Inquiry submitted successfully." }, { status: 200 });
  } catch (error) {
    console.error("Contact submission error", error);
    return NextResponse.json(
      { message: "We could not submit your request. Please try again." },
      { status: 500 },
    );
  }
}
