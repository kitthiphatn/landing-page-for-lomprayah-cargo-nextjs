import type { CollectionConfig } from 'payload'

import { contentHooks } from './shared'

export const FAQ_CATEGORIES = ['shipping', 'tracking', 'payment', 'general'] as const

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  labels: {
    singular: { th: 'คำถามที่พบบ่อย', en: 'FAQ' },
    plural: { th: 'คำถามที่พบบ่อย', en: 'FAQs' },
  },
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'category', 'showOnHome', 'order'],
  },
  access: { read: () => true },
  hooks: contentHooks,
  defaultSort: 'order',
  fields: [
    {
      name: 'question',
      label: { th: 'คำถาม', en: 'Question' },
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'answer',
      label: { th: 'คำตอบ', en: 'Answer' },
      type: 'textarea',
      required: true,
      localized: true,
    },
    {
      name: 'category',
      label: { th: 'หมวด', en: 'Category' },
      type: 'select',
      required: true,
      defaultValue: 'shipping',
      admin: { position: 'sidebar' },
      options: [
        { label: { th: 'การส่งพัสดุ', en: 'Shipping' }, value: 'shipping' },
        { label: { th: 'การติดตามพัสดุ', en: 'Tracking' }, value: 'tracking' },
        { label: { th: 'ค่าส่งและการชำระเงิน', en: 'Rates and payment' }, value: 'payment' },
        { label: { th: 'ทั่วไป', en: 'General' }, value: 'general' },
      ],
    },
    {
      name: 'showOnHome',
      label: { th: 'แสดงในหน้าแรก', en: 'Show on homepage' },
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'order',
      label: { th: 'ลำดับ', en: 'Order' },
      type: 'number',
      defaultValue: 10,
      admin: {
        position: 'sidebar',
        description: { th: 'เลขน้อยขึ้นก่อน', en: 'Lower numbers come first' },
      },
    },
  ],
}
