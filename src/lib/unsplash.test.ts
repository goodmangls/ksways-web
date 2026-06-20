import { describe, expect, it, vi } from 'vitest';
import {
  ALLOWED_UNSPLASH_TOPICS,
  getApprovedUnsplashImages,
  normalizeUnsplashPhoto,
  searchUnsplashImages,
  type UnsplashSearchResponse,
} from './unsplash';

describe('Unsplash brand image pool policy', () => {
  it('uses a fixed logistics topic whitelist instead of arbitrary query passthrough', () => {
    expect(Object.keys(ALLOWED_UNSPLASH_TOPICS)).toEqual(['ocean', 'air', 'warehouse', 'global', 'specialCargo']);
    expect(ALLOWED_UNSPLASH_TOPICS.ocean).toContain('ocean freight');
    expect(ALLOWED_UNSPLASH_TOPICS.air).toContain('air cargo');
    expect(Object.values(ALLOWED_UNSPLASH_TOPICS).join(' ')).not.toMatch(/English default|language barrier|Western/i);
  });

  it('ships a curated approved image pool with attribution and download-location metadata', () => {
    const pool = getApprovedUnsplashImages();

    expect(getApprovedUnsplashImages('not-allowed').map((image) => image.topic)).toEqual(['global', 'global']);
    expect(pool.length).toBeGreaterThanOrEqual(10);
    expect(pool.map((image) => image.topic)).toContain('ocean');
    expect(pool.map((image) => image.topic)).toContain('air');
    expect(pool.map((image) => image.topic)).toContain('warehouse');

    for (const image of pool) {
      expect(image.id).toMatch(/^[a-zA-Z0-9_-]+$/);
      expect(image.src).toContain('images.unsplash.com');
      expect(image.photographer).toBeTruthy();
      expect(image.photographerUrl).toContain('utm_source=ksways');
      expect(image.unsplashUrl).toContain('utm_source=ksways');
      expect(image.downloadLocation).toContain('api.unsplash.com/photos/');
      expect(image.alt.toLowerCase()).not.toContain('logo');
      expect(image.brandUse).not.toBe('hero-auto');
    }
  });

  it('normalizes Unsplash API responses without leaking keys to the client payload', () => {
    const normalized = normalizeUnsplashPhoto(
      {
        id: 'abc123',
        alt_description: 'Container ship at a clean port terminal',
        description: null,
        urls: {
          regular: 'https://images.unsplash.com/photo-abc?auto=format&fit=crop&w=1080&q=80',
          small: 'https://images.unsplash.com/photo-abc?auto=format&fit=crop&w=640&q=80',
        },
        width: 3000,
        height: 2000,
        color: '#0b2239',
        blur_hash: 'LKO2?U%2Tw=w]~RBVZRi};RPxuwH',
        links: {
          html: 'https://unsplash.com/photos/abc123',
          download_location: 'https://api.unsplash.com/photos/abc123/download',
        },
        user: {
          name: 'Sample Photographer',
          links: { html: 'https://unsplash.com/@sample' },
        },
      },
      'ksways',
    );

    expect(normalized).toEqual({
      id: 'abc123',
      alt: 'Container ship at a clean port terminal',
      src: 'https://images.unsplash.com/photo-abc?auto=format&fit=crop&w=1080&q=80',
      smallSrc: 'https://images.unsplash.com/photo-abc?auto=format&fit=crop&w=640&q=80',
      width: 3000,
      height: 2000,
      color: '#0b2239',
      blurHash: 'LKO2?U%2Tw=w]~RBVZRi};RPxuwH',
      photographer: 'Sample Photographer',
      photographerUrl: 'https://unsplash.com/@sample?utm_source=ksways&utm_medium=referral',
      unsplashUrl: 'https://unsplash.com/photos/abc123?utm_source=ksways&utm_medium=referral',
      downloadLocation: 'https://api.unsplash.com/photos/abc123/download',
    });
  });

  it('calls Unsplash server-side with Client-ID auth, revalidation, and graceful fallback', async () => {
    const response: UnsplashSearchResponse = {
      results: [
        {
          id: 'def456',
          alt_description: null,
          description: 'Air cargo aircraft near freight pallets',
          urls: {
            regular: 'https://images.unsplash.com/photo-def?auto=format&fit=crop&w=1080&q=80',
            small: 'https://images.unsplash.com/photo-def?auto=format&fit=crop&w=640&q=80',
          },
          width: 2400,
          height: 1600,
          color: '#123456',
          blur_hash: null,
          links: {
            html: 'https://unsplash.com/photos/def456',
            download_location: 'https://api.unsplash.com/photos/def456/download',
          },
          user: {
            name: 'Air Photographer',
            links: { html: 'https://unsplash.com/@air' },
          },
        },
      ],
    };
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => response });

    const result = await searchUnsplashImages({
      topic: 'air',
      accessKey: 'test-access-key',
      appName: 'ksways',
      fetcher: fetchMock,
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('query=air+cargo+freight+aircraft+logistics');
    expect(String(url)).toContain('orientation=landscape');
    expect(init.headers.Authorization).toBe('Client-ID test-access-key');
    expect(init.next.revalidate).toBe(86400);
    expect(result.fallback).toBe(false);
    expect(result.images[0].photographer).toBe('Air Photographer');

    const failed = await searchUnsplashImages({
      topic: 'not-allowed',
      accessKey: undefined,
      appName: 'ksways',
      fetcher: fetchMock,
    });

    expect(failed).toEqual({ images: [], fallback: true, reason: 'missing_access_key' });
  });
});
