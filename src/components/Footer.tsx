import type { Dictionary } from '@/i18n/dictionaries'
import type { SiteSetting } from '@/payload-types'

import { CookieSettingsLink } from './CookieSettingsLink'

export function Footer({
  t,
  settings,
  siteName,
}: {
  t: Dictionary
  settings: SiteSetting | null | undefined
  siteName: string
}) {
  const contact = settings?.contact
  return (
    <footer id="contact" className="mt-24 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 text-sm md:grid-cols-2">
        <div className="grid gap-2">
          <p className="font-display text-lg font-bold text-navy">{siteName}</p>
          {settings?.footerNote && <p className="max-w-prose text-muted">{settings.footerNote}</p>}
        </div>
        <ul className="grid gap-1 md:justify-self-end">
          {contact?.phone && (
            <li>
              ☎ <span className="select-all">{contact.phone}</span>
            </li>
          )}
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
        </ul>
      </div>
      <p className="border-t border-line px-4 py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} {siteName}. {t.footer.rights} ·{' '}
        <CookieSettingsLink label={t.cookie.reopen} />
      </p>
    </footer>
  )
}
