import type { Payload } from 'payload'

const MAX_PAGE = 2 * 1024 * 1024
const MAX_IMAGE = 10 * 1024 * 1024

async function readLimited(res: Response, limit: number): Promise<Buffer> {
  const len = Number(res.headers.get('content-length') || 0)
  if (len > limit) throw new Error('ไฟล์ใหญ่เกินไป')
  const data = Buffer.from(await res.arrayBuffer())
  if (data.length > limit) throw new Error('ไฟล์ใหญ่เกินไป')
  return data
}

function httpUrl(raw: string, base?: string): URL | null {
  try {
    const u = new URL(raw, base)
    return u.protocol === 'https:' || u.protocol === 'http:' ? u : null
  } catch {
    return null
  }
}

// The share image a page declares for social media (og:image, else twitter:image)
export async function findShareImage(pageUrl: string): Promise<string | null> {
  const page = httpUrl(pageUrl)
  if (!page) return null
  const res = await fetch(page, {
    signal: AbortSignal.timeout(10000),
    headers: { 'user-agent': 'Mozilla/5.0 (compatible; LomprayahCargoSite/1.0)' },
  })
  if (!res.ok) throw new Error(`เปิดลิงก์ต้นฉบับไม่ได้ (HTTP ${res.status})`)
  const html = (await readLimited(res, MAX_PAGE)).toString('utf8')
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    if (!/(property|name)\s*=\s*["'](og:image|twitter:image)["']/i.test(tag)) continue
    const content = tag.match(/content\s*=\s*["']([^"']+)["']/i)?.[1]
    const url = content && httpUrl(content.replace(/&amp;/g, '&'), page.href)
    if (url) return url.href
  }
  return null
}

// Downloads an image into the media library and returns its id
export async function saveImage(payload: Payload, imageUrl: string, alt: string): Promise<number> {
  const url = httpUrl(imageUrl)
  if (!url) throw new Error('ลิงก์รูปไม่ถูกต้อง')
  const res = await fetch(url, { signal: AbortSignal.timeout(15000) })
  if (!res.ok) throw new Error(`โหลดรูปไม่ได้ (HTTP ${res.status})`)
  const mimetype = (res.headers.get('content-type') || '').split(';')[0].trim()
  if (!mimetype.startsWith('image/')) throw new Error('ลิงก์ที่ได้ไม่ใช่ไฟล์รูป')
  const data = await readLimited(res, MAX_IMAGE)
  const name = decodeURIComponent(url.pathname.split('/').pop() || '') || 'cover'
  const media = await payload.create({
    collection: 'media',
    locale: 'th',
    data: { alt: alt.slice(0, 200) || 'cover' },
    file: { data, mimetype, name, size: data.length },
  })
  return media.id as number
}
