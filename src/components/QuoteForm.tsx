'use client';

import { useMemo, useRef, useState } from 'react';
import {
  buildQuoteEmailText,
  buildQuoteMailto,
  getMissingRequiredQuoteFields,
  getShipmentTypeForTransportMode,
  getVisibleQuoteSections,
  isDgCargo,
  QUOTE_MAILTO_LENGTH_LIMIT,
  quoteFormFields,
  transportModeOptions,
  type QuoteFormValues,
} from '@/lib/quote-form';
import { conversionDataAttributes, conversionEventNames } from '@/lib/conversion';
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

type QuoteFormProps = {
  initialValues?: QuoteFormValues;
  navigate?: (href: string) => void;
};

export function QuoteForm({ initialValues = { transportMode: 'Not sure', shipmentType: 'Not sure' }, navigate }: QuoteFormProps) {
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
  const mailtoOverLimit = href.length > QUOTE_MAILTO_LENGTH_LIMIT;
  const lengthWarning = 'This request is long — some email apps may truncate the prepared draft. We recommend “Copy request summary” and pasting the full details into your email instead.';

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

    (navigate ?? ((target: string) => { window.location.href = target; }))(href);
  }

  async function handleCopySummary() {
    try {
      await navigator.clipboard.writeText(emailText);
      setCopyStatus('Request summary copied.');
    } catch {
      setCopyStatus(`Copy failed. Please email ${contactEmail} directly.`);
    }
  }

  // The global two-tone focus ring in globals.css owns the focus indicator here;
  // nothing in this class may suppress the outline or add a shadow ring — see
  // DESIGN.md "Focus" for the exact prohibitions, enforced by
  // src/focus-visible.test.ts. The border/background shifts below are supporting
  // affordance, not the indicator.
  const commonClass = 'mt-2 min-h-12 w-full rounded-2xl border border-[#001112]/12 bg-[#f4f7f6] px-4 py-3 text-base font-semibold text-[#001112] transition placeholder:text-[#001112]/35 focus:border-[#b88a5a] focus:bg-white';

  return (
    <section className="px-6 pb-20 sm:px-10 lg:px-14">
      <div className="grid gap-8 rounded-[36px] border border-[#001112]/10 bg-white p-6 shadow-[0_24px_90px_rgba(0,17,18,.08)] sm:p-8 lg:grid-cols-[1.2fr_.8fr] lg:p-10">
        <form ref={formRef} className="grid gap-8" aria-label="KS WAYS structured freight quote form" noValidate>
          <div>
            <p className="text-sm font-black uppercase tracking-[.14em] text-[#805d3b]">Quote details</p>
            <h2 className="mt-3 text-[clamp(30px,4.5vw,56px)] font-black leading-[.98] tracking-[-.06em]">Prepare an air or ocean freight request.</h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-[#001112]/62">
              Choose the transport mode first. The form then keeps the most useful route, cargo, equipment, and special-handling fields visible for KS WAYS review. Nothing is sent automatically; you review the prepared email before sending.
            </p>
          </div>

          <fieldset className="rounded-[28px] border border-[#001112]/10 bg-[#f4f7f6] p-4 sm:p-5">
            <legend className="px-2 text-sm font-black uppercase tracking-[.14em] text-[#805d3b]">Transport mode *</legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              {transportModeOptions.map((option) => {
                const isActive = (values.transportMode ?? 'Not sure') === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => updateTransportMode(option.value)}
                    className={`rounded-2xl border p-4 text-left transition ${isActive ? 'border-[#805d3b] bg-[#001112] text-white shadow-[0_16px_36px_rgba(0,17,18,.16)]' : 'border-[#001112]/10 bg-white text-[#001112] hover:border-[#b88a5a]'}`}
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
                    const labelClass = isDgReviewField && dgSelected ? 'md:col-span-1 rounded-3xl border border-[#805d3b]/30 bg-[#faf4ec] p-3' : isWide ? 'md:col-span-2' : undefined;
                    // Emphasis via border weight, not a ring: Tailwind rings compile to
                    // box-shadow and would overwrite the focus ring's inner layer.
                    const inputClass = `${commonClass} ${isDgReviewField && dgSelected ? 'border-[#805d3b]/60 bg-white' : ''}`;

                    return (
                      <label key={field.name} className={labelClass}>
                        <span className="text-sm font-black text-[#001112]/76">
                          {field.label}
                          {field.required ? <span className="text-[#805d3b]"> *</span> : null}
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
            <div className="rounded-[26px] border border-[#805d3b]/20 bg-[#faf4ec] p-5 text-sm font-bold leading-relaxed text-[#001112]/70">
              DG cargo selected — please add UN No., DG class, and attach MSDS / DG declaration when the email draft opens.
            </div>
          ) : null}

          <div className="sticky bottom-3 z-20 rounded-[28px] border border-[#001112]/10 bg-[#f4f7f6]/95 p-5 shadow-[0_18px_60px_rgba(0,17,18,.12)] backdrop-blur lg:hidden">
            <p className="text-sm font-black uppercase tracking-[.14em] text-[#805d3b]">Review</p>
            <p className="mt-2 text-sm leading-relaxed text-[#001112]/60">
              {canOpenEmail ? 'All required fields are ready.' : `${missingRequiredFields.length} required fields left before opening a clean email draft.`}
            </p>
            {validationMessage ? <p className="mt-3 text-sm font-black text-[#a15c00]">{validationMessage}</p> : null}
            {mailtoOverLimit ? (
              <p role="status" className="mt-3 rounded-2xl border border-[#a15c00]/25 bg-[#a15c00]/8 p-4 text-sm font-bold leading-relaxed text-[#a15c00]">
                {lengthWarning}
              </p>
            ) : null}
            <button
              type="button"
              onClick={handleOpenEmailDraft}
              {...conversionDataAttributes(conversionEventNames.mailto, { location: 'quote_form_mobile_review', href })}
              className="mt-4 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-[#001112] px-6 text-center font-black text-white transition hover:bg-[#805d3b]"
            >
              Open email draft to KS WAYS
            </button>
          </div>
        </form>

        <aside className="self-start rounded-[30px] bg-[#001112] p-6 text-white shadow-[0_24px_80px_rgba(0,17,18,.22)] sm:p-7 lg:sticky lg:top-8">
          <p className="font-mono text-xs font-black uppercase tracking-[.18em] text-[#e7c99a]/78">Email handoff</p>
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
          {mailtoOverLimit ? (
            <p role="status" className="mt-4 rounded-2xl border border-[#ffb84d]/40 bg-[#ffb84d]/12 p-4 text-sm font-bold leading-relaxed text-[#ffe8bd]">
              {lengthWarning}
            </p>
          ) : null}
          <button
            type="button"
            onClick={handleOpenEmailDraft}
            {...conversionDataAttributes(conversionEventNames.mailto, { location: 'quote_form_sidebar', href })}
            className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-[#b88a5a] px-6 text-center font-black text-[#001112] shadow-[0_18px_46px_rgba(184,138,90,.24)] transition hover:brightness-105"
          >
            Open email draft to KS WAYS
          </button>
          <button
            type="button"
            onClick={handleCopySummary}
            className="mt-3 inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-white/16 px-6 text-center font-black text-white transition hover:border-[#e7c99a]/70 hover:bg-white/[.08]"
          >
            Copy request summary
          </button>
          {copyStatus ? <p className="mt-3 text-sm font-bold text-[#e7c99a]">{copyStatus}</p> : null}
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
