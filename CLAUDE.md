# CLAUDE.md — North Cove Builders Website

This file provides guidance to AI when working on this repository. For universal NGFsystems standards (bridge contract, data-ngf-* attribute rules, postMessage protocol) see the root [NGF-Systems-app/CLAUDE.md](https://github.com/Nick-NGFsystems/NGF-Systems-app/blob/main/CLAUDE.md).

---

## What This Project Is

A marketing website for North Cove Builders, a custom home builder in West Michigan. This is a **client site** managed by NGFsystems — deployed as its own Vercel project, separate from the NGF main app. It has no admin panel and no user authentication. Its only server-side logic is a contact form submission and content fetching from the NGF portal.

Content management flows:

- **Hardcoded defaults** in `lib/site-data.ts` — used when the NGF portal has no saved content (new clients, or fields that were never edited).
- **Live NGF portal content** fetched at SSR time via `getNgfContent()` → flat dot-notation map like `content['hero.headline']`. Every editable element on the page reads `content['key'] || fallback`.
- **Edit mode** — when the site is loaded inside the NGF portal editor's iframe, `NgfEditBridge` intercepts clicks on any `[data-ngf-field]` element and opens the portal's edit popover for that field.

---

## Stack

| Layer | Tool | Version |
|---|---|---|
| Framework | Next.js App Router | 16.1.6 |
| Runtime | React | 19.2.x |
| Language | TypeScript | always |
| Styling | Tailwind CSS | 4.x |
| Database | Neon (PostgreSQL) | serverless driver |
| ORM | Drizzle | 0.45+ |
| Email | Resend | latest |
| Animations | Framer Motion | 12.x |
| Validation | Zod | 4.x |
| Deployment | Vercel | — |

**This project intentionally deviates from the NGF main app stack.** The NGF main app (`NGF-Systems-app`) is pinned to Next.js 15.3.8 / React 18 / Prisma 5 / Tailwind 3 for Clerk v6 compatibility. Client marketing sites use the latest stable Next/React/Tailwind. Do not assume NGF main app rules apply here.

---

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run db:generate  # Generate Drizzle migration files
npm run db:migrate   # Run migrations against Neon
```

---

## NGF Portal Editor Integration

The site is connected to the NGF portal at `app.ngfsystems.com`. The portal can discover every editable element by scraping the live site's HTML — **there is no schema file to maintain on either side**. See root `NGF-Systems-app/CLAUDE.md` for the full bridge + scraper architecture.

### `lib/ngf.ts`

Two exports, used by every page:

- `getNgfContent(): Promise<NgfSiteContent>` — server-side fetch at SSR time. Resolves the domain from `NEXT_PUBLIC_SITE_URL` → `VERCEL_PROJECT_PRODUCTION_URL` → `localhost:3000`, calls `${NGF_APP_URL}/api/public/content?domain=<domain>`, returns the flat dot-notation map. `cache: 'no-store'` so pages always get fresh content. Never throws — returns `{}` on any error.
- `getItems(content, prefix)` — extracts a repeatable array from flat keys. `getItems(content, 'services.items')` scans for every `services.items.N.*` key, returns `[{ name: '…', price: '…' }, …]`.

### Usage pattern (every page)

```tsx
const content = await getNgfContent()
const headline = content['hero.headline'] || 'Build the home you\'ve always dreamed of.'
const projects = getItems(content, 'projects.featured')
const display  = projects.length > 0 ? projects : featuredProjects
```

Always use `||` (not `??`). Published content may contain explicit empty strings; `??` only catches `null`/`undefined` so an empty value would render empty instead of falling through to the hardcoded default.

### Self-describing markup

Every editable element needs four attributes:

```tsx
<h1
  data-ngf-field="hero.headline"
  data-ngf-label="Headline"
  data-ngf-type="text"
  data-ngf-section="Hero"
>
  {headline}
</h1>
```

Field types: `text` | `textarea` | `color` | `image` | `toggle`.

For **image** fields, use a plain `<img>` (not `next/image` with `fill` — the bridge needs to read/write `src` directly on the underlying element):

```tsx
<img
  src={content['hero.image'] || '/projects/001.jpg'}
  data-ngf-field="hero.image"
  data-ngf-label="Hero Background Image"
  data-ngf-type="image"
  data-ngf-section="Hero"
  className="absolute inset-0 h-full w-full object-cover"
/>
```

For **repeatable groups** (add/remove cards from the editor sidebar), put the group attributes on the container:

```tsx
<div
  data-ngf-group="projects.featured"
  data-ngf-item-label="Featured Project"
  data-ngf-min-items="0"
  data-ngf-max-items="6"
  data-ngf-item-fields='[{"key":"image","label":"Project Image","type":"image"},{"key":"name","label":"Project Name","type":"text"}]'
>
  {featuredProjects.map((p, i) => (
    <article key={i}>
      <img
        src={content[`projects.featured.${i}.image`] || p.image}
        data-ngf-field={`projects.featured.${i}.image`}
        data-ngf-label="Project Image"
        data-ngf-type="image"
        data-ngf-section="Projects"
      />
      <h3
        data-ngf-field={`projects.featured.${i}.name`}
        data-ngf-label="Project Name"
        data-ngf-type="text"
        data-ngf-section="Projects"
      >
        {content[`projects.featured.${i}.name`] || p.name}
      </h3>
    </article>
  ))}
</div>
```

For fields with no visible element (e.g. brand colors), use an `sr-only` span with the current value inside so the scraper picks it up:

```tsx
<span
  data-ngf-field="brand.businessName"
  data-ngf-label="Business Name"
  data-ngf-type="text"
  data-ngf-section="Brand"
  aria-hidden="true"
  className="sr-only"
>
  {businessName}
</span>
```

### `components/NgfEditBridge.tsx`

Mounted in `app/layout.tsx`. Handles all communication with the portal editor iframe: captures default values on load, intercepts click-to-edit, handles repeatable-group add/remove/reorder messages. **Do not remove, and do not modify without syncing the same change to other client sites (WrenchTime, future sites).** The bridge contract is documented in full in the root NGF app CLAUDE.md — any change here must match.

### CSP — required in `next.config.ts`

The portal editor loads this site inside an iframe. Without the right `frame-ancestors` header, the browser blocks embedding:

```typescript
{
  key: 'Content-Security-Policy',
  value: "frame-ancestors 'self' https://app.ngfsystems.com https://*.vercel.app"
}
```

Already set — do not regress.

---

## Content — `lib/site-data.ts`

All hardcoded fallbacks + static data live here. The NGF portal editor overrides these via `content['…']`, but when the DB has no value or the site is served outside the portal, these are what renders.

Exported arrays:

- `featuredProjects` — portfolio cards on the home page and Our Work page
- `reviews` — testimonials shown in `ReviewsCarousel`
- `teamMembers` — bios on the About page
- `floorPlans` — Floor Plans page (`Multi-Story` + `Single-Story`)
- `availableHomes` / `availableSites` — Available page

### Floor Plans

Each plan has:
```ts
{
  name: string          // Display name
  homeType: string      // "Multi-Story" | "Single-Story"
  squareFeet: number
  bedrooms: number
  baths: number
  garageStalls: number
  image: string         // Path under /public — e.g. "/floor-plans/TheBloomPointe.jpg"
  planUrl: string       // External link. Empty string = no button shown.
}
```

The "View Floor Plan" button on each card only renders when `planUrl` is non-empty.

---

## Contact Form

```
User submits ContactForm
  → POST /api/contact/route.ts
  → Zod validation
  → Insert row into Neon via Drizzle (db/schema.ts → contact_submissions table)
  → Send email via Resend to EMAIL_TO
```

Schema is in `db/schema.ts`. Single Drizzle client exported from `db/client.ts` — always import from there, never instantiate another.

---

## Route Structure

```
app/
  layout.tsx                  ← Wraps all pages, mounts NgfEditBridge, fetches content once
  page.tsx                    ← Home (hero, about, projects, reviews)
  about/page.tsx              ← Team, Mission/Values, Process (6 editable steps)
  our-work/page.tsx           ← Full portfolio grid with category filter
  floor-plans/page.tsx        ← Floor plan cards by type
  floor-plans/[slug]/page.tsx ← Individual floor plan detail
  available/page.tsx          ← Available homes and sites
  contact/page.tsx            ← Contact form
  gallery/page.tsx            ← Houzz gallery link page
  api/contact/route.ts        ← Contact form POST handler

components/
  NgfEditBridge.tsx           ← Portal editor integration — do not remove
  layout/
    Navbar.tsx                ← Sticky nav, mobile menu, "More" dropdown
    Footer.tsx
    PageChrome.tsx            ← Wraps pages with nav + footer, threads content prop
  sections/
    ReviewsCarousel.tsx       ← Horizontally scrollable review cards (client component)
    ContactForm.tsx           ← Contact/inquiry form (client component)
    ContactSection.tsx        ← Contact block shown on every page except /contact
    PortfolioFilterGrid.tsx   ← Filterable project grid (client component)
    TeamMemberBio.tsx         ← Expandable team bio (client component)
  motion/
    Reveal.tsx                ← Framer Motion scroll reveal wrapper

lib/
  site-data.ts                ← Hardcoded content fallbacks + static plan/review/team data
  ngf.ts                      ← getNgfContent(), getItems() — NGF portal content fetch
  analytics.ts
  email.ts

db/
  client.ts                   ← Single Drizzle/Neon client
  schema.ts                   ← Database schema (contact_submissions)
```

---

## Design System

The site uses Tailwind 4 + CSS variables in `app/globals.css`. Key utility classes:

- `btn-brand` — primary CTA button (brand navy, rounded-full)
- `section-shell` — standard page section padding and max-width
- `card-soft` — white card with subtle border and shadow
- `text-brand`, `bg-brand`, `border-brand` — use these instead of hex literals for the brand navy (`#0f2f57`)

---

## Navbar

`Navbar.tsx` has two link arrays:

- `navLinks` — main nav bar: Home, About, Our Work, Floor Plans
- `secondaryLinks` — "More" dropdown: Houzz Gallery, Available

The "Let's connect!" button is a separate CTA always visible, linking to `/contact`. Do not add a Contact link to `navLinks` — the CTA button covers it.

In edit mode the bridge lets the site's own React state handle dropdown toggles (aria-haspopup/aria-expanded), so clicking the "More" button opens the menu naturally and clicking inside opens the edit popover for that link's text.

---

## Environment Variables

```
DATABASE_URL              ← Neon Postgres connection string (pooled)
RESEND_API_KEY            ← Resend API key
EMAIL_FROM                ← Verified sender, e.g. "North Cove Builders <hello@northcovebuilders.com>"
EMAIL_TO                  ← Recipient of contact form submissions
NEXT_PUBLIC_SITE_URL      ← Full site URL, e.g. https://northcovebuilders.com — MUST match client_configs.site_url in NGF
NGF_APP_URL               ← Optional. Defaults to https://app.ngfsystems.com
```

`NEXT_PUBLIC_SITE_URL` is critical. The NGF public content API matches by normalized domain — if this env var doesn't match `client_configs.site_url` exactly (case, `www.`, trailing slash all normalized away), the site renders only hardcoded defaults.

---

## Pushing Code

Use the portable `github-push.py` (resolves the repo dynamically — no hardcoded session path):

```bash
python3 github-push.py NorthCoveBuilders-Mockup "commit message"
```

Or from inside a Cowork session, if you've set `NGF_REPOS_ROOT` or the repo is at a standard location, any recent `github-push.py` from this machine's `~/GitHub/` will work.

---

## Known Gaps / Integration Checklist

Things that are shipped but **not verified end-to-end**, or known rough edges. Skim before starting a multi-hour session.

| Area | Status | Notes |
|---|---|---|
| Bridge version | ⚠️ May lag | `components/NgfEditBridge.tsx` must match the reference in `NGF-Systems-app` root CLAUDE.md. Bridge updates are synced by hand across client sites — if you change the editor's postMessage contract, propagate here and to WrenchTime-Cycles. Currently supports: `setEditMode`, `contentUpdate` (text + image routing via `dataset.ngfDefault`), `scrollToField`, `addGroupItem`, `removeGroupItem`, `moveGroupItem`. |
| `<select><option>` editing | ❌ Not supported | Native browser UI; the bridge can't intercept. Contact form dropdowns have editable labels but the option values are fixed in source. |
| Multi-story floor plan images | ✅ Present | `public/floor-plans/*.jpg` |
| Single-story floor plan images | ⚠️ Placeholder | Still using `/placeholders/image-coming-soon.svg`. Replace per-plan when renderings are available. |
| `planUrl` for all plans | ⚠️ Some empty | Plans with empty `planUrl` correctly suppress the "View Floor Plan" button — double-check when adding a new plan. |
| `reviews` / `featuredProjects` / `teamMembers` annotations | ✅ Editable | All three render inside `data-ngf-group` containers; clients can add/remove/reorder from the editor sidebar. |
| CSP frame-ancestors | ✅ Set | Removing it breaks the portal editor's iframe preview. Do not remove. |

**When finishing a session, add or update an entry here for anything you committed but couldn't verify live.** Saves the next agent the audit-from-scratch round-trip.

---

## What Not To Do

- Do not add Clerk, Prisma, or Stripe to this project — it has no auth and no payments (the NGF main app handles all that separately)
- Do not create an admin panel or CMS in this repo — content editing happens through the NGF portal
- Do not hardcode content inline in page files for new content — add to `site-data.ts` as the fallback AND read from `content['key'] || fallback` so the portal can override it
- Do not use `next/image` with `fill` for fields that need to be editable as images — the bridge needs a plain `<img>` to read/write `src` directly
- Do not use `??` instead of `||` for content fallbacks — published content may contain `''` which `??` doesn't catch, so the empty value would render instead of the hardcoded default
- Do not remove `NgfEditBridge` from `app/layout.tsx` — the portal editor breaks without it
- Do not remove the CSP `frame-ancestors` header in `next.config.ts` — the editor iframe breaks without it
- Do not change the bridge contract in isolation — every change must be synced to all client sites (see Known Gaps table)
- Do not add inline styles — Tailwind and the design system classes only
- Do not add a Contact link to the main navbar — the "Let's connect!" button covers it
- Do not upgrade to a different ORM — Drizzle is correct for this project; Prisma is for NGF-Systems-app only
- Do not rename or restructure `lib/site-data.ts` — it's the hardcoded-fallback source of truth
- Do not omit any of `data-ngf-field`, `data-ngf-label`, `data-ngf-type`, `data-ngf-section` on an editable element — the scraper silently drops fields missing label or section
