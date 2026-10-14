import type { DefaultNodeTypes, SerializedBlockNode } from '@payloadcms/richtext-lexical'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import {
  RichText as LexicalRichText,
  type JSXConvertersFunction,
} from '@payloadcms/richtext-lexical/react'

import { isFullPage, sanitize, sanitizeBlock } from '@/lib/sanitize'

import { HtmlFrame } from './HtmlFrame'

type HtmlBlockNode = SerializedBlockNode<{ blockType: 'html'; html: string }>

const converters: JSXConvertersFunction<DefaultNodeTypes | HtmlBlockNode> = ({
  defaultConverters,
}) => ({
  ...defaultConverters,
  blocks: {
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
