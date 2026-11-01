import { expect, test } from '@playwright/test';

// 견적 폼 placeholder 가 모바일 입력칸 안에 다 보이는지 (디자인 리뷰 F-003, 2026-10-27).
// "Factory / warehouse address, Pl" 처럼 단어 중간에서 잘렸다. placeholder 의 렌더 폭은
// 직접 잴 수 없으므로, 같은 글꼴 굵기로 값에 넣어 scrollWidth 를 잰다. 긴 형식 안내는
// placeholder 가 아니라 입력칸 아래 helper 줄에 둔다.
//
// 글꼴 폭에 좌우되는 측정이라 visual config(공식 playwright 이미지)에서만 돈다. CI e2e 잡은
// 러너에 직접 설치한 대체 글꼴(DejaVu 계열, 폭이 넓다)로 렌더해 실제 기기(SF·Roboto)와 다르다.

for (const width of [320, 375]) {
  test(`/quote @${width}: every single-line placeholder fits its field`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/quote');
    await page.locator('form input[placeholder]').first().waitFor();

    const clipped = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLInputElement>('form input[placeholder]')]
        .filter((input) => ['text', 'email', 'tel', ''].includes(input.getAttribute('type') ?? ''))
        .filter((input) => input.offsetParent !== null)
        .flatMap((input) => {
          const { value, style } = input;
          const weight = style.fontWeight;
          style.fontWeight = getComputedStyle(input, '::placeholder').fontWeight;
          input.value = input.placeholder;
          const over = input.scrollWidth - input.clientWidth;
          input.value = value;
          style.fontWeight = weight;
          return over > 0 ? [`${input.name}: "${input.placeholder}" over by ${over}px`] : [];
        }),
    );

    expect(clipped).toEqual([]);
  });
}
