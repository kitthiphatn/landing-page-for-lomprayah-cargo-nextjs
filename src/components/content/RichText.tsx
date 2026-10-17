import type { DefaultNodeTypes, SerializedBlockNode } from '@payloadcms/richtext-lexical'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import {
  RichText as LexicalRichText,
  type JSXConvertersFunction,
} from '@payloadcms/richtext-lexical/react'

import { isFullPage, sanitize, sanitizeBlock } from '@/lib/sanitize'

import { HtmlFrame } from './HtmlFrame'

type HtmlBlockNode = SerializedBlockNode<{ blockType: 'html'; html: string }>
type GalleryBlockNode = SerializedBlockNode<{
  blockType: 'gallery'
  columns?: '2' | '3' | null
  images?: { id?: string; image?: unknown; caption?: string | null }[] | null
}>

function media(m: unknown): { url: string; alt: string } | null {
  if (!m || typeof m !== 'object' || !('url' in m) || typeof m.url !== 'string') return null
  return { url: m.url, alt: 'alt' in m && typeof m.alt === 'string' ? m.alt : '' }
}

const converters: JSXConvertersFunction<DefaultNodeTypes | HtmlBlockNode | GalleryBlockNode> = ({
  defaultConverters,
}) => ({
  ...defaultConverters,
  blocks: {
    gallery: ({ node }) => {
      const items = (node.fields.images ?? []).flatMap((it) => {
        const m = media(it.image)
        return m ? [{ ...m, caption: it.caption }] : []
      })
      if (!items.length) return null
      return (
        <div
          className={`not-prose my-6 grid gap-3 sm:grid-cols-2 ${node.fields.columns === '3' ? 'lg:grid-cols-3' : ''}`}
        >
          {items.map((it, i) => (
            <figure key={i} className="grid content-start gap-1.5">
              <a href={it.url} target="_blank" rel="noopener noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element -- CMS uploads are served as-is */}
                <img
                  src={it.url}
                  alt={it.alt || it.caption || ''}
                  loading="lazy"
                  className="aspect-[4/3] w-full rounded-xl object-cover"
                />
              </a>
              {it.caption && <figcaption className="text-sm text-muted">{it.caption}</figcaption>}
            </figure>
          ))}
        </div>
      )
    },
    html: ({ node }) => {
      const html = node.fields.html ?? ''
      // Sanitized again on display, so content saved before a filter change is still safe
      if (isFullPage(html)) return <HtmlFrame html={sanitizeBlock(html)} />
      return <div className="lp-html" dangerouslySetInnerHTML={{ __html: sanitize(html) }} />
    },
  },
})

export function RichText({ data }: { data: unknown }) {
  if (!data || typeof data !== 'object' || !('root' in data)) return null
  return (
    <LexicalRichText
      data={data as SerializedEditorState}
      converters={converters}
      className="lp-prose"
    />
  )
}
