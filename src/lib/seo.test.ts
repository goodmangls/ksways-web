import { describe, expect, it } from 'vitest';
import robots from '@/app/robots';
import sitemap from '@/app/sitemap';
import { homeSeo, siteUrl } from './seo';

const languages = homeSeo.en.alternates?.languages as Record<string, string>;

describe('KSWAYS technical SEO plumbing', () => {
  it('uses standard Korean hreflang instead of non-standard kr', () => {
    expect(languages.en).toBe('/');
    expect(languages['ko-KR']).toBe('/kr');
    expect(languages.kr).toBeUndefined();
    expect(languages['x-default']).toBe('/');
  });

  it('publishes robots policy with sitemap reference', () => {
    expect(robots()).toMatchObject({
      sitemap: `${siteUrl}/sitemap.xml`,
      host: siteUrl,
    });
  });

  it('includes core homepage, service, and network routes in sitemap', () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls).toContain(siteUrl);
    expect(urls).toContain(`${siteUrl}/kr`);
    expect(urls).toContain(`${siteUrl}/services/air-freight-korea`);
    expect(urls).toContain(`${siteUrl}/services/ocean-freight-korea`);
    expect(urls).toContain(`${siteUrl}/services/exw-pickup-korea`);
    expect(urls).toContain(`${siteUrl}/network/korea-agent-network`);
  });
});
