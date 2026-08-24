import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

// E2E 실행 환경 이원화 (2026-08-18 grill 합의):
// - CI(Linux): next build + start — 프로덕션 근사 hermetic 검증
// - 로컬(darwin): next dev — darwin 은 프리렌더 프레임워크 버그로 build 불가
// retries 0 은 승격(2026-08-19) 시점의 결정값: 실험 3회 무flake 라 재시도 없이
// 시작한다. 재시도는 flake 를 가리므로, 실제 flake 가 관측될 때 재검토한다.
export default defineConfig({
  testDir: './e2e',
  // prod-smoke 는 실제 배포본을 치는 카나리라 hermetic 게이트에서 제외한다
  // (playwright.prod.config.ts 로만 실행).
  testIgnore: /prod-smoke\.spec\.ts/,
  timeout: 30_000,
  retries: 0,
  reporter: isCI ? [['list'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  // permissions 는 프로젝트별로 둔다 — WebKit 은 clipboard-read/write 를 모르는
  // 권한으로 취급해 컨텍스트 생성 자체가 실패한다(공용 use 블록에 두면 전 스펙이 죽는다).
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        permissions: ['clipboard-read', 'clipboard-write'],
      },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: isCI ? 'npm run build && npm run start' : 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !isCI,
    timeout: 180_000,
  },
});
