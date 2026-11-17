import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import DiagonalPattern from '@/components/DiagonalPattern'
import PageNavigation from '@/components/Navigation'
import NeumorphButton from '@/components/NeumorphButton'
import { SponsorLogo } from '@/components/sponsors/SponsorTile'
import { tileFrame } from '@/components/sponsors/tile-styles'
import { getDodo } from '@/lib/dodo'
import { confirmSponsorPayment } from '@/lib/sponsor-payments'
import { getWallSponsor } from '@/lib/sponsors-store'
import { cn } from '@/lib/utils'
import type { Sponsor } from '@/types/sponsor'

export const dynamic = 'force-dynamic'
export const metadata = {
  title: 'Thank you | Bharath',
  robots: { index: false },
}

type Outcome =
  | { kind: 'success'; sponsor: Sponsor | null }
  | { kind: 'processing' }
  | { kind: 'failed' }

// Dodo redirects here with ?payment_id=…&status=…. We re-check the payment with Dodo
// instead of trusting the query string; the webhook does the same thing independently.
async function resolveOutcome(paymentId: string | undefined): Promise<Outcome> {
  if (!paymentId) return { kind: 'failed' }
  try {
    const payment = await getDodo().payments.retrieve(paymentId)
    if (payment.status === 'processing' || payment.status === 'requires_customer_action') {
      return { kind: 'processing' }
    }
    const { slotId, result } = await confirmSponsorPayment(payment)
    if (!slotId || result === 'not-paid' || result === 'not-a-sponsorship') return { kind: 'failed' }
    return { kind: 'success', sponsor: await getWallSponsor(slotId) }
  } catch (error) {
    console.error('Failed to confirm sponsor payment:', error)
    return { kind: 'processing' }
  }
}

const COPY = {
  success: {
    title: 'You’re on the wall',
    body: 'Thank you for backing what I build. Your tile is live on the homepage now, and it’s staying there.',
  },
  processing: {
    title: 'Almost there',
    body: 'Your payment is still being confirmed. Your tile will show up on its own as soon as it clears, usually within a few minutes.',
  },
  failed: {
    title: 'That didn’t go through',
    body: 'The payment wasn’t completed, so nothing was charged. You can try again whenever you like.',
  },
}

export default async function SponsorThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ payment_id?: string }>
}) {
  const { payment_id } = await searchParams
  const outcome = await resolveOutcome(payment_id)
  const copy = COPY[outcome.kind]
  const sponsor = outcome.kind === 'success' ? outcome.sponsor : null

  return (
    <div className="relative min-h-screen" style={{ fontFamily: 'var(--font-hk-grotesk)' }}>
      <div className="relative mx-auto min-h-screen max-w-4xl">
        <DiagonalPattern side="left" />
        <DiagonalPattern side="right" />

        <div className="mx-auto w-full max-w-4xl sm:w-[calc(100%-120px)]">
          <div className="px-4 pt-4 sm:px-16 sm:pt-6">
            <PageNavigation />
          </div>

          <div className="px-4 pb-28 pt-16 sm:px-16 sm:pt-24">
            {sponsor && (
              <span className={cn(tileFrame, 'mb-8 bg-neutral-50 dark:bg-neutral-900')}>
                <span className="block size-full overflow-hidden rounded-[inherit]">
                  <SponsorLogo src={sponsor.logo} name={sponsor.name} fit={sponsor.logoFit} />
                </span>
              </span>
            )}

            <h1 className="font-[family-name:var(--font-instrument-serif)] text-3xl italic tracking-tight text-neutral-900 sm:text-4xl dark:text-neutral-100">
              {copy.title}
            </h1>
            <p className="mt-3 max-w-[44ch] text-base leading-[1.75] text-neutral-500 text-pretty sm:text-lg dark:text-neutral-400">
              {copy.body}
            </p>

            <div className="mt-8">
              <Link href="/#sponsors">
                <NeumorphButton className="group inline-flex items-center gap-1.5 px-4 py-2 text-sm text-neutral-800 hover:text-neutral-900 dark:text-white/80 dark:hover:text-white">
                  <span>{outcome.kind === 'failed' ? 'Back to sponsors' : 'See the wall'}</span>
                  <ArrowRight
                    className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5"
                    strokeWidth={2}
                    aria-hidden
                  />
                </NeumorphButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
