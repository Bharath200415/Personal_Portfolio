'use client'

import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowRight, Loader2, Lock, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { resolveLogo, SPONSOR_NAME_MAX, SPONSOR_TAGLINE_MAX, validateSubmission } from '@/lib/sponsor-validation'
import type { SponsorSubmission } from '@/types/sponsor'
import { SponsorLogo } from './SponsorTile'
import { tileFrame } from './tile-styles'

interface SponsorCheckoutDialogProps {
  open: boolean
  onClose: () => void
  priceUsd: string
}

type FieldErrors = Partial<Record<keyof SponsorSubmission, string>>

const EASE_OUT = [0.23, 1, 0.32, 1] as const

export default function SponsorCheckoutDialog({ open, onClose, priceUsd }: SponsorCheckoutDialogProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return createPortal(
    <AnimatePresence>{open && <DialogBody onClose={onClose} priceUsd={priceUsd} />}</AnimatePresence>,
    document.body,
  )
}

function DialogBody({ onClose, priceUsd }: Omit<SponsorCheckoutDialogProps, 'open'>) {
  const reduceMotion = useReducedMotion()
  const titleId = useId()
  const descId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)

  const [values, setValues] = useState<SponsorSubmission>({ name: '', logo: '', tagline: '', url: '' })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const previewLogo = resolveLogo(values.logo) ?? ''

  // Focus the first field, lock page scroll, close on Escape, keep Tab inside the panel.
  useEffect(() => {
    nameRef.current?.focus()
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submitting) onClose()
      if (e.key !== 'Tab' || !panelRef.current) return
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), a[href]',
      )
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last?.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = overflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose, submitting])

  const update = (field: keyof SponsorSubmission) => (value: string) => {
    setValues((v) => ({ ...v, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }))
    setFormError(null)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const result = validateSubmission(values)
    if (!result.ok) {
      setErrors({ [result.field]: result.error })
      panelRef.current?.querySelector<HTMLInputElement>(`[name="${result.field}"]`)?.focus()
      return
    }

    setSubmitting(true)
    setFormError(null)
    try {
      const res = await fetch('/api/sponsors/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.checkoutUrl) {
        if (data.field) setErrors({ [data.field]: data.error })
        else setFormError(data.error ?? 'Something went wrong. Try again.')
        setSubmitting(false)
        return
      }
      window.location.href = data.checkoutUrl
    } catch {
      setFormError('Couldn’t reach the server. Check your connection and try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[1200] flex items-end justify-center sm:items-center sm:p-4">
      <motion.div
        className="absolute inset-0 bg-black/25 backdrop-blur-[2px] dark:bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: EASE_OUT }}
        onClick={() => !submitting && onClose()}
      />

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className={cn(
          'relative w-full max-w-[400px] overflow-hidden border bg-background p-5 sm:p-6',
          'rounded-t-[28px] border-black/[0.08] sm:rounded-[28px] dark:border-white/[0.08]',
          'shadow-[0_24px_60px_-20px_rgba(15,23,42,0.35)]',
        )}
        style={{ fontFamily: 'var(--font-hk-grotesk)' }}
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
        transition={{ duration: 0.24, ease: EASE_OUT }}
      >
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          aria-label="Close"
          className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-black/5 hover:text-neutral-900 disabled:opacity-40 dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-neutral-100"
        >
          <X className="size-4" />
        </button>

        <div className="flex items-center gap-4">
          <motion.span
            key={previewLogo || 'empty'}
            initial={reduceMotion ? false : { scale: 0.92, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
            className={cn(tileFrame, 'size-16 rounded-[18px] bg-neutral-50 sm:size-16 sm:rounded-[18px] dark:bg-neutral-900')}
          >
            <span className="block size-full overflow-hidden rounded-[inherit]">
              {previewLogo || values.name ? (
                <SponsorLogo key={previewLogo} src={previewLogo} name={values.name || '?'} className="text-2xl sm:text-2xl" />
              ) : (
                <span className="flex size-full items-center justify-center border border-dashed border-black/10 rounded-[inherit] dark:border-white/10" />
              )}
            </span>
          </motion.span>
          <div className="min-w-0 pr-8">
            <h2
              id={titleId}
              className="font-[family-name:var(--font-instrument-serif)] text-2xl italic leading-tight text-neutral-900 dark:text-neutral-100"
            >
              Claim your tile
            </h2>
            <p id={descId} className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
              ${priceUsd}, paid once. Your logo stays on the wall for good.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
          <Field
            label="Name"
            name="name"
            inputRef={nameRef}
            value={values.name}
            onChange={update('name')}
            error={errors.name}
            placeholder="Your name or company"
            maxLength={SPONSOR_NAME_MAX}
            autoComplete="organization"
          />
          <Field
            label="Logo"
            name="logo"
            value={values.logo}
            onChange={update('logo')}
            error={errors.logo}
            placeholder="octocat or https://…/logo.png"
            hint="A GitHub username, or a link to a square image."
            autoCapitalize="none"
            spellCheck={false}
          />
          <Field
            label="Tagline"
            optional
            name="tagline"
            value={values.tagline ?? ''}
            onChange={update('tagline')}
            error={errors.tagline}
            placeholder="What you do, in a few words"
            hint="Shows under your name when someone hovers your tile."
            maxLength={SPONSOR_TAGLINE_MAX}
          />
          <Field
            label="Link"
            optional
            name="url"
            type="url"
            value={values.url ?? ''}
            onChange={update('url')}
            error={errors.url}
            placeholder="yoursite.com"
            autoCapitalize="none"
            spellCheck={false}
          />

          {formError && (
            <p role="alert" className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className={cn(
              'group relative flex h-11 w-full items-center justify-center gap-2 rounded-2xl text-sm font-medium',
              'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900',
              'shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_4px_10px_-4px_rgba(15,23,42,0.4)] dark:shadow-[inset_0_-1px_0_rgba(0,0,0,0.15)]',
              'transition-[transform,opacity] duration-150 ease-out motion-safe:active:scale-[0.98] disabled:opacity-70',
            )}
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Opening checkout…
              </>
            ) : (
              <>
                Continue to payment · ${priceUsd}
                <ArrowRight
                  className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5"
                  aria-hidden
                />
              </>
            )}
          </button>

          <p className="flex items-center justify-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500">
            <Lock className="size-3" aria-hidden />
            Secure checkout by Dodo Payments
          </p>
        </form>
      </motion.div>
    </div>
  )
}

interface FieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'name'> {
  label: string
  name: keyof SponsorSubmission
  value: string
  onChange: (value: string) => void
  error?: string
  hint?: string
  optional?: boolean
  inputRef?: React.Ref<HTMLInputElement>
}

function Field({ label, name, value, onChange, error, hint, optional, inputRef, ...rest }: FieldProps) {
  const id = useId()
  const messageId = `${id}-msg`

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between text-[13px] font-medium text-neutral-700 dark:text-neutral-300">
        {label}
        {optional && <span className="text-xs font-normal text-neutral-400 dark:text-neutral-500">Optional</span>}
      </label>
      <input
        ref={inputRef}
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error || hint ? messageId : undefined}
        className={cn(
          'h-10 w-full rounded-xl border bg-neutral-50 px-3 text-[15px] text-neutral-900 outline-none transition-[border-color,box-shadow] duration-150',
          'placeholder:text-neutral-400 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-600',
          'border-black/10 focus:border-neutral-400 focus:ring-4 focus:ring-black/[0.04] dark:border-white/10 dark:focus:border-neutral-500 dark:focus:ring-white/[0.06]',
          error && 'border-red-400 focus:border-red-400 focus:ring-red-500/10 dark:border-red-500/60',
        )}
        {...rest}
      />
      {(error || hint) && (
        <p
          id={messageId}
          className={cn('mt-1.5 text-xs', error ? 'text-red-600 dark:text-red-400' : 'text-neutral-400 dark:text-neutral-500')}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  )
}
