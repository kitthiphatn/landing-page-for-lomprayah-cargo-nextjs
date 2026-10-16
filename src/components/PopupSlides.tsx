'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { isWithinWindow } from '@/lib/schedule'

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
  /** Move to the next slide every this many seconds; null keeps the slides still */
  autoplaySeconds?: number | null
  /** Put the slides and their dots on a white card instead of straight on the dimmed page */
  framed?: boolean
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

export function PopupSlides({
  slides,
  version,
  frequency,
  startsAt,
  endsAt,
  autoplaySeconds,
  framed = false,
  labels,
}: Props) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  // Swipe with a finger or drag with the mouse; the slides follow the pointer while it moves
  const drag = useRef<{ id: number; x: number; t: number; moved: boolean } | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const suppressClick = useRef(false)
  const wheelLock = useRef(0)
  const dialogRef = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)
  const count = slides.length

  useEffect(() => {
    if (!isWithinWindow(startsAt, endsAt) || alreadySeen(version, frequency)) return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- seen-state lives in browser storage, readable only after hydration
    setOpen(true)
  }, [version, frequency, startsAt, endsAt])

  const close = useCallback(() => {
    markSeen(version, frequency)
    setOpen(false)
  }, [version, frequency])

  const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count])

  // While dragging, move the track straight on the element (no React render per pointer move)
  // and turn the animation off; letting go hands the position back to the eased transition
  const setDrag = useCallback(
    (dx: number | null) => {
      const el = trackRef.current
      if (!el) return
      el.style.transition = dx === null ? '' : 'none'
      el.style.transform = `translate3d(calc(${-index * 100}% + ${dx ?? 0}px), 0, 0)`
    },
    [index],
  )

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

  // Auto-advance; the timer restarts whenever the slide changes, so a manual move gets a full interval
  useEffect(() => {
    if (!open || paused || count < 2 || !autoplaySeconds) return
    const timer = window.setTimeout(() => go(index + 1), Math.max(2, autoplaySeconds) * 1000)
    return () => window.clearTimeout(timer)
  }, [open, paused, count, autoplaySeconds, index, go])

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
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onPointerDown={(e) => {
          if (count < 2 || e.button !== 0) return
          if ((e.target as HTMLElement).closest('button')) return
          drag.current = { id: e.pointerId, x: e.clientX, t: e.timeStamp, moved: false }
        }}
        onPointerMove={(e) => {
          const d = drag.current
          if (!d || d.id !== e.pointerId) return
          const dx = e.clientX - d.x
          if (!d.moved && Math.abs(dx) > 6) {
            d.moved = true
            setPaused(true)
            e.currentTarget.setPointerCapture(e.pointerId)
          }
          if (d.moved) setDrag(dx)
        }}
        onPointerUp={(e) => {
          const d = drag.current
          if (!d || d.id !== e.pointerId) return
          drag.current = null
          if (!d.moved) return
          // A mouse stays paused until it leaves the popup; a finger lets go here
          if (e.pointerType !== 'mouse') setPaused(false)
          // A drag is not a click on the slide's link
          suppressClick.current = true
          const dx = e.clientX - d.x
          const width = e.currentTarget.getBoundingClientRect().width
          // A quick flick counts even when it is short
          const fast = Math.abs(dx) / Math.max(1, e.timeStamp - d.t) > 0.5
          const el = trackRef.current
          if (el) el.style.transition = ''
          if (Math.abs(dx) > Math.min(60, width * 0.15) || (fast && Math.abs(dx) > 20))
            go(index + (dx < 0 ? 1 : -1))
          else setDrag(null)
        }}
        onPointerCancel={() => {
          drag.current = null
          setPaused(false)
          setDrag(null)
        }}
        // Links and images would otherwise start the browser's own drag and cancel ours
        onDragStart={(e) => e.preventDefault()}
        onClickCapture={(e) => {
          if (!suppressClick.current) return
          suppressClick.current = false
          e.preventDefault()
          e.stopPropagation()
        }}
        onWheel={(e) => {
          // Two-finger sideways swipe on a laptop touchpad
          if (count < 2 || Math.abs(e.deltaX) < 30 || Math.abs(e.deltaX) < Math.abs(e.deltaY))
            return
          const now = Date.now()
          if (now < wheelLock.current) return
          wheelLock.current = now + 700
          go(index + (e.deltaX > 0 ? 1 : -1))
        }}
      >
        <div
          className={`mx-auto w-[min(100%,calc(76dvh*9/16))] max-w-full sm:w-full ${framed ? 'rounded-3xl bg-surface p-2.5 pb-3 shadow-2xl sm:p-3 sm:pb-4' : ''}`}
        >
          <div
            className={`relative aspect-[9/16] w-full overflow-hidden bg-surface sm:aspect-video ${framed ? 'rounded-2xl' : 'rounded-2xl shadow-2xl'}`}
          >
            <div
              ref={trackRef}
              className={`flex h-full touch-pan-y select-none transition-transform duration-[450ms] ease-[cubic-bezier(.22,.8,.3,1)] will-change-transform ${count > 1 ? 'cursor-grab active:cursor-grabbing' : ''}`}
              style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
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
                      // Every slide loads up front so the next one is ready before it slides in
                      loading="eager"
                      decoding="async"
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
            <div className={`flex items-center justify-center gap-4 ${framed ? 'mt-3' : 'mt-4'}`}>
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
                    className={`h-2.5 rounded-full transition-all ${
                      framed
                        ? i === index
                          ? 'w-8 bg-fg'
                          : 'w-2.5 bg-fg/25 hover:bg-fg/50'
                        : i === index
                          ? 'w-8 bg-white'
                          : 'w-2.5 bg-white/45 hover:bg-white/70'
                    }`}
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
