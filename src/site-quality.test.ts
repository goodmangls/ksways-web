import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import nextConfig from '../next.config';

describe('site quality hardening', () => {
  it('sets baseline production security headers for every route', async () => {
    expect(typeof nextConfig.headers).toBe('function');
    const headers = await nextConfig.headers?.();
    const globalHeaders = headers?.find((entry) => entry.source === '/(.*)')?.headers ?? [];
    const headerMap = new Map(globalHeaders.map((header) => [header.key.toLowerCase(), header.value]));

    expect(headerMap.get('strict-transport-security')).toContain('max-age=63072000');
    expect(headerMap.get('x-content-type-options')).toBe('nosniff');
    expect(headerMap.get('referrer-policy')).toBe('strict-origin-when-cross-origin');
    expect(headerMap.get('permissions-policy')).toContain('camera=()');
    expect(headerMap.get('x-frame-options')).toBe('DENY');
  });

  it('keeps README aligned with the public KS WAYS brand and current route set', () => {
    const readme = readFileSync(join(process.cwd(), 'README.md'), 'utf8');

    expect(readme).toContain('# KS WAYS Web');
    expect(readme).not.toMatch(/\bKSWAYS\b/);
    expect(readme).toContain('/services/air-freight-korea');
    expect(readme).toContain('/services/ocean-freight-korea');
    expect(readme).toContain('/services/exw-pickup-korea');
    expect(readme).toContain('/network/korea-agent-network');
    expect(readme).toContain('DESIGN.md');
  });

  it('makes QA capture fail CI on quality regressions and checks collapsed brand spelling', () => {
    const source = readFileSync(join(process.cwd(), 'scripts/qa-capture.js'), 'utf8');

    expect(source).toContain('noBrandCollapse');
    expect(source).toContain('process.exitCode = 1');
    expect(source).toContain('KSWays');
    expect(source).toContain('KS Ways');
    expect(source).toContain('Korea-based local company');
  });

  it('defines visible keyboard focus and reduced-motion safeguards globally', () => {
    const css = readFileSync(join(process.cwd(), 'src/app/globals.css'), 'utf8');

    expect(css).toContain(':focus-visible');
    expect(css).toContain('outline: 3px solid var(--ks-cyan)');
    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    expect(css).toContain('scroll-behavior: auto');
    expect(css).toContain('animation-duration: 0.01ms');
  });

  it('adds FAQ visual affordance and mobile-safe CTA layout on landing pages', () => {
    const homePage = readFileSync(join(process.cwd(), 'src/components/HomePage.tsx'), 'utf8');
    const servicePage = readFileSync(join(process.cwd(), 'src/components/ServiceLandingPage.tsx'), 'utf8');

    expect(homePage).toContain('aria-hidden="true"');
    expect(homePage).toContain('group-open:rotate-45');
    expect(servicePage).toContain('aria-hidden="true"');
    expect(servicePage).toContain('group-open:rotate-45');
    expect(servicePage).toContain('flex-col items-stretch');
    expect(servicePage).toContain('w-full justify-center');
    expect(servicePage).toContain('sm:w-auto');
    expect(servicePage).toContain('trustCards');
    expect(servicePage).toContain('Partner confidence');
  });

  it('sets share-card images and Twitter metadata for home and service pages', () => {
    const seo = readFileSync(join(process.cwd(), 'src/lib/seo.ts'), 'utf8');
    const servicePages = readFileSync(join(process.cwd(), 'src/lib/service-pages.ts'), 'utf8');

    expect(seo).toContain('shareImage');
    expect(seo).toContain('twitter');
    expect(seo).toContain('card: \'summary_large_image\'');
    expect(seo).toContain('images: [shareImage]');
    expect(servicePages).toContain('twitter');
    expect(servicePages).toContain('images: [shareImage]');
  });

  it('keeps the Intercom messenger installed in the root layout', () => {
    const layout = readFileSync(join(process.cwd(), 'src/app/layout.tsx'), 'utf8');

    expect(layout).toContain("import Script from 'next/script';");
    expect(layout).toContain('NEXT_PUBLIC_INTERCOM_APP_ID');
    expect(layout).toContain('KS_WAYS_INTERCOM_APP_ID');
    expect(layout).toContain('window.intercomSettings');
    expect(layout).toContain('https://widget.intercom.io/widget/');
  });

  it('keeps sitemap entries prioritized with service/network routes and no stale static-only policy', () => {
    const sitemap = readFileSync(join(process.cwd(), 'src/app/sitemap.ts'), 'utf8');

    expect(sitemap).toContain('servicePages.map');
    expect(sitemap).toContain('/network/${page.slug}');
    expect(sitemap).toContain("changeFrequency: route === '/' || route === '/kr' ? 'weekly' : 'monthly'");
    expect(sitemap).toContain("priority: route === '/' ? 1 : route === '/kr' ? 0.9 : 0.8");
  });
});
