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
});
