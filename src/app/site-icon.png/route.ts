import { siteIconSource, squarePng } from '@/lib/siteIcon'

// The favicon from Site settings, padded to a 512×512 square
export async function GET() {
  const source = await siteIconSource()
  if (!source) return new Response(null, { status: 404 })
  try {
    const png = await squarePng(source, 512)
    return new Response(new Uint8Array(png), {
      headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' },
    })
  } catch {
    return new Response(null, { status: 404 })
  }
}
