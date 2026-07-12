// @vitest-environment jsdom
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { contactEmail } from '@/lib/seo';
import { QuoteForm } from './QuoteForm';

const REQUIRED_VALUES: Record<string, string> = {
  companyName: 'Acme Trading',
  contactName: 'Jane Lee',
  emailOrPhone: 'jane@acme.test',
  origin: 'Busan, KRPUS',
  destination: 'Los Angeles, USLAX',
  commodity: 'Cosmetics',
};

async function fillRequiredFields(user: ReturnType<typeof userEvent.setup>) {
  for (const [name, value] of Object.entries(REQUIRED_VALUES)) {
    const field = document.querySelector<HTMLInputElement>(`[name="${name}"]`);
    expect(field, `required field ${name} should render`).not.toBeNull();
    await user.type(field as HTMLInputElement, value);
  }
}

function getDesktopSubmitButton() {
  const aside = screen.getByText('Email handoff').closest('aside') as HTMLElement;
  return within(aside).getByRole('button', { name: /Open email draft/i });
}

describe('QuoteForm interactions', () => {
  afterEach(cleanup);

  it('blocks the email draft and lists missing required fields', async () => {
    const user = userEvent.setup();
    const navigate = vi.fn();
    render(<QuoteForm navigate={navigate} />);

    await user.click(getDesktopSubmitButton());

    expect(screen.getByRole('alert')).toHaveTextContent(/Company name/);
    expect(navigate).not.toHaveBeenCalled();
  });

  it('syncs shipment type with the selected transport mode', async () => {
    const user = userEvent.setup();
    render(<QuoteForm />);

    await user.click(screen.getByRole('button', { name: /^Ocean/ }));

    const shipmentType = document.querySelector<HTMLSelectElement>('[name="shipmentType"]');
    expect(shipmentType?.value).toBe('FCL');
    expect(screen.getByRole('button', { name: /^Ocean/ })).toHaveAttribute('aria-pressed', 'true');
  });

  it('hides the ocean equipment section for air shipments', async () => {
    const user = userEvent.setup();
    render(<QuoteForm />);

    expect(screen.getByText('Ocean equipment')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^Air/ }));

    expect(screen.queryByText('Ocean equipment')).not.toBeInTheDocument();
  });

  it('highlights DG guidance when DG cargo is selected', async () => {
    const user = userEvent.setup();
    render(<QuoteForm />);

    expect(screen.queryByText(/DG cargo selected/)).not.toBeInTheDocument();

    const cargoNature = document.querySelector<HTMLSelectElement>('[name="cargoNature"]') as HTMLSelectElement;
    await user.selectOptions(cargoNature, 'DG cargo');

    expect(screen.getByText(/DG cargo selected/)).toBeInTheDocument();
  });

  it('opens a mailto draft via navigate once required fields are complete', async () => {
    const user = userEvent.setup();
    const navigate = vi.fn();
    render(<QuoteForm navigate={navigate} />);

    await fillRequiredFields(user);
    await user.click(getDesktopSubmitButton());

    expect(navigate).toHaveBeenCalledTimes(1);
    const href = navigate.mock.calls[0][0] as string;
    expect(href.startsWith(`mailto:${contactEmail}?subject=`)).toBe(true);
    expect(href).toContain(encodeURIComponent('Acme Trading'));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('copies the request summary to the clipboard', async () => {
    // userEvent.setup()이 jsdom에 동작하는 clipboard 스텁을 설치한다 — 그 위에 spy를 얹는다.
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, 'writeText');
    render(<QuoteForm />);

    await user.click(screen.getByRole('button', { name: /Copy request summary/i }));

    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText.mock.calls[0][0]).toContain('Dear KS WAYS team,');
    expect(await screen.findByText('Request summary copied.')).toBeInTheDocument();
  });
});
