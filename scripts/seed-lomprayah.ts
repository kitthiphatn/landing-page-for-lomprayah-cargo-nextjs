// Fills an empty admin panel with starter content taken from lomprayah.com (news list, contact
// details, about page) plus a few cargo basics. Safe to run more than once: existing posts are
// skipped by slug, and settings fields that already have a value are left alone.
//
//   npm run seed
//
// News posts are created as drafts, because most lomprayah.com news is about passenger ferries:
// publish the ones that fit the cargo site from the admin panel. Cover images are downloaded from
// lomprayah.com; if that fails the post is created without one.
import { getPayload, type Payload } from 'payload'

import config from '../src/payload.config'

type Category = 'news' | 'announcement' | 'promotion' | 'travel' | 'tips'
type NewsItem = {
  slug: string
  category: Category
  date: string
  image?: string
  th: { title: string; excerpt: string; url: string }
  en: { title: string; excerpt: string; url: string }
}

const SITE = 'https://lomprayah.com'
const UPLOADS = `${SITE}/assets/uploads/news`

const NEWS: NewsItem[] = [
  {
    slug: 'lomprayah-member-card',
    category: 'news',
    date: '2026-04-26',
    image: 'https://i.postimg.cc/1XmYpy6k/member-card.webp',
    th: {
      title: 'บัตรสมาชิกลมพระยา',
      excerpt:
        'บัตรสมาชิกสำหรับผู้เดินทางประจำและคนในพื้นที่ เดินทางไปเกาะสมุย เกาะพะงัน และเกาะเต่าได้ประหยัดขึ้น',
      url: `${SITE}/news/lomprayah-member-card-th?lang=th`,
    },
    en: {
      title: 'Lomprayah member card',
      excerpt:
        'A member card for easier, cheaper travel between Koh Samui, Koh Phangan and Koh Tao.',
      url: `${SITE}/news/lomprayah-member-card-en?lang=en`,
    },
  },
  {
    slug: 'koh-kood-seudamgo-new-route',
    category: 'news',
    date: '2026-04-26',
    image: `${UPLOADS}/739b264b52e8f4b5f0b31a660d9edf60.webp`,
    th: {
      title:
        'เกาะกูด ⇄ เกาะสมุย เกาะพะงัน เกาะเต่า ด้วยความร่วมมือกันระหว่าง ลมพระยา และ เสือดำโก 🤝',
      excerpt: 'เส้นทางรถและเรือใหม่จากเกาะกูดไปยังหมู่เกาะฝั่งอ่าวไทย',
      url: `${SITE}/news/new-route-now-open-th?lang=th`,
    },
    en: {
      title: 'Koh Kood ⇄ Koh Samui, Koh Phangan & Koh Tao with LOMPRAYAH x SEUDAMGO 🤝',
      excerpt: 'A partnership with SEUDAMGO connects Koh Kood with the Gulf islands.',
      url: `${SITE}/news/new-route-now-open-en?lang=en`,
    },
  },
  {
    slug: 'koh-samui-any-hotel-transfer',
    category: 'news',
    date: '2026-06-17',
    image: `${UPLOADS}/7f1c58be9af6ccae72f7eb4bf92abd10.webp`,
    th: {
      title: '🚐🌴 บริการรถรับส่งเกาะสมุย Any Hotel | Transfer Service โดยลมพระยา',
      excerpt: 'บริการรถรับส่งถึงโรงแรมหรือที่พักทุกแห่งบนเกาะสมุย',
      url: `${SITE}/news/any-hotel-transfer-th?lang=th`,
    },
    en: {
      title: '🌴 Koh Samui Any Hotel Transfer Service by Lomprayah 🚐',
      excerpt: 'Hotel transfers to any accommodation on Koh Samui.',
      url: `${SITE}/news/koh-samui-any-hotel-transfer-en?lang=en`,
    },
  },
  {
    slug: 'koh-phangan-transfer',
    category: 'news',
    date: '2026-06-16',
    th: {
      title: '🚐 บริการรถรับ–ส่ง (Transfer Service) เกาะพะงัน โดย ลมพระยา',
      excerpt: 'บริการรถรับส่งจากที่พักไปยังท่าเรือบนเกาะพะงัน ต่อเรือคาตามารันความเร็วสูง',
      url: `${SITE}/news/koh-phangan-transfer-th?lang=th`,
    },
    en: {
      title: '🌴 Koh Phangan Ferry + Transfer Service by Lomprayah 🚢',
      excerpt: 'Ferries between Samui, Phangan and Tao with a pier-to-hotel transfer.',
      url: `${SITE}/news/koh-phangan-transfer-en?lang=en`,
    },
  },
  {
    slug: 'oil-prices-up-service-the-same',
    category: 'announcement',
    date: '2026-04-26',
    th: {
      title: '⛽️📈 น้ำมันขึ้นราคา แต่ลมพระยายังเหมือนเดิม',
      excerpt: 'แม้ต้นทุนน้ำมันเพิ่มขึ้น ลมพระยายังคงราคาเดิม',
      url: `${SITE}/news/oil-prices-have-gone-up-but-the-lomprayah-service-remains-the-same-th?lang=th`,
    },
    en: {
      title: '🛢️📈 Oil prices have gone up, but the Lomprayah service remains the same',
      excerpt: 'Despite higher fuel costs, Lomprayah keeps its prices.',
      url: `${SITE}/news/oil-prices-have-gone-up-but-the-lomprayah-service-remains-the-same-en?lang=en`,
    },
  },
  {
    slug: 'full-moon-party-2026',
    category: 'travel',
    date: '2026-04-23',
    th: {
      title: '🌕 Full Moon Party 2026 @ หาดริ้น เกาะพะงัน ปาร์ตี้ระดับโลกที่สายมันส์ห้ามพลาด!',
      excerpt: 'งาน Full Moon Party ประจำปี 2026 ที่หาดริ้น เกาะพะงัน',
      url: `${SITE}/news/haad-rin-koh-phangan-a-world-famous-party-no-party-lover-should-miss-th?lang=th`,
    },
    en: {
      title: "🌕 Full Moon Party 2026: The World-Famous Beach Party You Can't Miss!",
      excerpt: 'The monthly full moon party at Haad Rin Beach, Koh Phangan.',
      url: `${SITE}/news/haad-rin-koh-phangan-a-world-famous-party-no-party-lover-should-miss-en?lang=en`,
    },
  },
  {
    slug: 'thai-travelers-koh-tao-40-off',
    category: 'promotion',
    date: '2026-07-27',
    image: `${UPLOADS}/2ca719ba3d077d183c012db467c6853e.webp`,
    th: {
      title: '🌊 คุ้มสุด ลดแรง! พิเศษสำหรับคนไทย เที่ยวเกาะเต่า ลดสูงสุด 40% กับลมพระยา',
      excerpt: 'ส่วนลดสูงสุด 40% สำหรับคนไทย เส้นทางกรุงเทพฯ หัวหิน ชุมพร ไปเกาะเต่า',
      url: `${SITE}/news/40?lang=th`,
    },
    en: {
      title: '🌊 Best Value for Thai Travelers! Up to 40% OFF Trips to Koh Tao with Lomprayah 🏝️',
      excerpt: 'Up to 40% off Bangkok, Hua Hin and Chumphon to Koh Tao for Thai nationals.',
      url: `${SITE}/news/best-value-for-thai-travelers-get-up-to-40-th?lang=en`,
    },
  },
  {
    slug: 'hua-hin-exclusive-20-off',
    category: 'promotion',
    date: '2026-07-23',
    image: `${UPLOADS}/63740d7dec3a67825ad994f99dd09ec0.webp`,
    th: {
      title: '🌊🚤 หัวหินมีเฮ! เที่ยวเกาะสุดคุ้ม ลดทันที 20% กับลมพระยา เริ่มต้นจากหัวหิน',
      excerpt: 'ส่วนลด 20% ไป-กลับจากหัวหิน สำหรับผู้เดินทางตั้งแต่ 2 คนขึ้นไป',
      url: `${SITE}/news/hua-hin-exclusive-save-20-th?lang=th`,
    },
    en: {
      title: '🌊🚤 Hua Hin Exclusive! Save 20% on Your Island Getaway with Lomprayah',
      excerpt: '20% off round trips from Hua Hin for groups of two or more.',
      url: `${SITE}/news/hua-hin-exclusive-save-20-en?lang=en`,
    },
  },
  {
    slug: 'june-deals-thai-citizens-30-off',
    category: 'promotion',
    date: '2026-06-11',
    image: `${UPLOADS}/7d07dd0b5d11e118b94f95ccc4bf3ca7.webp`,
    th: {
      title: '🚨 โปรแรงแห่งเดือนมิถุนายนมาแล้ว! คนไทยเที่ยวทะเลไทย ลดสูงสุด 30% 🌊🏝️',
      excerpt: 'ส่วนลดสูงสุด 30% สำหรับคนไทยที่แสดงบัตรประชาชน',
      url: `${SITE}/news/thai-citizens-can-enjoy-up-to-30-off-on-thai-beaches-th?lang=th`,
    },
    en: {
      title: "🚨 June's Hottest Deals! Thai citizens enjoy up to 30% off on Thai beaches 🌊🏝️",
      excerpt: 'Up to 30% off for Thai citizens who show their ID card.',
      url: `${SITE}/news/thai-citizens-can-enjoy-up-to-30-off-on-thai-beaches-en?lang=en`,
    },
  },
  {
    slug: 'samui-to-phangan-from-250',
    category: 'promotion',
    date: '2026-04-24',
    th: {
      title: '🔥 HOT DEAL แรงจริง! โปรเรือเกาะสมุยไปเกาะพะงัน เริ่ม 250 บาท',
      excerpt: 'ตั๋วเรือเกาะสมุยไปเกาะพะงัน เริ่มต้น 250 บาท',
      url: `${SITE}/news/hot-deal-amazing-ferry-deal-from-koh-samui-to-koh-phangan-starting-at-250-th?lang=th`,
    },
    en: {
      title: '🔥 HOT DEAL! Ferry from Koh Samui to Koh Phangan from 250 THB',
      excerpt: 'Samui to Phangan ferry fares from 250 THB.',
      url: `${SITE}/news/hot-deal-amazing-ferry-deal-from-koh-samui-to-koh-phangan-starting-at-250-en?lang=en`,
    },
  },
  {
    slug: 'expat-travel-fair-2026',
    category: 'promotion',
    date: '2026-04-23',
    th: {
      title: '🌴🔥 HOT DEAL เฉพาะในงานนี้เท่านั้น! พบกับโปรสุดคุ้มในงาน EXPAT TRAVEL FAIR 2026',
      excerpt: 'ส่วนลด 20% ทุกเส้นทางเรือ เฉพาะในงาน EXPAT TRAVEL FAIR 2026',
      url: `${SITE}/news/the-sea-is-calling-get-off-on-all-sea-travel-routes-th?lang=th`,
    },
    en: {
      title: '🌴🔥 HOT DEAL only at the EXPAT TRAVEL FAIR 2026!',
      excerpt: '20% off all ferry routes, only at the Expat Travel Fair 2026.',
      url: `${SITE}/news/the-sea-is-calling-get-off-on-all-sea-travel-routes-en?lang=en`,
    },
  },
  {
    slug: 'chumphon-the-gate-airport-cafe',
    category: 'promotion',
    date: '2026-04-23',
    th: {
      title: 'เช็คอินความสุขที่ชุมพร... เริ่มต้นทริปด้วยความหอมกรุ่นที่ The Gate Airport Cafe ☕️✨',
      excerpt: 'ผู้ถือตั๋วลมพระยารับคุกกี้ฟรีที่คาเฟ่ในสนามบินชุมพร',
      url: `${SITE}/news/check-in-for-happiness-in-chumphon-th?lang=th`,
    },
    en: {
      title: 'Check in for happiness in Chumphon at The Gate Airport Cafe ☕️✨',
      excerpt: 'A free cookie at The Gate Airport Cafe for Lomprayah ticket holders.',
      url: `${SITE}/news/check-in-for-happiness-in-chumphon-en?lang=en`,
    },
  },
  {
    slug: 'island-hopping-with-lomprayah',
    category: 'travel',
    date: '2026-10-07',
    image: `${UPLOADS}/bd5e3726e9494965ef6a5592c06e1927.webp`,
    th: {
      title: 'Island Hopping เดินทางเที่ยวระหว่างเกาะได้ง่ายๆ ต้องที่ลมพระยา ⛴️🏖️',
      excerpt: 'เที่ยวหลายเกาะในทริปเดียวด้วยเรือลมพระยา',
      url: `${SITE}/news/island-hopping-made-easy-with-lomprayah-th?lang=th`,
    },
    en: {
      title: 'Island Hopping Made Easy with Lomprayah ⛴️🏖️',
      excerpt: 'Visit several islands in one trip with Lomprayah ferries.',
      url: `${SITE}/news/island-hopping-made-easy-with-lomprayah-en?lang=en`,
    },
  },
  {
    slug: 'chumphon-airport-with-lomprayah',
    category: 'travel',
    date: '2026-10-02',
    image: `${UPLOADS}/5a2955cffe39684fbc5b0feec6f4fa4b.webp`,
    th: {
      title: '✈️ สนามบินชุมพร เดินทางถึงเกาะแบบชิล ๆ กับลมพระยา ⛴️💙',
      excerpt: 'ตั๋วร่วมรถและเรือจากสนามบินชุมพรไปเกาะเต่า เกาะพะงัน และเกาะสมุย',
      url: `${SITE}/news/chumphon-airport-with-lomprayah-th?lang=th`,
    },
    en: {
      title: '✈️ Chumphon Airport: reach the islands with ease, with Lomprayah ⛴️💙',
      excerpt: 'A joint bus and catamaran ticket from Chumphon Airport to the islands.',
      url: `${SITE}/news/chumphon-airport-with-lomprayah-en?lang=en`,
    },
  },
  {
    slug: '10-must-visit-places-koh-tao',
    category: 'travel',
    date: '2026-09-10',
    image: `${UPLOADS}/d84eda2ed3e91d0b28510f96704d959c.webp`,
    th: {
      title: 'ห้ามพลาด! 10 ที่เที่ยวเกาะเต่า เที่ยวทะเล ดำน้ำ ชมวิว กับลมพระยา 🌅🤿',
      excerpt: 'รวม 10 สถานที่น่าสนใจบนเกาะเต่า และวิธีเดินทางจากดอนสักหรือชุมพร',
      url: `${SITE}/news/10-must-visit-places-in-koh-tao-th?lang=th`,
    },
    en: {
      title: "Don't Miss! 10 Must-Visit Places in Koh Tao",
      excerpt: 'Ten sights on Koh Tao, known for its diving and beaches.',
      url: `${SITE}/news/10-must-visit-places-in-koh-tao-en?lang=en`,
    },
  },
  {
    slug: 'phuket-lipe-langkawi-new-routes',
    category: 'travel',
    date: '2026-09-09',
    th: {
      title: '✈️🚤 3 เส้นทางใหม่ ภูเก็ต–หลีเป๊ะ–ลังกาวี เชื่อมอ่าวไทยสู่อันดามัน',
      excerpt: 'สามเส้นทางเรือผ่านพันธมิตร เชื่อมภูเก็ต หลีเป๊ะ และลังกาวี',
      url: `${SITE}/news/3-new-routes-phuket-koh-lipe-langkawi-connecting-the-gulf-of-thailand-to-the-andaman-through-our-ferry-partner-network-th?lang=th`,
    },
    en: {
      title: '✈️🚤 3 New Routes: Phuket – Koh Lipe – Langkawi, from the Gulf to the Andaman',
      excerpt: 'Three partner routes linking the Gulf islands with the Andaman coast.',
      url: `${SITE}/news/3-new-routes-phuket-koh-lipe-langkawi-connecting-the-gulf-of-thailand-to-the-andaman-through-our-ferry-partner-network-en?lang=en`,
    },
  },
  {
    slug: 'surat-thani-airport-to-the-islands',
    category: 'travel',
    date: '2026-09-03',
    th: {
      title: 'ถึงสนามบินสุราษฎร์ธานี ไปต่อเกาะสมุย เกาะพะงัน เกาะเต่า ยังไง? ลมพระยามีคำตอบ 🌴⛴️',
      excerpt: 'ต่อรถและเรือจากสนามบินสุราษฎร์ธานีไปเกาะ ด้วยการจองครั้งเดียว',
      url: `${SITE}/news/how-to-travel-from-surat-thani-airport-th?lang=th`,
    },
    en: {
      title: 'How to travel from Surat Thani Airport to Koh Samui, Koh Phangan & Koh Tao 🌴⛴️',
      excerpt: 'One booking for the bus and ferry from Surat Thani Airport to the islands.',
      url: `${SITE}/news/how-to-travel-from-surat-thani-airport-en?lang=en`,
    },
  },
  {
    slug: 'surat-thani-gateway-gulf-islands',
    category: 'travel',
    date: '2026-08-26',
    th: {
      title: 'สุราษฎร์ธานี... ประตูสู่เกาะสวรรค์ของอ่าวไทย 🌴🌊',
      excerpt: 'จุดเริ่มต้นเดินทางไปเกาะสมุย เกาะพะงัน และเกาะเต่า',
      url: `${SITE}/news/surat-thani-the-gulf-of-thailand-th?lang=th`,
    },
    en: {
      title: 'Surat Thani: the gateway to the Gulf of Thailand islands 🌴🌊',
      excerpt: 'The main mainland gateway to Samui, Phangan and Tao.',
      url: `${SITE}/news/surat-thani-the-gulf-of-thailand-en?lang=en`,
    },
  },
]

