import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { contrastRatio } from './test-utils/contrast';

/**
 * Opacity floors for text drawn as a translucent ink over the brand surfaces.
 *
 * The pages express secondary text as `text-[#001112]/NN` on paper/white and
 * `text-white/NN` on navy. Those opacities drifted low enough to fail WCAG AA:
 * navy at 56% measures 4.34:1 on paper, and the 11px footer labels at white/40
 * measured 3.79:1 on navy. The floors below are the smallest opacity that still
 * clears 4.5:1 on the worst surface each ink is used on — asserted from the
 * math, not picked by eye.
 */

const COMPONENTS_DIR = join(process.cwd(), 'src/components');
const NAVY = '#001112';
const PAPER = '#f4f7f6';
const WHITE = '#ffffff';

const LIGHT_SURFACE_FLOOR = 60; // navy ink over paper (the darker light surface)
const DARK_SURFACE_FLOOR = 48; // white ink over navy

function blend(fg: string, bg: string, alpha: number): string {
  const channels = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const [f, b] = [channels(fg), channels(bg)];
  return `#${f.map((c, i) => Math.round(c * alpha + b[i] * (1 - alpha)).toString(16).padStart(2, '0')).join('')}`;
}

const sources = readdirSync(COMPONENTS_DIR)
  .filter((file) => file.endsWith('.tsx') && !file.includes('.test.'))
  .map((file) => ({ file, text: readFileSync(join(COMPONENTS_DIR, file), 'utf8') }));

function offenders(pattern: RegExp, floor: number): string[] {
  return sources.flatMap(({ file, text }) =>
    [...text.matchAll(pattern)]
      .filter((match) => Number(match[1]) < floor)
      .map((match) => `${file}: ${match[0]}`),
  );
}

describe('text contrast floors', () => {
  it('derives the floors from WCAG AA rather than taste', () => {
    expect(contrastRatio(blend(NAVY, PAPER, LIGHT_SURFACE_FLOOR / 100), PAPER)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(blend(NAVY, PAPER, (LIGHT_SURFACE_FLOOR - 4) / 100), PAPER)).toBeLessThan(4.5);
    expect(contrastRatio(blend(WHITE, NAVY, DARK_SURFACE_FLOOR / 100), NAVY)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(blend(WHITE, NAVY, (DARK_SURFACE_FLOOR - 6) / 100), NAVY)).toBeLessThan(4.5);
  });

  it('keeps navy text on light surfaces at or above the floor', () => {
    expect(offenders(/text-\[#001112\]\/(\d+)/g, LIGHT_SURFACE_FLOOR)).toEqual([]);
  });

  it('keeps white text on dark surfaces at or above the floor', () => {
    expect(offenders(/text-white\/(\d+)/g, DARK_SURFACE_FLOOR)).toEqual([]);
  });

  it('keeps every label at or above the 12px floor', () => {
    const tiny = sources.flatMap(({ file, text }) =>
      [...text.matchAll(/text-\[(\d+(?:\.\d+)?)px\]/g)]
        .filter((match) => Number(match[1]) < 12)
        .map((match) => `${file}: ${match[0]}`),
    );
    expect(tiny).toEqual([]);
  });

  it('keeps text on the bronze action fill at full-strength ink', () => {
    // Translucent navy over bronze composites to a mid-tone: 68% measured 3.82:1.
    const BRONZE = '#b88a5a';
    expect(contrastRatio(blend(NAVY, BRONZE, 0.68), BRONZE)).toBeLessThan(4.5);
    const contact = sources.find(({ file }) => file === 'ContactActions.tsx')!.text;
    expect(contact).not.toMatch(/text-\[#001112\]\/\d+/);
  });

  it('draws form fields and choice cards with the control border, not a hairline', () => {
    const field = sources.find(({ file }) => file === 'QuoteField.tsx')!.text;
    const form = sources.find(({ file }) => file === 'QuoteForm.tsx')!.text;
    expect(field).toContain('border-[var(--ks-border-control)]');
    expect(form).toContain('border-[var(--ks-border-control)]');
    expect(field).not.toMatch(/border-\[#001112\]\/\d+/);
  });
});
