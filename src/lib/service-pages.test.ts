import { describe, expect, it } from 'vitest';
import { getServicePage } from './service-pages';

describe('KS WAYS service and network page content', () => {
  it('positions the Korea agent network page for Western forwarders seeking low-friction Northeast Asia support', () => {
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

    expect(visibleCopy).toContain('Western freight forwarders');
    expect(visibleCopy).toContain('language barrier');
    expect(visibleCopy).toContain('English-first communication');
    expect(visibleCopy).toContain('Northeast Asia');
    expect(visibleCopy).toContain('China and Japan');
    expect(visibleCopy).toContain('trusted global forwarding company');
    expect(visibleCopy).toContain('WCA');
    expect(visibleCopy).toContain('30+ years');
  });
});