const text = (t: string) => ({
  type: 'text',
  version: 1,
  text: t,
  detail: 0,
  format: 0,
  mode: 'normal',
  style: '',
})
const block = (type: 'paragraph' | 'heading', t: string) => ({
  type,
  ...(type === 'heading' ? { tag: 'h2' } : { textFormat: 0 }),
  version: 1,
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  children: [text(t)],
})
const doc = (...children: ReturnType<typeof block>[]) => ({
  root: {
    type: 'root',
    version: 1,
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    children,
  },
})

async function upload(payload: Payload, url: string, alt: string): Promise<number | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = Buffer.from(await res.arrayBuffer())
    const name = url.split('/').pop()?.split('?')[0] || 'image.webp'
    const mimetype = res.headers.get('content-type') || 'image/webp'
    const media = await payload.create({
      collection: 'media',
      data: { alt },
      file: { data, mimetype, name, size: data.length },
    })
    return media.id
  } catch (err) {
    console.warn(`  skipped image ${url}: ${(err as Error).message}`)
    return null
  }
}

const isEmpty = (v: unknown) => v === null || v === undefined || v === ''

async function seedNews(payload: Payload) {
  let created = 0
  for (const n of NEWS) {
    const existing = await payload.find({
      collection: 'posts',
      where: { slug: { equals: n.slug } },
      limit: 1,
      draft: true,
    })
    if (existing.docs.length) continue
    const cover = n.image ? await upload(payload, n.image, n.th.title) : null
    const post = await payload.create({
      collection: 'posts',
      locale: 'th',
      draft: true,
      data: {
        _status: 'draft',
        slug: n.slug,
        category: n.category,
        publishedAt: new Date(`${n.date}T09:00:00+07:00`).toISOString(),
        cover,
        title: n.th.title,
        excerpt: n.th.excerpt,
        sourceUrl: n.th.url,
        content: doc(block('paragraph', n.th.excerpt)),
      },
    })
    await payload.update({
      collection: 'posts',
      id: post.id,
      locale: 'en',
      draft: true,
      data: {
        title: n.en.title,
        excerpt: n.en.excerpt,
        sourceUrl: n.en.url,
        content: doc(block('paragraph', n.en.excerpt)),
      },
    })
    created++
  }
  console.log(`News: ${created} draft posts added (${NEWS.length - created} already there)`)
}

