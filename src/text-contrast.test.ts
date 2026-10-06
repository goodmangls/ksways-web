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
 *
 * Since 2026-10-06 the floors are DESIGN.md's text opacity tokens, which sit a
 * margin above that bare AA minimum: `text-faint` (ink 64%) and `text-dark-faint`
 * (white 56%). A value at the AA edge passes on paper and fails the moment it
 * lands on a slightly different surface, so the floor is the token, not the edge.
 */

const COMPONENTS_DIR = join(process.cwd(), 'src/components');
const NAVY = '#001112';
const PAPER = '#f4f7f6';
const WHITE = '#ffffff';

const LIGHT_SURFACE_FLOOR = 64; // `text-faint` — navy ink over paper (the darker light surface)
const DARK_SURFACE_FLOOR = 56; // `text-dark-faint` — white ink over navy
// The bare WCAG AA edge, kept to prove the floors above have margin over it.
const LIGHT_AA_EDGE = 60;
const DARK_AA_EDGE = 48;

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
    expect(contrastRatio(blend(NAVY, PAPER, LIGHT_AA_EDGE / 100), PAPER)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(blend(NAVY, PAPER, (LIGHT_AA_EDGE - 4) / 100), PAPER)).toBeLessThan(4.5);
    expect(contrastRatio(blend(WHITE, NAVY, DARK_AA_EDGE / 100), NAVY)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(blend(WHITE, NAVY, (DARK_AA_EDGE - 6) / 100), NAVY)).toBeLessThan(4.5);
    // The enforced floors are the DESIGN.md tokens, at or above the edge.
    expect(LIGHT_SURFACE_FLOOR).toBeGreaterThanOrEqual(LIGHT_AA_EDGE);
    expect(DARK_SURFACE_FLOOR).toBeGreaterThanOrEqual(DARK_AA_EDGE);
  });

  it('keeps navy text on light surfaces at or above the floor', () => {
    expect(offenders(/text-\[#001112\]\/(\d+)/g, LIGHT_SURFACE_FLOOR)).toEqual([]);
  });

  it('keeps white text on dark surfaces at or above the floor', () => {
    expect(offenders(/text-white\/(\d+)/g, DARK_SURFACE_FLOOR)).toEqual([]);
  });
});
