import { DEFAULT_ICON_SVG } from '@/lib/defaultIcon'
import { icoFromPngs, siteIconSource, squarePng } from '@/lib/siteIcon'

// Google and some browsers ask for /favicon.ico directly instead of reading the page's icon tags
export const dynamic = 'force-dynamic'

export async function GET() {
  const source = (await siteIconSource()) ?? Buffer.from(DEFAULT_ICON_SVG)
  try {
    const images = await Promise.all(
      [48, 96, 192].map(async (size) => ({ size, png: await squarePng(source, size) })),
    )
    return new Response(new Uint8Array(icoFromPngs(images)), {
      headers: { 'Content-Type': 'image/x-icon', 'Cache-Control': 'public, max-age=86400' },
    })
  } catch {
    return new Response(null, { status: 404 })
  }
}
