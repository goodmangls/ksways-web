import { describe, expect, it } from 'vitest';
import { getServicePage } from './service-pages';

describe('KS WAYS service and network page content', () => {
  it('upgrades the air freight page with ACE-inspired capability categories in KS WAYS voice', () => {
    const page = getServicePage('air-freight-korea');
    expect(page).toBeDefined();

    const visibleCopy = [
      page?.meta.description,
      page?.title,
      page?.lead,
      ...(page?.trustCards?.map((card) => `${card.label} ${card.value} ${card.body}`) ?? []),
      ...(page?.sections.map((section) => `${section.title} ${section.body} ${(section.items ?? []).join(' ')}`) ?? []),
      page?.checklistTitle,
      ...(page?.checklist ?? []),
      ...(page?.faqs.map((faq) => `${faq.question} ${faq.answer}`) ?? []),
    ].join(' ');

    expect(visibleCopy).toContain('Global coverage');
    expect(visibleCopy).toContain('Time-sensitive delivery');
    expect(visibleCopy).toContain('Specialized handling');
    expect(visibleCopy).toContain('Customs-document coordination');
    expect(visibleCopy).toContain('Tracking transparency');
    expect(visibleCopy).toContain('Tailored solutions and Industry Experience');
    expect(visibleCopy).toContain('Industry Experience');
    expect(visibleCopy).toContain('AOG-style');
    expect(visibleCopy).toContain('live animal');
    expect(visibleCopy).toContain('exotic-vehicle');
    expect(visibleCopy).not.toContain('Alliance Cargo Express');
    expect(visibleCopy).not.toContain(' ACE');
  });

  it('positions the Korea agent network page for global partners without language-barrier framing', () => {
    const page = getServicePage('korea-agent-network');
    expect(page).toBeDefined();

    const visibleCopy = [
      page?.title,
      page?.lead,
      ...(page?.sections.map((section) => `${section.title} ${section.body} ${(section.items ?? []).join(' ')}`) ?? []),
      page?.checklistTitle,
      ...(page?.checklist ?? []),
      ...(page?.faqs.map((faq) => `${faq.question} ${faq.answer}`) ?? []),
      ...(page?.trustCards?.map((card) => `${card.label} ${card.value} ${card.body}`) ?? []),
    ].join(' ');

    expect(visibleCopy).toContain('global freight forwarders');
    expect(visibleCopy).toContain('Partner-ready coordination');
    expect(visibleCopy).toContain('Northeast Asia');
    expect(visibleCopy).toContain('China and Japan');
    expect(visibleCopy).toContain('trusted global forwarding company');
    expect(visibleCopy).toContain('WCA');
    expect(visibleCopy).toContain('30+ years');
    expect(visibleCopy).not.toMatch(/English default/i);
    expect(visibleCopy).not.toMatch(/English website/i);
    expect(visibleCopy).not.toMatch(/Western/i);
    expect(visibleCopy).not.toMatch(/language barrier/i);
    expect(visibleCopy).not.toContain('English-first');
    expect(visibleCopy).not.toContain('translation friction');
  });
});
