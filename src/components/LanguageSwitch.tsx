'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import type { Locale } from '@/i18n/config'

export function LanguageSwitch({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname()
  const target: Locale = locale === 'th' ? 'en' : 'th'
  const href = pathname.replace(/^\/(th|en)(?=\/|$)/, `/${target}`)

  return (
    <Link
      href={href}
      hrefLang={target}
      onClick={() => {
        document.cookie = `NEXT_LOCALE=${target}; path=/; max-age=31536000; samesite=lax`
      }}
      className="flex h-10 items-center rounded-full border border-line px-3 text-sm font-medium text-fg hover:bg-chip"
    >
      <span className={locale === 'th' ? 'text-navy' : 'text-muted'}>TH</span>
      <span className="mx-1 text-muted">/</span>
      <span className={locale === 'en' ? 'text-navy' : 'text-muted'}>EN</span>
      <span className="sr-only">{label}</span>
    </Link>
  )
}
