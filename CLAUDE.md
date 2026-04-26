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

All hardcoded fallbacks + static data live here. The NGF portal editor overrides these via `content['…']`, but when the DB has no value or the site is served outside