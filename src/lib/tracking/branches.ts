import type { Locale } from '@/i18n/config'

import type { Branch } from './types'

export type BranchGroup = 'island' | 'mainland'

export function branchTitle(b: Branch, locale: Locale): string {
  return (locale === 'en' && b.nameEn) || b.name
}

// The API has no province field. `branchKind` is one of mainland, gulf_hub, gulf_island,
// sea_terminus or andaman_road; only gulf_island is an island, and any future value counts as mainland
export function branchGroup(b: Branch): BranchGroup {
  return b.branchKind === 'gulf_island' ? 'island' : 'mainland'
}

export function hasCoords(b: Branch): b is Branch & { latitude: number; longitude: number } {
  return b.latitude != null && b.longitude != null
}

const DAY_NAMES: Record<Locale, string[]> = {
  // operatingHours.days is the ISO weekday: 1 = Monday ... 7 = Sunday
  th: ['จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.', 'อา.'],
  en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
}

export function formatHours(h: Branch['operatingHours'], locale: Locale, everyDay: string) {
  if (!h) return null
  const days = [...new Set(h.days)].filter((d) => d >= 1 && d <= 7).sort((a, b) => a - b)
  const time = `${h.open}–${h.close}`
  if (days.length === 7) return `${everyDay} ${time}`
  return `${days.map((d) => DAY_NAMES[locale][d - 1]).join(' ')} ${time}`
}

export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const rad = (d: number) => (d * Math.PI) / 180
  const dLat = rad(b.lat - a.lat)
  const dLng = rad(b.lng - a.lng)
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 6371 * 2 * Math.asin(Math.sqrt(h))
}

export function directionsUrl(b: Branch): string {
  const dest = hasCoords(b) ? `${b.latitude},${b.longitude}` : b.address || b.name
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`
}

export function matchesQuery(b: Branch, q: string): boolean {
  const needle = q.trim().toLowerCase()
  if (!needle) return true
  return [b.code, b.name, b.nameEn, b.address].some((v) => v?.toLowerCase().includes(needle))
}
