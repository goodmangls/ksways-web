import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import robots from '@/app/robots';
import sitemap from '@/app/sitemap';
import { contactFax, contactPointJsonLd, contactTelephone, homeFaqs, homeSeo, organizationJsonLd, siteUrl, websiteJsonLd } from './seo';

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

  it('exposes Northeast Asia and 30+ years industry experience in SEO/AEO surfaces without naming benchmark companies', () => {
    const englishSeo = `${homeSeo.en.description} ${homeSeo.en.openGraph?.description} ${organizationJsonLd('en').description} ${homeFaqs.en.map((faq) => faq.answer).join(' ')}`;
    const koreanSeo = `${homeSeo.kr.description} ${homeSeo.kr.openGraph?.description} ${organizationJsonLd('kr').description} ${homeFaqs.kr.map((faq) => faq.answer).join(' ')}`;

    expect(englishSeo).toContain('Northeast Asia');
    expect(englishSeo).toContain('China and Japan');
    expect(englishSeo).toContain('30+ years');
    expect(englishSeo).toContain('industry experience');
    expect(englishSeo).toContain('airline cargo');
    expect(englishSeo).toContain('express logistics');
    expect(englishSeo).toContain('shipping line operations');
    expect(englishSeo).not.toContain('Korean Air');
    expect(englishSeo).not.toContain('Asiana Airlines');
    expect(englishSeo).not.toContain('FedEx');
    expect(englishSeo).toContain('global freight forwarders');
    expect(englishSeo).not.toMatch(/English default/i);
    expect(englishSeo).not.toMatch(/English website/i);
    expect(englishSeo).not.toMatch(/Western/i);
    expect(englishSeo).not.toMatch(/language barrier/i);
    expect(englishSeo).not.toContain('English-first');
    expect(koreanSeo).toContain('동북아');
    expect(koreanSeo).toContain('중국·일본');
    expect(koreanSeo).toContain('30년 이상');
    expect(koreanSeo).toContain('Industry Experience');
    expect(koreanSeo).toContain('항공화물');
    expect(koreanSeo).toContain('특송 물류');
    expect(koreanSeo).not.toContain('대한항공');
    expect(koreanSeo).not.toContain('아시아나항공');
    expect(koreanSeo).not.toContain('페덱스');
  });

  it('exposes the representative telephone and fax number in structured organization data', () => {
    expect(contactTelephone).toBe('+82 2 6961 5778');
    expect(contactFax).toBe('+82 2 6961 5765');
    expect(organizationJsonLd('en')).toMatchObject({ telephone: '+82 2 6961 5778', faxNumber: '+82 2 6961 5765' });
    expect(organizationJsonLd('kr')).toMatchObject({ telephone: '+82 2 6961 5778', faxNumber: '+82 2 6961 5765' });
  });

  it('adds answer-engine structured data for website and quotation contact intent', () => {
    expect(websiteJsonLd('en')).toMatchObject({
      '@type': 'WebSite',
      url: siteUrl,
      inLanguage: 'en',
      potentialAction: { '@type': 'CommunicateAction', target: `${siteUrl}/quote` },
    });
    expect(websiteJsonLd('kr')).toMatchObject({
      '@type': 'WebSite',
      url: `${siteUrl}/kr`,
      inLanguage: 'ko-KR',
    });
    expect(contactPointJsonLd('en')).toMatchObject({
      '@type': 'ContactPoint',
      email: 'info@ksways.co',
      telephone: '+82 2 6961 5778',
      availableLanguage: ['English', 'Korean'],
    });
    expect(organizationJsonLd('en')).toMatchObject({
      identifier: { propertyID: 'WCA Member ID', value: '96376' },
      contactPoint: [contactPointJsonLd('en')],
    });
  });

  it('publishes llms.txt with canonical AEO answer facts and routes', () => {
    const llms = readFileSync(join(process.cwd(), 'public/llms.txt'), 'utf8');

    expect(llms).toContain('KS WAYS CO., LTD.');
    expect(llms).toContain('WCA Member ID: 96376');
    expect(llms).toContain('https://ksways.co/services/ocean-freight-korea');
    expect(llms).toContain('https://ksways.co/services/air-freight-korea');
    expect(llms).toContain('https://ksways.co/quote');
    expect(llms).toContain('info@ksways.co');
  });
});
