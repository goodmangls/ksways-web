import { defineConfig, devices } from '@playwright/test';

// 프로덕션 카나리 전용 config. 기본 config 와 다른 점:
// - webServer 없음: 실제 배포본(ksways.co)을 그대로 친다
// - retries 2: 게이트가 아니라 관측이다. 여기서의 flake 는 코드가 아니라
//   공용 인터넷·CDN·서드파티 변동이므로, 재시도로 걸러야 신호가 남는다
//   (hermetic e2e 의 retries 0 결정과 목적이 반대라 값도 반대다)
const baseURL = process.env.PROD_SMOKE_BASE_URL || 'https://ksways.co';

export default defineConfig({
  testDir: './e2e',
  testMatch: /prod-smoke\.spec\.ts/,
  timeout: 45_000,
  retries: 2,
  reporter: [['list']],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
