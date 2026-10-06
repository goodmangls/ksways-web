// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  BodyText,
  bodyMeasures,
  bodyTextVariants,
  cardHeadingSizes,
  SectionHeading,
  sectionHeadingBase,
  sectionHeadingSizes,
} from './Typography';

// The numbers below are DESIGN.md "Readability" / "Typography", restated so a
// change to either side fails here instead of drifting quietly.
const BODY_LEADING_EN = { min: 1.6, max: 1.65 };
const BODY_LEADING_KO = { min: 1.75, max: 1.8 };
const DISPLAY_LEADING_KO_MIN = 1.12;
const SECTION_MAX_PX = 52;
const MEASURE_EN_EM = 34;
const MEASURE_KO_EM = 36;
const HANGUL_TRACKING_MIN_EM = -0.02;
const TEXT_TOKEN_OPACITY = 76; // text-subtle / text-dark-subtle

const ROOT = process.cwd();
const globalsCss = readFileSync(join(ROOT, 'src/app/globals.css'), 'utf8');
const componentSources = readdirSync(join(ROOT, 'src/components'))
  .filter((file) => file.endsWith('.tsx') && !file.includes('.test.'))
  .map((file) => ({ file, text: readFileSync(join(ROOT, 'src/components', file), 'utf8') }));

const leadingOf = (classes: string) => Number(classes.match(/leading-\[([\d.]+)\]/)?.[1]);

/** Declarations of one `:root:lang(ko) .<hook>` rule. */
function koRule(hook: string): Record<string, string> {
  const start = globalsCss.indexOf(`:root:lang(ko) .${hook} {`);
  if (start === -1) return {};
  const body = globalsCss.slice(globalsCss.indexOf('{', start) + 1, globalsCss.indexOf('}', start));
  return Object.fromEntries(
    body
      .split(';')
      .map((decl) => decl.split(':').map((part) => part.trim()))
      .filter(([prop, value]) => prop && value),
  );
}

describe('Typography rules (DESIGN.md "Readability")', () => {
  it('caps section headings at 52px with 1.08 leading', () => {
    expect(leadingOf(sectionHeadingBase)).toBe(1.08);
    for (const classes of Object.values(sectionHeadingSizes)) {
      const pxValues = [...classes.matchAll(/(\d+)px/g)].map((m) => Number(m[1]));
      expect(Math.max(...pxValues)).toBeLessThanOrEqual(SECTION_MAX_PX);
    }
  });

  it('keeps card headings in the 22–30px band', () => {
    expect(cardHeadingSizes.sm).toBe('text-[22px]');
    expect(cardHeadingSizes.md).toBe('text-2xl'); // 24px
  });

  it('sets English body leading within 1.6–1.65 and text at the 76% token, never smaller than 16px', () => {
    for (const [size, tones] of Object.entries(bodyTextVariants)) {
      for (const classes of Object.values(tones)) {
        const leading = leadingOf(classes);
        expect(leading, size).toBeGreaterThanOrEqual(BODY_LEADING_EN.min);
        expect(leading, size).toBeLessThanOrEqual(BODY_LEADING_EN.max);
        expect(classes).toMatch(new RegExp(`/${TEXT_TOKEN_OPACITY}\\b`));
        expect(classes).not.toMatch(/text-(xs|sm|\[1[0-5]px\])/);
      }
    }
  });

  it('never offers a measure wider than 34em', () => {
    for (const classes of Object.values(bodyMeasures)) {
      const em = Number(classes.match(/max-w-\[(\d+)em\]/)?.[1]);
      expect(em).toBeLessThanOrEqual(MEASURE_EN_EM);
    }
  });

  it('gives Korean pages their own leading, tracking, and measure through every hook the components use', () => {
    const hooks = new Set(
      [sectionHeadingBase, ...Object.values(bodyTextVariants).flatMap((tones) => Object.values(tones)), bodyMeasures.default]
        .flatMap((classes) => classes.split(' '))
        .filter((cls) => cls.startsWith('ks-')),
    );
    expect([...hooks].sort()).toEqual(['ks-measure', 'ks-type-body', 'ks-type-body-lg', 'ks-type-section']);

    for (const hook of ['ks-type-body', 'ks-type-body-lg']) {
      const leading = Number(koRule(hook)['line-height']);
      expect(leading, hook).toBeGreaterThanOrEqual(BODY_LEADING_KO.min);
      expect(leading, hook).toBeLessThanOrEqual(BODY_LEADING_KO.max);
    }
    for (const hook of ['ks-type-section', 'ks-type-hero']) {
      const rule = koRule(hook);
      expect(Number(rule['line-height']), hook).toBeGreaterThanOrEqual(DISPLAY_LEADING_KO_MIN);
      expect(parseFloat(rule['letter-spacing']), hook).toBeGreaterThanOrEqual(HANGUL_TRACKING_MIN_EM);
    }
    expect(koRule('ks-measure')['max-width']).toBe(`${MEASURE_KO_EM}em`);
  });

  it('marks every page-level display heading for the Korean override', () => {
    // Hero and closing headlines are not SectionHeading, so they carry the hook by hand.
    for (const file of ['HomePage.tsx', 'ServiceLandingPage.tsx']) {
      const text = componentSources.find((source) => source.file === file)!.text;
      const displayHeadings = [...text.matchAll(/<h[12][^>]*font-black[^>]*>/g)].map((m) => m[0]);
      expect(displayHeadings.length, file).toBeGreaterThan(0);
      for (const heading of displayHeadings) expect(heading, file).toContain('ks-type-hero');
    }
  });

  it('leaves no 1.7 body leading or sub-12px text in any component', () => {
    const offenders = componentSources.flatMap(({ file, text }) =>
      [...text.matchAll(/leading-\[1\.7\d*\]|text-\[(?:[0-9]|1[01])px\]/g)].map((m) => `${file}: ${m[0]}`),
    );
    expect(offenders).toEqual([]);
  });
});

describe('Typography components', () => {
  afterEach(cleanup);

  it('renders a section heading as an h2 that keeps its id and layout class', () => {
    render(<SectionHeading id="x-heading" size="md" className="max-w-[15em]">Heading</SectionHeading>);
    const heading = screen.getByRole('heading', { level: 2, name: 'Heading' });
    expect(heading).toHaveAttribute('id', 'x-heading');
    expect(heading.className).toContain('max-w-[15em]');
    expect(heading.className).toContain(sectionHeadingSizes.md);
  });

  it('renders body text as a paragraph by default and as a span when asked', () => {
    const { container } = render(
      <>
        <BodyText measure="default">Paragraph</BodyText>
        <BodyText as="span" size="md" tone="onDark">Inline</BodyText>
      </>,
    );
    const [paragraph, inline] = [container.querySelector('p'), container.querySelector('span')];
    expect(paragraph?.className).toContain('ks-measure max-w-[34em]');
    expect(paragraph?.className).toContain(bodyTextVariants.lg.onLight);
    expect(inline?.className).toContain(bodyTextVariants.md.onDark);
  });
});
