'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { getCalApi } from '@calcom/embed-react'
import NeumorphButton from './NeumorphButton'

const CAL_NAMESPACE = '15min'

interface CallToActionProps {
  profileImage?: string
  profileAlt?: string
  linkText?: string
  calLink?: string
  preText?: string
}

export default function CallToAction({
  profileImage = "/pfp.jpg",
  profileAlt = "Profile",
  linkText = "Book a Free Call",
  calLink = "bharathcodes/15min",
  preText = "If you've read this far, you might be interested in what I do."
}: CallToActionProps) {
  const { resolvedTheme } = useTheme()

  // Load the Cal.com embed once and keep the booking modal in sync with the site theme.
  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: CAL_NAMESPACE })
      cal("ui", {
        theme: resolvedTheme === "dark" ? "dark" : "light",
        layout: "month_view",
        hideEventTypeDetails: false,
      })
    })()
  }, [resolvedTheme])

  return (
    <div className="mt-4 sm:mt-6 pb-6 sm:pb-8 flex flex-col items-center w-full">
      <p className="text-neutral-600 dark:text-neutral-400 font-[family-name:var(--font-instrument-serif)] italic text-base sm:text-xl mb-3 text-center">{preText}</p>
      <div className="mt-3 sm:mt-0">
        <button
          type="button"
          data-cal-namespace={CAL_NAMESPACE}
          data-cal-link={calLink}
          data-cal-config='{"layout":"month_view"}'
          aria-haspopup="dialog"
          className="group inline-flex touch-manipulation active:opacity-75 cursor-pointer"
          style={{ 
            WebkitTapHighlightColor: 'transparent',
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            userSelect: 'none'
          }}
        >
          <NeumorphButton className="px-5 py-2.5 sm:py-2 text-sm sm:text-base text-neutral-800 dark:text-white/90">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden shrink-0">
                <Image 
                  alt={profileAlt} 
                  width={28} 
                  height={28} 
                  className="w-full h-full object-cover" 
                  src={profileImage}
                  style={{ color: 'transparent' }}
                />
              </div>
              <div className="flex items-center gap-1 overflow-hidden w-0 group-hover:w-[50px] transition-all duration-300 ease-out">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-2 h-2 sm:w-3 sm:h-3"
                >
                  <path d="M5 12h14"></path>
                  <path d="M12 5v14"></path>
                </svg>
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-zinc-900/10 dark:bg-white/10 flex items-center justify-center text-[8px] sm:text-[10px]">
                  You
                </div>
              </div>
              <span className="whitespace-nowrap">
                {linkText}
              </span>
            </div>
          </NeumorphButton>
        </button>
      </div>
    </div>
  )
}
