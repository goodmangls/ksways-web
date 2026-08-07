# ksways-hero-attribution-a11y Design Document

> **Summary**: `visibility` 를 키프레임과 reduced-motion 블록에 추가해 비가시 출처 링크를 Tab 순서에서 제외. 실브라우저 실험으로 페이드 구간 안전성과 Tab 제외를 모두 확인함. 모바일 표기 부재는 성격이 다른 문제라 분리
>
> **Project**: ksways-web
> **Plan**: `docs/01-plan/features/ksways-hero-attribution-a11y.plan.md`
> **Author**: jhlim725
> **Date**: 2026-08-07
> **Status**: Draft

---

## 0. 선행 실험 (설계 근거)

Plan §5 가 후보 1(`visibility` 키프레임)의 **페이드 구간 브라우저 해석**을 Impact Medium / Likelihood **High** 리스크로 지목했다. 설계 전에 실브라우저로 해소했다.

프로덕션 키프레임을 그대로 재현하고 `animation-play-state: paused` + 음수 `animation-delay` 로 **진행률을 결정적으로 고정**해 측정했다(Chromium).

| 고정 지점 | opacity | `visibility` | 판정 |
|---|---|---|---|
| 0% (완전 가시) | 1 | `visible` | ✅ |
| 30% (페이드 중) | 0.779 | **`visible`** | ✅ 페이드 중 사라지지 않음 |
| 32% (페이드 중) | 0.198 | **`visible`** | ✅ |
| 47.6% (완전 비가시) | 0 | **`hidden`** | ✅ 목표 동작 |
| 대조군: 47.6%, `visibility` 없음 | 0 | `visible` | ❌ **현재 결함 재현** |

이어서 실제 Tab 순회로 순서를 기록했다:

```
la0, la0b, la1, la1b, la2, la2b, lb0, lb3, sentinel, BODY, (순환)
        ↑ A3 의 링크 2개(la3, la3b)가 완전히 부재 — visibility:hidden 이 Tab 에서 제외
                                    ↑ 대조군 lb3 는 opacity 0 인데도 여전히 포커스됨
```

**결론**: `visibility` 는 opacity 가 진짜 0 일 때만 `hidden` 이 되고 페이드 내내 `visible` 을 유지한다. Plan 이 High 로 본 리스크는 **반증됐다**. 후보 1이 JS 없이 요구사항을 정확히 충족한다.

---

## 1. Design Decisions (전부 확정)

| # | 쟁점 | 결정 | 근거 |
|---|---|---|---|
| D-1 | 후보 4종 중 선택 | **① `visibility` 키프레임** | §0 실험으로 검증됨. CSS 단독·JS 없음·마크업 무변경·시각 무변경·Unsplash 요건 무영향. 나머지 3종은 더 큰 변경을 요구하는데 얻는 게 없다 |
| D-2 | reduced-motion 경로 | 동일 원리로 `visibility` 를 override 에 추가 | 이쪽은 정적 선언이라 키프레임 보간 문제가 없다. **영구 비가시 4개**가 사라짐 |
| D-3 | 키프레임 공유 vs 분리 | **공유 유지** (`ks-hero-bg-cycle` 하나) | 슬라이드는 `<img>` 라 포커스 대상이 아니어서 `visibility` 가 붙어도 무해하고, 페이드 중 `visible` 이 보장되므로 크로스페이드도 무영향. 분리하면 키프레임이 둘로 늘어 드리프트 여지만 생긴다 |
| D-4 | 모바일 표기 부재(Plan ③) | **이 사이클에서 제외** → 별도 후보 | 아래 상세 |
| D-5 | 가드 수단 | **정적 CSS 단언** + 실험 근거 문서화 + 재현 절차 기록 | 아래 상세 |
| D-6 | 시각 변경 | **없음** | 보이던 것은 그대로 보이고, 안 보이던 것이 Tab 에서만 빠진다 |

### D-4 상세 — 모바일 표기를 왜 분리하는가

컨테이너가 `hidden ... sm:block` 이라 **640px 미만에서 출처 표기가 통째로 `display: none`** 이다.

- **접근성 결함이 아니다**: `display: none` 은 Tab 순서에서도 제외되므로 이 사이클의 FR 어느 것도 위반하지 않는다.
- **성격이 다르다**: 이건 *라이선스 준수* 질문이다. Unsplash 사진을 표시하면서 출처를 전혀 노출하지 않는 상태가 모바일에서 발생한다.
- **설계 판단이 필요하다**: 모바일 히어로에 크레딧을 어디에 어떻게 넣을지는 시각 설계 결정이며, a11y 수정에 끼워 넣으면 두 판단이 모두 흐려진다.

→ **`ksways-mobile-attribution` 으로 등록.** 다만 이는 엔지니어링 취향이 아니라 **라이선스 사안**이므로, 우선순위는 사용자 판단을 받을 것.

