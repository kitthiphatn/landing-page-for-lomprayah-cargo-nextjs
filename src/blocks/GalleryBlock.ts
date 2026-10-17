import type { Block } from 'payload'

// Several photos shown together as a grid inside an article
export const GalleryBlock: Block = {
  slug: 'gallery',
  labels: {
    singular: { th: 'แกลเลอรีรูป', en: 'Photo gallery' },
    plural: { th: 'แกลเลอรีรูป', en: 'Photo galleries' },
  },
  fields: [
    {
      name: 'columns',
      label: { th: 'จำนวนคอลัมน์บนจอคอม', en: 'Columns on desktop' },
      type: 'select',
      defaultValue: '2',
      options: [
        { label: '2', value: '2' },
        { label: '3', value: '3' },
      ],
      admin: {
        description: {
          th: 'บนมือถือแสดงทีละ 1 รูปเสมอ กดที่รูปเพื่อดูขนาดเต็ม',
          en: 'Phones always show one photo per row. Tap a photo to see it full size.',
        },
      },
    },
    {
      name: 'images',
      label: { th: 'รูป', en: 'Photos' },
      labels: {
        singular: { th: 'รูป', en: 'Photo' },
        plural: { th: 'รูป', en: 'Photos' },
      },
      type: 'array',
      minRows: 1,
      maxRows: 24,
      fields: [
        {
          name: 'image',
          label: { th: 'รูป', en: 'Photo' },
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          label: { th: 'คำบรรยายใต้รูป (ถ้ามี)', en: 'Caption (optional)' },
          type: 'text',
        },
      ],
    },
  ],
}
