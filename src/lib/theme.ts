import type { SiteSetting } from '@/payload-types'

import { isWithinWindow } from './schedule'

type Colors = { primary: string; secondary: string; accent: string }

const HEX = /^#[0-9a-f]{6}$/i
const valid = (c?: Partial<Colors> | null): c is Colors =>
  !!c && [c.primary, c.secondary, c.accent].every((v) => typeof v === 'string' && HEX.test(v))

// The festival theme running now, else the custom colors; null keeps the built-in palette
export function activeThemeColors(settings?: SiteSetting | null): Colors | null {
  const festival = settings?.seasonalThemes?.find(
    (t) => isWithinWindow(t.startsAt, t.endsAt) && valid(t),
  )
  if (festival) return festival as Colors
  if (settings?.primaryColor === 'custom' && valid(settings.customColors))
    return settings.customColors
  return null
}

// Black or white text, whichever reads better on this background
function textOn(hex: string): string {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.4 ? '#1b1300' : '#ffffff'
}

// CSS that swaps the brand tokens; dark mode gets lighter mixes so text on dark stays readable
export function themeCss({ primary, secondary, accent }: Colors): string {
  const light = (c: string, pct: number) => `color-mix(in oklab, ${c} ${pct}%, white)`
  return (
    `:root{--navy:${primary};--sea:${secondary};--sun:${accent};--on-sun:${textOn(accent)};` +
    `--chip:${light(primary, 10)};--hero-from:${primary};--hero-to:${secondary}}` +
    `.dark{--navy:${light(primary, 55)};--sea:${light(secondary, 60)};--sun:${light(accent, 80)};` +
    `--chip:color-mix(in oklab, ${primary} 30%, #141d38);--on-sun:#1b1300}`
  )
}
