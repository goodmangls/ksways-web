/** The site's one arrow: 16px, 1.8 stroke, inherits text colour. `external` points up-right. */
export function ArrowIcon({ external = false }: { external?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d={external ? 'M5 11l6-6M6 5h5v5' : 'M3 8h10M9 4l4 4-4 4'}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
