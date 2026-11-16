import path from 'node:path'

import { getPayload } from 'payload'
import sharp from 'sharp'

import config from '@payload-config'

// The favicon from Site settings as an image sharp can read, or null when none is uploaded
export async function siteIconSource(): Promise<string | null> {
  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({ slug: 'site-settings', depth: 1 })
    const icon = settings.favicon
    if (!icon || typeof icon !== 'object' || !icon.filename) return null
    return path.resolve(process.env.MEDIA_DIR || 'media', icon.filename)
  } catch {
    return null
  }
}

// Pads the icon to a square PNG. Browsers and Google only accept square icons, and logos are
// rarely uploaded square.
export function squarePng(source: string | Buffer, size: number): Promise<Buffer> {
  return sharp(source)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer()
}

// An .ico file holding PNG images, which every current browser and Google's favicon fetcher read
export function icoFromPngs(images: { size: number; png: Buffer }[]): Buffer {
  const header = Buffer.alloc(6 + 16 * images.length)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(images.length, 4)
  let offset = header.length
  images.forEach(({ size, png }, i) => {
    const at = 6 + 16 * i
    header.writeUInt8(size >= 256 ? 0 : size, at)
    header.writeUInt8(size >= 256 ? 0 : size, at + 1)
    header.writeUInt8(0, at + 2)
    header.writeUInt8(0, at + 3)
    header.writeUInt16LE(1, at + 4)
    header.writeUInt16LE(32, at + 6)
    header.writeUInt32LE(png.length, at + 8)
    header.writeUInt32LE(offset, at + 12)
    offset += png.length
  })
  return Buffer.concat([header, ...images.map((i) => i.png)])
}