async function seedContact(payload: Payload) {
  const current = await payload.findGlobal({ slug: 'site-settings', locale: 'th' })
  const c = current.contact ?? {}
  const shared = {
    phone: '089 873 0008-9',
    lineId: '@pnd0714w',
    lineUrl: 'https://line.me/ti/p/~@pnd0714w',
    whatsappUrl: 'https://wa.me/66653509040',
    facebookUrl: 'https://www.facebook.com/lomprayah',
    instagramUrl: 'https://www.instagram.com/lomprayahcatamaran',
    tiktokUrl: 'https://www.tiktok.com/@lomprayah',
    youtubeUrl: 'https://www.youtube.com/@LomprayahCatamaran-YOUTUBE/videos',
  }
  const fill = Object.fromEntries(
    Object.entries(shared).filter(([k]) => isEmpty(c[k as keyof typeof c])),
  )
  const th = {
    ...fill,
    ...(isEmpty(c.hours) && { hours: 'ทุกวัน 08:00–20:00 น.' }),
    ...(isEmpty(c.address) && { address: '26/61 หมู่ 4 ต.แม่น้ำ อ.เกาะสมุย จ.สุราษฎร์ธานี 84330' }),
  }
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'th',
    data: { contact: { ...c, ...th } },
  })
  const en = await payload.findGlobal({
    slug: 'site-settings',
    locale: 'en',
    fallbackLocale: false,
  })
  const ce = en.contact ?? {}
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'en',
    data: {
      contact: {
        ...ce,
        ...(isEmpty(ce.hours) && { hours: 'Daily 08:00–20:00' }),
        ...(isEmpty(ce.address) && {
          address: '26/61 Moo 4, Maenam, Koh Samui, Surat Thani 84330',
        }),
      },
    },
  })
  console.log(`Contact: filled ${Object.keys(th).length} empty fields`)
}

