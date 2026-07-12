import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildMailto } from './ContactActions';

const source = readFileSync(join(process.cwd(), 'src/components/ContactActions.tsx'), 'utf8');

function decodeMailto(href: string) {
  const url = new URL(href);
  return {
    protocol: url.protocol,
    email: url.pathname,
    subject: url.searchParams.get('subject') ?? '',
    body: url.searchParams.get('body') ?? '',
  };
}

describe('structured KS WAYS mailto templates', () => {
  it('builds an English quote request that collects operational shipment details', () => {
    const mailto = decodeMailto(buildMailto('info@ksways.co', 'en', 'quote'));

    expect(mailto.protocol).toBe('mailto:');
    expect(mailto.email).toBe('info@ksways.co');
    expect(mailto.subject).toBe('KS WAYS freight quote request');
    expect(mailto.body).toContain('Origin / destination');
    expect(mailto.body).toContain('Incoterms');
    expect(mailto.body).toContain('HS code');
    expect(mailto.body).toContain('Cargo ready date');
    expect(mailto.body).toContain('Special handling');
  });

  it('can include service-page context while preserving the structured quote fields', () => {
    const mailto = decodeMailto(
      buildMailto('info@ksways.co', 'en', 'quote', {
        contextTitle: 'Special cargo review for Korea-connected shipments',
      }),
    );

    expect(mailto.subject).toBe('KS WAYS freight quote request — Special cargo review for Korea-connected shipments');
    expect(mailto.body).toContain('[Service context]');
    expect(mailto.body).toContain('Special cargo review for Korea-connected shipments');
    expect(mailto.body).toContain('Temperature / DG / oversized / high-value requirements');
  });

  it('builds a Korean quote request with the same core shipment fields', () => {
    const mailto = decodeMailto(buildMailto('info@ksways.co', 'kr', 'quote'));

    expect(mailto.subject).toBe('KS WAYS 견적 문의');
    expect(mailto.body).toContain('출발지 / 도착지');
    expect(mailto.body).toContain('Incoterms');
    expect(mailto.body).toContain('HS Code');
    expect(mailto.body).toContain('화물 준비일');
    expect(mailto.body).toContain('특수 핸들링');
  });

  it('routes the visible quote CTA to the structured quote page instead of opening a raw mailto draft', () => {
    expect(source).toContain("const quoteHref = '/quote';");
    expect(source).toContain('{ href: quoteHref, label: quoteLabel');
  });
});
