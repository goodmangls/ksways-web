import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const source = readFileSync(join(process.cwd(), 'src/components/HomePage.tsx'), 'utf8');

describe('HomePage global logistics footer', () => {
  it('renders a dedicated footer landmark with global logistics trust sections', () => {
    expect(source).toContain('<footer');
    expect(source).toContain('aria-label="KS WAYS global logistics footer"');
    expect(source).toContain('copy.footer.credentials.map');
    expect(source).toContain('copy.footer.email');
    expect(source).toContain('copy.footer.phone');
    expect(source).toContain('copy.footer.fax');
    expect(source).toContain('copy.footer.address');
    expect(source).toContain('tel:${copy.footer.phone.replace');
  });

  it('keeps footer links usable on mobile', () => {
    expect(source).toContain('min-h-11');
    expect(source).toContain('grid gap-10');
  });

  it('keeps the legal/contact strip above floating messenger overlays', () => {
    expect(source).toContain('pb-32');
    expect(source).toContain('lg:pb-28');
    expect(source).toContain('lg:grid-cols-[minmax(0,1fr)_auto]');
    expect(source).toContain('basis-full text-white/42');
  });
});
