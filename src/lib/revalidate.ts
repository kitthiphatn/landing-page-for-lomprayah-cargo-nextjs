import { revalidatePath } from 'next/cache'
import type { GlobalAfterChangeHook } from 'payload'

// Show admin edits on the site right away instead of waiting for the next rebuild
export const revalidateSite: GlobalAfterChangeHook = ({ doc }) => {
  try {
    revalidatePath('/', 'layout')
  } catch {
    // Not inside a Next.js request (e.g. a CLI script); nothing to refresh
  }
  return doc
}
