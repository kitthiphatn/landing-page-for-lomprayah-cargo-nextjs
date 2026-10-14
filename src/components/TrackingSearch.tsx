'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'

export function parseTrackingNumbers(input: string): string[] {
  return Array.from(new Set(input.toUpperCase().split(/[\s,]+/).filter(Boolean)))
}

export function TrackingSearch({ locale, t, initial = '' }: { locale: Locale; t: Dictionary['track']; initial?: string }) {
  const router = useRouter()
  const [value, setValue] = useState(initial)
  const [error, setError] = useState('')

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
        <button type="submit" className="min-h-13 w-full rounded-xl bg-sun px-7 sm:w-auto font-display text-base font-semibold text-[#1b1300] hover:brightness-95">
          {t.submit}
        </button>
      </div>
      <p id="tracking-hint" className={`text-sm ${error ? 'text-danger' : 'text-muted'}`}>
        {error || t.hint}
      </p>
    </form>
  )
}
