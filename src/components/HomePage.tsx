import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { Locale } from '@/lib/i18n';
import { getLocalizedPath } from '@/lib/i18n';
import type { homeContent } from '@/lib/content';
import { faqJsonLd, homeFaqs, organizationJsonLd } from '@/lib/seo';
import { getHeroUnsplashImages } from '@/lib/unsplash';
import { BrandLogo } from './BrandLogo';
import { ContactActions } from './ContactActions';
import { MobileNav } from './MobileNav';
import { SiteFooter } from './SiteFooter';

type HomeCopy = (typeof homeContent)[Locale];

type Props = {
  locale: Locale;
  copy: HomeCopy;
};

const heroBackgroundSlides = getHeroUnsplashImages();

// 가독성 기준 (DESIGN.md "Typography"): 섹션 제목은 문장형이라 52px 상한, 행간 1.08.
// 본문은 navy 78% — 56~62% 는 흰 배경 작은 글자에서 AA(4.5:1) 경계 아래로 떨어졌다.
const sectionHeadingClass =
  'text-[clamp(32px,8.5vw,40px)] font-extrabold leading-[1.08] tracking-[-.025em] text-balance sm:text-[clamp(36px,3.6vw,52px)]';
const sectionBodyClass = 'max-w-[34em] text-lg leading-[1.7] text-[#001112]/78';
const monoLabelClass = 'font-mono text-[13px] font-semibold text-[#805d3b]';

