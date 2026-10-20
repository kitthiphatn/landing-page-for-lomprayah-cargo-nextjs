'use client'

import { useEffect, useMemo, useState } from 'react'

import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'
import { getBranches } from '@/lib/tracking/api'
import {
  branchGroup,
  branchTitle,
  distanceKm,
  hasCoords,
  matchesQuery,
  type BranchGroup,
} from '@/lib/tracking/branches'
import type { Branch } from '@/lib/tracking/types'

import { BranchCard } from './BranchCard'
import { BranchMap, type BranchPin } from './BranchMap'

type Props = { initial: Branch[] | null; locale: Locale; t: Dictionary['branches'] }
type Filter = 'all' | BranchGroup
type Geo =
  | { state: 'idle' | 'locating' }
  | { state: 'failed'; reason: 'denied' | 'unavailable' }
  | { state: 'ok'; lat: number; lng: number }

export function BranchFinder({ initial, locale, t }: Props) {
  const [branches, setBranches] = useState<Branch[] | null>(initial)
  const [failed, setFailed] = useState(false)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [selected, setSelected] = useState<string | null>(null)
  const [geo, setGeo] = useState<Geo>({ state: 'idle' })

  // The server couldn't reach the API when rendering, so try again from the browser
  useEffect(() => {
    if (initial) return
    const ctrl = new AbortController()
    getBranches(ctrl.signal)
      .then((list) => (list.length ? setBranches(list) : setFailed(true)))
      .catch(() => {})
    return () => ctrl.abort()
  }, [initial])

  const user = useMemo(() => (geo.state === 'ok' ? { lat: geo.lat, lng: geo.lng } : null), [geo])

  const list = useMemo(() => {
    const rows = (branches ?? [])
      .filter((b) => (filter === 'all' || branchGroup(b) === filter) && matchesQuery(b, query))
      .map((b) => ({
        b,
        km: user && hasCoords(b) ? distanceKm(user, { lat: b.latitude, lng: b.longitude }) : null,
      }))
    if (user) rows.sort((x, y) => (x.km ?? Infinity) - (y.km ?? Infinity))
    return rows
  }, [branches, filter, query, user])

  const pins = useMemo<BranchPin[]>(
    () =>
      list.flatMap(({ b }) =>
        hasCoords(b)
          ? [{ code: b.code, name: branchTitle(b, locale), lat: b.latitude, lng: b.longitude }]
          : [],
      ),
    [list, locale],
  )

  const select = (code: string) => {
    setSelected(code)
    document
      .getElementById(`branch-${code}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  const locate = () => {
    if (!navigator.geolocation) return setGeo({ state: 'failed', reason: 'unavailable' })
    setGeo({ state: 'locating' })
    const found = (pos: GeolocationPosition) => {
      setGeo({ state: 'ok', lat: pos.coords.latitude, lng: pos.coords.longitude })
      setFilter('all')
      setQuery('')
    }
    const failed = (err: GeolocationPositionError) =>
      setGeo({
        state: 'failed',
        reason: err.code === err.PERMISSION_DENIED ? 'denied' : 'unavailable',
      })
    navigator.geolocation.getCurrentPosition(
      found,
      (err) => {
        if (err.code === err.PERMISSION_DENIED) return failed(err)
        // A rough fix (Wi-Fi / cell) can come back empty; try once more with GPS
        navigator.geolocation.getCurrentPosition(found, failed, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 300000,
        })
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    )
  }

  const filters: Filter[] = ['all', 'island', 'mainland']

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 rounded-2xl border border-line bg-surface p-4">
        <div className="flex flex-wrap gap-3">
          <label htmlFor="branch-search" className="sr-only">
            {t.search}
          </label>
          <input
            id="branch-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.search}
            className="min-w-0 flex-[1_1_260px] rounded-xl border-[1.5px] border-line bg-bg px-4 py-3 placeholder:text-muted focus:border-navy focus:outline-none"
          />
          <button
            type="button"
            onClick={locate}
            disabled={geo.state === 'locating'}
            className="flex items-center justify-center gap-2 rounded-xl bg-sun px-5 py-3 font-semibold text-on-sun hover:brightness-95 disabled:opacity-70 max-sm:w-full"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
              <circle cx="12" cy="12" r="7" />
            </svg>
            {geo.state === 'locating' ? t.locating : t.nearMe}
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2" role="group">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium ${filter === f ? 'bg-navy text-bg' : 'bg-chip text-navy hover:brightness-95'}`}
            >
              {t[f]}
            </button>
          ))}
          {branches && (
            <span className="ml-auto text-sm text-muted" aria-live="polite">
              {list.length} {t.count}
            </span>
          )}
        </div>
        {geo.state === 'failed' && (
          <p className="text-sm text-danger">
            {geo.reason === 'denied' ? t.locateDenied : t.locateUnavailable}
          </p>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-start">
        <div className="order-last grid content-start gap-3 lg:order-none lg:max-h-[640px] lg:overflow-y-auto lg:pr-1">
          {!branches &&
            !failed &&
            Array.from({ length: 4 }, (_, i) => (
              <div
                key={i}
                className="h-36 animate-pulse rounded-2xl border border-line bg-surface"
              />
            ))}
          {failed && <p className="text-sm text-danger">{t.loadFailed}</p>}
          {branches && list.length === 0 && <p className="text-sm text-muted">{t.none}</p>}
          {list.map(({ b, km }) => (
            <BranchCard
              key={b.code}
              branch={b}
              locale={locale}
              t={t}
              active={selected === b.code}
              distance={km}
              onSelect={() => select(b.code)}
            />
          ))}
        </div>
        <div
          className="relative h-72 overflow-hidden rounded-2xl border border-line md:h-[420px] lg:sticky lg:top-20 lg:h-[640px]"
          aria-label={t.mapTitle}
          role="region"
        >
          {branches && <BranchMap pins={pins} selected={selected} user={user} onSelect={select} />}
        </div>
      </div>
    </div>
  )
}
