import type { GlobalConfig } from 'payload'

import { revalidateSite } from '../lib/revalidate'

export const Popup: GlobalConfig = {
  slug: 'popup',
  label: { th: 'ป๊อปอัปประกาศ (สไลด์รูป)', en: 'Announcement popup (slides)' },
  admin: {
    description: {
      th: 'แสดงเป็นหน้าต่างสไลด์รูป 16:9 ทันทีที่ลูกค้าเข้าเว็บ ใช้รูปขนาด 1600×900 พิกเซล',
      en: 'Shown as a 16:9 image slider as soon as visitors open the site. Use 1600×900 px images.',
    },
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateSite],
  },
  fields: [
    {
      name: 'enabled',
      label: { th: 'เปิดแสดง', en: 'Show' },
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'frequency',
      label: { th: 'แสดงบ่อยแค่ไหน', en: 'How often' },
      type: 'select',
      defaultValue: 'day',
      options: [
        { label: { th: 'วันละครั้งต่อคน', en: 'Once a day per visitor' }, value: 'day' },
        { label: { th: 'ทุกครั้งที่เปิดเว็บใหม่', en: 'Every new visit' }, value: 'session' },
      ],
      admin: {
        description: {
          th: 'เมื่อแก้ไขสไลด์ ลูกค้าจะเห็นป๊อปอัปใหม่อีกครั้งเสมอ',
          en: 'Visitors always see the popup again after the slides are changed.',
        },
      },
    },
    {
      type: 'row',
      fields: [
        { name: 'startsAt', label: { th: 'เริ่มแสดง', en: 'Starts' }, type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
        { name: 'endsAt', label: { th: 'สิ้นสุด', en: 'Ends' }, type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
      ],
    },
    {
      name: 'slides',
      label: { th: 'สไลด์', en: 'Slides' },
      labels: {
        singular: { th: 'สไลด์', en: 'Slide' },
        plural: { th: 'สไลด์', en: 'Slides' },
      },
      type: 'array',
      minRows: 1,
      maxRows: 10,
      fields: [
        {
          name: 'image',
          label: { th: 'รูป (16:9)', en: 'Image (16:9)' },
          type: 'upload',
          relationTo: 'media',
          required: true,
          localized: true,
        },
        {
          name: 'link',
          label: { th: 'ลิงก์เมื่อกดรูป (ถ้ามี)', en: 'Link when clicked (optional)' },
          type: 'text',
        },
      ],
    },
  ],
}
