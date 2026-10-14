import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { BranchFinder } from '@/components/branches/BranchFinder'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { fetchBranches } from '@/lib/tracking/server'

export const revalidate = 3600

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale).branches
  return {
    title: t.title,
    description: t.metaDescription,
    alternates: {
      canonical: `/${locale}/branches`,
      languages: { th: '/th/branches', en: '/en/branches' },
    },
  }
}

export default async function BranchesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale).branches
  const branches = await fetchBranches()

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8">
      <header className="grid gap-1">
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">{t.title}</h1>
        <p className="text-muted">{t.subtitle}</p>
      </header>
      <BranchFinder initial={branches} locale={locale} t={t} />
    </div>
  )
}
