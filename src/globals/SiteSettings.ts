import type { GlobalConfig } from 'payload'

import { themeColorFields } from '../fields/themeColors'
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
      admin: {
        description: {
          th: 'แสดงที่หัวเว็บแทนไอคอนและชื่อเว็บ ใช้ PNG พื้นใส หรือ SVG สูงอย่างน้อย 80px',
          en: 'Shown in the header instead of the icon and site name. Use a transparent PNG or SVG, at least 80px tall.',
        },
      },
    },
    {
      name: 'logoDark',
      label: { th: 'โลโก้สำหรับโหมดมืด', en: 'Logo for dark mode' },
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: {
          th: 'ไม่บังคับ ใช้เมื่อโลโก้ปกติเป็นสีเข้มจนมองไม่เห็นบนพื้นดำ',
          en: 'Optional. Use when the normal logo is too dark to see on a dark background.',
        },
      },
    },
    {
      name: 'favicon',
      label: { th: 'ไอคอนแท็บเบราว์เซอร์ (favicon)', en: 'Browser tab icon (favicon)' },
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: {
          th: 'รูปสี่เหลี่ยมจัตุรัส PNG หรือ SVG ขนาด 512×512px ใช้เป็นไอคอนบนแท็บและหน้าจอมือถือด้วย',
          en: 'A square PNG or SVG, 512×512px. Also used as the phone home-screen icon.',
        },
      },
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
        { label: { th: 'กำหนดสีเอง', en: 'Custom colors' }, value: 'custom' },
      ],
      admin: {
        description: {
          th: 'ถ้าตั้งธีมเทศกาลไว้ด้านล่าง ช่วงเวลานั้นจะใช้สีของเทศกาลแทน',
          en: 'During a festival theme set below, its colors are used instead.',
        },
      },
    },
    {
      name: 'customColors',
      label: { th: 'สีที่กำหนดเอง', en: 'Custom colors' },
      type: 'group',
      admin: { condition: (data) => data?.primaryColor === 'custom' },
      fields: themeColorFields,
    },
    {
      name: 'seasonalThemes',
      label: { th: 'ธีมสีช่วงเทศกาล', en: 'Festival color themes' },
      labels: {
        singular: { th: 'ธีมเทศกาล', en: 'Festival theme' },
        plural: { th: 'ธีมเทศกาล', en: 'Festival themes' },
      },
      type: 'array',
      admin: {
        initCollapsed: true,
        description: {
          th: 'เปลี่ยนสีเว็บเองตามช่วงเวลา เช่น สงกรานต์ ลอยกระทง ปีใหม่ พ้นช่วงแล้วกลับเป็นสีปกติ ถ้าช่วงเวลาซ้อนกัน ใช้อันที่อยู่บนสุด',
          en: 'Switches the site colors for a date range, e.g. Songkran or New Year, then goes back to normal. If ranges overlap, the top one wins.',
        },
        components: { RowLabel: '/components/admin/ThemeRowLabel#ThemeRowLabel' },
      },
      fields: [
        {
          name: 'name',
          label: { th: 'ชื่อเทศกาล', en: 'Festival name' },
          type: 'text',
          required: true,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'startsAt',
              label: { th: 'เริ่ม', en: 'Starts' },
              type: 'date',
              required: true,
              admin: { date: { pickerAppearance: 'dayAndTime' } },
            },
            {
              name: 'endsAt',
              label: { th: 'สิ้นสุด', en: 'Ends' },
              type: 'date',
              required: true,
              admin: { date: { pickerAppearance: 'dayAndTime' } },
            },
          ],
        },
        ...themeColorFields,
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
        { name: 'whatsappUrl', label: 'WhatsApp', type: 'text' },
        { name: 'facebookUrl', label: 'Facebook', type: 'text' },
        { name: 'instagramUrl', label: 'Instagram', type: 'text' },
        { name: 'tiktokUrl', label: 'TikTok', type: 'text' },
        { name: 'youtubeUrl', label: 'YouTube', type: 'text' },
        {
          name: 'hours',
          label: { th: 'เวลาให้บริการ', en: 'Service hours' },
          type: 'text',
          localized: true,
        },
        {
          name: 'address',
          label: { th: 'ที่อยู่สำนักงาน', en: 'Office address' },
          type: 'textarea',
          localized: true,
        },
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
    {
      name: 'analyticsId',
      label: { th: 'รหัส Google Analytics', en: 'Google Analytics ID' },
      type: 'text',
      admin: {
        placeholder: 'G-XXXXXXXXXX',
        description: {
          th: 'Measurement ID ของ GA4 ใช้นับผู้เข้าชม จะเริ่มนับเฉพาะคนที่กดยอมรับคุกกี้ เว้นว่างไว้ถ้าไม่ใช้',
          en: 'GA4 Measurement ID for counting visitors. Only visitors who accept cookies are counted. Leave empty to turn off.',
        },
      },
      validate: (value: string | null | undefined) =>
        !value || /^G-[A-Z0-9]{4,}$/.test(value.trim())
          ? true
          : 'รหัสต้องขึ้นต้นด้วย G- เช่น G-AB12CD34EF',
    },
  ],
}
