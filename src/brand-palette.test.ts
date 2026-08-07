import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Guards the bronze brand palette introduced in the 2026-08 pivot.
 *
 * The pivot originally shipped applied to HomePage.tsx only: five other
 * components, DESIGN.md, and the CSS custom properties still carried the old
 * neon-teal identity while every existing gate stayed green. The pre-existing
 * suite could not catch it because it asserted *token references*
 * (`var(--ks-cyan)`) rather than the values behind them.
 *
 * These tests assert the values, site-wide, and keep DESIGN.md honest.
 *
 * Scope is deliberately `src/**` plus DESIGN.md — everything that renders.
 * `public/assets/*.svg` is NOT scanned: those six files still carry the retired
 * neon palette (102 occurrences) but are orphaned — nothing in the repo
 * references them, and the hero renders Unsplash photography instead. If any of
 * them is ever wired back up, recolor it first and widen this scan.
 */

const SRC = join(process.cwd(), 'src');
const SELF = 'brand-palette.test.ts';

const PALETTE = {
  accent: '#b88a5a',
  accentStrong: '#a5794d',
  accentSoft: '#e7c99a',
  accentInk: '#805d3b',
  steel: '#5f6f78',
} as const;

/** Colors from the retired neon-teal identity. None may survive anywhere in src/. */
const RETIRED = [
  '#21d4c2', // route teal
  '#6fffe7', // cyan highlight
  '#2d8cff', // network blue
  '#0b7f78', // dark teal (form labels)
  '#007f74', // link green
  '#e8fbf8', // mint tint
  '33,212,194', // teal in rgba() form — the variant a hex-only grep misses
  '111,255,231',
  '45,140,255',
] as const;

function collectSourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return collectSourceFiles(full);
    if (entry === SELF) return [];
    return /\.(ts|tsx|css)$/.test(entry) ? [full] : [];
  });
}

function relativeLuminance(hex: string): number {
  const value = parseInt(hex.slice(1), 16);
  const channel = (raw: number) => {
    const c = raw / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return (
    0.2126 * channel((value >> 16) & 255) +
    0.7152 * channel((value >> 8) & 255) +
    0.0722 * channel(value & 255)
  );
}

function contrastRatio(foreground: string, background: string): number {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  const [lighter, darker] = a > b ? [a, b] : [b, a];
  return (lighter + 0.05) / (darker + 0.05);
}

const sourceFiles = collectSourceFiles(SRC);
const globalsCss = readFileSync(join(SRC, 'app/globals.css'), 'utf8');
const designMd = readFileSync(join(process.cwd(), 'DESIGN.md'), 'utf8');

describe('brand palette', () => {
  it('defines the bronze accent family as role-named custom properties', () => {
    expect(globalsCss).toContain(`--ks-accent: ${PALETTE.accent};`);
    expect(globalsCss).toContain(`--ks-accent-strong: ${PALETTE.accentStrong};`);
    expect(globalsCss).toContain(`--ks-accent-soft: ${PALETTE.accentSoft};`);
    expect(globalsCss).toContain(`--ks-accent-ink: ${PALETTE.accentInk};`);
    expect(globalsCss).toContain(`--ks-steel: ${PALETTE.steel};`);
  });

  it('drives ::selection and :focus-visible from the accent tokens, not literals', () => {
    expect(globalsCss).toContain('background: var(--ks-accent);');
    expect(globalsCss).toContain('outline: 3px solid var(--ks-accent-soft);');
  });

  it('carries no retired neon-teal color anywhere in src/', () => {
    const offenders = sourceFiles.flatMap((file) => {
      const contents = readFileSync(file, 'utf8').toLowerCase();
      return RETIRED.filter((color) => contents.includes(color)).map(
        (color) => `${file.replace(`${process.cwd()}/`, '')} → ${color}`,
      );
    });

    // A partial pivot is the failure this guard exists to catch: it must name
    // every file left behind, not merely fail.
    expect(offenders).toEqual([]);
  });

  it('never pairs white text with the bronze accent fill', () => {
    const offenders = sourceFiles.flatMap((file) =>
      readFileSync(file, 'utf8')
        .split('\n')
        .map((line, index) => ({ line, index }))
        .filter(
          ({ line }) =>
            (line.includes(`bg-[${PALETTE.accent}]`) || line.includes(`bg-[${PALETTE.accentStrong}]`)) &&
            /\btext-white\b/.test(line),
        )
        .map(({ index }) => `${file.replace(`${process.cwd()}/`, '')}:${index + 1}`),
    );

    expect(offenders).toEqual([]);
  });

  it('meets WCAG AA for every pairing DESIGN.md prescribes', () => {
    const ink = '#001112';
    const white = '#ffffff';

    // Normal text needs 4.5:1.
    expect(contrastRatio(ink, PALETTE.accent)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(ink, PALETTE.accentStrong)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(PALETTE.accentSoft, ink)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(PALETTE.accentInk, white)).toBeGreaterThanOrEqual(4.5);

    // The pairing that looks fine and is not — pinned so it cannot creep back.
    expect(contrastRatio(white, PALETTE.accent)).toBeLessThan(4.5);
  });

  it('keeps DESIGN.md frontmatter in step with the implemented palette', () => {
    expect(designMd).toContain(`tertiary: "${PALETTE.accent.toUpperCase()}"`);
    expect(designMd).toContain(`tertiary-hover: "${PALETTE.accentStrong.toUpperCase()}"`);
    expect(designMd).toContain(`accent-soft: "${PALETTE.accentSoft.toUpperCase()}"`);
    expect(designMd).toContain(`accent-ink: "${PALETTE.accentInk.toUpperCase()}"`);
    expect(designMd).toContain(`steel: "${PALETTE.steel.toUpperCase()}"`);
  });

  it('leaves no orphaned kicker copy behind the removed section eyebrows', () => {
    const content = readFileSync(join(SRC, 'lib/content.ts'), 'utf8');
    expect(content).not.toContain('kicker');
  });
});
