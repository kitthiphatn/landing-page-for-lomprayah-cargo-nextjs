import { NextResponse, type NextRequest } from 'next/server'

import { defaultLocale, isLocale } from './i18n/config'

// Sends visitors without a language prefix to /th or /en (based on a saved choice, then the browser)
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const first = pathname.split('/')[1] ?? ''
  if (isLocale(first)) return NextResponse.next()

  const saved = request.cookies.get('NEXT_LOCALE')?.value
  const browser = request.headers.get('accept-language')?.toLowerCase().startsWith('en')
    ? 'en'
    : null
  const locale = saved && isLocale(saved) ? saved : (browser ?? defaultLocale)

  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  // Skip the admin panel, API, Next.js internals and files with an extension
  matcher: ['/((?!admin|api|_next|.*\\..*).*)'],
}
