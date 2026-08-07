import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { MODERN_BROWSERSLIST_TARGET } from 'next/dist/shared/lib/constants';

/**
 * Pins the browser support target.
 *
 * This project deliberately ships no `browserslist` config. Two reasons:
 * Tailwind v4 never reads one (it drives lightningcss with its own targets), so
 * a config would not affect the CSS at all; and Next.js does read one, which
 * means copying its default into our package.json would freeze us behind
 * whenever Next raises that default.
 *
 * The cost of having no config is that the effective target is invisible — it
 * lives inside Next. This test makes it visible and makes a change loud: if a
 * Next upgrade moves the target, this fails and DESIGN.md "Browser Support" has
 * to be updated in the same commit.
 */

const DOCUMENTED_TARGET = ['chrome 111', 'edge 111', 'firefox 111', 'safari 16.4'];

describe('browser support target', () => {
  it('matches what DESIGN.md documents', () => {
    // Sorted so a reordering in Next's constant does not read as a target change.
    expect([...MODERN_BROWSERSLIST_TARGET].sort()).toEqual([...DOCUMENTED_TARGET].sort());
  });

  it('is stated in DESIGN.md rather than only living inside Next', () => {
    const designMd = readFileSync(join(process.cwd(), 'DESIGN.md'), 'utf8');
    for (const browser of DOCUMENTED_TARGET) {
      expect(designMd).toContain(browser);
    }
  });

  it('keeps the no-browserslist decision intact', () => {
    // A browserslist config would silently override the target this file pins.
    const pkg = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'));
    expect(pkg.browserslist).toBeUndefined();
  });
});
