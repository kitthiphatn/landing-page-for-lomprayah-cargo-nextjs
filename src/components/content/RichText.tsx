import type { DefaultNodeTypes, SerializedBlockNode } from '@payloadcms/richtext-lexical'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import {
  RichText as LexicalRichText,
  type JSXConvertersFunction,
} from '@payloadcms/richtext-lexical/react'

import { sanitize } from '@/lib/sanitize'

type HtmlBlockNode = SerializedBlockNode<{ blockType: 'html'; html: string }>

const converters: JSXConvertersFunction<DefaultNodeTypes | HtmlBlockNode> = ({
  defaultConverters,
}) => ({
  ...defaultConverters,
  blocks: {
    // Sanitized again on display, so content saved before a filter change is still safe
    html: ({ node }) => (
      <div
        className="lp-html"
        dangerouslySetInnerHTML={{ __html: sanitize(node.fields.html ?? '') }}
      />
    ),
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
