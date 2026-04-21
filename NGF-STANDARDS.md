# NGFsystems — Universal Project Standards

## HOW TO USE
Paste this at the start of any new Claude chat before starting a project.
Say: "I'm starting a new NGFsystems project. Follow these standards for everything we build."

---

## HOW WE WORK — TWO AI SYSTEM

NGFsystems projects are built using a two-AI workflow:

**You (Claude on claude.ai)** — the strategic AI. You plan features, make architecture decisions, debug issues, write messages to send to the other AI, and maintain the big picture. You do not directly edit code files.

**The Codespace AI (GitHub Copilot or another Claude instance inside the GitHub Codespace)** — the execution AI. It has full access to the codebase, can read and write files, run terminal commands, execute builds, run migrations, and make direct changes to the project.

### How the workflow operates:
- Nick pastes your instructions into the Codespace AI and pastes its responses back to you
- You write precise, detailed instructions for the Codespace AI to execute
- The Codespace AI reports back what it did, what files it changed, and any errors
- You interpret the results and decide the next step
- When debugging, you ask the Codespace AI to run specific commands and report exact output

### How to write instructions for the Codespace AI:
- Be specific — include exact file paths, exact code blocks, exact commands to run
- Always ask it to verify changes with `cat filename` after writing
- Always ask it to run `npm run build` or a targeted error check after significant changes
- If something fails, ask for the exact error output before suggesting a fix
- Reference this standards file when needed — the Codespace AI should follow all the same rules

### What to say to Nick when ready:
Frame your message as something Nick can copy and paste directly into the Codespace AI. For example:
> "Send this to the other AI: [your instructions]"

---

## WHO WE ARE
NGFsystems is a web development company that builds and manages websites and web applications for small business clients. Every project — whether a client website, internal tool, or the NGFsystems SaaS platform — follows these standards exactly.

---

## TECH STACK — ALWAYS USE THESE, NOTHING ELSE

| Layer | Tool | Version |
|-------|------|---------|
| Framework | Next.js App Router | 15.3.8 exactly |
| Runtime | React | 18.x |
| Language | TypeScript | always, never plain JS |
| Styling | Tailwind CSS | 3.x |
| Database | Neon (PostgreSQL) | latest |
| ORM | Prisma | 5.x |
| Auth | Clerk | @clerk/nextjs@6 |
| Payments | Stripe | latest |
| Deployment | Vercel | — |
| Version Control | GitHub | — |

### Critical Version Rules
- Next.js: always 15.3.8 — never 16+
- React: always 18.x — never 19+
- Prisma: always 5.x — never 6+
- Clerk: always @clerk/nextjs@6 — never @latest (v7 has breaking JWT changes)
- Never use Turbopack under any circumstances
- Never use `npx prisma` — always `./node_modules/.bin/prisma`

---

## DESIGN SYSTEM — Apple-Inspired Refined Minimalism

Every NGFsystems project follows this design language:

