import { lookup } from 'dns/promises'
import net from 'net'
import type { LogoFit } from '@/types/sponsor'

// Finds the best square logo for a sponsor's link. Server-only.
//
// The URL comes from a visitor, so every request (including each redirect hop) is checked
// against private / loopback / link-local addresses, with short timeouts and size caps.

export interface FoundLogo {
  logo: string
  fit: LogoFit
}

const TIMEOUT_MS = 4000
const MAX_HTML_BYTES = 512 * 1024
const MAX_MANIFEST_BYTES = 64 * 1024
const MAX_REDIRECTS = 3
const USER_AGENT = 'Mozilla/5.0 (compatible; SponsorLogoBot/1.0)'

const GITHUB_RESERVED = new Set([
  'orgs', 'sponsors', 'settings', 'features', 'about', 'pricing', 'marketplace', 'topics',
  'explore', 'login', 'join', 'enterprise', 'collections', 'trending', 'apps', 'readme',
])

function isPrivateIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split('.').map(Number)
    return (
      a === 0 || a === 10 || a === 127 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      a >= 224
    )
  }
  const v6 = ip.toLowerCase()
  if (v6.startsWith('::ffff:')) return isPrivateIp(v6.slice(7))
  return v6 === '::' || v6 === '::1' || v6.startsWith('fc') || v6.startsWith('fd') || v6.startsWith('fe80')
}

async function assertPublicUrl(url: URL) {
  if (url.protocol !== 'https:' && url.protocol !== 'http:') throw new Error('Unsupported protocol')
  const host = url.hostname.replace(/^\[|\]$/g, '')
  if (host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.internal')) {
    throw new Error('Blocked host')
  }
  const addresses = net.isIP(host) ? [{ address: host }] : await lookup(host, { all: true })
  if (addresses.length === 0 || addresses.some((a) => isPrivateIp(a.address))) {
    throw new Error('Blocked address')
  }
}

/** fetch() that re-checks the destination on every redirect hop. */
async function safeFetch(input: string, accept: string): Promise<Response> {
  let url = new URL(input)
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    await assertPublicUrl(url)
    const res = await fetch(url, {
      redirect: 'manual',
      headers: { 'User-Agent': USER_AGENT, Accept: accept },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    const location = res.headers.get('location')
    if (res.status >= 300 && res.status < 400 && location) {
      url = new URL(location, url)
      continue
    }
    return res
  }
  throw new Error('Too many redirects')
}

async function readCapped(res: Response, maxBytes: number): Promise<string> {
  if (!res.body) return ''
  const reader = res.body.getReader()
  const chunks: Uint8Array[] = []
  let total = 0
  while (total < maxBytes) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
    total += value.byteLength
  }
  reader.cancel().catch(() => {})
  return new TextDecoder().decode(Buffer.concat(chunks).subarray(0, maxBytes))
}

function parseAttrs(tag: string): Record<string, string> {
  const attrs: Record<string, string> = {}
  for (const m of tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
    attrs[m[1].toLowerCase()] = m[2] ?? m[3] ?? m[4] ?? ''
  }
  return attrs
}

/** Largest dimension in a sizes attribute ("16x16 32x32", "any"). */
function sizeScore(sizes: string | undefined, href: string, type?: string): number {
  if (type === 'image/svg+xml' || /\.svg(\?|$)/i.test(href) || sizes === 'any') return 512
  const nums = (sizes ?? '').match(/\d+/g)?.map(Number) ?? []
  return nums.length ? Math.max(...nums) : 0
}

interface Candidate {
  href: string
  score: number
  fit: LogoFit
}

/** github.com/user → avatar, x.com/user → profile picture. Null if not a profile link. */
function profileLogo(url: URL): FoundLogo | null {
  const host = url.hostname.replace(/^www\./, '')
  const [first, ...rest] = url.pathname.split('/').filter(Boolean)
  if (!first || rest.length > 1) return null

  if (host === 'github.com' && /^[a-z\d-]{1,39}$/i.test(first) && !GITHUB_RESERVED.has(first.toLowerCase())) {
    return { logo: `https://github.com/${first}.png?size=200`, fit: 'cover' }
  }
  if ((host === 'x.com' || host === 'twitter.com') && /^\w{1,15}$/.test(first)) {
    return { logo: `https://unavatar.io/x/${first}`, fit: 'cover' }
  }
  return null
}

async function manifestCandidates(manifestUrl: URL): Promise<Candidate[]> {
  try {
    const res = await safeFetch(manifestUrl.toString(), 'application/manifest+json,application/json')
    if (!res.ok) return []
    const manifest = JSON.parse(await readCapped(res, MAX_MANIFEST_BYTES)) as {
      icons?: { src?: string; sizes?: string; type?: string; purpose?: string }[]
    }
    return (manifest.icons ?? [])
      .filter((icon) => icon.src)
      .map((icon) => {
        const href = new URL(icon.src!, manifestUrl).toString()
        // Maskable icons are designed full-bleed; others usually have their own padding.
        const fit: LogoFit = icon.purpose?.includes('maskable') ? 'cover' : 'contain'
        return { href, score: sizeScore(icon.sizes, href, icon.type), fit }
      })
  } catch {
    return []
  }
}

