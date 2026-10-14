import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import '../globals.css'

import { AnnouncementBar } from '@/components/AnnouncementBar'
import { CookieConsent } from '@/components/CookieConsent'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { PopupSlides, type PopupSlide } from '@/components/PopupSlides'
import { ThemeProvider } from '@/components/ThemeProvider'
import { isLocale, locales } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { isPreview } from '@/lib/content'
import { getSiteContent } from '@/lib/payload'

// Refresh at least once a minute; admin edits also refresh immediately via the globals' hooks
export const revalidate = 60

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale)
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3005'),
    title: { default: 'Lomprayah Cargo', template: '%s · Lomprayah Cargo' },
    description: t.hero.subtitle,
    alternates: { languages: { th: '/th', en: '/en' } },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const t = getDictionary(locale)
  const content = await getSiteContent(locale)
  const preview = await isPreview()
  const siteName = content?.settings.siteName || 'Lomprayah Cargo'
  const popup = content?.popup
  const popupSlides: PopupSlide[] = (popup?.enabled ? (popup.slides ?? []) : []).flatMap((s) =>
    s.image && typeof s.image === 'object' && s.image.url
      ? [
          {
            src: s.image.url,
            mobileSrc:
              s.mobileImage && typeof s.mobileImage === 'object' ? s.mobileImage.url : null,
            alt: s.image.alt || '',
            link: s.link,
          },
        ]
      : [],
  )
  const brand =
    content?.settings.primaryColor && content.settings.primaryColor !== 'navy'
      ? `brand-${content.settings.primaryColor}`
      : ''

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`min-h-dvh bg-bg text-fg antialiased ${brand}`}>
        <ThemeProvider>
          {preview && (
            <div className="flex items-center justify-center gap-3 bg-sun px-4 py-1.5 text-sm font-medium text-[#1b1300]">
              {t.preview.banner}
              <a href={`/preview/exit?path=/${locale}`} className="underline">
                {t.preview.exit}
              </a>
            </div>
          )}
          <AnnouncementBar data={content?.announcement} />
          <Header locale={locale} t={t} siteName={siteName} />
          <main>{children}</main>
          <Footer t={t} settings={content?.settings} siteName={siteName} />
          {popupSlides.length > 0 && (
            <PopupSlides
              slides={popupSlides}
              version={popup?.updatedAt ?? ''}
              frequency={popup?.frequency === 'session' ? 'session' : 'day'}
              startsAt={popup?.startsAt}
              endsAt={popup?.endsAt}
              labels={t.popup}
            />
          )}
          <CookieConsent
            t={t.cookie}
            message={content?.cookie.message}
            policyUrl={content?.cookie.policyUrl}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
