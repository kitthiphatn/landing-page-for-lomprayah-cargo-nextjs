import Link from 'next/link'

import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'

import { LanguageSwitch } from './LanguageSwitch'
import { ThemeToggle } from './ThemeToggle'

export function Header({ locale, t, siteName }: { locale: Locale; t: Dictionary; siteName: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href={`/${locale}`} className="flex items-center gap-2 font-display text-lg font-bold text-navy">
          <svg width="28" height="20" viewBox="0 0 34 24" fill="currentColor" aria-hidden="true">
            <path d="M4 14h26l-4 7H8z" />
            <rect x="10" y="7" width="12" height="6" rx="1" />
            <rect x="14" y="2" width="4" height="5" />
          </svg>
          {siteName}
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href={`/${locale}#track`} className="hover:text-navy">{t.nav.track}</Link>
          <Link href={`/${locale}/branches`} className="hover:text-navy">{t.nav.branches}</Link>
          <Link href={`/${locale}#contact`} className="hover:text-navy">{t.nav.contact}</Link>
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitch locale={locale} label={t.language.switchTo} />
          <ThemeToggle labels={t.theme} />
        </div>
      </div>
    </header>
  )
}
