import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { contrastRatio } from './test-utils/contrast';

/**
 * Guards the keyboard focus indicator.
 *
 * Two independent failures motivated this file, both invisible to every gate:
 *   [A] the global ring was a single gold outline — 12.14:1 on dark surfaces but
 *       1.47:1 on paper and 1.59:1 on white (WCAG 1.4.11 needs 3:1).
 *   [B] QuoteForm's shared input class set `outline-none` and replaced the
 *       indicator with a 14%-opacity ring measuring 1.14:1 — effectively no
 *       focus indicator at all across 28 field definitions, i.e. WCAG 2.4.7
 *       Focus Visible (Level A) on the site's only conversion path.
 *
 * [B] is the reason these tests police `outline-none` and `focus:ring` as well
 * as the color math: a component silently defeating the global rule is the
 * failure mode, and contrast assertions alone would not have caught it.
 */

const ROOT = process.cwd();
const globalsCss = readFileSync(join(ROOT, 'src/app/globals.css'), 'utf8');

/** The two rings, and every surface they can land on. */
const RING_OUTER = '#e7c99a'; // --ks-accent-soft (gold)
const RING_INNER = '#001112'; // --ks-navy
const SURFACES = [
  ['hero / network / footer', '#001112'],
  ['section paper', '#f4f7f6'],
  ['white card', '#ffffff'],
] as const;

/** WCAG 1.4.11 Non-text Contrast. */
const MIN_CONTRAST = 3;

function focusVisibleBlock(css: string): string {
  const start = css.indexOf(':focus-visible');
  if (start === -1) return '';
  return css.slice(start, css.indexOf('}', start) + 1);
}

function collectFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return collectFiles(full);
    return /\.(ts|tsx|css)$/.test(entry) ? [full] : [];
  });
}

/**
 * Strips comments before scanning. The banned utilities have to be *named* in
 * prose — in the very comments explaining why they are banned — and a guard that
 * cannot tell code from commentary would flag its own documentation.
 */
function codeOnly(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
}

/** Files whose *code* matches, with comments discounted. */
function filesMatching(pattern: RegExp): string[] {
  return collectFiles(join(ROOT, 'src'))
    .filter((file) => !file.endsWith('focus-visible.test.ts'))
    .filter((file) => pattern.test(codeOnly(readFileSync(file, 'utf8'))))
    .map((file) => file.replace(`${ROOT}/`, ''));
}

