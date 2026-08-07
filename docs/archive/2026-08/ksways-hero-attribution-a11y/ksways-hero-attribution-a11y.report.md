# ksways-hero-attribution-a11y Completion Report

> **Project**: ksways-web
> **Match Rate**: **84%** (Gap 4건 전부 Do 단계에서 해소, Design v0.2 정정 완료)
> **PR**: #22 `f1a6d18` — **OPEN·미머지**, CI quality·build·Vercel 전부 pass
> **Date**: 2026-08-07
> **Author**: jhlim725

---

## ⚠️ 90% 미만 보고에 대하여

bkit 규칙은 Match < 90% 에서 `/pdca iterate` 를 요구한다. 이 사이클은 예외로 처리하며 근거를 남긴다.

- **84% 는 Design 초안 품질의 기록이지 미해결 부채가 아니다.** Gap 4건은 전부 Check 이전(Do 단계)에 발견·수정·검증됐다.
- Design 문서는 v0.2 로 정정돼 아카이브 정합성이 맞다.
- 최종 구현은 FR 5건을 전부 충족하며 실브라우저로 확인됐다.
- **`/pdca iterate` 가 고칠 대상이 존재하지 않는다.**

---

## 1. 사이클 개요

히어로 Unsplash 출처 링크 6개 중 **4개가 `opacity: 0` 인 채 Tab 순서에 남아** 있었다. `opacity` 는 요소를 Tab 에서 빼지 않으므로 키보드 사용자가 완전히 보이지 않는 링크로 포커스를 옮기게 된다 — **WCAG 2.4.7 Focus Visible (Level A)**. 포커스 링도 `opacity` 를 상속받아 함께 사라졌다.

