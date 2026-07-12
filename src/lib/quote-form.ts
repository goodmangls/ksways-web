import { contactEmail } from './seo';

export type QuoteFormValues = {
  enquiryContext?: string;
  transportMode?: string;
  shipmentType?: string;
  companyName?: string;
  contactName?: string;
  emailOrPhone?: string;
  origin?: string;
  destination?: string;
  incoterms?: string;
  pickupDeliveryScope?: string;
  pickupDate?: string;
  pickupPlace?: string;
  pickupContact?: string;
  commodity?: string;
  hsCode?: string;
  cargoNature?: string;
  packageCount?: string;
  grossWeight?: string;
  dimensions?: string;
  cbm?: string;
  cargoReadyDate?: string;
  containerType?: string;
  containerQuantity?: string;
  temperatureRange?: string;
  unNumber?: string;
  dgClass?: string;
  targetSchedule?: string;
  targetRate?: string;
  specialHandling?: string;
  additionalNotes?: string;
};

export type QuoteServiceKey = 'special-cargo';

export const transportModeOptions = [
  { value: 'Ocean', label: 'Ocean', helper: 'FCL / LCL / Reefer / OOG' },
  { value: 'Air', label: 'Air', helper: 'Urgent / DG / temperature-sensitive' },
  { value: 'Express', label: 'Express', helper: 'Courier-style urgent cargo' },
  { value: 'Multimodal', label: 'Multimodal', helper: 'Ocean + air/truck/rail routing' },
  { value: 'Not sure', label: 'Not sure', helper: 'Let KS WAYS recommend' },
] as const;

export const fclContainerOptions = [
  'Not sure / N/A',
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
  'LCL / CFS cargo',
  'Breakbulk / RoRo / other special equipment',
] as const;

const quoteServiceDefaults: Record<QuoteServiceKey, QuoteFormValues> = {
  'special-cargo': {
    enquiryContext: 'Special Cargo Korea',
    transportMode: 'Not sure',
    shipmentType: 'Not sure',
    cargoNature: 'Special cargo / OOG / temperature controlled',
    specialHandling: 'Special cargo review — DG / perishables / temperature-sensitive / oversized / high-value / fragile / urgent cargo.',
    additionalNotes: 'Source page: /services/special-cargo-korea. Please review feasibility, required documents, and practical ocean/air routing options.',
  },
};

export function getQuoteInitialValues(service?: string | string[] | null): QuoteFormValues {
  const key = Array.isArray(service) ? service[0] : service;

  if (key === 'special-cargo') {
    return quoteServiceDefaults[key];
  }

  return { transportMode: 'Not sure', shipmentType: 'Not sure', cargoNature: 'General cargo' };
}

type QuoteFormField = {
  name: keyof QuoteFormValues;
  label: string;
  placeholder: string;
  section: 'company' | 'route' | 'cargo' | 'ocean' | 'handling';
  required?: boolean;
  type?: 'text' | 'email' | 'date' | 'textarea' | 'select';
  options?: readonly string[];
  helper?: string;
};

