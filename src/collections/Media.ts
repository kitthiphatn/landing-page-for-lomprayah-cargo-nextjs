import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: { th: 'ไฟล์', en: 'Media' },
    plural: { th: 'คลังรูป', en: 'Media' },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      label: { th: 'คำอธิบายรูป', en: 'Alt text' },
      type: 'text',
      required: true,
      localized: true,
    },
  ],
  upload: {
    // Stored inside this site's folder (ignored by git; back it up with the database).
    // On the server MEDIA_DIR points outside the app folder, so a new release keeps uploads.
    staticDir: process.env.MEDIA_DIR || 'media',
  },
}
