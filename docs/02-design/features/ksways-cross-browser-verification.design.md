# ksways-cross-browser-verification Design Document

> **Summary**: 타깃은 미정의가 아니라 **미문서화**였다 — Next 가 이미 `chrome/edge/firefox 111`·`safari 16.4` 를 빌드에 적용 중이다. 이를 문서화하되 `browserslist` 설정 파일은 넣지 않는다(Tailwind v4 미참조 + Next 기본값과 중복). 검증은 Firefox=Playwright(102MB), Safari=로컬 실기 18.4(비용 0), CI 미포함
>
> **Project**: ksways-web
> **Plan**: `docs/01-plan/features/ksways-cross-browser-verification.plan.md`
> **Author**: jhlim725
> **Date**: 2026-08-07
> **Status**: Draft

---

## 0. 선행 조사 (설계 근거)

Plan 이 "지원 타깃 미정의" 를 선행 과제로 잡았으나, 조사 결과 **실효 타깃은 이미 존재하고 강제되고 있었다.**

### 0.1 Next 가 암묵적 타깃을 적용 중

`next/dist/build/get-supported-browsers.js` 는 `browserslist.loadConfig()` 로 사용자 설정을 찾고, **없으면 `MODERN_BROWSERSLIST_TARGET` 을 반환**한다. 실측:

```
chrome 111 · edge 111 · firefox 111 · safari 16.4
```

즉 타깃은 **미정의(undefined)가 아니라 미문서화(undocumented)** 였다. 빌드 산출물은 이미 이 값에 맞춰 트랜스파일되고 있다.

### 0.2 Tailwind v4 는 browserslist 를 읽지 않는다

`@tailwindcss/postcss` · `tailwindcss` 패키지에서 `browserslist` 참조 **0건**. `lightningcss` 로 자체 타깃을 처리한다. → **`browserslist` 추가가 CSS 산출물에 미치는 영향은 없다.** Plan 이 High 로 본 "빌드 산출물 변경" 리스크는 CSS 쪽에서는 **반증**됐고, JS 트랜스파일 쪽만 남는다.

### 0.3 로컬 환경 실측

| 항목 | 상태 |
|---|---|
| Safari | **18.4 설치됨** (macOS 15.4.1) — 타깃 하한 16.4 초과 |
| Firefox | 미설치 |
| Chrome | 설치됨 |
| Playwright 캐시 | 190MB, **chromium_headless_shell + ffmpeg 만** (firefox·webkit 없음) |
| Playwright firefox 내려받기 | **102 MB** (압축, HEAD 실측) |
| Playwright webkit 내려받기 | **77 MB** (압축, HEAD 실측) |
| `playwright` npm 패키지 | 5.07 MB |

### 0.4 기존 Playwright 스크립트 2개가 고아 상태

`scripts/qa-capture.js` · `scripts/qa-screenshots.js` 가 `require('playwright')` 하지만 **`playwright` 는 의존성에 없어 `MODULE_NOT_FOUND`** 로 실행 불가하다. 출력 경로도 `/opt/data/reports/...` 로 이 저장소가 아닌 Linux 환경 것이다. PR #1·#7 시절 산물.

→ 이 사이클에서 삭제하지 않는다(범위 밖·파괴적). **후속 후보로 등록.**

---

## 1. Design Decisions (전부 확정)

| # | 쟁점 | 결정 | 근거 |
|---|---|---|---|
| D-1 | 지원 타깃 정의 | **Next 의 `MODERN_BROWSERSLIST_TARGET` 을 그대로 채택·문서화** — `chrome/edge/firefox 111`, `safari 16.4` | 이미 빌드에 적용 중인 **실효값**. 트래픽 데이터가 없는 상태(Vercel MCP 403)에서 임의로 정하는 것보다, 강제되고 있는 값을 명문화하는 편이 정확하다 |
| D-2 | `browserslist` 설정 파일 | **넣지 않는다** | 아래 상세 |
| D-3 | 검증 수단 | **하이브리드**: Firefox = Playwright firefox / Safari = **로컬 실기 18.4** | 아래 상세 |
| D-4 | `playwright` 의존성 | **devDependency 로 추가하지 않는다.** (v0.2 정정) `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm install --no-save playwright@<pin>` + `npx playwright install firefox` | `playwright` 패키지는 postinstall 로 브라우저를 내려받는다 → devDep 이면 **CI `npm ci` 마다 수백 MB**. 이 검증은 CI 에서 돌지 않으므로 순손실. **v0.2 정정**: 초안의 `npx playwright@<pin>` 실행안은 성립하지 않는다 — 스크립트가 모듈을 `import` 하므로 프로젝트에서 해석돼야 하는데 npx 사본은 해석되지 않는다. `--no-save` 로 `node_modules` 에만 넣어 `package.json` 을 건드리지 않고, 브라우저는 `SKIP_BROWSER_DOWNLOAD` 로 막은 뒤 firefox 만 별도 설치 |
| D-5 | CI 포함 여부 | **미포함** | 아래 상세 |
| D-6 | 회귀 감지 | Next 기본 타깃 변경을 알아채는 가드 1건 | D-2 로 설정 파일이 없으니, Next 가 기본값을 올리면 문서가 조용히 낡는다. 테스트로 고정 |