export const quoteFormFields: QuoteFormField[] = [
  { name: 'shipmentType', label: 'Shipment type', placeholder: 'Select shipment type', section: 'route', type: 'select', options: ['Not sure', 'FCL', 'LCL', 'Air cargo', 'Express', 'Breakbulk / OOG', 'Multimodal'] },
  { name: 'companyName', label: 'Company name', placeholder: 'Acme Trading Co.', section: 'company', required: true },
  { name: 'contactName', label: 'Contact person / title', placeholder: 'Jane Lee / Logistics Manager', section: 'company', required: true },
  { name: 'emailOrPhone', label: 'Email / phone', placeholder: 'jane@example.com / +82...', section: 'company', required: true, type: 'email' },
  { name: 'origin', label: 'Origin city / port / airport', placeholder: 'Busan, Korea / KRPUS / ICN', section: 'route', required: true },
  { name: 'destination', label: 'Destination city / port / airport', placeholder: 'Los Angeles, USA / USLAX / LAX', section: 'route', required: true },
  { name: 'incoterms', label: 'Incoterms', placeholder: 'EXW / FOB / CIF / DAP / DDP', section: 'route' },
  { name: 'pickupDeliveryScope', label: 'Pickup / delivery scope', placeholder: 'CY-CY, CFS-CFS, door-to-port, door-to-door...', section: 'route' },
  { name: 'pickupDate', label: 'Pickup date', placeholder: 'YYYY-MM-DD', section: 'route', type: 'date' },
  { name: 'pickupPlace', label: 'Pickup place', placeholder: 'Factory / warehouse address, PIC name, phone', section: 'route' },
  { name: 'pickupContact', label: 'Pickup contact', placeholder: 'PIC / country code / mobile or email', section: 'route' },
  { name: 'commodity', label: 'Commodity', placeholder: 'Cosmetics, machinery parts, garments...', section: 'cargo', required: true },
  { name: 'hsCode', label: 'HS code', placeholder: '3304.99', section: 'cargo' },
  { name: 'cargoNature', label: 'Cargo type', placeholder: 'Select cargo type', section: 'cargo', type: 'select', options: ['General cargo', 'DG cargo', 'Special cargo / OOG / temperature controlled', 'Not sure'] },
  { name: 'packageCount', label: 'Package count', placeholder: '12 cartons / 2 pallets', section: 'cargo' },
  { name: 'grossWeight', label: 'Gross weight', placeholder: '480 kg', section: 'cargo' },
  { name: 'dimensions', label: 'Dimensions', placeholder: '120 x 80 x 150 cm x 2 pallets / OOG L x W x H', section: 'cargo' },
  { name: 'cbm', label: 'CBM / volume', placeholder: '2.88 CBM', section: 'cargo' },
  { name: 'cargoReadyDate', label: 'Cargo ready date', placeholder: 'YYYY-MM-DD', section: 'cargo', type: 'date' },
  { name: 'containerType', label: 'FCL container / equipment', placeholder: 'Select exact container type', section: 'ocean', type: 'select', options: fclContainerOptions, helper: 'IG = in-gauge, OH = over-height, OW = over-width, OWH = over-width & over-height.' },
  { name: 'containerQuantity', label: 'Container quantity', placeholder: '1 x 40FT / 2 x 20FR OH / LCL only', section: 'ocean' },
  { name: 'temperatureRange', label: 'Temperature range', placeholder: '+2~+8°C / -18°C / ambient', section: 'handling' },
  { name: 'unNumber', label: 'UN No. for DG cargo', placeholder: 'UN3481 / leave blank for general cargo', section: 'handling', helper: 'Use this when Cargo type is DG cargo. Attach MSDS/DG declaration in the prepared email.' },
  { name: 'dgClass', label: 'DG class', placeholder: 'Class 3 / Class 9 / Packing Group II', section: 'handling', helper: 'Carrier booking screens normally require UN No. and Class at minimum for DG review.' },
  { name: 'targetSchedule', label: 'Target schedule / deadline', placeholder: 'ETD after 2026-07-05 / arrive before 2026-08-10', section: 'handling' },
  { name: 'targetRate', label: 'Target rate / budget', placeholder: 'Optional target rate or buying guidance', section: 'handling' },
  { name: 'specialHandling', label: 'Special cargo notes', placeholder: 'DG, reefer, fragile, oversized, high-value, inspection, fumigation, OOG drawings...', section: 'handling', type: 'textarea' },
  { name: 'additionalNotes', label: 'Additional notes', placeholder: 'Carrier preference, free time, customs, insurance, warehouse needs, attachments...', section: 'handling', type: 'textarea' },
];

type QuoteSection = 'company' | 'route' | 'cargo' | 'ocean' | 'handling';

export const requiredQuoteFieldNames = ['companyName', 'contactName', 'emailOrPhone', 'origin', 'destination', 'commodity'] as const satisfies readonly (keyof QuoteFormValues)[];

export function getShipmentTypeForTransportMode(mode?: string) {
  switch (mode) {
    case 'Ocean':
      return 'FCL';
    case 'Air':
      return 'Air cargo';
    case 'Express':
      return 'Express';
    case 'Multimodal':
      return 'Multimodal';
    default:
      return 'Not sure';
  }
}

