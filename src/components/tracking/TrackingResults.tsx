'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'
import { getBranches, trackShipment } from '@/lib/tracking/api'
import { addRecent } from '@/lib/tracking/recent'
import type { Branch, TrackResult } from '@/lib/tracking/types'

import { LiveCard } from './LiveCard'
import { RouteMap } from './RouteMap'
import { ShipmentCard } from './ShipmentCard'

type Props = { numbers: string[]; locale: Locale; t: Dictionary['track'] }

export function TrackingResults({ numbers, locale, t }: Props) {
  const [results, setResults] = useState<TrackResult[] | null>(null)
  const [branches, setBranches] = useState<Map<string, Branch>>(new Map())
  const [openIndex, setOpenIndex] = useState(0)

  useEffect(() => {
    const ctrl = new AbortController()
    Promise.all([
      getBranches(ctrl.signal),
      Promise.all(numbers.map((n) => trackShipment(n, ctrl.signal))),
    ])
      .then(([list, found]) => {
        setBranches(new Map(list.map((b) => [b.code, b])))
        setResults(found)
        const firstOk = found.findIndex((r) => r.ok)
        setOpenIndex(firstOk === -1 ? 0 : firstOk)
        const okNumbers = found.filter((r) => r.ok).map((r) => r.number)
        if (okNumbers.length) addRecent(okNumbers)
      })
      .catch(() => {
        // Aborted because the numbers changed
      })
    return () => ctrl.abort()
  }, [numbers])

  const retry = useCallback(
    async (i: number) => {
      const number = numbers[i]
      if (!number) return
      const r = await trackShipment(number)
      setResults((prev) => (prev ? prev.map((x, j) => (j === i ? r : x)) : prev))
    },
    [numbers],
  )

  const selected = useMemo(() => {
    const r = results?.[openIndex]
    return r && r.ok
      ? r.shipment
      : (results?.find((x) => x.ok) as Extract<TrackResult, { ok: true }> | undefined)?.shipment
  }, [results, openIndex])

  if (!results) {
    return (
      <div className="grid gap-3" aria-live="polite">
        <p className="text-sm text-muted">{t.loading}</p>
        {numbers.map((n) => (
          <div
            key={n}
            className="h-[72px] animate-pulse rounded-2xl border border-line bg-surface"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-start">
      <div className="grid content-start gap-3" aria-live="polite">
        {results.map((r, i) => (
          <ShipmentCard
            key={r.number}
            result={r}
            open={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            onRetry={() => retry(i)}
            branches={branches}
            locale={locale}
            t={t}
          />
        ))}
      </div>

      {selected && (
        <aside
          className="order-first grid gap-2 lg:sticky lg:top-20 lg:order-none"
          aria-label={t.mapTitle}
        >
          <div className="relative isolate h-72 overflow-hidden rounded-2xl border border-line md:h-[420px] lg:h-[520px]">
            <RouteMap shipment={selected} branches={branches} locale={locale} />
            <div className="pointer-events-none absolute inset-x-3 bottom-3 z-[500] hidden md:block">
              <div className="pointer-events-auto">
                <LiveCard shipment={selected} branches={branches} locale={locale} t={t} />
              </div>
            </div>
          </div>
          <div className="md:hidden">
            <LiveCard shipment={selected} branches={branches} locale={locale} t={t} />
          </div>
          <p className="text-xs text-muted">{t.mapNote}</p>
        </aside>
      )}
    </div>
  )
}
