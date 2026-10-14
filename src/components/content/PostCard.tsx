import Link from 'next/link'

import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'
import { mediaUrl } from '@/lib/content'
import type { Post } from '@/payload-types'

export function formatDate(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === 'th' ? 'th-TH' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Bangkok',
  }).format(new Date(iso))
}

export function PostCard({
  post,
  locale,
  t,
}: {
  post: Post
  locale: Locale
  t: Dictionary['news']
}) {
  const cover = mediaUrl(post.cover)
  return (
    <Link
      href={`/${locale}/news/${post.slug}`}
      className="group grid content-start overflow-hidden rounded-2xl border border-line bg-surface hover:border-navy/40"
    >
      <div className="aspect-video bg-chip">
        {cover && (
          // eslint-disable-next-line @next/next/no-img-element -- CMS uploads are served as-is
          <img src={cover} alt="" className="h-full w-full object-cover" loading="lazy" />
        )}
      </div>
      <div className="grid gap-1.5 p-4">
        <p className="text-xs text-muted">
          {t.categories[post.category]} · {formatDate(post.publishedAt, locale)}
        </p>
        <h3 className="font-display font-semibold group-hover:text-navy">{post.title}</h3>
        {post.excerpt && <p className="line-clamp-2 text-sm text-muted">{post.excerpt}</p>}
      </div>
    </Link>
  )
}
