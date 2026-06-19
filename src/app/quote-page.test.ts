import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('quote page route integration', () => {
  it('adds a dedicated /quote page with the structured quote form component', () => {
    const page = readFileSync(join(process.cwd(), 'src/app/quote/page.tsx'), 'utf8');

    expect(page).toContain('metadata');
    expect(page).toContain('Freight Quote Request');
    expect(page).toContain('<QuoteForm');
  });

  it('connects /quote from sitemap and homepage quote CTAs', () => {
    const sitemap = readFileSync(join(process.cwd(), 'src/app/sitemap.ts'), 'utf8');
    const homePage = readFileSync(join(process.cwd(), 'src/components/HomePage.tsx'), 'utf8');
    const readme = readFileSync(join(process.cwd(), 'README.md'), 'utf8');

    expect(sitemap).toContain("'/quote'");
    expect(homePage).toContain("const quoteHref = '/quote'");
    expect(readme).toContain('/quote — structured freight quote request form');
  });

  it('routes special cargo service CTAs to the contextual quote form', () => {
    const serviceLandingPage = readFileSync(join(process.cwd(), 'src/components/ServiceLandingPage.tsx'), 'utf8');
    const quotePage = readFileSync(join(process.cwd(), 'src/app/quote/page.tsx'), 'utf8');

    expect(serviceLandingPage).toContain("/quote?service=${page.quoteServiceKey}");
    expect(serviceLandingPage).toContain('quoteServiceKey');
    expect(quotePage).toContain('searchParams');
    expect(quotePage).toContain('getQuoteInitialValues');
  });
});
