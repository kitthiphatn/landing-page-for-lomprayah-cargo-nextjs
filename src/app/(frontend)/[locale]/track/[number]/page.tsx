import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { TrackingSearch } from '@/components/TrackingSearch'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'

// Results contain (masked) customer data, so keep them out of search engines
export const metadata: Metadata = { robots: { index: false, follow: false } }

export default async function TrackPage({
  params,
}: {
  params: Promise<{ locale: string; number: string }>
}) {
  const { locale, number } = await params
  if (!isLocale(locale)) notFound()

  const t = getDictionary(locale)
  const numbers = decodeURIComponent(number).split(',').filter(Boolean)

  return (
    <div className="mx-auto grid max-w-3xl gap-6 px-4 py-10">
      <TrackingSearch locale={locale} t={t.track} initial={numbers.join(' ')} />
      <section className="grid gap-3 rounded-2xl border border-line bg-surface p-5">
        <h1 className="text-xl font-semibold">{t.track.resultTitle}</h1>
        <ul className="grid gap-1 font-mono">
          {numbers.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
        <p className="text-sm text-muted">{t.track.comingSoon}</p>
      </section>
    </div>
  )
}
