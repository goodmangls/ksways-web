'use client';

import { useMemo, useState } from 'react';
import { buildQuoteMailto, quoteFormFields, transportModeOptions, type QuoteFormValues } from '@/lib/quote-form';
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
  cargo: 'Weight, volume, and cargo facts needed for air, LCL, and FCL pricing.',
  ocean: 'FCL/LCL equipment details such as 20FT, 40FT, reefer, flat rack, or open top.',
  handling: 'Operational constraints that affect feasibility, cost, and routing quality.',
} as const;

const sections = ['company', 'route', 'cargo', 'ocean', 'handling'] as const;

export function QuoteForm({ initialValues = { transportMode: 'Not sure', shipmentType: 'Not sure' } }: { initialValues?: QuoteFormValues }) {
  const [values, setValues] = useState<QuoteFormValues>(initialValues);
  const href = useMemo(() => buildQuoteMailto(values), [values]);

  function update(name: keyof QuoteFormValues, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  const commonClass = 'mt-2 min-h-12 w-full rounded-2xl border border-[#001112]/12 bg-[#f4f7f6] px-4 py-3 text-base font-semibold text-[#001112] outline-none transition placeholder:text-[#001112]/35 focus:border-[#21d4c2] focus:bg-white focus:ring-4 focus:ring-[#21d4c2]/14';

  return (
    <section className="px-6 pb-20 sm:px-10 lg:px-14">
      <div className="grid gap-8 rounded-[36px] border border-[#001112]/10 bg-white p-6 shadow-[0_24px_90px_rgba(0,17,18,.08)] sm:p-8 lg:grid-cols-[1.2fr_.8fr] lg:p-10">
        <form className="grid gap-8" aria-label="KS WAYS structured freight quote form">
          <div>
            <p className="text-sm font-black uppercase tracking-[.14em] text-[#0b7f78]">Quote details</p>
            <h2 className="mt-3 text-[clamp(30px,4.5vw,56px)] font-black leading-[.98] tracking-[-.06em]">Send an ocean-ready freight request.</h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-[#001112]/62">
              Start with the transport mode, then add the operational fields needed for FCL, LCL, air, express, multimodal, and special cargo review. The page opens a prepared email to {contactEmail}; nothing is sent automatically.
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
                    onClick={() => update('transportMode', option.value)}
                    className={`rounded-2xl border p-4 text-left transition ${isActive ? 'border-[#0b7f78] bg-[#001112] text-white shadow-[0_16px_36px_rgba(0,17,18,.16)]' : 'border-[#001112]/10 bg-white text-[#001112] hover:border-[#21d4c2]'}`}
                  >
                    <span className="block text-lg font-black">{option.label}</span>
                    <span className={`mt-1 block text-xs font-bold leading-snug ${isActive ? 'text-white/64' : 'text-[#001112]/50'}`}>{option.helper}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {sections.map((section) => (
            <fieldset key={section} className="grid gap-4">
              <legend className="text-lg font-black tracking-[-.03em] text-[#001112]">{sectionLabels[section]}</legend>
              <p className="text-sm leading-relaxed text-[#001112]/54">{sectionDescriptions[section]}</p>
              <div className="grid gap-4 md:grid-cols-2">
                {quoteFormFields
                  .filter((field) => field.section === section)
                  .map((field) => {
                    const fieldValue = values[field.name] ?? '';
                    const isWide = field.type === 'textarea';

                    return (
                      <label key={field.name} className={isWide ? 'md:col-span-2' : undefined}>
                        <span className="text-sm font-black text-[#001112]/76">
                          {field.label}
                          {field.required ? <span className="text-[#0b7f78]"> *</span> : null}
                        </span>
                        {field.type === 'textarea' ? (
                          <textarea
                            value={fieldValue}
                            onChange={(event) => update(field.name, event.target.value)}
                            placeholder={field.placeholder}
                            rows={5}
                            className={commonClass}
                          />
                        ) : field.type === 'select' ? (
                          <select value={fieldValue} onChange={(event) => update(field.name, event.target.value)} className={commonClass}>
                            {field.options?.map((option) => <option key={option}>{option}</option>)}
                          </select>
                        ) : (
                          <input
                            value={fieldValue}
                            onChange={(event) => update(field.name, event.target.value)}
                            placeholder={field.placeholder}
                            required={field.required}
                            type={field.type === 'date' ? 'date' : 'text'}
                            className={commonClass}
                          />
                        )}
                      </label>
                    );
                  })}
              </div>
            </fieldset>
          ))}
        </form>

        <aside className="self-start rounded-[30px] bg-[#001112] p-6 text-white shadow-[0_24px_80px_rgba(0,17,18,.22)] sm:p-7 lg:sticky lg:top-8">
          <p className="font-mono text-xs font-black uppercase tracking-[.18em] text-[#6fffe7]/78">Email handoff</p>
          <h3 className="mt-4 text-3xl font-black tracking-[-.05em]">Review, then send from your inbox.</h3>
          <p className="mt-4 leading-relaxed text-white/64">
            This page now captures both air and ocean quotation data. Attach packing list, invoice, MSDS, photos, or equipment drawings in your email client if needed.
          </p>
          <a
            href={href}
            className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-gradient-to-br from-[#21d4c2] to-[#6fffe7] px-6 text-center font-black text-[#001112] shadow-[0_18px_46px_rgba(33,212,194,.24)] transition hover:scale-[1.015]"
          >
            Open prepared email
          </a>
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
