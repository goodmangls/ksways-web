import { describe, expect, it } from 'vitest';
import { buildQuoteMailto, getQuoteInitialValues, quoteFormFields, transportModeOptions } from './quote-form';

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
  it('puts transport mode in a prominent dedicated selector', () => {
    expect(transportModeOptions.map((option) => option.value)).toEqual(['Ocean', 'Air', 'Express', 'Multimodal', 'Not sure']);
    expect(transportModeOptions[0].helper).toContain('FCL');
    expect(transportModeOptions[0].helper).toContain('LCL');
  });

  it('defines ocean-ready operational fields needed for a logistics quote form', () => {
    expect(quoteFormFields.map((field) => field.name)).toEqual([
      'shipmentType',
      'companyName',
      'contactName',
      'emailOrPhone',
      'origin',
      'destination',
      'incoterms',
      'pickupDeliveryScope',
      'commodity',
      'hsCode',
      'packageCount',
      'grossWeight',
      'dimensions',
      'cbm',
      'cargoReadyDate',
      'containerType',
      'containerQuantity',
      'temperatureRange',
      'unNumber',
      'targetSchedule',
      'targetRate',
      'specialHandling',
      'additionalNotes',
    ]);

    const shipmentType = quoteFormFields.find((field) => field.name === 'shipmentType');
    const containerType = quoteFormFields.find((field) => field.name === 'containerType');

    expect(shipmentType?.options).toEqual(expect.arrayContaining(['FCL', 'LCL', 'Breakbulk / OOG']));
    expect(containerType?.options).toEqual(expect.arrayContaining(['20FT Dry', '40FT Dry', '40FT High Cube', 'Open Top', 'Flat Rack']));
  });

  it('turns filled quote form values into a structured info@ksways.co mailto', () => {
    const mailto = decodeMailto(
      buildQuoteMailto({
        transportMode: 'Ocean',
        shipmentType: 'FCL',
        companyName: 'Acme Trading',
        contactName: 'Jane Lee / Logistics Manager',
        emailOrPhone: 'jane@example.com',
        origin: 'Busan, Korea / KRPUS',
        destination: 'Los Angeles, USA / USLAX',
        incoterms: 'FOB',
        pickupDeliveryScope: 'CY-CY',
        commodity: 'Temperature-sensitive cosmetics',
        hsCode: '3304.99',
        packageCount: '12 cartons',
        grossWeight: '480 kg',
        dimensions: '120 x 80 x 150 cm x 2 pallets',
        cbm: '2.88 CBM',
        cargoReadyDate: '2026-07-01',
        containerType: '1 x 40FT Reefer',
        containerQuantity: '1 x 40RF',
        temperatureRange: '+2~+8°C',
        unNumber: 'non-DG',
        targetSchedule: 'ETD after 2026-07-05',
        targetRate: 'Please advise best market rate',
        specialHandling: 'Temperature control, fragile handling',
        additionalNotes: 'Please review fastest feasible option.',
      }),
    );

    expect(mailto.protocol).toBe('mailto:');
    expect(mailto.email).toBe('info@ksways.co');
    expect(mailto.subject).toBe('KS WAYS website quote request — Acme Trading');
    expect(mailto.body).toContain('[Company / Contact]');
    expect(mailto.body).toContain('[Mode / Route]');
    expect(mailto.body).toContain('[Ocean / Equipment]');
    expect(mailto.body).toContain('- Transport mode: Ocean');
    expect(mailto.body).toContain('- Shipment type: FCL');
    expect(mailto.body).toContain('- Origin: Busan, Korea / KRPUS');
    expect(mailto.body).toContain('- Destination: Los Angeles, USA / USLAX');
    expect(mailto.body).toContain('- Container / equipment: 1 x 40FT Reefer');
    expect(mailto.body).toContain('- CBM / volume: 2.88 CBM');
    expect(mailto.body).toContain('- Temperature range: +2~+8°C');
    expect(mailto.body).toContain('- Special handling: Temperature control, fragile handling');
  });

  it('keeps empty optional values as visible blank prompts for operators', () => {
    const mailto = decodeMailto(buildQuoteMailto({ companyName: 'Minimal Co.' }));

    expect(mailto.subject).toBe('KS WAYS website quote request — Minimal Co.');
    expect(mailto.body).toContain('- Contact person / title:');
    expect(mailto.body).toContain('- Origin:');
    expect(mailto.body).toContain('- Container / equipment:');
    expect(mailto.body).toContain('- Additional notes:');
  });

  it('prefills special cargo quote context from the service query source', () => {
    const values = getQuoteInitialValues('special-cargo');
    const mailto = decodeMailto(buildQuoteMailto(values));

    expect(values.transportMode).toBe('Not sure');
    expect(values.shipmentType).toBe('Not sure');
    expect(values.specialHandling).toContain('Special cargo review');
    expect(values.specialHandling).toContain('DG');
    expect(values.additionalNotes).toContain('/services/special-cargo-korea');
    expect(mailto.body).toContain('- Enquiry context: Special Cargo Korea');
    expect(mailto.body).toContain('- Transport mode: Not sure');
    expect(mailto.body).toContain('- Special handling: Special cargo review');
  });
});
