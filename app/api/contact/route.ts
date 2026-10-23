import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db/client";
import { contactSubmissions } from "@/db/schema";
import { sendContactNotification } from "@/lib/email";
import { relayLeadToNgf } from '@/lib/ngf-lead'
import { getSpamReason } from '@/lib/spam-filter'

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  hasLot: z.string().optional(),
  timeline: z.string().optional(),
  homeType: z.string().optional(),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  idealBudget: z.string().optional(),
  message: z.string().optional(),
});

const success = () =>
  NextResponse.json({ message: "Inquiry submitted successfully." }, { status: 200 });

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Bots get the same success response a real visitor does, so they can't tell
    // they were filtered. Reason only in the log — never the submitted data.
    const spamReason = getSpamReason(body);
    if (spamReason) {
      console.warn("Contact submission filtered:", spamReason);
      return success();
    }

    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "Please complete all fields." }, { status: 400 });
    }

    // DB insert is optional — silently skip if DATABASE_URL is not configured
    if (process.env.DATABASE_URL) {
      try {
        const db = getDb();
        await db.insert(contactSubmissions).values({
          name: parsed.data.name,
          email: parsed.data.email ?? "",
          phone: parsed.data.phone ?? "",
          hasLot: parsed.data.hasLot ?? "",
          timeline: parsed.data.timeline ?? "",
          homeType: parsed.data.homeType ?? "",
          bedrooms: parsed.data.bedrooms ?? "",
          bathrooms: parsed.data.bathrooms ?? "",
          idealBudget: parsed.data.idealBudget ?? "",
          message: parsed.data.message ?? "",
        });
      } catch (dbError) {
        console.warn("DB insert skipped:", dbError);
      }
    }

    // Persist to the central NGF lead store as the system of record — the
    // site's own DB insert above is best-effort (its catch only warns).
    await relayLeadToNgf("contact", parsed.data);

    await sendContactNotification({
      ...parsed.data,
      email: parsed.data.email ?? "",
      phone: parsed.data.phone ?? "",
    });

    return success();
  } catch (error) {
    console.error("Contact submission error", error);
    return NextResponse.json(
      { message: "We could not submit your request. Please try again." },
      { status: 500 },
    );
  }
}
