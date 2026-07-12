import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import nextConfig, { buildContentSecurityPolicy } from '../next.config';
import sitemap from '@/app/sitemap';
import { homeSeo, shareImage } from '@/lib/seo';
import { servicePages } from '@/lib/service-pages';

describe('site quality hardening', () => {
  it('allows Next/Image to render approved Unsplash CDN images without exposing API keys', () => {
    expect(nextConfig.images?.remotePatterns).toContainEqual({
      protocol: 'https',
      hostname: 'images.unsplash.com',
    });
    expect(JSON.stringify(nextConfig)).not.toContain('UNSPLASH_ACCESS_KEY');
  });

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

  it('enforces a Content-Security-Policy limited to approved third parties', async () => {
    const headers = await nextConfig.headers?.();
    const globalHeaders = headers?.find((entry) => entry.source === '/(.*)')?.headers ?? [];
    const headerMap = new Map(globalHeaders.map((header) => [header.key.toLowerCase(), header.value]));

    expect(headerMap.get('content-security-policy')).toBeTruthy();

    const prodCsp = buildContentSecurityPolicy(false);
    expect(prodCsp).toContain("default-src 'self'");
    expect(prodCsp).toContain('https://images.unsplash.com');
    expect(prodCsp).toContain('https://widget.intercom.io');
    expect(prodCsp).toContain('https://js.intercomcdn.com');
    expect(prodCsp).toContain('wss://nexus-websocket-a.intercom.io');
    expect(prodCsp).toContain("object-src 'none'");
    expect(prodCsp).toContain("base-uri 'self'");
    expect(prodCsp).toContain("frame-ancestors 'none'");
    expect(prodCsp).not.toContain('unsafe-eval');
    expect(prodCsp).not.toContain(' ws: ');

    const devCsp = buildContentSecurityPolicy(true);
    expect(devCsp).toContain("'unsafe-eval'");
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

  // FAQ affordance·CTA·trustCards·히어로 슬라이드 마크업 검증은 소스-grep에서 렌더 테스트로 이관됨:
  // HomePage.render.test.tsx / ServiceLandingPage.render.test.tsx 참조.
  // max-w 컨테이너 클래스 검증은 시각 회귀 영역으로 descope (component-render-tests design §3.3).
  it('keeps the rotating hero background animation defined in global CSS', () => {
    const css = readFileSync(join(process.cwd(), 'src/app/globals.css'), 'utf8');

    expect(css).toContain('@keyframes ks-hero-bg-cycle');
    expect(css).toContain('animation-delay: calc(var(--ks-slide-index) * 7s)');
  });

  it('sets share-card images and Twitter metadata for home and service pages', () => {
    for (const locale of ['en', 'kr'] as const) {
      expect(homeSeo[locale].twitter).toMatchObject({ card: 'summary_large_image', images: [shareImage] });
      expect(homeSeo[locale].openGraph?.images).toEqual([shareImage]);
    }

    for (const page of servicePages) {
      expect(page.meta.twitter, `${page.slug} twitter metadata`).toMatchObject({ card: 'summary_large_image', images: [shareImage] });
    }
  });

  it('keeps the Intercom messenger installed in the root layout', () => {
    const layout = readFileSync(join(process.cwd(), 'src/app/layout.tsx'), 'utf8');

    expect(layout).toContain("import Script from 'next/script';");
    expect(layout).toContain('NEXT_PUBLIC_INTERCOM_APP_ID');
    expect(layout).toContain('KS_WAYS_INTERCOM_APP_ID');
    expect(layout).toContain('window.intercomSettings');
    expect(layout).toContain('https://widget.intercom.io/widget/');
  });

  it('sets Korean SSR document language for /kr before hydration', () => {
    const layout = readFileSync(join(process.cwd(), 'src/app/layout.tsx'), 'utf8');
    const proxy = readFileSync(join(process.cwd(), 'src/proxy.ts'), 'utf8');
    const htmlLangSync = readFileSync(join(process.cwd(), 'src/components/HtmlLangSync.tsx'), 'utf8');

    expect(proxy).toContain('x-ksways-pathname');
    expect(proxy).toContain('request.nextUrl.pathname');
    expect(layout).toContain("import { headers } from 'next/headers';");
    expect(layout).toContain("pathname?.startsWith('/kr') ? 'ko-KR' : 'en'");
    expect(layout).toContain('<html lang={documentLang}>');
    expect(htmlLangSync).toContain("locale === 'kr' ? 'ko-KR' : 'en'");
  });

  it('keeps sitemap entries prioritized with service/network routes and no stale static-only policy', () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain('https://ksways.co');
    expect(urls).toContain('https://ksways.co/kr');
    expect(urls).toContain('https://ksways.co/quote');
    expect(urls).toContain('https://ksways.co/network/korea-agent-network');
    expect(urls.some((url) => url.includes('/services/'))).toBe(true);
    expect(entries.length).toBe(3 + servicePages.length);

    const home = entries.find((entry) => entry.url === 'https://ksways.co');
    expect(home?.priority).toBe(1);
    expect(home?.changeFrequency).toBe('weekly');
    const service = entries.find((entry) => entry.url.includes('/services/'));
    expect(service?.priority).toBe(0.8);
    expect(service?.changeFrequency).toBe('monthly');
  });
});
