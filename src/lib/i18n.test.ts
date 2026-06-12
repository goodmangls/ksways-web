import { describe, expect, it } from 'vitest';
import { getAlternateHref, getLocaleFromPath, getLocalizedPath, locales } from './i18n';

describe('KSWAYS path-based locale policy', () => {
  it('uses English as the default clean root route and Korean at /kr', () => {
    expect(locales).toEqual(['en', 'kr']);
    expect(getLocaleFromPath('/')).toBe('en');
    expect(getLocaleFromPath('/services')).toBe('en');
    expect(getLocaleFromPath('/kr')).toBe('kr');
    expect(getLocaleFromPath('/kr/services')).toBe('kr');
  });

  it('maps equivalent paths between English clean URLs and Korean /kr URLs', () => {
    expect(getLocalizedPath('/', 'kr')).toBe('/kr');
    expect(getLocalizedPath('/services', 'kr')).toBe('/kr/services');
    expect(getLocalizedPath('/kr/services', 'en')).toBe('/services');
    expect(getLocalizedPath('/kr', 'en')).toBe('/');
  });

  it('produces SEO alternates with default English and Korean /kr', () => {
    expect(getAlternateHref('/', 'en')).toBe('/');
    expect(getAlternateHref('/', 'kr')).toBe('/kr');
    expect(getAlternateHref('/kr', 'en')).toBe('/');
    expect(getAlternateHref('/kr', 'kr')).toBe('/kr');
  });
});