### Visual Style
(These styles are only if there isn't already existing styles or new custom mentioned styles) 
- Light theme — white and off-white backgrounds (bg-white, bg-gray-50)
- Dark primary text — text-gray-900, text-slate-900
- Single accent color — blue-600
- Subtle depth — shadow-sm, rounded-xl, border border-gray-100
- Generous whitespace
- No heavy gradients, no purple, nothing generic or AI-looking

### Typography
- Font: font-sans with tight tracking on headings
- Clean hierarchy — bold headings, normal weight body
- Never use Inter, Roboto, or Arial as a deliberate choice

### Layout
- Cards with subtle shadow and border for content sections
- Stat cards in responsive grids
- Clean empty states with a title and subtext
- Navigation: logo left, links center/right, user button far right

### Responsive Design — Non-Negotiable
- Mobile-first always — write mobile layout first, scale up with md: and lg:
- Must work at: 375px (mobile), 768px (tablet), 1280px (desktop)
- Navbars: hamburger menu on mobile, full horizontal nav on desktop
- Grids: grid-cols-1 by default, expand on larger screens
- Touch targets minimum 44px tall on mobile
- Never fixed pixel widths on containers — use max-w- with w-full

### Code Rules
- Tailwind CSS classes only — never inline styles
- Never write custom CSS files for component styling
- TypeScript interfaces for all component props — no `any` types
- Use "use client" only when strictly necessary (event handlers, hooks, browser APIs)
- Default to server components

---

## PROJECT ARCHITECTURE

### Standard App Structure
```
app/
  (admin)/        — admin-only routes
  (auth)/         — sign-in, sign-up
  (portal)/       — client-only routes
  layout.tsx      — root layout with ClerkProvider
  page.tsx        — landing page
  redirect/       — role-based redirect after sign-in
  unauthorized/   — shown when wrong role tries to access a route
  api/
    admin/        — admin API routes
    portal/       — client portal API routes
    webhooks/     — Stripe and Clerk webhooks

components/
  ui/             — generic reusable elements
  layout/         — navbars, layouts, shared structure
  admin/          — admin-specific components
  portal/         — portal-specific components

lib/
  db.ts           — single Prisma instance
  auth.ts         — Clerk auth helpers
  stripe.ts       — single Stripe instance
  utils.ts        — shared utilities

prisma/
  schema.prisma   — single source of truth for all tables

types/
  index.ts        — all TypeScript interfaces
```

### Route Naming Rules
- Admin routes: `/admin/dashboard`, `/admin/clients`, etc.
- Portal routes: always prefix with `portal-` → `/portal/portal-dashboard`, `/portal/portal-invoices`
- Never name portal routes the same as admin routes — causes Next.js conflicts
- Every route group folder must have a `layout.tsx` file

---

## AUTH — CLERK

### Setup Rules
- Always pin to @clerk/nextjs@6 — never use @latest
- Customize session token on every Clerk instance: Configure → Sessions → Customize session token → add `{ "metadata": "{{user.public_metadata}}" }`
- User roles stored in Clerk publicMetadata as `{ "role": "admin" }` or `{ "role": "client" }`
- After setting a role, user must sign out and back in for it to take effect
- Layout components must NEVER do auth checks — middleware handles everything

### Standard Middleware Pattern
```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/', '/sign-in(.*)', '/sign-up(.*)', '/unauthorized(.*)', '/redirect'
])

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return NextResponse.next()
  const { sessionClaims } = await auth()
  if (!sessionClaims) return NextResponse.redirect(new URL('/sign-in', req.url))
  const role = (sessionClaims?.metadata as { role?: string })?.role
  const path = req.nextUrl.pathname
  if (path.startsWith('/admin') && role !== 'admin')
    return NextResponse.redirect(new URL('/unauthorized', req.url))
  if (path.startsWith('/portal') && role !== 'client')
    return NextResponse.redirect(new URL('/unauthorized', req.url))
  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next|static|favicon\\.ico|api/webhooks|_clerk).*)']
}
```

---

## DATABASE — PRISMA + NEON

### Rules
- Single Prisma instance — always `import { db } from '@/lib/db'`
- Never instantiate PrismaClient anywhere else
- Always use local binary: `./node_modules/.bin/prisma migrate dev`
- Never use `npx prisma` — it pulls Prisma 7 globally and breaks migrations
- Schema changes go in `/prisma/schema.prisma` only
- Multi-tenant apps: always filter portal queries by client_id at the Prisma level — never in JavaScript

### Standard db.ts
```typescript
import { PrismaClient } from '@prisma/client'
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
export const db = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

### Standard datasource block
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

---

## API ROUTES

- Admin API routes → `/app/api/admin/` — always check `role === "admin"` first
- Portal API routes → `/app/api/portal/` — always check `role === "client"` first
- Always wrap in try/catch
- Always return consistent JSON:
```typescript
// Success
return NextResponse.json({ success: true, data: result })
// Error
return NextResponse.json({ success: false, error: "message" }, { status: 400 })
```

---

## NEXT.JS CONFIG — STANDARD

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '*.app.github.dev'],
    },
  },
}
module.exports = nextConfig
```

Remove the experimental block for production Vercel deployments.

---

## TSCONFIG — REQUIRED

Must include in compilerOptions or route group pages will silently 404:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

## TAILWIND — REQUIRED SETUP

**tailwind.config.ts:**
```typescript
import type { Config } from 'tailwindcss'
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: { extend: {} },
  plugins: [],
}
export default config
```

**app/globals.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**app/layout.tsx must import globals.css at the top.**

---

## ABSOLUTE RULES — NEVER BREAK

1. TypeScript only — never .js files
2. One Prisma instance — always import { db } from @/lib/db
3. Tailwind only — never inline styles, never custom CSS for components
4. No auth checks in layout components — middleware handles all auth
5. Never install new libraries without asking first
6. Never use Turbopack
7. Never install @clerk/nextjs@latest — always pin to v6
8. Never install Next.js 16+ — always use 15.3.8
9. Never use npx prisma — always ./node_modules/.bin/prisma
10. Portal routes must have portal- prefix
11. Every route group folder must have a layout.tsx
12. tsconfig.json must have baseUrl and paths or route groups 404
13. Mobile-first responsive — every page must work at all screen sizes
14. Never report a file as updated without actually writing to it — always verify with cat
15. Never use `any` in TypeScript
16. Never duplicate components, functions, or layouts — always check if it exists first
17. Never make database calls from client components
18. Never hardcode keys, secrets, or connection strings — always use environment variables
19. Never build desktop-only UI — mobile is equally important

---

## KNOWN ISSUES & FIXES (reference when debugging)

| Issue | Fix |
|-------|-----|
| Route group pages silently 404 | Check tsconfig.json for baseUrl and paths |
| Clerk v7 JWT format broken | Pin to @clerk/nextjs@6 |
| Role not appearing in sessionClaims | Customize Clerk session token with {{user.public_metadata}} |
| Role change not working | User must sign out and back in |
| Hydration error on navbar active links | Extract active link logic into a "use client" NavLink component |
| Server Actions invalid in Codespaces | Add allowedOrigins to next.config.js experimental.serverActions |
| Prisma pulling v7 | Use ./node_modules/.bin/prisma, never npx prisma |
| needs_client_trust Clerk error | Codespaces-only issue — works fine on Vercel production |

---

## WORKFLOW — HOW WE BUILD

1. Check if any part of the feature already exists before writing anything
2. Check if any existing component or utility can be reused
3. Update prisma/schema.prisma first if new data is needed
4. Run migration: `./node_modules/.bin/prisma migrate dev --name description`
5. Build the API route second
6. Build the UI component last
7. Verify every file with `cat` after writing — never trust that it was written correctly
8. Run `npm run build` to confirm no TypeScript errors before committing
9. Commit with a descriptive message: `git add -A && git commit -m "feat: description"`

---

## DEPLOYMENT CHECKLIST (Vercel)

Before deploying:
- Framework Preset must be set to Next.js
- All environment variables added to Vercel Settings → Environment Variables:
  - DATABASE_URL, DIRECT_URL
  - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY, CLERK_WEBHOOK_SECRET
  - NEXT_PUBLIC_CLERK_SIGN_IN_URL, NEXT_PUBLIC_CLERK_SIGN_UP_URL
  - NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL, NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL
  - STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET
- Clerk production instance must have session token customized
- Clerk production instance domain must be verified
- Custom domain DNS records must be configured in registrar