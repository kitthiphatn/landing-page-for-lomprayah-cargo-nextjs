import Link from 'next/link'

import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'
import { branchTitle, directionsUrl, formatHours } from '@/lib/tracking/branches'
import type { Branch } from '@/lib/tracking/types'

type Props = {
  branch: Branch
  locale: Locale
  t: Dictionary['branches']
  active?: boolean
  distance?: number | null
  onSelect?: () => void
}

export function BranchCard({ branch: b, locale, t, active, distance, onSelect }: Props) {
  const hours = formatHours(b.operatingHours, locale, t.everyDay)
  const subtitle = locale === 'en' ? b.name : b.nameEn
  const href = `/${locale}/branches/${encodeURIComponent(b.code)}`
  const heading = (
    <>
      <h2 className="font-display text-base font-semibold text-fg">{branchTitle(b, locale)}</h2>
      {subtitle && <span className="text-xs text-muted">{subtitle}</span>}
    </>
  )
  return (
    <article
      id={`branch-${b.code}`}
      className={`grid gap-2 rounded-2xl border bg-surface p-4 text-sm transition-colors ${active ? 'border-navy shadow-[0_0_0_1px_var(--navy)]' : 'border-line'}`}
    >
      <div className="flex items-start justify-between gap-3">
        {onSelect ? (
          <button
            type="button"
            onClick={onSelect}
            className="grid min-w-0 cursor-pointer text-left"
          >
            {heading}
          </button>
        ) : (
          <Link href={href} className="grid min-w-0 hover:text-navy">
            {heading}
          </Link>
        )}
        <div className="flex shrink-0 items-center gap-1.5">
          {distance != null && (
            <span className="text-xs text-muted tabular-nums">
              {distance < 10 ? distance.toFixed(1) : Math.round(distance)} {t.km}
            </span>
          )}
          <span className="rounded-md bg-chip px-1.5 py-0.5 font-mono text-xs text-navy">
            {b.code}
          </span>
        </div>
      </div>
      {b.isTransitHub && (
        <span className="w-fit rounded-full bg-sun/20 px-2 py-0.5 text-xs font-medium text-fg">
          {t.hub}
        </span>
      )}
      <dl className="grid gap-1 text-muted">
        {b.address && (
          <div className="flex gap-2">
            <dt className="sr-only">{t.address}</dt>
            <dd>{b.address}</dd>
          </div>
        )}
        {hours && (
          <div className="flex gap-2">
            <dt className="shrink-0">{t.hours}</dt>
            <dd className="text-fg tabular-nums">{hours}</dd>
          </div>
        )}
      </dl>
      <div className="mt-1 flex flex-wrap gap-2">
        {b.phone && (
          <a
            href={`tel:${b.phone.replace(/[^\d+]/g, '')}`}
            className="rounded-lg border border-line px-3 py-1.5 font-medium hover:bg-chip"
          >
            {t.phone} {b.phone}
          </a>
        )}
        <a
          href={directionsUrl(b)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-line px-3 py-1.5 font-medium hover:bg-chip"
        >
          {t.directions}
        </a>
        <Link
          href={href}
          className="rounded-lg bg-navy px-3 py-1.5 font-medium text-bg hover:brightness-110"
        >
          {t.details}
        </Link>
      </div>
    </article>
  )
}
