'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence, type Variants } from 'motion/react'

interface FlipTitleProps {
  titles: string[]
  interval?: number
}

const STAGGER = 0.035

const word: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: STAGGER, delayChildren: 0.12 } },
  exit: { transition: { staggerChildren: STAGGER } },
}

// Each letter rolls like a cube face: out the top, in from the bottom.
const letter: Variants = {
  initial: { rotateX: -90, y: '0.35em', opacity: 0 },
  animate: {
    rotateX: 0,
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    rotateX: 90,
    y: '-0.35em',
    opacity: 0,
    transition: { duration: 0.35, ease: [0.55, 0, 1, 0.45] },
  },
}

export default function FlipTitle({ titles, interval = 4000 }: FlipTitleProps) {
  const [index, setIndex] = useState(0)
  const current = titles[index]

  useEffect(() => {
    if (titles.length < 2) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % titles.length)
    }, interval)
    return () => clearInterval(id)
  }, [titles.length, interval])

  return (
    <span className="inline-grid align-bottom">
      <span className="sr-only">{current}</span>
      <AnimatePresence initial={false}>
        <motion.span
          key={current}
          aria-hidden="true"
          className="[grid-area:1/1] whitespace-nowrap [perspective:300px]"
          variants={word}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {current.split('').map((char, i) => (
            <motion.span
              key={i}
              className="inline-block [transform-origin:50%_50%_-0.4em] [backface-visibility:hidden]"
              variants={letter}
            >
              {char === ' ' ? ' ' : char}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
