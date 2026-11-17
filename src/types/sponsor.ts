export interface Sponsor {
  id: string
  name: string
  logo: string
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
  /** Where the tile links to. Optional. */
  url?: string
  /** A GitHub username or an https image URL. */
  logo: string
  /** Optional one-liner shown on hover. */
  tagline?: string
}
