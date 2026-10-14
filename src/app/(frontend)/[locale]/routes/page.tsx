import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { RouteCard } from '@/components/content/RouteCard'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { listRoutes } from '@/lib/content'
import { branchNames } from '@/lib/tracking/branches'
import { fetchBranches } from '@/lib/tracking/server'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale).routes
  return {
    title: t.title,
    description: t.metaDescription,
    alternates: {
      canonical: `/${locale}/routes`,
      languages: { th: '/th/routes', en: '/en/routes' },
    },
  }
}

export default async function RoutesPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale).routes
  const [routes, branches] = await Promise.all([listRoutes(locale), fetchBranches()])
  const names = branchNames(branches, locale)

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8">
      <header className="grid gap-1">
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">{t.title}</h1>
        <p className="text-muted">{t.subtitle}</p>
      </header>
      {routes.length === 0 ? (
        <p className="text-muted">{t.none}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {routes.map((r) => (
            <RouteCard key={r.id} route={r} names={names} locale={locale} t={t} />
          ))}
        </div>
      )}
    </div>
  )
}
