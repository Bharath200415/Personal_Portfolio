import { NextRequest, NextResponse } from 'next/server'
import { getDodo } from '@/lib/dodo'
import { confirmSponsorPayment } from '@/lib/sponsor-payments'
import { removeSponsorByPayment } from '@/lib/sponsors-store'

export const dynamic = 'force-dynamic'

// Dodo dashboard → Developer → Webhooks: point an endpoint at
// https://<your-domain>/api/webhooks/dodo and subscribe to payment.succeeded and refund.succeeded.
export async function POST(request: NextRequest) {
  if (!process.env.DODO_PAYMENTS_WEBHOOK_KEY) {
    return NextResponse.json({ error: 'Webhook key not configured' }, { status: 500 })
  }

  const rawBody = await request.text()

  let event
  try {
    event = getDodo().webhooks.unwrap(rawBody, {
      headers: {
        'webhook-id': request.headers.get('webhook-id') ?? '',
        'webhook-signature': request.headers.get('webhook-signature') ?? '',
        'webhook-timestamp': request.headers.get('webhook-timestamp') ?? '',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  try {
    switch (event.type) {
      case 'payment.succeeded': {
        const { slotId, result } = await confirmSponsorPayment(event.data)
        if (slotId) console.log(`Sponsor ${slotId}: ${result}`)
        break
      }
      case 'refund.succeeded':
        await removeSponsorByPayment(event.data.payment_id)
        break
    }
  } catch (error) {
    // A 5xx makes Dodo retry, which is what we want if Redis hiccuped.
    console.error('Failed to handle Dodo webhook:', error)
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
