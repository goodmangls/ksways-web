import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

// 시각 회귀 전용 config — 기본 config(필수 e2e 게이트)와 분리해 둔다.
// 기준선 PNG 는 렌더러가 OS 마다 달라 플랫폼별로 저장된다. CI 는 Linux 이므로
// 기준선도 Linux 에서 만들어야 한다: `npm run test:visual:update:docker`
// (playwright 공식 이미지 = CI 와 같은 렌더링 스택).
export default defineConfig({
  testDir: './e2e',
  testMatch: /visual\.spec\.ts/,
  timeout: 60_000,
  retries: 0,
  reporter: isCI ? [['list'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: isCI ? 'npm run build && npm run start' : 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !isCI,
    timeout: 180_000,
  },
});
