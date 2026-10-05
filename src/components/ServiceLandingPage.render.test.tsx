// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { getServicePage, servicePages } from '@/lib/service-pages';
import { ServiceLandingPage } from './ServiceLandingPage';

const airFreight = getServicePage('air-freight-korea')!;
const specialCargo = servicePages.find((page) => page.quoteServiceKey === 'special-cargo');

describe('ServiceLandingPage render', () => {
  afterEach(cleanup);

  it('shows the WCAworld WQS and PartnerPay seals on the partner network page only', () => {
    const network = getServicePage('korea-agent-network')!;
    render(<ServiceLandingPage page={network} basePath="network" />);

    expect(screen.getByRole('heading', { name: network.memberTools!.title })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'WCAworld Quotation System seal' }).getAttribute('src')).toContain('wca-wqs-seal.png');
    expect(screen.getByRole('img', { name: 'WCAworld PartnerPay seal' }).getAttribute('src')).toContain('wca-partnerpay-seal.png');
    cleanup();

    // 서비스 페이지 고객은 화주라 WCAworld 회원 도구는 해당 없음
    render(<ServiceLandingPage page={airFreight} basePath="services" />);
    expect(screen.queryByRole('img', { name: /seal$/ })).toBeNull();
  });

  it('describes WCAworld tools by what they do, never with savings claims', () => {
    // COPY.md "Words to avoid": guaranteed savings. WCAworld 자체 홍보 문구("saves thousands",
    // "without any fees")는 KS WAYS 가 보증할 수 없는 주장이라 가져오지 않는다.
    const toolCopy = servicePages.flatMap((page) => (page.memberTools ? [page.memberTools.body, ...page.memberTools.items.map((i) => i.body)] : []));
    expect(toolCopy.length).toBeGreaterThan(0);
    toolCopy.forEach((text) => expect(text).not.toMatch(/sav(e|es|ing)|fee|free|cheap|guarantee/i));
  });

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
