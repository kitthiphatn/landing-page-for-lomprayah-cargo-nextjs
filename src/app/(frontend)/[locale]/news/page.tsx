import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { PostCard } from '@/components/content/PostCard'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { listPosts } from '@/lib/content'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale).news
  return {
    title: t.title,
    description: t.subtitle,
    alternates: { canonical: `/${locale}/news`, languages: { th: '/th/news', en: '/en/news' } },
  }
}

export default async function NewsPage({ params, searchParams }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale).news
  const page = Math.max(1, Number((await searchParams).page) || 1)
  const result = await listPosts(locale, page)
  const posts = result?.docs ?? []

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8">
      <header className="grid gap-1">
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">{t.title}</h1>
        <p className="text-muted">{t.subtitle}</p>
      </header>
      {posts.length === 0 ? (
        <p className="text-muted">{t.none}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} locale={locale} t={t} />
          ))}
        </div>
      )}
      {result && result.totalPages > 1 && (
        <nav className="flex justify-between text-sm font-medium">
          {result.hasPrevPage ? (
            <Link href={`/${locale}/news?page=${page - 1}`} className="text-navy hover:underline">
              ← {t.newer}
            </Link>
          ) : (
            <span />
          )}
          {result.hasNextPage && (
            <Link href={`/${locale}/news?page=${page + 1}`} className="text-navy hover:underline">
              {t.older} →
            </Link>
          )}
        </nav>
      )}
    </div>
  )
}
