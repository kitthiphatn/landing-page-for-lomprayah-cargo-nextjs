'use client'

import { useEffect } from 'react'

import { CREDIT } from '@/lib/credit'

let shown = false

// A signed note for anyone who opens the browser's developer tools (F12 → Console)
export function DevCredit() {
  useEffect(() => {
    // Once per page load, even when React mounts this twice in development
    if (shown) return
    shown = true
    console.log(
      '%c Lomprayah Cargo %c\n\nสร้างโดย %s ร่วมกับ %s · %s\nBuilt by %s with %s',
      'background:#132968;color:#fff;font-size:16px;font-weight:700;padding:6px 10px;border-radius:6px',
      'color:inherit;font-size:13px',
      CREDIT.developer,
      CREDIT.with,
      CREDIT.year,
      CREDIT.developer,
      CREDIT.with,
    )
  }, [])
  return null
}
