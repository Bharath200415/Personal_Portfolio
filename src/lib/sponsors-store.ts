import { Redis } from '@upstash/redis'
import type { Sponsor } from '@/types/sponsor'

// Redis layout
//   sponsors:pending:{slotId}   JSON of the submitted tile, expires if never paid
//   sponsors:wall               hash slotId -> JSON Sponsor (paid, shown on the site)
//   sponsors:payment:{paymentId} slotId, so refunds can take a tile down

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const WALL = 'sponsors:wall'
const pendingKey = (slotId: string) => `sponsors:pending:${slotId}`
const paymentKey = (paymentId: string) => `sponsors:payment:${paymentId}`

// Checkout sessions live 24h; leave room for slow payment methods and webhook retries.
const PENDING_TTL_SECONDS = 60 * 60 * 24 * 7

type PendingSponsor = Pick<Sponsor, 'name' | 'url' | 'logo' | 'logoFit' | 'tagline'>

function parse<T>(value: unknown): T | null {
  if (value == null) return null
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T
    } catch {
      return null
    }
  }
  return value as T
}

export async function savePendingSponsor(slotId: string, sponsor: PendingSponsor) {
  await redis.set(pendingKey(slotId), JSON.stringify(sponsor), { ex: PENDING_TTL_SECONDS })
}

export type PromoteResult = 'added' | 'already-added' | 'missing'

/**
 * Moves a paid tile onto the wall. Safe to call more than once for the same slot
 * (the webhook and the return page can both land here).
 */
export async function promoteSponsor(
  slotId: string,
  payment: { paymentId: string; amountUsd?: number },
): Promise<PromoteResult> {
  if (await redis.hexists(WALL, slotId)) return 'already-added'

  const pending = parse<PendingSponsor>(await redis.get(pendingKey(slotId)))
  if (!pending) return 'missing'

  const sponsor: Sponsor = {
    id: slotId,
    name: pending.name,
    logo: pending.logo,
    logoFit: pending.logoFit,
    url: pending.url,
    tagline: pending.tagline,
    amountUsd: payment.amountUsd,
    createdAt: new Date().toISOString(),
  }

  const added = await redis.hsetnx(WALL, slotId, JSON.stringify(sponsor))
  if (!added) return 'already-added'

  await Promise.all([
    redis.set(paymentKey(payment.paymentId), slotId),
    redis.del(pendingKey(slotId)),
  ])
  return 'added'
}

export async function getWallSponsor(slotId: string): Promise<Sponsor | null> {
  return parse<Sponsor>(await redis.hget(WALL, slotId))
}

export async function removeSponsorByPayment(paymentId: string) {
  const slotId = await redis.get<string>(paymentKey(paymentId))
  if (!slotId) return
  await Promise.all([redis.hdel(WALL, String(slotId)), redis.del(paymentKey(paymentId))])
}

/** Paid sponsors, oldest first so early supporters keep their spot. */
export async function listWallSponsors(): Promise<Sponsor[]> {
  const all = await redis.hgetall<Record<string, unknown>>(WALL)
  if (!all) return []
  return Object.values(all)
    .map((v) => parse<Sponsor>(v))
    .filter((s): s is Sponsor => !!s)
    .sort((a, b) => (a.createdAt ?? '').localeCompare(b.createdAt ?? ''))
}
