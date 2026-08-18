import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

// E2E 실행 환경 이원화 (2026-08-18 grill 합의):
// - CI(Linux): next build + start — 프로덕션 근사 hermetic 검증
// - 로컬(darwin): next dev — darwin 은 프리렌더 프레임워크 버그로 build 불가
// retries 0 은 의도된 값: 실험 잡 기간엔 flake 실태를 재시도로 가리지 않는다.
// 승격(3연속 PASS) 시점에 retry 정책을 별도 결정한다.
export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  retries: 0,
  reporter: isCI ? [['list'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        permissions: ['clipboard-read', 'clipboard-write'],
      },
    },
  ],
  webServer: {
    command: isCI ? 'npm run build && npm run start' : 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !isCI,
    timeout: 180_000,
  },
});
