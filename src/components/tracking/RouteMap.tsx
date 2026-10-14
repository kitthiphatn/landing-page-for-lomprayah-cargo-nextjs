'use client'

import dynamic from 'next/dynamic'

import type { Locale } from '@/i18n/config'
import type { Branch, Shipment } from '@/lib/tracking/types'

import { branchName } from './format'
import type { MapStop } from './RouteMapLeaflet'

// Leaflet touches `window`, so it only loads in the browser
const RouteMapLeaflet = dynamic(() => import('./RouteMapLeaflet'), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-chip" />,
})

function toStop(
  code: string | null,
  branches: Map<string, Branch>,
  locale: Locale,
): MapStop | null {
  const b = code ? branches.get(code) : undefined
  if (!b || b.latitude == null || b.longitude == null) return null
  return {
    code: b.code,
    name: branchName(b.code, branches, locale),
    lat: b.latitude,
    lng: b.longitude,
  }
}

// Stops in travel order: origin, every branch in the scan history, then the destination
export function routeStops(s: Shipment, branches: Map<string, Branch>, locale: Locale) {
  const codes: string[] = []
  const push = (c: string | null) => {
    if (c && codes[codes.length - 1] !== c) codes.push(c)
  }
  push(s.origin_code)
  s.timeline.forEach((e) => push(e.location))
  push(s.current_location_code)
  const passedCodes = [...codes]
  push(s.destination_code)

  const stops = (list: string[]) =>
    list.map((c) => toStop(c, branches, locale)).filter((x): x is MapStop => x !== null)
  const passed = stops(passedCodes)
  const current = toStop(s.current_location_code, branches, locale) ?? passed.at(-1) ?? null
  const destination = toStop(s.destination_code, branches, locale)
  const remaining =
    s.status === 'delivered' || !current || !destination ? [] : [current, destination]
  return { passed, remaining, current, destination }
}

export function RouteMap({
  shipment,
  branches,
  locale,
}: {
  shipment: Shipment
  branches: Map<string, Branch>
  locale: Locale
}) {
  const route = routeStops(shipment, branches, locale)
  return <RouteMapLeaflet {...route} />
}
