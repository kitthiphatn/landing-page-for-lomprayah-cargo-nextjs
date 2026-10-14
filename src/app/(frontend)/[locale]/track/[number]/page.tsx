import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { TrackingResults } from '@/components/tracking/TrackingResults'
import { TrackingSearch } from '@/components/TrackingSearch'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { parseTrackingNumbers } from '@/lib/tracking/parse'

// Results contain (masked) customer data, so keep them out of search engines
export const metadata: Metadata = { robots: { index: false, follow: false } }

const MAX_NUMBERS = 10

export default async function TrackPage({
  params,
}: {
  params: Promise<{ locale: string; number: string }>
}) {
  const { locale, number } = await params
  if (!isLocale(locale)) notFound()

  const t = getDictionary(locale)
  const numbers = parseTrackingNumbers(decodeURIComponent(number)).slice(0, MAX_NUMBERS)

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8">
      <div className="mx-auto w-full max-w-3xl">
        <TrackingSearch locale={locale} t={t.track} initial={numbers.join(' ')} />
      </div>
      <h1 className="sr-only">{t.track.resultTitle}</h1>
      {/* Keyed so a new search starts from a fresh loading state */}
      <TrackingResults key={numbers.join(',')} numbers={numbers} locale={locale} t={t.track} />
    </div>
  )
}
