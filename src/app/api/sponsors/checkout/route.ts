import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { getDodo, SPONSOR_SLOT_METADATA_KEY } from '@/lib/dodo'
import { savePendingSponsor } from '@/lib/sponsors-store'
import { validateSubmission } from '@/lib/sponsor-validation'
import { findSiteLogo, inspectLogo } from '@/lib/site-logo'

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

  const { logo, ...rest } = validation.value
  // A logo from the dialog is re-checked here (and its fit decided here, not by the browser).
  // No logo yet (the preview hadn't finished): find it from their link.
  const found = logo
    ? await inspectLogo(logo).catch(() => null)
    : await findSiteLogo(rest.url).catch(() => null)
  if (logo && !found) {
    return NextResponse.json(
      { error: 'Couldn’t load that image. Try a different link.', field: 'logo' },
      { status: 400 },
    )
  }

  try {
    await savePendingSponsor(slotId, { ...rest, logo: found?.logo ?? '', logoFit: found?.fit ?? 'cover' })

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
