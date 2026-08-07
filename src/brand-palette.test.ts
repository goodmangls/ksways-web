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
 * The sweep walks the whole repo, not just `src/` — the first pass of this
 * pivot was scoped to `src/` and missed six `public/assets/*.svg` files holding
 * 102 retired-palette occurrences. Those were orphaned (superseded by Unsplash
 * photography in fb91a87) and have since been deleted, so a repo-wide sweep is
 * clean and stays that way.
 *
 * `.md` is deliberately excluded so that documentation *about* the pivot may
 * name the retired colors; DESIGN.md is asserted separately below instead.
 */

const ROOT = process.cwd();
const SELF = 'brand-palette.test.ts';
const SKIP_DIRS = new Set(['node_modules', '.next', '.git', 'docs']);
const SKIP_FILES = new Set([SELF, 'package-lock.json', 'tsconfig.tsbuildinfo']);

const PALETTE = {
  accent: '#b88a5a',
  accentStrong: '#a5794d',
  accentSoft: '#e7c99a',
  accentInk: '#805d3b',
  steel: '#5f6f78',
} as const;

/** Colors from the retired neon-teal identity. None may survive anywhere in the repo. */
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

/** Every file type that can put a color in front of a user: code, styles, vector art, manifests. */
function collectRenderableFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    if (statSync(join(dir, entry)).isDirectory()) {
      return SKIP_DIRS.has(entry) ? [] : collectRenderableFiles(join(dir, entry));
    }
    if (SKIP_FILES.has(entry)) return [];
    return /\.(ts|tsx|css|svg|json)$/.test(entry) ? [join(dir, entry)] : [];
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

const sourceFiles = collectRenderableFiles(ROOT);
const globalsCss = readFileSync(join(ROOT, 'src/app/globals.css'), 'utf8');
const designMd = readFileSync(join(ROOT, 'DESIGN.md'), 'utf8');

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

  it('carries no retired neon-teal color anywhere in the repo', () => {
    const offenders = sourceFiles.flatMap((file) => {
      const contents = readFileSync(file, 'utf8').toLowerCase();
      return RETIRED.filter((color) => contents.includes(color)).map(
        (color) => `${file.replace(`${ROOT}/`, '')} → ${color}`,
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
        .map(({ index }) => `${file.replace(`${ROOT}/`, '')}:${index + 1}`),
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
    const content = readFileSync(join(ROOT, 'src/lib/content.ts'), 'utf8');
    expect(content).not.toContain('kicker');
  });
});
