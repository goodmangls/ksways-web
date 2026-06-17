import Image from 'next/image';
import Link from 'next/link';
import type { ServicePage } from '@/lib/service-pages';
import { contactEmail, faqJsonLd, serviceJsonLd, siteUrl } from '@/lib/seo';

export function ServiceLandingPage({ page, basePath }: { page: ServicePage; basePath: 'services' | 'network' }) {
  const quoteHref = `mailto:${contactEmail}?subject=${encodeURIComponent(`KSWAYS enquiry — ${page.title}`)}`;
  const pageUrl = `${siteUrl}/${basePath}/${page.slug}`;

  return (
    <main className="min-h-screen bg-[#f4f7f6] text-[#001112] selection:bg-[#21d4c2] selection:text-[#001112]">
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

      <section className="relative overflow-hidden bg-[#001112] px-6 py-8 text-white sm:px-10 lg:px-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_10%,rgba(33,212,194,.26),transparent_30%),linear-gradient(120deg,rgba(0,17,18,.98),rgba(2,31,34,.88))]" />
        <div className="relative z-10">
          <header className="flex items-center justify-between gap-6">
            <Link href="/" className="group flex items-center" aria-label="KSWAYS home">
              <Image
                src="/assets/ksways-logo-reverse.png"
                alt="KSWAYS"
                width={935}
                height={337}
                priority
                className="h-8 w-auto object-contain drop-shadow-[0_0_18px_rgba(33,212,194,.18)] transition-transform group-hover:scale-[1.03] sm:h-9"
              />
            </Link>
            <a href={quoteHref} className="inline-flex min-h-11 items-center rounded-full bg-gradient-to-br from-[#21d4c2] to-[#6fffe7] px-5 text-sm font-black text-[#001112]">
              Get a quote
            </a>
          </header>

          <div className="max-w-5xl py-20 lg:py-28">
            <p className="text-sm font-black uppercase tracking-[.16em] text-[#6fffe7]">{page.eyebrow}</p>
            <h1 className="mt-5 text-[clamp(46px,7vw,104px)] font-black leading-[.92] tracking-[-.075em] text-balance">{page.title}</h1>
            <p className="mt-7 max-w-3xl text-[clamp(17px,1.35vw,22px)] leading-relaxed text-white/70">{page.lead}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href={quoteHref} className="inline-flex min-h-[52px] items-center rounded-full bg-gradient-to-br from-[#21d4c2] to-[#6fffe7] px-7 font-black text-[#001112]">
                Send shipment details
              </a>
              <Link href="/#services" className="inline-flex min-h-[52px] items-center rounded-full border border-white/40 px-7 font-black text-white">
                Back to services
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 px-6 py-16 sm:px-10 lg:grid-cols-2 lg:px-14">
        {page.sections.map((section) => (
          <article key={section.title} className="rounded-[32px] border border-[#001112]/10 bg-white p-7 shadow-[0_18px_70px_rgba(0,17,18,.055)] sm:p-9">
            <h2 className="text-3xl font-black tracking-[-.05em]">{section.title}</h2>
            <p className="mt-4 leading-relaxed text-[#001112]/62">{section.body}</p>
            {section.items ? (
              <ul className="mt-6 grid gap-3">
                {section.items.map((item) => (
                  <li key={item} className="rounded-2xl bg-[#f4f7f6] px-5 py-4 font-bold text-[#001112]/78">{item}</li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </section>

      <section className="px-6 pb-16 sm:px-10 lg:px-14">
        <div className="rounded-[34px] bg-[#001112] p-8 text-white sm:p-10 lg:p-12">
          <h2 className="text-[clamp(34px,4.8vw,70px)] font-black leading-[.96] tracking-[-.07em]">{page.checklistTitle}</h2>
          <ul className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {page.checklist.map((item) => (
              <li key={item} className="rounded-2xl border border-white/12 bg-white/[.06] p-5 font-bold text-white/86">{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-6 pb-20 sm:px-10 lg:px-14">
        <div className="grid gap-10 rounded-[36px] border border-[#001112]/10 bg-white p-7 shadow-[0_24px_90px_rgba(0,17,18,.06)] sm:p-10 lg:grid-cols-[.72fr_1.28fr] lg:p-12">
          <div>
            <p className="text-sm font-black uppercase tracking-[.14em] text-[#7d888a]">FAQ</p>
            <h2 className="mt-4 text-[clamp(34px,4.6vw,66px)] font-black leading-[.96] tracking-[-.065em]">Practical answers before you ship.</h2>
          </div>
          <div className="grid gap-3">
            {page.faqs.map((faq) => (
              <details key={faq.question} className="rounded-3xl border border-[#001112]/10 bg-[#f4f7f6] p-6 open:bg-white">
                <summary className="cursor-pointer list-none text-lg font-black tracking-[-.03em] text-[#001112] marker:hidden">{faq.question}</summary>
                <p className="mt-4 leading-relaxed text-[#001112]/62">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
