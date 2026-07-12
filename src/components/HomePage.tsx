import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { Locale } from '@/lib/i18n';
import { getLocalizedPath } from '@/lib/i18n';
import type { homeContent } from '@/lib/content';
import { faqJsonLd, homeFaqs, organizationJsonLd } from '@/lib/seo';
import { getHeroUnsplashImages } from '@/lib/unsplash';
import { ContactActions } from './ContactActions';
import { HtmlLangSync } from './HtmlLangSync';

type HomeCopy = (typeof homeContent)[Locale];

type Props = {
  locale: Locale;
  copy: HomeCopy;
};

const heroBackgroundSlides = getHeroUnsplashImages();

function BrandLogo({ priority = false }: { priority?: boolean }) {
  return (
    <Image
      src="/assets/ksways-logo-reverse.png"
      alt="KS WAYS"
      width={935}
      height={337}
      priority={priority}
      className="h-8 w-auto object-contain drop-shadow-[0_0_18px_rgba(33,212,194,.18)] transition-transform group-hover:scale-[1.03] sm:h-9"
    />
  );
}

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

function FooterLink({ href, label }: { href: string; label: string }) {
  const isExternal = href.startsWith('http');
  const isInternalRoute = href.startsWith('/');
  const className = 'inline-flex min-h-11 items-center text-sm font-bold text-white/62 transition hover:text-[#6fffe7]';

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {label}
      </a>
    );
  }

  if (isInternalRoute) {
    return (
      <Link href={href} className={className}>
        {label}
      </Link>
    );
  }

  return (
    <a href={href} className={className}>
      {label}
    </a>
  );
}

function HeroBackgroundSlideshow() {
  return (
    <>
      <div className="absolute inset-0 -z-30" aria-label="Rotating full hero background images for ocean freight and air cargo logistics">
        {heroBackgroundSlides.map((slide, index) => (
          <Image
            key={slide.id}
            src={slide.src}
            alt={slide.alt}
            fill
            priority={index === 0}
            sizes="100vw"
            className="ks-hero-bg-slide object-cover"
            style={{ '--ks-slide-index': index } as CSSProperties}
          />
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,17,18,.95)_0%,rgba(0,17,18,.82)_36%,rgba(0,17,18,.18)_62%,rgba(0,17,18,.16)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_46%,rgba(0,17,18,.08),rgba(0,17,18,.30)_56%,rgba(0,17,18,.44)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(33,212,194,.18),transparent_26%),linear-gradient(90deg,transparent_0,transparent_48%,rgba(255,255,255,.13)_49%,transparent_50%)] bg-[length:auto,72px_72px] opacity-70" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#001112] to-transparent" />
      </div>
      <div className="pointer-events-auto absolute bottom-7 right-6 z-20 hidden max-w-[280px] text-right text-[11px] font-semibold text-white/52 sm:block lg:right-8">
        {heroBackgroundSlides.map((slide, index) => (
          <p key={`${slide.id}-credit`} className="ks-hero-bg-attribution" style={{ '--ks-slide-index': index } as CSSProperties}>
            Photo:{' '}
            <a href={slide.photographerUrl} target="_blank" rel="noopener noreferrer" className="underline-offset-4 transition hover:text-white hover:underline">
              {slide.photographer}
            </a>{' '}
            /{' '}
            <a href={slide.unsplashUrl} target="_blank" rel="noopener noreferrer" className="underline-offset-4 transition hover:text-white hover:underline">
              Unsplash
            </a>
          </p>
        ))}
      </div>
    </>
  );
}

