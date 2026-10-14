import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BranchMap } from '@/components/branches/BranchMap'
import { FaqList, faqJsonLd } from '@/components/content/FaqList'
import { JsonLd } from '@/components/content/JsonLd'
import { RichText } from '@/components/content/RichText'
import { TrackingSearch } from '@/components/TrackingSearch'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { getRoute, mediaUrl } from '@/lib/content'
import { branchTitle, hasCoords } from '@/lib/tracking/branches'
import { fetchBranches } from '@/lib/tracking/server'
import type { Faq } from '@/payload-types'

type Props = { params: Promise<{ locale: string; slug: string }> }

// Rendered on first visit, then cached; admin edits refresh it right away
export function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const route = await getRoute(locale, slug)
  if (!route) return {}
  const image = mediaUrl(route.seo?.image)
  return {
    title: route.seo?.title || route.title,
    description: route.seo?.description || route.summary || undefined,
    alternates: {
      canonical: `/${locale}/routes/${route.slug}`,
      languages: { th: `/th/routes/${route.slug}`, en: `/en/routes/${route.slug}` },
    },
    openGraph: image ? { images: [image] } : undefined,
  }
}

export default async function RoutePage({ params }: Props) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const [route, branches] = await Promise.all([getRoute(locale, slug), fetchBranches()])
  if (!route) notFound()

  const dict = getDictionary(locale)
  const t = dict.routes
  const from = branches?.find((b) => b.code === route.fromCode)
  const to = branches?.find((b) => b.code === route.toCode)
  const pins = [from, to].flatMap((b) =>
    b && hasCoords(b)
      ? [{ code: b.code, name: branchTitle(b, locale), lat: b.latitude, lng: b.longitude }]
      : [],
  )
  const faqs = (route.faqs ?? []).filter((f): f is Faq => typeof f === 'object')

  const endpoint = (label: string, code: string, b: typeof from) => (
    <div className="grid gap-0.5">
      <span className="text-xs text-muted">{label}</span>
      {b ? (
        <Link
          href={`/${locale}/branches/${b.code}`}
          className="font-display text-lg font-semibold hover:text-navy"
        >
          {branchTitle(b, locale)}
        </Link>
      ) : (
        <span className="font-display text-lg font-semibold">{code}</span>
      )}
    </div>
  )

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8">
      {faqs.length > 0 && <JsonLd data={faqJsonLd(faqs)} />}
      <nav className="text-sm">
        <Link href={`/${locale}/routes`} className="text-navy hover:underline">
          ← {t.back}
        </Link>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-start">
        <section className="grid content-start gap-4">
          <header className="grid gap-2">
            <h1 className="font-display text-2xl font-semibold sm:text-3xl">{route.title}</h1>
            {route.summary && <p className="text-muted">{route.summary}</p>}
          </header>
          <div className="grid gap-4 rounded-2xl border border-line bg-surface p-4 text-sm">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              {endpoint(t.from, route.fromCode, from)}
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-sea"
                aria-hidden="true"
              >
                <path d="M4 12h15M13 6l6 6-6 6" />
              </svg>
              {endpoint(t.to, route.toCode, to)}
            </div>
            {(route.transitTime || route.priceFrom) && (
              <dl className="grid grid-cols-2 gap-3 border-t border-line pt-3">
                {route.transitTime && (
                  <div className="grid gap-0.5">
                    <dt className="text-muted">{t.transitTime}</dt>
                    <dd className="font-medium">{route.transitTime}</dd>
                  </div>
                )}
                {route.priceFrom && (
                  <div className="grid gap-0.5">
                    <dt className="text-muted">{t.priceFrom}</dt>
                    <dd className="font-medium">{route.priceFrom}</dd>
                  </div>
                )}
              </dl>
            )}
          </div>
          <TrackingSearch locale={locale} t={dict.track} />
        </section>

        {pins.length > 0 && (
          <div
            className="relative h-72 overflow-hidden rounded-2xl border border-line md:h-[420px] lg:sticky lg:top-20"
            role="region"
            aria-label={dict.branches.mapTitle}
          >
            <BranchMap pins={pins} selected={null} labels />
          </div>
        )}
      </div>

      {route.content && (
        <div className="max-w-3xl">
          <RichText data={route.content} />
        </div>
      )}

      {faqs.length > 0 && (
        <section className="grid max-w-3xl gap-3">
          <h2 className="font-display text-lg font-semibold">{t.faq}</h2>
          <FaqList faqs={faqs} />
        </section>
      )}
    </div>
  )
}
