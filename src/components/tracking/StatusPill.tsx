import type { Locale } from '@/i18n/config'
import { statusMeta, TONE_CLASS } from '@/lib/tracking/status'

export function StatusPill({ status, locale }: { status: string; locale: Locale }) {
  const meta = statusMeta(status, locale)
  return (
    <span
      className={`inline-flex items-center rounded-full border border-current px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${TONE_CLASS[meta.tone]}`}
    >
      {meta.label}
    </span>
  )
}

export function VehicleIcon({ status, className = '' }: { status: string; className?: string }) {
  const { vehicle } = statusMeta(status, 'en')
  const common = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    'aria-hidden': true,
    className,
  }
  if (vehicle === 'boat')
    return (
      <svg {...common}>
        <path d="M3 15h18l-3 5H6z" />
        <path d="M7 15V9h10v6M10 9V5h4v4" />
      </svg>
    )
  if (vehicle === 'truck')
    return (
      <svg {...common}>
        <path d="M2 6h11v9H2zM13 9h4l4 4v2h-8" />
        <circle cx="6" cy="17" r="2" />
        <circle cx="17" cy="17" r="2" />
      </svg>
    )
  return (
    <svg {...common}>
      <path d="M3 7l9-4 9 4-9 4-9-4z" />
      <path d="M3 7v10l9 4 9-4V7M12 11v10" />
    </svg>
  )
}