async function readBytesCapped(res: Response, maxBytes: number): Promise<Buffer> {
  if (!res.body) return Buffer.alloc(0)
  const reader = res.body.getReader()
  const chunks: Uint8Array[] = []
  let total = 0
  while (total < maxBytes) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
    total += value.byteLength
  }
  reader.cancel().catch(() => {})
  return Buffer.concat(chunks)
}

/**
 * Looks at the pixels to decide how the logo should sit in a tile.
 * Opaque → full-bleed. Transparent → padded on a plate that contrasts with the mark.
 * Returns `fallback` for formats sharp can't read (e.g. .ico).
 */
async function chooseFit(bytes: Buffer, fallback: LogoFit): Promise<LogoFit> {
  try {
    const sharp = (await import('sharp')).default
    const { data, info } = await sharp(bytes, { density: 72 })
      .resize(48, 48, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })

    let transparent = 0
    let weight = 0
    let luminance = 0
    for (let i = 0; i < data.length; i += info.channels) {
      const alpha = data[i + 3] / 255
      if (alpha < 0.95) transparent++
      if (alpha > 0.1) {
        luminance += alpha * (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2])
        weight += alpha
      }
    }
    const pixels = data.length / info.channels
    if (transparent / pixels < 0.04) return 'cover'
    if (weight === 0) return 'contain'
    return luminance / weight / 255 > 0.7 ? 'contain-dark' : 'contain'
  } catch {
    return fallback
  }
}

const MAX_IMAGE_BYTES = 2 * 1024 * 1024

/** Fetches an image and returns its fit, or null if it isn't a reachable image. */
async function inspectImage(href: string, fallback: LogoFit): Promise<LogoFit | null> {
  try {
    const res = await safeFetch(href, 'image/*')
    const type = res.headers.get('content-type') ?? ''
    if (!res.ok || !type.startsWith('image/')) {
      res.body?.cancel().catch(() => {})
      return null
    }
    return chooseFit(await readBytesCapped(res, MAX_IMAGE_BYTES), fallback)
  } catch {
    return null
  }
}

/** For a logo the visitor picked themselves. Null if it can't be loaded as an image. */
export async function inspectLogo(href: string): Promise<FoundLogo | null> {
  if (/^https:\/\/github\.com\/[^/]+\.png/i.test(href)) return { logo: href, fit: 'cover' }
  const fit = await inspectImage(href, 'cover')
  return fit ? { logo: href, fit } : null
}

/** Returns the best logo for a site or profile link, or null if nothing usable was found. */
export async function findSiteLogo(link: string): Promise<FoundLogo | null> {
  let url: URL
  try {
    url = new URL(link)
  } catch {
    return null
  }

  const profile = profileLogo(url)
  if (profile) return profile

  const candidates: Candidate[] = []
  let pageUrl = url

  try {
    const res = await safeFetch(url.toString(), 'text/html,application/xhtml+xml')
    if (res.ok && (res.headers.get('content-type') ?? '').includes('html')) {
      if (res.url) pageUrl = new URL(res.url)
      const html = await readCapped(res, MAX_HTML_BYTES)

      let manifestHref: string | null = null
      for (const [tag] of html.matchAll(/<link\b[^>]*>/gi)) {
        const attrs = parseAttrs(tag)
        const rel = (attrs.rel ?? '').toLowerCase().split(/\s+/)
        if (!attrs.href) continue
        const href = new URL(attrs.href, pageUrl).toString()

        if (rel.includes('apple-touch-icon') || rel.includes('apple-touch-icon-precomposed')) {
          // Apple touch icons are opaque squares made to be shown as tiles.
          candidates.push({ href, score: Math.max(sizeScore(attrs.sizes, href), 180) + 1000, fit: 'cover' })
        } else if (rel.includes('icon')) {
          candidates.push({ href, score: sizeScore(attrs.sizes, href, attrs.type) || 32, fit: 'contain' })
        } else if (rel.includes('manifest')) {
          manifestHref = href
        }
      }
      if (manifestHref) candidates.push(...(await manifestCandidates(new URL(manifestHref))))
    }
  } catch {
    // Unreachable page: fall through to the conventional paths below.
  }

  const origin = pageUrl.origin
  candidates.push(
    { href: `${origin}/apple-touch-icon.png`, score: 1, fit: 'cover' },
    { href: `${origin}/favicon.ico`, score: 0, fit: 'contain' },
  )

  // Highest quality first; only https so tiles never trigger mixed-content warnings.
  const seen = new Set<string>()
  const ordered = candidates
    .filter((c) => c.href.startsWith('https://') && !seen.has(c.href) && seen.add(c.href))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)

  for (const candidate of ordered) {
    const fit = await inspectImage(candidate.href, candidate.fit)
    if (fit) return { logo: candidate.href, fit }
  }
  return null
}
