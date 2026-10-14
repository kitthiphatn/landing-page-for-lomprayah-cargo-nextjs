import type { Block } from 'payload'

import { sanitizeBlock } from '../lib/sanitize'

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
          th: 'ระบบจะตัด <script>, onclick และโค้ดที่อาจอันตรายทิ้งอัตโนมัติ ฝัง iframe ได้เฉพาะ YouTube, Google Maps, Facebook, Vimeo, TikTok · วางหน้า HTML ทั้งหน้า (มี <head>, <style>, Tailwind, Font Awesome) ได้ จะแสดงในกรอบแยกของตัวเอง',
          en: 'Scripts, event handlers such as onclick and other unsafe code are removed. iframes only from YouTube, Google Maps, Facebook, Vimeo and TikTok. A full page (with <head>, <style>, Tailwind or Font Awesome) is shown in its own frame.',
        },
      },
      hooks: {
        beforeChange: [({ value }) => (typeof value === 'string' ? sanitizeBlock(value) : value)],
      },
    },
  ],
}
