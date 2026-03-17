import { Resend } from "resend";

type ContactEmailArgs = {
  name: string;
  email: string;
  phone: string;
  hasLot?: string;
  timeline?: string;
  homeType?: string;
  bedrooms?: string;
  bathrooms?: string;
  idealBudget?: string;
  message: string;
};

export async function sendContactNotification({
  name,
  email,
  phone,
  hasLot,
  timeline,
  homeType,
  bedrooms,
  bathrooms,
  idealBudget,
  message,
}: ContactEmailArgs) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const to = process.env.EMAIL_TO;

  if (!apiKey || !from || !to) {
    return;
  }

  const resend = new Resend(apiKey);

  const optionalFields = [
    ["Do you have a lot?", hasLot],
    ["Timeline", timeline],
    ["Home Type", homeType],
    ["Bedrooms", bedrooms],
    ["Bathrooms", bathrooms],
    ["Ideal Budget", idealBudget],
  ].filter(([, value]) => Boolean(value && value.trim().length > 0));

  const optionalFieldText = optionalFields.map(([label, value]) => `${label}: ${value}`).join("\n");
  const detailsSection = optionalFieldText ? `\n${optionalFieldText}\n` : "\n";

  await resend.emails.send({
    from,
    to,
    subject: `New North Cove Inquiry: ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}${detailsSection}\nMessage:\n${message}`,
  });
}
