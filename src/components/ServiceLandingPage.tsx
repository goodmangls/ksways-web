import Link from 'next/link';
import type { ServicePage } from '@/lib/service-pages';
import { homeContent } from '@/lib/content';
import { faqJsonLd, serviceJsonLd, siteUrl } from '@/lib/seo';
import { BrandLogo } from './BrandLogo';
import { SiteFooter } from './SiteFooter';

const monoLabelClass = 'font-mono text-xs font-semibold uppercase tracking-[.12em]';

function sectionAnchor(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** 긴 리드(70단어+)를 첫 문장과 나머지로 나눠, 첫 문장만 크게 보여 준다. */
function splitLead(lead: string): { first: string; rest: string } {
  const [first, ...rest] = lead.split(/(?<=\.)\s+/);
  return { first, rest: rest.join(' ') };
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ServiceLandingPage({ page, basePath }: { page: ServicePage; basePath: 'services' | 'network' }) {
  const quoteHref = page.quoteServiceKey ? `/quote?service=${page.quoteServiceKey}` : '/quote';
  const pageUrl = `${siteUrl}/${basePath}/${page.slug}`;
  const lead = splitLead(page.lead);
  const crumb = basePath === 'network' ? { label: 'Network', href: '/#network' } : { label: 'Services', href: '/#services' };

  return (
    <main className="min-h-screen bg-[#f4f7f6] text-[#001112]">
      <script
        id={`service-jsonld-${page.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceJsonLd({ name: page.eyebrow, description: page.lead, url: pageUrl })),
        }}
      />
      <script
        id={`service-faq-jsonld-${page.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(page.faqs)) }}
      />

      <section aria-labelledby="service-heading" className="bg-[#001112] text-white">
        <header className="mx-auto flex h-[80px] max-w-[1280px] items-center justify-between gap-6 px-6 sm:px-10 lg:px-14">
          <BrandLogo priority />
          <a href={quoteHref} className="inline-flex min-h-11 items-center rounded-full bg-[#b88a5a] px-5 text-sm font-extrabold text-[#001112] transition hover:bg-[#a5794d]">
            Get a quote
          </a>
        </header>

        <div className="mx-auto max-w-[1280px] px-6 pb-16 pt-10 sm:px-10 lg:px-14 lg:pb-20 lg:pt-16">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-white/72">
              <li>
                <Link href={crumb.href} className="inline-flex min-h-11 items-center transition hover:text-white">{crumb.label}</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-semibold text-[#e7c99a]">{page.eyebrow}</li>
            </ol>
          </nav>
          <h1 id="service-heading" className="mt-4 max-w-[14em] text-[clamp(40px,10.5vw,52px)] font-black leading-[1.04] tracking-[-.028em] text-balance sm:text-[clamp(48px,5.6vw,80px)] sm:leading-[1.02] sm:tracking-[-.03em]">
            {page.title}
          </h1>
          <div className="mt-8 grid max-w-[1120px] gap-5 lg:grid-cols-2 lg:gap-14">
            <p className="text-[clamp(18px,1.5vw,21px)] font-medium leading-[1.55] text-white/92 text-pretty">{lead.first}</p>
            {lead.rest ? <p className="text-[17px] leading-[1.7] text-white/78 text-pretty">{lead.rest}</p> : null}
          </div>
          <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <a href={quoteHref} className="inline-flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-full bg-[#b88a5a] px-7 font-extrabold text-[#001112] transition hover:bg-[#a5794d] sm:w-auto">
              Send shipment details
              <ArrowIcon />
            </a>
            <Link href="/#services" className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full border border-white/45 px-7 font-bold text-white transition hover:border-white hover:bg-white/[.06] sm:w-auto">
              Back to services
            </Link>
          </div>
        </div>

        {page.trustCards ? (
          <div className="border-t border-[#1f3436]">
            <div className="mx-auto max-w-[1280px] px-6 pt-8 sm:px-10 lg:px-14">
              <p className={`${monoLabelClass} text-[#e7c99a]`}>Partner confidence</p>
              <div className="grid lg:grid-cols-3">
                {page.trustCards.map((card) => (
                  <article key={card.label} className="border-b border-[#1f3436] py-7 last:border-b-0 lg:border-b-0 lg:border-r lg:pb-10 lg:pr-8 lg:last:border-r-0 lg:[&:not(:first-child)]:pl-8">
                    <p className={`${monoLabelClass} text-white/72`}>{card.label}</p>
                    <h2 className="mt-2.5 text-2xl font-extrabold tracking-[-.02em] text-white">{card.value}</h2>
                    <p className="mt-2.5 text-[15px] leading-[1.65] text-white/78">{card.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        ) : null}
        <div className="h-1 bg-[#b88a5a]" />
      </section>

      <div className="mx-auto flex max-w-[1280px] flex-wrap items-start gap-x-18 gap-y-10 px-6 py-20 sm:px-10 lg:px-14 lg:py-24">
        <nav aria-label="On this page" className="flex-[1_1_240px]">
          <p className={`${monoLabelClass} text-[#5f6f78]`}>On this page</p>
          <ul className="mt-3">
            {page.sections.map((section) => (
              <li key={section.title}>
                <a
                  href={`#${sectionAnchor(section.title)}`}
                  className="flex min-h-11 items-center border-l-2 border-[#d9e2e0] py-2 pl-4 text-[15px] font-semibold leading-snug text-[#001112]/78 transition hover:border-[#b88a5a] hover:text-[#001112]"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0 flex-[999_1_560px]">
          {page.sections.map((section, index) => (
            <article
              key={section.title}
              id={sectionAnchor(section.title)}
              className={`scroll-mt-8 ${index === 0 ? 'pb-12' : 'border-t border-[#001112] py-12'} last:pb-0`}
            >
              <h2 className="text-[clamp(24px,6vw,28px)] font-extrabold leading-[1.15] tracking-[-.02em] sm:text-[30px]">{section.title}</h2>
              <p className="mt-4 max-w-[40em] text-lg leading-[1.7] text-[#001112]/78">{section.body}</p>
              {section.items ? (
                <ul className="mt-6 grid border-t border-[#d9e2e0] sm:grid-cols-2 sm:gap-x-8">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-3 border-b border-[#d9e2e0] py-4 font-semibold leading-normal">
                      <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-[2px] bg-[#b88a5a]" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </div>

      <section aria-labelledby="checklist-heading" className="bg-[#001112] text-white">
        <div className="mx-auto max-w-[1280px] px-6 py-20 sm:px-10 lg:px-14 lg:py-24">
          <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
            <h2 id="checklist-heading" className="max-w-[16em] text-[clamp(30px,8vw,36px)] font-extrabold leading-[1.08] tracking-[-.025em] text-balance sm:text-[clamp(32px,3.4vw,48px)]">
              {page.checklistTitle}
            </h2>
            <a href={quoteHref} className="inline-flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-full bg-[#b88a5a] px-7 font-extrabold text-[#001112] transition hover:bg-[#a5794d] sm:w-auto">
              Send shipment details
              <ArrowIcon />
            </a>
          </div>
          <ol className="mt-10 grid border-t border-[#1f3436] md:grid-cols-2 md:gap-x-10 lg:grid-cols-3">
            {page.checklist.map((item, index) => (
              <li key={item} className="flex items-baseline gap-4 border-b border-[#1f3436] py-5 text-[17px] font-semibold">
                <span aria-hidden="true" className="w-7 shrink-0 font-mono text-[13px] text-[#e7c99a]">{String(index + 1).padStart(2, '0')}</span>
                {item}
              </li>
            ))}
          </ol>
        </div>
        <div className="h-1 bg-[#b88a5a]" />
      </section>

      <section aria-labelledby="service-faq-heading" className="mx-auto max-w-[1280px] px-6 py-20 sm:px-10 lg:px-14 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
          <div>
            <p className={`${monoLabelClass} text-[#5f6f78]`}>FAQ</p>
            <h2 id="service-faq-heading" className="mt-4 text-[clamp(30px,8vw,36px)] font-extrabold leading-[1.1] tracking-[-.025em] text-balance sm:text-[clamp(32px,3.2vw,44px)]">
              Practical answers before you ship.
            </h2>
          </div>
          <div className="border-t border-[#001112]">
            {page.faqs.map((faq) => (
              <details key={faq.question} className="group border-b border-[#d9e2e0] py-1">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 py-3 text-[19px] font-bold tracking-[-.01em] text-[#001112] marker:hidden">
                  <span>{faq.question}</span>
                  <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#001112]/25 text-lg transition-transform duration-200 group-open:rotate-45">+</span>
                </summary>
                <p className="mb-6 max-w-[40em] leading-[1.7] text-[#001112]/78">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter footer={homeContent.en.footer} />
    </main>
  );
}
