import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { JsonLd } from '@/components/content/JsonLd'
import { formatDate } from '@/components/content/PostCard'
import { RichText } from '@/components/content/RichText'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { getPost, mediaUrl } from '@/lib/content'

type Props = { params: Promise<{ locale: string; slug: string }> }

// Rendered on first visit, then cached; admin edits refresh it right away
export function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const post = await getPost(locale, slug)
  if (!post) return {}
  const image = mediaUrl(post.seo?.image) ?? mediaUrl(post.cover)
  return {
    title: post.seo?.title || post.title,
    description: post.seo?.description || post.excerpt || undefined,
    alternates: {
      canonical: `/${locale}/news/${post.slug}`,
      languages: { th: `/th/news/${post.slug}`, en: `/en/news/${post.slug}` },
    },
    openGraph: {
      type: 'article',
      publishedTime: post.publishedAt,
      images: image ? [image] : undefined,
    },
  }
}

export default async function PostPage({ params }: Props) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const post = await getPost(locale, slug)
  if (!post) notFound()
  const t = getDictionary(locale).news
  const cover = mediaUrl(post.cover)

  return (
    <article className="mx-auto grid max-w-3xl gap-6 px-4 py-8">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          image: cover ?? undefined,
          publisher: { '@type': 'Organization', name: 'Lomprayah Cargo' },
        }}
      />
      <nav className="text-sm">
        <Link href={`/${locale}/news`} className="text-navy hover:underline">
          ← {t.back}
        </Link>
      </nav>
      <header className="grid gap-2">
        <p className="text-sm text-muted">
          {t.categories[post.category]} ·{' '}
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time>
        </p>
        <h1 className="font-display text-3xl leading-tight font-semibold sm:text-4xl">
          {post.title}
        </h1>
        {post.excerpt && <p className="text-lg text-muted">{post.excerpt}</p>}
      </header>
      {cover && (
        // eslint-disable-next-line @next/next/no-img-element -- CMS uploads are served as-is
        <img src={cover} alt="" className="aspect-video w-full rounded-2xl object-cover" />
      )}
      <RichText data={post.content} />
      {post.sourceUrl && (
        <a
          href={post.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-fit rounded-xl border border-line px-5 py-2.5 font-medium hover:bg-chip"
        >
          {t.readMore} →
        </a>
      )}
    </article>
  )
}
