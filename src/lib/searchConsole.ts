// Takes what was pasted from Search Console (the whole meta tag or just its code) and returns the code
export function searchConsoleCode(value: string | null | undefined): string | null {
  const text = value?.trim()
  if (!text) return null
  const fromTag = text.match(/content\s*=\s*["']([^"']+)["']/i)?.[1]
  const code = (fromTag ?? text).trim()
  return /^[A-Za-z0-9_-]{10,}$/.test(code) ? code : null
}