async function seedAbout(payload: Payload) {
  const current = await payload.findGlobal({ slug: 'about-page', locale: 'th' })
  if (current.title) return console.log('About page: already has content, skipped')
  const image = await upload(
    payload,
    `${SITE}/assets/uploads/about-us/c06dcff22c533e974b8b28ea45a8a0cc.webp`,
    'เรือลมพระยา',
  )
  await payload.updateGlobal({
    slug: 'about-page',
    locale: 'th',
    data: {
      title: 'เกี่ยวกับลมพระยาคาร์โก้',
      intro:
        'บริการส่งพัสดุของลมพระยา ผู้ให้บริการเรือเร็วคาตามารันในอ่าวไทยตั้งแต่ปี 2539 ส่งของระหว่างฝั่งกับเกาะสมุย เกาะพะงัน และเกาะเต่า ไปกับเรือที่ออกตรงเวลาทุกวัน',
      image,
      stats: [
        { value: '25+', label: 'ปีบนเส้นทางอ่าวไทย' },
        { value: '99.8%', label: 'เรือออกตรงเวลา' },
        { value: '10,000+', label: 'ที่นั่งต่อวัน' },
        { value: '900+', label: 'พนักงาน' },
      ],
      content: doc(
        block('heading', 'จากเรือเร็วสู่การส่งพัสดุ'),
        block(
          'paragraph',
          'ลมพระยาเริ่มให้บริการเรือเร็วในปี 2539 และจดทะเบียนเป็นบริษัทในปี 2542 วันนี้เรามีเรือคาตามารันความเร็วสูงหลายลำ วิ่งระหว่างชุมพร เกาะเต่า เกาะพะงัน และเกาะสมุย พร้อมรถโดยสารต่อไปกรุงเทพฯ',
        ),
        block(
          'paragraph',
          'ลมพระยาคาร์โก้ใช้เส้นทางและรอบเรือเดียวกันนี้ส่งพัสดุ ทุกชิ้นถูกสแกนที่สาขาต้นทาง ระหว่างทาง และปลายทาง ลูกค้าจึงติดตามได้ตลอดทางจากหน้าเว็บนี้',
        ),
      ),
    },
  })
  const thAbout = await payload.findGlobal({ slug: 'about-page', locale: 'th' })
  await payload.updateGlobal({
    slug: 'about-page',
    locale: 'en',
    data: {
      title: 'About Lomprayah Cargo',
      intro:
        'The parcel service of Lomprayah, which has run high-speed catamarans in the Gulf of Thailand since 1996. We ship between the mainland and Koh Samui, Koh Phangan and Koh Tao on ferries that leave on time every day.',
      // Array rows are shared between languages, so keep the Thai rows' ids
      stats: (thAbout.stats ?? []).map((row, i) => ({
        ...row,
        label: ['Years in the Gulf', 'On-time departures', 'Seats a day', 'Staff'][i]!,
      })),
      content: doc(
        block('heading', 'From fast ferries to parcels'),
        block(
          'paragraph',
          'Lomprayah began its high-speed ferry service in 1996 and became a company in 1999. Today a fleet of high-speed catamarans runs between Chumphon, Koh Tao, Koh Phangan and Koh Samui, with buses on to Bangkok.',
        ),
        block(
          'paragraph',
          'Lomprayah Cargo ships parcels on the same routes and sailings. Every parcel is scanned at the origin branch, along the way and at the destination, so customers can follow it on this site.',
        ),
      ),
    },
  })
  console.log('About page: added')
}

