import type { Branch } from './types'

const UPSTREAM = (
  process.env.TRACKING_API_UPSTREAM || 'https://api.lomprayahcargo.com/api'
).replace(/\/$/, '')

// Server-side copy of the branch list for the indexable branch pages. Cached for an hour, so it
// costs the server's IP about one request per hour against the API's rate limit.
// Returns null when the API can't be reached, so pages can fall back to fetching in the browser.
export async function fetchBranches(): Promise<Branch[] | null> {
  try {
    const res = await fetch(`${UPSTREAM}/branches`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return null
    const body = (await res.json()) as { success: boolean; data?: Branch[] }
    return body.success && body.data ? body.data : null
  } catch {
    return null
  }
}
