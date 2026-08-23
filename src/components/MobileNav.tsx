'use client';

import { useRef, useState } from 'react';
import type { HomeCopy } from '@/lib/content';

type MobileNavProps = {
  nav: HomeCopy['nav'];
};

// 데스크톱 Primary nav(`hidden lg:flex`)와 Contact(`hidden sm:inline-flex`)가
// 1024px 미만에서 사라지는 공백을 메우는 모바일 내비 아일랜드.
// lg 이상에서는 데스크톱 nav 가 있으므로 스스로 사라진다.
export function MobileNav({ nav }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Contact 는 헤더에서 sm(640px) 이상일 때 이미 보인다 — 그 구간에서 메뉴가 메워야 할
  // 공백은 섹션 링크뿐이라, 같은 CTA 를 두 번 노출하지 않도록 sm 부터 감춘다.
  const links: Array<{ label: string; href: string; className?: string }> = [
    { label: nav.company, href: '#company' },
    { label: nav.services, href: '#services' },
    { label: nav.network, href: '#network' },
    { label: nav.solutions, href: '#solutions' },
    { label: nav.contact, href: '#contact', className: 'sm:hidden' },
  ];

  function close() {
    setOpen(false);
  }

  return (
    <div
      className="relative lg:hidden"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          event.preventDefault();
          close();
          toggleRef.current?.focus();
        }
      }}
    >
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav-menu"
        aria-label={nav.menuLabel}
        onClick={() => setOpen((current) => !current)}
        className="grid h-11 min-w-11 place-items-center rounded-full border border-white/30 text-white transition hover:border-white/70"
      >
        <span aria-hidden="true" className="grid gap-[5px]">
          {open ? (
            <span className="text-lg font-black leading-none">×</span>
          ) : (
            <>
              <span className="block h-[2px] w-4 rounded bg-current" />
              <span className="block h-[2px] w-4 rounded bg-current" />
              <span className="block h-[2px] w-4 rounded bg-current" />
            </>
          )}
        </span>
      </button>

      {open ? (
        <nav
          id="mobile-nav-menu"
          aria-label="Mobile navigation"
          className="absolute right-0 top-[calc(100%+10px)] z-30 w-56 rounded-3xl border border-white/12 bg-[#021f22]/97 p-3 shadow-[0_28px_80px_rgba(0,0,0,.45)] backdrop-blur-xl"
        >
          <ul className="grid gap-1">
            {links.map((link) => (
              <li key={link.href} className={link.className}>
                <a
                  href={link.href}
                  onClick={close}
                  className="flex min-h-11 items-center rounded-2xl px-4 text-sm font-extrabold text-white/86 transition hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
