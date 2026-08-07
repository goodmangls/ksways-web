/**
 * Shared probe page for cross-engine CSS verification.
 *
 * Used by both runners so Firefox and Safari are measured against exactly the
 * same markup: scripts/verify-css-engines.mjs (Playwright) and
 * scripts/verify-safari.mjs (safaridriver / WebDriver).
 *
 * The page inlines the REAL src/app/globals.css — only the `@import
 * "tailwindcss"` line is stripped, since the probe uses plain markup and no
 * utilities. A hand-copied set of keyframes would drift from what ships; this
 * cannot.
 */

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

/**
 * Frozen points on the 21s cycle, chosen to straddle every keyframe segment
 * including the fade-*in* (95%), which earlier cycles never exercised.
 */
export const PROBES = [
  { id: 'p0', delay: '0s', progress: '0% — 완전 가시', expect: 'visible' },
  { id: 'p1', delay: '-6.3s', progress: '30% — 페이드 중', expect: 'visible' },
  { id: 'p2', delay: '-6.72s', progress: '32% — 페이드 중', expect: 'visible' },
  { id: 'p3', delay: '-10s', progress: '47.6% — 완전 비가시', expect: 'hidden' },
  { id: 'p4', delay: '-19.95s', progress: '95% — 페이드 인', expect: 'visible' },
];

export function buildProbePage() {
  const css = readFileSync(join(ROOT, 'src/app/globals.css'), 'utf8').replace(
    /^@import\s+["']tailwindcss["'];?\s*$/m,
    '',
  );

  // Each container carries BOTH a link and a text input.
  //
  // Safari's "Press Tab to highlight each item on a webpage" preference governs
  // whether <a> elements join the tab sequence at all; form controls always do.
  // Probing with an input therefore tests the engine question we actually care
  // about — does `visibility: hidden` remove an element from sequential focus
  // navigation — without depending on a user preference we cannot set.
  const credits = PROBES.map(
    (p) => `
    <p class="ks-hero-bg-attribution" id="${p.id}"
       style="animation-delay:${p.delay};animation-play-state:paused">
      ${p.id}
      <a href="#" id="${p.id}-link">link-${p.id}</a>
      <input id="${p.id}-input" size="6" value="${p.id}" />
    </p>`,
  ).join('');

  return `<!doctype html><html><head><meta charset="utf-8"><title>css-engine-probe</title><style>
${css}
body { background: #001112; color: #fff; font: 14px system-ui; padding: 24px; }
.probe-input {
  display: block; margin-top: 32px; padding: 12px 16px; font-size: 16px;
  border-radius: 16px; border: 1px solid rgba(255,255,255,.3);
  background: #fff; color: #001112; width: 320px;
}
</style></head><body>
  <div id="credits">${credits}</div>
  <input class="probe-input" id="rounded" placeholder="rounded — focus ring shape probe" />
  <a href="#" id="sentinel">sentinel</a>
</body></html>`;
}
