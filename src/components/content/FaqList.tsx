import type { Faq } from '@/payload-types'

// Native <details> keeps every answer in the HTML for search engines and works without JS
export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="grid gap-2">
      {faqs.map((f) => (
        <details
          key={f.id}
          className="group rounded-2xl border border-line bg-surface px-4 open:border-navy/40"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium [&::-webkit-details-marker]:hidden">
            {f.question}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="shrink-0 text-muted transition-transform group-open:rotate-180"
              aria-hidden="true"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </summary>
          <p className="pb-4 leading-relaxed whitespace-pre-line text-muted">{f.answer}</p>
        </details>
      ))}
    </div>
  )
}

export function faqJsonLd(faqs: Faq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }
}
