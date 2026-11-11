import path from 'node:path'

import { getPayload } from 'payload'
import sharp from 'sharp'

import config from '@payload-config'

// The favicon from Site settings, padded to a 512×512 square. Browsers and Google only accept
// square icons, and logos are rarely uploaded square.
export async function GET() {
  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({ slug: 'site-settings', depth: 1 })
    const icon = settings.favicon
    if (!icon || typeof icon !== 'object' || !icon.filename) {
      return new Response(null, { status: 404 })
    }
    const file = path.resolve(process.env.MEDIA_DIR || 'media', icon.filename)
    const png = await sharp(file)
      .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer()
    return new Response(new Uint8Array(png), {
      headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' },
    })
  } catch {
    return new Response(null, { status: 404 })
  }
}
