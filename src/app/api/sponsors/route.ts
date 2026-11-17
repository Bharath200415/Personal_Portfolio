import { NextResponse } from 'next/server'
import { listWallSponsors } from '@/lib/sponsors-store'

export const dynamic = 'force-dynamic'

/** Sponsors who came in through Dodo checkout. Static ones live in src/data/sponsors.ts. */
export async function GET() {
  try {
    const sponsors = await listWallSponsors()
    return NextResponse.json(
      { sponsors },
      { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=300' } },
    )
  } catch (error) {
    console.error('Failed to load sponsors:', error)
    return NextResponse.json({ sponsors: [] }, { status: 200 })
  }
}
