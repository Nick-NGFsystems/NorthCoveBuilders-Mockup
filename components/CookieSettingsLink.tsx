'use client'
import { resetCookieConsent } from '@/components/CookieConsent'

/**
 * "Cookie settings" control — clears the stored choice so the consent banner
 * returns.
 *
 * Required, not decorative: consent must be as easy to withdraw as it was to
 * give. Without this the banner appears exactly once and the visitor's first
 * click is permanent — no way to revoke analytics, no way to change their mind.
 *
 * Only rendered when the site actually loads cookie-based analytics, so a site
 * with no trackers doesn't show a control that does nothing.
 */
export default function CookieSettingsLink({ className = '' }: { className?: string }) {
  if (process.env.NEXT_PUBLIC_COOKIE_ANALYTICS !== '1') return null

  return (
    <button
      type="button"
      onClick={resetCookieConsent}
      className={className || 'underline underline-offset-2 hover:opacity-80'}
    >
      Cookie settings
    </button>
  )
}
