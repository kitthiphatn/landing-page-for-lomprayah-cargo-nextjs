import config from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload, type Where } from 'payload'

import type { Locale } from '@/i18n/config'
import type { Media } from '@/payload-types'

import { isWithinWindow } from './schedule'

// Content queries for the public pages. Each returns empty results instead of throwing when the
// database isn't ready, so a page still renders with its built-in text.

async function db() {
  try {
    return await getPayload({ config })
  } catch {
    return null
  }
}

// Admin "Preview" turns on Next's draft mode, so editors see unpublished changes
export async function isPreview() {
  try {
    return (await draftMode()).isEnabled
  } catch {
    return false
  }
}

const published: Where = { _status: { equals: 'published' } }
const livePosts = (): Where => ({
  and: [published, { publishedAt: { less_than_equal: new Date().toISOString() } }],
})

export function mediaUrl(m: number | Media | null | undefined): string | null {
  return m && typeof m === 'object' && m.url ? m.url : null
}

export async function getHomeContent(locale: Locale) {
  const payload = await db()
  if (!payload) return null
  try {
    const [sections, banners, routes, faqs, posts] = await Promise.all([
      payload.findGlobal({ slug: 'home-sections', locale }),
      payload.find({
        collection: 'banners',
        locale,
        where: { enabled: { equals: true } },
        limit: 10,
      }),
      payload.find({
        collection: 'routes',
        locale,
        where: { and: [published, { featured: { equals: true } }] },
        limit: 6,
      }),
      payload.find({
        collection: 'faqs',
        locale,
        where: { showOnHome: { equals: true } },
        limit: 8,
      }),
      payload.find({ collection: 'posts', locale, where: livePosts(), limit: 3, depth: 1 }),
    ])
    return {
      sections,
      banners: banners.docs.filter((b) => isWithinWindow(b.startsAt, b.endsAt)),
      routes: routes.docs,
      faqs: faqs.docs,
      posts: posts.docs,
    }
  } catch {
    return null
  }
}

export async function listPosts(locale: Locale, page = 1, limit = 12) {
  const payload = await db()
  if (!payload) return null
  try {
    return await payload.find({
      collection: 'posts',
      locale,
      where: livePosts(),
      limit,
      page,
      depth: 1,
    })
  } catch {
    return null
  }
}

export async function getPost(locale: Locale, slug: string) {
  const payload = await db()
  if (!payload) return null
  const draft = await isPreview()
  try {
    const res = await payload.find({
      collection: 'posts',
      locale,
      draft,
      where: draft
        ? { slug: { equals: slug } }
        : { and: [livePosts(), { slug: { equals: slug } }] },
      limit: 1,
      depth: 1,
    })
    return res.docs[0] ?? null
  } catch {
    return null
  }
}

export async function listRoutes(locale: Locale, where?: Where) {
  const payload = await db()
  if (!payload) return []
  try {
    const res = await payload.find({
      collection: 'routes',
      locale,
      where: where ? { and: [published, where] } : published,
      limit: 100,
      depth: 0,
    })
    return res.docs
  } catch {
    return []
  }
}

export async function getRoute(locale: Locale, slug: string) {
  const payload = await db()
  if (!payload) return null
  const draft = await isPreview()
  try {
    const res = await payload.find({
      collection: 'routes',
      locale,
      draft,
      where: draft ? { slug: { equals: slug } } : { and: [published, { slug: { equals: slug } }] },
      limit: 1,
      depth: 1,
    })
    return res.docs[0] ?? null
  } catch {
    return null
  }
}

export async function listFaqs(locale: Locale) {
  const payload = await db()
  if (!payload) return []
  try {
    const res = await payload.find({ collection: 'faqs', locale, limit: 200 })
    return res.docs
  } catch {
    return []
  }
}

export async function getAboutPage(locale: Locale) {
  const payload = await db()
  if (!payload) return null
  try {
    return await payload.findGlobal({ slug: 'about-page', locale, depth: 1 })
  } catch {
    return null
  }
}
