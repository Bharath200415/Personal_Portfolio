import { cn } from '@/lib/utils'

// Plain module (no 'use client') so server components can import these strings too.

/** Square app-icon tile. Every tile on the sponsor wall shares this frame. */
export const tileFrame = cn(
  'relative isolate flex size-14 shrink-0 items-center justify-center rounded-[15px] sm:size-[72px] sm:rounded-[18px]',
  'border border-black/[0.08] dark:border-white/[0.08]',
  'shadow-[0_1px_2px_rgba(15,23,42,0.06),0_4px_10px_-4px_rgba(15,23,42,0.12)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.4)]',
  'transition-[transform,box-shadow,opacity,background-color,color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]',
  'outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
)

export const tileLift =
  'motion-safe:hover:-translate-y-0.5 hover:shadow-[0_1px_2px_rgba(15,23,42,0.06),0_10px_20px_-8px_rgba(15,23,42,0.22)] motion-safe:active:scale-[0.97]'
