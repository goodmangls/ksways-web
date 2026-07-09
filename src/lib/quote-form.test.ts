import { describe, expect, it } from 'vitest';
import {
  buildQuoteMailto,
  fclContainerOptions,
  getMissingRequiredQuoteFields,
  getQuoteInitialValues,
  getShipmentTypeForTransportMode,
  getVisibleQuoteSections,
  isDgCargo,
  quoteFormFields,
  requiredQuoteFieldNames,
  transportModeOptions,
} from './quote-form';

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
      'pickupDate',
      'pickupPlace',
      'pickupContact',
      'commodity',
      'hsCode',
      'cargoNature',
      'packageCount',
      'grossWeight',
      'dimensions',
      'cbm',
      'cargoReadyDate',
      'containerType',
      'containerQuantity',
      'temperatureRange',
      'unNumber',
      'dgClass',
      'targetSchedule',
      'targetRate',
      'specialHandling',
      'additionalNotes',
    ]);

    const shipmentType = quoteFormFields.find((field) => field.name === 'shipmentType');
    const containerType = quoteFormFields.find((field) => field.name === 'containerType');
    const cargoNature = quoteFormFields.find((field) => field.name === 'cargoNature');
    const unNumber = quoteFormFields.find((field) => field.name === 'unNumber');
    const dgClass = quoteFormFields.find((field) => field.name === 'dgClass');

    expect(shipmentType?.options).toEqual(expect.arrayContaining(['FCL', 'LCL', 'Breakbulk / OOG']));
    expect(cargoNature?.options).toEqual(expect.arrayContaining(['General cargo', 'DG cargo']));
    expect(unNumber?.helper).toContain('Cargo type is DG cargo');
    expect(dgClass?.helper).toContain('UN No. and Class');
    expect(containerType?.options).toBe(fclContainerOptions);
    expect(containerType?.options).toEqual(expect.arrayContaining([
      'DRY // 20FT',
      'DRY // 40FT',
      'REEFER // 20RF',
      'REEFER // 40RF',
      'FLAT RACK // 20FR (IG)',
      'FLAT RACK // 20FR (OH)',
      'FLAT RACK // 20FR (OW)',
      'FLAT RACK // 20FR (OWH)',
      'FLAT RACK // 40FR (IG)',
      'FLAT RACK // 40FR (OH)',
      'FLAT RACK // 40FR (OW)',
      'FLAT RACK // 40FR (OWH)',
      'OPEN TOP // 20OT (IG)',
      'OPEN TOP // 20OT (OH)',
      'OPEN TOP // 40OT (IG)',
      'OPEN TOP // 40OT (OH)',
      'TANK CONTAINER // 20TK',
      'TANK CONTAINER // 40TK',
    ]));
  });

  it('maps transport modes to practical default shipment types', () => {
    expect(getShipmentTypeForTransportMode('Ocean')).toBe('FCL');
    expect(getShipmentTypeForTransportMode('Air')).toBe('Air cargo');
    expect(getShipmentTypeForTransportMode('Express')).toBe('Express');
    expect(getShipmentTypeForTransportMode('Multimodal')).toBe('Multimodal');
    expect(getShipmentTypeForTransportMode('Not sure')).toBe('Not sure');
  });

  it('identifies required quote fields before opening the email draft', () => {
    expect(requiredQuoteFieldNames).toEqual(['companyName', 'contactName', 'emailOrPhone', 'origin', 'destination', 'commodity']);

    expect(getMissingRequiredQuoteFields({ transportMode: 'Ocean' })).toEqual([
      'Company name',
      'Contact person / title',
      'Email / phone',
      'Origin city / port / airport',
      'Destination city / port / airport',
      'Commodity',
    ]);

    expect(getMissingRequiredQuoteFields({
      companyName: 'Acme Trading',
      contactName: 'Jane Lee',
      emailOrPhone: 'jane@example.com',
      origin: 'Busan',
      destination: 'Los Angeles',
      commodity: 'Auto parts',
    })).toEqual([]);
  });

  it('returns mode-driven visible sections so non-ocean users are not overwhelmed by ocean equipment', () => {
    expect(getVisibleQuoteSections({ transportMode: 'Ocean' })).toEqual(['company', 'route', 'cargo', 'ocean', 'handling']);
    expect(getVisibleQuoteSections({ transportMode: 'Air' })).toEqual(['company', 'route', 'cargo', 'handling']);
    expect(getVisibleQuoteSections({ transportMode: 'Express' })).toEqual(['company', 'route', 'cargo', 'handling']);
    expect(getVisibleQuoteSections({ transportMode: 'Not sure' })).toEqual(['company', 'route', 'cargo', 'ocean', 'handling']);
  });

  it('detects DG cargo so the UI can elevate UN No. and DG class fields', () => {
    expect(isDgCargo({ cargoNature: 'DG cargo' })).toBe(true);
    expect(isDgCargo({ cargoNature: 'General cargo' })).toBe(false);
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
        pickupDate: '2026-07-02',
        pickupPlace: 'Incheon warehouse, Korea',
        pickupContact: 'Kim / +82-10-0000-0000',
        commodity: 'Temperature-sensitive cosmetics',
        hsCode: '3304.99',
        cargoNature: 'DG cargo',
        packageCount: '12 cartons',
        grossWeight: '480 kg',
        dimensions: '120 x 80 x 150 cm x 2 pallets',
        cbm: '2.88 CBM',
        cargoReadyDate: '2026-07-01',
        containerType: 'REEFER // 40RF',
        containerQuantity: '1 x 40RF',
        temperatureRange: '+2~+8°C',
        unNumber: 'UN3481',
        dgClass: 'Class 9',
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
    expect(mailto.body).toContain('- Pickup date: 2026-07-02');
    expect(mailto.body).toContain('- Pickup place: Incheon warehouse, Korea');
    expect(mailto.body).toContain('- Cargo type: DG cargo');
    expect(mailto.body).toContain('- FCL container / equipment: REEFER // 40RF');
    expect(mailto.body).toContain('- CBM / volume: 2.88 CBM');
    expect(mailto.body).toContain('- Temperature range: +2~+8°C');
    expect(mailto.body).toContain('- UN No.: UN3481');
    expect(mailto.body).toContain('- DG class: Class 9');
    expect(mailto.body).toContain('- Special cargo notes: Temperature control, fragile handling');
  });

  it('keeps empty optional values as visible blank prompts for operators', () => {
    const mailto = decodeMailto(buildQuoteMailto({ companyName: 'Minimal Co.' }));

    expect(mailto.subject).toBe('KS WAYS website quote request — Minimal Co.');
    expect(mailto.body).toContain('- Contact person / title:');
    expect(mailto.body).toContain('- Origin:');
    expect(mailto.body).toContain('- FCL container / equipment:');
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
    expect(mailto.body).toContain('- Special cargo notes: Special cargo review');
  });
});
