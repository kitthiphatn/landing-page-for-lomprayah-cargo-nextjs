import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3005').replace(/\/$/, '')
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api', '/tracking-api', '/th/track', '/en/track'],
    },
    sitemap: `${base}/sitemap.xml`,
  }
}
