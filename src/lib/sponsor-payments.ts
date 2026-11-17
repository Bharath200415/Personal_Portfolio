import type { Payment } from 'dodopayments/resources/payments'
import { SPONSOR_SLOT_METADATA_KEY } from '@/lib/dodo'
import { promoteSponsor, type PromoteResult } from '@/lib/sponsors-store'

/**
 * Puts the tile tied to a payment on the wall, if the payment went through.
 * The slot comes from the payment's own metadata (set server-side at checkout),
 * never from the URL, so one payment can only ever unlock its own tile.
 */
export async function confirmSponsorPayment(
  payment: Pick<Payment, 'payment_id' | 'status' | 'metadata' | 'total_amount' | 'currency'>,
): Promise<{ slotId: string | null; result: PromoteResult | 'not-paid' | 'not-a-sponsorship' }> {
  const raw = payment.metadata?.[SPONSOR_SLOT_METADATA_KEY]
  const slotId = typeof raw === 'string' && raw.startsWith('sp_') ? raw : null
  if (!slotId) return { slotId: null, result: 'not-a-sponsorship' }
  if (payment.status !== 'succeeded') return { slotId, result: 'not-paid' }

  const amountUsd = payment.currency === 'USD' ? payment.total_amount / 100 : undefined
  const result = await promoteSponsor(slotId, { paymentId: payment.payment_id, amountUsd })
  return { slotId, result }
}