### D-2 상세 — 왜 설정 파일을 넣지 않는가

| 도구 | browserslist 참조 | 넣었을 때 영향 |
|---|---|---|
| Tailwind v4 | **없음** (lightningcss 자체 타깃) | CSS 산출물 변화 0 |
| Next.js | **있음** (`get-supported-browsers.js`) | 값이 기본과 같으면 no-op, 다르면 트랜스파일 변경 |

기본값과 **동일한 값**을 적어 넣는 것은 이득이 없고 위험만 남긴다 — Next 가 향후 기본 타깃을 올리면 우리가 박아둔 값이 **뒤처진 채 고정**되어, 의도치 않게 구형 타깃으로 빌드하게 된다.

**다른 값**을 적는 것은 근거가 없다. 트래픽 데이터가 없고(§0.3), 현재 타깃이 문제를 일으킨 사례도 없다.

→ **`DESIGN.md` 에 "지원 타깃은 Next 의 `MODERN_BROWSERSLIST_TARGET` 을 따른다" 로 기록**하고, 실제 값은 D-6 가드가 읽어 고정한다. 설정 파일 없이 타깃이 문서화되고 변경도 감지된다.

### D-3 상세 — 왜 WebKit 을 받지 않는가

| 안 | 비용 | 회귀 보호 | 정확도 |
|---|---|---|---|
| A 1회성 수동 | 0 (Safari) / Firefox 앱 설치 필요 | 없음 | Safari 실기 = 최고 |
| B Playwright 로컬 (firefox+webkit) | **178MB** 내려받기 | 재현 가능 | **WebKit ≠ Safari** |
| **C 하이브리드 (채택)** | **102MB** (firefox 만) | Firefox 재현 가능 | Safari 실기 = 최고 |
| D Playwright CI | 178MB + CI 시간 | 최고 | WebKit ≠ Safari |

- **Safari 는 실기가 낫다.** Playwright WebKit 은 Safari 와 동일 엔진이 아니며, 이 저장소에는 **진짜 Safari 18.4 가 이미 설치**돼 있다. WebKit 77MB 를 받아 열등한 대리 검증을 하는 것은 손해다.
- **Firefox 는 Playwright 가 낫다.** 앱을 설치하지 않아도 되고, 스크립트로 반복 가능하다.
- ⚠️ **한계 기록**: 로컬 Safari 는 18.4 인데 타깃 하한은 **16.4** 다. 18.4 통과가 16.4 를 보장하지 않는다. 하한 검증은 별도 수단(실기기·BrowserStack 등)이 필요하며 이 사이클 범위 밖으로 둔다.

### D-5 상세 — 왜 CI 에 넣지 않는가

검증 대상은 **브라우저 엔진의 CSS 동작**이다. 이것은 **우리 커밋이 아니라 브라우저 업데이트로 바뀐다.** 매 커밋마다 3개 엔진을 돌리는 것은 변하지 않는 것을 반복 확인하는 낭비다.

우리 커밋이 만들 수 있는 회귀(선언 자체가 사라지는 것)는 **이미 정적 가드 14건이 잡고 있다**(`focus-visible.test.ts`). 엔진 동작 검증은 그 위층이며, 주기적·수동으로 충분하다.

---

## 2. Implementation Spec

### 2.1 `scripts/verify-css-engines.mjs` (신규)

Playwright Firefox 로 두 메커니즘을 검증한다. 기존 고아 스크립트(§0.4)와 달리 **경로를 하드코딩하지 않고** 인자/환경변수로 받는다.

| 검증 | 방법 | 판정 |
|---|---|---|
| **A. `visibility` 키프레임 보간** (FR-03) | 프로덕션 키프레임을 재현한 프로브 페이지에서 `animation-play-state: paused` + 음수 `animation-delay` 로 진행률 고정 → 각 지점의 computed `visibility` 읽기 | 페이드 구간 `visible`, opacity 0 구간 `hidden` |
| **B. Tab 순서 제외** (FR-03) | 프로브 페이지에서 실제 `Tab` 키 순회 → 도달한 링크 id 수집 | `hidden` 컨테이너의 링크가 부재 |
| **C. `outline` + `border-radius`** (FR-02) | 라운드 요소에 포커스 → 스크린샷 저장 | **사람 판단** (모서리가 둥근가) |

A·B 는 자동 판정 가능하고, C 는 시각 판단이라 스크린샷만 남긴다. 스크립트는 A·B 결과를 exit code 로 반환한다.

프로브 페이지는 `ksways-hero-attribution-a11y` §0 의 기법을 그대로 이식한다 — 엔진 무관하게 유효함이 확인된 방법이다.

