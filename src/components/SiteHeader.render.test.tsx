// @vitest-environment jsdom
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { homeContent } from '@/lib/content';
import { getServicePage } from '@/lib/service-pages';
import { ServiceLandingPage } from './ServiceLandingPage';
import { SiteHeader } from './SiteHeader';
import QuotePage from '@/app/(en)/quote/page';

// /quote 의 폼 래퍼가 ?service= 를 읽는다. 헤더만 볼 것이라 빈 검색 파라미터로 둔다.
vi.mock('next/navigation', () => ({ useSearchParams: () => new URLSearchParams() }));

const NAV = homeContent.en.nav;

// DESIGN.md "The One Desk Rule" — 모든 페이지가 같은 헤더를 쓴다 (디자인 리뷰 F-001).
// 서브페이지는 로고 + 링크 하나뿐인 축소 헤더였고, 검색으로 서비스 페이지에 들어온
// 방문자는 로고를 거치지 않고는 Company·Network·한국어 사이트로 갈 수 없었다.
function expectFullHeader(sectionBase: string) {
  const banner = screen.getByRole('banner');
  const primary = within(banner).getByRole('navigation', { name: 'Primary navigation' });
  for (const [name, id] of [
    [NAV.company, 'company'],
    [NAV.services, 'services'],
    [NAV.network, 'network'],
    [NAV.solutions, 'solutions'],
  ] as const) {
    expect(within(primary).getByRole('link', { name }), name).toHaveAttribute('href', `${sectionBase}#${id}`);
  }
  expect(within(banner).getByRole('link', { name: 'Toggle language' })).toHaveAttribute('href', '/kr');
  expect(within(banner).getByRole('link', { name: NAV.contact })).toHaveAttribute('href', `${sectionBase}#contact`);
  expect(within(banner).getByRole('button', { name: NAV.menuLabel })).toBeInTheDocument();
  return banner;
}

describe('SiteHeader', () => {
  afterEach(cleanup);

  it('keeps section links in-page on the homepage', () => {
    render(<SiteHeader nav={NAV} homeHref="/" toggleHref="/kr" quoteHref="/quote" isHome />);
    expectFullHeader('');
  });

  it('points section links and the mobile menu back to the homepage from a subpage', async () => {
    const user = userEvent.setup();
    render(<SiteHeader nav={NAV} homeHref="/" toggleHref="/kr" quoteHref="/quote" />);
    const banner = expectFullHeader('/');

    await user.click(within(banner).getByRole('button', { name: NAV.menuLabel }));
    const menu = screen.getByRole('navigation', { name: 'Mobile navigation' });
    expect(within(menu).getByRole('link', { name: NAV.services })).toHaveAttribute('href', '/#services');
    // 360px 미만에서는 헤더 언어 알약이 숨는다 — 그 구간에서만 메뉴가 토글을 대신 싣는다.
    const menuToggle = within(menu).getByRole('link', { name: 'Toggle language' });
    expect(menuToggle).toHaveAttribute('href', '/kr');
    expect(menuToggle.closest('li')?.className).toContain('min-[360px]:hidden');
    expect(within(banner).getAllByRole('link', { name: 'Toggle language' })[0].className).toContain('max-[359px]:hidden');
  });

  it('is the header on service, network and quote pages', () => {
    const air = getServicePage('air-freight-korea')!;
    render(<ServiceLandingPage page={air} basePath="services" />);
    expect(within(expectFullHeader('/')).getByRole('link', { name: NAV.quote })).toHaveAttribute('href', '/quote');
    cleanup();

    render(<ServiceLandingPage page={getServicePage('korea-agent-network')!} basePath="network" />);
    expectFullHeader('/');
    cleanup();

    render(<QuotePage />);
    expectFullHeader('/');
  });
});
