import type { Locale } from './config'

const th = {
  nav: {
    track: 'ติดตามพัสดุ',
    branches: 'สาขา',
    services: 'บริการ',
    contact: 'ติดต่อเรา',
  },
  theme: { light: 'โหมดสว่าง', dark: 'โหมดมืด', toggle: 'สลับโหมดสี' },
  language: { label: 'ภาษา', switchTo: 'English' },
  hero: {
    title: 'ติดตามพัสดุข้ามเกาะ รู้ทันทีว่าของอยู่ตรงไหน',
    subtitle: 'ส่งของระหว่างฝั่งกับเกาะสมุย พะงัน เต่า ไปกับเรือลมพระยา',
  },
  track: {
    label: 'เลขพัสดุ',
    placeholder: 'เช่น LP-TAO-261005-0003',
    submit: 'ค้นหา',
    hint: 'ใส่ได้หลายเลข คั่นด้วยเว้นวรรคหรือจุลภาค',
    empty: 'กรุณาใส่เลขพัสดุ',
    resultTitle: 'ผลการติดตาม',
    comingSoon: 'หน้าผลการติดตามจะเชื่อมกับระบบจริงในขั้นถัดไป',
  },
  cookie: {
    message:
      'เว็บไซต์นี้ใช้คุกกี้ที่จำเป็นเพื่อให้ใช้งานได้ และขออนุญาตใช้คุกกี้เพื่อวิเคราะห์การใช้งานและการตลาด คุณเลือกได้ว่าจะยอมรับประเภทใด',
    acceptAll: 'ยอมรับทั้งหมด',
    rejectAll: 'ปฏิเสธ',
    settings: 'ตั้งค่า',
    save: 'บันทึกการตั้งค่า',
    policy: 'นโยบายความเป็นส่วนตัว',
    necessary: 'คุกกี้ที่จำเป็น',
    necessaryDesc: 'ใช้ให้เว็บทำงานได้ เช่น จำภาษาและโหมดสี ปิดไม่ได้',
    analytics: 'คุกกี้วิเคราะห์',
    analyticsDesc: 'นับจำนวนผู้เข้าชมและหน้าที่ใช้งาน เพื่อปรับปรุงเว็บ',
    marketing: 'คุกกี้การตลาด',
    marketingDesc: 'ใช้วัดผลโฆษณา เช่น Facebook Pixel',
    reopen: 'ตั้งค่าคุกกี้',
  },
  footer: {
    rights: 'สงวนลิขสิทธิ์',
  },
}

export type Dictionary = typeof th

const en: Dictionary = {
  nav: {
    track: 'Track parcel',
    branches: 'Branches',
    services: 'Services',
    contact: 'Contact',
  },
  theme: { light: 'Light mode', dark: 'Dark mode', toggle: 'Toggle color mode' },
  language: { label: 'Language', switchTo: 'ภาษาไทย' },
  hero: {
    title: 'Island parcel tracking. Know where your shipment is right now.',
    subtitle: 'Ship between the mainland and Koh Samui, Koh Phangan and Koh Tao on Lomprayah ferries.',
  },
  track: {
    label: 'Tracking number',
    placeholder: 'e.g. LP-TAO-261005-0003',
    submit: 'Track',
    hint: 'Enter several numbers separated by spaces or commas',
    empty: 'Please enter a tracking number',
    resultTitle: 'Tracking result',
    comingSoon: 'The result page will connect to the live system in the next step',
  },
  cookie: {
    message:
      'We use cookies that are needed for the site to work, and ask your permission for analytics and marketing cookies. Choose which ones you accept.',
    acceptAll: 'Accept all',
    rejectAll: 'Reject',
    settings: 'Settings',
    save: 'Save settings',
    policy: 'Privacy policy',
    necessary: 'Necessary cookies',
    necessaryDesc: 'Keep the site working, such as remembering your language and color mode. Always on.',
    analytics: 'Analytics cookies',
    analyticsDesc: 'Count visits and page usage so we can improve the site.',
    marketing: 'Marketing cookies',
    marketingDesc: 'Measure ads, such as the Facebook Pixel.',
    reopen: 'Cookie settings',
  },
  footer: {
    rights: 'All rights reserved',
  },
}

const dictionaries: Record<Locale, Dictionary> = { th, en }

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}