export function HomePage({ locale, copy }: Props) {
  const alternateLocale: Locale = locale === 'en' ? 'kr' : 'en';
  const toggleHref = getLocalizedPath(locale === 'en' ? '/' : '/kr', alternateLocale);
  const quoteHref = '/quote';
  const networkHref = '/network/korea-agent-network';
  const scheduleUrl = process.env.NEXT_PUBLIC_KSWAYS_CALENDLY_URL?.trim();
  const phoneHref = `tel:${copy.footer.phone.replace(/[^+\d]/g, '')}`;
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
        <HeroBackgroundSlideshow />
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_78%_18%,rgba(33,212,194,.18),transparent_26%),radial-gradient(circle_at_18%_74%,rgba(45,140,255,.14),transparent_34%)]" />

        <header className="relative z-10 mx-auto flex h-[78px] w-full max-w-[1280px] items-center justify-between px-6 sm:px-10 lg:px-8">
          <Link href={locale === 'en' ? '/' : '/kr'} className="group flex min-h-11 items-center" aria-label="KS WAYS home">
            <BrandLogo priority />
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

        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-78px)] w-full max-w-[1280px] items-end px-6 pb-14 pt-8 sm:px-10 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-5 max-w-2xl text-[clamp(14px,1.2vw,17px)] tracking-[-.01em] text-white/74">{copy.hero.eyebrow}</p>
            <h1 className="max-w-5xl text-[clamp(44px,12.8vw,56px)] font-black leading-[1.04] tracking-[-.062em] text-balance sm:text-[clamp(52px,7.8vw,116px)] sm:leading-[.9] sm:tracking-[-.075em]">
              <HighlightedHeadline headline={copy.hero.headline} />
            </h1>
            <p className="mt-7 max-w-2xl text-[clamp(17px,1.3vw,21px)] leading-relaxed tracking-[-.018em] text-white/70">{copy.hero.lead}</p>
            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <a href={quoteHref} className="inline-flex min-h-[52px] w-full justify-center items-center rounded-full bg-gradient-to-br from-[#21d4c2] to-[#6fffe7] px-7 font-black text-[#001112] shadow-[0_16px_46px_rgba(33,212,194,.24)] transition hover:scale-[1.02] sm:w-auto">{copy.hero.primaryCta}</a>
              <a href="#network" className="inline-flex min-h-[52px] w-full justify-center items-center rounded-full border border-white/45 px-7 font-black text-white transition hover:border-white sm:w-auto">{copy.hero.secondaryCta}</a>
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
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-[#21d4c2] via-[#6fffe7] to-[#2d8cff]" />
      </section>

      <section id="company" className="px-6 py-20 sm:px-10 lg:px-8">
        <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[.92fr_1.08fr] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[.14em] text-[#7d888a]">{copy.company.kicker}</p>
            <h2 className="mt-4 max-w-4xl text-[clamp(34px,10vw,42px)] font-black leading-[1.04] tracking-[-.055em] text-[#001112] sm:text-[clamp(38px,5vw,74px)] sm:leading-[.96] sm:tracking-[-.07em]">{copy.company.headline}</h2>
          </div>
          <p className="max-w-3xl text-lg leading-relaxed text-[#001112]/62 lg:pb-2">{copy.company.body}</p>
        </div>
        <div className="mx-auto mt-10 grid max-w-[1280px] gap-4 md:grid-cols-3">
          {copy.company.pillars.map((pillar) => (
            <article key={pillar.title} className="rounded-[28px] border border-[#001112]/10 bg-white p-7 shadow-[0_18px_70px_rgba(0,17,18,.06)]">
              <div className="mb-8 h-1.5 w-14 rounded-full bg-gradient-to-r from-[#21d4c2] to-[#2d8cff]" />
              <h3 className="text-2xl font-black tracking-[-.04em]">{pillar.title}</h3>
              <p className="mt-3 leading-relaxed text-[#001112]/58">{pillar.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="services" className="px-6 pb-20 sm:px-10 lg:px-8">
        <div className="mx-auto max-w-[1280px] rounded-[36px] border border-[#001112]/10 bg-white p-7 shadow-[0_24px_90px_rgba(0,17,18,.06)] sm:p-10 lg:p-12">
          <p className="text-sm font-black uppercase tracking-[.14em] text-[#7d888a]">{copy.operating.kicker}</p>
          <h2 className="mt-4 max-w-4xl text-[clamp(34px,10vw,42px)] font-black leading-[1.04] tracking-[-.055em] text-[#001112] sm:text-[clamp(40px,5.2vw,76px)] sm:leading-[.96] sm:tracking-[-.07em]">{copy.operating.headline}</h2>
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

              if (!service.href) {
                return (
                  <article key={service.title} className={cardClassName}>
                    {cardContent}
                  </article>
                );
              }

              return service.href.startsWith('http') ? (
                <a key={service.title} href={service.href} target="_blank" rel="noopener noreferrer" className={cardClassName} aria-label={`${service.title} opens in a new tab`}>
                  {cardContent}
                </a>
              ) : (
                <Link key={service.title} href={service.href} className={cardClassName}>
                  {cardContent}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section id="network" className="bg-[#001112] px-6 py-20 text-white sm:px-10 lg:px-8">
        <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[.88fr_1.12fr]">
          <div>
          <p className="text-sm font-black uppercase tracking-[.14em] text-[#6fffe7]">{copy.network.kicker}</p>
          <h2 className="mt-4 text-[clamp(34px,10vw,42px)] font-black leading-[1.04] tracking-[-.052em] sm:text-[clamp(38px,5vw,70px)] sm:leading-[.96] sm:tracking-[-.065em]">{copy.network.headline}</h2>
          </div>
          <div>
          <p className="text-lg leading-relaxed text-white/68">{copy.network.body}</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {copy.network.points.map((point) => (
              <li key={point} className="rounded-2xl border border-white/12 bg-white/[.045] p-5 font-bold text-white/86 shadow-[inset_0_1px_0_rgba(255,255,255,.04)]">{point}</li>
            ))}
          </ul>
          <Link href={networkHref} className="mt-8 inline-flex min-h-[52px] items-center rounded-full border border-[#6fffe7]/65 px-7 font-black text-[#6fffe7] transition hover:border-[#6fffe7] hover:bg-[#6fffe7]/10">
            {locale === 'kr' ? '파트너 네트워크 자세히 보기' : 'Explore Korea agent network'}
          </Link>
          </div>
        </div>
      </section>

      <section id="solutions" className="px-6 py-20 sm:px-10 lg:px-8">
        <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[.86fr_1.14fr] lg:items-start">
          <div className="lg:sticky lg:top-10">
            <p className="text-sm font-black uppercase tracking-[.14em] text-[#7d888a]">{copy.solutions.kicker}</p>
            <h2 className="mt-4 text-[clamp(34px,10vw,42px)] font-black leading-[1.04] tracking-[-.055em] sm:text-[clamp(38px,5vw,72px)] sm:leading-[.96] sm:tracking-[-.07em]">{copy.solutions.headline}</h2>
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

      <section id="faq" className="px-6 pb-20 sm:px-10 lg:px-8">
        <div className="mx-auto grid max-w-[1280px] gap-10 rounded-[36px] border border-[#001112]/10 bg-white p-7 shadow-[0_24px_90px_rgba(0,17,18,.06)] sm:p-10 lg:grid-cols-[.78fr_1.22fr] lg:p-12">
          <div>
            <p className="text-sm font-black uppercase tracking-[.14em] text-[#7d888a]">FAQ</p>
            <h2 className="mt-4 text-[clamp(32px,9vw,40px)] font-black leading-[1.04] tracking-[-.052em] sm:text-[clamp(34px,4.6vw,66px)] sm:leading-[.96] sm:tracking-[-.065em]">
              {locale === 'kr' ? '자주 묻는 물류 문의' : 'Freight questions, answered clearly.'}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-[#001112]/60">
              {locale === 'kr'
                ? '견적과 파트너십 문의 전에 필요한 핵심 정보를 짧고 명확하게 정리했습니다.'
                : 'Clear answers for ocean freight, air freight, and WCA partner enquiries.'}
            </p>
          </div>
          <div className="grid gap-3">
            {faqs.map((faq) => (
              <details key={faq.question} className="group rounded-3xl border border-[#001112]/10 bg-[#f4f7f6] p-6 open:bg-white">
                <summary className="flex min-h-11 cursor-pointer list-none items-start justify-between gap-5 text-lg font-black tracking-[-.03em] text-[#001112] marker:hidden">
                  <span>{faq.question}</span>
                  <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#001112] text-white transition-transform duration-200 group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 leading-relaxed text-[#001112]/62">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="px-6 pb-20 sm:px-10 lg:px-8">
        <div className="mx-auto max-w-[1280px] overflow-hidden rounded-[34px] bg-[#001112] p-8 text-white shadow-[0_30px_100px_rgba(0,17,18,.16)] sm:p-12 lg:flex lg:items-end lg:justify-between">
          <div>
            <h2 className="max-w-3xl text-[clamp(34px,10vw,42px)] font-black leading-[1.04] tracking-[-.055em] sm:text-[clamp(40px,5vw,76px)] sm:leading-[.96] sm:tracking-[-.07em]">{copy.contact.headline}</h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/68">{copy.contact.body}</p>
            <div className="mt-5 flex flex-col gap-2 text-sm font-bold text-white/72 sm:flex-row sm:items-center sm:gap-5">
              <a href={`mailto:${copy.contact.email}`} className="inline-flex min-h-11 items-center transition hover:text-[#6fffe7]">{copy.contact.email}</a>
              <a href={phoneHref} className="inline-flex min-h-11 items-center transition hover:text-[#6fffe7]">{copy.contact.phone}</a>
              <span className="inline-flex min-h-11 items-center">{copy.contact.fax}</span>
            </div>
          </div>
          <ContactActions
            quoteLabel={copy.contact.quote}
            partnerLabel={copy.contact.partner}
            scheduleLabel={copy.contact.schedule}
            email={copy.contact.email}
            locale={locale}
            scheduleUrl={scheduleUrl}
          />
        </div>
      </section>

      <footer aria-label="KS WAYS global logistics footer" className="relative overflow-hidden bg-[#001112] px-6 pb-8 pt-16 text-white sm:px-10 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_12%,rgba(33,212,194,.18),transparent_28%),radial-gradient(circle_at_84%_18%,rgba(45,140,255,.12),transparent_28%)]" />
        <div className="relative mx-auto max-w-[1280px]">
          <div className="grid gap-10 border-b border-white/10 pb-12 lg:grid-cols-[1.1fr_.9fr] lg:items-start">
            <div>
              <Link href={locale === 'en' ? '/' : '/kr'} className="group inline-flex min-h-11 items-center" aria-label="KS WAYS home">
                <BrandLogo />
              </Link>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/66">{copy.footer.tagline}</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {copy.footer.credentials.map((item) => (
                  <div key={item.label} className="rounded-3xl border border-white/12 bg-white/[.045] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,.05)]">
                    <p className="font-mono text-[10px] font-black uppercase tracking-[.16em] text-[#6fffe7]">{item.label}</p>
                    <p className="mt-3 text-sm font-bold leading-relaxed text-white/72">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <nav aria-label="Footer navigation" className="grid gap-8 sm:grid-cols-3">
              {copy.footer.columns.map((column) => (
                <div key={column.title}>
                  <h2 className="font-mono text-[11px] font-black uppercase tracking-[.18em] text-white/42">{column.title}</h2>
                  <ul className="mt-4 space-y-1">
                    {column.links.map((link) => (
                      <li key={link.href + link.label}>
                        <FooterLink href={link.href} label={link.label} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>

          <div className="grid gap-6 pb-32 pt-8 text-sm text-white/48 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:justify-between lg:pb-28">
            <div className="max-w-2xl">
              <p className="font-black text-white/72">{copy.footer.companyName}</p>
              <p className="mt-1">{copy.footer.legal}</p>
              <p className="mt-2 max-w-xl leading-relaxed text-white/56">{copy.footer.address}</p>
            </div>
            <div className="flex max-w-xl flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-1 lg:justify-end lg:text-right">
              <a href={`mailto:${copy.footer.email}`} className="inline-flex min-h-11 items-center font-bold text-white/64 transition hover:text-[#6fffe7] lg:justify-end">{copy.footer.email}</a>
              <a href={phoneHref} className="inline-flex min-h-11 items-center font-bold text-white/64 transition hover:text-[#6fffe7] lg:justify-end">{copy.footer.phone}</a>
              <span className="inline-flex min-h-11 items-center font-bold text-white/64 lg:justify-end">{copy.footer.fax}</span>
              <span className="basis-full text-white/42">© {new Date().getFullYear()} KS WAYS. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
