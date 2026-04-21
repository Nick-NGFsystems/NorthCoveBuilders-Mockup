# North Cove Builders Website

Modern, conversion-focused marketing website for North Cove Builders (Hudsonville, Michigan), built with Next.js App Router and TypeScript.

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion (scroll-triggered reveal animations)
- Neon PostgreSQL
- Drizzle ORM
- Resend (email notifications)
- Vercel deployment target

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Copy env template and fill values:

```bash
cp .env.example .env.local
```

3. Run development server:

```bash
npm run dev
```

## Environment Variables

- `DATABASE_URL` - Neon Postgres connection string
- `RESEND_API_KEY` - Resend API key
- `EMAIL_FROM` - verified sender (example: `North Cove Builders <hello@yourdomain.com>`)
- `EMAIL_TO` - lead recipient email
- `NEXT_PUBLIC_SITE_URL` - site URL for environment

## Database (Drizzle)

- Generate migration files:

```bash
npm run db:generate
```

- Run migrations:

```bash
npm run db:migrate
```

Schema is defined in `db/schema.ts`.

## Contact Form Flow

1. User submits form from any page.
2. Request posts to `app/api/contact/route.ts`.
3. Submission is validated with Zod.
4. Row is inserted into Neon via Drizzle.
5. Notification email is sent via Resend.

## Deployment

This repository is ready for Vercel deployment. Configure project environment variables in Vercel before production release.
