import type { Announcement } from '@/payload-types'

export function AnnouncementBar({ data }: { data: Announcement | null | undefined }) {
  if (!data?.enabled || !data.message) return null
  const now = Date.now()
  if (data.startsAt && new Date(data.startsAt).getTime() > now) return null
  if (data.endsAt && new Date(data.endsAt).getTime() < now) return null

  const tone = data.tone === 'warning' ? 'bg-sun text-[#1b1300]' : 'bg-navy text-surface'
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
