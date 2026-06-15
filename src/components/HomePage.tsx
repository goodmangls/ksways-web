import Link from 'next/link';
import type { Locale } from '@/lib/i18n';
import { getLocalizedPath } from '@/lib/i18n';
import type { homeContent } from '@/lib/content';
import { faqJsonLd, homeFaqs, organizationJsonLd } from '@/lib/seo';
import { ContactActions } from './ContactActions';
import { HtmlLangSync } from './HtmlLangSync';

type HomeCopy = (typeof homeContent)[Locale];

type Props = {
  locale: Locale;
  copy: HomeCopy;
};

const flowNodes = ['AIR', 'OCEAN', 'EXPRESS', 'PARTNER'];

function HighlightedHeadline({ headline }: { headline: string }) {
  const english = headline.split(' global ');
  if (english.length === 2) {
    return (
      <>
        {english[0]} <span className="text-[#6fffe7] drop-shadow-[0_0_32px_rgba(33,212,194,.22)]">global</span> {english[1]}
      </>
    );
  }

  const korean = headline.split('글로벌');
  if (korean.length === 2) {
    return (
      <>
        {korean[0]}<span className="text-[#6fffe7] drop-shadow-[0_0_32px_rgba(33,212,194,.22)]">글로벌</span>{korean[1]}
      </>
    );
  }

  return headline;
}

