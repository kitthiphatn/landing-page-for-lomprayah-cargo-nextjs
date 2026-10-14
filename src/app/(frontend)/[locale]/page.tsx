import { notFound } from 'next/navigation'

import { TrackingSearch } from '@/components/TrackingSearch'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { getSiteContent } from '@/lib/payload'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const t = getDictionary(locale)
  const hero = (await getSiteContent(locale))?.settings.hero

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#132968] via-[#0f4f7a] to-[#0e7c86] text-white">
      <div className="mx-auto grid max-w-3xl gap-6 px-4 pt-14 pb-20 md:pt-20">
        <h1 className="text-3xl leading-tight font-bold md:text-5xl">{hero?.title || t.hero.title}</h1>
        <p className="max-w-[56ch] text-[#d8e2ff]">{hero?.subtitle || t.hero.subtitle}</p>
        <TrackingSearch locale={locale} t={t.track} />
      </div>
      <svg className="pointer-events-none absolute inset-x-0 bottom-0 h-12 w-full text-bg" viewBox="0 0 1400 48" preserveAspectRatio="none" aria-hidden="true">
        <path fill="currentColor" d="M0 24 Q50 8 100 24 T200 24 T300 24 T400 24 T500 24 T600 24 T700 24 T800 24 T900 24 T1000 24 T1100 24 T1200 24 T1300 24 T1400 24 V48 H0z" />
      </svg>
    </section>
  )
}
