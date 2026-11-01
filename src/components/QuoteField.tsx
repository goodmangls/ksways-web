import type { QuoteFormField, QuoteFormValues } from '@/lib/quote-form';

// The global two-tone focus ring in globals.css owns the focus indicator here;
// nothing in this class may suppress the outline or add a shadow ring — see
// DESIGN.md "Focus" for the exact prohibitions, enforced by
// src/focus-visible.test.ts. The border/background shifts below are supporting
// affordance, not the indicator.
// Border color and fill are chosen once per field (defaultSurface / highlightedSurface) — two border
// colors in one class list resolve by stylesheet order, not by intent.
const fieldClass = 'min-h-12 w-full rounded-2xl border px-4 py-3 text-base font-semibold text-navy transition placeholder:text-navy/64 focus:border-accent focus:bg-white';
// `border-control` (3.25:1 on paper) — ink 12% measured about 1.3:1, an invisible boundary.
const defaultSurface = 'border-border-control bg-paper';
// Full-strength accent-ink (5.92:1 on white); at 60% it fell to 2.57:1, under the
// 3:1 a control boundary needs (DESIGN.md "Readability").
const highlightedSurface = 'border-accent-ink bg-white';

type QuoteFieldProps = {
  field: QuoteFormField;
  value: string;
  /** DG 화물일 때 UN No.·DG class 칸을 강조한다. */
  highlighted: boolean;
  onChange: (name: keyof QuoteFormValues, value: string) => void;
};

function getLabelClass(field: QuoteFormField, highlighted: boolean) {
  if (highlighted) {
    return 'md:col-span-1 rounded-3xl border border-accent-ink/30 bg-accent-tint p-3';
  }

  return field.type === 'textarea' ? 'md:col-span-2' : undefined;
}

export function QuoteField({ field, value, highlighted, onChange }: QuoteFieldProps) {
  // Emphasis via border color, not a ring: Tailwind rings compile to
  // box-shadow and would overwrite the focus ring's inner layer.
  const inputClass = `mt-2 ${fieldClass} ${highlighted ? highlightedSurface : defaultSurface}`;
  const handleChange = (event: { target: { value: string } }) => onChange(field.name, event.target.value);

  return (
    <label className={getLabelClass(field, highlighted)}>
      <span className="text-sm font-black text-navy/76">
        {field.label}
        {field.unit ? <span className="sr-only"> ({field.unit})</span> : null}
        {field.required ? <span className="text-accent-ink"> *</span> : null}
      </span>
      <QuoteFieldControl field={field} value={value} inputClass={inputClass} onChange={handleChange} />
      {field.helper ? <span className="mt-2 block text-xs font-semibold leading-relaxed text-navy/66">{field.helper}</span> : null}
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
          className={`${fieldClass} ${defaultSurface} pr-16`}
        />
        <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-black text-navy/66">
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
