import { expect, test } from '@playwright/test';
import { SMOKE_PAGES } from './pages';

// 프로덕션 카나리 — 로컬 hermetic 게이트가 잡을 수 없는 것만 노린다:
// 배포 누락, CDN/호스팅 장애, 런타임 환경변수 결손, 서드파티(Intercom·Unsplash) 회귀.
//
// ⚠️ 상태코드만 보는 헬스체크는 이 부류를 못 잡는다. ASCA 는 전 페이지가 200 을
// 반환하면서 본문이 "Application error" 였다(2026-08-06). 그래서 여기서도 로컬과
// 같은 단언(lang·h1·main·콘솔 에러 0)을 쓴다 — 렌더가 실제로 됐는지를 본다.
//
// 이 스펙은 playwright.prod.config.ts 로만 실행된다(기본 config 는 testIgnore).
for (const { path, lang } of SMOKE_PAGES) {
  test(`production ${path} serves a rendered page with lang="${lang}"`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });

    const response = await page.goto(path);

    expect(response?.status(), `${path} HTTP status`).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('main')).toBeVisible();
    // Next.js 런타임 오류 화면은 200 으로 나온다 — 본문으로 판별한다.
    await expect(page.getByText('Application error')).toHaveCount(0);

    await page.waitForTimeout(1_000);
    expect(consoleErrors, `console errors on production ${path}`).toEqual([]);
  });
}

test('production quote form hydrates and can open the email handoff dialog', async ({ page }) => {
  // 사이트의 유일한 전환 경로. /quote 는 useSearchParams CSR bailout 이라
  // 하이드레이션이 실패하면 폼이 영영 나타나지 않는다 — 정적 셸만으로는 알 수 없다.
  await page.goto('/quote');

  await page.getByLabel(/^Company name/).fill('Canary Co');
  await page.getByLabel(/^Contact person/).fill('Canary');
  await page.getByLabel(/^Email \/ phone/).fill('canary@example.test');
  await page.getByLabel(/^Origin city/).fill('Busan');
  await page.getByLabel(/^Destination city/).fill('Los Angeles');
  await page.getByLabel(/^Commodity/).fill('Samples');

  await page.getByRole('complementary').getByRole('button', { name: /Choose email app/i }).click();

  const dialog = page.getByRole('dialog', { name: /Choose where to open the draft/i });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('link', { name: /Default email app/i })).toHaveAttribute(
    'href',
    /^mailto:info@ksways\.co\?subject=/,
  );
});
