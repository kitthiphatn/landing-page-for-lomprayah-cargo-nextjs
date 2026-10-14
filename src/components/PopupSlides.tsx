'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export type PopupSlide = {
  src: string
  mobileSrc?: string | null
  alt: string
  link?: string | null
}

type Props = {
  slides: PopupSlide[]
  version: string
  frequency: 'day' | 'session'
  startsAt?: string | null
  endsAt?: string | null
  labels: {
    close: string
    prev: string
    next: string
    goTo: string
    title: string
  }
}

const STORAGE_KEY = 'lp_popup_seen'
const DAY = 24 * 60 * 60 * 1000

function alreadySeen(version: string, frequency: Props['frequency']): boolean {
  try {
    const store = frequency === 'session' ? sessionStorage : localStorage
    const raw = store.getItem(STORAGE_KEY)
    if (!raw) return false
    const seen = JSON.parse(raw) as { version: string; at: number }
    if (seen.version !== version) return false
    return frequency === 'session' || Date.now() - seen.at < DAY
  } catch {
    return false
  }
}

function markSeen(version: string, frequency: Props['frequency']) {
  try {
    const store = frequency === 'session' ? sessionStorage : localStorage
    store.setItem(STORAGE_KEY, JSON.stringify({ version, at: Date.now() }))
  } catch {
    // Storage blocked (private mode): the popup may show again, which is harmless
  }
}

export function PopupSlides({ slides, version, frequency, startsAt, endsAt, labels }: Props) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const touchX = useRef<number | null>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const count = slides.length

  useEffect(() => {
    const now = Date.now()
    if (startsAt && new Date(startsAt).getTime() > now) return
    if (endsAt && new Date(endsAt).getTime() < now) return
    if (!alreadySeen(version, frequency)) setOpen(true)
  }, [version, frequency, startsAt, endsAt])

  const close = useCallback(() => {
    markSeen(version, frequency)
    setOpen(false)
  }, [version, frequency])

  const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count])

  useEffect(() => {
    if (!open) return
    dialogRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') go(index - 1)
      if (e.key === 'ArrowRight') go(index + 1)
    }
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, index, go, close])

  if (!open || count === 0) return null

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-[rgba(6,12,30,.72)] p-4 backdrop-blur-sm"
      onClick={close}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={labels.title}
        className="relative w-full max-w-4xl outline-none"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => (touchX.current = e.touches[0]?.clientX ?? null)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return
          const dx = (e.changedTouches[0]?.clientX ?? touchX.current) - touchX.current
          if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1))
          touchX.current = null
        }}
      >
        <div className="relative mx-auto aspect-[9/16] w-[min(100%,calc(76dvh*9/16))] max-w-full overflow-hidden rounded-2xl bg-surface shadow-2xl sm:aspect-video sm:w-full">
          <div
            className="flex h-full transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {slides.map((s, i) => {
              // Phones get the 9:16 image; without one, the 16:9 image is fitted inside the tall frame
              const img = (
                <picture>
                  {s.mobileSrc && <source media="(max-width: 639px)" srcSet={s.mobileSrc} />}
                  <img
                    src={s.src}
                    alt={s.alt}
                    className={`h-full w-full ${s.mobileSrc ? 'object-cover' : 'object-contain sm:object-cover'}`}
                    draggable={false}
                    loading={i === 0 ? 'eager' : 'lazy'}
                  />
                </picture>
              )
              return (
                <div
                  key={i}
                  className="h-full w-full shrink-0 [&_picture]:block [&_picture]:h-full [&_a]:block [&_a]:h-full"
                  aria-hidden={i !== index}
                >
                  {s.link ? (
                    <a
                      href={s.link}
                      onClick={() => markSeen(version, frequency)}
                      tabIndex={i === index ? 0 : -1}
                    >
                      {img}
                    </a>
                  ) : (
                    img
                  )}
                </div>
              )
            })}
          </div>

          <button
            type="button"
            onClick={close}
            aria-label={labels.close}
            className="absolute top-3 right-3 grid size-10 place-items-center rounded-full bg-black/55 text-white hover:bg-black/75"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          {count > 1 && (
            <>
              <ArrowButton
                side="left"
                label={labels.prev}
                onClick={() => go(index - 1)}
                className="absolute top-1/2 left-3 hidden -translate-y-1/2 sm:grid"
              />
              <ArrowButton
                side="right"
                label={labels.next}
                onClick={() => go(index + 1)}
                className="absolute top-1/2 right-3 hidden -translate-y-1/2 sm:grid"
              />
            </>
          )}
        </div>

        {count > 1 && (
          <div className="mt-4 flex items-center justify-center gap-4">
            <ArrowButton
              side="left"
              label={labels.prev}
              onClick={() => go(index - 1)}
              className="grid sm:hidden"
            />
            <div className="flex items-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`${labels.goTo} ${i + 1}`}
                  aria-current={i === index}
                  className={`h-2.5 rounded-full transition-all ${i === index ? 'w-8 bg-white' : 'w-2.5 bg-white/45 hover:bg-white/70'}`}
                />
              ))}
            </div>
            <ArrowButton
              side="right"
              label={labels.next}
              onClick={() => go(index + 1)}
              className="grid sm:hidden"
            />
          </div>
        )}
      </div>
    </div>
  )
}

function ArrowButton({
  side,
  label,
  onClick,
  className,
}: {
  side: 'left' | 'right'
  label: string
  onClick: () => void
  className: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`${className} size-11 place-items-center rounded-full bg-black/45 text-white hover:bg-black/70`}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        aria-hidden="true"
      >
        <path d={side === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
      </svg>
    </button>
  )
}