export function getVisibleQuoteSections(values: QuoteFormValues = {}): QuoteSection[] {
  if (values.transportMode === 'Air' || values.transportMode === 'Express') {
    return ['company', 'route', 'cargo', 'handling'];
  }

  return ['company', 'route', 'cargo', 'ocean', 'handling'];
}

export function isDgCargo(values: QuoteFormValues = {}) {
  return values.cargoNature === 'DG cargo';
}

export function getMissingRequiredQuoteFields(values: QuoteFormValues = {}) {
  return requiredQuoteFieldNames
    .filter((name) => !value(values, name))
    .map((name) => quoteFormFields.find((field) => field.name === name)?.label ?? name);
}

const value = (values: QuoteFormValues, key: keyof QuoteFormValues) => values[key]?.trim() ?? '';

// 섹션 헤더는 값 유무와 무관하게 항상 유지한다 — 수신 팀이 익숙한 골격 보존 (2026-07-12 확정).
const quoteEmailSections: Array<{ title: string; fields: Array<[keyof QuoteFormValues, string]> }> = [
  {
    title: '[Company / Contact]',
    fields: [
      ['enquiryContext', 'Enquiry context'],
      ['companyName', 'Company name'],
      ['contactName', 'Contact person / title'],
      ['emailOrPhone', 'Email / phone'],
    ],
  },
  {
    title: '[Mode / Route]',
    fields: [
      ['transportMode', 'Transport mode'],
      ['shipmentType', 'Shipment type'],
      ['origin', 'Origin'],
      ['destination', 'Destination'],
      ['incoterms', 'Incoterms'],
      ['pickupDeliveryScope', 'Pickup / delivery scope'],
      ['pickupDate', 'Pickup date'],
      ['pickupPlace', 'Pickup place'],
      ['pickupContact', 'Pickup contact'],
    ],
  },
  {
    title: '[Cargo]',
    fields: [
      ['commodity', 'Commodity'],
      ['hsCode', 'HS code'],
      ['cargoNature', 'Cargo type'],
      ['packageCount', 'Package count'],
      ['grossWeight', 'Gross weight'],
      ['dimensions', 'Dimensions'],
      ['cbm', 'CBM / volume'],
      ['cargoReadyDate', 'Cargo ready date'],
    ],
  },
  {
    title: '[Ocean / Equipment]',
    fields: [
      ['containerType', 'FCL container / equipment'],
      ['containerQuantity', 'Container quantity'],
    ],
  },
  {
    title: '[DG / Special Handling]',
    fields: [
      ['temperatureRange', 'Temperature range'],
      ['unNumber', 'UN No.'],
      ['dgClass', 'DG class'],
      ['targetSchedule', 'Target schedule / deadline'],
      ['targetRate', 'Target rate / budget'],
      ['specialHandling', 'Special cargo notes'],
      ['additionalNotes', 'Additional notes'],
    ],
  },
];

export function buildQuoteEmailText(values: QuoteFormValues = {}) {
  const body = quoteEmailSections.flatMap(({ title, fields }) => {
    const lines = fields
      .filter(([key]) => value(values, key))
      .map(([key, label]) => `- ${label}: ${value(values, key)}`);
    return [title, ...lines, ''];
  });

  return ['Dear KS WAYS team,', '', 'Please review the website quote request below.', '', ...body].join('\n');
}

// 레거시 Outlook/IE 계열의 문서화된 URL 한도 2083자에서 안전 여유를 둔 값.
export const QUOTE_MAILTO_LENGTH_LIMIT = 1800;

export function isQuoteMailtoOverLimit(values: QuoteFormValues = {}) {
  return buildQuoteMailto(values).length > QUOTE_MAILTO_LENGTH_LIMIT;
}

export function buildQuoteMailto(values: QuoteFormValues = {}) {
  const company = value(values, 'companyName') || 'Website enquiry';
  const subject = `KS WAYS website quote request — ${company}`;
  const body = buildQuoteEmailText(values);

  return `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
