/**
 * Contact-form spam scoring.
 *
 * Tuned against the 45 most recent real submissions to this site (2026-10-29).
 * What actually arrives here is NOT classic bot link-spam — there was no
 * Cyrillic, no CJK and no BBCode in the sample at all. It is cold B2B sales
 * outreach, overwhelmingly one campaign selling virtual assistants, sent under
 * a different human name and company each time ("Hi, this is <name> with
 * <company>. Quick question, are you currently looking for help with…").
 * A honeypot and a rate limit catch none of that, so the real work is done by
 * the content signals below.
 *
 * Deliberately a pure function with no I/O: the route is thin and this is
 * probeable, so the scoring can be re-run over real payloads whenever the spam
 * changes shape (see scripts/verify-spam-filter.mjs).
 *
 * Asymmetry that drives every threshold here: a missed VA pitch costs an
 * annoying email, a false positive costs a custom-home enquiry worth six
 * figures. When in doubt this returns 'suspect' (which still delivers,
 * just flagged) rather than 'spam'.
 */

export type SpamVerdict = 'clean' | 'suspect' | 'spam'

export interface SpamResult {
  score: number
  verdict: SpamVerdict
  reasons: string[]
}

/** The project dropdowns a genuine build enquiry almost always touches. */
const PROJECT_FIELDS = ['hasLot', 'timeline', 'homeType', 'bedrooms', 'bathrooms', 'idealBudget'] as const

export interface SpamInput {
  name?: string
  email?: string
  phone?: string
  message?: string
  hasLot?: string
  timeline?: string
  homeType?: string
  bedrooms?: string
  bathrooms?: string
  idealBudget?: string
}

const URL_RE = /(https?:\/\/|www\.[a-z0-9-]+\.[a-z]{2,}|\b[a-z0-9-]+\.(?:com|net|io|co|ai|biz|info|xyz|link)\/)/i
const EMOJI_RE = /[←-⇿⌀-⏿☀-➿\u{1F000}-\u{1FAFF}]/u
const NAME_IS_PHONE_RE = /^[\d\s()+.-]{7,}$/

/**
 * The sender introducing themselves AND their company — the signature move of
 * cold outreach. A homeowner says what they want built; they do not open with
 * where they work.
 *   "I'm Chloe with VAs4Hire" / "this is Darlene with Trusted Virtual Team"
 *   "I run a small software company called Asterion Industries"
 */
