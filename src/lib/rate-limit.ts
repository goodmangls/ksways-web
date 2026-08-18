type RateLimitOptions = {
  windowMs: number;
  maxRequests: number;
};

export type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

export type FixedWindowRateLimiter = {
  check: (key: string, now?: number) => RateLimitResult;
  size: () => number;
};

// 인메모리 고정 윈도우 리미터. 서버리스에선 인스턴스별 카운터라 완전한 방어는 아니지만,
// 단일 클라이언트가 Unsplash 시간당 쿼터(50)를 소진시키는 것을 막는 용도로 충분하다.
export function createFixedWindowRateLimiter({ windowMs, maxRequests }: RateLimitOptions): FixedWindowRateLimiter {
  const windows = new Map<string, { count: number; windowStart: number }>();

  function sweepExpired(now: number) {
    for (const [key, entry] of windows) {
      if (now - entry.windowStart >= windowMs) {
        windows.delete(key);
      }
    }
  }

  function check(key: string, now: number = Date.now()): RateLimitResult {
    sweepExpired(now);

    const entry = windows.get(key);

    if (!entry) {
      windows.set(key, { count: 1, windowStart: now });
      return { allowed: true, retryAfterSeconds: 0 };
    }

    if (entry.count < maxRequests) {
      windows.set(key, { ...entry, count: entry.count + 1 });
      return { allowed: true, retryAfterSeconds: 0 };
    }

    const retryAfterSeconds = Math.max(1, Math.ceil((entry.windowStart + windowMs - now) / 1000));
    return { allowed: false, retryAfterSeconds };
  }

  return { check, size: () => windows.size };
}
