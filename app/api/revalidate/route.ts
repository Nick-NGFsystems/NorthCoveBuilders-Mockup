import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

// Busts the cached content the instant the client publishes from the NGF portal.
// The portal's push handler calls:
//   GET https://<this-site>/api/revalidate?secret=<WEBSITE_REVALIDATION_SECRET>
// revalidatePath('/', 'layout') refreshes every page (all share the root layout),
// so getNgfContent() re-fetches fresh content on the next request. If the secret
// is unset/mismatched this 401s and the site still refreshes within 60s via ISR.
// revalidatePath has a stable signature across Next 15 and 16 (revalidateTag does not).
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (!process.env.WEBSITE_REVALIDATION_SECRET || secret !== process.env.WEBSITE_REVALIDATION_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }
  revalidatePath('/', 'layout')
  return NextResponse.json({ ok: true, revalidated: true })
}
