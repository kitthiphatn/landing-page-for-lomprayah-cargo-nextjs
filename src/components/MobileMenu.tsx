'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

type Props = {
  links: { href: string; label: string }[]
  labels: { open: string; close: string }
}

export function MobileMenu({ links, labels }: Props) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Close after navigating
  // eslint-disable-next-line react-hooks/set-state-in-effect -- reacting to a route change
  useEffect(() => setOpen(false), [pathname])

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? labels.close : labels.open}
        className="grid size-10 place-items-center rounded-full border border-line text-fg hover:bg-chip"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'} />
        </svg>
      </button>
      {open && (
        <nav
          id="mobile-menu"
          className="absolute inset-x-0 top-16 grid border-b border-line bg-surface px-4 py-2 shadow-lg"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="border-b border-line py-3 font-medium last:border-0 hover:text-navy"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  )
}
