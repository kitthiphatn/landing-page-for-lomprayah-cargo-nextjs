'use client'

import { useEffect, useState } from 'react'

import type { Dictionary } from '@/i18n/dictionaries'
import { CONSENT_OPEN_EVENT, readConsent, writeConsent } from '@/lib/consent'

type Props = { t: Dictionary['cookie']; message?: string | null; policyUrl?: string | null }

export function CookieConsent({ t, message, policyUrl }: Props) {
  const [open, setOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [optional, setOptional] = useState(false)

  useEffect(() => {
    const saved = readConsent()
    if (saved) {
      setOptional(saved.analytics)
    } else {
      setOpen(true)
    }
    const reopen = () => {
      setShowSettings(true)
      setOpen(true)
    }
    window.addEventListener(CONSENT_OPEN_EVENT, reopen)
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen)
  }, [])

  if (!open) return null

  // One switch covers both analytics and marketing cookies
  const save = (allow: boolean) => {
    writeConsent({ analytics: allow, marketing: allow })
    setOptional(allow)
    setOpen(false)
    setShowSettings(false)
  }

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-title"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto grid max-w-3xl gap-3 rounded-2xl border border-line bg-surface p-4 text-sm text-fg shadow-[0_12px_40px_rgba(8,20,60,.25)] sm:inset-x-6"
      style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <p id="cookie-title" className="min-w-0 flex-[1_1_320px] leading-relaxed">
          {message || t.message}{' '}
          {policyUrl && (
            <a href={policyUrl} className="text-navy underline underline-offset-2">
              {t.policy}
            </a>
          )}
        </p>
        <div className="flex items-center gap-4">
          {!showSettings && (
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="text-muted underline underline-offset-2 hover:text-navy"
            >
              {t.settings}
            </button>
          )}
          <button
            type="button"
            onClick={() => save(true)}
            className="rounded-xl bg-sun px-5 py-2.5 font-semibold text-[#1b1300]"
          >
            {t.acceptAll}
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
          <label htmlFor="cookie-optional" className="flex min-w-0 items-start gap-3">
            <input
              id="cookie-optional"
              type="checkbox"
              className="mt-1 size-5 shrink-0 accent-[var(--navy)]"
              checked={optional}
              onChange={(e) => setOptional(e.target.checked)}
            />
            <span className="grid gap-0.5">
              <span className="font-medium">{t.optional}</span>
              <span className="text-muted">{t.optionalDesc}</span>
            </span>
          </label>
          <button
            type="button"
            onClick={() => save(optional)}
            className="rounded-xl border border-line px-4 py-2 font-medium hover:bg-chip"
          >
            {t.save}
          </button>
        </div>
      )}
    </div>
  )
}
