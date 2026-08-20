import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const source = readFileSync(join(process.cwd(), 'src/components/HomePage.tsx'), 'utf8');
const brandLogoSource = readFileSync(join(process.cwd(), 'src/components/BrandLogo.tsx'), 'utf8');

describe('HomePage mobile optimization classes', () => {
  it('relaxes mobile display heading line-height while preserving tighter desktop display rhythm', () => {
    expect(source).toContain('leading-[1.04]');
    expect(source).toContain('sm:leading-[.92]');
    expect(source).toContain('sm:leading-[.98]');
  });

  it('stacks hero CTAs as full-width touch targets on mobile and restores inline CTAs on larger screens', () => {
    expect(source).toContain('flex flex-col items-stretch gap-3 sm:flex-row');
    expect(source).toContain('w-full justify-center');
    expect(source).toContain('sm:w-auto');
  });

  it('keeps compact navigation and FAQ controls at a minimum 44px mobile touch height', () => {
    expect(source).toContain('min-h-11 cursor-pointer');
  });

  it('provides a mobile nav disclosure where the desktop nav and contact CTA are hidden', () => {
    // 원설계(c73519d)는 Primary nav 를 `hidden lg:flex`, Contact 를 `hidden sm:inline-flex` 로만
    // 처리해 1024px 미만에서 섹션 이동 수단이 없었다 — MobileNav 아일랜드가 그 공백을 메운다.
    const mobileNavSource = readFileSync(join(process.cwd(), 'src/components/MobileNav.tsx'), 'utf8');

    expect(source).toContain('<MobileNav');
    expect(mobileNavSource).toContain('lg:hidden');
    expect(mobileNavSource).toContain('aria-expanded');
    expect(mobileNavSource).toContain('min-h-11');
  });

  it('keeps the brand mark link at a 44px touch target', () => {
    // The mark lives in BrandLogo now, shared by every surface. It previously
    // had four copies and one of them (ServiceLandingPage) had lost min-h-11,
    // leaving a 32-36px target against DESIGN.md's 44px rule.
    expect(brandLogoSource).toContain('min-h-11');
  });
});
