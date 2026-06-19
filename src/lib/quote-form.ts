import { contactEmail } from './seo';

export type QuoteFormValues = {
  enquiryContext?: string;
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
  cargoReadyDate?: string;
  preferredMode?: string;
  targetSchedule?: string;
  specialHandling?: string;
  additionalNotes?: string;
};

export type QuoteServiceKey = 'special-cargo';

const quoteServiceDefaults: Record<QuoteServiceKey, QuoteFormValues> = {
  'special-cargo': {
    enquiryContext: 'Special Cargo Korea',
    preferredMode: 'Not sure',
    specialHandling: 'Special cargo review — DG / perishables / temperature-sensitive / oversized / high-value / fragile / urgent cargo.',
    additionalNotes: 'Source page: /services/special-cargo-korea. Please review feasibility, required documents, and practical ocean/air routing options.',
  },
};

export function getQuoteInitialValues(service?: string | string[] | null): QuoteFormValues {
  const key = Array.isArray(service) ? service[0] : service;

  if (key === 'special-cargo') {
    return quoteServiceDefaults[key];
  }

  return { preferredMode: 'Not sure' };
}

type QuoteFormField = {
  name: keyof QuoteFormValues;
  label: string;
  placeholder: string;
  required?: boolean;
  type?: 'text' | 'email' | 'date' | 'textarea' | 'select';
  options?: string[];
};

export const quoteFormFields: QuoteFormField[] = [
  { name: 'companyName', label: 'Company name', placeholder: 'Acme Trading Co.', required: true },
  { name: 'contactName', label: 'Contact person / title', placeholder: 'Jane Lee / Logistics Manager', required: true },
  { name: 'emailOrPhone', label: 'Email / phone', placeholder: 'jane@example.com / +82...', required: true, type: 'email' },
  { name: 'origin', label: 'Origin', placeholder: 'Busan, Korea', required: true },
  { name: 'destination', label: 'Destination', placeholder: 'Los Angeles, USA', required: true },
  { name: 'incoterms', label: 'Incoterms', placeholder: 'EXW / FOB / CIF / DAP' },
  { name: 'commodity', label: 'Commodity', placeholder: 'Cosmetics, machinery parts, garments...', required: true },
  { name: 'hsCode', label: 'HS code', placeholder: '3304.99' },
  { name: 'packageCount', label: 'Package count', placeholder: '12 cartons / 2 pallets' },
  { name: 'grossWeight', label: 'Gross weight', placeholder: '480 kg' },
  { name: 'dimensions', label: 'Dimensions', placeholder: '120 x 80 x 150 cm x 2 pallets' },
  { name: 'cargoReadyDate', label: 'Cargo ready date', placeholder: 'YYYY-MM-DD', type: 'date' },
  { name: 'preferredMode', label: 'Preferred mode', placeholder: 'Select mode', type: 'select', options: ['Ocean', 'Air', 'Express', 'Multimodal', 'Not sure'] },
  { name: 'targetSchedule', label: 'Target schedule / deadline', placeholder: 'Arrive before 2026-07-05' },
  { name: 'specialHandling', label: 'Special handling', placeholder: 'DG, temperature control, fragile, oversized, high-value...', type: 'textarea' },
  { name: 'additionalNotes', label: 'Additional notes', placeholder: 'Pickup/customs/insurance/warehouse needs, budget, attachments...', type: 'textarea' },
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
    '[Shipment]',
    `- Origin: ${value(values, 'origin')}`,
    `- Destination: ${value(values, 'destination')}`,
    `- Incoterms: ${value(values, 'incoterms')}`,
    `- Commodity: ${value(values, 'commodity')}`,
    `- HS code: ${value(values, 'hsCode')}`,
    `- Package count: ${value(values, 'packageCount')}`,
    `- Gross weight: ${value(values, 'grossWeight')}`,
    `- Dimensions: ${value(values, 'dimensions')}`,
    `- Cargo ready date: ${value(values, 'cargoReadyDate')}`,
    `- Preferred mode: ${value(values, 'preferredMode')}`,
    `- Target schedule / deadline: ${value(values, 'targetSchedule')}`,
    '',
    '[Special handling / support needed]',
    `- Special handling: ${value(values, 'specialHandling')}`,
    `- Additional notes: ${value(values, 'additionalNotes')}`,
    '',
  ].join('\n');

  return `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
