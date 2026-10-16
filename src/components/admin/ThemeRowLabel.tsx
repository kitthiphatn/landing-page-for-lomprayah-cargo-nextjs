'use client'

import { useRowLabel } from '@payloadcms/ui'

// Shows each festival theme by its name in the collapsed list
export function ThemeRowLabel() {
  const { data, rowNumber } = useRowLabel<{ name?: string }>()
  return <span>{data?.name || `ธีม ${(rowNumber ?? 0) + 1}`}</span>
}
