// @vitest-environment jsdom
import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { homeContent } from '@/lib/content';
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
    expect(container.querySelectorAll('img.ks-hero-bg-slide').length).toBeGreaterThanOrEqual(3);

    const credits = screen.getAllByText('Unsplash');
    expect(credits.length).toBeGreaterThanOrEqual(3);
    credits.forEach((credit) => {
      const link = credit.closest('a');
      expect(link?.getAttribute('href')).toContain('unsplash.com');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
});
