import { expect, test, type Page } from '@playwright/test';

const CONTACT_EMAIL = 'info@ksways.co';

const REQUIRED_FIELDS: Array<{ label: RegExp; value: string }> = [
  { label: /^Company name/, value: 'Acme Trading' },
  { label: /^Contact person/, value: 'Jane Lee' },
  { label: /^Email \/ phone/, value: 'jane@acme.test' },
  { label: /^Origin city/, value: 'Busan, KRPUS' },
  { label: /^Destination city/, value: 'Los Angeles, USLAX' },
  { label: /^Commodity/, value: 'Cosmetics' },
];

// /quote 폼은 useSearchParams CSR bailout 이라 hydration 후에야 DOM 에 생긴다 —
// 셀렉터 auto-wait 가 이를 흡수하지만, 첫 필드 대기를 명시해 의도를 드러낸다.
async function fillRequiredFields(page: Page) {
  for (const { label, value } of REQUIRED_FIELDS) {
    await page.getByLabel(label).fill(value);
  }
}

async function openEmailOptions(page: Page) {
  await page.getByRole('complementary').getByRole('button', { name: /Choose email app/i }).click();
  return page.getByRole('dialog', { name: /Choose where to open the draft/i });
}

function getUrlParam(href: string, key: string): string | null {
  return new URL(href).searchParams.get(key);
}

test.describe('quote email handoff flow', () => {
  test.beforeEach(async ({ page }) => {
    // mailto 네비게이션 포착 (grill 합의 Q5-B): headless 는 외부 프로토콜을
    // OS 로 넘기지 못하므로, "브라우저가 mailto 처리를 허용받았는가"를
    // 문서 레벨 bubble 리스너로 포착한다 — React 핸들러가 preventDefault 를
    // 불렀다면 defaultPrevented 가 true 로 잡혀 실패한다.
    await page.addInitScript(() => {
      const attempts: Array<{ href: string; defaultPrevented: boolean }> = [];
      (window as unknown as { __mailtoAttempts: typeof attempts }).__mailtoAttempts = attempts;
      document.addEventListener('click', (event) => {
        const target = event.target as Element | null;
        const anchor = target?.closest?.('a[href^="mailto:"]');
        if (anchor) {
          attempts.push({ href: (anchor as HTMLAnchorElement).href, defaultPrevented: event.defaultPrevented });
        }
      });
    });
    await page.goto('/quote');
  });

  test('opens the email options dialog with a complete draft in all three links', async ({ page }) => {
    await fillRequiredFields(page);
    const dialog = await openEmailOptions(page);

    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(`To: ${CONTACT_EMAIL}`)).toBeVisible();

    const mailtoHref = (await dialog.getByRole('link', { name: /Default email app/i }).getAttribute('href')) ?? '';
    expect(mailtoHref.startsWith(`mailto:${CONTACT_EMAIL}?subject=`)).toBe(true);

    const subject = getUrlParam(mailtoHref, 'subject');
    const body = getUrlParam(mailtoHref, 'body');
    expect(subject).toBe('KS WAYS website quote request — Acme Trading');
    expect(body).toContain('Dear KS WAYS team,');
    for (const { value } of REQUIRED_FIELDS) {
      expect(body, `mailto body should carry "${value}"`).toContain(value);
    }

    const gmailHref = (await dialog.getByRole('link', { name: 'Gmail' }).getAttribute('href')) ?? '';
    expect(getUrlParam(gmailHref, 'to')).toBe(CONTACT_EMAIL);
    expect(getUrlParam(gmailHref, 'su')).toBe(subject);
    expect(getUrlParam(gmailHref, 'body')).toBe(body);

    const outlookHref = (await dialog.getByRole('link', { name: /Outlook Web/i }).getAttribute('href')) ?? '';
    expect(getUrlParam(outlookHref, 'to')).toBe(CONTACT_EMAIL);
    expect(getUrlParam(outlookHref, 'subject')).toBe(subject);
    expect(getUrlParam(outlookHref, 'body')).toBe(body);
  });

  test('lets the browser handle the default email app link as a mailto navigation', async ({ page }) => {
    await fillRequiredFields(page);
    const dialog = await openEmailOptions(page);

    await dialog.getByRole('link', { name: /Default email app/i }).click();

    const attempts = await page.evaluate(
      () => (window as unknown as { __mailtoAttempts: Array<{ href: string; defaultPrevented: boolean }> }).__mailtoAttempts,
    );
    expect(attempts).toHaveLength(1);
    expect(attempts[0].href.startsWith(`mailto:${CONTACT_EMAIL}?`)).toBe(true);
    expect(attempts[0].defaultPrevented, 'mailto default action must not be prevented').toBe(false);
  });

  test('copies the real request summary to the system clipboard', async ({ page }) => {
    await fillRequiredFields(page);
    const dialog = await openEmailOptions(page);

    await dialog.getByRole('button', { name: /Copy request summary/i }).click();
    await expect(dialog.getByText('Request summary copied.')).toBeVisible();

    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toContain('Dear KS WAYS team,');
    expect(clipboardText).toContain('Acme Trading');
    expect(clipboardText).toContain('Busan, KRPUS');
  });

  test('closes with Escape and with a backdrop press, keeping inner presses open', async ({ page }) => {
    await fillRequiredFields(page);
    let dialog = await openEmailOptions(page);

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();

    dialog = await openEmailOptions(page);
    // 내부 press 는 닫히지 않는다
    await dialog.getByText(`To: ${CONTACT_EMAIL}`).click();
    await expect(dialog).toBeVisible();
    // 백드롭(다이얼로그 부모, fixed inset-0) 좌상단 press 는 닫는다
    await dialog.locator('..').click({ position: { x: 8, y: 8 } });
    await expect(dialog).toBeHidden();
  });

  test('blocks the dialog and lists missing fields when required fields are empty', async ({ page }) => {
    await page.getByRole('complementary').getByRole('button', { name: /Choose email app/i }).click();

    // page 전역 role=alert 는 Next 라우트 어나운서와 strict 충돌 — aside 로 스코프
    await expect(page.getByRole('complementary').getByRole('alert')).toContainText('Company name');
    await expect(page.getByRole('dialog')).toBeHidden();
  });
});
