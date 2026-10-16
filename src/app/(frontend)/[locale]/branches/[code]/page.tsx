import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BranchCard } from '@/components/branches/BranchCard'
import { BranchMap } from '@/components/branches/BranchMap'
import { RouteCard } from '@/components/content/RouteCard'
import { TrackingSearch } from '@/components/TrackingSearch'
import { isLocale, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import {
  branchNames,
  branchTitle,
  directionsUrl,
  distanceKm,
  formatHours,
  hasCoords,
} from '@/lib/tracking/branches'
import { listRoutes } from '@/lib/content'
import { fetchBranches } from '@/lib/tracking/server'
import type { Branch } from '@/lib/tracking/types'

export const revalidate = 3600

type Params = Promise<{ locale: string; code: string }>

// Branch pages render on their first visit and are then cached, so a build never depends on the
// tracking API being reachable
export function generateStaticParams() {
  return []
}

async function findBranch(code: string) {
  const branches = await fetchBranches()
  // Fail instead of caching a 404 while the API is down; the last good page keeps being served
  if (!branches) throw new Error('Branch list unavailable')
  const branch = branches.find((b) => b.code === decodeURIComponent(code))
  return { branch, branches }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, code } = await params
  if (!isLocale(locale)) return {}
  const { branch } = await findBranch(code)
  if (!branch) return {}
  const t = getDictionary(locale).branches
  const name = branchTitle(branch, locale)
  const hours = formatHours(branch.operatingHours, locale, t.everyDay)
  return {
    title: `${locale === 'th' ? 'สาขา' : 'Branch'} ${name}`,
    description: [branch.address, branch.phone && `${t.phone} ${branch.phone}`, hours]
      .filter(Boolean)
      .join(' · '),
    alternates: {
      canonical: `/${locale}/branches/${branch.code}`,
      languages: { th: `/th/branches/${branch.code}`, en: `/en/branches/${branch.code}` },
    },
  }
}

const SCHEMA_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function jsonLd(b: Branch, locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `Lomprayah Cargo ${branchTitle(b, locale)}`,
    address: b.address ?? undefined,
    telephone: b.phone ?? undefined,
    geo: hasCoords(b)
      ? { '@type': 'GeoCoordinates', latitude: b.latitude, longitude: b.longitude }
      : undefined,
    openingHoursSpecification: b.operatingHours
      ? {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: b.operatingHours.days.map((d) => SCHEMA_DAYS[d - 1]).filter(Boolean),
          opens: b.operatingHours.open,
          closes: b.operatingHours.close,
        }
      : undefined,
  }
}

export default async function BranchPage({ params }: { params: Params }) {
  const { locale, code } = await params
  if (!isLocale(locale)) notFound()
  const { branch: b, branches } = await findBranch(code)
  if (!b) notFound()

  const dict = getDictionary(locale)
  const t = dict.branches
  const hours = formatHours(b.operatingHours, locale, t.everyDay)
  const subtitle = locale === 'en' ? b.name : b.nameEn

  const routes = await listRoutes(locale, {
    or: [{ fromCode: { equals: b.code } }, { toCode: { equals: b.code } }],
  })
  const names = branchNames(branches, locale)

  const nearby = hasCoords(b)
    ? branches
        .filter((x) => x.code !== b.code && hasCoords(x))
        .map((x) => ({
          x,
          km: distanceKm(
            { lat: b.latitude, lng: b.longitude },
            { lat: x.latitude!, lng: x.longitude! },
          ),
        }))
        .sort((p, q) => p.km - q.km)
        .slice(0, 3)
    : []

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd(b, locale)).replace(/</g, '\\u003c'),
        }}
      />
      <nav className="text-sm">
        <Link href={`/${locale}/branches`} className="text-navy hover:underline">
          ← {t.back}
        </Link>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-start">
        <section className="grid content-start gap-4">
          <header className="grid gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-2xl font-semibold sm:text-3xl">
                {branchTitle(b, locale)}
              </h1>
              <span className="rounded-md bg-chip px-1.5 py-0.5 font-mono text-sm text-navy">
                {b.code}
              </span>
            </div>
            {subtitle && <p className="text-muted">{subtitle}</p>}
            {b.isTransitHub && (
              <span className="mt-1 w-fit rounded-full bg-sun/20 px-2 py-0.5 text-xs font-medium">
                {t.hub}
              </span>
            )}
          </header>

          <dl className="grid gap-3 rounded-2xl border border-line bg-surface p-4 text-sm">
            {b.address && (
              <div className="grid gap-0.5">
                <dt className="text-muted">{t.address}</dt>
                <dd>{b.address}</dd>
              </div>
            )}
            {b.phone && (
              <div className="grid gap-0.5">
                <dt className="text-muted">{t.phone}</dt>
                <dd>
                  <a
                    href={`tel:${b.phone.replace(/[^\d+]/g, '')}`}
                    className="font-medium text-navy hover:underline"
                  >
                    {b.phone}
                  </a>
                </dd>
              </div>
            )}
            {hours && (
              <div className="grid gap-0.5">
                <dt className="text-muted">{t.hours}</dt>
                <dd className="tabular-nums">{hours}</dd>
              </div>
            )}
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href={directionsUrl(b)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-sun px-5 py-2.5 font-semibold text-on-sun hover:brightness-95"
              >
                {t.directions}
              </a>
              {b.phone && (
                <a
                  href={`tel:${b.phone.replace(/[^\d+]/g, '')}`}
                  className="rounded-xl border border-line px-5 py-2.5 font-medium hover:bg-chip"
                >
                  {t.phone}
                </a>
              )}
            </div>
          </dl>

          <div className="grid gap-2">
            <h2 className="font-display text-lg font-semibold">{t.trackHere}</h2>
            <TrackingSearch locale={locale} t={dict.track} />
          </div>
        </section>

        <div className="grid gap-2 lg:sticky lg:top-20">
          <div
            className="relative h-72 overflow-hidden rounded-2xl border border-line md:h-[420px]"
            role="region"
            aria-label={t.mapTitle}
          >
            {hasCoords(b) ? (
              <BranchMap
                pins={[
                  { code: b.code, name: branchTitle(b, locale), lat: b.latitude, lng: b.longitude },
                ]}
                selected={b.code}
                zoom={14}
              />
            ) : (
              <div className="grid h-full place-items-center bg-chip text-sm text-muted">
                {t.noMap}
              </div>
            )}
          </div>
        </div>
      </div>

      {routes.length > 0 && (
        <section className="grid gap-3">
          <h2 className="font-display text-lg font-semibold">{dict.routes.fromBranch}</h2>
          <div className="grid gap-3 md:grid-cols-3">
            {routes.map((r) => (
              <RouteCard key={r.id} route={r} names={names} locale={locale} t={dict.routes} />
            ))}
          </div>
        </section>
      )}

      {nearby.length > 0 && (
        <section className="grid gap-3">
          <h2 className="font-display text-lg font-semibold">{t.nearby}</h2>
          <div className="grid gap-3 md:grid-cols-3">
            {nearby.map(({ x, km }) => (
              <BranchCard key={x.code} branch={x} locale={locale} t={t} distance={km} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
