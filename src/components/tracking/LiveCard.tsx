'use client'

import { useState } from 'react'

import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'
import { statusMeta } from '@/lib/tracking/status'
import type { Branch, Shipment } from '@/lib/tracking/types'

import { branchName, formatDateTime } from './format'
import { StatusPill, VehicleIcon } from './StatusPill'

type Props = {
  shipment: Shipment
  branches: Map<string, Branch>
  locale: Locale
  t: Dictionary['track']
}

export function LiveCard({ shipment: s, branches, locale, t }: Props) {
  const [copied, setCopied] = useState(false)
  const { progress } = statusMeta(s.status, locale)

  return (
    <section className="grid gap-3 rounded-2xl bg-surface p-4 shadow-[0_12px_30px_rgba(8,20,60,.18)]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-semibold">{t.liveTitle}</h2>
        <StatusPill status={s.status} locale={locale} />
      </div>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-muted">{t.numberLabel}</span>
        <span className="font-mono font-medium break-all text-sea">{s.tracking_number}</span>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard
              ?.writeText(s.tracking_number)
              .then(() => {
                setCopied(true)
                setTimeout(() => setCopied(false), 1500)
              })
              .catch(() => {})
          }}
          className="rounded-md border border-line px-2 py-0.5 text-xs hover:bg-chip"
        >
          {copied ? t.copied : t.copy}
        </button>
      </div>
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 text-sm">
        <span className="grid">
          <span className="text-xs text-muted">{t.origin}</span>
          <span className="font-medium">{branchName(s.origin_code, branches, locale)}</span>
        </span>
        <span
          className="relative h-1.5 rounded-full bg-line"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span
            className="absolute inset-y-0 left-0 rounded-full bg-sea transition-[width] duration-700"
            style={{ width: `${progress}%` }}
          />
          <span
            className="absolute top-1/2 grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-sea bg-surface text-sea"
            style={{ left: `${Math.min(Math.max(progress, 6), 94)}%` }}
          >
            <VehicleIcon status={s.status} className="size-4" />
          </span>
        </span>
        <span className="grid text-right">
          <span className="text-xs text-muted">{t.destination}</span>
          <span className="font-medium">{branchName(s.destination_code, branches, locale)}</span>
        </span>
      </div>
      <div className="flex flex-wrap justify-between gap-2 text-sm tabular-nums">
        <span className="grid">
          <span className="text-xs text-muted">{t.shippedAt}</span>
          {formatDateTime(s.created_at, locale)}
        </span>
        <span className="grid text-right">
          <span className="text-xs text-muted">{t.lastUpdate}</span>
          {formatDateTime(s.updated_at, locale)}
        </span>
      </div>
    </section>
  )
}
