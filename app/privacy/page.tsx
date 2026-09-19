import type { Metadata } from "next";
import Link from "next/link";
import { getNgfContent } from "@/lib/ngf";
import { GA_MEASUREMENT_ID, CLARITY_PROJECT_ID } from "@/lib/analytics";

// ─────────────────────────────────────────────────────────────────────────────
// Adapted from the NGF starter template (scripts/sync-ngf.mjs mode 'once').
// Differences from the starter copy, all deliberate:
//   - No SiteHeader/footer of its own. PageChrome in app/layout.tsx already
//     wraps every route in Navbar + ContactSection + Footer.
//   - The analytics section names GA4 and Microsoft Clarity outright, because
//     this site loads both for every visitor with no consent gate. That is what
//     components/Analytics.tsx points at when it says use is disclosed here,
//     and what Google's and Microsoft's terms require a site to post.
//   - Legal copy is intentionally NOT portal-editable. Only the contact details
//     read from NGF content, using the same keys as /contact, so the two can
//     never disagree.
//
// ⚠️  Template, not legal advice. North Cove is the data controller and owns the
// final policy; this should get an attorney's read before it is relied on.
// Revisit it whenever the site starts collecting something new — accounts, SMS,
// payments, e-commerce — or is marketed to EU/EEA visitors (which would also
// mean re-gating the analytics scripts behind consent).
// ─────────────────────────────────────────────────────────────────────────────

const LAST_UPDATED = "September 2026";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How North Cove Builders collects, uses, and protects information from visitors to this website, including the analytics and cookies this site uses.",
};

