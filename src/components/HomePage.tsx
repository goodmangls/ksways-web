import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { Locale } from '@/lib/i18n';
import { getLocalizedPath } from '@/lib/i18n';
import type { homeContent } from '@/lib/content';
import { faqJsonLd, homeFaqs, organizationJsonLd } from '@/lib/seo';
import { getHeroSlides } from '@/lib/hero-slides';
import { ContactActions } from './ContactActions';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';
import { BodyText, CardHeading, SectionHeading } from './Typography';
import { WcaBadge } from './WcaBadge';
import { WcaMemberTools } from './WcaMemberTools';
import { ArrowIcon } from './ArrowIcon';

type HomeCopy = (typeof homeContent)[Locale];

type Props = {
  locale: Locale;
  copy: HomeCopy;
};

const heroBackgroundSlides = getHeroSlides();

// 섹션 제목·본문의 가독성 기준(DESIGN.md "Readability")은 Typography 컴포넌트가 갖고 있다.
const monoLabelClass = 'font-mono text-[13px] font-semibold text-accent-ink';

function CheckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true" className="mt-0.5 shrink-0">
      <circle cx="11" cy="11" r="10" className="stroke-accent" strokeWidth="1.5" />
      <path d="M6.5 11.2l3 3 6-6.4" className="stroke-accent-soft" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HighlightedHeadline({ headline }: { headline: string }) {
  const english = headline.split(' global ');
  if (english.length === 2) {
    return (
      <>
        {english[0]} <span className="text-accent-soft">global</span> {english[1]}
      </>
    );
  }

  const korean = headline.split('글로벌');
  if (korean.length === 2) {
    return (
      <>
        {korean[0]}<span className="text-accent-soft">글로벌</span>{korean[1]}
      </>
    );
  }

  return headline;
}