const INTRO_PITCH_RES = [
  /\b(?:i'?m|i am|this is)\s+[a-z]+(?:\s+[a-z]+)?\s*,?\s+(?:with|from|at)\s+[a-z0-9]/i,
  /\bi\s+(?:run|own|lead|founded|started)\s+(?:a|an|my|the)\b/i,
  /\b(?:company|agency|firm|startup)\s+called\b/i,
  /\bwe(?:'re| are)\s+(?:a|an)\s+[a-z]+\s+(?:company|agency|firm|team|startup)\b/i,
]

/** Openers lifted verbatim from the campaign in the sample. */
const OPENER_RES = [
  /\bquick question\b/i,
  /are you (?:currently )?looking for help\b/i,
  /want the power of ai\b/i,
  /what if you had\b/i,
  /\bhand everything off\b/i,
  /\b(?:15|fifteen) minutes\b/i,
  /\bhop on a (?:quick )?call\b/i,
  /\bbook a (?:quick )?(?:call|demo|chat)\b/i,
  // "I see you build custom homes" — telling US what WE do is an outreach
  // tell; a customer says what THEY want. Deliberately excludes "saw" and
  // "your", because a real enquiry opens "I saw your Parade of Homes house".
  /\bi (?:see|noticed) (?:you|that you)\b/i,
]

/** Vocabulary that belongs to someone selling, not someone buying a house. */
const PITCH_WORDS = [
  'virtual assistant*', 'virtual team', 'vetted va*', 'va who', 'trained va*',
  'seo', 'backlink*', 'link building', 'guest post*', 'rank your', 'ranking',
  'digital marketing', 'web design service*', 'website audit', 'online reputation',
  'directory listing*', 'business profile', 'lead generation', 'leads for your',
  'cold email*', 'outreach', 'ai agent*', 'ai system', 'chatbot*', 'automation',
  'outsourc*', 'offshore', 'invoice*', 'invoicing', 'factoring', 'financing compan*',
  'cash flow', 'merchant', 'crypto', 'bitcoin', 'casino', 'unsubscribe',
  'no obligation', 'free trial', 'commission', 'white label', 'our team can',
  'we help business*', 'grow your business', 'scale your business', 'get paid faster',
]

/** Second-person framing: the sender is talking about the reader's company. */
const AT_YOU_WORDS = [
  'your business', 'your company', 'your website', 'your site', 'your profile',
  'your homepage', 'your home page', 'your reputation', 'your listing*',
  'your competitors', 'your revenue', 'your crew', 'your drivers',
  'your invoice*', 'your team', 'your back office', 'your sales',
]

/** Vocabulary of an actual home-building enquiry — pulls the score back down. */
const BUILD_WORDS = [
  'lot', 'lots', 'acre*', 'parcel', 'build', 'building', 'built', 'home',
  'homes', 'house', 'floor plan*', 'floorplan*', 'parade of homes', 'basement',
  'garage', 'bedroom*', 'bathroom*', 'square feet', 'sq ft', 'ranch', 'walkout',
  'budget', 'timeline', 'subdivision', 'remodel*', 'renovation*', 'quote',
  'estimate', 'land', 'property', 'custom home*', 'move in', 'blueprint*',
]

/**
 * Match a needle as a whole word. A trailing `*` means "prefix", for stems
 * like `outsourc*` that must cover outsource/outsourcing/outsourced.
 *
 * Whole-word matching matters more than it looks. With plain substring
 * matching "homepage" counts as "home" and "rebuilt" counts as "built", so a
 * pitch to rebuild our homepage scored as a home-building enquiry and talked
 * its own score back down to zero.
 */
const matches = (haystack: string, needle: string) => {
  const prefix = needle.endsWith('*')
  const core = (prefix ? needle.slice(0, -1) : needle).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp('\\b' + core + (prefix ? '' : '\\b'), 'i').test(haystack)
}

const countHits = (haystack: string, needles: string[]) =>
  needles.filter((w) => matches(haystack, w)).length

export function scoreSubmission(input: SpamInput): SpamResult {
  const name = (input.name ?? '').trim()
  const message = (input.message ?? '').trim()
  const lower = (name + ' ' + (input.email ?? '') + ' ' + message).toLowerCase()
  const msgLower = message.toLowerCase()

  const reasons: string[] = []
  let score = 0
  const add = (points: number, reason: string) => {
    score += points
    reasons.push(reason)
  }

  if (URL_RE.test(message) || URL_RE.test(name)) add(4, 'contains a link')

  const filled = PROJECT_FIELDS.filter((k) => (input[k] ?? '').trim()).length
  if (filled === 0) add(3, 'no project details selected')

  if (NAME_IS_PHONE_RE.test(name)) add(3, 'name field is a phone number')

  const intros = INTRO_PITCH_RES.filter((re) => re.test(message)).length
  if (intros) add(3, 'introduces a company')

  const openers = OPENER_RES.filter((re) => re.test(message)).length
  if (openers) add(3, `sales opener (${openers})`)

  if (EMOJI_RE.test(message)) add(2, 'emoji in message')

  const pitch = countHits(lower, PITCH_WORDS)
  if (pitch) add(Math.min(2 * pitch, 4), `pitch vocabulary (${pitch})`)

  const atYou = countHits(msgLower, AT_YOU_WORDS)
  if (atYou) add(Math.min(2 * atYou, 4), `addresses our business (${atYou})`)

  // An enquiry that talks about lots, plans and budgets is almost certainly
  // real even if it tripped something above — but ONLY if it doesn't also read
  // like outreach. A pitch that opens "I see you build custom homes" otherwise
  // earns this discount by quoting the trade back at us, which is exactly how
  // one real pitch in the sample talked its own score down to zero.
  const build = countHits(msgLower, BUILD_WORDS)
  const readsLikeOutreach = intros > 0 || openers > 0 || atYou > 0
  if (build >= 3 && !readsLikeOutreach) add(-Math.min(build, 3), `build vocabulary (${build})`)

  if (score < 0) score = 0

  const verdict: SpamVerdict = score >= 7 ? 'spam' : score >= 4 ? 'suspect' : 'clean'
  return { score, verdict, reasons }
}

/**
 * Hard bot checks. Unlike the score these are safe to reject outright: no
 * human can fill a field they cannot see, and no human completes this form in
 * under three seconds.
 *
 * `renderedAt` is the epoch ms the form mounted, echoed back by the client. It
 * is advisory — a determined sender can forge it — which is exactly why it
 * only ever gates the obvious case.
 */
export const MIN_FILL_MS = 3000

export function failsBotChecks(
  gotcha: unknown,
  renderedAt: unknown,
  now = Date.now(),
): string | null {
  if (typeof gotcha === 'string' && gotcha.trim() !== '') return 'honeypot filled'

  const started = typeof renderedAt === 'number' ? renderedAt : Number(renderedAt)
  if (Number.isFinite(started) && started > 0) {
    const elapsed = now - started
    // Only a suspiciously FAST submit is rejected. A clock-skewed or stale
    // timestamp (negative, or implausibly old) is ignored rather than trusted.
    if (elapsed >= 0 && elapsed < MIN_FILL_MS) return `submitted in ${elapsed}ms`
  }
  return null
}
