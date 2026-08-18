import { beforeEach, describe, expect, it, vi } from 'vitest';

// route 모듈은 라이브 모드 리미터를 모듈 레벨에 들고 있다 — 테스트 간 카운터가
// 새어 나가지 않도록 매 테스트마다 모듈을 새로 로드한다.
async function loadRoute() {
  vi.resetModules();
  const [route, { UNSPLASH_LIVE_MODE_MAX_REQUESTS }] = await Promise.all([import('./route'), import('@/lib/unsplash')]);
  return { ...route, LIVE_MODE_MAX_REQUESTS: UNSPLASH_LIVE_MODE_MAX_REQUESTS };
}

function makeRequest(query: string, ip?: string) {
  return new Request(`https://ksways.co/api/unsplash${query}`, {
    headers: ip ? { 'x-forwarded-for': ip } : undefined,
  });
}

describe('/api/unsplash route', () => {
  beforeEach(() => {
    delete process.env.UNSPLASH_ACCESS_KEY;
  });

  it('rejects unknown mode values with 400 instead of silently falling back', async () => {
    const { GET } = await loadRoute();

    const response = await GET(makeRequest('?mode=invalid'));

    expect(response.status).toBe(400);
    const payload = await response.json();
    expect(payload.error).toContain('mode');
  });

  it('serves approved images for the default and explicit approved modes', async () => {
    const { GET } = await loadRoute();

    for (const query of ['', '?mode=approved', '?topic=ocean']) {
      const response = await GET(makeRequest(query));
      expect(response.status).toBe(200);
      const payload = await response.json();
      expect(payload.mode).toBe('approved');
      expect(Array.isArray(payload.images)).toBe(true);
      expect(payload.images.length).toBeGreaterThan(0);
    }
  });

  it('rate-limits live-mode requests per client and answers 429 with Retry-After', async () => {
    const { GET, LIVE_MODE_MAX_REQUESTS } = await loadRoute();

    for (let i = 0; i < LIVE_MODE_MAX_REQUESTS; i += 1) {
      const allowed = await GET(makeRequest('?mode=live', '203.0.113.7'));
      expect(allowed.status, `request ${i + 1} within the window should pass`).toBe(200);
    }

    const rejected = await GET(makeRequest('?mode=live', '203.0.113.7'));
    expect(rejected.status).toBe(429);
    expect(Number(rejected.headers.get('Retry-After'))).toBeGreaterThan(0);
    expect(rejected.headers.get('Cache-Control')).toBe('no-store');
  });

  it('keeps live-mode rate limits independent across clients', async () => {
    const { GET, LIVE_MODE_MAX_REQUESTS } = await loadRoute();

    for (let i = 0; i < LIVE_MODE_MAX_REQUESTS; i += 1) {
      await GET(makeRequest('?mode=live', '203.0.113.7'));
    }
    expect((await GET(makeRequest('?mode=live', '203.0.113.7'))).status).toBe(429);

    const otherClient = await GET(makeRequest('?mode=live', '198.51.100.9'));
    expect(otherClient.status).toBe(200);
  });

  it('does not rate-limit approved mode', async () => {
    const { GET, LIVE_MODE_MAX_REQUESTS } = await loadRoute();

    for (let i = 0; i < LIVE_MODE_MAX_REQUESTS + 5; i += 1) {
      const response = await GET(makeRequest('?mode=approved', '203.0.113.7'));
      expect(response.status).toBe(200);
    }
  });
});
