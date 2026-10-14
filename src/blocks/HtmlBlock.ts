import type { Block } from 'payload'

import { sanitize } from '../lib/sanitize'

// Raw HTML for writers who need it. Unsafe parts are stripped on save and again on display.
export const HtmlBlock: Block = {
  slug: 'html',
  labels: {
    singular: { th: 'HTML', en: 'HTML' },
    plural: { th: 'HTML', en: 'HTML' },
  },
  fields: [
    {
      name: 'html',
      label: 'HTML',
      type: 'code',
      required: true,
      admin: {
        language: 'html',
        description: {
          th: 'ระบบจะตัด <script>, onclick และโค้ดที่อาจอันตรายทิ้งอัตโนมัติ ฝัง iframe ได้เฉพาะ YouTube, Google Maps, Facebook, Vimeo, TikTok',
          en: 'Scripts, event handlers such as onclick and other unsafe code are removed. iframes only from YouTube, Google Maps, Facebook, Vimeo and TikTok.',
        },
      },
      hooks: {
        beforeChange: [({ value }) => (typeof value === 'string' ? sanitize(value) : value)],
      },
    },
  ],
}
