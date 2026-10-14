'use client'

import { useEffect, useRef, useState } from 'react'

// Reports the page height to the site so the frame grows with its content, and opens links
// in a new tab. The frame has no access to the site (no same-origin), only this message.
const FRAME_HELPERS = `<base target="_blank"><script>(function(){function s(){parent.postMessage({lpHtmlHeight:document.documentElement.scrollHeight},"*")}addEventListener("load",s);new ResizeObserver(s).observe(document.documentElement);setTimeout(s,300);setTimeout(s,1500)})()</script>`

export function HtmlFrame({ html, title }: { html: string; title?: string }) {
  const ref = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState(600)

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source !== ref.current?.contentWindow) return
      const next = Number((event.data as { lpHtmlHeight?: unknown })?.lpHtmlHeight)
      if (Number.isFinite(next) && next > 0) setHeight(Math.min(Math.ceil(next), 20000))
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  const srcDoc = /<head[^>]*>/i.test(html)
    ? html.replace(/<head([^>]*)>/i, `<head$1>${FRAME_HELPERS}`)
    : FRAME_HELPERS + html

  return (
    <iframe
      ref={ref}
      title={title ?? 'HTML'}
      srcDoc={srcDoc}
      sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
      loading="lazy"
      className="lp-html-frame"
      style={{ height }}
    />
  )
}
