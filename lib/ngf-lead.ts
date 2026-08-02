/**
 * Relay a form submission to the central NGF lead store.
 *
 * WHY: this site's form was email-only. If the notification failed to send, the
 * enquiry was gone — there was no record of it anywhere. The central store
 * persists the submission as the system of record and surfaces it in the
 * client's portal under "Form Submissions", where they can track and work it.
 *
 * Deliberately ADDITIVE: the site's existing validation, branded email and
 * success/error UX are unchanged. Call this first, then carry on. A relay
 * failure is logged and swallowed so it can never make the request worse than
 * it is today — the existing email still goes out.
 *
 * The endpoint resolves which client this is from the domain, so
 * NEXT_PUBLIC_SITE_URL must match `site_url` in the NGF admin (the same pairing
 * the content API relies on).
 */
export async function relayLeadToNgf(
  formType: string,
  payload: Record<string, unknown>,
): Promise<{ ok: boolean }> {
  try {
    const base = process.env.NGF_APP_URL || 'https://app.ngfsystems.com'
    const raw = process.env.NEXT_PUBLIC_SITE_URL || ''
    const domain = raw.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '')

    if (!domain) {
      console.error('[ngf-lead] NEXT_PUBLIC_SITE_URL is not set — lead not relayed to the portal')
      return { ok: false }
    }

    const res = await fetch(`${base}/api/public/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain, formType, payload }),
      // Never let a slow portal hold up the customer's submission: worst case
      // this adds 5s before the notification email is sent, then gives up.
      signal: AbortSignal.timeout(5000),
    })

    if (!res.ok) {
      console.error('[ngf-lead] relay rejected', { status: res.status, formType })
      return { ok: false }
    }
    return { ok: true }
  } catch (err) {
    console.error('[ngf-lead] relay failed (submission continues)', err)
    return { ok: false }
  }
}
