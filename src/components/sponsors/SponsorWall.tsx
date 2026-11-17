'use client'

import { useEffect, useRef, useState } from 'react'
import { Plus } from 'lucide-react'
import { FaGithub, FaXTwitter } from 'react-icons/fa6'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { Sponsor } from '@/types/sponsor'
import SponsorCheckoutDialog from './SponsorCheckoutDialog'
import { SponsorLogo, TileBadge } from './SponsorTile'
import { tileFrame, tileLift } from './tile-styles'

export const SPONSOR_PRICE_USD = process.env.NEXT_PUBLIC_SPONSOR_PRICE_USD || '10'

const SUPPORT_LINKS = {
  github: 'https://github.com/bharath200415',
  x: 'https://x.com/bharathships',
}

interface SponsorWallProps {
  /** Hand-curated sponsors from src/data/sponsors.ts. Paid ones are fetched and appended. */
  sponsors: Sponsor[]
  className?: string
}

function hostOf(url?: string) {
  if (!url) return null
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

function sponsorHref(sponsor: Sponsor) {
  if (sponsor.url) return sponsor.url
  if (sponsor.github) return `https://github.com/${sponsor.github}`
  if (sponsor.twitter) return `https://x.com/${sponsor.twitter}`
  return undefined
}

export default function SponsorWall({ sponsors: staticSponsors, className }: SponsorWallProps) {
  const [paidSponsors, setPaidSponsors] = useState<Sponsor[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const addTileRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/sponsors')
      .then((res) => (res.ok ? res.json() : { sponsors: [] }))
      .then((data: { sponsors?: Sponsor[] }) => {
        if (!cancelled && Array.isArray(data.sponsors)) setPaidSponsors(data.sponsors)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const staticIds = new Set(staticSponsors.map((s) => s.id))
  const sponsors = [...staticSponsors, ...paidSponsors.filter((s) => !staticIds.has(s.id))]

  const closeDialog = () => {
    setDialogOpen(false)
    requestAnimationFrame(() => addTileRef.current?.focus())
  }

  return (
    <div className={className}>
      <p className="text-[15px] leading-[1.75] text-neutral-500 text-pretty sm:text-base dark:text-neutral-400">
        You just scrolled to the most important section of the site. Everything here is built and
        kept running by me, with a little help from the people below.
      </p>

      <ul
        className="group/wall mt-6 flex flex-wrap gap-2.5 sm:mt-7 sm:gap-3"
        aria-label="Sponsors"
      >
        {sponsors.map((sponsor) => {
          const href = sponsorHref(sponsor)
          const host = hostOf(href)
          const tile = (
            <span className="block size-full overflow-hidden rounded-[inherit]">
              <SponsorLogo src={sponsor.logo} name={sponsor.name} />
            </span>
          )

          return (
            <li key={sponsor.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      aria-label={sponsor.name}
                      className={cn(
                        tileFrame,
                        tileLift,
                        'bg-neutral-50 dark:bg-neutral-900',
                        'group-has-[a:hover]/wall:opacity-60 hover:!opacity-100',
                      )}
                    >
                      {tile}
                    </a>
                  ) : (
                    <span
                      tabIndex={0}
                      aria-label={sponsor.name}
                      className={cn(tileFrame, 'bg-neutral-50 dark:bg-neutral-900')}
                    >
                      {tile}
                    </span>
                  )}
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={8} className="max-w-[240px] rounded-xl px-3.5 py-2 text-center">
                  <span className="block text-[13px] font-medium leading-tight">{sponsor.name}</span>
                  {(sponsor.tagline || host) && (
                    <span className="mt-0.5 block text-[12px] leading-snug opacity-60">
                      {sponsor.tagline || host}
                    </span>
                  )}
                </TooltipContent>
              </Tooltip>
            </li>
          )
        })}

        <li>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                ref={addTileRef}
                type="button"
                onClick={() => setDialogOpen(true)}
                aria-label={`Become a supporter for $${SPONSOR_PRICE_USD}`}
                aria-haspopup="dialog"
                className={cn(
                  tileFrame,
                  'cursor-pointer bg-white text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400',
                  'hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100',
                  'motion-safe:hover:rotate-[4deg] motion-safe:hover:scale-[1.03] motion-safe:active:scale-[0.97]',
                )}
              >
                <Plus className="size-[18px] sm:size-5" strokeWidth={1.5} aria-hidden />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="start" sideOffset={10} className="rounded-xl px-3.5 py-2">
              <span className="block text-[13px] font-medium leading-tight">Become a supporter</span>
              <span className="block text-[12px] leading-tight opacity-60">
                ${SPONSOR_PRICE_USD} · Once. Here for good.
              </span>
            </TooltipContent>
          </Tooltip>
        </li>
      </ul>

      {/* Free ways to support */}
      <ul className="mt-2.5 flex flex-wrap gap-2.5 sm:mt-3 sm:gap-3" aria-label="Other ways to support">
        <li>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href={SUPPORT_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow me on GitHub"
                className={cn(tileFrame, tileLift, 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100')}
              >
                <FaGithub className="size-6 sm:size-7" aria-hidden />
                <TileBadge>
                  <Plus className="size-2.5 sm:size-3" strokeWidth={2.75} />
                </TileBadge>
              </a>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={10}>Follow on GitHub</TooltipContent>
          </Tooltip>
        </li>
        <li>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href={SUPPORT_LINKS.x}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Say hi on X"
                className={cn(tileFrame, tileLift, 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100')}
              >
                <FaXTwitter className="size-5 sm:size-6" aria-hidden />
                <TileBadge>
                  <svg viewBox="0 0 24 24" className="size-2.5 sm:size-3" fill="currentColor">
                    <path d="M12 3C6.48 3 2 6.94 2 11.8c0 2.47 1.17 4.7 3.05 6.3L4.3 21.2a.5.5 0 0 0 .72.55l3.62-1.9c1.04.32 2.17.5 3.36.5 5.52 0 10-3.94 10-8.75S17.52 3 12 3Z" />
                  </svg>
                </TileBadge>
              </a>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={10}>Say hi on X</TooltipContent>
          </Tooltip>
        </li>
      </ul>

      <p className="mt-8 text-[15px] leading-relaxed text-neutral-500 sm:mt-10 sm:text-base dark:text-neutral-400">
        Thank you, all of you :)
      </p>

      <SponsorCheckoutDialog open={dialogOpen} onClose={closeDialog} priceUsd={SPONSOR_PRICE_USD} />
    </div>
  )
}
