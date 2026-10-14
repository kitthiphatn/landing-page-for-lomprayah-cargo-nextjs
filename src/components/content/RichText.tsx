import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'

export function RichText({ data }: { data: unknown }) {
  if (!data || typeof data !== 'object' || !('root' in data)) return null
  return <LexicalRichText data={data as SerializedEditorState} className="lp-prose" />
}
