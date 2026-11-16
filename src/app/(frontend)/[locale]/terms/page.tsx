import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { isLocale, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { getShippingTerms } from '@/lib/content'
import { DEFAULT_SHIPPING_TERMS, SHIPPING_TERMS_FORM_CODE } from '@/lib/shippingTerms'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale).terms
  return {
    title: t.title,
    description: t.subtitle,
    alternates: { canonical: `/${locale}/terms`, languages: { th: '/th/terms', en: '/en/terms' } },
  }
}

async function loadTerms(locale: Locale) {
  const doc = await getShippingTerms(locale)
  const saved = (doc?.items ?? []).map((i) => i.text?.trim()).filter((t): t is string => !!t)
  return {
    intro: doc?.intro,
    items: saved.length > 0 ? saved : DEFAULT_SHIPPING_TERMS[locale],
    formCode: doc?.formCode ?? SHIPPING_TERMS_FORM_CODE,
  }
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale).terms
  const { intro, items, formCode } = await loadTerms(locale)

  return (
    <div className="mx-auto grid max-w-3xl gap-8 px-4 py-8">
      <header className="grid gap-1">
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">{t.title}</h1>
        <p className="text-muted">{intro || t.subtitle}</p>
      </header>
      <ol className="grid gap-3">
        {items.map((text, i) => {
          const [main, ...rest] = text.split('\n').map((l) => l.trim())
          const subs = rest.filter(Boolean).map((l) => l.replace(/^[-•]\s*/, ''))
          return (
            <li
              key={i}
              className="grid grid-cols-[2rem_1fr] gap-2 rounded-2xl border border-line bg-surface p-4 leading-relaxed"
            >
              <span className="grid size-7 place-items-center rounded-full bg-chip font-display text-sm font-semibold text-navy">
                {i + 1}
              </span>
              <div className="grid gap-1.5">
                <p>{main}</p>
                {subs.length > 0 && (
                  <ul className="grid gap-1 text-muted">
                    {subs.map((s, j) => (
                      <li key={j} className="flex gap-2">
                        <span aria-hidden="true" className="text-sun">
                          •
                        </span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          )
        })}
      </ol>
      {formCode && <p className="text-right text-xs text-muted">{formCode}</p>}
    </div>
  )
}
