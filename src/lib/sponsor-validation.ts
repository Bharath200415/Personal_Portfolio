import type { SponsorSubmission } from '@/types/sponsor'

// Shared by the checkout dialog (live preview) and the checkout API (enforcement).

const GITHUB_HANDLE = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i

export const SPONSOR_NAME_MAX = 40
export const SPONSOR_TAGLINE_MAX = 48

/** Turns "octocat", "@octocat" or an https image URL into a src. Returns null if neither. */
export function resolveLogo(input: string): string | null {
  const value = input.trim()
  if (!value) return null

  if (/^https:\/\//i.test(value)) {
    try {
      const url = new URL(value)
      return value.length <= 500 ? url.toString() : null
    } catch {
      return null
    }
  }

  const handle = value.replace(/^@/, '').replace(/^(?:https?:\/\/)?github\.com\//i, '').replace(/\/$/, '')
  return GITHUB_HANDLE.test(handle) ? `https://github.com/${handle}.png?size=200` : null
}

function normalizeUrl(input: string): string | null {
  const value = input.trim()
  if (!value) return null
  const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`
  try {
    const url = new URL(withScheme)
    if (!url.hostname.includes('.') || withScheme.length > 200) return null
    return url.toString()
  } catch {
    return null
  }
}

export type ValidationResult =
  | { ok: true; value: { name: string; url?: string; logo: string; tagline?: string } }
  | { ok: false; field: keyof SponsorSubmission; error: string }

export function validateSubmission(input: Partial<SponsorSubmission>): ValidationResult {
  const name = (input.name ?? '').trim().replace(/\s+/g, ' ')
  if (!name) return { ok: false, field: 'name', error: 'Add a name for your tile.' }
  if (name.length > SPONSOR_NAME_MAX) {
    return { ok: false, field: 'name', error: `Keep it under ${SPONSOR_NAME_MAX} characters.` }
  }

  const logo = resolveLogo(input.logo ?? '')
  if (!logo) {
    return { ok: false, field: 'logo', error: 'Use a GitHub username or an https:// image link.' }
  }

  const tagline = (input.tagline ?? '').trim().replace(/\s+/g, ' ') || undefined
  if (tagline && tagline.length > SPONSOR_TAGLINE_MAX) {
    return { ok: false, field: 'tagline', error: `Keep it under ${SPONSOR_TAGLINE_MAX} characters.` }
  }

  let url: string | undefined
  if (input.url && input.url.trim()) {
    const normalized = normalizeUrl(input.url)
    if (!normalized) return { ok: false, field: 'url', error: 'That link doesn’t look right.' }
    url = normalized
  }

  return { ok: true, value: { name, url, logo, tagline } }
}
