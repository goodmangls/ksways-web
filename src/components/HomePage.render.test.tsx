// @vitest-environment jsdom
import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { homeContent } from '@/lib/content';
import { getHeroSlides } from '@/lib/hero-slides';
import { HomePage } from './HomePage';

describe('HomePage render smoke', () => {
  afterEach(cleanup);

  it('renders the English hero, FAQ, and JSON-LD scripts', () => {
    const { container } = render(<HomePage locale="en" copy={homeContent.en} />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(homeContent.en.hero.headline.trim().slice(0, 12));
    expect(container.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(2);
    expect(container.querySelectorAll('img[src*="images.unsplash.com"], img[srcset*="images.unsplash.com"]').length).toBeGreaterThan(0);
  });

  it('renders Korean copy on the kr locale', () => {
    render(<HomePage locale="kr" copy={homeContent.kr} />);

    expect(screen.getAllByText(homeContent.kr.nav.quote).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('글로벌');
  });

  it('renders FAQ disclosure widgets with a decorative toggle icon', () => {
    const { container } = render(<HomePage locale="en" copy={homeContent.en} />);

    const faqItems = container.querySelectorAll('#faq details');
    expect(faqItems.length).toBeGreaterThanOrEqual(3);
    faqItems.forEach((item) => {
      expect(item.querySelector('summary')).not.toBeNull();
      expect(item.querySelector('[aria-hidden="true"]')).not.toBeNull();
    });
  });

  it('uses WCA Inter Global only in the network section and WCAworld in the site-wide footer', () => {
    const { container } = render(<HomePage locale="en" copy={homeContent.en} />);

    const network = document.getElementById('network')!;
    const interGlobal = within(network).getByRole('img', { name: 'WCA Inter Global' });
    expect(interGlobal.getAttribute('src')).toContain('/assets/wca-inter-global-badge.svg');
    expect(within(network).getByText(homeContent.en.network.membership.label)).toBeInTheDocument();

    // 푸터는 모든 페이지에 붙으므로 사이트 전역 마크는 인지도가 높은 WCAworld 상위 브랜드다
    const footer = screen.getByRole('contentinfo');
    expect(within(footer).getByRole('img', { name: 'WCAworld member' }).getAttribute('src')).toContain('/assets/wcaworld-logo.svg');

    // Inter Global 마크는 네트워크 섹션 한 곳으로 제한한다
    expect(container.querySelectorAll('img[src*="wca-inter-global-badge"]')).toHaveLength(1);
  });

  it('shows the WQS and PartnerPay seals in the network section, in both locales', () => {
    for (const locale of ['en', 'kr'] as const) {
      render(<HomePage locale={locale} copy={homeContent[locale]} />);
      const network = document.getElementById('network')!;
      expect(within(network).getByRole('img', { name: 'WCAworld Quotation System seal' })).toBeInTheDocument();
      expect(within(network).getByRole('img', { name: 'WCAworld PartnerPay seal' })).toBeInTheDocument();
      homeContent[locale].network.tools.items.forEach((item) => {
        expect(item.body).not.toMatch(/sav(e|es|ing)|fee|free|cheap|guarantee|절감|무료|수수료/i);
      });
      cleanup();
    }
  });

  it('keeps email-signature-only membership details off the site', () => {
    // 회원 ID·만료일이 박힌 WCA JPEG 는 이메일 서명 전용이다 — 사이트 문구로도 노출하지 않는다
    const { container } = render(<HomePage locale="en" copy={homeContent.en} />);
    expect(container.textContent).not.toMatch(/96376|Expires/);
  });

  it('renders footer navigation columns with their links', () => {
    render(<HomePage locale="en" copy={homeContent.en} />);

    const footerNav = screen.getByRole('navigation', { name: 'Footer navigation' });
    for (const column of homeContent.en.footer.columns) {
      for (const link of column.links) {
        expect(within(footerNav).getByRole('link', { name: link.label })).toHaveAttribute('href', link.href);
      }
    }
  });

  it('credits Unsplash photographers for the hero background slides', () => {
    const { container } = render(<HomePage locale="en" copy={homeContent.en} />);

    // globals.css의 ks-hero-bg-cycle keyframes가 실제로 적용될 슬라이드 요소
    expect(container.querySelectorAll('img.ks-hero-bg-slide').length).toBe(getHeroSlides().length);

    const credits = screen.getAllByText(/^Unsplash\+?$/);
    expect(credits.length).toBe(getHeroSlides().length);
    credits.forEach((credit) => {
      const link = credit.closest('a');
      expect(link?.getAttribute('href')).toContain('unsplash.com');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
});
