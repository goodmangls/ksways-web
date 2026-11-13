import { describe, expect, it } from 'vitest';
import { ALLOWED_UNSPLASH_TOPICS, getHeroUnsplashImages, normalizeUnsplashPhoto, type UnsplashApiPhoto } from './unsplash';

function makePhoto(overrides: Partial<Pick<UnsplashApiPhoto, 'alt_description' | 'description'>>): UnsplashApiPhoto {
  return {
    id: 'fallback-check',
    alt_description: null,
    description: null,
    ...overrides,
    urls: {
      regular: 'https://images.unsplash.com/photo-fallback?auto=format&fit=crop&w=1080&q=80',
      small: 'https://images.unsplash.com/photo-fallback?auto=format&fit=crop&w=640&q=80',
    },
    width: 1200,
    height: 800,
    color: '#123456',
    blur_hash: null,
    links: {
      html: 'https://unsplash.com/photos/fallback-check',
      download_location: 'https://api.unsplash.com/photos/fallback-check/download',
    },
    user: {
      name: 'Fallback Photographer',
      links: { html: 'https://unsplash.com/@fallback' },
    },
  };
}

describe('Unsplash brand image pool policy', () => {
  it('uses a fixed logistics topic whitelist instead of arbitrary query passthrough', () => {
    expect(Object.keys(ALLOWED_UNSPLASH_TOPICS)).toEqual(['ocean', 'air', 'warehouse', 'global', 'specialCargo']);
    expect(ALLOWED_UNSPLASH_TOPICS.ocean).toContain('ocean freight');
    expect(ALLOWED_UNSPLASH_TOPICS.air).toContain('air cargo');
    expect(Object.values(ALLOWED_UNSPLASH_TOPICS).join(' ')).not.toMatch(/English default|language barrier|Western/i);
  });

  it('exposes only approved hero candidate images for the homepage hero carousel', () => {
    const heroImages = getHeroUnsplashImages();

    expect(heroImages.length).toBeGreaterThanOrEqual(3);
    expect(heroImages.map((image) => image.topic)).toEqual(['ocean', 'air', 'global']);

    for (const image of heroImages) {
      expect(image.brandUse).toBe('approved-hero-candidate');
      expect(image.src).toContain('images.unsplash.com');
      expect(image.alt.toLowerCase()).toMatch(/logistics|freight|cargo|trade|partner/);
      expect(image.photographerUrl).toContain('utm_source=ksways');
      expect(image.unsplashUrl).toContain('utm_source=ksways');
      expect(image.downloadLocation).toContain('api.unsplash.com/photos/');
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

  it('falls back through alt_description, then description, then a default alt string', () => {
    expect(normalizeUnsplashPhoto(makePhoto({ alt_description: 'Primary alt text', description: null })).alt).toBe(
      'Primary alt text',
    );

    expect(
      normalizeUnsplashPhoto(makePhoto({ alt_description: null, description: 'Secondary description text' })).alt,
    ).toBe('Secondary description text');

    expect(normalizeUnsplashPhoto(makePhoto({ alt_description: null, description: null })).alt).toBe(
      'KS WAYS logistics image',
    );
  });
});
