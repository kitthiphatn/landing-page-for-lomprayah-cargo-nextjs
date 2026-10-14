import type { Branch, Shipment, TrackError, TrackResult } from './types'

// In production on lomprayahcargo.com this is the API itself, so each visitor's browser calls it
// with its own IP (the API allows 60 requests/minute per IP). Elsewhere (local dev, previews) it is
// `/tracking-api`, which next.config.ts forwards to the API to get around CORS.
const BASE = (process.env.NEXT_PUBLIC_TRACKING_API || '/tracking-api').replace(/\/$/, '')

type Envelope<T> = { success: boolean; data?: T; error?: string }

function errorFor(status: number): TrackError {
  if (status === 404) return 'not_found'
  if (status === 429) return 'rate_limited'
  return 'server'
}

export async function trackShipment(number: string, signal?: AbortSignal): Promise<TrackResult> {
  try {
    // No Authorization header: the public endpoint returns masked data only without one
    const res = await fetch(`${BASE}/shipments/track/${encodeURIComponent(number)}`, {
      signal,
      cache: 'no-store',
    })
    if (!res.ok) return { number, ok: false, error: errorFor(res.status) }
    const body = (await res.json()) as Envelope<Shipment>
    if (!body.success || !body.data) return { number, ok: false, error: 'not_found' }
    return { number, ok: true, shipment: body.data }
  } catch (err) {
    if ((err as Error).name === 'AbortError') throw err
    return { number, ok: false, error: 'network' }
  }
}

const BRANCHES_KEY = 'lp_branches_v1'
const BRANCHES_TTL = 6 * 60 * 60 * 1000

// Branch list changes rarely, so keep it for a few hours to save the visitor's rate limit
export async function getBranches(signal?: AbortSignal): Promise<Branch[]> {
  try {
    const cached = JSON.parse(sessionStorage.getItem(BRANCHES_KEY) || 'null') as {
      at: number
      data: Branch[]
    } | null
    if (cached && Date.now() - cached.at < BRANCHES_TTL) return cached.data
  } catch {
    // Storage unavailable; fetch instead
  }
  try {
    const res = await fetch(`${BASE}/branches`, { signal })
    if (!res.ok) return []
    const body = (await res.json()) as Envelope<Branch[]>
    const data = body.data ?? []
    try {
      sessionStorage.setItem(BRANCHES_KEY, JSON.stringify({ at: Date.now(), data }))
    } catch {
      // ignore
    }
    return data
  } catch (err) {
    if ((err as Error).name === 'AbortError') throw err
    return []
  }
}
