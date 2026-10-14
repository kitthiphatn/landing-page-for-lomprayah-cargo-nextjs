'use client'

import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'
import type { Branch, TrackResult } from '@/lib/tracking/types'

import { branchName, formatDateTime } from './format'
import { StatusPill, VehicleIcon } from './StatusPill'

type Props = {
  result: TrackResult
  open: boolean
  onToggle: () => void
  onRetry: () => void
  branches: Map<string, Branch>
  locale: Locale
  t: Dictionary['track']
}

export function ShipmentCard({ result, open, onToggle, onRetry, branches, locale, t }: Props) {
  if (!result.ok) {
    const message =
      result.error === 'not_found'
        ? t.notFound
        : result.error === 'rate_limited'
          ? t.rateLimited
          : result.error === 'network'
            ? t.network
            : t.serverError
    return (
      <article className="grid gap-2 rounded-2xl border border-line bg-surface p-4">
        <p className="font-mono text-sm">{result.number}</p>
        <p className="font-medium text-danger">{message}</p>
        {result.error === 'not_found' ? (
          <p className="text-sm text-muted">{t.notFoundHelp}</p>
        ) : (
          <button
            type="button"
            onClick={onRetry}
            className="justify-self-start rounded-lg border border-line px-3 py-1.5 text-sm font-medium hover:bg-chip"
          >
            {t.retry}
          </button>
        )}
      </article>
    )
  }

  const s = result.shipment
  // Contact the branch the parcel is at now, falling back to the destination
  const contact =
    branches.get(s.current_location_code || '') || branches.get(s.destination_code || '')
  const bodyId = `shipment-${s.tracking_number}`

  return (
    <article
      className={`overflow-hidden rounded-2xl border bg-surface transition-colors ${open ? 'border-sea' : 'border-line'}`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={bodyId}
        className="grid w-full grid-cols-[40px_minmax(0,1fr)_auto_20px] items-center gap-3 p-4 text-left"
      >
        <span className="grid size-10 place-items-center rounded-full border border-line text-sea">
          <VehicleIcon status={s.status} />
        </span>
        <span className="grid min-w-0">
          <span className="text-xs text-muted">{t.numberLabel}</span>
          <span className="font-mono text-sm break-all">{s.tracking_number}</span>
        </span>
        <StatusPill status={s.status} locale={locale} />
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
          className={`text-muted transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <div
        id={bodyId}
        className={`grid transition-[grid-template-rows] duration-300 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="min-h-0 overflow-hidden">
          <ol className="grid border-t border-line px-4 pt-4">
            {s.timeline.map((e, i) => {
              const last = i === s.timeline.length - 1
              return (
                <li key={`${e.timestamp}-${i}`} className="relative grid pb-4 pl-7">
                  <span
                    className={`absolute top-1.5 left-1 size-3 rounded-full ${last ? 'bg-sea ring-4 ring-sea/25' : 'bg-line'}`}
                  />
                  {!last && (
                    <span className="absolute top-5 bottom-0 left-[9px] border-l-2 border-line" />
                  )}
                  <span className="text-xs text-muted tabular-nums">
                    {formatDateTime(e.timestamp, locale)}
                  </span>
                  <span className={last ? 'font-semibold' : 'font-medium'}>
                    {e.description || e.status}
                  </span>
                  <span className="text-sm text-muted">
                    {branchName(e.location, branches, locale)}
                  </span>
                </li>
              )
            })}
          </ol>
          {contact && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3">
              <span className="grid min-w-0">
                <span className="text-xs text-muted">{t.contactBranch}</span>
                <span className="font-medium">{branchName(contact.code, branches, locale)}</span>
                {contact.phone && (
                  <span className="text-sm text-muted select-all">{contact.phone}</span>
                )}
              </span>
              {contact.phone && (
                <a
                  href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`}
                  className="flex items-center gap-2 rounded-full bg-chip px-4 py-2 text-sm font-medium text-navy"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
                  </svg>
                  {t.call}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
