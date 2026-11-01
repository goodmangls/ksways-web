import { expect, test } from '@playwright/test';
import { SMOKE_PAGES } from './pages';

// 헤더 조작 요소의 터치·클릭 목표 크기 가드 (DESIGN.md 터치 목표 44px, impeccable audit 2026-10-31).
// 데스크톱 내비 링크 4개는 글자 높이(23px)만큼만 눌렸다. 클래스 문자열이 아니라
// 실제 렌더된 상자를 잰다 — 레이아웃이 min-h 를 무시해도 여기서 잡힌다.
// 스킵 링크는 포커스 전에는 sr-only(1px)라 제외하고 skip-link.spec.ts 가 따로 잰다.

const MIN = 44;

for (const width of [1440, 375]) {
  for (const { path } of SMOKE_PAGES) {
    test(`${path} @${width}: every visible header control is at least ${MIN}px tall`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);

      const short = await page.locator('header').first().evaluate((header, min) => {
        return [...header.querySelectorAll<HTMLElement>('a, button')]
          .filter((el) => !el.classList.contains('sr-only'))
          .map((el) => ({ el, box: el.getBoundingClientRect() }))
          .filter(({ box }) => box.width > 1 && box.height > 1) // 숨김(hidden·display:none) 제외
          .filter(({ box }) => box.height < min)
          .map(({ el, box }) => `${el.textContent?.trim() || el.getAttribute('aria-label')}: ${Math.round(box.height)}px`);
      }, MIN);

      expect(short).toEqual([]);
    });
  }
}
