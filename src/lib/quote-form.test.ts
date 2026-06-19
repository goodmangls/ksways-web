import { describe, expect, it } from 'vitest';
import { buildQuoteMailto, getQuoteInitialValues, quoteFormFields } from './quote-form';

function decodeMailto(href: string) {
  const url = new URL(href);
  return {
    protocol: url.protocol,
    email: url.pathname,
    subject: url.searchParams.get('subject') ?? '',
    body: url.searchParams.get('body') ?? '',
  };
}

describe('quote form mailto builder', () => {
  it('defines the operational fields needed for a logistics quote form', () => {
    expect(quoteFormFields.map((field) => field.name)).toEqual([
      'companyName',
      'contactName',
      'emailOrPhone',
      'origin',
      'destination',
      'incoterms',
      'commodity',
      'hsCode',
      'packageCount',
      'grossWeight',
      'dimensions',
      'cargoReadyDate',
      'preferredMode',
      'targetSchedule',
      'specialHandling',
      'additionalNotes',
    ]);
  });

  it('turns filled quote form values into a structured info@ksways.co mailto', () => {
    const mailto = decodeMailto(
      buildQuoteMailto({
        companyName: 'Acme Trading',
        contactName: 'Jane Lee / Logistics Manager',
        emailOrPhone: 'jane@example.com',
        origin: 'Busan, Korea',
        destination: 'Los Angeles, USA',
        incoterms: 'FOB',
        commodity: 'Temperature-sensitive cosmetics',
        hsCode: '3304.99',
        packageCount: '12 cartons',
        grossWeight: '480 kg',
        dimensions: '120 x 80 x 150 cm x 2 pallets',
        cargoReadyDate: '2026-07-01',
        preferredMode: 'Air',
        targetSchedule: 'Arrive before 2026-07-05',
        specialHandling: 'Temperature control, fragile handling',
        additionalNotes: 'Please review fastest feasible option.',
      }),
    );

    expect(mailto.protocol).toBe('mailto:');
    expect(mailto.email).toBe('info@ksways.co');
    expect(mailto.subject).toBe('KS WAYS website quote request — Acme Trading');
    expect(mailto.body).toContain('[Company / Contact]');
    expect(mailto.body).toContain('- Company name: Acme Trading');
    expect(mailto.body).toContain('- Origin: Busan, Korea');
    expect(mailto.body).toContain('- Destination: Los Angeles, USA');
    expect(mailto.body).toContain('- Incoterms: FOB');
    expect(mailto.body).toContain('- HS code: 3304.99');
    expect(mailto.body).toContain('- Special handling: Temperature control, fragile handling');
  });

  it('keeps empty optional values as visible blank prompts for operators', () => {
    const mailto = decodeMailto(buildQuoteMailto({ companyName: 'Minimal Co.' }));

    expect(mailto.subject).toBe('KS WAYS website quote request — Minimal Co.');
    expect(mailto.body).toContain('- Contact person / title:');
    expect(mailto.body).toContain('- Origin:');
    expect(mailto.body).toContain('- Additional notes:');
  });

  it('prefills special cargo quote context from the service query source', () => {
    const values = getQuoteInitialValues('special-cargo');
    const mailto = decodeMailto(buildQuoteMailto(values));

    expect(values.preferredMode).toBe('Not sure');
    expect(values.specialHandling).toContain('Special cargo review');
    expect(values.specialHandling).toContain('DG');
    expect(values.additionalNotes).toContain('/services/special-cargo-korea');
    expect(mailto.body).toContain('- Enquiry context: Special Cargo Korea');
    expect(mailto.body).toContain('- Special handling: Special cargo review');
  });
});
