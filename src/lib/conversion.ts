export const conversionEventNames = {
  quoteCta: 'ksways_quote_cta_click',
  mailto: 'ksways_mailto_click',
  serviceClick: 'ksways_service_click',
  rfqTemplateDownload: 'ksways_rfq_template_download',
} as const;

export type ConversionEventName = (typeof conversionEventNames)[keyof typeof conversionEventNames];

export type ConversionEventPayload = {
  event: ConversionEventName;
  location?: string;
  locale?: string;
  href?: string;
};

function safeAttr(value: string | undefined) {
  return value?.trim() || undefined;
}

export function conversionDataAttributes(event: ConversionEventName, payload: Omit<ConversionEventPayload, 'event'> = {}) {
  return {
    'data-conversion-event': event,
    'data-conversion-location': safeAttr(payload.location),
    'data-conversion-locale': safeAttr(payload.locale),
    'data-conversion-href': safeAttr(payload.href),
  };
}