export default async function PrivacyPage() {
  const content = await getNgfContent();

  const phone = content["contactPage.phone"] || "(616) 682-7422";
  const email = content["contactPage.email"] || "northcovebuilders@gmail.com";
  const address = content["contactPage.address"] || "6147 N. Cove Court, Hudsonville, MI 49426";

  return (
    <section className="section-shell !pt-40 md:!pt-[8.5rem]">
      <p className="text-sm font-semibold uppercase tracking-[0.15em] text-brand">Legal</p>
      <h1 className="mt-3 text-3xl text-brand sm:text-4xl md:text-5xl">Privacy Policy</h1>
      <p className="mt-3 text-sm text-foreground/60">Last updated: {LAST_UPDATED}</p>

      <div className="mt-10 max-w-3xl space-y-10 text-base leading-8 text-foreground/70">
        <p>
          This policy explains how <strong className="font-semibold text-foreground">North Cove Builders</strong>{" "}
          (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;) collects, uses, and protects information when you
          visit northcovebuilders.com or contact us through it. We collect only what we need to answer you and to run
          the site.
        </p>

        <section>
          <h2 className="text-xl text-brand sm:text-2xl">1. Information we collect</h2>
          <p className="mt-3">
            <strong className="font-semibold text-foreground">Information you give us.</strong> When you submit the
            contact form, we collect what you enter: your name, email address, phone number, whether you already own a
            lot, your timeline, the type of home you have in mind, bedroom and bathroom counts, your ideal budget, and
            your message. Every field except name, email, and phone is optional.
          </p>
          <p className="mt-3">
            <strong className="font-semibold text-foreground">Information collected automatically.</strong> Like most
            websites, we collect basic technical and usage data through our host and the analytics tools described
            below &mdash; your IP address, browser and device type, the pages you view, how you interact with them, and
            the site or search that sent you here.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-brand sm:text-2xl">2. Analytics and cookies</h2>
          <p className="mt-3">
            Cookies are small files a site stores on your device. This site uses cookies that are needed for it to
            function, and analytics cookies from the two services below. Both load for every visitor as soon as the page
            does; this site does not show a cookie banner and does not ask for consent first.
          </p>
          <ul className="mt-4 list-disc space-y-3 pl-5">
            <li>
              <strong className="font-semibold text-foreground">Google Analytics 4</strong>
              {GA_MEASUREMENT_ID ? ` (measurement ID ${GA_MEASUREMENT_ID})` : ""} &mdash; measures how many people visit,
              which pages they read, and where they arrived from. It sets cookies and shares this data with Google. See{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noreferrer"
                className="text-brand underline underline-offset-4 hover:text-brand-strong"
              >
                Google&rsquo;s privacy policy
              </a>
              . You can opt out of Google Analytics on every site you visit with{" "}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noreferrer"
                className="text-brand underline underline-offset-4 hover:text-brand-strong"
              >
                Google&rsquo;s browser add-on
              </a>
              .
            </li>
            <li>
              <strong className="font-semibold text-foreground">Microsoft Clarity</strong>
              {CLARITY_PROJECT_ID ? ` (project ID ${CLARITY_PROJECT_ID})` : ""} &mdash; shows us how pages are actually
              used. Clarity records your interactions with the site &mdash; clicks, scrolling, and mouse or touch
              movement &mdash; and reconstructs them as session replays and heatmaps. It sets cookies and processes this
              data on Microsoft&rsquo;s systems. See{" "}
              <a
                href="https://privacy.microsoft.com/privacystatement"
                target="_blank"
                rel="noreferrer"
                className="text-brand underline underline-offset-4 hover:text-brand-strong"
              >
                Microsoft&rsquo;s privacy statement
              </a>
              .
            </li>
          </ul>
          <p className="mt-4">
            We use both only to understand and improve the site. You can block or delete cookies at any time through
            your browser settings, which will stop these tools from recognizing you; blocking cookies may affect how
            parts of the site work.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-brand sm:text-2xl">3. How we use your information</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>To respond to your inquiry and to discuss and provide the services you ask about.</li>
            <li>To operate, maintain, and improve this website.</li>
            <li>To keep records of the conversations and requests we receive.</li>
          </ul>
          <p className="mt-3">
            We do <strong className="font-semibold text-foreground">not</strong> sell your personal information, and we
            do not use it for advertising.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-brand sm:text-2xl">4. How your information is stored and shared</h2>
          <p className="mt-3">
            We use trusted service providers to run this site and handle submissions on our behalf. They may process
            your information only to provide those services to us:
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>
              <strong className="font-semibold text-foreground">Website and form processing</strong> &mdash; NGF Systems,
              which stores form submissions and notifies us.
            </li>
            <li>
              <strong className="font-semibold text-foreground">Email delivery</strong> &mdash; Resend, used to email us
              your submission.
            </li>
            <li>
              <strong className="font-semibold text-foreground">Website hosting</strong> &mdash; Vercel.
            </li>
            <li>
              <strong className="font-semibold text-foreground">Analytics</strong> &mdash; Google and Microsoft, as
              described in section 2.
            </li>
          </ul>
          <p className="mt-3">We may also disclose information if required by law or to protect our rights.</p>
        </section>

        <section>
          <h2 className="text-xl text-brand sm:text-2xl">5. Data retention</h2>
          <p className="mt-3">
            We keep form submissions for as long as we need them to respond to you and for our ordinary business
            records, then delete or anonymize them. Analytics data is retained according to Google&rsquo;s and
            Microsoft&rsquo;s own retention schedules.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-brand sm:text-2xl">6. Your choices and rights</h2>
          <p className="mt-3">
            You may ask us to access, correct, or delete the personal information you have given us. Depending on where
            you live, you may have additional rights under laws such as the California Consumer Privacy Act
            (CCPA/CPRA). To make a request, contact us using the details below. We do not sell your personal
            information.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-brand sm:text-2xl">7. Children&rsquo;s privacy</h2>
          <p className="mt-3">
            This site is not directed to children under 13, and we do not knowingly collect personal information from
            them.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-brand sm:text-2xl">8. Changes to this policy</h2>
          <p className="mt-3">
            We may update this policy from time to time. When we do, we will revise the &ldquo;Last updated&rdquo; date
            at the top of this page.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-brand sm:text-2xl">9. Contact us</h2>
          <p className="mt-3">
            Questions about this policy or about the information we hold? Reach North Cove Builders at{" "}
            <a
              href="mailto:northcovebuilders@gmail.com"
              className="text-brand underline underline-offset-4 hover:text-brand-strong"
            >
              {email}
            </a>{" "}
            or{" "}
            <a href="tel:+16166827422" className="text-brand underline underline-offset-4 hover:text-brand-strong">
              {phone}
            </a>
            .
          </p>
          <p className="mt-1">{address}</p>
        </section>
      </div>

      <div className="mt-12 max-w-3xl border-t border-black/10 pt-6">
        <Link href="/" className="text-sm font-semibold text-brand hover:text-brand-strong hover:underline">
          &larr; Back to home
        </Link>
      </div>
    </section>
  );
}
