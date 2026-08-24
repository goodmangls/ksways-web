import { expect, test, type Page } from '@playwright/test';

// 시각 회귀 — 레이아웃 붕괴(오버플로·겹침·그리드 파손)를 픽셀로 잡는다.
// ⚠️ 이 스펙은 필수 게이트(e2e 잡)에 들어가지 않는다. 픽셀 기준선은 가장 flaky 한
// 테스트 부류이고, 이 저장소는 retries 0 + 병행 작업자라 안티에일리어싱 한 번 밀리면
// 남의 머지까지 막는다. 별도 visual 잡에서 실험 → 3연속 PASS → 승격 절차를 밟는다.
//
// 결정론 확보 3종:
//  1. reducedMotion — globals.css 가 이를 존중해 히어로 회전 애니메이션을 0.01ms 로 끝낸다
//  2. Unsplash 라우팅 — 원격 히어로 이미지는 CDN 바이트·로딩 상태가 매번 달라지므로
//     고정 색 PNG 로 갈아끼운다. 외형 검증이 아니라 "변했는지" 검출이 목적이라 무해하다
//  3. Intercom 차단 — 위젯이 비동기로 떠서 하단을 가린다

const BREAKPOINTS = [320, 768, 1024, 1440] as const;

const TARGETS: ReadonlyArray<{ path: string; name: string }> = [
  { path: '/', name: 'home-en' },
  { path: '/kr', name: 'home-kr' },
  { path: '/quote', name: 'quote' },
  { path: '/services/air-freight-korea', name: 'service-air' },
];

// 1x1 회색 PNG. 히어로 이미지 자리를 결정론적으로 채운다.
const STUB_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64',
);

async function stabilize(page: Page) {
  // globals.css 가 prefers-reduced-motion 을 존중해 히어로 회전을 0.01ms 로 끝낸다 —
  // 사이트 자체 메커니즘을 쓰는 편이 강제 정지보다 실제 렌더에 가깝다.
  // (이 버전은 config use 가 아니라 emulateMedia 로 제공한다.)
  await page.emulateMedia({ reducedMotion: 'reduce' });
  // 원격 히어로 이미지 → 고정 바이트
  await page.route('**://images.unsplash.com/**', (route) =>
    route.fulfill({ status: 200, contentType: 'image/png', body: STUB_PNG }),
  );
  // Intercom 위젯 — 비동기 삽입이라 스크린샷 타이밍을 흔든다
  await page.route(/intercom(cdn|assets)?\.(io|com)/, (route) => route.abort());
  await page.route('**://widget.intercom.io/**', (route) => route.abort());
}

test.describe('visual regression', () => {
  for (const { path, name } of TARGETS) {
    for (const width of BREAKPOINTS) {
      test(`${name} @ ${width}px`, async ({ page }) => {
        await stabilize(page);
        await page.setViewportSize({ width, height: 900 });
        await page.goto(path);
        await page.waitForLoadState('load');
        // 하이드레이션·지연 이미지 안착 (networkidle 은 Intercom ws 때문에 못 씀)
        await page.waitForTimeout(1_000);

        await expect(page).toHaveScreenshot(`${name}-${width}.png`, {
          fullPage: true,
          animations: 'disabled',
          // 비율(maxDiffPixelRatio) 대신 절대 픽셀 수를 쓴다. 이 페이지들은 매우 길어서
          // 1% 만 해도 수십만 픽셀이 열린다 — 실제 회귀가 그 안에 묻힐 수 있다.
          // 기준선을 CI 와 같은 Docker 이미지에서 만들므로 렌더는 결정론적이고
          // (동일 실행 2회 검증), 좁게 잡아도 flake 가 나지 않는다.
          maxDiffPixels: 100,
        });
      });
    }
  }
});
