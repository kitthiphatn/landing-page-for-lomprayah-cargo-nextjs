import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import '../globals.css'

import { AnnouncementBar } from '@/components/AnnouncementBar'
import { Analytics } from '@/components/Analytics'
import { CookieConsent } from '@/components/CookieConsent'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { PopupSlides, type PopupSlide } from '@/components/PopupSlides'
import { ThemeProvider } from '@/components/ThemeProvider'
import { isLocale, locales } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { isPreview } from '@/lib/content'
import { getSiteContent } from '@/lib/payload'
import { activeThemeColors, themeCss } from '@/lib/theme'

// Ship icon in the brand navy, used until a favicon is uploaded in Site settings
const DEFAULT_ICON =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 34"><rect width="34" height="34" rx="7" fill="#132968"/><g fill="#fff"><path d="M4 19h26l-4 7H8z"/><rect x="10" y="12" width="12" height="6" rx="1"/><rect x="14" y="7" width="4" height="5"/></g></svg>',
  )

function mediaUrl(m: unknown): string | null {
  return m && typeof m === 'object' && 'url' in m && typeof m.url === 'string' ? m.url : null
}

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
  const content = await getSiteContent(locale)
  const favicon = mediaUrl(content?.settings.favicon)
  return {
    icons: favicon ? { icon: favicon, apple: favicon } : { icon: DEFAULT_ICON },
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
  const logoLight = mediaUrl(content?.settings.logo)
  const logo = logoLight ? { light: logoLight, dark: mediaUrl(content?.settings.logoDark) } : null
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
  const themeColors = activeThemeColors(content?.settings)
  const brand =
    !themeColors && content?.settings.primaryColor && content.settings.primaryColor !== 'navy'
      ? `brand-${content.settings.primaryColor}`
      : ''

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`min-h-dvh bg-bg text-fg antialiased ${brand}`}>
        {themeColors && <style>{themeCss(themeColors)}</style>}
        <ThemeProvider>
          {preview && (
            <div className="flex items-center justify-center gap-3 bg-sun px-4 py-1.5 text-sm font-medium text-on-sun">
              {t.preview.banner}
              <a href={`/preview/exit?path=/${locale}`} className="underline">
                {t.preview.exit}
              </a>
            </div>
          )}
          <AnnouncementBar data={content?.announcement} />
          <Header locale={locale} t={t} siteName={siteName} logo={logo} />
          <main>{children}</main>
          <Footer locale={locale} t={t} settings={content?.settings} siteName={siteName} />
          {popupSlides.length > 0 && (
            <PopupSlides
              slides={popupSlides}
              version={popup?.updatedAt ?? ''}
              frequency={popup?.frequency === 'session' ? 'session' : 'day'}
              startsAt={popup?.startsAt}
              endsAt={popup?.endsAt}
              autoplaySeconds={popup?.autoplay ? (popup.autoplaySeconds ?? 5) : null}
              framed={popup?.framed ?? true}
              labels={t.popup}
            />
          )}
          <CookieConsent
            t={t.cookie}
            message={content?.cookie.message}
            policyUrl={content?.cookie.policyUrl}
          />
          {!preview && content?.settings.analyticsId && (
            <Analytics id={content.settings.analyticsId.trim()} />
          )}
        </ThemeProvider>
      </body>
    </html>
  )
}
