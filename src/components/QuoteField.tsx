import { CircleAlert } from 'lucide-react';
import type { QuoteFormField, QuoteFormValues } from '@/lib/quote-form';

// The global two-tone focus ring in globals.css owns the focus indicator here;
// nothing in this class may suppress the outline or add a shadow ring — see
// DESIGN.md "Focus" for the exact prohibitions, enforced by
// src/focus-visible.test.ts. The border/background shifts below are supporting
// affordance, not the indicator.
// Border width, color and fill are chosen once per field by the surface constants below — two
// border colors (or widths) in one class list resolve by stylesheet order, not by intent.
const fieldClass = 'min-h-12 w-full rounded-2xl px-4 py-3 text-base font-semibold text-navy transition placeholder:font-normal placeholder:text-muted focus:border-accent focus:bg-white';
// `border-control` (3.25:1 on paper) — ink 12% measured about 1.3:1, an invisible boundary.
const defaultSurface = 'border border-border-control bg-paper';
// Full-strength accent-ink (5.92:1 on white); at 60% it fell to 2.57:1, under the
// 3:1 a control boundary needs (DESIGN.md "Readability").
const highlightedSurface = 'border border-accent-ink bg-white';
// A required field left empty after a submit attempt (DESIGN.md "Form Field"): a 2px
// `warning` border. `warning` is 5.6:1 on paper, past the 3:1 a control boundary
// needs; it is semantic, never an accent. Width is the second cue besides colour.
const invalidSurface = 'border-2 border-warning bg-paper';

export const quoteFieldErrorId = (name: string) => `${name}-error`;

function getSurface(highlighted: boolean, invalid: boolean) {
  if (invalid) {
    return invalidSurface;
  }

  return highlighted ? highlightedSurface : defaultSurface;
}

type QuoteFieldProps = {
  field: QuoteFormField;
  value: string;
  /** DG 화물일 때 UN No.·DG class 칸을 강조한다. */
  highlighted: boolean;
  /** 제출 시도 후 비어 있는 필수 항목. aria-invalid 와 연결된 오류 문구를 켠다. */
  invalid?: boolean;
  onChange: (name: keyof QuoteFormValues, value: string) => void;
};

function getLabelClass(field: QuoteFormField, highlighted: boolean) {
  if (highlighted) {
    return 'md:col-span-1 rounded-3xl border border-accent-ink/30 bg-accent-tint p-3';
  }

  return field.type === 'textarea' ? 'md:col-span-2' : undefined;
}

export function QuoteField({ field, value, highlighted, invalid = false, onChange }: QuoteFieldProps) {
  // Emphasis via border color, not a ring: Tailwind rings compile to
  // box-shadow and would overwrite the focus ring's inner layer.
  const surface = getSurface(highlighted, invalid);
  const inputClass = `mt-2 ${fieldClass} ${surface}`;
  const handleChange = (event: { target: { value: string } }) => onChange(field.name, event.target.value);
  const errorId = quoteFieldErrorId(field.name);
  const a11y = invalid ? { 'aria-invalid': true, 'aria-describedby': errorId } : {};

  return (
    <label className={getLabelClass(field, highlighted)}>
      <span className="text-sm font-black text-navy/76">
        {field.label}
        {field.unit ? <span className="sr-only"> ({field.unit})</span> : null}
        {field.required ? <span className="text-accent-ink"> *</span> : null}
      </span>
      <QuoteFieldControl field={field} value={value} inputClass={inputClass} unitSurface={surface} a11y={a11y} onChange={handleChange} />
      {invalid ? (
        <span id={errorId} className="mt-2 flex items-start gap-1.5 text-sm font-semibold leading-snug text-warning">
          <CircleAlert aria-hidden="true" className="mt-px size-4 shrink-0" />
          Enter {field.label.toLowerCase()} to continue.
        </span>
      ) : null}
      {field.helper ? <span className="mt-2 block text-xs font-semibold leading-relaxed text-navy/66">{field.helper}</span> : null}
    </label>
  );
}

type QuoteFieldControlProps = {
  field: QuoteFormField;
  value: string;
  inputClass: string;
  /** Surface for the unit input, which carries its own padding instead of mt-2. */
  unitSurface: string;
  a11y: { 'aria-invalid'?: boolean; 'aria-describedby'?: string };
  onChange: (event: { target: { value: string } }) => void;
};

function QuoteFieldControl({ field, value, inputClass, unitSurface, a11y, onChange }: QuoteFieldControlProps) {
  if (field.type === 'textarea') {
    return <textarea name={field.name} value={value} onChange={onChange} placeholder={field.placeholder} rows={5} className={inputClass} {...a11y} />;
  }

  if (field.type === 'select') {
    return (
      <select name={field.name} value={value} onChange={onChange} className={inputClass} {...a11y}>
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
          className={`${fieldClass} ${unitSurface} pr-16`}
          {...a11y}
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
      {...a11y}
    />
  );
}
