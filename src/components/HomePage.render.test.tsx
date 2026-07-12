// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
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
});
