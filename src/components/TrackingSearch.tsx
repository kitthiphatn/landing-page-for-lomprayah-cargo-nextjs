'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { BarcodeScanner } from '@/components/BarcodeScanner'

import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'
import { parseTrackingNumbers } from '@/lib/tracking/parse'
import { clearRecent, readRecent } from '@/lib/tracking/recent'

export function TrackingSearch({
  locale,
  t,
  initial = '',
}: {
  locale: Locale
  t: Dictionary['track']
  initial?: string
}) {
  const router = useRouter()
  const [value, setValue] = useState(initial)
  const [error, setError] = useState('')
  const [recent, setRecent] = useState<string[]>([])
  const [scanning, setScanning] = useState(false)
  // eslint-disable-next-line react-hooks/set-state-in-effect -- recent searches live in browser storage, readable only after hydration
  useEffect(() => setRecent(readRecent()), [])

  function search(input: string) {
    const numbers = parseTrackingNumbers(input)
    if (numbers.length === 0) {
      setError(t.empty)
      return
    }
    setError('')
    router.push(`/${locale}/track/${numbers.map(encodeURIComponent).join(',')}`)
  }

  return (
    <form
      id="track"
      className="grid gap-3 rounded-2xl bg-surface p-5 text-fg shadow-[0_18px_40px_rgba(8,20,60,.28)]"
      onSubmit={(e) => {
        e.preventDefault()
        search(value)
      }}
    >
      <label htmlFor="tracking-number" className="text-sm font-medium">
        {t.label}
      </label>
      <div className="flex flex-wrap gap-3">
        <div className="relative flex min-w-0 flex-[1_1_260px]">
          <input
            id="tracking-number"
            name="tracking-number"
            value={value}
            onChange={(e) => setValue(e.target.value.toUpperCase())}
            placeholder={t.placeholder}
            autoComplete="off"
            spellCheck={false}
            aria-invalid={Boolean(error)}
            aria-describedby="tracking-hint"
            className="min-w-0 flex-1 rounded-xl border-[1.5px] border-line bg-bg py-3.5 pr-14 pl-4 font-mono text-lg tracking-wide uppercase placeholder:normal-case placeholder:tracking-normal placeholder:text-muted focus:border-navy focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setScanning(true)}
            aria-label={t.scan.open}
            title={t.scan.open}
            className="absolute top-1/2 right-2 grid size-10 -translate-y-1/2 place-items-center rounded-lg text-navy hover:bg-chip"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" />
              <path d="M8 9v6M11 9v6M14 9v6M17 9v6" />
            </svg>
          </button>
        </div>
        <button
          type="submit"
          className="min-h-13 w-full rounded-xl bg-sun px-7 sm:w-auto font-display text-base font-semibold text-on-sun hover:brightness-95"
        >
          {t.submit}
        </button>
      </div>
      <p id="tracking-hint" className={`text-sm ${error ? 'text-danger' : 'text-muted'}`}>
        {error || t.hint}
      </p>
      {recent.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted">{t.recent}:</span>
          {recent.map((n) => (
            <Link
              key={n}
              href={`/${locale}/track/${encodeURIComponent(n)}`}
              className="rounded-full bg-chip px-3 py-1 font-mono text-xs text-navy hover:brightness-95"
            >
              {n}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => {
              clearRecent()
              setRecent([])
            }}
            className="text-xs text-muted underline underline-offset-2"
          >
            {t.clearRecent}
          </button>
        </div>
      )}
      {scanning && (
        <BarcodeScanner
          labels={t.scan}
          onClose={() => setScanning(false)}
          onResult={(text) => {
            setScanning(false)
            // A scan adds to numbers already typed, then searches straight away
            const next = parseTrackingNumbers(`${value} ${text}`).join(' ')
            setValue(next)
            search(next)
          }}
        />
      )}
    </form>
  )
}
