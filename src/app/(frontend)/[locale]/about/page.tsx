import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { RichText } from '@/components/content/RichText'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { getAboutPage, mediaUrl } from '@/lib/content'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const about = await getAboutPage(locale)
  const image = mediaUrl(about?.seo?.image) ?? mediaUrl(about?.image)
  return {
    title: about?.seo?.title || about?.title || getDictionary(locale).about.title,
    description: about?.seo?.description || about?.intro || undefined,
    alternates: { canonical: `/${locale}/about`, languages: { th: '/th/about', en: '/en/about' } },
    openGraph: image ? { images: [image] } : undefined,
  }
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale).about
  const about = await getAboutPage(locale)
  const image = mediaUrl(about?.image)
  const stats = about?.stats ?? []

  return (
    <div className="mx-auto grid max-w-4xl gap-8 px-4 py-8">
      <header className="grid gap-2">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">
          {about?.title || t.title}
        </h1>
        {about?.intro && <p className="text-lg leading-relaxed text-muted">{about.intro}</p>}
      </header>
      {image && (
        // eslint-disable-next-line @next/next/no-img-element -- CMS uploads are served as-is
        <img src={image} alt="" className="aspect-video w-full rounded-2xl object-cover" />
      )}
      {stats.length > 0 && (
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.id}
              className="grid gap-1 rounded-2xl border border-line bg-surface p-4 text-center"
            >
              <dt className="order-2 text-sm text-muted">{s.label}</dt>
              <dd className="order-1 font-display text-2xl font-bold text-navy">{s.value}</dd>
            </div>
          ))}
        </dl>
      )}
      <RichText data={about?.content} />
    </div>
  )
}
