'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

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
  // eslint-disable-next-line react-hooks/set-state-in-effect -- recent searches live in browser storage, readable only after hydration
  useEffect(() => setRecent(readRecent()), [])

  return (
    <form
      id="track"
      className="grid gap-3 rounded-2xl bg-surface p-5 text-fg shadow-[0_18px_40px_rgba(8,20,60,.28)]"
      onSubmit={(e) => {
        e.preventDefault()
        const numbers = parseTrackingNumbers(value)
        if (numbers.length === 0) {
          setError(t.empty)
          return
        }
        setError('')
        router.push(`/${locale}/track/${numbers.map(encodeURIComponent).join(',')}`)
      }}
    >
      <label htmlFor="tracking-number" className="text-sm font-medium">
        {t.label}
      </label>
      <div className="flex flex-wrap gap-3">
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
          className="min-w-0 flex-[1_1_260px] rounded-xl border-[1.5px] border-line bg-bg px-4 py-3.5 font-mono text-lg tracking-wide uppercase placeholder:normal-case placeholder:tracking-normal placeholder:text-muted focus:border-navy focus:outline-none"
        />
        <button
          type="submit"
          className="min-h-13 w-full rounded-xl bg-sun px-7 sm:w-auto font-display text-base font-semibold text-[#1b1300] hover:brightness-95"
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
    </form>
  )
}
