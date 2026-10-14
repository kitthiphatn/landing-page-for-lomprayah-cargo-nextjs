import Link from 'next/link'

import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'
import type { Route } from '@/payload-types'

export function RouteCard({
  route,
  names,
  locale,
  t,
}: {
  route: Route
  names: Map<string, string>
  locale: Locale
  t: Dictionary['routes']
}) {
  return (
    <Link
      href={`/${locale}/routes/${route.slug}`}
      className="group grid gap-3 rounded-2xl border border-line bg-surface p-4 hover:border-navy/40"
    >
      <div className="flex items-center gap-2 font-display font-semibold">
        <span>{names.get(route.fromCode) ?? route.fromCode}</span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="shrink-0 text-sea"
          aria-hidden="true"
        >
          <path d="M4 12h15M13 6l6 6-6 6" />
        </svg>
        <span>{names.get(route.toCode) ?? route.toCode}</span>
      </div>
      {route.summary && <p className="line-clamp-2 text-sm text-muted">{route.summary}</p>}
      {(route.transitTime || route.priceFrom) && (
        <dl className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
          {route.transitTime && (
            <div className="flex gap-1.5">
              <dt className="text-muted">{t.transitTime}</dt>
              <dd className="font-medium">{route.transitTime}</dd>
            </div>
          )}
          {route.priceFrom && (
            <div className="flex gap-1.5">
              <dt className="text-muted">{t.priceFrom}</dt>
              <dd className="font-medium">{route.priceFrom}</dd>
            </div>
          )}
        </dl>
      )}
    </Link>
  )
}
