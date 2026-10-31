import Link from 'next/link';
import type { HomeCopy } from '@/lib/content';
import { BrandLogo } from './BrandLogo';
import { MobileNav } from './MobileNav';

type Props = {
  nav: HomeCopy['nav'];
  /** The locale's homepage: the logo target and the base for section links. */
  homeHref: '/' | '/kr';
  /** Where the language pill goes. There are no Korean subpages yet, so English subpages point at `/kr`. */
  toggleHref: string;
  quoteHref: string;
  /** On the homepage section links stay in-page (`#services`); elsewhere they go back to it (`/#services`). */
  isHome?: boolean;
};

/**
 * The one header every page carries (DESIGN.md "The One Desk Rule"): logo,
 * section navigation, language toggle, contact and quote CTA.
 *
 * Subpages used to ship reduced copies — logo plus a single link — so a visitor
 * landing on a service page from search could not reach Company, Network or the
 * Korean site without going through the logo first (design review F-001).
 * `z-30`: the open MobileNav panel has to sit above hero content and photo
 * credits, or its links stop taking clicks (e2e mobile-nav guard).
 */
export function SiteHeader({ nav, homeHref, toggleHref, quoteHref, isHome = false }: Props) {
  const sectionBase = isHome ? '' : homeHref;
  const section = (id: string) => `${sectionBase}#${id}`;

  return (
    <header className="relative z-30 mx-auto flex h-[80px] w-full max-w-[1280px] items-center justify-between gap-4 px-6 sm:px-10 lg:px-14">
      <BrandLogo href={homeHref} priority />
      <nav aria-label="Primary navigation" className="hidden items-center gap-8 text-[15px] font-semibold text-white/78 lg:flex">
        <a href={section('company')} className="transition hover:text-white">{nav.company}</a>
        <a href={section('services')} className="transition hover:text-white">{nav.services}</a>
        <a href={section('network')} className="transition hover:text-white">{nav.network}</a>
        <a href={section('solutions')} className="transition hover:text-white">{nav.solutions}</a>
      </nav>
      <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
        {/* Below 360px the row is ~23px too wide for logo + toggle + quote + menu; the toggle moves into the menu there. */}
        <Link href={toggleHref} className="grid h-11 min-w-11 place-items-center rounded-full border border-white/30 px-3 text-sm font-bold text-white transition hover:border-white/70 max-[359px]:hidden sm:px-4" aria-label="Toggle language">
          {nav.langToggle}
        </Link>
        <a href={section('contact')} className="hidden min-h-11 items-center rounded-full border border-white/45 px-5 text-sm font-bold text-white transition hover:border-white hover:bg-white/[.06] sm:inline-flex">{nav.contact}</a>
        <a href={quoteHref} className="inline-flex min-h-11 items-center whitespace-nowrap rounded-full bg-[#b88a5a] px-4 text-sm font-extrabold text-[#001112] transition hover:bg-[#a5794d] sm:px-5">{nav.quote}</a>
        <MobileNav nav={nav} sectionBase={sectionBase} toggleHref={toggleHref} />
      </div>
    </header>
  );
}
