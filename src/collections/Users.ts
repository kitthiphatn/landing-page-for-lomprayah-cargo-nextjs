import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: { th: 'ผู้ใช้', en: 'User' },
    plural: { th: 'ผู้ใช้', en: 'Users' },
  },
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      label: { th: 'ชื่อ', en: 'Name' },
      type: 'text',
    },
    {
      name: 'role',
      label: { th: 'สิทธิ์', en: 'Role' },
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: { th: 'ผู้ดูแลระบบ', en: 'Admin' }, value: 'admin' },
        { label: { th: 'ผู้แก้ไขเนื้อหา', en: 'Editor' }, value: 'editor' },
      ],
      access: {
        // Only admins can change roles
        update: ({ req: { user } }) => user?.role === 'admin',
      },
    },
  ],
}
