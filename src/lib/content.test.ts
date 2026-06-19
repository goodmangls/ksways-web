import { describe, expect, it } from 'vitest';
import { homeContent } from './content';

describe('KS WAYS bilingual homepage content', () => {
  it('keeps English as the default public message', () => {
    expect(homeContent.en.hero.headline).toContain('The smart way to global logistics');
    expect(homeContent.en.hero.primaryCta).toBe('Get a Quote');
    expect(homeContent.en.hero.secondaryCta).toBe('Explore Partner Network');
    expect(homeContent.en.contact.email).toBe('info@ksways.co');
    expect(homeContent.en.contact.phone).toBe('Tel. +82 2 6961 5778');
    expect(homeContent.en.contact.fax).toBe('Fax +82 2 6961 5765');
    expect(homeContent.en.contact.body).toContain('Zoom / Calendly');
    expect(homeContent.en.contact.schedule).toBe('Schedule consultation');
    expect(homeContent.en.operating.services.find((service) => service.title === 'Air Freight')?.href).toBe('/services/air-freight-korea');
    expect(homeContent.en.operating.services.find((service) => service.title === 'Ocean Freight')?.href).toBe('/services/ocean-freight-korea');
    expect(homeContent.en.operating.services.find((service) => service.title === 'Special Cargo')?.href).toBe('/services/special-cargo-korea');
    expect(homeContent.en.operating.services.find((service) => service.title === 'EXW & Handling')?.href).toBe('/services/exw-pickup-korea');
    expect(homeContent.en.operating.services.find((service) => service.title === 'BridgeLogis')?.href).toBe('https://bridgelogis.com');
    expect(homeContent.en.footer.tagline).toContain('global ocean and air logistics');
    expect(homeContent.en.footer.credentials.map((item) => item.label)).toEqual(['WCA Member', 'Ocean strength', 'Industry Experience']);
    expect(homeContent.en.footer.companyName).toBe('KS WAYS CO., LTD.');
    expect(homeContent.en.footer.email).toBe('info@ksways.co');
    expect(homeContent.en.footer.phone).toBe('Tel. +82 2 6961 5778');
    expect(homeContent.en.footer.fax).toBe('Fax +82 2 6961 5765');

    const englishServicesColumn = homeContent.en.footer.columns.find((column) => column.title === 'Services');
    const englishContactColumn = homeContent.en.footer.columns.find((column) => column.title === 'Contact');
    expect(englishServicesColumn?.links.map((link) => link.label)).toContain('BridgeLogis');
    expect(englishContactColumn?.links.map((link) => link.label)).not.toContain('BridgeLogis');
  });

  it('emphasizes Korea-centered Northeast Asia reach and 30+ years of industry experience without naming benchmark companies', () => {
    const englishCopy = [
      homeContent.en.hero.lead,
      homeContent.en.company.body,
      ...homeContent.en.company.pillars.map((pillar) => `${pillar.title} ${pillar.body}`),
      homeContent.en.network.body,
      ...homeContent.en.network.points,
      homeContent.en.footer.tagline,
      ...homeContent.en.footer.credentials.map((item) => `${item.label} ${item.value}`),
    ].join(' ');
    const koreanCopy = [
      homeContent.kr.hero.lead,
      homeContent.kr.company.body,
      ...homeContent.kr.company.pillars.map((pillar) => `${pillar.title} ${pillar.body}`),
      homeContent.kr.network.body,
      ...homeContent.kr.network.points,
      homeContent.kr.footer.tagline,
      ...homeContent.kr.footer.credentials.map((item) => `${item.label} ${item.value}`),
    ].join(' ');

    expect(englishCopy).toContain('Northeast Asia');
    expect(englishCopy).toContain('China and Japan');
    expect(englishCopy).toContain('30+ years');
    expect(englishCopy).toContain('Industry Experience');
    expect(englishCopy).toContain('airline cargo');
    expect(englishCopy).toContain('express logistics');
    expect(englishCopy).toContain('shipping line');
    expect(englishCopy).toContain('global forwarding');
    expect(englishCopy).not.toContain('Korean Air');
    expect(englishCopy).not.toContain('Asiana Airlines');
    expect(englishCopy).not.toContain('FedEx');

    expect(koreanCopy).toContain('동북아');
    expect(koreanCopy).toContain('중국·일본');
    expect(koreanCopy).toContain('30년 이상');
    expect(koreanCopy).toContain('Industry Experience');
    expect(koreanCopy).toContain('항공화물');
    expect(koreanCopy).toContain('특송 물류');
    expect(koreanCopy).toContain('해운사');
    expect(koreanCopy).toContain('글로벌 포워딩');
    expect(koreanCopy).not.toContain('대한항공');
    expect(koreanCopy).not.toContain('아시아나항공');
    expect(koreanCopy).not.toContain('페덱스');
  });

  it('presents the English site as global by default without Western or language-barrier positioning', () => {
    const englishCopy = [
      homeContent.en.hero.lead,
      homeContent.en.company.body,
      ...homeContent.en.company.pillars.map((pillar) => `${pillar.title} ${pillar.body}`),
      homeContent.en.network.body,
      ...homeContent.en.network.points,
      homeContent.en.contact.body,
      homeContent.en.footer.tagline,
      ...homeContent.en.footer.credentials.map((item) => `${item.label} ${item.value}`),
    ].join(' ');

    expect(englishCopy).toContain('global freight forwarders');
    expect(englishCopy).toContain('English website');
    expect(englishCopy).toContain('trusted global forwarding company');
    expect(englishCopy).toContain('partner-safe handoff');
    expect(englishCopy).not.toMatch(/Western/i);
    expect(englishCopy).not.toMatch(/language barrier/i);
    expect(englishCopy).not.toContain('English-first');
    expect(englishCopy).not.toContain('low-friction');
  });

  it('provides Korean content for the /kr route without using /ko', () => {
    expect(homeContent.kr.hero.headline).toContain('글로벌 물류를 위한 스마트한 길');
    expect(homeContent.kr.hero.primaryCta).toBe('견적 문의');
    expect(homeContent.kr.hero.secondaryCta).toBe('파트너 네트워크 보기');
    expect(homeContent.kr.contact.email).toBe('info@ksways.co');
    expect(homeContent.kr.contact.phone).toBe('Tel. +82 2 6961 5778');
    expect(homeContent.kr.contact.fax).toBe('Fax +82 2 6961 5765');
    expect(homeContent.kr.contact.body).toContain('Zoom / Calendly');
    expect(homeContent.kr.contact.schedule).toBe('상담 일정 잡기');
    expect(homeContent.kr.operating.services.find((service) => service.title === '항공 운송')?.href).toBe('/services/air-freight-korea');
    expect(homeContent.kr.operating.services.find((service) => service.title === '해상 운송')?.href).toBe('/services/ocean-freight-korea');
    expect(homeContent.kr.operating.services.find((service) => service.title === '특수 화물')?.href).toBe('/services/special-cargo-korea');
    expect(homeContent.kr.operating.services.find((service) => service.title === 'EXW & 핸들링')?.href).toBe('/services/exw-pickup-korea');
    expect(homeContent.kr.footer.tagline).toContain('글로벌 해상·항공 물류회사');
    expect(homeContent.kr.footer.credentials.map((item) => item.label)).toEqual(['WCA 회원사', '해운 강점', 'Industry Experience']);
    expect(homeContent.kr.footer.companyName).toBe('KS WAYS CO., LTD.');
    expect(homeContent.kr.footer.email).toBe('info@ksways.co');
    expect(homeContent.kr.footer.phone).toBe('Tel. +82 2 6961 5778');
    expect(homeContent.kr.footer.fax).toBe('Fax +82 2 6961 5765');

    const koreanServicesColumn = homeContent.kr.footer.columns.find((column) => column.title === '서비스');
    const koreanContactColumn = homeContent.kr.footer.columns.find((column) => column.title === '문의');
    expect(koreanServicesColumn?.links.map((link) => link.label)).toContain('BridgeLogis');
    expect(koreanContactColumn?.links.map((link) => link.label)).not.toContain('BridgeLogis');
  });
});
