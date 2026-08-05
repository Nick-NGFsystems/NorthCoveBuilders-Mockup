'use client'
import Script from 'next/script'
import { hasCookieConsent } from '@/components/CookieConsent'
import { GA_MEASUREMENT_ID, CLARITY_PROJECT_ID } from '@/lib/analytics'

/**
 * GA4 + Microsoft Clarity, gated behind cookie consent.
 *
 * WHY THIS IS A CLIENT COMPONENT: both trackers set cookies, so neither may load
 * until the visitor has actively accepted. Consent lives in localStorage, which a
 * server component cannot read — these scripts were previously rendered
 * unconditionally in app/layout.tsx, so they ran for every visitor before any
 * choice was made.
 *
 * hasCookieConsent() returns false during SSR, so nothing is emitted server-side.
 * CookieConsent reloads the page on Accept, which is what makes this re-evaluate.
 *
 * The banner only renders when NEXT_PUBLIC_COOKIE_ANALYTICS=1, so that env var
 * must be set in Vercel alongside the GA/Clarity IDs — without it consent can
 * never be granted and analytics will never load at all.
 */
export default function Analytics() {
  if (!hasCookieConsent()) return null

  return (
    <>
      {GA_MEASUREMENT_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
          </Script>
        </>
      )}

      {CLARITY_PROJECT_ID && (
        <Script id="clarity-init" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
          `}
        </Script>
      )}
    </>
  )
}
