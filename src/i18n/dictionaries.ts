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
    message: 'เว็บไซต์นี้ใช้คุกกี้เพื่อให้ใช้งานได้ดีขึ้น และวิเคราะห์การใช้งาน',
    acceptAll: 'ยอมรับทั้งหมด',
    settings: 'ตั้งค่า',
    save: 'บันทึกการตั้งค่า',
    policy: 'นโยบายความเป็นส่วนตัว',
    optional: 'คุกกี้วิเคราะห์และการตลาด',
    optionalDesc: 'นับผู้เข้าชมและวัดผลโฆษณา คุกกี้ที่จำเป็นต่อการใช้งานเปิดอยู่เสมอ',
    reopen: 'ตั้งค่าคุกกี้',
  },
  popup: { title: 'ประกาศ', close: 'ปิด', prev: 'รูปก่อนหน้า', next: 'รูปถัดไป', goTo: 'ไปที่รูป' },
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
    message: 'We use cookies to make the site work better and to understand how it is used.',
    acceptAll: 'Accept all',
    settings: 'Settings',
    save: 'Save settings',
    policy: 'Privacy policy',
    optional: 'Analytics and marketing cookies',
    optionalDesc: 'Count visits and measure ads. Cookies the site needs to work are always on.',
    reopen: 'Cookie settings',
  },
  popup: { title: 'Announcement', close: 'Close', prev: 'Previous image', next: 'Next image', goTo: 'Go to image' },
  footer: {
    rights: 'All rights reserved',
  },
}

const dictionaries: Record<Locale, Dictionary> = { th, en }

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}
