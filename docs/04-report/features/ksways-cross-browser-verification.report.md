# ksways-cross-browser-verification Completion Report

> **Project**: ksways-web
> **Match Rate**: **75%** (경로 B 확정 — Safari 실행만 분리 이관)
> **PR**: #23 `926ea3c` — **OPEN·미머지**, CI quality·build·Vercel 전부 pass
> **Date**: 2026-08-07
> **Author**: jhlim725

---

## ⚠️ 90% 미만 보고에 대하여

미충족분은 **Safari 검증 실행 1건**이며 원인은 **사용자 환경의 권한 토글**이다. 코드로 해소할 수 없어 `/pdca iterate` 의 대상이 아니다.

경로 A(이번 사이클에서 마무리)를 먼저 시도했고 실패해, 경로 B(분리 이관)로 전환했다. 상세 시도 기록은 analysis §5.

---

## 1. 사이클 개요

a11y 두 사이클(#21·#22)이 키보드 접근성의 핵심 CSS 를 **Chromium 에서만** 확인하고 잔여로 남긴 것이 누적돼 있었다. 검증에 착수하자 **Plan 의 전제가 틀렸다**는 것이 먼저 드러났다.

| Plan 의 전제 | 실제 |
|---|---|
| "지원 브라우저 타깃이 미정의" | **미문서화**였다. Next 가 이미 강제 중 |
| "`browserslist` 추가가 빌드 산출물을 바꿀 수 있다"(Likelihood High) | Tailwind v4 는 읽지 않음 → **CSS 영향 0**. JS 쪽만 해당 |

---

## 2. 산출물

| 파일 | 내용 |
|---|---|
| `src/browser-target.test.ts` | 타깃 고정 가드 3건 |
| `DESIGN.md` | `## Browser Support` 신설 |
| `scripts/lib/css-engine-probe.mjs` | 공유 프로브 — 실제 `globals.css` 인라인 |
| `scripts/verify-css-engines.mjs` | Playwright Firefox 러너 |
| `scripts/verify-safari.mjs` | safaridriver/WebDriver 러너 — **npm 의존성 0** |
| `.gitignore` | `tmp/` |
| PDCA 4종 | plan / design(v0.3) / analysis / report |

`package.json` · `package-lock.json` **무변경**.

### 핵심 결정 3건

**D-1 타깃** — Next 의 `MODERN_BROWSERSLIST_TARGET`(`chrome/edge/firefox 111`, `safari 16.4`)을 실효값 그대로 채택·문서화. 트래픽 데이터가 없는 상태(Vercel Analytics MCP 403)에서 임의로 정하는 것보다 정확하다.

**D-2 `browserslist` 설정 파일 미도입** — Tailwind v4 는 참조 0건(lightningcss 자체 타깃), Next 는 읽지만 기본값 복제는 **Next 가 기본을 올릴 때 우리 값만 뒤처지는** 위험만 남긴다. 대신 가드가 실제 값을 고정해 변경 시 문서 갱신을 강제한다.

**D-3 WebKit 미도입** — 실측 firefox 102MB / webkit 77MB. Playwright WebKit 은 Safari 가 아니고 진짜 Safari 18.4 가 로컬에 있으므로, 열등한 대리 검증에 77MB 를 쓰지 않는다. CI 미포함(엔진 동작은 우리 커밋이 아니라 브라우저 업데이트로 바뀐다), `playwright` devDep 미추가(postinstall 이 CI `npm ci` 마다 수백 MB).

---

## 3. 검증 결과

### Firefox 153 — 전부 통과

```
A. @keyframes visibility 보간
  ✅ 0%    완전 가시    opacity=1      visibility=visible
  ✅ 30%   페이드 중    opacity=0.779  visibility=visible
  ✅ 32%   페이드 중    opacity=0.198  visibility=visible
  ✅ 47.6% 완전 비가시  opacity=0      visibility=hidden
  ✅ 95%   페이드 인    opacity=0.221  visibility=visible

B. Tab 순서   가시 4지점 도달 / 비가시 1지점 미도달
C. outline    16px 라운드 정확히 추종 (스크린샷)
```

### 정적

| 게이트 | 결과 |
|---|---|
| lint / tsc | 0 / 0 |
| test | **102 passed** (99 → 102) |
| CI build / Vercel | pass / pass |
| 타깃 가드 결함 주입 | 3종 재현 확인 |

### Safari — 미실행 (외부 차단)

`safaridriver` 기동은 되나(`ready: true`) 세션 생성이 거부된다. Safari 의 "원격 자동화 허용" 이 필요하고 이는 GUI 토글이다.

---

## 4. 학습

1. **"미정의" 로 보이는 것이 사실은 "미문서화" 일 수 있다.** 타깃을 새로 정하려다 조사해보니 Next 가 이미 강제하고 있었다. 새 값을 발명하는 대신 **실효값을 명문화**하는 것이 정확했다. 설정이 없다고 기본값이 없는 것은 아니다.

2. **설정 파일을 추가하지 않는 것도 결정이다.** `browserslist` 를 넣는 쪽이 "제대로 하는 것" 처럼 보이지만, 상위 도구의 기본값을 복제하면 그 도구가 기본을 올릴 때 **조용히 뒤처진다.** 값을 고정하는 대신 **값을 감시**하는 편이 나았다.

3. **비용은 재고 나서 결정한다.** WebKit 77MB 를 받지 않기로 한 근거는 "WebKit ≠ Safari + 진짜 Safari 가 로컬에 있음" 이라는 사실이었다. HEAD 요청으로 크기를 실측한 덕에 트레이드오프가 구체적이 됐다.

4. **검증이 사용자 설정에 좌우되면 안 된다.** Safari 의 Tab 하이라이트 설정이 `<a>` 만 좌우하고 폼 컨트롤은 무관하다는 점을 이용해, 프로브에 `<input>` 을 넣어 **설정 의존성을 제거**했다. 엔진 질문은 사용자 환경과 분리돼야 한다.

5. **인증과 권한은 다르다.** `safaridriver --enable`(인증)과 Safari 의 "원격 자동화 허용"(권한)을 하나로 착각해 사용자에게 불완전한 해결책을 안내했다. 오류 메시지가 일관되게 후자를 지목하고 있었는데도 읽지 못했다.

6. **`not a tty` 환경에서 Authorization 암호 입력은 실패한다.** 대화형 인증이 필요한 명령은 실제 터미널에서 실행해야 한다.

---

## 5. 잔여 · 후속 후보

| # | 항목 | 성격 | 재개 비용 |
|---|---|---|---|
| 1 | **`ksways-safari-verification`** — 도구 완비, 토글만 필요 | 외부 차단 | **~1분** |
| 2 | **하한 미검증** — Firefox 153/Safari 18.4 로 확인하나 타깃 하한은 firefox 111·safari 16.4 | 수단 부재 | 실기기·BrowserStack 필요 |
| 3 | 고아 스크립트 2개 (`qa-capture.js`·`qa-screenshots.js`) — `MODULE_NOT_FOUND` + `/opt/data` 경로 | 정리 | 소 |
| 4 | `ksways-mobile-attribution` — 640px 미만 출처 표기 부재 | **라이선스** | 사용자 판단 |
| 5 | amber ↔ 브론즈 근접 · 로고 4벌 중복 · `--ks-ink` 잠복 버그 | 이월 | 소 |

---

## 6. 상태

- **PR #23 미머지.** CI 전부 GREEN
- `.bkit-memory.json`: `phase: "completed"`, `matchRate: 75`
- Archive 는 머지 후 `/pdca archive ksways-cross-browser-verification`

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-08-07 | 완료 보고 — Match 75%(경로 B), Firefox 검증 완료·Safari 이관, 학습 6건 | jhlim725 |
