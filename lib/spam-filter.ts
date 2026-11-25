// Spam filter for the contact form: a honeypot field plus a minimum-time check.
// Pure (no imports) so it can be unit tested with `node --test` — see
// scripts/spam-filter.test.mjs. Keep it free of enums/parameter properties so
// Node's built-in TypeScript stripping can load it.

// Deliberately non-semantic: browsers and password managers autofill fields named
// "website"/"url"/"company", which would discard a real visitor's enquiry.
// "_gotcha" is the NGF standard (see the honeypot rule in scripts/ngf-doctor.mjs).
export const HONEYPOT_FIELD = "_gotcha";
export const STARTED_AT_FIELD = "startedAt";

const MIN_FILL_MS = 3_000;
const MAX_AGE_MS = 60 * 60 * 1_000;

export type SpamReason =
  | "honeypot"
  | "timestamp_missing"
  | "timestamp_invalid"
  | "too_fast"
  | "too_old";

/**
 * Returns why a contact submission looks automated, or null if it looks human.
 * `body` is the untrusted parsed JSON; `startedAt` is epoch ms from the client.
 */
export function getSpamReason(body: unknown, now: number = Date.now()): SpamReason | null {
  const data = (typeof body === "object" && body !== null ? body : {}) as Record<string, unknown>;

  const honeypot = data[HONEYPOT_FIELD];
  const honeypotFilled = typeof honeypot === "string" ? honeypot.trim() !== "" : honeypot != null;
  if (honeypotFilled) return "honeypot";

  const startedAt = data[STARTED_AT_FIELD];
  if (startedAt === undefined || startedAt === null || startedAt === "") return "timestamp_missing";
  if (typeof startedAt !== "number" || !Number.isFinite(startedAt) || startedAt <= 0) {
    return "timestamp_invalid";
  }

  const elapsed = now - startedAt;
  if (elapsed < MIN_FILL_MS) return "too_fast";
  if (elapsed > MAX_AGE_MS) return "too_old";

  return null;
}
