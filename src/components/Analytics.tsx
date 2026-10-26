'use client'

import { useEffect } from 'react'

import { CONSENT_CHANGE_EVENT, readConsent, type Consent } from '@/lib/consent'

type GtagWindow = { dataLayer?: unknown[] } & Record<string, unknown>

// Google Analytics 4, loaded only once the visitor allows analytics cookies (PDPA).
// GA4 counts page changes itself from browser history, so client-side navigation needs nothing.
export function Analytics({ id }: { id: string }) {
  useEffect(() => {
    const w = window as unknown as GtagWindow
    const apply = (consent: Consent | null) => {
      if (!consent?.analytics) {
        // Withdrawn after loading: stop sending; the script stays until the next page load
        w[`ga-disable-${id}`] = true
        return
      }
      w[`ga-disable-${id}`] = false
      if (document.getElementById('lp-gtag')) return
      w.dataLayer = w.dataLayer || []
      // gtag.js reads the arguments object itself, so this must stay a plain function
      const gtag = function () {
        // eslint-disable-next-line prefer-rest-params
        w.dataLayer!.push(arguments)
      } as (...args: unknown[]) => void
      gtag('js', new Date())
      gtag('config', id)
      const script = document.createElement('script')
      script.id = 'lp-gtag'
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`
      document.head.appendChild(script)
    }
    apply(readConsent())
    const onChange = (e: Event) => apply((e as CustomEvent<Consent>).detail)
    window.addEventListener(CONSENT_CHANGE_EVENT, onChange)
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onChange)
  }, [id])

  return null
}
