import { describe, expect, it } from 'vitest';
import { conversionDataAttributes, conversionEventNames } from './conversion';

describe('conversionDataAttributes', () => {
  it('renders privacy-safe data attributes without exposing raw PII', () => {
    expect(
      conversionDataAttributes(conversionEventNames.quoteCta, {
        location: 'homepage_hero',
        locale: 'en',
        href: '/quote',
      }),
    ).toEqual({
      'data-conversion-event': 'ksways_quote_cta_click',
      'data-conversion-location': 'homepage_hero',
      'data-conversion-locale': 'en',
      'data-conversion-href': '/quote',
    });
  });
});
