import Link from 'next/link'

import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'
import type { SiteSetting } from '@/payload-types'

import { CookieSettingsLink } from './CookieSettingsLink'

export function Footer({
  locale,
  t,
  settings,
  siteName,
}: {
  locale: Locale
  t: Dictionary
  settings: SiteSetting | null | undefined
  siteName: string
}) {
  const contact = settings?.contact
  const links = [
    { href: `/${locale}/about`, label: t.nav.about },
    { href: `/${locale}/contact`, label: t.nav.contact },
    { href: `/${locale}/routes`, label: t.nav.routes },
    { href: `/${locale}/branches`, label: t.nav.branches },
    { href: `/${locale}/news`, label: t.nav.news },
    { href: `/${locale}/faq`, label: t.nav.faq },
  ]
  const socials = [
    { label: 'Facebook', href: contact?.facebookUrl },
    { label: 'Instagram', href: contact?.instagramUrl },
    { label: 'TikTok', href: contact?.tiktokUrl },
    { label: 'YouTube', href: contact?.youtubeUrl },
  ].filter((s) => s.href)

  return (
    <footer id="contact" className="mt-24 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm md:grid-cols-3">
        <div className="grid content-start gap-2">
          <p className="font-display text-lg font-bold text-navy">{siteName}</p>
          {settings?.footerNote && <p className="max-w-prose text-muted">{settings.footerNote}</p>}
          {contact?.address && <p className="whitespace-pre-line text-muted">{contact.address}</p>}
        </div>
        <ul className="grid content-start grid-cols-2 gap-x-6 gap-y-2">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="hover:text-navy">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="grid content-start gap-1 md:justify-self-end">
          {contact?.phone && (
            <li>
              ☎{' '}
              <a href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`} className="hover:text-navy">
                {contact.phone}
              </a>
            </li>
          )}
          {contact?.hours && <li className="text-muted">{contact.hours}</li>}
          {contact?.lineId && (
            <li>
              LINE:{' '}
              {contact.lineUrl ? (
                <a className="text-navy underline" href={contact.lineUrl}>
                  {contact.lineId}
                </a>
              ) : (
                contact.lineId
              )}
            </li>
          )}
          {contact?.email && <li className="select-all">{contact.email}</li>}
          {socials.length > 0 && (
            <li className="flex flex-wrap gap-3 pt-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-navy"
                >
                  {s.label}
                </a>
              ))}
            </li>
          )}
        </ul>
      </div>
      <p
        className="border-t border-line px-4 py-4 text-center text-xs text-muted"
        data-v="QnVpbHQgYnkgS2l0dGhpcGhhdCB3aXRoIENsYXVkZSAoQW50aHJvcGljKSDCtyAyMDI2"
      >
        © {new Date().getFullYear()} {siteName}. {t.footer.rights} ·{' '}
        <CookieSettingsLink label={t.cookie.reopen} />
      </p>
    </footer>
  )
}