describe('focus indicator', () => {
  const block = focusVisibleBlock(globalsCss);

  it('draws two layers, not one', () => {
    expect(block).toContain('outline:');
    expect(block).toContain('box-shadow:');
  });

  it('sources both ring colors from brand tokens rather than literals', () => {
    expect(block).toContain('var(--ks-accent-soft)');
    expect(block).toContain('var(--ks-navy)');
    expect(block).not.toMatch(/#[0-9a-fA-F]{6}/);
  });

  it('keeps the rings flush so the page surface never shows between them', () => {
    // A 2px inner spread against a 2px offset leaves no gap. A wider offset would
    // put the page background between the rings and make contrast situational.
    expect(block).toContain('outline-offset: 2px');
    expect(block).toMatch(/box-shadow:\s*0 0 0 2px/);
  });

  it.each(SURFACES)('stays visible on the %s surface', (_label, surface) => {
    const best = Math.max(contrastRatio(RING_OUTER, surface), contrastRatio(RING_INNER, surface));
    expect(best).toBeGreaterThanOrEqual(MIN_CONTRAST);
  });

  it('keeps the two rings distinguishable from each other', () => {
    // Without this, a future palette tweak could collapse the pair into what
    // reads as a single band — the C candidate rejected in design (1.94:1).
    expect(contrastRatio(RING_OUTER, RING_INNER)).toBeGreaterThanOrEqual(MIN_CONTRAST);
  });

  it('lets no component strip the indicator with outline-none', () => {
    expect(filesMatching(/\boutline-none\b/)).toEqual([]);
  });

  it('lets no component shadow the inner ring with a Tailwind ring utility', () => {
    // Tailwind's ring utilities compile to box-shadow and would overwrite the
    // inner navy layer — whether applied on focus or as a static emphasis state
    // on an element that can also receive focus.
    expect(filesMatching(/\bfocus:ring-|\bring-\d/)).toEqual([]);
  });
});

/**
 * Reachability, as distinct from visibility of the ring itself.
 *
 * The hero photo credits fade in and out with the background slideshow. They were
 * hidden with `opacity` alone, which does NOT remove an element from the tab
 * order: four of the six Unsplash links sat in the tab sequence while completely
 * invisible, and under `prefers-reduced-motion` they did so permanently. That is
 * WCAG 2.4.7 Focus Visible (Level A) — the best focus ring in the world does not
 * help on an element nobody can see.
 *
 * These assertions are static, and that is a deliberate choice rather than a
 * repeat of the mistake this suite was written to catch. The earlier failure
 * asserted a *token reference* while the breakage lived in a property nobody
 * checked. Here the assertions cover the exact property that governs the
 * behavior, in both places it must appear. The declaration-to-behavior link was
 * established empirically in Chromium by freezing the animation at fixed
 * progress: `visibility` stays `visible` through the fade (opacity .78, .20) and
 * flips to `hidden` only at opacity 0, and a real tab sweep confirmed the hidden
 * element's links drop out of the sequence while a no-`visibility` control kept
 * them. Automating that in CI is not available here — `prefers-reduced-motion`
 * emulation needs a CDP method the browser tool denies by default, and this repo
 * has no Playwright.
 */
describe('hidden hero credits stay out of the tab order', () => {
  /** Extracts a brace-balanced block starting at `marker`. */
  function blockAt(css: string, marker: string): string {
    const start = css.indexOf(marker);
    if (start === -1) return '';
    let depth = 0;
    for (let i = css.indexOf('{', start); i < css.length; i += 1) {
      if (css[i] === '{') depth += 1;
      else if (css[i] === '}') {
        depth -= 1;
        if (depth === 0) return css.slice(start, i + 1);
      }
    }
    return '';
  }

  /** Every `{ ... }` rule body inside a block, innermost only. */
  function ruleBodies(block: string): string[] {
    return [...block.matchAll(/\{([^{}]*)\}/g)].map((m) => m[1]);
  }

  const keyframes = blockAt(globalsCss, '@keyframes ks-hero-bg-cycle');
  const reducedMotion = blockAt(globalsCss, '@media (prefers-reduced-motion: reduce)');

  it.each([
    ['keyframes', () => keyframes, ''],
    ['reduced-motion overrides', () => reducedMotion, ' !important'],
  ])('pairs every opacity:0 with visibility:hidden in the %s', (_label, getBlock, bang) => {
    const block = getBlock();
    expect(block).not.toBe('');

    const unpaired = ruleBodies(block)
      .filter((body) => new RegExp(`opacity:\\s*0${bang};`).test(body))
      .filter((body) => !new RegExp(`visibility:\\s*hidden${bang};`).test(body));

    expect(unpaired).toEqual([]);
  });

  it.each([
    ['keyframes', () => keyframes, ''],
    ['reduced-motion overrides', () => reducedMotion, ' !important'],
  ])('pairs every opacity:1 with visibility:visible in the %s', (_label, getBlock, bang) => {
    // The inverse guard: hiding too eagerly would drop the *visible* credit out
    // of the tab order, which is a worse regression than the one being fixed.
    const block = getBlock();
    expect(block).not.toBe('');

    const unpaired = ruleBodies(block)
      .filter((body) => new RegExp(`opacity:\\s*1${bang};`).test(body))
      .filter((body) => !new RegExp(`visibility:\\s*visible${bang};`).test(body));

    expect(unpaired).toEqual([]);
  });

  it('pairs opacity with visibility in the base .ks-hero-bg-* rules too', () => {
    // Checking only the keyframes is not enough, and this test exists because
    // that gap shipped: `animation-delay` is positive (7s, 14s), and with no
    // `animation-fill-mode` the keyframes do not apply during the delay. What
    // applies is the base rule — where `opacity: 0` without `visibility` left the
    // credits tab-reachable for the first 14 seconds after load. A real tab sweep
    // caught it while these assertions were green.
    const heroRules = [...globalsCss.matchAll(/(\.ks-hero-bg-[\w-]*(?::[\w-]+)?[^{}]*)\{([^{}]*)\}/g)];
    expect(heroRules.length).toBeGreaterThan(0);

    const unpaired = heroRules
      .filter(([, , body]) => /opacity:\s*[01]\s*(?:!important)?;/.test(body))
      .filter(([, , body]) => {
        const wantsHidden = /opacity:\s*0\s*(?:!important)?;/.test(body);
        return !new RegExp(`visibility:\\s*${wantsHidden ? 'hidden' : 'visible'}\\s*(?:!important)?;`).test(body);
      })
      .map(([, selector]) => selector.trim());

    expect(unpaired).toEqual([]);
  });
});
