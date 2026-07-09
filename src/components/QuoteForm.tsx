'use client';

import { useMemo, useRef, useState } from 'react';
import {
  buildQuoteEmailText,
  buildQuoteMailto,
  getMissingRequiredQuoteFields,
  getShipmentTypeForTransportMode,
  getVisibleQuoteSections,
  isDgCargo,
  quoteFormFields,
  transportModeOptions,
  type QuoteFormValues,
} from '@/lib/quote-form';
import { contactEmail } from '@/lib/seo';

const sectionLabels = {
  company: 'Company contact',
  route: 'Mode & route',
  cargo: 'Cargo details',
  ocean: 'Ocean equipment',
  handling: 'Handling & commercial notes',
} as const;

const sectionDescriptions = {
  company: 'Who should our team contact for the quotation?',
  route: 'Make the transport mode visible first, then capture origin, destination, and Incoterms.',
  cargo: 'Weight, volume, and cargo facts needed for air, LCL, FCL, general cargo, and DG cargo pricing.',
  ocean: 'FCL equipment details aligned with carrier booking screens: DRY, RF, FR, OT, TK, quantity, and OOG gauge status.',
  handling: 'Operational constraints that affect feasibility, DG acceptance, cost, and routing quality.',
} as const;

export function QuoteForm({ initialValues = { transportMode: 'Not sure', shipmentType: 'Not sure' } }: { initialValues?: QuoteFormValues }) {
  const [values, setValues] = useState<QuoteFormValues>(initialValues);
  const [validationMessage, setValidationMessage] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const href = useMemo(() => buildQuoteMailto(values), [values]);
  const emailText = useMemo(() => buildQuoteEmailText(values), [values]);
  const visibleSections = useMemo(() => getVisibleQuoteSections(values), [values]);
  const dgSelected = isDgCargo(values);
  const missingRequiredFields = getMissingRequiredQuoteFields(values);
  const canOpenEmail = missingRequiredFields.length === 0;

  function update(name: keyof QuoteFormValues, value: string) {
    setValidationMessage('');
    setValues((current) => ({ ...current, [name]: value }));
  }

  function updateTransportMode(value: string) {
    setValidationMessage('');
    setValues((current) => {
      const previousDefault = getShipmentTypeForTransportMode(current.transportMode);
      const shouldSyncShipmentType = !current.shipmentType || current.shipmentType === 'Not sure' || current.shipmentType === previousDefault;

      return {
        ...current,
        transportMode: value,
        shipmentType: shouldSyncShipmentType ? getShipmentTypeForTransportMode(value) : current.shipmentType,
      };
    });
  }

  function focusFirstMissingField() {
    const firstMissingName = ['companyName', 'contactName', 'emailOrPhone', 'origin', 'destination', 'commodity'].find((name) => !values[name as keyof QuoteFormValues]?.trim());
    const field = firstMissingName ? formRef.current?.querySelector<HTMLElement>(`[name="${firstMissingName}"]`) : null;
    field?.focus();
    field?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function handleOpenEmailDraft() {
    const missing = getMissingRequiredQuoteFields(values);

    if (missing.length > 0) {
      setValidationMessage(`Please complete required fields: ${missing.join(', ')}.`);
      focusFirstMissingField();
      return;
    }

    window.location.href = href;
  }

  async function handleCopySummary() {
    try {
      await navigator.clipboard.writeText(emailText);
      setCopyStatus('Request summary copied.');
    } catch {
      setCopyStatus(`Copy failed. Please email ${contactEmail} directly.`);
    }
  }

  const commonClass = 'mt-2 min-h-12 w-full rounded-2xl border border-[#001112]/12 bg-[#f4f7f6] px-4 py-3 text-base font-semibold text-[#001112] outline-none transition placeholder:text-[#001112]/35 focus:border-[#21d4c2] focus:bg-white focus:ring-4 focus:ring-[#21d4c2]/14';

  return (
    <section className="px-6 pb-20 sm:px-10 lg:px-14">
      <div className="grid gap-8 rounded-[36px] border border-[#001112]/10 bg-white p-6 shadow-[0_24px_90px_rgba(0,17,18,.08)] sm:p-8 lg:grid-cols-[1.2fr_.8fr] lg:p-10">
        <form ref={formRef} className="grid gap-8" aria-label="KS WAYS structured freight quote form" noValidate>
          <div>
            <p className="text-sm font-black uppercase tracking-[.14em] text-[#0b7f78]">Quote details</p>
            <h2 className="mt-3 text-[clamp(30px,4.5vw,56px)] font-black leading-[.98] tracking-[-.06em]">Prepare an air or ocean freight request.</h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-[#001112]/62">
              Choose the transport mode first. The form then keeps the most useful route, cargo, equipment, and special-handling fields visible for KS WAYS review. Nothing is sent automatically; you review the prepared email before sending.
            </p>
          </div>

          <fieldset className="rounded-[28px] border border-[#001112]/10 bg-[#f4f7f6] p-4 sm:p-5">
            <legend className="px-2 text-sm font-black uppercase tracking-[.14em] text-[#0b7f78]">Transport mode *</legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              {transportModeOptions.map((option) => {
                const isActive = (values.transportMode ?? 'Not sure') === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => updateTransportMode(option.value)}
                    className={`rounded-2xl border p-4 text-left transition ${isActive ? 'border-[#0b7f78] bg-[#001112] text-white shadow-[0_16px_36px_rgba(0,17,18,.16)]' : 'border-[#001112]/10 bg-white text-[#001112] hover:border-[#21d4c2]'}`}
                  >
                    <span className="block text-lg font-black">{option.label}</span>
                    <span className={`mt-1 block text-xs font-bold leading-snug ${isActive ? 'text-white/64' : 'text-[#001112]/50'}`}>{option.helper}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {visibleSections.map((section) => (
            <fieldset key={section} className="grid gap-4">
              <legend className="text-lg font-black tracking-[-.03em] text-[#001112]">{sectionLabels[section]}</legend>
              <p className="text-sm leading-relaxed text-[#001112]/54">{sectionDescriptions[section]}</p>
              <div className="grid gap-4 md:grid-cols-2">
                {quoteFormFields
                  .filter((field) => field.section === section)
                  .map((field) => {
                    const fieldValue = values[field.name] ?? '';
                    const isWide = field.type === 'textarea';
                    const isDgReviewField = field.name === 'unNumber' || field.name === 'dgClass';
                    const labelClass = isDgReviewField && dgSelected ? 'md:col-span-1 rounded-3xl border border-[#0b7f78]/30 bg-[#e8fbf8] p-3' : isWide ? 'md:col-span-2' : undefined;
                    const inputClass = `${commonClass} ${isDgReviewField && dgSelected ? 'border-[#0b7f78]/35 bg-white ring-4 ring-[#21d4c2]/12' : ''}`;

                    return (
                      <label key={field.name} className={labelClass}>
                        <span className="text-sm font-black text-[#001112]/76">
                          {field.label}
                          {field.required ? <span className="text-[#0b7f78]"> *</span> : null}
                        </span>
                        {field.type === 'textarea' ? (
                          <textarea
                            name={field.name}
                            value={fieldValue}
                            onChange={(event) => update(field.name, event.target.value)}
                            placeholder={field.placeholder}
                            rows={5}
                            className={inputClass}
                          />
                        ) : field.type === 'select' ? (
                          <select name={field.name} value={fieldValue} onChange={(event) => update(field.name, event.target.value)} className={inputClass}>
                            {field.options?.map((option) => <option key={option}>{option}</option>)}
                          </select>
                        ) : (
                          <input
                            name={field.name}
                            value={fieldValue}
                            onChange={(event) => update(field.name, event.target.value)}
                            placeholder={field.placeholder}
                            required={field.required}
                            type={field.type === 'date' ? 'date' : 'text'}
                            className={inputClass}
                          />
                        )}
                        {field.helper ? <span className="mt-2 block text-xs font-semibold leading-relaxed text-[#001112]/48">{field.helper}</span> : null}
                      </label>
                    );
                  })}
              </div>
            </fieldset>
          ))}
          {dgSelected ? (
            <div className="rounded-[26px] border border-[#0b7f78]/20 bg-[#e8fbf8] p-5 text-sm font-bold leading-relaxed text-[#001112]/70">
              DG cargo selected — please add UN No., DG class, and attach MSDS / DG declaration when the email draft opens.
            </div>
          ) : null}

          <div className="rounded-[28px] border border-[#001112]/10 bg-[#f4f7f6] p-5 lg:hidden">
            <p className="text-sm font-black uppercase tracking-[.14em] text-[#0b7f78]">Review</p>
            <p className="mt-2 text-sm leading-relaxed text-[#001112]/60">
              {canOpenEmail ? 'All required fields are ready.' : `${missingRequiredFields.length} required fields left before opening a clean email draft.`}
            </p>
            {validationMessage ? <p className="mt-3 text-sm font-black text-[#a15c00]">{validationMessage}</p> : null}
            <button
              type="button"
              onClick={handleOpenEmailDraft}
              className="mt-4 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-[#001112] px-6 text-center font-black text-white transition hover:bg-[#0b7f78]"
            >
              Open email draft to KS WAYS
            </button>
          </div>
        </form>

        <aside className="self-start rounded-[30px] bg-[#001112] p-6 text-white shadow-[0_24px_80px_rgba(0,17,18,.22)] sm:p-7 lg:sticky lg:top-8">
          <p className="font-mono text-xs font-black uppercase tracking-[.18em] text-[#6fffe7]/78">Email handoff</p>
          <h3 className="mt-4 text-3xl font-black tracking-[-.05em]">Review the draft, then send from your inbox.</h3>
          <p className="mt-4 leading-relaxed text-white/64">
            Complete the required basics, then open a prepared email to {contactEmail}. Attach packing list, invoice, MSDS, photos, or equipment drawings in your email client if needed.
          </p>
          {validationMessage ? (
            <div className="mt-5 rounded-2xl border border-[#ffb84d]/40 bg-[#ffb84d]/12 p-4 text-sm font-bold leading-relaxed text-[#ffe8bd]" role="alert">
              {validationMessage}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-white/12 bg-white/[.06] p-4 text-sm leading-relaxed text-white/66">
              <span className="font-black text-white">Required status:</span> {canOpenEmail ? 'Ready to prepare email draft.' : `${missingRequiredFields.length} required fields left.`}
            </div>
          )}
          <button
            type="button"
            onClick={handleOpenEmailDraft}
            className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-gradient-to-br from-[#21d4c2] to-[#6fffe7] px-6 text-center font-black text-[#001112] shadow-[0_18px_46px_rgba(33,212,194,.24)] transition hover:scale-[1.015]"
          >
            Open email draft to KS WAYS
          </button>
          <button
            type="button"
            onClick={handleCopySummary}
            className="mt-3 inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-white/16 px-6 text-center font-black text-white transition hover:border-[#6fffe7]/70 hover:bg-white/[.08]"
          >
            Copy request summary
          </button>
          {copyStatus ? <p className="mt-3 text-sm font-bold text-[#6fffe7]">{copyStatus}</p> : null}
          <p className="mt-4 text-xs font-semibold leading-relaxed text-white/44">
            If your email app does not open, copy the request summary and email {contactEmail} directly. Nothing is submitted to a server from this page.
          </p>
          <div className="mt-6 rounded-2xl border border-white/12 bg-white/[.06] p-4 text-sm leading-relaxed text-white/66">
            <p className="font-black text-white">Recommended attachments</p>
            <ul className="mt-3 grid gap-2">
              <li>• Packing list / commercial invoice</li>
              <li>• MSDS or DG declaration, if applicable</li>
              <li>• Container stuffing plan, cargo photos, drawings</li>
              <li>• Reefer temperature, OOG dimensions, free-time needs</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
