import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { FaqList, faqJsonLd } from '@/components/content/FaqList'
import { JsonLd } from '@/components/content/JsonLd'
import { FAQ_CATEGORIES } from '@/collections/Faqs'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { listFaqs } from '@/lib/content'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale).faq
  return {
    title: t.title,
    description: t.subtitle,
    alternates: { canonical: `/${locale}/faq`, languages: { th: '/th/faq', en: '/en/faq' } },
  }
}

export default async function FaqPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale).faq
  const faqs = await listFaqs(locale)

  return (
    <div className="mx-auto grid max-w-3xl gap-8 px-4 py-8">
      {faqs.length > 0 && <JsonLd data={faqJsonLd(faqs)} />}
      <header className="grid gap-1">
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">{t.title}</h1>
        <p className="text-muted">{t.subtitle}</p>
      </header>
      {faqs.length === 0 && <p className="text-muted">{t.none}</p>}
      {FAQ_CATEGORIES.map((c) => {
        const items = faqs.filter((f) => f.category === c)
        if (items.length === 0) return null
        return (
          <section key={c} className="grid gap-3">
            <h2 className="font-display text-lg font-semibold">{t.categories[c]}</h2>
            <FaqList faqs={items} />
          </section>
        )
      })}
    </div>
  )
}
