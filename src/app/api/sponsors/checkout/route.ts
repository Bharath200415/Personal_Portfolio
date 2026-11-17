import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { getDodo, SPONSOR_SLOT_METADATA_KEY } from '@/lib/dodo'
import { savePendingSponsor } from '@/lib/sponsors-store'
import { validateSubmission } from '@/lib/sponsor-validation'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const productId = process.env.DODO_SPONSOR_PRODUCT_ID
  if (!productId || !process.env.DODO_PAYMENTS_API_KEY) {
    return NextResponse.json({ error: 'Sponsorships aren’t open yet. Check back soon.' }, { status: 503 })
  }

  const body = await request.json().catch(() => null)
  const validation = validateSubmission(body ?? {})
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error, field: validation.field }, { status: 400 })
  }

  const slotId = `sp_${randomUUID().replace(/-/g, '').slice(0, 20)}`
  const siteUrl = (process.env.SITE_URL || request.nextUrl.origin).replace(/\/$/, '')

  try {
    await savePendingSponsor(slotId, validation.value)

    const session = await getDodo().checkoutSessions.create({
      product_cart: [{ product_id: productId, quantity: 1 }],
      metadata: { [SPONSOR_SLOT_METADATA_KEY]: slotId },
      return_url: `${siteUrl}/sponsors/thanks`,
      cancel_url: `${siteUrl}/#sponsors`,
    })

    if (!session.checkout_url) throw new Error('Dodo returned no checkout_url')
    return NextResponse.json({ checkoutUrl: session.checkout_url })
  } catch (error) {
    console.error('Failed to create sponsor checkout:', error)
    return NextResponse.json(
      { error: 'Couldn’t start checkout. Try again in a minute.' },
      { status: 502 },
    )
  }
}
