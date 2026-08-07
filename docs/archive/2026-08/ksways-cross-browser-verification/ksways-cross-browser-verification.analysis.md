# ksways-cross-browser-verification Gap Analysis (Check)

> **Project**: ksways-web
> **Design**: `docs/02-design/features/ksways-cross-browser-verification.design.md` (v0.2)
> **PR**: #23 (`1db8e19`) — CI quality·build·Vercel 전부 pass
> **Date**: 2026-08-07

---

## 1. 종합 판정

**Match Rate: 75%** — 산출물은 전부 만들어졌으나 **핵심 요구사항의 절반(Safari)이 외부 차단으로 미충족**이다.

| 관점 | 값 |
|---|---|
| Design 항목 → 구현 | 91% (16항목 중 충족13 + 부분3) |
| **요구사항(FR) → 충족** | **75%** ← 헤드라인 |

FR 은 "타깃 엔진에서 확인" 을 요구한다. Firefox 는 확인됐고 Safari 는 확인되지 않았으므로, 항목 수가 아니라 **요구사항 기준**을 헤드라인으로 삼는다.

### FR 대조

| FR | 기준 | Firefox | Safari | 판정 |
|---|---|---|---|---|
| FR-01 타깃 정의·기록 | 문서 + 가드 | — | — | ✅ |
| FR-02 `outline`+`border-radius` | 타깃 엔진 확인 | ✅ | ❌ | **◐ 0.5** |
| FR-03 `visibility` 보간·Tab 제외 | 타깃 엔진 확인 | ✅ | ❌ | **◐ 0.5** |
| FR-04 수단 결정·절차 기록 | 재현 절차 존재 | — | — | ✅ |

`3 / 4 = 75%`

---

## 2. Gap

### G-1 (**외부 차단**) — Safari 검증 미실행

`safaridriver` 는 존재한다(Safari 18.4 동봉). 그러나 자동 구동에 **사용자 측 토글 2개**가 필요하고, 둘 다 꺼져 있다.

| 항목 | 현재 | 확인 방법 |
|---|---|---|
| 원격 자동화 허용 | **미설정** | `defaults read com.apple.Safari AllowRemoteAutomation` → 없음 |
| Tab 하이라이트 | **꺼짐** | `WebKitTabToLinksPreferenceKey` → 없음 |

두 번째가 특히 중요하다 — 꺼져 있으면 **Safari 의 Tab 이 링크를 건너뛰므로 FR-03 검증 자체가 무효**가 된다.

둘 다 사용자의 애플리케이션 설정이므로 임의로 변경하지 않았다. `safaridriver --enable` 은 관리자 인증도 요구한다.

**성격**: 구현 결함이 아니라 **환경 권한 차단**이다. 코드로 해소할 수 없다.

### G-2 (파생) — Design §3 6단계 미실행

구현 순서 7단계 중 6단계(Safari 수동)가 G-1 으로 실행되지 않았다.

### G-3 (사소) — Chromium 대조 스킵

Playwright 캐시의 `chromium_headless_shell` 이 1208 인데 playwright 1.62.1 은 1234 를 요구해 실행 실패. 추가 ~190MB 가 필요하다.

