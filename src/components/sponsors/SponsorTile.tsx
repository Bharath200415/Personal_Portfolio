'use client'

import { useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { LogoFit } from '@/types/sponsor'

interface LogoProps {
  src: string
  name: string
  fit?: LogoFit
  className?: string
}

/** Logo image with a monogram fallback when the image is missing or broken. */
export function SponsorLogo({ src, name, fit = 'cover', className }: LogoProps) {
  const [failed, setFailed] = useState(false)

  if (failed || !src) {
    return (
      <span
        className={cn(
          'flex size-full items-center justify-center bg-neutral-100 font-[family-name:var(--font-instrument-serif)] text-2xl italic text-neutral-500 sm:text-3xl dark:bg-neutral-800 dark:text-neutral-400',
          className,
        )}
        aria-hidden
      >
        {name.trim().charAt(0).toUpperCase() || '?'}
      </span>
    )
  }

  const img = (
    // eslint-disable-next-line @next/next/no-img-element -- sponsor logos come from arbitrary hosts
    <img
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      draggable={false}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={cn('size-full select-none', fit === 'cover' ? 'object-cover' : 'object-contain', fit === 'cover' && className)}
    />
  )

  // Transparent marks get room on a plate that contrasts with them, like an app icon.
  if (fit !== 'cover') {
    return (
      <span
        className={cn(
          'flex size-full items-center justify-center p-[20%]',
          fit === 'contain-dark' ? 'bg-[#0a0a0a]' : 'bg-white',
          className,
        )}
      >
        {img}
      </span>
    )
  }
  return img
}

/** Small circular badge pinned to a tile's top-right corner. */
export function TileBadge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'absolute -right-1.5 -top-1.5 z-10 flex size-5 items-center justify-center rounded-full ring-[2.5px] ring-background sm:size-6',
        'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900',
        className,
      )}
    >
      {children}
    </span>
  )
}
