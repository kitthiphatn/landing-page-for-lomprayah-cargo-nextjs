import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { en } from '@payloadcms/translations/languages/en'
import { th } from '@payloadcms/translations/languages/th'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Routes } from './collections/Routes'
import { Faqs } from './collections/Faqs'
import { Banners } from './collections/Banners'
import { SiteSettings } from './globals/SiteSettings'
import { Announcement } from './globals/Announcement'
import { CookieConsent } from './globals/CookieConsent'
import { Popup } from './globals/Popup'
import { HomeSections } from './globals/HomeSections'
import { defaultLocale } from './i18n/config'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' · Lomprayah Cargo',
    },
  },
  // Admin panel UI language
  i18n: {
    supportedLanguages: { th, en },
    fallbackLanguage: 'th',
  },
  // Content language: every localized field is filled in for TH and EN
  localization: {
    locales: [
      { code: 'th', label: 'ไทย' },
      { code: 'en', label: 'English' },
    ],
    defaultLocale,
    fallback: true,
  },
  collections: [Posts, Routes, Faqs, Banners, Media, Users],
  globals: [SiteSettings, HomeSections, Announcement, Popup, CookieConsent],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // SQLite file lives in this site's own folder, so deploying never touches other sites' databases
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || 'file:./data/lp-cargo.db',
    },
    // Production applies pending migrations on start, so no shell commands are needed on Plesk
    prodMigrations: migrations,
  }),
  sharp,
  plugins: [],
})
