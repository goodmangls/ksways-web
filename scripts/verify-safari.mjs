/**
 * The same cross-engine check as verify-css-engines.mjs, but against **real
 * Safari** rather than a stand-in.
 *
 * Playwright's WebKit is not Safari, so this drives `safaridriver` — the
 * WebDriver server Apple ships with Safari — over plain HTTP. That means **zero
 * npm dependencies**: no Playwright, no selenium client, nothing added to
 * package.json.
 *
 * One-time setup (a GUI toggle; nothing here can set it for you):
 *
 *   Safari → Settings → Developer → "Allow remote automation"
 *
 * Without it `safaridriver` answers session creation with:
 *   "You must enable 'Allow remote automation' in the Developer section…"
 *
 * Optional, and only for the link half of check B:
 *
 *   Safari → Settings → Advanced → "Press Tab to highlight each item on a webpage"
 *
 * That preference decides whether <a> elements join the tab sequence at all.
 * Form controls always do, so the probe puts an <input> in every container and
 * check B is conclusive either way — the preference only adds the link result
 * on top. This is deliberate: the engine question is whether
 * `visibility: hidden` removes an element from sequential focus navigation, and
 * that must not hinge on a user preference we cannot set.
 *
 * Usage:
 *   node scripts/verify-safari.mjs [--out <dir>] [--port 4599]
 *
 * Exit code: 0 when A and B pass, 1 on any failure, 2 when Safari is not
 * reachable (setup incomplete) — so "not set up" is distinguishable from "failed".
 */

import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { PROBES, ROOT, buildProbePage } from './lib/css-engine-probe.mjs';

const TAB_KEY = '\uE004'; // WebDriver 표준 Tab 키 코드

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const OUT_DIR = arg('out', join(ROOT, 'tmp', 'css-engine-verification'));
const PORT = Number(arg('port', '4599'));

