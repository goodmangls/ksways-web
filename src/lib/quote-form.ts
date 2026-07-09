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
  commodity?: string;
  hsCode?: string;
  packageCount?: string;
  grossWeight?: string;
  dimensions?: string;
  cbm?: string;
  cargoReadyDate?: string;
  containerType?: string;
  containerQuantity?: string;
  pickupDeliveryScope?: string;
  temperatureRange?: string;
  unNumber?: string;
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

const quoteServiceDefaults: Record<QuoteServiceKey, QuoteFormValues> = {
  'special-cargo': {
    enquiryContext: 'Special Cargo Korea',
    transportMode: 'Not sure',
    shipmentType: 'Not sure',
    specialHandling: 'Special cargo review — DG / perishables / temperature-sensitive / oversized / high-value / fragile / urgent cargo.',
    additionalNotes: 'Source page: /services/special-cargo-korea. Please review feasibility, required documents, and practical ocean/air routing options.',
  },
};

export function getQuoteInitialValues(service?: string | string[] | null): QuoteFormValues {
  const key = Array.isArray(service) ? service[0] : service;

  if (key === 'special-cargo') {
    return quoteServiceDefaults[key];
  }

  return { transportMode: 'Not sure', shipmentType: 'Not sure' };
}

type QuoteFormField = {
  name: keyof QuoteFormValues;
  label: string;
  placeholder: string;
  section: 'company' | 'route' | 'cargo' | 'ocean' | 'handling';
  required?: boolean;
  type?: 'text' | 'email' | 'date' | 'textarea' | 'select';
  options?: string[];
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
  { name: 'commodity', label: 'Commodity', placeholder: 'Cosmetics, machinery parts, garments...', section: 'cargo', required: true },
  { name: 'hsCode', label: 'HS code', placeholder: '3304.99', section: 'cargo' },
  { name: 'packageCount', label: 'Package count', placeholder: '12 cartons / 2 pallets', section: 'cargo' },
  { name: 'grossWeight', label: 'Gross weight', placeholder: '480 kg', section: 'cargo' },
  { name: 'dimensions', label: 'Dimensions', placeholder: '120 x 80 x 150 cm x 2 pallets', section: 'cargo' },
  { name: 'cbm', label: 'CBM / volume', placeholder: '2.88 CBM', section: 'cargo' },
  { name: 'cargoReadyDate', label: 'Cargo ready date', placeholder: 'YYYY-MM-DD', section: 'cargo', type: 'date' },
  { name: 'containerType', label: 'Ocean container / equipment', placeholder: 'Select equipment', section: 'ocean', type: 'select', options: ['Not sure / N/A', '20FT Dry', '40FT Dry', '40FT High Cube', '45FT High Cube', '20FT Reefer', '40FT Reefer', 'Open Top', 'Flat Rack', 'Tank / ISO tank', 'Breakbulk / RoRo'] },
  { name: 'containerQuantity', label: 'Container quantity', placeholder: '1 x 40HC / 2 x 20FT / LCL only', section: 'ocean' },
  { name: 'temperatureRange', label: 'Temperature range', placeholder: '+2~+8°C / -18°C / ambient', section: 'handling' },
  { name: 'unNumber', label: 'DG / UN number', placeholder: 'UN3481, Class 9 / non-DG', section: 'handling' },
  { name: 'targetSchedule', label: 'Target schedule / deadline', placeholder: 'ETD after 2026-07-05 / arrive before 2026-08-10', section: 'handling' },
  { name: 'targetRate', label: 'Target rate / budget', placeholder: 'Optional target rate or buying guidance', section: 'handling' },
  { name: 'specialHandling', label: 'Special handling', placeholder: 'DG, reefer, fragile, oversized, high-value, inspection, fumigation...', section: 'handling', type: 'textarea' },
  { name: 'additionalNotes', label: 'Additional notes', placeholder: 'Carrier preference, free time, customs, insurance, warehouse needs, attachments...', section: 'handling', type: 'textarea' },
];

const value = (values: QuoteFormValues, key: keyof QuoteFormValues) => values[key]?.trim() ?? '';

export function buildQuoteMailto(values: QuoteFormValues = {}) {
  const company = value(values, 'companyName') || 'Website enquiry';
  const subject = `KS WAYS website quote request — ${company}`;
  const body = [
    'Dear KS WAYS team,',
    '',
    'Please review the website quote request below.',
    '',
    '[Company / Contact]',
    `- Enquiry context: ${value(values, 'enquiryContext')}`,
    `- Company name: ${value(values, 'companyName')}`,
    `- Contact person / title: ${value(values, 'contactName')}`,
    `- Email / phone: ${value(values, 'emailOrPhone')}`,
    '',
    '[Mode / Route]',
    `- Transport mode: ${value(values, 'transportMode')}`,
    `- Shipment type: ${value(values, 'shipmentType')}`,
    `- Origin: ${value(values, 'origin')}`,
    `- Destination: ${value(values, 'destination')}`,
    `- Incoterms: ${value(values, 'incoterms')}`,
    `- Pickup / delivery scope: ${value(values, 'pickupDeliveryScope')}`,
    '',
    '[Cargo]',
    `- Commodity: ${value(values, 'commodity')}`,
    `- HS code: ${value(values, 'hsCode')}`,
    `- Package count: ${value(values, 'packageCount')}`,
    `- Gross weight: ${value(values, 'grossWeight')}`,
    `- Dimensions: ${value(values, 'dimensions')}`,
    `- CBM / volume: ${value(values, 'cbm')}`,
    `- Cargo ready date: ${value(values, 'cargoReadyDate')}`,
    '',
    '[Ocean / Equipment]',
    `- Container / equipment: ${value(values, 'containerType')}`,
    `- Container quantity: ${value(values, 'containerQuantity')}`,
    '',
    '[Handling / Commercial]',
    `- Temperature range: ${value(values, 'temperatureRange')}`,
    `- DG / UN number: ${value(values, 'unNumber')}`,
    `- Target schedule / deadline: ${value(values, 'targetSchedule')}`,
    `- Target rate / budget: ${value(values, 'targetRate')}`,
    `- Special handling: ${value(values, 'specialHandling')}`,
    `- Additional notes: ${value(values, 'additionalNotes')}`,
    '',
  ].join('\n');

  return `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
