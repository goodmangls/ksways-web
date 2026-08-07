/**
 * Cross-engine check for the two CSS mechanisms that keyboard accessibility
 * depends on here. Both shipped verified in Chromium only:
 *
 *   A. `visibility` inside @keyframes — must stay `visible` through the fade and
 *      flip to `hidden` only at opacity 0. If an engine interpolates differently,
 *      either invisible hero credits return to the tab order (the Level A bug we
 *      fixed) or — worse — the *visible* credit drops out of it.
 *   B. Tab order actually excludes the hidden containers.
 *   C. `outline` follows `border-radius` on the focus ring. Not machine-checkable;
 *      the script saves a screenshot for a human to look at.
 *
 * A and B decide the exit code. C is evidence only.
 *
 * The probe inlines the REAL src/app/globals.css rather than a copy, so it can
 * never drift from what ships. Only the `@import "tailwindcss"` line is dropped
 * (the probe uses plain markup, no utilities).
 *
 * Not wired into CI on purpose: engine behavior changes when browsers update,
 * not when we commit, and the declarations themselves are already guarded by
 * src/focus-visible.test.ts. See DESIGN.md "Browser Support".
 *
 * Usage — two steps, neither of which touches package.json:
 *
 *   # 1. the module, without its default ~500 MB browser download
 *   PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm install --no-save playwright@1.62.1
 *
 *   # 2. only the engine we actually verify against (~102 MB compressed)
 *   npx playwright install firefox
 *
 *   node scripts/verify-css-engines.mjs [--browser firefox] [--out <dir>]
 *
 * `--no-save` keeps playwright out of package.json, so `npm ci` in CI never
 * pays for it. A plain `npx playwright` is not enough here: this file imports
 * the module, and npx's copy is not resolvable from the project.
 *
 * Exit code: 0 when A and B pass, 1 on any failure or launch error.
 *
 * Safari is checked by hand — Playwright's WebKit is not Safari, and a real
 * Safari is available locally. Procedure:
 *   1. Safari → Settings → Advanced → enable "Press Tab to highlight each item
 *      on a webpage" (without this, Tab skips links and the check is void).
 *   2. npm run dev, open http://localhost:3000/quote, Tab into the form:
 *      the focus ring should follow the input's rounded corners.
 *   3. Open http://localhost:3000/ and Tab through: among the hero photo
 *      credits, only the currently visible pair should be reachable.
 */

import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const BROWSER = arg('browser', 'firefox');
const OUT_DIR = arg('out', join(ROOT, 'tmp', 'css-engine-verification'));

/** Frozen points on the 21s cycle, chosen to straddle every keyframe segment. */
const PROBES = [
  { id: 'p0', delay: '0s', progress: '0% — 완전 가시', expect: 'visible' },
  { id: 'p1', delay: '-6.3s', progress: '30% — 페이드 중', expect: 'visible' },
  { id: 'p2', delay: '-6.72s', progress: '32% — 페이드 중', expect: 'visible' },
  { id: 'p3', delay: '-10s', progress: '47.6% — 완전 비가시', expect: 'hidden' },
  { id: 'p4', delay: '-19.95s', progress: '95% — 페이드 인 시작', expect: 'visible' },
];

function buildProbePage() {
  const css = readFileSync(join(ROOT, 'src/app/globals.css'), 'utf8').replace(
    /^@import\s+["']tailwindcss["'];?\s*$/m,
    '',
  );

  const credits = PROBES.map(
    (p) => `
    <p class="ks-hero-bg-attribution" id="${p.id}"
       style="animation-delay:${p.delay};animation-play-state:paused">
      ${p.id} <a href="#" id="${p.id}-a">link-${p.id}-a</a> /
      <a href="#" id="${p.id}-b">link-${p.id}-b</a>
    </p>`,
  ).join('');

  return `<!doctype html><html><head><meta charset="utf-8"><style>
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

async function main() {
  const { [BROWSER]: engine } = await import('playwright');
  if (!engine) throw new Error(`Unknown browser: ${BROWSER}`);

  mkdirSync(OUT_DIR, { recursive: true });
  const probePath = join(OUT_DIR, 'probe.html');
  writeFileSync(probePath, buildProbePage());

  const browser = await engine.launch();
  const page = await browser.newPage({ viewport: { width: 900, height: 700 } });
  await page.goto(`file://${probePath}`);

  const failures = [];

  // ---- A. visibility interpolation -----------------------------------------
  const measured = await page.evaluate((ids) =>
    ids.map((id) => {
      const el = document.getElementById(id);
      const s = getComputedStyle(el);
      return { id, opacity: Number(Number(s.opacity).toFixed(3)), visibility: s.visibility };
    }),
  PROBES.map((p) => p.id));

  console.log(`\n[${BROWSER}] A. @keyframes visibility 보간`);
  for (const p of PROBES) {
    const m = measured.find((x) => x.id === p.id);
    const ok = m.visibility === p.expect;
    if (!ok) failures.push(`A: ${p.id} (${p.progress}) → visibility=${m.visibility}, 기대 ${p.expect}`);
    console.log(
      `  ${ok ? '✅' : '❌'} ${p.progress.padEnd(22)} opacity=${String(m.opacity).padEnd(6)} visibility=${m.visibility}`,
    );
  }

  // ---- B. tab order ---------------------------------------------------------
  await page.evaluate(() => document.body.focus());
  const reached = new Set();
  for (let i = 0; i < 24; i += 1) {
    await page.keyboard.press('Tab');
    const id = await page.evaluate(() => document.activeElement?.id ?? '');
    if (id) reached.add(id);
  }

  console.log(`\n[${BROWSER}] B. Tab 순서`);
  for (const p of PROBES) {
    const hit = reached.has(`${p.id}-a`) || reached.has(`${p.id}-b`);
    const shouldReach = p.expect === 'visible';
    const ok = hit === shouldReach;
    if (!ok) {
      failures.push(
        `B: ${p.id} (${p.progress}) → ${hit ? '도달 가능' : '도달 불가'}, 기대 ${shouldReach ? '도달 가능' : '도달 불가'}`,
      );
    }
    console.log(`  ${ok ? '✅' : '❌'} ${p.progress.padEnd(22)} ${hit ? '도달' : '미도달'}`);
  }

  // ---- C. outline + border-radius (evidence only) ---------------------------
  await page.focus('#rounded');
  const ring = await page.evaluate(() => {
    const s = getComputedStyle(document.getElementById('rounded'));
    return { outline: s.outline, outlineOffset: s.outlineOffset, boxShadow: s.boxShadow, radius: s.borderRadius };
  });
  const shot = join(OUT_DIR, `focus-ring-${BROWSER}.png`);
  await page.screenshot({ path: shot });

  console.log(`\n[${BROWSER}] C. outline + border-radius (육안 판단)`);
  console.log(`  border-radius : ${ring.radius}`);
  console.log(`  outline       : ${ring.outline} / offset ${ring.outlineOffset}`);
  console.log(`  box-shadow    : ${ring.boxShadow}`);
  console.log(`  스크린샷      : ${shot}`);

  await browser.close();

  console.log(`\n[${BROWSER}] 결과: ${failures.length === 0 ? '✅ A·B 통과' : `❌ ${failures.length}건 실패`}`);
  failures.forEach((f) => console.log(`  - ${f}`));
  process.exit(failures.length === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
