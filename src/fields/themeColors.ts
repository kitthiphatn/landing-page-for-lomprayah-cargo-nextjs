import type { Field } from 'payload'

const HEX = /^#[0-9a-f]{6}$/i

function colorField(
  name: string,
  label: { th: string; en: string },
  description: { th: string; en: string },
): Field {
  return {
    name,
    label,
    type: 'text',
    required: true,
    validate: (value: unknown) =>
      (typeof value === 'string' && HEX.test(value)) || 'ใส่รหัสสีแบบ #RRGGBB เช่น #c8102e',
    admin: {
      description,
      components: { Field: '/components/admin/ColorField#ColorField' },
    },
  }
}

// The three colors a theme is made of; dark mode uses lighter versions of them automatically
export const themeColorFields: Field[] = [
  {
    type: 'row',
    fields: [
      colorField(
        'primary',
        { th: 'สีหลัก', en: 'Main color' },
        {
          th: 'หัวเว็บ ปุ่ม ลิงก์ และพื้นหลังส่วนบนของหน้าแรก ควรเป็นสีเข้ม',
          en: 'Header, buttons, links and the top of the homepage. Pick a dark color.',
        },
      ),
      colorField(
        'secondary',
        { th: 'สีรอง', en: 'Second color' },
        {
          th: 'ปลายไล่สีส่วนบนของหน้าแรก และสถานะพัสดุ',
          en: 'The other end of the homepage gradient, and parcel status.',
        },
      ),
      colorField(
        'accent',
        { th: 'สีเน้น', en: 'Highlight color' },
        {
          th: 'ปุ่มติดตามพัสดุและปุ่มสำคัญ ตัวหนังสือบนปุ่มจะเป็นขาวหรือดำให้อ่านง่ายเอง',
          en: 'The Track button and other key buttons. Button text turns white or black to stay readable.',
        },
      ),
    ],
  },
]
