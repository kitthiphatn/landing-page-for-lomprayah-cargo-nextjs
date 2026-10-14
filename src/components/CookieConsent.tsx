'use client'

import { useEffect, useState } from 'react'

import type { Dictionary } from '@/i18n/dictionaries'
import { CONSENT_OPEN_EVENT, readConsent, writeConsent } from '@/lib/consent'

type Props = { t: Dictionary['cookie']; message?: string | null; policyUrl?: string | null }

export function CookieConsent({ t, message, policyUrl }: Props) {
  const [open, setOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)

  useEffect(() => {
    const saved = readConsent()
    if (saved) {
      setAnalytics(saved.analytics)
      setMarketing(saved.marketing)
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

  const save = (choice: { analytics: boolean; marketing: boolean }) => {
    writeConsent(choice)
    setAnalytics(choice.analytics)
    setMarketing(choice.marketing)
    setOpen(false)
    setShowSettings(false)
  }

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-title"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto grid max-w-3xl gap-4 rounded-2xl border border-line bg-surface p-5 text-sm text-fg shadow-[0_12px_40px_rgba(8,20,60,.25)] sm:inset-x-6"
      style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <p id="cookie-title" className="leading-relaxed">
        {message || t.message}{' '}
        {policyUrl && (
          <a href={policyUrl} className="text-navy underline underline-offset-2">
            {t.policy}
          </a>
        )}
      </p>

      {showSettings && (
        <ul className="grid gap-3 border-t border-line pt-4">
          <CookieOption id="cookie-necessary" title={t.necessary} desc={t.necessaryDesc} checked disabled />
          <CookieOption id="cookie-analytics" title={t.analytics} desc={t.analyticsDesc} checked={analytics} onChange={setAnalytics} />
          <CookieOption id="cookie-marketing" title={t.marketing} desc={t.marketingDesc} checked={marketing} onChange={setMarketing} />
        </ul>
      )}

      <div className="flex flex-wrap justify-end gap-2">
        {showSettings ? (
          <button type="button" onClick={() => save({ analytics, marketing })} className="rounded-xl bg-navy px-4 py-2 font-medium text-surface">
            {t.save}
          </button>
        ) : (
          <button type="button" onClick={() => setShowSettings(true)} className="rounded-xl px-4 py-2 font-medium text-navy hover:bg-chip">
            {t.settings}
          </button>
        )}
        <button type="button" onClick={() => save({ analytics: false, marketing: false })} className="rounded-xl border border-line px-4 py-2 font-medium hover:bg-chip">
          {t.rejectAll}
        </button>
        <button type="button" onClick={() => save({ analytics: true, marketing: true })} className="rounded-xl bg-sun px-4 py-2 font-semibold text-[#1b1300]">
          {t.acceptAll}
        </button>
      </div>
    </div>
  )
}

function CookieOption(props: { id: string; title: string; desc: string; checked: boolean; disabled?: boolean; onChange?: (v: boolean) => void }) {
  return (
    <li className="flex items-start justify-between gap-4">
      <label htmlFor={props.id} className="grid min-w-0 gap-0.5">
        <span className="font-medium">{props.title}</span>
        <span className="text-muted">{props.desc}</span>
      </label>
      <input
        id={props.id}
        type="checkbox"
        className="mt-1 size-5 shrink-0 accent-[var(--navy)]"
        checked={props.checked}
        disabled={props.disabled}
        onChange={(e) => props.onChange?.(e.target.checked)}
      />
    </li>
  )
}