export function HomePage({ locale, copy }: Props) {
  const alternateLocale: Locale = locale === 'en' ? 'kr' : 'en';
  const toggleHref = getLocalizedPath(locale === 'en' ? '/' : '/kr', alternateLocale);
  const quoteSubject = locale === 'kr' ? 'KSWAYS 견적 문의' : 'KSWAYS freight quote request';
  const quoteHref = `mailto:${copy.contact.email}?subject=${encodeURIComponent(quoteSubject)}`;
  const faqs = homeFaqs[locale];

  return (
    <main className="min-h-screen bg-[#f4f7f6] text-[#001112] selection:bg-[#21d4c2] selection:text-[#001112]">
      <HtmlLangSync locale={locale} />
      <script
        id={`organization-jsonld-${locale}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd(locale)) }}
      />
      <script
        id={`faq-jsonld-${locale}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }}
      />
      <section className="relative isolate min-h-screen overflow-hidden bg-[#001112] text-white">
        <div className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_78%_18%,rgba(33,212,194,.30),transparent_28%),radial-gradient(circle_at_18%_74%,rgba(45,140,255,.16),transparent_34%),linear-gradient(120deg,rgba(0,17,18,.98)_0%,rgba(0,17,18,.92)_46%,rgba(2,31,34,.82)_100%)]" />
        <div className="absolute -right-[18%] -top-[18%] -z-20 h-[86%] w-[72%] rotate-[-16deg] rounded-[58px] border border-white/10 bg-[linear-gradient(90deg,rgba(33,212,194,.28)_0_3px,transparent_3px_80px),linear-gradient(90deg,rgba(255,255,255,.08)_0_1px,transparent_1px_40px),linear-gradient(135deg,rgba(33,212,194,.16),rgba(45,140,255,.08),rgba(255,255,255,.03))] shadow-[0_40px_140px_rgba(0,0,0,.38)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(115deg,transparent_0_38%,rgba(33,212,194,.38)_38.1%_38.25%,transparent_38.35%_100%),linear-gradient(152deg,transparent_0_62%,rgba(111,255,231,.24)_62.1%_62.22%,transparent_62.35%_100%)]" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-[#001112] to-transparent" />

        <header className="relative z-10 flex h-[78px] items-center justify-between px-6 sm:px-10 lg:px-14">
          <Link href={locale === 'en' ? '/' : '/kr'} className="group flex items-center gap-2 text-xl font-black italic tracking-[-.04em]" aria-label="KSWAYS home">
            <span className="h-4 w-4 rotate-45 rounded-[3px] border-2 border-b-transparent border-l-transparent border-[#21d4c2] shadow-[0_0_18px_rgba(33,212,194,.7)] transition-transform group-hover:scale-110" />
            KSWAYS
          </Link>
          <nav aria-label="Primary navigation" className="hidden items-center gap-8 text-sm font-bold text-white/72 lg:flex">
            <a href="#company" className="transition hover:text-white">{copy.nav.company}</a>
            <a href="#services" className="transition hover:text-white">{copy.nav.services}</a>
            <a href="#network" className="transition hover:text-white">{copy.nav.network}</a>
            <a href="#solutions" className="transition hover:text-white">{copy.nav.solutions}</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href={toggleHref} className="grid h-11 min-w-11 place-items-center rounded-full border border-white/30 px-4 text-sm font-black text-white transition hover:border-white/70" aria-label="Toggle language">
              {copy.nav.langToggle}
            </Link>
            <a href="#contact" className="hidden min-h-11 items-center rounded-full border border-white/45 px-5 text-sm font-extrabold text-white transition hover:border-white sm:inline-flex">{copy.nav.contact}</a>
            <a href={quoteHref} className="inline-flex min-h-11 items-center rounded-full bg-gradient-to-br from-[#21d4c2] to-[#6fffe7] px-5 text-sm font-black text-[#001112] shadow-[0_15px_40px_rgba(33,212,194,.22)] transition hover:scale-[1.02]">{copy.nav.quote}</a>
          </div>
        </header>

        <div className="relative z-10 grid min-h-[calc(100vh-78px)] items-end gap-10 px-6 pb-14 pt-8 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(340px,.56fr)] lg:px-14">
          <div>
            <p className="mb-5 max-w-2xl text-[clamp(14px,1.2vw,17px)] tracking-[-.01em] text-white/74">{copy.hero.eyebrow}</p>
            <h1 className="max-w-5xl text-[clamp(52px,7.8vw,116px)] font-black leading-[.9] tracking-[-.075em] text-balance">
              <HighlightedHeadline headline={copy.hero.headline} />
            </h1>
            <p className="mt-7 max-w-2xl text-[clamp(17px,1.3vw,21px)] leading-relaxed tracking-[-.018em] text-white/70">{copy.hero.lead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={quoteHref} className="inline-flex min-h-[52px] items-center rounded-full bg-gradient-to-br from-[#21d4c2] to-[#6fffe7] px-7 font-black text-[#001112] shadow-[0_16px_46px_rgba(33,212,194,.24)] transition hover:scale-[1.02]">{copy.hero.primaryCta}</a>
              <a href="#network" className="inline-flex min-h-[52px] items-center rounded-full border border-white/45 px-7 font-black text-white transition hover:border-white">{copy.hero.secondaryCta}</a>
            </div>
            <dl className="mt-10 grid max-w-3xl overflow-hidden rounded-[28px] border border-white/10 bg-[#001112]/56 shadow-[0_30px_90px_rgba(0,0,0,.24)] backdrop-blur-xl sm:grid-cols-3" aria-label="Key proof points">
              {copy.hero.proof.map((item) => (
                <div key={item.label} className="border-b border-white/10 p-5 sm:border-b-0 sm:border-r last:border-0">
                  <dt className="font-mono text-[10px] uppercase tracking-[.14em] text-white/46">{item.label}</dt>
                  <dd className="mt-2 text-xl font-black tracking-[-.04em] text-white sm:text-[23px]">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <aside className="mb-8 hidden max-w-[392px] justify-self-end rounded-[34px] border border-white/18 bg-white/[.09] p-6 shadow-[0_30px_90px_rgba(0,0,0,.42)] backdrop-blur-2xl lg:block" aria-label="KSWAYS logistics control tower card">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[.18em] text-white/45">Control tower</p>
                <h2 className="mt-2 text-2xl font-black tracking-[-.04em]">{copy.hero.controlTitle}</h2>
              </div>
              <span className="rounded-full bg-[#6fffe7] px-3 py-1 text-[10px] font-black text-[#001112]">LIVE</span>
            </div>
            <div className="relative min-h-[226px] overflow-hidden rounded-3xl border border-white/14 bg-[radial-gradient(circle_at_50%_50%,rgba(33,212,194,.24),transparent_28%),linear-gradient(135deg,rgba(255,255,255,.08),rgba(0,17,18,.24))]">
              <div className="absolute left-7 right-7 top-1/2 h-px bg-white/15" />
              <div className="absolute bottom-7 left-1/2 top-7 w-px bg-white/15" />
              {flowNodes.map((label, index) => (
                <div key={label} className={`absolute grid h-12 w-24 place-items-center rounded-2xl border border-white/10 bg-[#001112]/82 ${index === 0 ? 'left-5 top-6' : ''}${index === 1 ? 'right-5 top-6' : ''}${index === 2 ? 'bottom-6 left-5' : ''}${index === 3 ? 'bottom-6 right-5' : ''}`}>
                  <span className="font-mono text-[9px] uppercase tracking-[.12em] text-white/52">{label}</span>
                  <span className="h-1 w-12 rounded-full bg-gradient-to-r from-[#21d4c2] to-[#2d8cff]" />
                </div>
              ))}
              <div className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[#21d4c2]/45 bg-[#001112] text-center font-mono text-[9px] uppercase tracking-[.14em] shadow-[0_0_40px_rgba(33,212,194,.22)]">
                {copy.hero.controlCenter}
              </div>
            </div>
          </aside>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-[#21d4c2] via-[#6fffe7] to-[#2d8cff]" />
      </section>

      <section id="company" className="px-6 py-20 sm:px-10 lg:px-14">
        <div className="grid gap-10 lg:grid-cols-[.92fr_1.08fr] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[.14em] text-[#7d888a]">{copy.company.kicker}</p>
            <h2 className="mt-4 max-w-4xl text-[clamp(38px,5vw,74px)] font-black leading-[.96] tracking-[-.07em] text-[#001112]">{copy.company.headline}</h2>
          </div>
          <p className="max-w-3xl text-lg leading-relaxed text-[#001112]/62 lg:pb-2">{copy.company.body}</p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {copy.company.pillars.map((pillar) => (
            <article key={pillar.title} className="rounded-[28px] border border-[#001112]/10 bg-white p-7 shadow-[0_18px_70px_rgba(0,17,18,.06)]">
              <div className="mb-8 h-1.5 w-14 rounded-full bg-gradient-to-r from-[#21d4c2] to-[#2d8cff]" />
              <h3 className="text-2xl font-black tracking-[-.04em]">{pillar.title}</h3>
              <p className="mt-3 leading-relaxed text-[#001112]/58">{pillar.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="services" className="px-6 pb-20 sm:px-10 lg:px-14">
        <div className="rounded-[36px] border border-[#001112]/10 bg-white p-7 shadow-[0_24px_90px_rgba(0,17,18,.06)] sm:p-10 lg:p-12">
          <p className="text-sm font-black uppercase tracking-[.14em] text-[#7d888a]">{copy.operating.kicker}</p>
          <h2 className="mt-4 max-w-4xl text-[clamp(40px,5.2vw,76px)] font-black leading-[.96] tracking-[-.07em] text-[#001112]">{copy.operating.headline}</h2>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[#001112]/60">{copy.operating.body}</p>
          <div className="mt-10 grid overflow-hidden rounded-[28px] border border-[#001112]/12 md:grid-cols-2 lg:grid-cols-5">
            {copy.operating.services.map((service) => {
              const cardClassName = 'min-h-40 border-b border-[#001112]/10 p-7 transition hover:bg-[#f4f7f6] md:border-r lg:border-b-0 last:border-0';
              const cardContent = (
                <>
                  <h3 className="text-xl font-black tracking-[-.03em]">{service.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#001112]/56">{service.body}</p>
                  {service.href ? <p className="mt-5 text-xs font-black uppercase tracking-[.12em] text-[#007f74]">Visit service →</p> : null}
                </>
              );

              return service.href ? (
                <a key={service.title} href={service.href} target="_blank" rel="noopener noreferrer" className={cardClassName} aria-label={`${service.title} opens in a new tab`}>
                  {cardContent}
                </a>
              ) : (
                <article key={service.title} className={cardClassName}>
                  {cardContent}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="network" className="grid gap-10 bg-[#001112] px-6 py-20 text-white sm:px-10 lg:grid-cols-[.88fr_1.12fr] lg:px-14">
        <div>
          <p className="text-sm font-black uppercase tracking-[.14em] text-[#6fffe7]">{copy.network.kicker}</p>
          <h2 className="mt-4 text-[clamp(38px,5vw,70px)] font-black leading-[.96] tracking-[-.065em]">{copy.network.headline}</h2>
        </div>
        <div>
          <p className="text-lg leading-relaxed text-white/68">{copy.network.body}</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {copy.network.points.map((point) => (
              <li key={point} className="rounded-2xl border border-white/12 bg-white/[.045] p-5 font-bold text-white/86 shadow-[inset_0_1px_0_rgba(255,255,255,.04)]">{point}</li>
            ))}
          </ul>
        </div>
      </section>

      <section id="solutions" className="px-6 py-20 sm:px-10 lg:px-14">
        <div className="grid gap-10 lg:grid-cols-[.86fr_1.14fr] lg:items-start">
          <div className="lg:sticky lg:top-10">
            <p className="text-sm font-black uppercase tracking-[.14em] text-[#7d888a]">{copy.solutions.kicker}</p>
            <h2 className="mt-4 text-[clamp(38px,5vw,72px)] font-black leading-[.96] tracking-[-.07em]">{copy.solutions.headline}</h2>
            <p className="mt-5 text-lg leading-relaxed text-[#001112]/60">{copy.solutions.body}</p>
          </div>
          <div className="grid gap-4">
            {copy.solutions.steps.map((step) => (
              <article key={step.title} className="rounded-[30px] border border-[#001112]/10 bg-white p-7 shadow-[0_18px_70px_rgba(0,17,18,.055)]">
                <h3 className="text-2xl font-black tracking-[-.04em] text-[#001112]">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-[#001112]/60">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="px-6 pb-20 sm:px-10 lg:px-14">
        <div className="grid gap-10 rounded-[36px] border border-[#001112]/10 bg-white p-7 shadow-[0_24px_90px_rgba(0,17,18,.06)] sm:p-10 lg:grid-cols-[.78fr_1.22fr] lg:p-12">
          <div>
            <p className="text-sm font-black uppercase tracking-[.14em] text-[#7d888a]">FAQ</p>
            <h2 className="mt-4 text-[clamp(34px,4.6vw,66px)] font-black leading-[.96] tracking-[-.065em]">
              {locale === 'kr' ? '자주 묻는 물류 문의' : 'Freight questions, answered clearly.'}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-[#001112]/60">
              {locale === 'kr'
                ? '견적과 파트너십 문의 전에 필요한 핵심 정보를 짧고 명확하게 정리했습니다.'
                : 'Clear answers for quote, partnership, and Korea-connected logistics enquiries.'}
            </p>
          </div>
          <div className="grid gap-3">
            {faqs.map((faq) => (
              <details key={faq.question} className="group rounded-3xl border border-[#001112]/10 bg-[#f4f7f6] p-6 open:bg-white">
                <summary className="cursor-pointer list-none text-lg font-black tracking-[-.03em] text-[#001112] marker:hidden">
                  {faq.question}
                </summary>
                <p className="mt-4 leading-relaxed text-[#001112]/62">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="px-6 pb-20 sm:px-10 lg:px-14">
        <div className="overflow-hidden rounded-[34px] bg-[#001112] p-8 text-white shadow-[0_30px_100px_rgba(0,17,18,.16)] sm:p-12 lg:flex lg:items-end lg:justify-between">
          <div>
            <h2 className="max-w-3xl text-[clamp(40px,5vw,76px)] font-black leading-[.96] tracking-[-.07em]">{copy.contact.headline}</h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/68">{copy.contact.body}</p>
          </div>
          <ContactActions quoteLabel={copy.contact.quote} partnerLabel={copy.contact.partner} chatLabel={copy.contact.chat} email={copy.contact.email} locale={locale} />
        </div>
      </section>
    </main>
  );
}