### D-5 상세 — 왜 다시 정적 가드인가

직전 사이클의 학습은 "CSS 값 가드는 런타임 상속 결함을 못 잡는다" 였다. 같은 실수를 반복하는 것처럼 보일 수 있어 구분을 명시한다.

- **직전 실패의 구조**: 가드가 `var(--ks-cyan)` 라는 *토큰 참조* 를 검사했는데, 실제 결함은 **아무도 단언하지 않은 다른 속성**(조상의 `opacity`)이었다. 검사 대상과 파손 대상이 어긋났다.
- **이번 구조**: 동작을 지배하는 **바로 그 속성**(`visibility`)을, 그것이 선언되어야 할 **두 위치 모두**에서 단언한다. 그리고 선언 → 런타임 동작의 인과를 §0 실험으로 실증했다. 정적 단언이 런타임 동작의 **타당한 대리**가 되는 조건을 갖춘 셈이다.

**자동 런타임 검증은 불가하다**: `prefers-reduced-motion` 에뮬레이션에 필요한 `Emulation.setEmulatedMedia` 가 browse 의 CDP 허용목록에서 차단된다(deny-default). 이 저장소에는 Playwright 도 없다. 한 사이클을 위해 브라우저 테스트 인프라를 들이는 비용은 정당화되지 않는다.

→ **CI 는 정적 단언, 런타임은 기록된 재현 절차**. 가드 주석에 "이 단언이 유효한 이유는 §0 실험"임을 남겨 다음 사람이 대리의 근거를 알 수 있게 한다.

---

## 2. Implementation Spec

### 2.1 `src/app/globals.css` — 키프레임

```diff
 @keyframes ks-hero-bg-cycle {
   0%,
   29% {
     opacity: 1;
+    visibility: visible;
     transform: scale(1.01);
   }

   35%,
   94% {
     opacity: 0;
+    visibility: hidden;
     transform: scale(1.01);
   }

   100% {
     opacity: 1;
+    visibility: visible;
     transform: scale(1.01);
   }
 }
```

`visibility` 는 페이드 구간 내내 `visible` 을 유지하고 opacity 가 0 인 구간에서만 `hidden` 이 된다(§0). 따라서 크로스페이드는 그대로이고, 비가시 구간의 링크만 Tab 에서 빠진다.

### 2.2 `src/app/globals.css` — reduced-motion

```diff
   .ks-hero-bg-slide {
     animation: none !important;
     opacity: 0 !important;
+    visibility: hidden !important;
   }

   .ks-hero-bg-slide:first-child {
     opacity: 1 !important;
+    visibility: visible !important;
   }

   .ks-hero-bg-attribution {
     animation: none !important;
     opacity: 0 !important;
+    visibility: hidden !important;
   }

   .ks-hero-bg-attribution:first-child {
     opacity: 1 !important;
+    visibility: visible !important;
   }
```

**FR-02 해소**: 이 경로에서는 4개 링크가 *영구* 비가시였다.

### 2.2b `src/app/globals.css` — 기본 규칙 (v0.2 추가, Do 단계에서 누락 발견)

> ⚠️ **이 절은 초안(v0.1)에 없었다.** Do 단계 실브라우저 검증에서 발견해 추가한 것으로, 이 사이클의 Gap 이자 핵심 학습이다. 상세는 analysis §2 참조.

```diff
 .ks-hero-bg-slide {
   opacity: 0;
+  visibility: hidden;
   animation: ks-hero-bg-cycle 21s infinite;
   animation-delay: calc(var(--ks-slide-index) * 7s);
 }

 .ks-hero-bg-attribution {
   opacity: 0;
+  visibility: hidden;
   animation: ks-hero-bg-cycle 21s infinite;
   animation-delay: calc(var(--ks-slide-index) * 7s);
 }

 .ks-hero-bg-slide:first-child {
   opacity: 1;
+  visibility: visible;
 }

 .ks-hero-bg-attribution:first-child {
   opacity: 1;
+  visibility: visible;
 }
```

**왜 필요한가**: `animation-delay` 가 **양수**(`index * 7s` → 0s·7s·14s)이고 `animation-fill-mode` 가 없다. 애니메이션이 시작되기 전 딜레이 구간에는 **키프레임이 적용되지 않고 기본 규칙이 적용된다.** 기본 규칙에는 `opacity: 0` 만 있고 `visibility` 가 없어, §2.1·§2.2 만 구현한 상태에서는 **로드 후 14초간 FR-01 이 그대로 미충족**이었다.

초안이 "`opacity` 가 선언된 모든 곳"이 아니라 "애니메이션이 정의된 곳"을 대상으로 잡은 것이 원인이다.

### 2.3 `src/components/HomePage.tsx`

**변경 없음.** 마크업·Unsplash 링크·`withReferralParams` 그대로 → FR-04 자동 충족.

### 2.4 가드 — `src/focus-visible.test.ts` 확장

