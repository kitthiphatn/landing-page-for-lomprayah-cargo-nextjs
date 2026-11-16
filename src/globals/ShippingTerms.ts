import type { GlobalConfig } from 'payload'

import { isLocale } from '../i18n/config'
import { revalidateSite } from '../lib/revalidate'
import { DEFAULT_SHIPPING_TERMS, SHIPPING_TERMS_FORM_CODE } from '../lib/shippingTerms'

export const ShippingTerms: GlobalConfig = {
  slug: 'shipping-terms',
  label: { th: 'เงื่อนไขการส่งพัสดุ', en: 'Shipping terms' },
  access: { read: () => true },
  hooks: { afterChange: [revalidateSite] },
  fields: [
    {
      name: 'intro',
      label: { th: 'คำโปรย', en: 'Intro' },
      type: 'textarea',
      localized: true,
    },
    {
      name: 'items',
      label: { th: 'ข้อตกลง', en: 'Terms' },
      labels: { singular: { th: 'ข้อ', en: 'Term' }, plural: { th: 'ข้อ', en: 'Terms' } },
      type: 'array',
      localized: true,
      admin: {
        description: {
          th: 'เรียงตามลำดับข้อ ขึ้นบรรทัดใหม่แล้วพิมพ์ "- " นำหน้าเพื่อทำเป็นข้อย่อย',
          en: 'In order. Start a new line with "- " for a sub-item.',
        },
      },
      defaultValue: ({ locale }: { locale?: string }) =>
        DEFAULT_SHIPPING_TERMS[locale && isLocale(locale) ? locale : 'th'].map((text) => ({
          text,
        })),
      fields: [
        {
          name: 'text',
          label: { th: 'ข้อความ', en: 'Text' },
          type: 'textarea',
          required: true,
        },
      ],
    },
    {
      name: 'formCode',
      label: { th: 'เลขที่เอกสาร', en: 'Document code' },
      type: 'text',
      defaultValue: SHIPPING_TERMS_FORM_CODE,
    },
  ],
}
