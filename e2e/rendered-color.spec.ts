import { expect, test, type Page } from '@playwright/test';
import { SMOKE_PAGES } from './pages';

// 렌더된 색 가드 — 소스가 아니라 브라우저가 계산한 값을 단언한다.
// brand-palette.test.ts 는 소스 문자열을 읽기 때문에 캐스케이드 버그를 볼 수 없다:
// globals.css 의 레이어 밖 `a { color: inherit; }` 가 Tailwind utilities 레이어를 이겨
// 모든 링크 CTA 의 `text-[#001112]` 를 무시했고, 브론즈 위 흰 글자(3.07:1, AA 미달)가
// 출시 때부터 전 페이지에 나갔다 (impeccable audit 2026-10-31).
// DESIGN.md "Contrast rule": 브론즈(tertiary / tertiary-hover) 위 글자는 ink 만 허용.

const INK = 'rgb(0, 17, 18)';
const BRONZE = ['rgb(184, 138, 90)', 'rgb(165, 121, 77)'];

async function bronzeSurfaces(page: Page) {
  return page.evaluate((bronze) => {
    return [...document.querySelectorAll<HTMLElement>('body *')]
      .filter((el) => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && bronze.includes(getComputedStyle(el).backgroundColor);
      })
      .flatMap((surface) => {
        // 표면 자신과 그 안의 글자를 가진 모든 자손
        const textNodes = [surface, ...surface.querySelectorAll<HTMLElement>('*')].filter((el) =>
          [...el.childNodes].some((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim()),
        );
        return textNodes.map((el) => ({ text: el.textContent?.trim().slice(0, 40) ?? '', color: getComputedStyle(el).color }));
      });
  }, BRONZE);
}

for (const width of [375, 1440]) {
  test.describe(`bronze surfaces carry ink text @ ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });

    for (const { path } of SMOKE_PAGES) {
      test(path, async ({ page }) => {
        await page.goto(path);
        const surfaces = await bronzeSurfaces(page);

        // 헤더 견적 CTA 는 모든 페이지에 있다 — 0건이면 셀렉터가 깨진 것이다.
        expect(surfaces.length, 'at least the header quote CTA').toBeGreaterThan(0);
        for (const { text, color } of surfaces) {
          expect(color, `"${text}" on bronze`).toBe(INK);
        }
      });
    }
  });
}

test('the header quote CTA keeps ink text on hover', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  // 헤더가 <main> 안에 있어 브라우저는 banner 랜드마크로 노출하지 않는다 — 요소로 찾는다.
  const cta = page.locator('header').getByRole('link', { name: 'Get a Quote' });
  await cta.hover();
  await expect(cta).toHaveCSS('background-color', BRONZE[1]);
  await expect(cta).toHaveCSS('color', INK);
});
