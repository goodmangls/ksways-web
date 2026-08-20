import { expect, test } from '@playwright/test';

// 모바일 헤더 내비 회귀 가드 (fix/mobile-header-nav):
// 1024px 미만에서 Primary nav 가 hidden 이라 MobileNav 아일랜드가 유일한 섹션 이동 수단이다.
test.use({ viewport: { width: 375, height: 812 } });

test.describe('mobile header navigation', () => {
  test('shows the menu toggle, keeps the header inside the viewport, and navigates sections', async ({ page }) => {
    await page.goto('/');

    // 햄버거 44px 추가로 헤더가 375px 를 넘치면 안 된다
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, 'no horizontal overflow at 375px').toBe(0);

    const toggle = page.getByRole('button', { name: 'Menu' });
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    // 데스크톱 Primary nav 는 이 뷰포트에서 숨겨져 있어야 한다 (중복 노출 방지)
    await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeHidden();

    await toggle.click();
    const menu = page.getByRole('navigation', { name: 'Mobile navigation' });
    await expect(menu).toBeVisible();
    for (const [name, href] of [
      ['Company', '#company'],
      ['Services', '#services'],
      ['Network', '#network'],
      ['Solutions', '#solutions'],
      ['Contact sales', '#contact'],
    ] as const) {
      await expect(menu.getByRole('link', { name }), `${name} link`).toHaveAttribute('href', href);
    }

    // 링크 선택 시 메뉴가 닫히고 해당 섹션으로 이동한다
    await menu.getByRole('link', { name: 'Services' }).click();
    await expect(menu).toBeHidden();
    await expect(page).toHaveURL(/#services$/);
  });
});
