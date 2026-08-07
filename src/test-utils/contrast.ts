/**
 * WCAG relative-luminance and contrast-ratio math, shared by the palette and
 * focus-visible guards.
 *
 * These live in a helper rather than a test file because two independent guards
 * need them: `brand-palette.test.ts` (are the brand values themselves legible?)
 * and `focus-visible.test.ts` (is the focus indicator legible on every surface?).
 *
 * Reference: WCAG 2.1 relative luminance definition.
 */

/** Relative luminance of an `#rrggbb` color, per WCAG. */
export function relativeLuminance(hex: string): number {
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

/** Contrast ratio between two `#rrggbb` colors. Order-independent; 1:1 … 21:1. */
export function contrastRatio(foreground: string, background: string): number {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  const [lighter, darker] = a > b ? [a, b] : [b, a];
  return (lighter + 0.05) / (darker + 0.05);
}
