import { expect, test } from '@playwright/test';
import { SMOKE_PAGES } from './pages';

// 레이아웃 이동 가드 (CLS < 0.1, Core Web Vitals "good").
// /quote 는 프로덕션에서 데스크톱 CLS 0.432 였다(impeccable audit 2026-10-31): 폼이
// useSearchParams 때문에 클라이언트에서만 렌더되어 Suspense fallback(null) 자리에 푸터가
// 먼저 그려졌다가 폼이 들어오며 아래로 밀려났다. dev 서버에서는 재현되지 않는다 —
// CI 의 build + start 에서만 의미가 있다.

const CLS_BUDGET = 0.1;

for (const width of [375, 1440]) {
  test.describe(`layout shift @ ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });

    for (const { path } of SMOKE_PAGES) {
      test(path, async ({ page }) => {
        await page.addInitScript(() => {
          const w = window as unknown as { __cls: number };
          w.__cls = 0;
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries() as Array<PerformanceEntry & { value: number; hadRecentInput: boolean }>) {
              if (!entry.hadRecentInput) w.__cls += entry.value;
            }
          }).observe({ type: 'layout-shift', buffered: true });
        });
        // Intercom 위젯은 비동기로 붙는 서드파티라 측정에서 뺀다
        await page.route(/intercom/, (route) => route.abort());
        await page.goto(path);
        await page.waitForLoadState('load');
        await page.waitForTimeout(1500);

        const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls);
        expect(cls, `CLS on ${path}`).toBeLessThan(CLS_BUDGET);
      });
    }
  });
}
