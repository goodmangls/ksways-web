import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import nextConfig, { buildContentSecurityPolicy } from '../next.config';
import sitemap from '@/app/sitemap';
import { homeSeo, shareImage } from '@/lib/seo';
import { servicePages } from '@/lib/service-pages';
import { homeContent } from '@/lib/content';

/** Brand spellings that must never appear in copy. `KS WAYS` is the only correct form. */
const COLLAPSED_BRAND_SPELLINGS = ['KSWAYS', 'KSWays', 'KS Ways'] as const;

/** Positioning DESIGN.md explicitly rules out of public copy. */
const FORBIDDEN_COPY = [
  'MLM',
  'network-marketing',
  'Network Marketing',
  'Goodman GLS family',
  'Korea-based local company',
] as const;

/** Every user-visible string in the copy data, with a path for readable failures. */
function copyStrings(): { path: string; value: string }[] {
  const out: { path: string; value: string }[] = [];
  const walk = (node: unknown, path: string) => {
    if (typeof node === 'string') out.push({ path, value: node });
    else if (Array.isArray(node)) node.forEach((v, i) => walk(v, `${path}[${i}]`));
    else if (node && typeof node === 'object') {
      for (const [k, v] of Object.entries(node)) walk(v, `${path}.${k}`);
    }
  };
  walk(homeContent, 'homeContent');
  walk(servicePages, 'servicePages');
  return out;
}

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
    // Vercel Analytics 는 프로덕션에서 동일 출처 /_vercel/insights/* 만 쓴다.
    // 개발용 디버그 스크립트 출처가 프로덕션 정책에 새어 들어가면 안 된다.
    expect(prodCsp).not.toContain('va.vercel-scripts.com');

    const devCsp = buildContentSecurityPolicy(true);
    expect(devCsp).toContain("'unsafe-eval'");
    expect(devCsp).toContain('https://va.vercel-scripts.com');
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

  it('never collapses the brand spelling in user-visible copy', () => {
    // There used to be a `scripts/qa-capture.js` (now deleted) that checked this
    // against a live server, and an assertion here that read its source to
    // confirm it still *mentioned* the rule. That was a proxy for a proxy: the
    // script needed Playwright and a running server, so it never ran in CI, and
    // grepping its text proved nothing about the copy.
    //
    // Walking the exported copy data tests the actual strings, and it sidesteps
    // identifier noise — `NEXT_PUBLIC_KSWAYS_CALENDLY_URL` and `utm_source=ksways`
    // are code, not copy, and would trip a raw file scan.
    const offenders = copyStrings().filter(({ value }) =>
      COLLAPSED_BRAND_SPELLINGS.some((term) => value.includes(term)),
    );

    expect(offenders).toEqual([]);
  });

  it('never leaks the positioning DESIGN.md rules out', () => {
    // DESIGN.md "Don't": the brand is not a Korea-based local company, and
    // internal or unrelated-business language must not surface in public copy.
    const offenders = copyStrings().filter(({ value }) =>
      FORBIDDEN_COPY.some((term) => value.toLowerCase().includes(term.toLowerCase())),
    );

    expect(offenders).toEqual([]);
  });

  it('defines visible keyboard focus and reduced-motion safeguards globally', () => {
    const css = readFileSync(join(process.cwd(), 'src/app/globals.css'), 'utf8');

    expect(css).toContain(':focus-visible');
    expect(css).toContain('outline: 3px solid var(--ks-accent-soft)');
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

  it('keeps the Intercom messenger installed in the shared root document', () => {
    const rootDocument = readFileSync(join(process.cwd(), 'src/components/RootDocument.tsx'), 'utf8');

    expect(rootDocument).toContain("import Script from 'next/script';");
    expect(rootDocument).toContain('NEXT_PUBLIC_INTERCOM_APP_ID');
    expect(rootDocument).toContain('KS_WAYS_INTERCOM_APP_ID');
    expect(rootDocument).toContain('window.intercomSettings');
    expect(rootDocument).toContain('https://widget.intercom.io/widget/');
  });

  it('sets SSR document language per locale root layout without dynamic APIs', () => {
    // 정적 렌더링(SSG) 보존 가드: 과거엔 proxy 가 x-ksways-pathname 헤더를 주입하고
    // 루트 레이아웃이 headers() 로 읽어 lang 을 정했는데, headers() 는 동적 API 라서
    // 전 라우트를 요청별 렌더링으로 강제했다. 지금은 (en)/(kr) route group 이 각자
    // 루트 레이아웃에서 lang 을 정적으로 지정한다 — 동적 API 재유입을 여기서 막는다.
    const enLayout = readFileSync(join(process.cwd(), 'src/app/(en)/layout.tsx'), 'utf8');
    const krLayout = readFileSync(join(process.cwd(), 'src/app/(kr)/layout.tsx'), 'utf8');
    const rootDocument = readFileSync(join(process.cwd(), 'src/components/RootDocument.tsx'), 'utf8');

    expect(enLayout).toContain('lang="en"');
    expect(krLayout).toContain('lang="ko-KR"');
    expect(rootDocument).toContain('<html lang={lang}>');
    for (const source of [enLayout, krLayout, rootDocument]) {
      expect(source).not.toContain('next/headers');
    }
    expect(existsSync(join(process.cwd(), 'src/proxy.ts'))).toBe(false);
    expect(existsSync(join(process.cwd(), 'src/components/HtmlLangSync.tsx'))).toBe(false);
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