**영향 없음**: Chromium 근거는 `ksways-focus-ring-contrast`(#21)·`ksways-hero-attribution-a11y`(#22) 에서 `/browse` 로 이미 확보돼 있다. 대조군 목적이었을 뿐이다.

---

## 3. Design 대비 확장·정정

| 항목 | 내용 |
|---|---|
| **D-4 정정 (v0.2)** | 초안의 `npx playwright@<pin>` 실행안이 성립하지 않았다 — 스크립트가 모듈을 `import` 하므로 프로젝트에서 해석돼야 하는데 npx 사본은 해석되지 않는다. `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm install --no-save` + `npx playwright install firefox` 로 교체 |
| **`.gitignore` `tmp/` 추가** | 초안 파일 목록에 없었다. 스크립트 산출물(프로브 HTML·스크린샷)이 추적되지 않도록 |
| **프로브가 실제 CSS 를 인라인** | 초안은 "프로덕션 키프레임을 재현" 이라고만 했다. 재현=복사는 드리프트하므로, `src/app/globals.css` 를 읽어 `@import` 만 제거하고 인라인하도록 구현 |
| **프로브 지점 5개** | 초안은 지점 수를 명시하지 않았다. 모든 키프레임 구간을 걸치도록 0%·30%·32%·47.6%·95% 선정 (95% 는 페이드-인 구간 — 이전 사이클에서 검증하지 않았던 방향) |

---

## 4. 검증 증거

### 정적

| 게이트 | 결과 |
|---|---|
| lint / tsc | 0 / 0 |
| test | **102 passed** (99 → 102) |
| CI build / Vercel | pass / pass |
| `package.json` · `package-lock.json` | **무변경** (D-4 준수 확인) |

### 타깃 가드 결함 주입 3종

| 주입 | 실패한 테스트 |
|---|---|
| 기대 타깃 `safari 16.4` → `17.0` (Next 가 기본을 올린 상황 모사) | 2건 |
| `DESIGN.md` 에서 `safari 16.4` 표기 제거 | 1건 |
| `package.json` 에 `browserslist: ["defaults"]` 주입 | 1건 |

각각 원복 확인.

### Firefox 153 (Playwright)

```
A. @keyframes visibility 보간
  ✅ 0%    — 완전 가시      opacity=1      visibility=visible
  ✅ 30%   — 페이드 중      opacity=0.779  visibility=visible
  ✅ 32%   — 페이드 중      opacity=0.198  visibility=visible
  ✅ 47.6% — 완전 비가시    opacity=0      visibility=hidden
  ✅ 95%   — 페이드 인      opacity=0.221  visibility=visible

B. Tab 순서
  ✅ 가시 4지점 도달 / 비가시 1지점 미도달

C. outline + border-radius
  border-radius 16px, outline rgb(231,201,154) 3px offset 2px
  → 스크린샷에서 라운드 정확히 추종 확인
```

exit code 계약 확인: Firefox 통과 시 `0`, 브라우저 미설치 시 `1`.

---

## 5. Match 75% 에 대한 처리 — iterate 가 아니라 차단 해소

bkit 규칙상 90% 미만은 `/pdca iterate` 대상이나, **G-1 은 코드로 고칠 수 있는 대상이 아니다.** 사용자 환경의 설정 토글 2개가 차단 요인이다.

이 저장소의 기존 원칙(외부 차단만 남으면 iterate 를 건너뛰고 분리 이관)에 따라 두 경로를 제시한다.

**경로 A — 이 사이클에서 마무리** (권장)
1. Safari → 고급 → "Tab 키를 눌러 웹페이지의 각 항목 강조 표시" 켜기 *(필수 — 없으면 검증 무효)*
2. Safari → 개발자용 → 원격 자동화 허용 *(자동 구동을 원할 때만)*
3. 수동이면 `npm run dev` 후 `/quote`·`/` 에서 Tab 순회 (절차: Design §2.2)
4. 결과 회신 → 이 문서 갱신 → Match 재산출 → report

**경로 B — 분리 이관**
`ksways-safari-verification` 으로 넘기고 이번 사이클은 **Firefox 검증 + 타깃 문서화 완료**로 종결. 이 경우 75% 가 최종치가 된다.

### 결정: 경로 B (2026-08-07)

경로 A 를 먼저 시도했고 실패했다. 시도 기록:

| 시도 | 결과 |
|---|---|
| `safaridriver` 기동 | ✅ `/status` → `ready: true` |
| 세션 생성 | ❌ `You must enable 'Allow remote automation'…` |
| `safaridriver --enable` (Claude Code 셸) | ❌ 암호 거부 — 세션이 `not a tty` 라 Authorization 입력이 정상 동작하지 않음 |
| `safaridriver --enable` (Terminal.app, TTY 있음) | ❌ 2분 폴링 후에도 설정 미반영 |
| 세션 재생성 ×2 | ❌ 동일 오류 |

**중간에 드러난 사실**: `safaridriver --enable` 과 Safari 의 "원격 자동화 허용" 은 **별개 설정**이다. 전자는 *인증*(이후 세션이 추가 인증 없이 실행)을, 후자는 *권한*(자동화 자체의 허가)을 다룬다. 오류 메시지가 일관되게 후자를 지목했다. 초기에 `--enable` 을 단독 해결책으로 제시한 것은 오판이었다.

또 `IncludeDevelopMenu` 가 `0` → 미설정으로 바뀌어 있어, GUI 경로도 "고급 → 웹 개발자용 기능 보기" 선행이 필요한 상태다.

**전환 근거**: 코드로 해소 불가능한 환경 권한 문제에 여러 라운드가 소요됐다. 도구는 완비돼 있어 토글이 켜지는 순간 재개 비용이 ~1분이다. 사이클을 열어둔 채 대기하는 것보다, 완료분을 확정하고 실행만 분리하는 편이 정확하다.

---

## 6. 잔여 · 후속 후보

| # | 항목 | 성격 |
|---|---|---|
| 1 | **Safari 검증** (G-1) | 외부 차단 — 경로 A/B 선택 필요 |
| 2 | **하한 미검증** — Firefox 153/Safari 18.4 로 확인하나 타깃 하한은 firefox 111·safari 16.4 | 수단 부재(실기기·BrowserStack 필요) |
| 3 | 고아 스크립트 2개 (`qa-capture.js`·`qa-screenshots.js`) — `MODULE_NOT_FOUND` + `/opt/data` 경로 | 정리 |
| 4 | `ksways-mobile-attribution` | 라이선스 |
| 5 | amber ↔ 브론즈 근접 · 로고 4벌 중복 · `--ks-ink` 잠복 버그 | 이전 사이클 이월 |

---

## 7. 결론

**Match 75%.** 산출물(타깃 문서화·가드 3건·검증 스크립트)은 전부 완성됐고 Firefox 는 A·B·C 전부 통과했다. 미충족분은 **Safari 검증 1건이며 외부 차단**이다.

`/pdca iterate` 는 해당 없음 — 고칠 코드가 없다. **경로 B 로 결정**: Safari 실행은 `ksways-safari-verification` 으로 이관하고 75% 를 최종치로 확정한다.
