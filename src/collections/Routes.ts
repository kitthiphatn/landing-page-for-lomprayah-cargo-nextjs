import type { CollectionConfig } from 'payload'

import { contentHooks, publishedOrStaff, seoField, slugField } from './shared'

const codeDescription = {
  th: 'รหัสสาขาจากระบบหลัก เช่น USM, TAO, CPN (ดูได้ที่หน้า /th/branches)',
  en: 'Branch code from the main system, e.g. USM, TAO, CPN (listed on /en/branches)',
}

export const Routes: CollectionConfig = {
  slug: 'routes',
  labels: {
    singular: { th: 'เส้นทางส่งของ', en: 'Route' },
    plural: { th: 'เส้นทางส่งของ', en: 'Routes' },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'fromCode', 'toCode', 'featured', '_status'],
    preview: (doc, { locale }) =>
      doc?.slug ? `/preview?path=${encodeURIComponent(`/${locale}/routes/${doc.slug}`)}` : null,
  },
  access: { read: publishedOrStaff },
  versions: { drafts: true },
  hooks: contentHooks,
  defaultSort: 'order',
  fields: [
    {
      name: 'title',
      label: { th: 'ชื่อเส้นทาง', en: 'Route name' },
      type: 'text',
      required: true,
      localized: true,
      admin: { placeholder: 'ส่งของ สมุย → เกาะเต่า' },
    },
    slugField,
    {
      type: 'row',
      fields: [
        {
          name: 'fromCode',
          label: { th: 'สาขาต้นทาง', en: 'From branch' },
          type: 'text',
          required: true,
          admin: { description: codeDescription },
        },
        {
          name: 'toCode',
          label: { th: 'สาขาปลายทาง', en: 'To branch' },
          type: 'text',
          required: true,
          admin: { description: codeDescription },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'transitTime',
          label: { th: 'ระยะเวลาส่ง', en: 'Transit time' },
          type: 'text',
          localized: true,
          admin: { placeholder: 'ถึงภายใน 1 วัน' },
        },
        {
          name: 'priceFrom',
          label: { th: 'ค่าส่งเริ่มต้น', en: 'Price from' },
          type: 'text',
          localized: true,
          admin: { placeholder: '50 บาท' },
        },
      ],
    },
    {
      name: 'summary',
      label: { th: 'คำโปรย', en: 'Summary' },
      type: 'textarea',
      localized: true,
      maxLength: 240,
    },
    {
      name: 'content',
      label: { th: 'รายละเอียด', en: 'Details' },
      type: 'richText',
      localized: true,
    },
    {
      name: 'faqs',
      label: { th: 'คำถามที่พบบ่อยของเส้นทางนี้', en: 'FAQs for this route' },
      type: 'relationship',
      relationTo: 'faqs',
      hasMany: true,
    },
    {
      name: 'featured',
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
      admin: { position: 'sidebar' },
    },
    seoField,
  ],
}
