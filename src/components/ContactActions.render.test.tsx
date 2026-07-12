// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { ContactActions } from './ContactActions';

const baseProps = {
  quoteLabel: 'Request a quote',
  partnerLabel: 'Partner with us',
  scheduleLabel: 'Schedule a call',
  email: 'info@ksways.co',
  locale: 'en' as const,
};

describe('ContactActions render', () => {
  afterEach(cleanup);

  it('routes quote to the quote page and partner/schedule to prefilled mailto drafts', () => {
    render(<ContactActions {...baseProps} />);

    expect(screen.getByRole('link', { name: /Request a quote/ })).toHaveAttribute('href', '/quote');

    const partner = screen.getByRole('link', { name: /Partner with us/ });
    expect(partner.getAttribute('href')).toContain('mailto:info@ksways.co?subject=');
    expect(partner.getAttribute('href')).toContain(encodeURIComponent('KS WAYS partnership enquiry'));

    const schedule = screen.getByRole('link', { name: /Schedule a call/ });
    expect(schedule.getAttribute('href')).toContain('mailto:');
    expect(schedule).not.toHaveAttribute('target');
  });

  it('uses the external scheduler with safe rel when a schedule URL exists', () => {
    render(<ContactActions {...baseProps} scheduleUrl="https://calendly.com/ksways/intro" />);

    const schedule = screen.getByRole('link', { name: /Schedule a call/ });
    expect(schedule).toHaveAttribute('href', 'https://calendly.com/ksways/intro');
    expect(schedule).toHaveAttribute('target', '_blank');
    expect(schedule).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
