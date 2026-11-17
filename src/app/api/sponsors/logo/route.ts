import { NextRequest, NextResponse } from 'next/server'
import { normalizeUrl, resolveLogo } from '@/lib/sponsor-validation'
import { findSiteLogo, inspectLogo } from '@/lib/site-logo'

export const dynamic = 'force-dynamic'

const CACHE = { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' }

/**
 * Preview helper for the checkout dialog. Returns { logo, fit } or { logo: null }.
 *   ?url=site.com          find the logo for a site or profile link
 *   ?image=octocat|https…  check a logo the visitor picked themselves
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams

  if (params.has('image')) {
    const image = resolveLogo(params.get('image') ?? '')
    if (!image) return NextResponse.json({ logo: null }, { status: 400 })
    const found = await inspectLogo(image).catch(() => null)
    return NextResponse.json(found ?? { logo: null }, { headers: CACHE })
  }

  const url = normalizeUrl(params.get('url') ?? '')
  if (!url) return NextResponse.json({ logo: null }, { status: 400 })
  const found = await findSiteLogo(url).catch(() => null)
  return NextResponse.json(found ?? { logo: null }, { headers: CACHE })
}
