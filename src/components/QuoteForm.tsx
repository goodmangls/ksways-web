'use client';

import { useMemo, useState } from 'react';
import { buildQuoteMailto, quoteFormFields, type QuoteFormValues } from '@/lib/quote-form';
import { contactEmail } from '@/lib/seo';

export function QuoteForm({ initialValues = { preferredMode: 'Not sure' } }: { initialValues?: QuoteFormValues }) {
  const [values, setValues] = useState<QuoteFormValues>(initialValues);
  const href = useMemo(() => buildQuoteMailto(values), [values]);

  function update(name: keyof QuoteFormValues, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  return (
    <section className="px-6 pb-20 sm:px-10 lg:px-14">
      <div className="grid gap-8 rounded-[36px] border border-[#001112]/10 bg-white p-6 shadow-[0_24px_90px_rgba(0,17,18,.08)] sm:p-8 lg:grid-cols-[1.2fr_.8fr] lg:p-10">
        <form className="grid gap-5" aria-label="KS WAYS structured freight quote form">
          <div>
            <p className="text-sm font-black uppercase tracking-[.14em] text-[#0b7f78]">Quote details</p>
            <h2 className="mt-3 text-[clamp(30px,4.5vw,56px)] font-black leading-[.98] tracking-[-.06em]">Send a quote-ready request.</h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-[#001112]/62">
              Fill the key shipment fields, then open a prepared email to {contactEmail}. No information is submitted until you send the email from your own mail app.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {quoteFormFields.map((field) => {
              const commonClass = 'mt-2 min-h-12 w-full rounded-2xl border border-[#001112]/12 bg-[#f4f7f6] px-4 py-3 text-base font-semibold text-[#001112] outline-none transition placeholder:text-[#001112]/35 focus:border-[#21d4c2] focus:bg-white focus:ring-4 focus:ring-[#21d4c2]/14';
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
        </form>

        <aside className="self-start rounded-[30px] bg-[#001112] p-6 text-white shadow-[0_24px_80px_rgba(0,17,18,.22)] sm:p-7 lg:sticky lg:top-8">
          <p className="font-mono text-xs font-black uppercase tracking-[.18em] text-[#6fffe7]/78">Email handoff</p>
          <h3 className="mt-4 text-3xl font-black tracking-[-.05em]">Review, then send from your inbox.</h3>
          <p className="mt-4 leading-relaxed text-white/64">
            This page prepares the operational details for KS WAYS. Attach MSDS, packing list, invoice, photos, or drawings in your email client if needed.
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
              <li>• Cargo photos, dimensions, drawings</li>
              <li>• Temperature or handling instructions</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
