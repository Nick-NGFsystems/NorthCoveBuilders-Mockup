# North Cove Builders — Session Handoff

## What This Project Is

A marketing website for **North Cove Builders**, a custom home builder in West Michigan. Client of NGF Systems LLC (Nick Fultz). The site is a standalone Next.js project deployed on Vercel — separate from the NGF Systems app. Content is managed through the NGF portal editor at `app.ngfsystems.com`.

**Live site:** `northcovebuilders.com` (also accessible at `north-cove-builders-mockup-*.vercel.app`)
**GitHub repo:** `Nick-NGFsystems/NorthCoveBuilders-Mockup`
**Vercel project:** `north-cove-builders-mockup` under NGF Systems' projects team

---

## Key People

- **Neal Kelley** — Owner of North Cove Builders, LLC. Signed the contract. Primary contact.
- **Elisha Foster** (`efoster0625@gmail.com` / `elisha@northcovebuilders.com`) — Handles day-to-day communication, analytics setup, billing.
- **Nick Fultz** (`nick@ngfsystems.com`) — NGF Systems owner, developer.

---

## Contract Summary

- **Signed:** May 7, 2026
- **Service Track:** Monthly Subscription
- **Build Fee:** $0 (waived)
- **Monthly Fee:** $100/month — **due upon Go-Live** (site is live, first payment is currently outstanding)
- **Target Launch:** May 6, 2026
- **Price Lock:** $100/month for 5 years
- **Buyout Price:** $1,500 (client can purchase outright at any time)
- **Key clause:** Site may go live before Build Fee is paid; 30+ days past due = NGF can suspend with $200 reactivation fee + 1.5% monthly interest

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 16.1.6 (App Router) |
| Runtime | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4.x |
| Database | Neon (PostgreSQL) via Drizzle ORM |
| Email | Resend |
| Animations | Framer Motion |
| Deployment | Vercel |

This site uses **different versions** than the NGF Systems app (which is pinned to Next.js 15 / React 18). Do not apply NGF app version constraints here.

---

## NGF Portal Editor Integration

The site is fully integrated with the NGF portal editor. Every editable element has `data-ngf-field`, `data-ngf-label`, `data-ngf-type`, `data-ngf-section` attributes. The `NgfEditBridge` component in `app/layout.tsx` handles all postMessage communication with the portal iframe.

- **Content API:** `GET https://app.ngfsystems.com/api/public/content?domain=northcovebuilders.com`
- **NEXT_PUBLIC_SITE_URL** must match `client_configs.site_url` in the NGF database exactly
- CSP `frame-ancestors` header is set in `next.config.ts` — do not remove

---

## Current State (as of June 5, 2026)

### ✅ Done
- Full 7-page site live: Home, About, Our Work, Floor Plans, Available, Contact, Gallery
- NGF portal editor fully connected — all sections editable including repeatable groups (projects, reviews, team members)
- Contact form live and routing to both `nick@ngfsystems.com` and `northcovebuilders@gmail.com`
- Google Analytics 4 connected — Measurement ID: `G-RYLV9KXDCX`
- Microsoft Clarity connected — Project ID: `wxrublg1ay`
- North Cove favicon deployed (`app/favicon.ico` + `app/icon.png`)
- Security hardened: HTML escaping in email template, postMessage origin validation, image URL sanitization, security headers
- Vercel Blob storage provisioned for image uploads from portal editor

### ⚠️ Pending / In Progress
- **First invoice ($100) outstanding** — Elisha acknowledged, no payment yet
- **Contact form fields temporarily relaxed** — email and phone are optional (only name required) for Parade of Homes week. **Must be reverted ~1 week after parade.** See revert instructions below.
- **Parade of Homes QR code form** — Elisha requested a dedicated parade entry page. Response sent proposing a dedicated `/parade` page with simplified form (name + email only, auto-tagged as parade entry). Not yet built — awaiting her confirmation and parade dates.
- **GA4 Property ID** not yet wired into NGF admin dashboard (separate from client-side tracking). Requires Google service account setup.

---

## Reverting the Contact Form After Parade

When the parade week is over, revert these two files:

**`components/sections/ContactForm.tsx`** — add `required` back to email and phone inputs:
```tsx
<input required ... type="email" ... />
<input required ... type="tel" ... />
```

**`app/api/contact/route.ts`** — change the Zod schema back to:
```typescript
email: z.string().email(),
phone: z.string().min(7),
```
And remove the `?? ""` fallbacks in the DB insert and `sendContactNotification` call.

---

## Key Files

```
app/
  layout.tsx              ← GA4 + Clarity scripts, NgfEditBridge mount
  page.tsx                ← Home page (hero, about, projects, reviews)
  about/page.tsx
  our-work/page.tsx
  floor-plans/page.tsx
  available/page.tsx
  contact/page.tsx
  api/contact/route.ts    ← Contact form POST handler (Zod + Drizzle + Resend)

components/
  NgfEditBridge.tsx       ← Portal editor bridge — do not remove
  sections/ContactForm.tsx
  layout/Navbar.tsx
  layout/Footer.tsx

lib/
  ngf.ts                  ← getNgfContent(), getItems()
  analytics.ts            ← GA_MEASUREMENT_ID, CLARITY_PROJECT_ID
  site-data.ts            ← Hardcoded fallback content
  email.ts                ← Contact notification email (HTML escaped)

public/brand/
  logo.png
  logo-desktop.png
  NorthCoveFavicon.png    ← Source favicon file
```

---

## Environment Variables (Vercel)

| Variable | Value / Notes |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `northcovebuilders.com` |
| `DATABASE_URL` | Neon Postgres (contact form submissions) |
| `RESEND_API_KEY` | Set |
| `EMAIL_FROM` | Verified Resend sender |
| `EMAIL_TO` | `nick@ngfsystems.com,northcovebuilders@gmail.com` |
| `NGF_APP_URL` | Defaults to `https://app.ngfsystems.com` |

---

## Pushing Code

Use the GitHub API push script from the NGF repo. The NorthCoveBuilders-Mockup repo path in the config may need updating to the current session's mount path:

```bash
python3 /path/to/github-push.py NorthCoveBuilders-Mockup "commit message" [file1 file2 ...]
```

If the config has Windows paths, push files directly via the GitHub Contents API (PUT `/repos/Nick-NGFsystems/NorthCoveBuilders-Mockup/contents/<path>`).

---

## Recent Changes (This Session)

- Fixed HTML injection vulnerability in contact form email (`lib/email.ts` — added `escapeHtml()`)
- Relaxed contact form validation for Parade of Homes week (email + phone now optional)
- Connected GA4 (`G-RYLV9KXDCX`) and Clarity (`wxrublg1ay`) analytics
- Updated favicon to North Cove brand icon
- Fixed TypeScript build error caused by optional email/phone Zod types vs Drizzle insert

---

## Notes for Next Session

- Check if parade dates have been confirmed — if yes, build the dedicated `/parade` page
- Check if the $100 invoice has been paid — if 30+ days past due, suspension clause applies
- When reverting the contact form, test a submission end-to-end to confirm email routing still works
- If Elisha sends a GA4 numeric Property ID (not the G- measurement ID), that's for the NGF admin dashboard analytics widget — requires a separate Google service account setup
