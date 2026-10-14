import type { CollectionConfig } from 'payload'

import { contentHooks } from './shared'

export const Banners: CollectionConfig = {
  slug: 'banners',
  labels: {
    singular: { th: 'แบนเนอร์โปรโมชั่น', en: 'Promo banner' },
    plural: { th: 'แบนเนอร์โปรโมชั่น', en: 'Promo banners' },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'enabled', 'startsAt', 'endsAt'],
    description: {
      th: 'แสดงใต้ช่องค้นหาพัสดุในหน้าแรก ใช้รูป 1200×400 พิกเซล (3:1)',
      en: 'Shown below the tracking box on the homepage. Use 1200×400 px images (3:1).',
    },
  },
  access: { read: () => true },
  hooks: contentHooks,
  defaultSort: 'order',
  fields: [
    {
      name: 'title',
      label: { th: 'ชื่อแบนเนอร์', en: 'Title' },
      type: 'text',
      required: true,
      localized: true,
      admin: { description: { th: 'ใช้เป็นคำอธิบายรูป', en: 'Used as the image description' } },
    },
    {
      name: 'image',
      label: { th: 'รูป', en: 'Image' },
      type: 'upload',
      relationTo: 'media',
      required: true,
      localized: true,
    },
    { name: 'link', label: { th: 'ลิงก์ (ถ้ามี)', en: 'Link (optional)' }, type: 'text' },
    {
      name: 'enabled',
      label: { th: 'เปิดแสดง', en: 'Show' },
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'startsAt',
      label: { th: 'เริ่มแสดง', en: 'Starts' },
      type: 'date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'endsAt',
      label: { th: 'หยุดแสดง', en: 'Ends' },
      type: 'date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'order',
      label: { th: 'ลำดับ', en: 'Order' },
      type: 'number',
      defaultValue: 10,
      admin: { position: 'sidebar' },
    },
  ],
}
