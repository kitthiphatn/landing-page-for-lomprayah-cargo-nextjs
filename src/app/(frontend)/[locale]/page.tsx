import Link from 'next/link'
import { notFound } from 'next/navigation'

import { FaqList, faqJsonLd } from '@/components/content/FaqList'
import { JsonLd } from '@/components/content/JsonLd'
import { PostCard } from '@/components/content/PostCard'
import { RouteCard } from '@/components/content/RouteCard'
import { Section } from '@/components/content/Section'
import { ServiceIcon } from '@/components/content/ServiceIcon'
import { TrackingSearch } from '@/components/TrackingSearch'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { getHomeContent, mediaUrl } from '@/lib/content'
import { getSiteContent } from '@/lib/payload'
import { branchNames } from '@/lib/tracking/branches'
import { fetchBranches } from '@/lib/tracking/server'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const t = getDictionary(locale)
  const [site, home] = await Promise.all([getSiteContent(locale), getHomeContent(locale)])
  const hero = site?.settings.hero
  const contact = site?.settings.contact
  const sections = home?.sections
  const routes = sections?.showRoutes === false ? [] : (home?.routes ?? [])
  const names = routes.length ? branchNames(await fetchBranches(), locale) : new Map()
  const faqs = sections?.showFaq === false ? [] : (home?.faqs ?? [])
  const posts = sections?.showNews === false ? [] : (home?.posts ?? [])
  const services = sections?.services ?? []
  const heroBg = mediaUrl(hero?.background)

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-[#132968] via-[#0f4f7a] to-[#0e7c86] text-white">
        {heroBg && (
          // eslint-disable-next-line @next/next/no-img-element -- CMS uploads are served as-is
          <img
            src={heroBg}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-luminosity"
          />
        )}
        <div className="relative mx-auto grid max-w-3xl gap-6 px-4 pt-14 pb-20 md:pt-20">
          <h1 className="text-3xl leading-tight font-bold md:text-5xl">
            {hero?.title || t.hero.title}
          </h1>
          <p className="max-w-[56ch] text-[#d8e2ff]">{hero?.subtitle || t.hero.subtitle}</p>
          <TrackingSearch locale={locale} t={t.track} />
          <Link
            href={`/${locale}/branches`}
            className="w-fit text-sm font-medium text-white/90 underline underline-offset-4 hover:text-white"
          >
            {t.home.findBranch} →
          </Link>
        </div>
        <svg
          className="pointer-events-none absolute inset-x-0 bottom-0 h-12 w-full text-bg"
          viewBox="0 0 1400 48"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M0 24 Q50 8 100 24 T200 24 T300 24 T400 24 T500 24 T600 24 T700 24 T800 24 T900 24 T1000 24 T1100 24 T1200 24 T1300 24 T1400 24 V48 H0z"
          />
        </svg>
      </section>

      {home && home.banners.length > 0 && (
        <div className="mx-auto max-w-6xl px-4 pt-8">
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
            {home.banners.map((b) => {
              const src = mediaUrl(b.image)
              if (!src) return null
              // eslint-disable-next-line @next/next/no-img-element -- CMS uploads are served as-is
              const img = <img src={src} alt={b.title} className="h-full w-full object-cover" />
              return (
                <div
                  key={b.id}
                  className="aspect-[3/1] w-[min(100%,720px)] shrink-0 snap-start overflow-hidden rounded-2xl border border-line bg-chip"
                >
                  {b.link ? (
                    <a href={b.link} className="block h-full">
                      {img}
                    </a>
                  ) : (
                    img
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {services.length > 0 && (
        <Section title={t.home.services}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div key={s.id} className="grid gap-2 rounded-2xl border border-line bg-surface p-5">
                <span className="grid size-11 place-items-center rounded-xl bg-chip text-navy">
                  <ServiceIcon name={s.icon} className="size-6" />
                </span>
                <h3 className="font-display font-semibold">{s.title}</h3>
                {s.text && <p className="text-sm leading-relaxed text-muted">{s.text}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {routes.length > 0 && (
        <Section
          title={t.home.routes}
          more={{ href: `/${locale}/routes`, label: t.home.allRoutes }}
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {routes.map((r) => (
              <RouteCard key={r.id} route={r} names={names} locale={locale} t={t.routes} />
            ))}
          </div>
        </Section>
      )}

      {posts.length > 0 && (
        <Section title={t.home.news} more={{ href: `/${locale}/news`, label: t.home.allNews }}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <PostCard key={p.id} post={p} locale={locale} t={t.news} />
            ))}
          </div>
        </Section>
      )}

      {faqs.length > 0 && (
        <Section title={t.home.faq} more={{ href: `/${locale}/faq`, label: t.home.allFaq }}>
          <JsonLd data={faqJsonLd(faqs)} />
          <FaqList faqs={faqs} />
        </Section>
      )}

      {(contact?.lineUrl || contact?.phone) && (
        <section className="mx-auto max-w-6xl px-4 pt-14">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-navy p-6 text-bg">
            <div className="grid gap-1">
              <h2 className="font-display text-xl font-semibold">{t.home.contactTitle}</h2>
              <p className="opacity-85">{t.home.contactText}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {contact.lineUrl && (
                <a
                  href={contact.lineUrl}
                  className="rounded-xl bg-[#06c755] px-5 py-2.5 font-semibold text-white hover:brightness-95"
                >
                  {t.home.line}
                </a>
              )}
              {contact.phone && (
                <a
                  href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`}
                  className="rounded-xl bg-sun px-5 py-2.5 font-semibold text-[#1b1300] hover:brightness-95"
                >
                  {t.home.call} {contact.phone}
                </a>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
