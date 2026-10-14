import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { getSiteContent } from '@/lib/payload'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale).contact
  return {
    title: t.title,
    description: t.subtitle,
    alternates: {
      canonical: `/${locale}/contact`,
      languages: { th: '/th/contact', en: '/en/contact' },
    },
  }
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)
  const t = dict.contact
  const c = (await getSiteContent(locale))?.settings.contact

  const socials = [
    { label: 'LINE', href: c?.lineUrl, note: c?.lineId },
    { label: 'WhatsApp', href: c?.whatsappUrl },
    { label: 'Facebook', href: c?.facebookUrl },
    { label: 'Instagram', href: c?.instagramUrl },
    { label: 'TikTok', href: c?.tiktokUrl },
    { label: 'YouTube', href: c?.youtubeUrl },
  ].filter((s): s is { label: string; href: string; note?: string | null } => Boolean(s.href))

  return (
    <div className="mx-auto grid max-w-4xl gap-6 px-4 py-8">
      <header className="grid gap-1">
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">{t.title}</h1>
        <p className="text-muted">{t.subtitle}</p>
      </header>

      <dl className="grid gap-4 rounded-2xl border border-line bg-surface p-5 sm:grid-cols-2">
        {c?.phone && (
          <div className="grid gap-1">
            <dt className="text-sm text-muted">{t.phone}</dt>
            <dd>
              <a
                href={`tel:${c.phone.replace(/[^\d+]/g, '')}`}
                className="font-display text-xl font-semibold text-navy hover:underline"
              >
                {c.phone}
              </a>
            </dd>
          </div>
        )}
        {c?.hours && (
          <div className="grid gap-1">
            <dt className="text-sm text-muted">{t.hours}</dt>
            <dd className="font-medium">{c.hours}</dd>
          </div>
        )}
        {c?.email && (
          <div className="grid gap-1">
            <dt className="text-sm text-muted">{t.email}</dt>
            <dd>
              <a href={`mailto:${c.email}`} className="text-navy hover:underline">
                {c.email}
              </a>
            </dd>
          </div>
        )}
        {c?.address && (
          <div className="grid gap-1 sm:col-span-2">
            <dt className="text-sm text-muted">{t.address}</dt>
            <dd className="whitespace-pre-line">{c.address}</dd>
          </div>
        )}
      </dl>

      {socials.length > 0 && (
        <section className="grid gap-3">
          <h2 className="font-display text-lg font-semibold">{t.social}</h2>
          <div className="flex flex-wrap gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`rounded-xl px-4 py-2.5 font-medium ${s.label === 'LINE' ? 'bg-[#06c755] text-white' : 'border border-line bg-surface hover:bg-chip'}`}
              >
                {s.label}
                {s.note ? ` ${s.note}` : ''}
              </a>
            ))}
          </div>
        </section>
      )}

      <Link
        href={`/${locale}/branches`}
        className="flex items-center justify-between gap-4 rounded-2xl bg-navy p-5 text-bg hover:brightness-110"
      >
        <span className="grid gap-0.5">
          <span className="font-display text-lg font-semibold">{t.branchesTitle}</span>
          <span className="text-sm opacity-85">{t.branchesText}</span>
        </span>
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  )
}