발단은 `ksways-focus-ring-contrast`(#21) 의 실브라우저 스팟체크였다. 포커스 링 자체는 정상인데 어두운 히어로에서 보이지 않아 조사한 결과 조상의 `opacity` 감쇠가 원인이었다.

| | 수정 전 | 수정 후 |
|---|---|---|
| Tab 도달 가능한 출처 링크 | 6 / 6 (4개는 비가시) | **2 / 6** (보이는 것만) |
| 포커스 링 불투명도 | 0.855 / 0.694 (감쇠) | **0.996 / 0.992** |
| reduced-motion | 4개 **영구** 비가시·포커스 가능 | 비가시 4개 Tab 제외 |

---

## 2. 산출물

| 파일 | 변경 |
|---|---|
| `src/app/globals.css` | `opacity` 를 선언하는 **3곳 전부**에 `visibility` 동반 — 키프레임 3구간 · reduced-motion 4선언 · 기본 규칙 4선언 |
| `src/focus-visible.test.ts` | 가드 5건 추가 (99 tests) |
| `DESIGN.md` | `## Focus` 에 "`opacity` 단독 숨김 금지" 항목 |
| PDCA 4종 | plan / design(v0.2) / analysis / report |

`HomePage.tsx` **무변경** → Unsplash 출처·referral(`utm_source=ksways&utm_medium=referral`) 요건 자동 유지 (FR-04).

### 설계 근거 — 선행 실험

Plan 은 `visibility` 안의 "페이드 구간 브라우저 해석" 을 Likelihood **High** 리스크로 봤다. Design 착수 전 `animation-play-state: paused` + 음수 `animation-delay` 로 **진행률을 고정**해 측정했다(Chromium).

| 고정 지점 | opacity | `visibility` |
|---|---|---|
| 30% 페이드 중 | 0.779 | **`visible`** |
| 32% 페이드 중 | 0.198 | **`visible`** |
| 47.6% 비가시 | 0 | **`hidden`** |
| 대조군(`visibility` 없음) | 0 | `visible` ❌ |

`visibility` 는 페이드 내내 `visible` 을 유지하고 opacity 가 진짜 0 일 때만 `hidden` 이 된다. **리스크 반증** — CSS 단독·JS 없이 해결 가능함이 확정됐다.

---

## 3. 이 사이클의 핵심 — Design 이 놓친 곳을 실브라우저가 잡았다

Design v0.1 은 `opacity` 선언 위치를 **키프레임과 reduced-motion 두 곳**으로 봤다. 실제로는 **세 곳**이었다.

```css
.ks-hero-bg-attribution {
  opacity: 0;                                          /* ← 다루지 않음 */
  animation-delay: calc(var(--ks-slide-index) * 7s);   /* ← 양수 */
}
```

`animation-delay` 가 양수(0s·7s·14s)이고 `animation-fill-mode` 가 없어서, **딜레이 구간에는 키프레임이 아니라 기본 규칙이 적용된다.** 두 곳만 고친 상태에서 **로드 후 14초간 FR-01 이 그대로 미충족**이었다.

그리고 그 상태에서 **정적 가드 13건은 전부 GREEN 이었다.** 가드가 "설계가 다룬 범위" 를 검사 범위로 삼았기 때문이다.

**Tab 순회를 돌리지 않았으면 이대로 머지됐다.**

수정: 기본 규칙 4선언에 `visibility` 추가 + 가드에 `.ks-hero-bg-*` 선택자 전수 스캔 1건 추가.

---

## 4. 검증 증거

| 항목 | 결과 |
|---|---|
| lint / tsc | 0 / 0 |
| test | **99 passed** (94 → 99) |
| CI build (ubuntu) / Vercel | pass / pass |

### 결함 주입 3종

| 주입 | 실패한 테스트 |
|---|---|
| 키프레임에서 `visibility` 제거 (3줄) | 키프레임 2건 |
| reduced-motion 에서 제거 (4줄) | reduced-motion 2건 |
| 기본 규칙에서 제거 (4줄) | base rules 1건 |

### 실브라우저 실측 (수정 후)

```
컨테이너: [{i:0, opacity:1, visibility:"visible"},
           {i:1, opacity:0, visibility:"hidden"},
           {i:2, opacity:0, visibility:"hidden"}]

Tab 30회 순회 → 도달한 출처 링크: attr#0 의 2개뿐 (총 6개 중)
포커스 링: rgba(231,201,154, 0.996) / rgba(0,17,18, 0.992)
```

**reduced-motion**: `Emulation.setEmulatedMedia` 가 browse CDP 허용목록에서 차단(deny-default)돼 자동 에뮬레이션 불가. 미디어 블록과 동일한 선언을 주입해 확인 → `attr#0` 만 도달. 미디어 쿼리 매칭 자체는 정적 가드가 검사한다.

FR-01 ~ FR-05 전부 충족 (상세는 analysis §4).

---

## 5. 학습

1. **범위는 "무엇을 고치나" 가 아니라 "그 속성이 선언된 모든 곳" 으로 잡아야 한다.** `animation-delay` 가 양수이고 `animation-fill-mode` 가 없으면, 딜레이 구간의 실효 스타일은 키프레임이 아니라 기본 규칙이다. "애니메이션을 고친다" 는 프레이밍이 세 번째 선언 위치를 시야에서 지웠다.

2. **정적 가드의 검사 범위를 설계 범위와 같게 잡으면, 설계가 놓친 것은 가드도 놓친다.** 가드는 "설계가 다룬 곳" 이 아니라 **"그 속성이 나타날 수 있는 곳 전체"** 를 훑어야 한다. 수정본은 `.ks-hero-bg-*` 를 전수 스캔한다.

3. **실브라우저 검증은 정적 검증의 대체재가 아니라 상위 검증이다.** 직전 사이클에서 "정적 단언이 타당한 대리" 라고 판단했고 그 판단 자체는 옳았지만, **대리의 범위가 좁으면 대리도 좁다.**

4. **결함 주입은 "주입이 실제로 일어났는지" 부터 확인해야 한다.** 1차 시도가 perl 이스케이프 오류로 무주입 상태에서 통과했다. 제거된 줄 수를 단언하는 식으로 주입 자체를 검증할 것.

5. **Gap 이 구현이 아니라 설계에 있을 수 있다.** "Design → 구현 충실도" 만 재면 100% 로 보인다. 요구사항 기준으로 재야 84% 가 드러난다.

---

## 6. 잔여 · 후속 후보

### 이 사이클 잔여
- **Chromium 만 확인** — `visibility` 키프레임 보간은 표준 동작이나 Firefox/Safari 실측 미수행
- reduced-motion 자동 검증 불가 (browse CDP 차단 + Playwright 부재) — 선언 주입으로 대체

### 후속 후보
| # | 항목 | 성격 | 우선도 |
|---|---|---|---|
| 1 | `ksways-mobile-attribution` — 640px 미만 출처 표기 부재(`hidden sm:block`) | **라이선스** (a11y 결함 아님) | 사용자 판단 필요 |
| 2 | Firefox / Safari 크로스브라우저 검증 — 직전 사이클과 **2회 누적** | 검증 부채 | Medium |
| 3 | amber ↔ 브론즈 색상군 근접 | 디자인 | Medium |
| 4 | 로고 구현 4벌 중복 | 정리 | Low |
| 5 | `body { color: var(--ks-ink) }` near-white on near-white 잠복 버그 | 잠복 | Low |

---

## 7. 상태

- **PR #22 미머지.** CI 전부 GREEN·MERGEABLE
- `.bkit-memory.json`: `phase: "completed"`, `matchRate: 84`
- Archive 는 머지 후 `/pdca archive ksways-hero-attribution-a11y`

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-08-07 | 완료 보고 — Match 84%(Design 초안 결함 반영), Gap 4건 전건 해소, 학습 5건 | jhlim725 |
