'use client'

import OnekoCat from '@/components/OnekoCat'
import SponsorWall from '@/components/sponsors/SponsorWall'
import FadeIn from '@/components/FadeIn'
import DiagonalPattern from '@/components/DiagonalPattern'
import PageNavigation from '@/components/Navigation'
import { Sponsor } from '@/types/sponsor'

interface SponsorsListClientProps {
  sponsors: Sponsor[]
}

export default function SponsorsListClient({ sponsors }: SponsorsListClientProps) {
  return (
    <div className="min-h-screen transition-colors duration-300 relative" style={{ fontFamily: 'var(--font-hk-grotesk)' }}>
      <OnekoCat />
      <div className="relative mx-auto max-w-4xl min-h-screen">
        <DiagonalPattern side="left" topOffset="0" />
        <DiagonalPattern side="right" topOffset="0" />

        <div className="mx-auto sm:w-[calc(100%-120px)] w-full max-w-4xl sm:px-0">
          <div className="text-base">
            <FadeIn delay={0.1} duration={0.5}>
              <div className="sm:px-12 py-2">
                <div className="px-4 mb-2 pt-4 sm:pt-6">
                  <div className="mb-8 sm:mb-10">
                    <PageNavigation />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-[family-name:var(--font-instrument-serif)] italic font-medium mb-4 text-neutral-900 dark:text-neutral-100 tracking-tight">
                    Sponsors
                  </h1>
                </div>
              </div>
            </FadeIn>

            <div className="sm:px-12 py-2">
              <div className="px-4">
                <FadeIn delay={0.3} duration={0.5}>
                  <SponsorWall sponsors={sponsors} />
                </FadeIn>
              </div>
            </div>
            <div className="pb-24 sm:pb-28" />
          </div>
        </div>
      </div>
    </div>
  )
}
