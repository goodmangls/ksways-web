import { describe, expect, it } from 'vitest';
import { createFixedWindowRateLimiter } from './rate-limit';

const WINDOW_MS = 60_000;

function makeLimiter(maxRequests = 3) {
  return createFixedWindowRateLimiter({ windowMs: WINDOW_MS, maxRequests });
}

describe('createFixedWindowRateLimiter', () => {
  it('allows requests up to the window maximum', () => {
    const limiter = makeLimiter(3);
    const now = 1_000_000;

    expect(limiter.check('1.2.3.4', now).allowed).toBe(true);
    expect(limiter.check('1.2.3.4', now + 10).allowed).toBe(true);
    expect(limiter.check('1.2.3.4', now + 20).allowed).toBe(true);
  });

  it('rejects the request over the maximum and reports the remaining wait', () => {
    const limiter = makeLimiter(2);
    const windowStart = 1_000_000;

    limiter.check('1.2.3.4', windowStart);
    limiter.check('1.2.3.4', windowStart + 1_000);
    const rejected = limiter.check('1.2.3.4', windowStart + 30_000);

    expect(rejected.allowed).toBe(false);
    // 윈도우 시작 후 30초 경과 → 30초 남음
    expect(rejected.retryAfterSeconds).toBe(30);
  });

  it('resets the counter when the window has elapsed', () => {
    const limiter = makeLimiter(1);
    const now = 1_000_000;

    expect(limiter.check('1.2.3.4', now).allowed).toBe(true);
    expect(limiter.check('1.2.3.4', now + 1).allowed).toBe(false);
    expect(limiter.check('1.2.3.4', now + WINDOW_MS).allowed).toBe(true);
  });

  it('tracks each key independently', () => {
    const limiter = makeLimiter(1);
    const now = 1_000_000;

    expect(limiter.check('1.2.3.4', now).allowed).toBe(true);
    expect(limiter.check('5.6.7.8', now).allowed).toBe(true);
    expect(limiter.check('1.2.3.4', now + 1).allowed).toBe(false);
    expect(limiter.check('5.6.7.8', now + 1).allowed).toBe(false);
  });

  it('sweeps expired entries so the key store does not grow unbounded', () => {
    const limiter = makeLimiter(1);
    const now = 1_000_000;

    for (let i = 0; i < 50; i += 1) {
      limiter.check(`ip-${i}`, now);
    }
    expect(limiter.size()).toBe(50);

    // 윈도우가 지난 뒤 새 키가 들어오면 만료 엔트리는 정리된다
    limiter.check('fresh-key', now + WINDOW_MS * 2);
    expect(limiter.size()).toBe(1);
  });

  it('reports a positive retry-after even at the window boundary edge', () => {
    const limiter = makeLimiter(1);
    const windowStart = 1_000_000;

    limiter.check('1.2.3.4', windowStart);
    const rejected = limiter.check('1.2.3.4', windowStart + WINDOW_MS - 1);

    expect(rejected.allowed).toBe(false);
    expect(rejected.retryAfterSeconds).toBeGreaterThanOrEqual(1);
  });
});
