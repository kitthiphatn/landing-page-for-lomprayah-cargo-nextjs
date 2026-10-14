import type { Locale } from '@/i18n/config'
import type { Branch } from '@/lib/tracking/types'

export function formatDateTime(iso: string, locale: Locale): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat(locale === 'th' ? 'th-TH' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Bangkok',
  }).format(date)
}

export function branchName(
  code: string | null,
  branches: Map<string, Branch>,
  locale: Locale,
): string {
  if (!code) return '-'
  const b = branches.get(code)
  if (!b) return code
  return (locale === 'en' && b.nameEn) || b.name
}
