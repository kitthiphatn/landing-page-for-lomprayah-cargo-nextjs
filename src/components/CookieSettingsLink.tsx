'use client'

import { CONSENT_OPEN_EVENT } from '@/lib/consent'

export function CookieSettingsLink({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}
      className="underline underline-offset-2 hover:text-navy"
    >
      {label}
    </button>
  )
}
