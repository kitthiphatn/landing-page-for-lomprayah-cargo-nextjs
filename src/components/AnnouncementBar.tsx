import { isWithinWindow } from '@/lib/schedule'
import type { Announcement } from '@/payload-types'

export function AnnouncementBar({ data }: { data: Announcement | null | undefined }) {
  if (!data?.enabled || !data.message) return null
  if (!isWithinWindow(data.startsAt, data.endsAt)) return null

  const tone = data.tone === 'warning' ? 'bg-sun text-on-sun' : 'bg-navy text-surface'
  const body = <span className="font-medium">{data.message}</span>
  return (
    <div className={`${tone} px-4 py-2 text-center text-sm`} role="status">
      {data.link ? (
        <a href={data.link} className="underline underline-offset-2">
          {body}
        </a>
      ) : (
        body
      )}
    </div>
  )
}
