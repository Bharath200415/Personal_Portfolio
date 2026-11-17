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

/** Accepts "site.com", "https://site.com/x". Returns a full https URL or null. */
export function normalizeUrl(input: string): string | null {
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

export interface ValidSubmission {
  name: string
  url: string
  /** Present only when the visitor picked a logo themselves (or the dialog already found one). */
  logo?: string
  tagline?: string
}

export type ValidationResult =
  | { ok: true; value: ValidSubmission }
  | { ok: false; field: keyof SponsorSubmission; error: string }

export function validateSubmission(input: Partial<SponsorSubmission>): ValidationResult {
  const name = (input.name ?? '').trim().replace(/\s+/g, ' ')
  if (!name) return { ok: false, field: 'name', error: 'Add a name for your tile.' }
  if (name.length > SPONSOR_NAME_MAX) {
    return { ok: false, field: 'name', error: `Keep it under ${SPONSOR_NAME_MAX} characters.` }
  }

  if (!input.url?.trim()) {
    return { ok: false, field: 'url', error: 'Add your website or a profile link.' }
  }
  const url = normalizeUrl(input.url)
  if (!url) return { ok: false, field: 'url', error: 'That link doesn’t look right.' }

  let logo: string | undefined
  if (input.logo?.trim()) {
    const resolved = resolveLogo(input.logo)
    if (!resolved) {
      return { ok: false, field: 'logo', error: 'Use a GitHub username or an https:// image link.' }
    }
    logo = resolved
  }

  const tagline = (input.tagline ?? '').trim().replace(/\s+/g, ' ') || undefined
  if (tagline && tagline.length > SPONSOR_TAGLINE_MAX) {
    return { ok: false, field: 'tagline', error: `Keep it under ${SPONSOR_TAGLINE_MAX} characters.` }
  }

  return { ok: true, value: { name, url, logo, tagline } }
}
