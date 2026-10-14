import type { GlobalConfig } from 'payload'

import { revalidateSite } from '../lib/revalidate'

export const SERVICE_ICONS = ['boat', 'truck', 'box', 'clock', 'shield', 'store'] as const

export const HomeSections: GlobalConfig = {
  slug: 'home-sections',
  label: { th: 'เนื้อหาหน้าแรก', en: 'Homepage sections' },
  access: { read: () => true },
  hooks: { afterChange: [revalidateSite] },
  fields: [
    {
      name: 'services',
      label: { th: 'บริการ', en: 'Services' },
      type: 'array',
      maxRows: 6,
      labels: {
        singular: { th: 'บริการ', en: 'Service' },
        plural: { th: 'บริการ', en: 'Services' },
      },
      fields: [
        {
          name: 'icon',
          label: { th: 'ไอคอน', en: 'Icon' },
          type: 'select',
          defaultValue: 'box',
          options: [
            { label: { th: 'เรือ', en: 'Boat' }, value: 'boat' },
            { label: { th: 'รถ', en: 'Truck' }, value: 'truck' },
            { label: { th: 'กล่องพัสดุ', en: 'Parcel' }, value: 'box' },
            { label: { th: 'นาฬิกา', en: 'Clock' }, value: 'clock' },
            { label: { th: 'โล่ (ปลอดภัย)', en: 'Shield' }, value: 'shield' },
            { label: { th: 'ร้านค้า/สาขา', en: 'Store' }, value: 'store' },
          ],
        },
        {
          name: 'title',
          label: { th: 'ชื่อบริการ', en: 'Title' },
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'text',
          label: { th: 'คำอธิบาย', en: 'Description' },
          type: 'textarea',
          localized: true,
        },
      ],
    },
    {
      name: 'showRoutes',
      label: { th: 'แสดงเส้นทางยอดนิยม', en: 'Show popular routes' },
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showNews',
      label: { th: 'แสดงข่าวล่าสุด', en: 'Show latest news' },
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showFaq',
      label: { th: 'แสดงคำถามที่พบบ่อย', en: 'Show FAQs' },
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