async function seedHome(payload: Payload) {
  const current = await payload.findGlobal({ slug: 'home-sections', locale: 'th' })
  if (current.services?.length) return console.log('Homepage services: already set, skipped')
  await payload.updateGlobal({
    slug: 'home-sections',
    locale: 'th',
    data: {
      services: [
        {
          icon: 'boat',
          title: 'ส่งข้ามเกาะ',
          text: 'ส่งพัสดุระหว่างฝั่งกับเกาะสมุย พะงัน เต่า ไปกับเรือลมพระยา',
        },
        { icon: 'shield', title: 'ติดตามได้ทุกจุด', text: 'สแกนทุกสาขา ดูสถานะพัสดุได้ตลอดทาง' },
        { icon: 'store', title: 'สาขาใกล้ท่าเรือ', text: 'ส่งและรับพัสดุได้ที่สาขาของลมพระยา' },
      ],
    },
  })
  const th = await payload.findGlobal({ slug: 'home-sections', locale: 'th' })
  const en = [
    [
      'Island shipping',
      'Parcels between the mainland and Samui, Phangan and Tao on Lomprayah ferries.',
    ],
    ['Tracked at every stop', 'Scanned at every branch, so you can follow it all the way.'],
    ['Branches at the piers', 'Send and collect parcels at Lomprayah branches.'],
  ]
  await payload.updateGlobal({
    slug: 'home-sections',
    locale: 'en',
    data: {
      services: (th.services ?? []).map((s, i) => ({ ...s, title: en[i]![0], text: en[i]![1] })),
    },
  })
  console.log('Homepage services: added')
}

