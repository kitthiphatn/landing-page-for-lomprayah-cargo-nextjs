'use client'

import { ThemeProvider as NextThemes } from 'next-themes'
import type { ReactNode } from 'react'

// Two themes only. First visit follows the device setting; after that the visitor's choice is remembered.
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemes attribute="class" themes={['light', 'dark']} defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </NextThemes>
  )
}
