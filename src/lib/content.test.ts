import { describe, expect, it } from 'vitest';
import { homeContent } from './content';

describe('KS WAYS bilingual homepage content', () => {
  it('keeps English as the default public message', () => {
    expect(homeContent.en.hero.headline).toContain('The smart way to global logistics');
    expect(homeContent.en.hero.primaryCta).toBe('Get a Quote');
    expect(homeContent.en.hero.secondaryCta).toBe('Explore Partner Network');
    expect(homeContent.en.contact.email).toBe('info@ksways.co');
    expect(homeContent.en.contact.chat).toBe('Contact on Intercom');
    expect(homeContent.en.operating.services.find((service) => service.title === 'Air Freight')?.href).toBe('/services/air-freight-korea');
    expect(homeContent.en.operating.services.find((service) => service.title === 'Ocean Freight')?.href).toBe('/services/ocean-freight-korea');
    expect(homeContent.en.operating.services.find((service) => service.title === 'Project Support')?.href).toBe('/services/exw-pickup-korea');
    expect(homeContent.en.operating.services.find((service) => service.title === 'BridgeLogis')?.href).toBe('https://bridgelogis.com');
  });

  it('provides Korean content for the /kr route without using /ko', () => {
    expect(homeContent.kr.hero.headline).toContain('글로벌 물류를 위한 스마트한 길');
    expect(homeContent.kr.hero.primaryCta).toBe('견적 문의');
    expect(homeContent.kr.hero.secondaryCta).toBe('파트너 네트워크 보기');
    expect(homeContent.kr.contact.email).toBe('info@ksways.co');
    expect(homeContent.kr.contact.chat).toBe('Intercom으로 문의');
    expect(homeContent.kr.operating.services.find((service) => service.title === '항공 운송')?.href).toBe('/services/air-freight-korea');
    expect(homeContent.kr.operating.services.find((service) => service.title === '해상 운송')?.href).toBe('/services/ocean-freight-korea');
  });
});
