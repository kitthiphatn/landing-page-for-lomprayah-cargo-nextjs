import type { CollectionConfig } from 'payload'

import { findShareImage, saveImage } from '../lib/coverFromSource'
import { contentHooks, publishedOrStaff, seoField, slugField } from './shared'

export const POST_CATEGORIES = ['news', 'announcement', 'promotion', 'travel', 'tips'] as const

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: { th: 'บทความ', en: 'Post' },
    plural: { th: 'บทความ/ข่าว', en: 'Posts' },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', '_status'],
    preview: (doc, { locale }) =>
      doc?.slug ? `/preview?path=${encodeURIComponent(`/${locale}/news/${doc.slug}`)}` : null,
    components: {
      beforeListTable: ['/components/admin/FillCoversButton#FillCoversButton'],
    },
  },
  endpoints: [
    {
      // Gives every post that has an original-article link but no cover the share image of that
      // page. Runs on the server, so it reaches sites this admin's browser can't fetch directly.
      path: '/fill-covers',
      method: 'post',
      handler: async (req) => {
        if (!req.user) return Response.json({ error: 'Sign in first' }, { status: 401 })
        const { payload } = req
        const { docs } = await payload.find({
          collection: 'posts',
          draft: true,
          locale: 'th',
          depth: 0,
          limit: 200,
          where: { cover: { exists: false } },
        })
        let filled = 0
        const failed: { title: string; reason: string }[] = []
        let noLink = 0
        for (const post of docs) {
          if (!post.sourceUrl) {
            noLink++
            continue
          }
          try {
            const image = await findShareImage(post.sourceUrl)
            if (!image) throw new Error('the page has no share image')
            const cover = await saveImage(payload, image, post.title)
            await payload.update({
              collection: 'posts',
              id: post.id,
              data: { cover },
              draft: post._status !== 'published',
            })
            filled++
          } catch (err) {
            failed.push({ title: post.title, reason: (err as Error).message })
          }
        }
        return Response.json({ checked: docs.length, filled, noLink, failed })
      },
    },
  ],
  access: { read: publishedOrStaff },
  versions: { drafts: true },
  hooks: contentHooks,
  defaultSort: '-publishedAt',
  fields: [
    {
      name: 'title',
      label: { th: 'หัวข้อ', en: 'Title' },
      type: 'text',
      required: true,
      localized: true,
    },
    slugField,
    {
      name: 'publishedAt',
      label: { th: 'วันที่เผยแพร่', en: 'Publish date' },
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
        description: {
          th: 'ตั้งเป็นวันในอนาคตได้ บทความจะขึ้นเว็บเองเมื่อถึงเวลา',
          en: 'Set a future date to schedule; the post appears on its own at that time.',
        },
      },
    },
    {
      name: 'category',
      label: { th: 'หมวด', en: 'Category' },
      type: 'select',
      required: true,
      defaultValue: 'news',
      admin: { position: 'sidebar' },
      options: [
        { label: { th: 'ข่าวสาร', en: 'News' }, value: 'news' },
        { label: { th: 'ประกาศ', en: 'Announcement' }, value: 'announcement' },
        { label: { th: 'โปรโมชั่น', en: 'Promotion' }, value: 'promotion' },
        { label: { th: 'ข้อมูลการเดินทาง', en: 'Travel info' }, value: 'travel' },
        { label: { th: 'เกร็ดความรู้', en: 'Tips' }, value: 'tips' },
      ],
    },
    {
      name: 'cover',
      label: { th: 'รูปปก (16:9)', en: 'Cover image (16:9)' },
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'excerpt',
      label: { th: 'คำโปรย', en: 'Summary' },
      type: 'textarea',
      localized: true,
      maxLength: 240,
    },
    {
      name: 'content',
      label: { th: 'เนื้อหา', en: 'Content' },
      type: 'richText',
      localized: true,
    },
    {
      name: 'sourceUrl',
      label: { th: 'ลิงก์บทความต้นฉบับ (ถ้ามี)', en: 'Original article link (optional)' },
      type: 'text',
      localized: true,
      admin: {
        position: 'sidebar',
        description: {
          th: 'แสดงปุ่ม "อ่านต่อ" ไปยังบทความเต็ม เช่น บน lomprayah.com',
          en: 'Shows a "Read more" button to the full article, e.g. on lomprayah.com',
        },
      },
    },
    seoField,
  ],
}
