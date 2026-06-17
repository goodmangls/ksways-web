import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const source = readFileSync(join(process.cwd(), 'src/components/HomePage.tsx'), 'utf8');

describe('HomePage mobile optimization classes', () => {
  it('relaxes mobile display heading line-height while preserving tighter desktop display rhythm', () => {
    expect(source).toContain('leading-[1.04]');
    expect(source).toContain('sm:leading-[.9]');
    expect(source).toContain('sm:leading-[.96]');
  });

  it('stacks hero CTAs as full-width touch targets on mobile and restores inline CTAs on larger screens', () => {
    expect(source).toContain('flex flex-col items-stretch gap-3 sm:flex-row');
    expect(source).toContain('w-full justify-center');
    expect(source).toContain('sm:w-auto');
  });

  it('keeps compact navigation and FAQ controls at a minimum 44px mobile touch height', () => {
    expect(source).toContain('group flex min-h-11 items-center');
    expect(source).toContain('min-h-11 cursor-pointer');
  });
});
