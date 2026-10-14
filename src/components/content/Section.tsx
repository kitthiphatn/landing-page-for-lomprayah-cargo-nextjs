import Link from 'next/link'
import type { ReactNode } from 'react'

export function Section({
  title,
  more,
  children,
}: {
  title: string
  more?: { href: string; label: string }
  children: ReactNode
}) {
  return (
    <section className="mx-auto grid max-w-6xl gap-5 px-4 pt-14">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-display text-2xl font-semibold">{title}</h2>
        {more && (
          <Link href={more.href} className="text-sm font-medium text-navy hover:underline">
            {more.label} →
          </Link>
        )}
      </div>
      {children}
    </section>
  )
}
