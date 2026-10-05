import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { HERO_SLIDE_SECONDS, getHeroSlides } from './hero-slides';

const globalsCss = readFileSync(path.join(process.cwd(), 'src/app/globals.css'), 'utf8');

describe('hero slides', () => {
  it('keeps the ocean slide first and the courier slide last', () => {
    const ids = getHeroSlides().map((slide) => slide.id);

    // 첫 장은 reduced-motion·시각 회귀 스냅샷이 보는 이미지다.
    expect(ids[0]).toBe('E0AHdsENmDg');
    expect(ids.at(-1)).toBe('BcJ2daQRfxU');
  });

  it('ties the CSS loop length to the number of slides', () => {
    // 슬라이드를 추가하고 CSS 를 그대로 두면 회전이 겹치거나 빈 화면이 생긴다.
    const durations = [...globalsCss.matchAll(/animation:\s*ks-hero-bg-cycle\s+(\d+)s/g)].map((m) => Number(m[1]));

    expect(durations.length).toBe(2);
    for (const seconds of durations) {
      expect(seconds).toBe(getHeroSlides().length * HERO_SLIDE_SECONDS);
    }
    expect(globalsCss).toContain(`animation-delay: calc(var(--ks-slide-index) * ${HERO_SLIDE_SECONDS}s)`);
  });

  it('credits the Unsplash+ courier photo and ships it locally', () => {
    const courier = getHeroSlides().find((slide) => slide.id === 'BcJ2daQRfxU');

    expect(courier).toMatchObject({
      src: '/assets/hero/courier-handoff.jpg',
      credit: 'Getty Images',
      sourceLabel: 'Unsplash+',
    });
    expect(courier?.sourceUrl).toContain('utm_source=ksways');
    expect(existsSync(path.join(process.cwd(), 'public', courier!.src))).toBe(true);
  });

  it('gives every slide a credit and an Unsplash source link', () => {
    for (const slide of getHeroSlides()) {
      expect(slide.credit).toBeTruthy();
      expect(slide.sourceUrl).toMatch(/^https:\/\/unsplash\.com\//);
      expect(slide.alt.toLowerCase()).toMatch(/logistics|freight|cargo|trade|partner|parcel|delivery/);
    }
  });
});
