'use client'
import Script from 'next/script'
import { GA_MEASUREMENT_ID, CLARITY_PROJECT_ID } from '@/lib/analytics'

/**
 * GA4 + Microsoft Clarity, loaded for every visitor.
 *
 * North Cove is a US-only local business and is not subject to opt-in
 * cookie-consent rules: as of 2026 no US state requires prior consent before
 * non-essential cookies load, and Michigan has no comprehensive privacy law.
 * Both are disclosed by name in app/privacy/page.tsx section 2, which is linked
 * from the footer. That page is not optional: Google's and Microsoft's own
 * terms require a site running their analytics to post a policy disclosing the
 * cookies and the data collected. If either script is removed, trim that
 * section; if another tracker is added, disclose it there too.
 *
 * If this site is ever marketed to EU/EEA visitors, re-gate these scripts
 * behind consent (the shared CookieConsent component is still in the repo for
 * that, and already links to /privacy).
 */
export default function Analytics() {
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
