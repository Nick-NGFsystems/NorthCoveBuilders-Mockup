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
  message?: string;
};

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:8px 16px 8px 0;color:#6b7280;font-size:13px;font-family:Arial,Helvetica,sans-serif;white-space:nowrap;vertical-align:top;width:140px;">${label}</td>
      <td style="padding:8px 0;color:#111827;font-size:14px;font-family:Arial,Helvetica,sans-serif;vertical-align:top;">${value}</td>
    </tr>`;
}

function buildHtml({
  name, email, phone, hasLot, timeline, homeType, bedrooms, bathrooms, idealBudget, message,
}: ContactEmailArgs) {
  const optionalRows = [
    ["Lot Status", hasLot],
    ["Timeline", timeline],
    ["Home Type", homeType],
    ["Bedrooms", bedrooms],
    ["Bathrooms", bathrooms],
    ["Ideal Budget", idealBudget],
  ]
    .filter(([, v]) => Boolean(v && v.trim().length > 0))
    .map(([label, value]) => row(label as string, value as string))
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08);">

        <!-- Header -->
        <tr>
          <td style="background:#0f2f57;padding:28px 32px;">
            <p style="margin:0;color:#a8c4e0;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-family:Arial,Helvetica,sans-serif;">North Cove Builders</p>
            <h1 style="margin:6px 0 0;color:#ffffff;font-size:22px;font-weight:600;font-family:Arial,Helvetica,sans-serif;">New Inquiry</h1>
          </td>
        </tr>

        <!-- Contact info -->
        <tr>
          <td style="padding:28px 32px 0;">
            <p style="margin:0 0 16px;font-size:13px;color:#6b7280;font-family:Arial,sans-serif;text-transform:uppercase;letter-spacing:1px;">Contact</p>
            <table cellpadding="0" cellspacing="0" width="100%">
              ${row("Name", name)}
              ${row("Email", `<a href="mailto:${email}" style="color:#0f2f57;text-decoration:none;">${email}</a>`)}
              ${row("Phone", `<a href="tel:${phone}" style="color:#0f2f57;text-decoration:none;">${phone}</a>`)}
            </table>
          </td>
        </tr>

        ${optionalRows ? `
        <!-- Project details -->
        <tr>
          <td style="padding:24px 32px 0;">
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 20px;">
            <p style="margin:0 0 16px;font-size:13px;color:#6b7280;font-family:Arial,sans-serif;text-transform:uppercase;letter-spacing:1px;">Project Details</p>
            <table cellpadding="0" cellspacing="0" width="100%">
              ${optionalRows}
            </table>
          </td>
        </tr>` : ""}

        <!-- Message -->
        <tr>
          <td style="padding:24px 32px 0;">
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 20px;">
            <p style="margin:0 0 12px;font-size:13px;color:#6b7280;font-family:Arial,sans-serif;text-transform:uppercase;letter-spacing:1px;">Message</p>
            <p style="margin:0;font-size:15px;color:#111827;line-height:1.7;white-space:pre-wrap;font-family:Arial,Helvetica,sans-serif;">${message ?? ""}</p>
          </td>
        </tr>

        <!-- Reply button -->
        <tr>
          <td style="padding:28px 32px 32px;">
            <a href="mailto:${email}?subject=Re: Your North Cove Builders Inquiry"
               style="display:inline-block;background:#0f2f57;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:4px;font-size:14px;font-family:Arial,sans-serif;">
              Reply to ${name}
            </a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;padding:16px 32px;border-top:1px solid #e5e7eb;">
            <p style="margin:0;font-size:11px;color:#9ca3af;font-family:Arial,sans-serif;">Submitted via northcovebuilders.com</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendContactNotification(args: ContactEmailArgs) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const toRaw = process.env.EMAIL_TO;

  if (!apiKey || !from || !toRaw) {
    console.warn("Email env vars not configured — skipping notification.");
    return;
  }

  const to = toRaw.split(",").map((e) => e.trim()).filter(Boolean);
  const resend = new Resend(apiKey);

  const { name, email, phone, hasLot, timeline, homeType, bedrooms, bathrooms, idealBudget, message } = args;

  const optionalFields = [
    ["Lot Status", hasLot],
    ["Timeline", timeline],
    ["Home Type", homeType],
    ["Bedrooms", bedrooms],
    ["Bathrooms", bathrooms],
    ["Ideal Budget", idealBudget],
  ]
    .filter(([, v]) => Boolean(v && v.trim().length > 0))
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");

  const plainText = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    optionalFields,
    message ? `\nMessage:\n${message}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const { error } = await resend.emails.send({
    from,
    to,
    subject: `New North Cove Inquiry: ${name}`,
    html: buildHtml(args),
    text: plainText,
  });

  if (error) {
    console.error("Resend error:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}
