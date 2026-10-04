import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const source = readFileSync(join(process.cwd(), 'src/components/HomePage.tsx'), 'utf8');
const brandLogoSource = readFileSync(join(process.cwd(), 'src/components/BrandLogo.tsx'), 'utf8');

describe('HomePage mobile optimization classes', () => {
  it('relaxes mobile display heading line-height and never sets display lines tighter than 1', () => {
    // 데스크톱 .92/.98 행간은 문장형 제목이 줄바꿈될 때 윗줄 하강부와 아랫줄 상승부가
    // 닿았다 (특히 한글). 가독성 개편 이후 하한은 1.0 이다.
    expect(source).toContain('leading-[1.04]');
    expect(source).toContain('sm:leading-[1]');
    expect(source).not.toMatch(/leading-\[\.\d+\]/);
  });

  it('keeps Korean words intact when lines wrap', () => {
    // 기본 word-break 는 한글을 음절 단위로 끊어 "위 / 한", "글 / 로벌" 처럼 단어가 갈라졌다.
    expect(source).toContain("locale === 'kr' ? 'break-keep'");
  });

  it('keeps display tracking within the DESIGN.md -0.035em cap on every page template', () => {
    const servicePageSource = readFileSync(join(process.cwd(), 'src/components/ServiceLandingPage.tsx'), 'utf8');
    const tooTight = [source, servicePageSource].flatMap((text) =>
      [...text.matchAll(/tracking-\[-\.(\d+)em\]/g)].filter((m) => Number(`0.${m[1]}`) > 0.035).map((m) => m[0]),
    );
    expect(tooTight).toEqual([]);
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
