import type { GlobalConfig } from 'payload'

import { revalidateSite } from '../lib/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: { th: 'ตั้งค่าเว็บไซต์', en: 'Site settings' },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateSite],
  },
  fields: [
    {
      name: 'siteName',
      label: { th: 'ชื่อเว็บไซต์', en: 'Site name' },
      type: 'text',
      localized: true,
      defaultValue: 'Lomprayah Cargo',
    },
    {
      name: 'logo',
      label: { th: 'โลโก้', en: 'Logo' },
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'primaryColor',
      label: { th: 'สีหลัก', en: 'Primary color' },
      type: 'select',
      defaultValue: 'navy',
      options: [
        { label: { th: 'น้ำเงินลมพระยา', en: 'Lomprayah navy' }, value: 'navy' },
        { label: { th: 'ฟ้าทะเล', en: 'Sea teal' }, value: 'sea' },
        { label: { th: 'ส้มทอง', en: 'Sunset amber' }, value: 'amber' },
      ],
    },
    {
      type: 'group',
      name: 'contact',
      label: { th: 'ช่องทางติดต่อ', en: 'Contact' },
      fields: [
        { name: 'phone', label: { th: 'เบอร์โทร', en: 'Phone' }, type: 'text' },
        { name: 'lineId', label: 'LINE ID', type: 'text' },
        { name: 'lineUrl', label: { th: 'ลิงก์ LINE', en: 'LINE link' }, type: 'text' },
        { name: 'email', label: { th: 'อีเมล', en: 'Email' }, type: 'email' },
        { name: 'facebookUrl', label: 'Facebook', type: 'text' },
      ],
    },
    {
      type: 'group',
      name: 'hero',
      label: { th: 'ส่วนหัวหน้าแรก', en: 'Homepage hero' },
      fields: [
        {
          name: 'title',
          label: { th: 'หัวข้อ', en: 'Title' },
          type: 'text',
          localized: true,
        },
        {
          name: 'subtitle',
          label: { th: 'คำโปรย', en: 'Subtitle' },
          type: 'textarea',
          localized: true,
        },
        {
          name: 'background',
          label: { th: 'รูปพื้นหลัง', en: 'Background image' },
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'footerNote',
      label: { th: 'ข้อความท้ายเว็บ', en: 'Footer note' },
      type: 'textarea',
      localized: true,
    },
  ],
}
