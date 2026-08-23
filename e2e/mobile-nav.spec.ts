import { expect, test } from '@playwright/test';

// 모바일 헤더 내비 회귀 가드 (fix/mobile-header-nav):
// 1024px 미만에서 Primary nav 가 hidden 이라 MobileNav 아일랜드가 유일한 섹션 이동 수단이다.

test.describe('mobile header navigation', () => {
  test.use({ viewport: { width: 375, height: 812 } });

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

// 태블릿 구간(sm~lg, 640~1023px)은 헤더 Contact 가 이미 보이므로 메뉴가 채워야 할
// 공백은 섹션 4링크뿐이다. 메뉴에까지 Contact 를 넣으면 같은 CTA 가 두 번 노출된다.
test.describe('tablet header navigation', () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  test('offers section links in the menu without repeating the visible Contact CTA', async ({ page }) => {
    await page.goto('/');

    // 헤더 Contact 는 이 폭에서 보인다 (sm 이상)
    const headerContact = page.locator('header').getByRole('link', { name: 'Contact sales' });
    await expect(headerContact).toBeVisible();

    await page.getByRole('button', { name: 'Menu' }).click();
    const menu = page.getByRole('navigation', { name: 'Mobile navigation' });
    await expect(menu).toBeVisible();

    // 섹션 링크는 메뉴에만 있다 (Primary nav 는 lg 미만에서 숨김)
    await expect(menu.getByRole('link', { name: 'Services' })).toBeVisible();
    // Contact 는 헤더에 이미 있으므로 메뉴에서는 보이지 않아야 한다
    await expect(menu.getByRole('link', { name: 'Contact sales' })).toBeHidden();
    // 페이지 전체에서 Contact sales 링크는 정확히 한 번만 보인다
    await expect(page.getByRole('link', { name: 'Contact sales' })).toHaveCount(1);
  });
});
