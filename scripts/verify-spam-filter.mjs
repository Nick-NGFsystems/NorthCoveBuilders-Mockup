/**
 * Gate for lib/spam-filter.ts.
 *
 *   node --experimental-strip-types scripts/verify-spam-filter.mjs
 *
 * The fixtures below are SYNTHETIC. They reproduce the shape of what this form
 * actually receives — measured against the 45 most recent real submissions on
 * 2026-10-29, where 17 were cold B2B outreach and 28 were genuine enquiries —
 * without committing a single real name, email or phone number to the repo.
 *
 * The one rule that must never regress: no genuine enquiry is ever scored
 * 'spam'. A missed pitch costs an annoying email; a false positive costs a
 * custom-home enquiry worth six figures.
 */
import { scoreSubmission, failsBotChecks, MIN_FILL_MS } from '../lib/spam-filter.ts'

const FULL = {
  hasLot: 'Yes', timeline: '6-12 months', homeType: 'Ranch',
  bedrooms: '4', bathrooms: '2.5', idealBudget: '$500k - $600k',
}
const NONE = {}

/** Genuine enquiries — every one of these MUST be deliverable. */
const REAL = [
  { label: 'parade of homes price question', name: 'Mindy W', ...FULL,
    message: "Good afternoon! We visited the Parade of Homes house on Erie Drive this fall and would like more information on the floor plan. Are you able to share an estimate of what that house's purchase price would be?" },
  { label: 'has a lot, wants a quote', name: 'Dan R', ...FULL,
    message: 'We own a lot in Hudsonville and are looking to build a ranch with a walkout basement. Can you give us a rough estimate and timeline?' },
  { label: 'short, no dropdowns', name: 'Karen T', ...NONE,
    message: 'Do you build on your own lots or can you build on land we already own?' },
  { label: 'terse but real', name: 'Mike', ...FULL, message: 'Interested in the Conway plan. Please call.' },
  { label: 'no message at all', name: 'Sarah Jennings', ...FULL, message: '' },
  { label: 'links a plan they like, no dropdowns', name: 'Priya S', ...NONE,
    message: 'Hi, we are hoping to build a 4 bedroom home next spring. Here is a floor plan we like: https://example.com/plan-we-like — could you quote something similar on our lot?' },
  { label: 'mentions our website politely', name: 'Tom B', ...FULL,
    message: 'I saw on your website that you build in Byron Center. We have a lot there and want to talk about a custom home with a 3 stall garage.' },
]

/** Cold outreach — the campaign actually hitting this form. */
const SPAM = [
  { label: 'VA pitch, "quick question"', name: 'Darlene D', ...NONE,
    message: 'Hi, this is Darlene with Trusted Virtual Team. Quick question, are you currently looking for help with admin work so you can focus on growing your business?' },
  { label: 'VA pitch, "power of AI"', name: 'Chloe P', ...NONE,
    message: "Hi, want the power of AI without having to learn it? I'm Chloe with VAs4Hire. We give you a trained VA who runs our custom AI system for your business." },
  { label: 'VA pitch, hand everything off', name: 'Michael W', ...NONE,
    message: "Hi, what if you had one person you could hand everything off to? I'm Michael with Virtual Ease. Our team can take your back office off your plate." },
  { label: 'emoji + booking link', name: 'JadeTrade Marketplace', ...NONE,
    message: '✨\u{1F680} are you looking to get more customers online? if so grab 15 minutes here: https://cal.com/jadetrade/15min' },
  { label: 'reputation/SEO pitch, name is a phone number', name: '(229) 999-9522', ...FULL,
    message: 'Hi team, After reviewing your business profile, online reputation, and directory listings, our team found several issues hurting your ranking. See the full website audit at https://example.net/audit' },
  { label: 'rebuild-your-homepage pitch quoting our trade', name: 'Sunny G', ...NONE,
    message: 'Hey, I see you build custom homes. I rebuilt your homepage as a live, working version — not a mockup. Take a look: https://example.io/demo' },
  { label: 'software company intro', name: 'Jonah H', ...NONE,
    message: 'Hello, I run a small software company called Asterion Industries. I found North Cove Builders and thought your team could use automation for your sales. https://example.com' },
  { label: 'invoice factoring', name: 'Jennifer S', ...FULL,
    message: 'Greedy financing companies have taken a cut of contractor profits for far too long. Our invoicing platform helps you get paid faster and fixes your cash flow. https://example.org/levelcore' },
]

let failures = 0
const fail = (msg) => { console.log('  FAIL ' + msg); failures++ }

console.log('=== genuine enquiries must never be dropped ===')
for (const c of REAL) {
  const { label, ...payload } = c
  const r = scoreSubmission(payload)
  if (r.verdict === 'spam') fail(`"${label}" was DROPPED (score ${r.score}: ${r.reasons.join(', ')})`)
  else console.log(`  ok   ${r.verdict.padEnd(7)} score ${String(r.score).padStart(2)}  ${label}`)
}

console.log('')
console.log('=== cold outreach should be caught (spam, or at least flagged) ===')
let dropped = 0
for (const c of SPAM) {
  const { label, ...payload } = c
  const r = scoreSubmission(payload)
  if (r.verdict === 'spam') dropped++
  if (r.verdict === 'clean') fail(`"${label}" scored CLEAN (${r.score}) — not even flagged`)
  else console.log(`  ok   ${r.verdict.padEnd(7)} score ${String(r.score).padStart(2)}  ${label}`)
}

console.log('')
console.log('=== bot checks ===')
if (failsBotChecks('i-am-a-bot', Date.now() - 60000) === null) fail('a filled honeypot was allowed')
else console.log('  ok   filled honeypot is rejected')

if (failsBotChecks('', Date.now() - 500) === null) fail(`a ${500}ms submit was allowed`)
else console.log(`  ok   sub-${MIN_FILL_MS}ms submit is rejected`)

if (failsBotChecks('', Date.now() - 60000) !== null) fail('a normal 60s submit was rejected')
else console.log('  ok   normal submit passes')

if (failsBotChecks('', undefined) !== null) fail('a missing timestamp was rejected')
else console.log('  ok   missing timestamp is tolerated (advisory only)')

if (failsBotChecks('', Date.now() + 90000) !== null) fail('a future timestamp was rejected')
else console.log('  ok   clock-skewed future timestamp is tolerated')

console.log('')
console.log(`dropped ${dropped}/${SPAM.length} outreach fixtures outright; the rest deliver flagged`)
console.log(failures === 0 ? 'PASS — no genuine enquiry dropped' : `FAILED with ${failures} problem(s)`)
process.exit(failures === 0 ? 0 : 1)
