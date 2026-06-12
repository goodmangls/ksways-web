import Link from 'next/link';
import type { Locale } from '@/lib/i18n';
import { getLocalizedPath } from '@/lib/i18n';
import type { homeContent } from '@/lib/content';
import { HtmlLangSync } from './HtmlLangSync';

type HomeCopy = (typeof homeContent)[Locale];

type Props = {
  locale: Locale;
  copy: HomeCopy;
};

const flowNodes = ['AIR', 'OCEAN', 'EXPRESS', 'PARTNER'];

export function HomePage({ locale, copy }: Props) {
  const alternateLocale: Locale = locale === 'en' ? 'kr' : 'en';
  const toggleHref = getLocalizedPath(locale === 'en' ? '/' : '/kr', alternateLocale);

  return (
    <main className="min-h-screen bg-[#f6f8f8] text-[#001112]">
      <HtmlLangSync locale={locale} />
      <section className="relative isolate min-h-screen overflow-hidden bg-[#001112] text-white">
        <div className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_74%_24%,rgba(33,212,194,.30),transparent_28%),radial-gradient(circle_at_32%_76%,rgba(45,140,255,.18),transparent_34%),linear-gradient(120deg,rgba(0,17,18,.96)_0%,rgba(0,17,18,.88)_42%,rgba(1,25,27,.78)_100%)]" />
        <div className="absolute -bottom-[8%] -right-[8%] -top-[12%] left-[40%] -z-20 rotate-[-18deg] opacity-70 [background:repeating-linear-gradient(90deg,rgba(199,112,76,.55)_0_42px,rgba(199,112,76,.08)_42px_50px,rgba(31,99,124,.72)_50px_92px,rgba(31,99,124,.08)_92px_104px,rgba(209,182,115,.58)_104px_146px,rgba(209,182,115,.08)_146px_158px),repeating-linear-gradient(0deg,rgba(255,255,255,.12)_0_1px,transparent_1px_78px),repeating-linear-gradient(90deg,rgba(255,255,255,.10)_0_1px,transparent_1px_96px)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(110deg,transparent_0_36%,rgba(33,212,194,.45)_36.1%_36.25%,transparent_36.35%_100%),linear-gradient(150deg,transparent_0_57%,rgba(111,255,231,.28)_57.1%_57.22%,transparent_57.35%_100%)]" />

        <header className="relative z-10 flex h-[78px] items-center justify-between px-6 sm:px-10 lg:px-14">
          <Link href={locale === 'en' ? '/' : '/kr'} className="flex items-center gap-2 text-xl font-black italic tracking-[-.04em]" aria-label="KSWAYS home">
            <span className="h-4 w-4 rotate-45 rounded-[3px] border-2 border-b-transparent border-l-transparent border-[#21d4c2] shadow-[0_0_18px_rgba(33,212,194,.7)]" />
            KSWAYS
          </Link>
          <nav aria-label="Primary navigation" className="hidden items-center gap-9 text-sm font-bold text-white/75 lg:flex">
            <a href="#company" className="hover:text-white">{copy.nav.company}</a>
            <a href="#services" className="hover:text-white">{copy.nav.services}</a>
            <a href="#network" className="hover:text-white">{copy.nav.network}</a>
            <a href="#solutions" className="hover:text-white">{copy.nav.solutions}</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href={toggleHref} className="grid h-11 min-w-11 place-items-center rounded-full border border-white/35 px-4 text-sm font-black text-white" aria-label="Toggle language">
              {copy.nav.langToggle}
            </Link>
            <a href="#contact" className="hidden min-h-11 items-center rounded-full border border-white/55 px-5 text-sm font-extrabold text-white sm:inline-flex">{copy.nav.contact}</a>
            <a href="#contact" className="inline-flex min-h-11 items-center rounded-full bg-gradient-to-br from-[#21d4c2] to-[#6fffe7] px-5 text-sm font-black text-[#001112] shadow-[0_15px_40px_rgba(33,212,194,.22)]">{copy.nav.quote}</a>
          </div>
        </header>

        <div className="relative z-10 grid min-h-[calc(100vh-78px)] items-end gap-12 px-6 pb-14 pt-8 sm:px-10 lg:grid-cols-[minmax(0,1.04fr)_minmax(360px,.7fr)] lg:px-14">
          <div>
            <p className="mb-5 text-[clamp(14px,1.2vw,17px)] tracking-[-.01em] text-white/80">{copy.hero.eyebrow}</p>
            <h1 className="max-w-5xl text-[clamp(58px,8.2vw,122px)] font-black leading-[.88] tracking-[-.075em] text-balance">
              {copy.hero.headline.split(' global ').length === 2 ? (
                <>
                  {copy.hero.headline.split(' global ')[0]} <span className="text-[#6fffe7] drop-shadow-[0_0_32px_rgba(33,212,194,.22)]">global</span> {copy.hero.headline.split(' global ')[1]}
                </>
              ) : (
                copy.hero.headline
              )}
            </h1>
            <p className="mt-7 max-w-2xl text-[clamp(17px,1.35vw,21px)] leading-relaxed tracking-[-.018em] text-white/72">{copy.hero.lead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#contact" className="inline-flex min-h-[52px] items-center rounded-full bg-gradient-to-br from-[#21d4c2] to-[#6fffe7] px-7 font-black text-[#001112]">{copy.hero.primaryCta}</a>
              <a href="#network" className="inline-flex min-h-[52px] items-center rounded-full border border-white/55 px-7 font-black text-white">{copy.hero.secondaryCta}</a>
            </div>
            <dl className="mt-10 grid max-w-3xl overflow-hidden rounded-r-3xl border border-white/10 bg-[#001112]/45 backdrop-blur-md sm:grid-cols-3" aria-label="Key proof points">
              {copy.hero.proof.map((item) => (
                <div key={item.label} className="border-b border-white/10 p-5 sm:border-b-0 sm:border-r last:border-0">
                  <dt className="font-mono text-[10px] uppercase tracking-[.14em] text-white/48">{item.label}</dt>
                  <dd className="mt-2 text-xl font-black tracking-[-.04em] text-white sm:text-2xl">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <aside className="mb-8 hidden max-w-[392px] justify-self-end rounded-[34px] border border-white/20 bg-white/10 p-6 shadow-[0_30px_90px_rgba(0,0,0,.42)] backdrop-blur-2xl lg:block" aria-label="KSWAYS logistics control tower card">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[.16em] text-white/48">Control tower</p>
                <h2 className="mt-2 text-2xl font-black tracking-[-.04em]">{copy.hero.controlTitle}</h2>
              </div>
              <span className="rounded-full bg-[#6fffe7] px-3 py-1 text-[10px] font-black text-[#001112]">LIVE</span>
            </div>
            <div className="relative min-h-[220px] overflow-hidden rounded-3xl border border-white/15 bg-[radial-gradient(circle_at_50%_50%,rgba(33,212,194,.28),transparent_27%),linear-gradient(135deg,rgba(255,255,255,.09),rgba(0,17,18,.22))]">
              <div className="absolute left-7 right-7 top-1/2 h-px bg-white/15" />
              <div className="absolute bottom-7 left-1/2 top-7 w-px bg-white/15" />
              {flowNodes.map((label, index) => (
                <div key={label} className={`absolute grid h-12 w-24 place-items-center rounded-2xl border border-white/10 bg-[#001112]/80 ${index === 0 ? 'left-5 top-6' : ''}${index === 1 ? 'right-5 top-6' : ''}${index === 2 ? 'bottom-6 left-5' : ''}${index === 3 ? 'bottom-6 right-5' : ''}`}>
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
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-r from-[#21d4c2] to-[#2d8cff]" />
      </section>

      <section id="services" className="px-6 py-16 sm:px-10 lg:px-14">
        <p className="text-sm font-black uppercase tracking-[.12em] text-[#8c9496]">{copy.operating.kicker}</p>
        <h2 className="mt-4 max-w-4xl text-[clamp(42px,5.4vw,76px)] font-black leading-[.95] tracking-[-.07em] text-[#001112]">{copy.operating.headline}</h2>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[#001112]/60">{copy.operating.body}</p>
        <div className="mt-10 grid overflow-hidden rounded-[28px] border border-[#001112]/20 md:grid-cols-4">
          {copy.operating.services.map((service) => (
            <article key={service.title} className="min-h-32 border-b border-[#001112]/15 p-7 md:border-b-0 md:border-r last:border-0">
              <h3 className="text-xl font-black tracking-[-.03em]">{service.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#001112]/55">{service.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="network" className="grid gap-8 bg-[#001112] px-6 py-16 text-white sm:px-10 lg:grid-cols-[.9fr_1.1fr] lg:px-14">
        <div>
          <p className="text-sm font-black uppercase tracking-[.12em] text-[#6fffe7]">{copy.network.kicker}</p>
          <h2 className="mt-4 text-[clamp(38px,5vw,68px)] font-black leading-[.95] tracking-[-.065em]">{copy.network.headline}</h2>
        </div>
        <div>
          <p className="text-lg leading-relaxed text-white/68">{copy.network.body}</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {copy.network.points.map((point) => (
              <li key={point} className="rounded-2xl border border-white/12 bg-white/[.04] p-5 font-bold text-white/86">{point}</li>
            ))}
          </ul>
        </div>
      </section>

      <section id="contact" className="px-6 py-16 sm:px-10 lg:px-14">
        <div className="rounded-[34px] bg-[#001112] p-8 text-white sm:p-12 lg:flex lg:items-end lg:justify-between">
          <div>
            <h2 className="max-w-3xl text-[clamp(42px,5vw,76px)] font-black leading-[.95] tracking-[-.07em]">{copy.contact.headline}</h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/68">{copy.contact.body}</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3 lg:mt-0">
            <a href="mailto:contact@ksways.co" className="inline-flex min-h-[52px] items-center rounded-full bg-gradient-to-br from-[#21d4c2] to-[#6fffe7] px-7 font-black text-[#001112]">{copy.contact.quote}</a>
            <a href="mailto:partner@ksways.co" className="inline-flex min-h-[52px] items-center rounded-full border border-white/45 px-7 font-black text-white">{copy.contact.partner}</a>
          </div>
        </div>
      </section>
    </main>
  );
}
