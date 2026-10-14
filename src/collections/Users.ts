import type { Access, CollectionConfig, FieldAccess } from 'payload'

const isAdmin = (user: unknown) => (user as { role?: string } | null)?.role === 'admin'

const adminOnly: Access = ({ req: { user } }) => isAdmin(user)

// Admins manage everyone; editors only see and edit their own account
const adminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (isAdmin(user)) return true
  return { id: { equals: user.id } }
}

const adminField: FieldAccess = ({ req: { user } }) => isAdmin(user)

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
  access: {
    read: adminOrSelf,
    create: adminOnly,
    update: adminOrSelf,
    delete: adminOnly,
  },
  hooks: {
    beforeChange: [
      // The account made on the first-run screen is the site owner, so it is always an admin
      async ({ data, operation, req }) => {
        if (operation !== 'create') return data
        const { totalDocs } = await req.payload.count({ collection: 'users', req })
        return totalDocs === 0 ? { ...data, role: 'admin' } : data
      },
    ],
  },
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
      admin: {
        description: {
          th: 'ผู้ดูแลระบบ: ทำได้ทุกอย่างและจัดการผู้ใช้ · ผู้แก้ไขเนื้อหา: แก้เนื้อหาและตั้งค่าเว็บ แต่จัดการผู้ใช้คนอื่นไม่ได้',
          en: 'Admin: everything, including users · Editor: all content and site settings, but not other users',
        },
      },
      access: {
        // Only admins can give or change a role
        create: adminField,
        update: adminField,
      },
    },
  ],
}
