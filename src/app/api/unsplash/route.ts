import { NextResponse } from 'next/server';
import { createFixedWindowRateLimiter } from '@/lib/rate-limit';
import {
  getApprovedUnsplashImages,
  searchUnsplashImages,
  UNSPLASH_APP_NAME,
  UNSPLASH_LIVE_MODE_MAX_REQUESTS,
} from '@/lib/unsplash';

const VALID_MODES = ['approved', 'live'] as const;

// live 모드만 리미팅한다 — approved 는 정적 데이터라 비용이 없고 CDN 캐시를 탄다.
// 상수를 route 밖(lib)에 두는 이유: Next 는 route 파일의 임의 export 를 빌드에서 거부한다.
const liveModeLimiter = createFixedWindowRateLimiter({ windowMs: 60_000, maxRequests: UNSPLASH_LIVE_MODE_MAX_REQUESTS });

function getClientKey(request: Request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get('topic') || 'global';
  const mode = searchParams.get('mode') || 'approved';

  if (!VALID_MODES.includes(mode as (typeof VALID_MODES)[number])) {
    return NextResponse.json(
      { error: `Invalid mode parameter. Use one of: ${VALID_MODES.join(', ')}.` },
      { status: 400 },
    );
  }

  if (mode === 'live') {
    const { allowed, retryAfterSeconds } = liveModeLimiter.check(getClientKey(request));

    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many live search requests. Please retry shortly.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfterSeconds),
            'Cache-Control': 'no-store',
          },
        },
      );
    }

    const result = await searchUnsplashImages({
      topic,
      accessKey: process.env.UNSPLASH_ACCESS_KEY,
      appName: process.env.UNSPLASH_APP_NAME || UNSPLASH_APP_NAME,
    });

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 's-maxage=86400, stale-while-revalidate=604800',
      },
    });
  }

  return NextResponse.json(
    {
      images: getApprovedUnsplashImages(topic),
      fallback: false,
      mode: 'approved',
    },
    {
      headers: {
        'Cache-Control': 's-maxage=86400, stale-while-revalidate=604800',
      },
    },
  );
}
