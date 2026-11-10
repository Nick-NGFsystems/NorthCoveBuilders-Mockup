# Now — North Cove Builders (www.northcovebuilders.com)

_Last updated 2026-11-09. Overwrite, don't append; git keeps the history._

**Status:** Live. Production serves `main` at `fc30d03` (2026-09-18, deploy-rule fix); Next is pinned to 16.3.5 since PR #2. The contact form has no spam filter on `main`, and email and phone are still optional from the Parade of Homes change in May (`86f0ddc`). HANDOFF.md says to revert that about a week after the parade. Is it still wanted?

**Only on Nick's PC:** local branch `claude/sitemap-dynamic-routes-csp-baseline`, 8 commits never pushed:
- Sep 19: privacy policy page, canonical URLs to www, Next 16.3.5 env.
- Oct 29: contact-form cold-outreach spam filter and field length caps.

Not on GitHub as of 2026-11-09. If the PC is lost, so are they.

**Next (Nick, on the PC):** `git push origin claude/sitemap-dynamic-routes-csp-baseline:backup/pc-2026-11-09`. Then reconcile its spam filter with PR #4's honeypot and 3-second minimum-time filter (opened 2026-10-23, draft, **not merged**). Both change the contact form. Also check the Next 16.3.5 commit against `main`, which already pins 16.3.5.

**Also open:**
- PR #1 (Vercel bot, May): Vercel Web Analytics. The site already runs GA4 and Clarity. Merge or close?
- HANDOFF.md (June 5) lists the first $100 invoice and a `/parade` page as pending. Are they still open?

**Open PRs:** #4 (draft, spam filter), #1 (draft, Vercel Web Analytics).
