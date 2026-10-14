import type { MetadataRoute } from 'next'

import { locales } from '@/i18n/config'
import { fetchBranches } from '@/lib/tracking/server'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/$/, '')
  const branches = (await fetchBranches()) ?? []
  const page = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${base}/th${path}`,
    changeFrequency: 'weekly',
    priority,
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${base}/${l}${path}`])) },
  })
  return [
    page('', 1),
    page('/branches', 0.8),
    ...branches.map((b) => page(`/branches/${encodeURIComponent(b.code)}`, 0.6)),
  ]
}
