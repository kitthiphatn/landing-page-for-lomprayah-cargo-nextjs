import config from '@payload-config'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

// Opened by the admin "Preview" button: signed-in staff see the page with unpublished changes
export async function GET(req: Request) {
  const path = new URL(req.url).searchParams.get('path') ?? '/'
  // Only same-site paths, so this can't be used to bounce visitors elsewhere
  const target = path.startsWith('/') && !path.startsWith('//') ? path : '/'
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: req.headers })
  if (!user) return new Response('Sign in to the admin panel to preview drafts.', { status: 401 })
  ;(await draftMode()).enable()
  redirect(target)
}
