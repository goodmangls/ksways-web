import { expect, test } from '@playwright/test';
import { SMOKE_PAGES } from './pages';

// 본문 건너뛰기 링크 (WCAG 2.4.1 Bypass Blocks, impeccable audit 2026-10-31).
// 헤더에는 로고·내비 4개·언어·상담·견적까지 탭 정지가 8개 있다 — 매 페이지 첫 탭은
// 그것들을 건너뛸 수 있어야 한다. 숨김 상태에서 포커스를 받으면 보여야 하고,
// 누르면 다음 탭이 본문(#content) 안에서 시작해야 한다.

for (const { path, lang } of SMOKE_PAGES) {
  test(`${path}: the first tab stop skips the header`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(path);

    const skip = page.getByRole('link', { name: lang === 'ko-KR' ? '본문으로 건너뛰기' : 'Skip to content' });
    // 포커스 전에는 sr-only — 1px 클립
    expect((await skip.boundingBox())?.width ?? 0).toBeLessThanOrEqual(1);

    await page.keyboard.press('Tab');
    await expect(skip).toBeFocused();
    const box = await skip.boundingBox();
    expect(box?.height ?? 0, 'visible and 44px tall once focused').toBeGreaterThanOrEqual(44);
    await expect(skip).toHaveCSS('color', 'rgb(0, 17, 18)');

    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#content$/);
    await page.keyboard.press('Tab');
    // 다음 탭은 #content 이후에서 시작한다 — /quote 처럼 히어로에 컨트롤이 없으면 그 아래 폼으로 간다.
    const where = await page.evaluate(() => {
      const active = document.activeElement;
      const content = document.getElementById('content');
      return {
        inHeader: !!active?.closest('header'),
        afterContentStart: !!content && !!active && !!(content.compareDocumentPosition(active) & (Node.DOCUMENT_POSITION_FOLLOWING | Node.DOCUMENT_POSITION_CONTAINED_BY)),
      };
    });
    expect(where.inHeader, 'focus left the header').toBe(false);
    expect(where.afterContentStart, 'focus resumes at or after #content').toBe(true);
  });
}