/** 히어로 사진 패널. 전면 배경 대신 우측 패널로 옮겨 헤드라인이 사진 위에 얹히지 않게 했다. */
function HeroPhotoPanel({ caption }: { caption: string }) {
  return (
    <figure className="relative isolate m-0 aspect-[4/3] overflow-hidden rounded-[28px] border border-border-dark bg-navy-2 lg:aspect-[4/4.4]">
      <div className="absolute inset-0 -z-10" aria-label="Rotating hero images for ocean freight, air cargo, and express courier logistics">
        {heroBackgroundSlides.map((slide, index) => (
          <Image
            key={slide.id}
            src={slide.src}
            alt={slide.alt}
            fill
            priority={index === 0}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="ks-hero-bg-slide object-cover"
            style={{ '--ks-slide-index': index } as CSSProperties}
          />
        ))}
      </div>
      <figcaption className="absolute inset-x-3 bottom-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-[18px] border border-white/12 bg-navy/85 px-5 py-3.5 sm:inset-x-5 sm:bottom-5">
        <span className="text-sm font-bold text-white">{caption}</span>
        <span className="grid text-xs font-semibold text-white/72">
          {heroBackgroundSlides.map((slide, index) => (
            <span
              key={`${slide.id}-credit`}
              className="ks-hero-bg-attribution col-start-1 row-start-1"
              style={{ '--ks-slide-index': index } as CSSProperties}
            >
              Photo:{' '}
              {slide.creditUrl ? (
                <a href={slide.creditUrl} target="_blank" rel="noopener noreferrer" className="underline-offset-4 transition hover:text-white hover:underline">
                  {slide.credit}
                </a>
              ) : (
                slide.credit
              )}{' '}
              /{' '}
              <a href={slide.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline-offset-4 transition hover:text-white hover:underline">
                {slide.sourceLabel}
              </a>
            </span>
          ))}
        </span>
      </figcaption>
    </figure>
  );
}

export function HomePage({ locale, copy }: Props) {
  const alternateLocale: Locale = locale === 'en' ? 'kr' : 'en';
  const toggleHref = getLocalizedPath(locale === 'en' ? '/' : '/kr', alternateLocale);
  const quoteHref = '/quote';
  const networkHref = '/network/korea-agent-network';
  const scheduleUrl = process.env.NEXT_PUBLIC_KSWAYS_CALENDLY_URL?.trim();
  const contactPhoneHref = `tel:${copy.contact.phone.replace(/[^+\d]/g, '')}`;
  const faqs = homeFaqs[locale];

  return (
    <main className={`min-h-screen bg-paper text-navy ${locale === 'kr' ? 'break-keep' : ''}`}>
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
      <section aria-labelledby="hero-heading" className="relative isolate bg-navy text-white">
        <SiteHeader nav={copy.nav} homeHref={locale === 'en' ? '/' : '/kr'} toggleHref={toggleHref} quoteHref={quoteHref} isHome />

        <div id="content" className="relative z-10 mx-auto grid w-full max-w-[1280px] items-center gap-12 px-6 pb-16 pt-10 sm:px-10 lg:min-h-[640px] lg:grid-cols-[1.05fr_.95fr] lg:gap-14 lg:px-14 lg:pb-20 lg:pt-14">
          <div>
            <p className="font-mono text-[13px] font-semibold uppercase tracking-[.12em] text-accent-soft">{copy.hero.eyebrow}</p>
            <h1 id="hero-heading" className="ks-type-hero mt-6 text-[clamp(40px,11vw,52px)] font-black leading-[1.04] tracking-[-.028em] text-balance sm:text-[clamp(52px,6.2vw,88px)] sm:leading-[1] sm:tracking-[-.03em]">
              <HighlightedHeadline headline={copy.hero.headline} />
            </h1>
            <p className="ks-type-body-lg ks-measure mt-7 max-w-[34em] text-lg leading-[1.65] text-white/76 text-pretty">{copy.hero.lead}</p>
            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <a href={quoteHref} className="inline-flex min-h-[52px] w-full justify-center items-center gap-2.5 rounded-full bg-accent px-7 font-extrabold text-navy transition hover:bg-accent-strong sm:w-auto">
                {copy.hero.primaryCta}
                <ArrowIcon />
              </a>
              <a href="#network" className="inline-flex min-h-[52px] w-full justify-center items-center rounded-full border border-white/45 px-7 font-bold text-white transition hover:border-white hover:bg-white/[.06] sm:w-auto">{copy.hero.secondaryCta}</a>
            </div>
          </div>
          <HeroPhotoPanel caption={copy.hero.controlTitle} />
        </div>

        <div className="border-t border-border-dark">
          <dl className="mx-auto grid max-w-[1280px] px-6 sm:grid-cols-3 sm:px-10 lg:px-14" aria-label="Key proof points">
            {copy.hero.proof.map((item) => (
              <div key={item.label} className="flex flex-col-reverse gap-2.5 border-b border-border-dark py-7 last:border-b-0 sm:border-b-0 sm:border-r sm:py-9 sm:pr-8 sm:last:border-r-0 sm:[&:not(:first-child)]:pl-8">
                <dt className="text-sm text-white/76">{item.label}</dt>
                <dd className="text-[clamp(28px,3vw,40px)] font-black leading-none tracking-[-.025em] text-white">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="h-1 bg-accent" />
      </section>

      <section id="company" aria-labelledby="company-heading" className="mx-auto max-w-[1280px] px-6 py-20 sm:px-10 lg:px-14 lg:py-28">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-end lg:gap-16">
          <SectionHeading id="company-heading" className="max-w-[15em]">{copy.company.headline}</SectionHeading>
          <BodyText measure="default">{copy.company.body}</BodyText>
        </div>
        <div className="mt-14 grid gap-10 md:grid-cols-3 lg:mt-18">
          {copy.company.pillars.map((pillar, index) => (
            <article key={pillar.title} className="border-t-2 border-navy pt-6">
              <p className={monoLabelClass}>{String(index + 1).padStart(2, '0')}</p>
              <CardHeading className="mt-3">{pillar.title}</CardHeading>
              <BodyText size="md" className="mt-3">{pillar.body}</BodyText>
            </article>
          ))}
        </div>
      </section>

      <section id="services" aria-labelledby="services-heading" className="border-y border-border-light bg-white">
        <div className="mx-auto max-w-[1280px] px-6 py-20 sm:px-10 lg:px-14 lg:py-26">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end lg:gap-16">
            <SectionHeading id="services-heading" className="max-w-[15em]">{copy.operating.headline}</SectionHeading>
            <BodyText measure="default">{copy.operating.body}</BodyText>
          </div>
          <ul className="mt-12 border-b border-border-light bg-paper lg:mt-16">
            {copy.operating.services.map((service, index) => {
              const isExternal = Boolean(service.href?.startsWith('http'));
              const rowClassName = 'group flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border-light px-5 py-6 transition-colors hover:bg-white sm:px-6 sm:py-7';
              const rowContent = (
                <>
                  <span className={`w-10 shrink-0 ${monoLabelClass}`}>{String(index + 1).padStart(2, '0')}</span>
                  <span className="flex-[1_1_200px] text-[22px] font-extrabold tracking-[-.02em] sm:text-[26px]">{service.title}</span>
                  <BodyText as="span" size="md" className="flex-[999_1_320px]">{service.body}</BodyText>
                  {service.href ? (
                    <span aria-hidden="true" className="hidden h-11 w-11 shrink-0 place-items-center rounded-full border border-navy/20 sm:grid transition group-hover:border-accent group-hover:bg-accent">
                      <ArrowIcon external={isExternal} />
                    </span>
                  ) : null}
                </>
              );

              if (!service.href) {
                return <li key={service.title} className={rowClassName}>{rowContent}</li>;
              }

              return (
                <li key={service.title}>
                  {isExternal ? (
                    <a href={service.href} target="_blank" rel="noopener noreferrer" className={rowClassName} aria-label={`${service.title} opens in a new tab`}>
                      {rowContent}
                    </a>
                  ) : (
                    <Link href={service.href} className={rowClassName}>
                      {rowContent}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section id="network" aria-labelledby="network-heading" className="bg-navy text-white">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-6 py-20 sm:px-10 lg:grid-cols-2 lg:gap-16 lg:px-14 lg:py-28">
          <div>
            <SectionHeading id="network-heading" className="max-w-[13em]">{copy.network.headline}</SectionHeading>
            <BodyText tone="onDark" measure="default" className="mt-6">{copy.network.body}</BodyText>
            <Link href={networkHref} className="mt-8 inline-flex min-h-[52px] items-center gap-2.5 rounded-full border border-accent-soft/60 px-7 font-bold text-accent-soft transition hover:border-accent-soft hover:bg-accent-soft/[.08]">
              {locale === 'kr' ? '파트너 네트워크 자세히 보기' : 'Explore Korea agent network'}
              <ArrowIcon />
            </Link>
          </div>
          <div className="self-center">
            <WcaBadge variant="inter-global" label="WCA Inter Global" caption={copy.network.membership.label} height={64} />
            <ul className="mt-8 grid border-t border-border-dark sm:grid-cols-2 sm:gap-x-8">
              {copy.network.points.map((point) => (
                <li key={point} className="flex items-start gap-4 border-b border-border-dark py-7 text-lg font-bold">
                  <CheckIcon />
                  {point}
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <WcaMemberTools heading={copy.network.tools.heading} items={copy.network.tools.items} tone="dark" />
            </div>
          </div>
        </div>
      </section>

      <section id="solutions" aria-labelledby="solutions-heading" className="mx-auto max-w-[1280px] px-6 py-20 sm:px-10 lg:px-14 lg:py-28">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end lg:gap-16">
          <SectionHeading id="solutions-heading">{copy.solutions.headline}</SectionHeading>
          <BodyText measure="default">{copy.solutions.body}</BodyText>
        </div>
        <ol className="mt-14 grid gap-10 md:grid-cols-3 lg:mt-18">
          {copy.solutions.steps.map((step, index) => {
            const [number, title] = step.title.split(' · ');
            const isLast = index === copy.solutions.steps.length - 1;
            return (
              <li key={step.title}>
                <div className="flex items-center gap-3" aria-hidden="true">
                  <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full font-mono text-sm font-semibold bg-navy text-accent-soft`}>
                    {number}
                  </span>
                  {/* The line leads to the next step; the last step has none to lead to (design review F-007). */}
                  <span className={`h-0.5 flex-1 ${isLast ? 'invisible' : 'bg-accent'}`} />
                </div>
                <CardHeading size="md" className="mt-4">
                  <span className="sr-only">{number} · </span>
                  {title ?? step.title}
                </CardHeading>
                <BodyText size="md" className="mt-3">{step.body}</BodyText>
              </li>
            );
          })}
        </ol>
      </section>

      <section id="faq" aria-labelledby="faq-heading" className="mx-auto max-w-[1280px] px-6 pb-20 sm:px-10 lg:px-14 lg:pb-28">
        <div className="grid gap-10 border-t border-border-light pt-20 lg:grid-cols-[.8fr_1.2fr] lg:gap-16 lg:pt-24">
          <div>
            <SectionHeading id="faq-heading" size="md">
              {locale === 'kr' ? '자주 묻는 물류 문의' : 'Freight questions, answered clearly.'}
            </SectionHeading>
            <BodyText measure="narrow" className="mt-5">
              {locale === 'kr'
                ? '견적과 파트너십 문의 전에 필요한 핵심 정보를 짧고 명확하게 정리했습니다.'
                : 'Clear answers for ocean freight, air freight, and WCA partner enquiries.'}
            </BodyText>
          </div>
          <div className="border-t border-navy">
            {faqs.map((faq) => (
              <details key={faq.question} className="group border-b border-border-light py-1">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 py-3 text-lg font-bold tracking-[-.01em] text-navy marker:hidden">
                  <span>{faq.question}</span>
                  <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-navy/25 text-lg transition-transform duration-200 group-open:rotate-45">+</span>
                </summary>
                <BodyText size="md" measure="default" className="mb-6">{faq.answer}</BodyText>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" aria-labelledby="contact-heading" className="mx-auto max-w-[1280px] px-6 pb-20 sm:px-10 lg:px-14 lg:pb-28">
        <div className="rounded-[28px] bg-navy p-8 text-white sm:p-12 lg:flex lg:items-end lg:justify-between lg:gap-16 lg:p-16">
          <div>
            <h2 id="contact-heading" className="ks-type-hero max-w-3xl text-[clamp(34px,9vw,42px)] font-black leading-[1.04] tracking-[-.028em] sm:text-[clamp(40px,4vw,60px)] sm:leading-[1.02] sm:tracking-[-.03em]">{copy.contact.headline}</h2>
            <BodyText tone="onDark" measure="default" className="mt-5">{copy.contact.body}</BodyText>
            <div className="mt-5 flex flex-col gap-1 text-sm font-semibold text-white/86 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-7">
              <a href={`mailto:${copy.contact.email}`} className="inline-flex min-h-11 items-center transition hover:text-accent-soft">{copy.contact.email}</a>
              <a href={contactPhoneHref} className="inline-flex min-h-11 items-center transition hover:text-accent-soft">{copy.contact.phone}</a>
              <span className="inline-flex min-h-11 items-center text-white/76">{copy.contact.fax}</span>
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

      <SiteFooter footer={copy.footer} />
    </main>
  );
}
