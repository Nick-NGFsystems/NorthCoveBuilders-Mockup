# CLAUDE.md — North Cove Builders Website

This file provides guidance to AI when working on this repository.

---

## What This Project Is

A static marketing website for North Cove Builders, a custom home builder in West Michigan. This is a **client site** managed by NGFsystems — not the NGF app itself. It has no admin panel, no user authentication, and no client portal. Its only server-side logic is a contact form submission.

---

## Stack

| Layer | Tool | Version |
|---|---|---|
| Framework | Next.js App Router | 16.x |
| Runtime | React | 19.x |
| Language | TypeScript | always |
| Styling | Tailwind CSS | 4.x |
| Database | Neon (PostgreSQL) | serverless driver |
| ORM | Drizzle | 0.45+ |
| Email | Resend | latest |
| Animations | Framer Motion | latest |
| Validation | Zod | 4.x |
| Deployment | Vercel | — |

**This project intentionally deviates from the NGF main app stack.** Client marketing sites use the latest stable Next.js/React/Tailwind versions. The strict version pins in NGF-STANDARDS.md apply only to the NGF main app (NGF-Systems-app).

---

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run db:generate  # Generate Drizzle migration files
npm run db:migrate   # Run migrations against Neon
```

---

## Architecture

### Content — `lib/site-data.ts`

All editable content lives in `lib/site-data.ts`. There is no CMS. To update any content on the site, edit this file and push.

Exported arrays:
- `featuredProjects` — portfolio cards on the home page and Our Work page
- `reviews` — testimonials shown in the ReviewsCarousel
- `teamMembers` — bios on the About page
- `floorPlans` — all floor plan cards on the Floor Plans page
- `availableHomes` / `availableSites` — Available Homes page

### Floor Plans

Each floor plan in `floorPlans` has:
```ts
{
  name: string          // Display name
  homeType: string      // "Multi-Story" | "Single-Story"
  squareFeet: number
  bedrooms: number
  baths: number
  garageStalls: number
  image: string         // Path under /public — e.g. "/floor-plans/TheBloomPointe.jpg"
  planUrl: string       // URL to the actual floor plan page (external link). Empty string = no button shown.
}
```

- Multi-story rendering images live in `public/floor-plans/`
- Single-story plans currently use `/placeholders/image-coming-soon.svg` — replace with actual image paths when renderings are available
- The "View Floor Plan" button on each card only renders when `planUrl` is non-empty

### Contact Form

```
User submits ContactForm
  → POST /api/contact/route.ts
  → Zod validation
  → Insert row into Neon via Drizzle (db/schema.ts → contact_submissions table)
  → Send email via Resend to EMAIL_TO
```

### Database — Drizzle + Neon

Schema is in `db/schema.ts`. Single client exported from `db/client.ts`. Always import from there — never instantiate a new Neon/Drizzle client elsewhere.

```typescript
import { db } from '@/db/client'
```

---

## Route Structure

```
app/
  page.tsx                    ← Home (hero, projects, reviews)
  about/page.tsx              ← Team, Mission/Values, Process
  our-work/page.tsx           ← Full portfolio grid
  floor-plans/page.tsx        ← Floor plan cards by type
  available/page.tsx          ← Available homes and sites
  contact/page.tsx            ← Contact form (ConsultForm)
  gallery/page.tsx            ← Photo gallery
  api/contact/route.ts        ← Contact form POST handler

components/
  layout/
    Navbar.tsx                ← Sticky nav with mobile menu and More dropdown
    Footer.tsx
    PageChrome.tsx            ← Wraps all pages with nav + footer
  sections/
    ReviewsCarousel.tsx       ← Horizontally scrollable review cards
    ContactForm.tsx           ← Full contact/inquiry form
    ContactSection.tsx
    PortfolioFilterGrid.tsx   ← Filterable project grid
    TeamMemberBio.tsx
  motion/
    Reveal.tsx                ← Framer Motion scroll reveal wrapper

lib/
  site-data.ts                ← ALL editable content lives here
  analytics.ts
  email.ts

db/
  client.ts                   ← Single Drizzle/Neon client
  schema.ts                   ← Database schema (contact_submissions)
```

---

## Design System

The site uses a custom design system via CSS variables and Tailwind utilities defined in `app/globals.css`. Key classes:

- `btn-brand` — primary CTA button (dark navy, rounded-full)
- `section-shell` — standard page section padding and max-width
- `card-soft` — white card with subtle border and shadow

Brand color (`--color-brand`) is a deep navy (`#0f2f57`). Do not change it. All brand-colored elements use `text-brand`, `bg-brand`, `border-brand`, etc.

---

## Navbar

`Navbar.tsx` has two link arrays:
- `navLinks` — shown in the main nav bar: Home, About, Our Work, Floor Plans
- `secondaryLinks` — shown in the "More" dropdown: Houzz Gallery, Available

The "Let's connect!" button is a separate CTA always visible in the navbar, linking to `/contact`.

Do not add a Contact link to `navLinks` — there are already two ways to reach the contact page (the CTA button and direct URL).

---

## Pushing Code

From Cowork, run:
```bash
python3 /sessions/magical-wonderful-galileo/mnt/GitHub/github-push.py NorthCoveBuilders-Mockup "commit message"
```

Or push specific files only:
```bash
python3 /sessions/magical-wonderful-galileo/mnt/GitHub/github-push.py NorthCoveBuilders-Mockup "commit message" lib/site-data.ts
```

The script compares local files against the GitHub remote and only uploads what changed. Vercel auto-deploys on every push.

---

## Environment Variables

```
DATABASE_URL              ← Neon Postgres connection string (pooled)
RESEND_API_KEY            ← Resend API key
EMAIL_FROM                ← Verified sender, e.g. "North Cove Builders <hello@northcovebuilders.com>"
EMAIL_TO                  ← Recipient of contact form submissions
NEXT_PUBLIC_SITE_URL      ← Full site URL, e.g. https://northcovebuilders.com
```

---

## What Not To Do

- Do not add Clerk, Prisma, or Stripe to this project — it has no auth and no payments
- Do not create an admin panel or CMS — content changes go in `lib/site-data.ts`
- Do not hardcode content in page files — always add it to `site-data.ts` so it's easy to update
- Do not add inline styles — Tailwind and the design system classes only
- Do not add a Contact link to the main navbar — the "Let's connect!" button serves that purpose
- Do not show the "View Floor Plan" button for plans with an empty `planUrl` — the current code handles this correctly
- Do not upgrade to a different ORM — Drizzle is correct for this project (Prisma is for NGF-Systems-app only)
- Do not rename or restructure `lib/site-data.ts` — it is the single source of truth for all site content
