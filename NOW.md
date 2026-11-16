# Now — North Cove Builders (www.northcovebuilders.com)

_Last updated 2026-11-16. Overwrite, don't append; git keeps the history._

**Status:** Live. Production is `main` at `fc30d03` (2026-09-18, deploy-rule fix). Next is pinned to 16.3.5.

**Check first: the lead-email incident (found 2026-10-29).** From 2026-09-11 the site's own lead email (`lib/email.ts`, Resend) stopped sending, most likely because an email env var was missing in the deployed build; the form kept showing success. As of 2026-11-02 the NGF app's copy of each lead reached the client again, but the site's own email was still silent and needed the Vercel email env vars checked plus a redeploy. **Check whether this was fixed.** Don't assume either way, and don't send a test lead to find out (it emails the client). Leads from the silent period may still need following up.

**On GitHub, not merged:** `backup/pc-2026-11-09`, 10 commits (2026-09-19 and 2026-10-29): floor-plan pages in the sitemap, CSP baseline, canonical URLs to www, `/privacy`, a contact-form spam filter. It is Nick's local branch `claude/sitemap-dynamic-routes-csp-baseline`, backed up. Needs a PR, and reconciling with PR #4 (a second spam filter). Nick's call.

**Also open (from HANDOFF.md, June):** email and phone were made optional for the Parade of Homes; HANDOFF says revert about a week after the parade. Still wanted? The `/parade` page and first invoice listed there: still open?

**Open PRs:** #5 (first NOW.md; this branch builds on it), #4 (draft, honeypot spam filter), #1 (draft, Vercel bot, May: Web Analytics; the site already runs GA4 + Clarity).
