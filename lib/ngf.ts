export type NgfSiteContent = Record<string, string>

function getDomain() {
  return process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || 'localhost:3000'
}

export async function getNgfContent(): Promise<NgfSiteContent> {
  try {
    const domain = getDomain().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '')
    const url = `${process.env.NGF_APP_URL || 'https://app.ngfsystems.com'}/api/public/content?domain=${encodeURIComponent(domain)}`
    // ISR: cache content and revalidate on a 60s window so we don't hit the NGF
    // content API (and Neon) on every request. The NGF push handler busts this
    // instantly on publish via /api/revalidate (revalidatePath). If that ping
    // never lands, content still refreshes within 60s.
    // See NGF-STANDARDS.md -> "Content caching & revalidation".
    const res = await fetch(url, { next: { revalidate: 60 } })
    if (!res.ok) return {}
    const data = (await res.json()) as { content?: NgfSiteContent }
    return data.content ?? {}
  } catch {
    return {}
  }
}

/**
 * Extract a dynamic array of items from flat dot-notation content.
 * e.g. getItems(content, 'services.items') returns array of objects from keys like
 * 'services.items.0.name', 'services.items.1.name', etc.
 */
export function getItems(content: NgfSiteContent, prefix: string): Record<string, string>[] {
  const prefixDot = prefix + '.'
  const keys = Object.keys(content).filter(k => k.startsWith(prefixDot))
  if (keys.length === 0) return []

  const indices = new Set<number>()
  for (const key of keys) {
    const rest = key.slice(prefixDot.length)
    const idx = parseInt(rest.split('.')[0])
    if (!isNaN(idx)) indices.add(idx)
  }

  return Array.from(indices)
    .sort((a, b) => a - b)
    .map(i => {
      const itemPrefix = `${prefixDot}${i}.`
      const item: Record<string, string> = {}
      for (const key of keys) {
        if (key.startsWith(itemPrefix)) {
          item[key.slice(itemPrefix.length)] = content[key]
        }
      }
      return item
    })
}