async function wd(base, method, path, body) {
  const res = await fetch(base + path, {
    method,
    headers: { 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const json = await res.json();
  if (json.value && json.value.error) {
    const err = new Error(json.value.message || json.value.error);
    err.wdError = json.value.error;
    throw err;
  }
  return json.value;
}

/** Serves the probe over http — safaridriver is restrictive about file:// URLs. */
function serveProbe(html) {
  return new Promise((resolve) => {
    const server = createServer((_req, res) => {
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
      res.end(html);
    });
    server.listen(0, '127.0.0.1', () => {
      resolve({ server, url: `http://127.0.0.1:${server.address().port}/` });
    });
  });
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const html = buildProbePage();
  writeFileSync(join(OUT_DIR, 'probe.html'), html);
  const { server, url } = await serveProbe(html);

  const driver = spawn('/usr/bin/safaridriver', ['-p', String(PORT)], { stdio: 'ignore' });
  const base = `http://127.0.0.1:${PORT}`;
  const cleanup = () => {
    driver.kill();
    server.close();
  };

  // safaridriver needs a moment before it accepts connections.
  for (let i = 0; i < 20; i += 1) {
    try {
      await wd(base, 'GET', '/status');
      break;
    } catch {
      await new Promise((r) => setTimeout(r, 250));
    }
  }

  let session;
  try {
    session = await wd(base, 'POST', '/session', {
      capabilities: { alwaysMatch: { browserName: 'safari' } },
    });
  } catch (err) {
    cleanup();
    console.error('\n❌ Safari 세션을 만들 수 없습니다.\n');
    console.error(`   ${err.message}\n`);
    console.error('   Safari → 설정 → 개발자용 → "원격 자동화 허용" 을 켠 뒤 다시 실행하세요.');
    console.error('   (이 스크립트는 사용자의 Safari 설정을 변경하지 않습니다.)\n');
    process.exit(2);
  }

  const sid = session.sessionId;
  const s = (path) => `/session/${sid}${path}`;
  const failures = [];

  try {
    await wd(base, 'POST', s('/url'), { url });

    // ---- A. visibility interpolation ---------------------------------------
    const measured = await wd(base, 'POST', s('/execute/sync'), {
      script: `return arguments[0].map(function (id) {
        var el = document.getElementById(id);
        var st = getComputedStyle(el);
        return { id: id, opacity: Number(Number(st.opacity).toFixed(3)), visibility: st.visibility };
      });`,
      args: [PROBES.map((p) => p.id)],
    });

    console.log('\n[safari] A. @keyframes visibility 보간');
    for (const p of PROBES) {
      const m = measured.find((x) => x.id === p.id);
      const ok = m.visibility === p.expect;
      if (!ok) failures.push(`A: ${p.id} (${p.progress}) → visibility=${m.visibility}, 기대 ${p.expect}`);
      console.log(
        `  ${ok ? '✅' : '❌'} ${p.progress.padEnd(22)} opacity=${String(m.opacity).padEnd(6)} visibility=${m.visibility}`,
      );
    }

    // ---- B. tab order -------------------------------------------------------
    await wd(base, 'POST', s('/execute/sync'), { script: 'document.body.focus(); return null;', args: [] });

    const reached = new Set();
    for (let i = 0; i < 24; i += 1) {
      await wd(base, 'POST', s('/actions'), {
        actions: [
          {
            type: 'key',
            id: 'kb',
            actions: [
              { type: 'keyDown', value: TAB_KEY },
              { type: 'keyUp', value: TAB_KEY },
            ],
          },
        ],
      });
      const id = await wd(base, 'POST', s('/execute/sync'), {
        script: 'return document.activeElement ? document.activeElement.id : "";',
        args: [],
      });
      if (id) reached.add(id);
    }

    const linksReachable = PROBES.some((p) => reached.has(`${p.id}-link`));
    console.log('\n[safari] B. Tab 순서');
    console.log(
      `  링크 Tab 도달: ${linksReachable ? '가능 (Tab 하이라이트 켜짐)' : '불가 — Safari 설정상 링크는 Tab 대상이 아님'}`,
    );
    console.log('  → input 기준으로 판정 (폼 컨트롤은 설정과 무관하게 Tab 대상)');
    for (const p of PROBES) {
      const hit = reached.has(`${p.id}-input`);
      const shouldReach = p.expect === 'visible';
      const ok = hit === shouldReach;
      if (!ok) {
        failures.push(
          `B: ${p.id} (${p.progress}) → ${hit ? '도달 가능' : '도달 불가'}, 기대 ${shouldReach ? '도달 가능' : '도달 불가'}`,
        );
      }
      console.log(`  ${ok ? '✅' : '❌'} ${p.progress.padEnd(22)} ${hit ? '도달' : '미도달'}`);
    }

    // ---- C. outline + border-radius (evidence only) -------------------------
    const ring = await wd(base, 'POST', s('/execute/sync'), {
      script: `var el = document.getElementById('rounded');
        el.focus();
        var st = getComputedStyle(el);
        return { outline: st.outline, outlineOffset: st.outlineOffset, boxShadow: st.boxShadow, radius: st.borderRadius };`,
      args: [],
    });
    const b64 = await wd(base, 'GET', s('/screenshot'));
    const shot = join(OUT_DIR, 'focus-ring-safari.png');
    writeFileSync(shot, Buffer.from(b64, 'base64'));

    console.log('\n[safari] C. outline + border-radius (육안 판단)');
    console.log(`  border-radius : ${ring.radius}`);
    console.log(`  outline       : ${ring.outline} / offset ${ring.outlineOffset}`);
    console.log(`  box-shadow    : ${ring.boxShadow}`);
    console.log(`  스크린샷      : ${shot}`);
  } finally {
    try {
      await wd(base, 'DELETE', s(''));
    } catch {
      /* session already gone */
    }
    cleanup();
  }

  console.log(`\n[safari] 결과: ${failures.length === 0 ? '✅ A·B 통과' : `❌ ${failures.length}건 실패`}`);
  failures.forEach((f) => console.log(`  - ${f}`));
  process.exit(failures.length === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
