import config from '@payload-config'
import { getPayload } from 'payload'

import type { Locale } from '@/i18n/config'

// Reads the CMS globals for one language; returns null if the database is not ready yet
export async function getSiteContent(locale: Locale) {
  try {
    const payload = await getPayload({ config })
    const [settings, announcement, cookie, popup] = await Promise.all([
      payload.findGlobal({ slug: 'site-settings', locale, depth: 1 }),
      payload.findGlobal({ slug: 'announcement', locale }),
      payload.findGlobal({ slug: 'cookie-consent', locale }),
      payload.findGlobal({ slug: 'popup', locale, depth: 1 }),
    ])
    return { settings, announcement, cookie, popup }
  } catch {
    return null
  }
}
