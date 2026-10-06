import type { QuoteFormField, QuoteFormValues } from '@/lib/quote-form';

// The global two-tone focus ring in globals.css owns the focus indicator here;
// nothing in this class may suppress the outline or add a shadow ring — see
// DESIGN.md "Focus" for the exact prohibitions, enforced by
// src/focus-visible.test.ts. The border/background shifts below are supporting
// affordance, not the indicator.
const fieldClass = 'min-h-12 w-full rounded-2xl border border-[var(--ks-border-control)] bg-[#f4f7f6] px-4 py-3 text-base font-semibold text-[#001112] transition placeholder:text-[#001112]/64 focus:border-[#b88a5a] focus:bg-white';
const commonClass = `mt-2 ${fieldClass}`;

type QuoteFieldProps = {
  field: QuoteFormField;
  value: string;
  /** DG 화물일 때 UN No.·DG class 칸을 강조한다. */
  highlighted: boolean;
  onChange: (name: keyof QuoteFormValues, value: string) => void;
};

function getLabelClass(field: QuoteFormField, highlighted: boolean) {
  if (highlighted) {
    return 'md:col-span-1 rounded-3xl border border-[#805d3b]/30 bg-[#faf4ec] p-3';
  }

  return field.type === 'textarea' ? 'md:col-span-2' : undefined;
}

export function QuoteField({ field, value, highlighted, onChange }: QuoteFieldProps) {
  // Emphasis via border weight, not a ring: Tailwind rings compile to
  // box-shadow and would overwrite the focus ring's inner layer.
  const inputClass = `${commonClass} ${highlighted ? 'border-[#805d3b]/60 bg-white' : ''}`;
  const handleChange = (event: { target: { value: string } }) => onChange(field.name, event.target.value);

  return (
    <label className={getLabelClass(field, highlighted)}>
      <span className="text-sm font-black text-[#001112]/76">
        {field.label}
        {field.unit ? <span className="sr-only"> ({field.unit})</span> : null}
        {field.required ? <span className="text-[#805d3b]"> *</span> : null}
      </span>
      <QuoteFieldControl field={field} value={value} inputClass={inputClass} onChange={handleChange} />
      {field.helper ? <span className="mt-2 block text-xs font-semibold leading-relaxed text-[#001112]/66">{field.helper}</span> : null}
    </label>
  );
}

type QuoteFieldControlProps = {
  field: QuoteFormField;
  value: string;
  inputClass: string;
  onChange: (event: { target: { value: string } }) => void;
};

function QuoteFieldControl({ field, value, inputClass, onChange }: QuoteFieldControlProps) {
  if (field.type === 'textarea') {
    return <textarea name={field.name} value={value} onChange={onChange} placeholder={field.placeholder} rows={5} className={inputClass} />;
  }

  if (field.type === 'select') {
    return (
      <select name={field.name} value={value} onChange={onChange} className={inputClass}>
        {field.options?.map((option) => <option key={option}>{option}</option>)}
      </select>
    );
  }

  if (field.unit) {
    // Etsy-style fixed unit inside the field. Stays type="text" so a typed
    // "1,050 lbs" is kept as-is; the unit is only appended to bare numbers.
    return (
      <span className="relative mt-2 block">
        <input
          name={field.name}
          value={value}
          onChange={onChange}
          placeholder={field.placeholder}
          required={field.required}
          type="text"
          inputMode="decimal"
          className={`${fieldClass} pr-16`}
        />
        <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-black text-[#001112]/66">
          {field.unit}
        </span>
      </span>
    );
  }

  return (
    <input
      name={field.name}
      value={value}
      onChange={onChange}
      placeholder={field.placeholder}
      required={field.required}
      type={field.type === 'date' ? 'date' : 'text'}
      className={inputClass}
    />
  );
}
