// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
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
  // 카피 텍스트가 아니라 landmark role 로 찾는다 — 문구 변경에 테스트가 깨지지 않도록.
  const aside = screen.getByRole('complementary');
  return within(aside).getByRole('button', { name: /Choose email app/i });
}

/** mailto:/https 컴포즈 URL 에서 쿼리 파라미터를 디코드해 돌려준다. */
function getUrlParam(href: string, key: string): string | null {
  return new URL(href).searchParams.get(key);
}

describe('QuoteForm interactions', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

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

  it('opens email options and keeps the default draft addressed to info@ksways.co', async () => {
    const user = userEvent.setup();
    const navigate = vi.fn();
    render(<QuoteForm navigate={navigate} />);

    await fillRequiredFields(user);
    await user.click(getDesktopSubmitButton());

    const dialog = screen.getByRole('dialog', { name: /Choose where to open the draft/i });
    expect(dialog).toHaveFocus();
    expect(within(dialog).getByText(`To: ${contactEmail}`)).toBeInTheDocument();

    const defaultEmailLink = within(dialog).getByRole('link', { name: /Default email app/i });
    const href = defaultEmailLink.getAttribute('href') ?? '';
    expect(href.startsWith(`mailto:${contactEmail}?subject=`)).toBe(true);

    // "contains 조각" 단언은 body= 파라미터가 통째로 빠져도 통과한다 —
    // 파라미터를 디코드해 subject 는 값 전체를, body 는 필수 필드 값 전수를 단언한다.
    const subject = getUrlParam(href, 'subject');
    const body = getUrlParam(href, 'body');
    expect(subject).toBe('KS WAYS website quote request — Acme Trading');
    expect(body).toContain('Dear KS WAYS team,');
    for (const value of Object.values(REQUIRED_VALUES)) {
      expect(body, `mailto body should carry "${value}"`).toContain(value);
    }

    // Gmail/Outlook 컴포즈 링크는 mailto 와 같은 초안(수신자·제목·본문)을 실어야 한다.
    const gmailHref = within(dialog).getByRole('link', { name: 'Gmail' }).getAttribute('href') ?? '';
    expect(getUrlParam(gmailHref, 'to')).toBe(contactEmail);
    expect(getUrlParam(gmailHref, 'su')).toBe(subject);
    expect(getUrlParam(gmailHref, 'body')).toBe(body);

    const outlookHref = within(dialog).getByRole('link', { name: /Outlook Web/i }).getAttribute('href') ?? '';
    expect(getUrlParam(outlookHref, 'to')).toBe(contactEmail);
    expect(getUrlParam(outlookHref, 'subject')).toBe(subject);
    expect(getUrlParam(outlookHref, 'body')).toBe(body);

    await user.click(defaultEmailLink);

    expect(navigate).toHaveBeenCalledWith(href);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('warns when the draft exceeds the mailto length limit but still allows opening', async () => {
    const user = userEvent.setup();
    const navigate = vi.fn();
    render(<QuoteForm navigate={navigate} initialValues={{ additionalNotes: 'x'.repeat(2200) }} />);

    // 경고 배너는 데스크톱 aside와 모바일 review 박스 양쪽에 뜬다
    expect(screen.getAllByRole('status')).toHaveLength(2);
    expect(screen.getAllByRole('status')[0]).toHaveTextContent(/Copy request summary/);

    await fillRequiredFields(user);
    await user.click(getDesktopSubmitButton());

    expect(screen.getByRole('dialog', { name: /Choose where to open the draft/i })).toBeInTheDocument();
    expect(navigate).not.toHaveBeenCalled();
  });

  it('closes email options with Escape and restores focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<QuoteForm />);

    await fillRequiredFields(user);
    const trigger = getDesktopSubmitButton();
    await user.click(trigger);
    expect(screen.getByRole('dialog')).toHaveFocus();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('shows no length warning for a short draft', () => {
    render(<QuoteForm />);

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
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

  it('surfaces the direct-email fallback when the clipboard write fails', async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValueOnce(new Error('clipboard denied'));
    render(<QuoteForm />);

    await user.click(screen.getByRole('button', { name: /Copy request summary/i }));

    expect(writeText).toHaveBeenCalledTimes(1);
    expect(await screen.findByText(`Copy failed. Please email ${contactEmail} directly.`)).toBeInTheDocument();
    expect(screen.queryByText('Request summary copied.')).not.toBeInTheDocument();
  });

  it('stores typed special-instruction notes and carries them into the email draft', async () => {
    const user = userEvent.setup();
    render(<QuoteForm />);

    const notes = document.querySelector<HTMLTextAreaElement>('[name="additionalNotes"]');
    expect(notes, 'additionalNotes textarea should render').not.toBeNull();
    await user.type(notes as HTMLTextAreaElement, 'Fragile cargo, tilt sensors attached');
    expect((notes as HTMLTextAreaElement).value).toBe('Fragile cargo, tilt sensors attached');

    await fillRequiredFields(user);
    await user.click(getDesktopSubmitButton());

    const dialog = screen.getByRole('dialog', { name: /Choose where to open the draft/i });
    const href = within(dialog).getByRole('link', { name: /Default email app/i }).getAttribute('href') ?? '';
    expect(getUrlParam(href, 'body')).toContain('Fragile cargo, tilt sensors attached');
  });

  it('closes the dialog on backdrop pointer-down but not on presses inside it', async () => {
    const user = userEvent.setup();
    render(<QuoteForm />);

    await fillRequiredFields(user);
    await user.click(getDesktopSubmitButton());

    const dialog = screen.getByRole('dialog', { name: /Choose where to open the draft/i });
    const backdrop = dialog.parentElement as HTMLElement;

    // 다이얼로그 내부 press 는 닫지 않는다 (event.target !== currentTarget)
    fireEvent.mouseDown(dialog);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // 백드롭 자체 press 는 닫는다
    fireEvent.mouseDown(backdrop);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
