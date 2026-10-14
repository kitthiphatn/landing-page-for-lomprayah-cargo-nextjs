import type { MetadataRoute } from 'next'

import { locales } from '@/i18n/config'
import { listPosts, listRoutes } from '@/lib/content'
import { fetchBranches } from '@/lib/tracking/server'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3005').replace(/\/$/, '')
  const [branches, routes, posts] = await Promise.all([
    fetchBranches().then((b) => b ?? []),
    listRoutes('th'),
    listPosts('th', 1, 1000),
  ])
  const page = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${base}/th${path}`,
    changeFrequency: 'weekly',
    priority,
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${base}/${l}${path}`])) },
  })
  return [
    page('', 1),
    page('/routes', 0.8),
    page('/branches', 0.8),
    page('/news', 0.6),
    page('/faq', 0.6),
    page('/about', 0.5),
    page('/contact', 0.5),
    ...routes.map((r) => page(`/routes/${r.slug}`, 0.7)),
    ...(posts?.docs ?? []).map((p) => page(`/news/${p.slug}`, 0.5)),
    ...branches.map((b) => page(`/branches/${encodeURIComponent(b.code)}`, 0.6)),
  ]
}