function ArrowIcon({ external = false }: { external?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d={external ? 'M5 11l6-6M6 5h5v5' : 'M3 8h10M9 4l4 4-4 4'}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true" className="mt-0.5 shrink-0">
      <circle cx="11" cy="11" r="10" stroke="#b88a5a" strokeWidth="1.5" />
      <path d="M6.5 11.2l3 3 6-6.4" stroke="#e7c99a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HighlightedHeadline({ headline }: { headline: string }) {
  const english = headline.split(' global ');
  if (english.length === 2) {
    return (
      <>
        {english[0]} <span className="text-[#e7c99a]">global</span> {english[1]}
      </>
    );
  }

  const korean = headline.split('글로벌');
  if (korean.length === 2) {
    return (
      <>
        {korean[0]}<span className="text-[#e7c99a]">글로벌</span>{korean[1]}
      </>
    );
  }

  return headline;
}

/** 히어로 사진 패널. 전면 배경 대신 우측 패널로 옮겨 헤드라인이 사진 위에 얹히지 않게 했다. */
function HeroPhotoPanel({ caption }: { caption: string }) {
  return (
    <figure className="relative isolate m-0 aspect-[4/3] overflow-hidden rounded-[28px] border border-[#1f3436] bg-[#031d20] lg:aspect-[4/4.4]">
      <div className="absolute inset-0 -z-10" aria-label="Rotating hero images for ocean freight and air cargo logistics">
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
      <figcaption className="absolute inset-x-3 bottom-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-[18px] border border-white/12 bg-[#001112]/85 px-5 py-3.5 sm:inset-x-5 sm:bottom-5">
        <span className="text-[15px] font-bold text-white">{caption}</span>
        <span className="grid text-xs font-semibold text-white/72">
          {heroBackgroundSlides.map((slide, index) => (
            <span
              key={`${slide.id}-credit`}
              className="ks-hero-bg-attribution col-start-1 row-start-1"
              style={{ '--ks-slide-index': index } as CSSProperties}
            >
              Photo:{' '}
              <a href={slide.photographerUrl} target="_blank" rel="noopener noreferrer" className="underline-offset-4 transition hover:text-white hover:underline">
                {slide.photographer}
              </a>{' '}
              /{' '}
              <a href={slide.unsplashUrl} target="_blank" rel="noopener noreferrer" className="underline-offset-4 transition hover:text-white hover:underline">
                Unsplash
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
    <main className={`min-h-screen bg-[#f4f7f6] text-[#001112] ${locale === 'kr' ? 'break-keep' : ''}`}>
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
      <section aria-labelledby="hero-heading" className="relative isolate bg-[#001112] text-white">
        {/* z-30: 히어로 콘텐츠·사진 크레딧보다 위 — MobileNav 패널이 가려지면 링크 클릭이 차단된다 (e2e mobile-nav 가드) */}
        <header className="relative z-30 mx-auto flex h-[80px] w-full max-w-[1280px] items-center justify-between px-6 sm:px-10 lg:px-14">
          <BrandLogo href={locale === 'en' ? '/' : '/kr'} priority />
          <nav aria-label="Primary navigation" className="hidden items-center gap-8 text-[15px] font-semibold text-white/78 lg:flex">
            <a href="#company" className="transition hover:text-white">{copy.nav.company}</a>
            <a href="#services" className="transition hover:text-white">{copy.nav.services}</a>
            <a href="#network" className="transition hover:text-white">{copy.nav.network}</a>
            <a href="#solutions" className="transition hover:text-white">{copy.nav.solutions}</a>
          </nav>
          <div className="flex items-center gap-2.5">
            <Link href={toggleHref} className="grid h-11 min-w-11 place-items-center rounded-full border border-white/30 px-4 text-sm font-bold text-white transition hover:border-white/70" aria-label="Toggle language">
              {copy.nav.langToggle}
            </Link>
            <a href="#contact" className="hidden min-h-11 items-center rounded-full border border-white/45 px-5 text-sm font-bold text-white transition hover:border-white hover:bg-white/[.06] sm:inline-flex">{copy.nav.contact}</a>
            <a href={quoteHref} className="inline-flex min-h-11 items-center rounded-full bg-[#b88a5a] px-5 text-sm font-extrabold text-[#001112] transition hover:bg-[#a5794d]">{copy.nav.quote}</a>
            <MobileNav nav={copy.nav} />
          </div>
        </header>

        <div className="relative z-10 mx-auto grid w-full max-w-[1280px] items-center gap-12 px-6 pb-16 pt-10 sm:px-10 lg:min-h-[640px] lg:grid-cols-[1.05fr_.95fr] lg:gap-14 lg:px-14 lg:pb-20 lg:pt-14">
          <div>
            <p className="font-mono text-[13px] font-semibold uppercase tracking-[.12em] text-[#e7c99a]">{copy.hero.eyebrow}</p>
            <h1 id="hero-heading" className="mt-6 text-[clamp(40px,11vw,52px)] font-black leading-[1.04] tracking-[-.028em] text-balance sm:text-[clamp(52px,6.2vw,88px)] sm:leading-[1] sm:tracking-[-.03em]">
              <HighlightedHeadline headline={copy.hero.headline} />
            </h1>
            <p className="mt-7 max-w-[34em] text-[clamp(17px,1.3vw,19px)] leading-[1.65] text-white/80 text-pretty">{copy.hero.lead}</p>
            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <a href={quoteHref} className="inline-flex min-h-[52px] w-full justify-center items-center gap-2.5 rounded-full bg-[#b88a5a] px-7 font-extrabold text-[#001112] transition hover:bg-[#a5794d] sm:w-auto">
                {copy.hero.primaryCta}
                <ArrowIcon />
              </a>
              <a href="#network" className="inline-flex min-h-[52px] w-full justify-center items-center rounded-full border border-white/45 px-7 font-bold text-white transition hover:border-white hover:bg-white/[.06] sm:w-auto">{copy.hero.secondaryCta}</a>
            </div>
          </div>
          <HeroPhotoPanel caption={copy.hero.controlTitle} />
        </div>

        <div className="border-t border-[#1f3436]">
          <dl className="mx-auto grid max-w-[1280px] px-6 sm:grid-cols-3 sm:px-10 lg:px-14" aria-label="Key proof points">
            {copy.hero.proof.map((item) => (
              <div key={item.label} className="flex flex-col-reverse gap-2.5 border-b border-[#1f3436] py-7 last:border-b-0 sm:border-b-0 sm:border-r sm:py-9 sm:pr-8 sm:last:border-r-0 sm:[&:not(:first-child)]:pl-8">
                <dt className="text-[15px] text-white/76">{item.label}</dt>
                <dd className="text-[clamp(28px,3vw,40px)] font-black leading-none tracking-[-.025em] text-white">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="h-1 bg-[#b88a5a]" />
      </section>

      <section id="company" aria-labelledby="company-heading" className="mx-auto max-w-[1280px] px-6 py-20 sm:px-10 lg:px-14 lg:py-28">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-end lg:gap-16">
          <h2 id="company-heading" className={`max-w-[15em] ${sectionHeadingClass}`}>{copy.company.headline}</h2>
          <p className={sectionBodyClass}>{copy.company.body}</p>
        </div>
        <div className="mt-14 grid gap-10 md:grid-cols-3 lg:mt-18">
          {copy.company.pillars.map((pillar, index) => (
            <article key={pillar.title} className="border-t-2 border-[#001112] pt-6">
              <p className={monoLabelClass}>{String(index + 1).padStart(2, '0')}</p>
              <h3 className="mt-3 text-[22px] font-extrabold tracking-[-.015em]">{pillar.title}</h3>
              <p className="mt-3 leading-[1.65] text-[#001112]/76">{pillar.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="services" aria-labelledby="services-heading" className="border-y border-[#d9e2e0] bg-white">
        <div className="mx-auto max-w-[1280px] px-6 py-20 sm:px-10 lg:px-14 lg:py-26">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end lg:gap-16">
            <h2 id="services-heading" className={`max-w-[15em] ${sectionHeadingClass}`}>{copy.operating.headline}</h2>
            <p className={sectionBodyClass}>{copy.operating.body}</p>
          </div>
          <ul className="mt-12 border-b border-[#d9e2e0] bg-[#f4f7f6] lg:mt-16">
            {copy.operating.services.map((service, index) => {
              const isExternal = Boolean(service.href?.startsWith('http'));
              const rowClassName = 'group flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[#d9e2e0] px-5 py-6 transition-colors hover:bg-white sm:px-6 sm:py-7';
              const rowContent = (
                <>
                  <span className={`w-10 shrink-0 ${monoLabelClass}`}>{String(index + 1).padStart(2, '0')}</span>
                  <span className="flex-[1_1_200px] text-[22px] font-extrabold tracking-[-.02em] sm:text-[26px]">{service.title}</span>
                  <span className="flex-[999_1_320px] leading-[1.6] text-[#001112]/76">{service.body}</span>
                  {service.href ? (
                    <span aria-hidden="true" className="hidden h-11 w-11 shrink-0 place-items-center rounded-full border border-[#001112]/20 sm:grid transition group-hover:border-[#b88a5a] group-hover:bg-[#b88a5a]">
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

      <section id="network" aria-labelledby="network-heading" className="bg-[#001112] text-white">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-6 py-20 sm:px-10 lg:grid-cols-2 lg:gap-16 lg:px-14 lg:py-28">
          <div>
            <h2 id="network-heading" className={`max-w-[13em] ${sectionHeadingClass}`}>{copy.network.headline}</h2>
            <p className="mt-6 max-w-[32em] text-lg leading-[1.7] text-white/80">{copy.network.body}</p>
            <Link href={networkHref} className="mt-8 inline-flex min-h-[52px] items-center gap-2.5 rounded-full border border-[#e7c99a]/60 px-7 font-bold text-[#e7c99a] transition hover:border-[#e7c99a] hover:bg-[#e7c99a]/[.08]">
              {locale === 'kr' ? '파트너 네트워크 자세히 보기' : 'Explore Korea agent network'}
              <ArrowIcon />
            </Link>
          </div>
          <ul className="grid self-center border-t border-[#1f3436] sm:grid-cols-2 sm:gap-x-8">
            {copy.network.points.map((point) => (
              <li key={point} className="flex items-start gap-4 border-b border-[#1f3436] py-7 text-lg font-bold">
                <CheckIcon />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="solutions" aria-labelledby="solutions-heading" className="mx-auto max-w-[1280px] px-6 py-20 sm:px-10 lg:px-14 lg:py-28">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end lg:gap-16">
          <h2 id="solutions-heading" className={sectionHeadingClass}>{copy.solutions.headline}</h2>
          <p className={sectionBodyClass}>{copy.solutions.body}</p>
        </div>
        <ol className="mt-14 grid gap-10 md:grid-cols-3 lg:mt-18">
          {copy.solutions.steps.map((step, index) => {
            const [number, title] = step.title.split(' · ');
            const isLast = index === copy.solutions.steps.length - 1;
            return (
              <li key={step.title}>
                <div className="flex items-center gap-3" aria-hidden="true">
                  <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full font-mono text-sm font-semibold ${isLast ? 'bg-[#b88a5a] text-[#001112]' : 'bg-[#001112] text-[#e7c99a]'}`}>
                    {number}
                  </span>
                  <span className={`h-0.5 flex-1 ${isLast ? 'bg-[#d9e2e0]' : 'bg-[#b88a5a]'}`} />
                </div>
                <h3 className="mt-4 text-2xl font-extrabold tracking-[-.015em]">
                  <span className="sr-only">{number} · </span>
                  {title ?? step.title}
                </h3>
                <p className="mt-3 leading-[1.65] text-[#001112]/76">{step.body}</p>
              </li>
            );
          })}
        </ol>
      </section>

      <section id="faq" aria-labelledby="faq-heading" className="mx-auto max-w-[1280px] px-6 pb-20 sm:px-10 lg:px-14 lg:pb-28">
        <div className="grid gap-10 border-t border-[#d9e2e0] pt-20 lg:grid-cols-[.8fr_1.2fr] lg:gap-16 lg:pt-24">
          <div>
            <h2 id="faq-heading" className="text-[clamp(30px,8vw,36px)] font-extrabold leading-[1.1] tracking-[-.025em] text-balance sm:text-[clamp(32px,3.2vw,44px)]">
              {locale === 'kr' ? '자주 묻는 물류 문의' : 'Freight questions, answered clearly.'}
            </h2>
            <p className="mt-5 max-w-[26em] text-lg leading-[1.7] text-[#001112]/78">
              {locale === 'kr'
                ? '견적과 파트너십 문의 전에 필요한 핵심 정보를 짧고 명확하게 정리했습니다.'
                : 'Clear answers for ocean freight, air freight, and WCA partner enquiries.'}
            </p>
          </div>
          <div className="border-t border-[#001112]">
            {faqs.map((faq) => (
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

      <section id="contact" aria-labelledby="contact-heading" className="mx-auto max-w-[1280px] px-6 pb-20 sm:px-10 lg:px-14 lg:pb-28">
        <div className="rounded-[28px] bg-[#001112] p-8 text-white sm:p-12 lg:flex lg:items-end lg:justify-between lg:gap-16 lg:p-16">
          <div>
            <h2 id="contact-heading" className="max-w-3xl text-[clamp(34px,9vw,42px)] font-black leading-[1.04] tracking-[-.028em] sm:text-[clamp(40px,4vw,60px)] sm:leading-[1.02] sm:tracking-[-.03em]">{copy.contact.headline}</h2>
            <p className="mt-5 max-w-[32em] text-lg leading-[1.7] text-white/80">{copy.contact.body}</p>
            <div className="mt-5 flex flex-col gap-1 text-[15px] font-semibold text-white/86 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-7">
              <a href={`mailto:${copy.contact.email}`} className="inline-flex min-h-11 items-center transition hover:text-[#e7c99a]">{copy.contact.email}</a>
              <a href={contactPhoneHref} className="inline-flex min-h-11 items-center transition hover:text-[#e7c99a]">{copy.contact.phone}</a>
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
