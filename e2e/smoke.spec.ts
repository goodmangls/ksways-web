import { expect, test } from '@playwright/test';
import { SMOKE_PAGES } from './pages';

// 전 페이지 스모크 (2026-08-18 grill 합의 범위):
// 로드 성공 + SSR lang + h1/landmark 존재 + 콘솔 에러 0.
// lang 검증은 SSG 복원(PR #31) 회귀 가드 — 과거 proxy 헤더 방식이 깨질 때
// 이 계열이 조용히 무너졌다.
for (const { path, lang } of SMOKE_PAGES) {
  test(`${path} renders with lang="${lang}", a heading, and no console errors`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });

    const response = await page.goto(path);

    expect(response?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('main')).toBeVisible();

    // 늦게 도착하는 에러(하이드레이션·지연 로드)까지 수집한다.
    // networkidle 은 Intercom 웹소켓 상시 연결 때문에 영원히 오지 않는다 — 유한 settle 로 대체.
    await page.waitForTimeout(1_000);
    expect(consoleErrors, `console errors on ${path}`).toEqual([]);
  });
}
