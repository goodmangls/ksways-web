import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const footerSource = readFileSync(join(process.cwd(), 'src/components/SiteFooter.tsx'), 'utf8');
const homePageSource = readFileSync(join(process.cwd(), 'src/components/HomePage.tsx'), 'utf8');
const servicePageSource = readFileSync(join(process.cwd(), 'src/components/ServiceLandingPage.tsx'), 'utf8');
const quotePageSource = readFileSync(join(process.cwd(), 'src/app/quote/page.tsx'), 'utf8');

describe('KS WAYS global logistics footer', () => {
  it('renders a dedicated reusable footer landmark with global logistics trust sections', () => {
    expect(footerSource).toContain('<footer');
    expect(footerSource).toContain('aria-label="KS WAYS global logistics footer"');
    expect(footerSource).toContain('footer.credentials.map');
    expect(footerSource).toContain('footer.email');
    expect(footerSource).toContain('footer.phone');
    expect(footerSource).toContain('footer.fax');
    expect(footerSource).toContain('footer.address');
    expect(footerSource).toContain('tel:${footer.phone.replace');
  });

  it('keeps footer links usable on mobile', () => {
    expect(footerSource).toContain('min-h-11');
    expect(footerSource).toContain('grid gap-10');
  });

  it('keeps the legal/contact strip above floating messenger overlays', () => {
    expect(footerSource).toContain('pb-32');
    expect(footerSource).toContain('lg:pb-28');
    expect(footerSource).toContain('lg:grid-cols-[minmax(0,1fr)_auto]');
    expect(footerSource).toContain('basis-full text-white/42');
  });

  it('breaks the Korea country line out from the street address', () => {
    expect(footerSource).toContain("const countryLine = 'Seoul 07566, Republic of Korea'");
    expect(footerSource).toContain('address.replace(`, ${countryLine}`, \'\')');
    expect(footerSource).toContain('<span className="block">{countryLine}</span>');
  });

  it('mounts the shared footer on home, service/network, and quote pages', () => {
    expect(homePageSource).toContain('<SiteFooter footer={copy.footer} />');
    expect(servicePageSource).toContain('<SiteFooter footer={homeContent.en.footer} />');
    expect(quotePageSource).toContain('<SiteFooter footer={homeContent.en.footer} />');
  });
});