### 2.2 Safari 검증 절차 (수동, 문서화)

자동화하지 않는다. 절차를 `docs` 에 남겨 다음 사람이 재설계하지 않게 한다.

1. `npm run dev`
2. Safari 로 `http://localhost:3000/quote` → `Tab` 으로 입력 필드 순회 → 포커스 링이 **둥근 모서리를 따르는지** 육안 확인
3. `http://localhost:3000/` → `Tab` 순회 → 히어로 출처 링크가 **보이는 것만** 도달하는지 확인
4. 결과를 analysis 에 기록

> Safari 는 기본적으로 `Tab` 이 링크를 건너뛴다. **설정 → 고급 → "Tab 키를 눌러 웹페이지의 각 항목 강조 표시"** 를 켜야 한다. 이 항목 자체가 검증 전제다.

### 2.3 `DESIGN.md` — 지원 타깃 절 신설

`## Focus` 뒤에 `## Browser Support` 추가:

> 지원 타깃은 Next.js 의 `MODERN_BROWSERSLIST_TARGET` 을 따른다 — 현재 `chrome 111` · `edge 111` · `firefox 111` · `safari 16.4`. `browserslist` 설정 파일은 의도적으로 두지 않는다: Tailwind v4 는 이를 읽지 않고(lightningcss 자체 타깃), Next 는 읽지만 기본값을 복제해 두면 Next 가 기본을 올릴 때 우리 값만 뒤처진다. 실제 값은 `src/browser-target.test.ts` 가 고정한다.

### 2.4 `src/browser-target.test.ts` (신규, 가드 1건)

`next/dist/shared/lib/constants` 의 `MODERN_BROWSERSLIST_TARGET` 을 읽어 문서에 적힌 값과 대조한다. Next 업그레이드로 기본 타깃이 바뀌면 실패 → 문서 갱신을 강제한다.

**결함 주입 계획**: 기대값 배열을 임시로 바꿔 실패 확인 → 원복.

### 2.5 변경 파일 목록

| 파일 | 변경 |
|---|---|
| `scripts/verify-css-engines.mjs` | 신규 (Playwright Firefox 검증) |
| `src/browser-target.test.ts` | 신규 (가드 1건) |
| `DESIGN.md` | `## Browser Support` 신설 |
| `docs` (analysis) | Safari 수동 검증 결과 기록 |

`package.json` **무변경** (D-4). `.gitignore` 에 `tmp/` 추가 (v0.2 — 스크립트 산출물 경로).

---

## 3. Implementation Order (Do)

1. `src/browser-target.test.ts` + `DESIGN.md` — 타깃 문서화·고정 (엔진 검증과 독립, 먼저 확정)
2. 가드 결함 주입 → 실패 확인 → 원복
3. `scripts/verify-css-engines.mjs` 작성
4. (v0.2) `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm install --no-save playwright@1.62.1` → `npx playwright install firefox` (102MB) → 스크립트 실행 → A·B 판정
5. C 스크린샷 확보 → 육안 판단
6. Safari 수동 검증 (§2.2)
7. 4게이트 + 결과 기록

---

## 4. Verification & Exit Criteria

| 항목 | 기준 | 수단 |
|---|---|---|
| FR-01 타깃 정의 | `DESIGN.md` 에 명시 + 가드가 값 고정 | 문서 + 테스트 |
| FR-02 `outline`+`border-radius` | Firefox·Safari 에서 모서리 추종 | 스크린샷 육안 |
| FR-03 `visibility` 보간·Tab 제외 | Firefox 자동 판정 + Safari 수동 | 스크립트 + 실기 |
| FR-04 수단 결정·절차 기록 | 재현 절차가 문서에 있음 | 리뷰 |
| 회귀 | 99 → 100 tests, 4게이트 GREEN | 로컬 + CI |

### 알려진 한계 (숨기지 말 것)

- **Safari 하한 미검증**: 로컬은 18.4, 타깃 하한은 16.4. 하한 검증 수단 없음
- **Playwright Firefox ≠ 배포 Firefox**: 빌드가 다를 수 있음. Chromium 대비 정확도는 높지만 실기는 아님
- **문제 발견 시 이 사이클에서 고치지 않는다** (Plan §2.2) — 별도 사이클로 이관

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-08-07 | Initial draft — 선행 조사로 타깃이 미문서화였음을 확인(Next 실효값), Tailwind v4 무관 반증, 비용 실측(firefox 102MB·webkit 77MB) 후 WebKit 제외 하이브리드 채택 | jhlim725 |
| 0.2 | 2026-08-07 | **정정** — D-4 실행 방식. `npx playwright` 로는 스크립트의 `import('playwright')` 가 해석되지 않아 `--no-save` + `SKIP_BROWSER_DOWNLOAD` 조합으로 교체. `.gitignore` `tmp/` 추가 | jhlim725 |
