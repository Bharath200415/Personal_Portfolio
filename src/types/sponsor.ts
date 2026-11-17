/**
 * How a logo sits in its tile, decided on the server by looking at the image.
 * cover: opaque image, full-bleed. contain: transparent dark mark on a white plate.
 * contain-dark: transparent light mark on a dark plate.
 */
export type LogoFit = 'cover' | 'contain' | 'contain-dark'

export interface Sponsor {
  id: string
  name: string
  /** Image URL. Empty string falls back to a monogram tile. */
  logo: string
  logoFit?: LogoFit
  url?: string
  /** One short line shown under the name on hover. */
  tagline?: string
  github?: string
  twitter?: string
  amountUsd?: number
  /** ISO timestamp. Present on sponsors who came in through checkout. */
  createdAt?: string
}

/** What a visitor submits before being sent to checkout. */
export interface SponsorSubmission {
  name: string
  /** Their site or profile. The logo is found from this unless they override it. */
  url: string
  /** Optional override: a GitHub username or an https image URL. */
  logo?: string
  /** Optional one-liner shown on hover. */
  tagline?: string
}
