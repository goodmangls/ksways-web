import { NextResponse } from 'next/server';
import { getApprovedUnsplashImages, searchUnsplashImages, UNSPLASH_APP_NAME } from '@/lib/unsplash';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get('topic') || 'global';
  const mode = searchParams.get('mode') || 'approved';

  if (mode === 'live') {
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