async function seedFaqs(payload: Payload) {
  const count = await payload.count({ collection: 'faqs' })
  if (count.totalDocs > 0) return console.log('FAQs: already set, skipped')
  const faqs = [
    {
      category: 'tracking' as const,
      th: [
        'ดูสถานะพัสดุได้อย่างไร',
        'ใส่เลขพัสดุในช่องค้นหาที่หน้าแรก เช่น LP-TAO-261005-0003 แล้วกดค้นหา',
      ],
      en: [
        'How do I track my parcel?',
        'Enter your tracking number, e.g. LP-TAO-261005-0003, in the search box on the homepage.',
      ],
    },
    {
      category: 'tracking' as const,
      th: ['ค้นหาหลายเลขพร้อมกันได้ไหม', 'ได้ ใส่ได้สูงสุด 10 เลข คั่นด้วยเว้นวรรคหรือจุลภาค'],
      en: [
        'Can I track several parcels at once?',
        'Yes. Enter up to 10 numbers separated by spaces or commas.',
      ],
    },
    {
      category: 'general' as const,
      th: [
        'ดูเวลาเปิดและเบอร์ของสาขาได้ที่ไหน',
        'ที่หน้าสาขา มีที่อยู่ เบอร์โทร เวลาทำการ และปุ่มนำทางของทุกสาขา',
      ],
      en: [
        'Where can I find branch hours and phone numbers?',
        'On the Branches page, with the address, phone, hours and directions for every branch.',
      ],
    },
  ]
  for (const [i, f] of faqs.entries()) {
    const doc = await payload.create({
      collection: 'faqs',
      locale: 'th',
      data: {
        question: f.th[0]!,
        answer: f.th[1]!,
        category: f.category,
        showOnHome: true,
        order: i + 1,
      },
    })
    await payload.update({
      collection: 'faqs',
      id: doc.id,
      locale: 'en',
      data: { question: f.en[0], answer: f.en[1] },
    })
  }
  console.log(`FAQs: ${faqs.length} added`)
}

const payload = await getPayload({ config })
await seedContact(payload)
await seedAbout(payload)
await seedHome(payload)
await seedFaqs(payload)
await seedNews(payload)
console.log('Done. Open /admin to review; news posts are drafts until you publish them.')
process.exit(0)
