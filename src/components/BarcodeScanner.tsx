'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import type { Dictionary } from '@/i18n/dictionaries'

type Labels = Dictionary['track']['scan']
type Problem = 'denied' | 'noCamera' | 'unsupported' | 'failed'

// A QR code may hold a link to our tracking page instead of the bare number
export function numberFromScan(text: string): string {
  const trimmed = text.trim()
  const match = trimmed.match(/\/track\/([^/?#\s]+)/i)
  if (match) {
    try {
      return decodeURIComponent(match[1]).replace(/,/g, ' ')
    } catch {
      return match[1]
    }
  }
  return trimmed
}

export function BarcodeScanner({
  labels,
  onResult,
  onClose,
}: {
  labels: Labels
  onResult: (text: string) => void
  onClose: () => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [problem, setProblem] = useState<Problem | null>(null)
  const [ready, setReady] = useState(false)
  const done = useRef(false)

  // The callbacks change on every parent render; the camera should not restart for that
  const resultRef = useRef(onResult)
  const closeCb = useRef(onClose)
  useEffect(() => {
    resultRef.current = onResult
    closeCb.current = onClose
  })

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCb.current()
    }
    window.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    let stop: (() => void) | undefined

    async function start() {
      if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
        setProblem('unsupported')
        return
      }
      try {
        const [{ BrowserMultiFormatReader }, { BarcodeFormat, DecodeHintType }] = await Promise.all(
          [import('@zxing/browser'), import('@zxing/library')],
        )
        if (cancelled || !videoRef.current) return
        const hints = new Map()
        hints.set(DecodeHintType.POSSIBLE_FORMATS, [
          BarcodeFormat.QR_CODE,
          BarcodeFormat.CODE_128,
          BarcodeFormat.CODE_39,
          BarcodeFormat.CODE_93,
          BarcodeFormat.DATA_MATRIX,
        ])
        const reader = new BrowserMultiFormatReader(hints, { delayBetweenScanAttempts: 150 })
        const controls = await reader.decodeFromConstraints(
          { video: { facingMode: { ideal: 'environment' } }, audio: false },
          videoRef.current,
          (result) => {
            if (!result || done.current) return
            const text = numberFromScan(result.getText())
            if (!text) return
            done.current = true
            navigator.vibrate?.(60)
            resultRef.current(text)
          },
        )
        if (cancelled) {
          controls.stop()
          return
        }
        stop = () => controls.stop()
        setReady(true)
      } catch (err) {
        if (cancelled) return
        const name = (err as { name?: string })?.name
        if (name === 'NotAllowedError' || name === 'SecurityError') setProblem('denied')
        else if (name === 'NotFoundError' || name === 'OverconstrainedError') setProblem('noCamera')
        else setProblem('failed')
      }
    }

    start()
    return () => {
      cancelled = true
      stop?.()
    }
  }, [])

  // Rendered on the body so an animated hero cannot trap the fixed overlay
  return createPortal(
    <div
      className="fixed inset-0 z-[70] grid place-items-center bg-[rgba(6,12,30,.8)] p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="scan-title"
        className="grid w-full max-w-md gap-4 rounded-2xl bg-surface p-5 text-fg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3">
          <h2 id="scan-title" className="font-display text-lg font-semibold">
            {labels.title}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={labels.close}
            className="grid size-9 place-items-center rounded-full text-muted hover:bg-chip hover:text-fg"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="relative aspect-square overflow-hidden rounded-xl bg-black">
          <video ref={videoRef} muted playsInline className="size-full object-cover" />
          {ready && !problem && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-[18%] rounded-lg border-2 border-sun shadow-[0_0_0_9999px_rgba(0,0,0,.35)]"
            >
              <span className="absolute inset-x-2 top-1/2 h-0.5 animate-pulse bg-sun/80" />
            </div>
          )}
          {!ready && !problem && (
            <p className="absolute inset-0 grid place-items-center text-sm text-white/80">
              {labels.starting}
            </p>
          )}
          {problem && (
            <p
              role="alert"
              className="absolute inset-0 grid place-items-center p-6 text-center text-sm text-white"
            >
              {labels[problem]}
            </p>
          )}
        </div>

        <p className="text-sm text-muted">{labels.help}</p>
      </div>
    </div>,
    document.body,
  )
}
