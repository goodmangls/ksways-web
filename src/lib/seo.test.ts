import { describe, expect, it } from 'vitest';
import robots from '@/app/robots';
import sitemap from '@/app/sitemap';
import { contactTelephone, homeFaqs, homeSeo, organizationJsonLd, siteUrl } from './seo';

const languages = homeSeo.en.alternates?.languages as Record<string, string>;

describe('KS WAYS technical SEO plumbing', () => {
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
    expect(urls).toContain(`${siteUrl}/services/special-cargo-korea`);
    expect(urls).toContain(`${siteUrl}/services/exw-pickup-korea`);
    expect(urls).toContain(`${siteUrl}/network/korea-agent-network`);
  });

  it('exposes Northeast Asia and 30+ years carrier experience in SEO/AEO surfaces', () => {
    const englishSeo = `${homeSeo.en.description} ${homeSeo.en.openGraph?.description} ${organizationJsonLd('en').description} ${homeFaqs.en.map((faq) => faq.answer).join(' ')}`;
    const koreanSeo = `${homeSeo.kr.description} ${homeSeo.kr.openGraph?.description} ${organizationJsonLd('kr').description} ${homeFaqs.kr.map((faq) => faq.answer).join(' ')}`;

    expect(englishSeo).toContain('Northeast Asia');
    expect(englishSeo).toContain('China and Japan');
    expect(englishSeo).toContain('30+ years');
    expect(englishSeo).toContain('Korean Air');
    expect(englishSeo).toContain('Asiana Airlines');
    expect(englishSeo).toContain('FedEx');
    expect(englishSeo).toContain('Western freight forwarders');
    expect(englishSeo).toContain('English-first');
    expect(englishSeo).toContain('language barrier');
    expect(koreanSeo).toContain('동북아');
    expect(koreanSeo).toContain('중국·일본');
    expect(koreanSeo).toContain('30년 이상');
    expect(koreanSeo).toContain('대한항공');
    expect(koreanSeo).toContain('아시아나항공');
    expect(koreanSeo).toContain('페덱스');
  });

  it('exposes the representative telephone number in structured organization data', () => {
    expect(contactTelephone).toBe('+82 6961 5778');
    expect(organizationJsonLd('en')).toMatchObject({ telephone: '+82 6961 5778' });
    expect(organizationJsonLd('kr')).toMatchObject({ telephone: '+82 6961 5778' });
  });
});
