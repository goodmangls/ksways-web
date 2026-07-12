// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { getServicePage, servicePages } from '@/lib/service-pages';
import { ServiceLandingPage } from './ServiceLandingPage';

const airFreight = getServicePage('air-freight-korea')!;
const specialCargo = servicePages.find((page) => page.quoteServiceKey === 'special-cargo');

describe('ServiceLandingPage render', () => {
  afterEach(cleanup);

  it('renders hero, trust cards, checklist, FAQ, and JSON-LD for a service page', () => {
    const { container } = render(<ServiceLandingPage page={airFreight} basePath="services" />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(airFreight.title);
    expect(screen.getByText('Partner confidence')).toBeInTheDocument();
    expect(screen.getByText(airFreight.checklistTitle)).toBeInTheDocument();
    expect(screen.getByText(airFreight.faqs[0].question)).toBeInTheDocument();
    expect(container.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(2);
  });

  it('links the quote CTA to the plain quote route by default', () => {
    render(<ServiceLandingPage page={airFreight} basePath="services" />);

    expect(screen.getByRole('link', { name: 'Get a quote' })).toHaveAttribute('href', '/quote');
  });

  it('propagates quoteServiceKey into the quote CTA when defined', () => {
    if (!specialCargo) return; // 콘텐츠에서 키가 제거되면 이 분기는 검증 대상이 없다

    render(<ServiceLandingPage page={specialCargo} basePath="services" />);

    expect(screen.getByRole('link', { name: 'Get a quote' })).toHaveAttribute('href', '/quote?service=special-cargo');
  });
});
