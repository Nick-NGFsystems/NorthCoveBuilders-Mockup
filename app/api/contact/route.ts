import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db/client";
import { contactSubmissions } from "@/db/schema";
import { sendContactNotification } from "@/lib/email";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  hasLot: z.string().optional(),
  timeline: z.string().optional(),
  homeType: z.string().optional(),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  idealBudget: z.string().optional(),
  message: z.string().min(10),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "Please complete all fields." }, { status: 400 });
    }

    const db = getDb();

    await db.insert(contactSubmissions).values({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      hasLot: parsed.data.hasLot ?? "",
      timeline: parsed.data.timeline ?? "",
      homeType: parsed.data.homeType ?? "",
      bedrooms: parsed.data.bedrooms ?? "",
      bathrooms: parsed.data.bathrooms ?? "",
      idealBudget: parsed.data.idealBudget ?? "",
      message: parsed.data.message,
    });

    await sendContactNotification(parsed.data);

    return NextResponse.json({ message: "Inquiry submitted successfully." }, { status: 200 });
  } catch (error) {
    console.error("Contact submission error", error);
    return NextResponse.json(
      { message: "We could not submit your request. Please try again." },
      { status: 500 },
    );
  }
}