기존 파일에 추가한다. 포커스 도달 가능성이라는 같은 관심사이고, 새 파일을 만들면 "포커스 가시성" 규칙이 두 곳으로 흩어진다.

| # | 검증 | 실패 시 의미 |
|---|---|---|
| 1 | `ks-hero-bg-cycle` 키프레임의 `opacity: 0` 구간에 `visibility: hidden` 이 함께 있을 것 | 비가시 요소가 Tab 순서로 복귀 |
| 2 | 같은 키프레임의 `opacity: 1` 구간에 `visibility: visible` 이 함께 있을 것 | 가시 구간이 Tab 에서 사라짐(더 나쁜 회귀) |
| 3 | reduced-motion 블록의 `opacity: 0 !important` 선언에 `visibility: hidden !important` 동반 | 영구 비가시 링크 부활 |
| 4 | reduced-motion 블록의 `opacity: 1 !important` 선언에 `visibility: visible !important` 동반 | 유일하게 보이는 출처가 Tab 에서 제외됨 |
| 5 | (v0.2) `.ks-hero-bg-*` **기본 규칙**의 `opacity` 도 `visibility` 와 짝일 것 | 딜레이 구간(로드 후 14초)에 결함 부활 — 초안 가드가 이 사각지대로 GREEN 이었다 |

주석에 §0 실험 결과와 "정적 단언이 대리인 이유"를 명시한다.

**결함 주입 계획**: ①키프레임에서 `visibility` 제거 → #1·#2 실패 ②reduced-motion 에서 제거 → #3·#4 실패. 각각 원복.

### 2.5 `DESIGN.md`

`## Focus` 절에 항목 추가:

> 애니메이션이나 조건부로 숨기는 요소가 **포커스 가능한 자식을 가진다면 `opacity` 만으로 숨기지 말 것.** `opacity: 0` 은 요소를 Tab 순서에 남겨 두므로, 키보드 사용자가 보이지 않는 대상으로 포커스를 옮기게 된다(WCAG 2.4.7 Level A). `visibility: hidden` 또는 `display: none` 을 함께 쓸 것.

### 2.6 변경 파일 목록

| 파일 | 변경 |
|---|---|
| `src/app/globals.css` | 키프레임 3구간 + reduced-motion 4선언 + **기본 규칙 4선언**(v0.2)에 `visibility` |
| `src/focus-visible.test.ts` | 가드 **5건** 추가 (v0.2: 기본 규칙 검사 1건) |
| `DESIGN.md` | `## Focus` 에 opacity-숨김 금지 항목 |

`HomePage.tsx` 무변경.

---

## 3. Implementation Order (Do)

1. `globals.css` 키프레임 (2.1)
2. `globals.css` reduced-motion (2.2)
3. 가드 4건 추가 → 통과 확인
4. **결함 주입 2종** → 각 실패 확인 → 원복
5. `DESIGN.md`
6. 4게이트 + 실브라우저 Tab 순회 재확인 (애니메이션 경로)
7. reduced-motion 경로는 **수동 확인** — OS 설정 또는 DevTools 렌더링 탭

---

## 4. Verification & Exit Criteria

| 항목 | 기준 | 수단 |
|---|---|---|
| FR-01 애니메이션 경로 | 비가시 출처 링크가 Tab 순서에 없음 | `/browse` 실측 (§0 방법 재사용) |
| FR-02 reduced-motion | 영구 비가시 4개 제거 | 정적 단언 + 수동 확인 |
| FR-03 가시 링크 도달 | 보이는 출처 링크에 포커스 링 표시 | `/browse` 실측 |
| FR-04 Unsplash 요건 | 마크업 무변경으로 자동 충족 | diff 확인 |
| FR-05 가드 | 결함 주입 2종 재현 | 수동 주입 → 원복 |
| 회귀 | 94 tests 유지, 4게이트 GREEN | 로컬 + CI |

### 알려진 한계 (숨기지 말 것)

- **reduced-motion 자동 검증 불가** — browse CDP 차단 + Playwright 부재. 정적 단언이 대리이며 근거는 §0.
- **Chromium 만 확인** — `visibility` 키프레임 보간은 표준 동작이나 Firefox/Safari 실측은 미수행. 직전 사이클의 동일 잔여와 함께 처리 후보.

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-08-07 | Initial draft — 선행 실험으로 Plan 최대 리스크 반증, 후보 ① 확정. 모바일 표기 분리, 가드는 정적+근거 문서화 | jhlim725 |
| 0.2 | 2026-08-07 | **정정** — §2.2b 기본 규칙 추가. 초안이 `opacity` 선언 위치 3곳 중 2곳만 다뤄 FR-01 이 로드 후 14초간 미충족이었고, 초안 가드(4건)도 같은 사각지대라 GREEN 이었다. Do 단계 실브라우저 Tab 순회로 발견 | jhlim725 |
