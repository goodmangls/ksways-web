# ksways-hero-attribution-a11y Planning Document

> **Summary**: 히어로 Unsplash 출처 링크 6개 중 4개가 매 순간 `opacity: 0` 인 채 Tab 순서에 잔존 — 키보드 사용자가 보이지 않는 링크로 포커스를 옮긴다(WCAG 2.4.7 Level A). `prefers-reduced-motion` 에서는 순환이 아니라 **영구**. Unsplash 출처 표기 요건과 결합돼 있어 설계가 필요하다
>
> **Project**: ksways-web
> **Version**: 0.1.0
> **Author**: jhlim725
> **Date**: 2026-08-07
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

`ksways-focus-ring-contrast` 사이클(archived, `docs/archive/2026-08/`)의 실브라우저 스팟체크 중 발견했다. 포커스 링 자체는 정상인데 **조상 요소의 `opacity` 가 링까지 감쇠**시켜 보이지 않았다.

```
포커스된 출처 링크의 계산값:
  outline    rgba(235, 211, 173, 0.855)   ← 본래 불투명한데 감쇠
  box-shadow rgba(0, 17, 18, 0.694) 0 0 0 1.3912px
```

`.ks-hero-bg-attribution` 3개 컨테이너가 `ks-hero-bg-cycle`(21s) 로 `opacity` 0↔1 을 순환하고, 각 컨테이너에 링크가 2개씩(사진작가 / Unsplash) = **포커스 가능한 링크 6개**.

실측 `opacity`: `[0.37, 0.912, 0]` → 3초 후 `[0, 1, 0]`.
**매 순간 컨테이너 2개(링크 4개)가 완전히 보이지 않는 채 Tab 순서에 남아 있다.**

### 1.2 Background — 두 가지가 겹쳐 있다

**① reduced-motion 에서 더 나쁘다 (영구)**

```css
@media (prefers-reduced-motion: reduce) {
  .ks-hero-bg-attribution { animation: none !important; opacity: 0 !important; }
  .ks-hero-bg-attribution:first-child { opacity: 1 !important; }
}
```

애니메이션 경로에서는 링크가 최소한 *언젠가는* 보이지만, reduced-motion 에서는 **4개가 영구히 `opacity: 0`** 이면서 포커스 가능하다. 순환 결함보다 심각하고, 이 설정을 켜는 사용자층이 접근성 요구가 큰 집단이라는 점에서 우선순위가 높다.

**② 라이선스와 결합돼 있다**

출처 표기는 장식이 아니다. `unsplash.ts` 가 `withReferralParams()` 로 `utm_source=ksways&utm_medium=referral` 을 붙이는 것에서 보이듯 **Unsplash 의 출처 표기·referral 요건을 의도적으로 구현**한 것이다. 링크를 숨기거나 Tab 에서 빼는 처리는 준수 여부와 직결되므로 즉흥 패치 대상이 아니다.

**③ 부수 발견 — 모바일에는 출처 표기가 아예 없다**

컨테이너가 `hidden ... sm:block` 이라 **640px 미만에서 `display: none`**. `display:none` 은 Tab 순서에서도 빠지므로 a11y 결함은 아니지만, **출처 표기 요건 측면에서는 별개의 질문**이다. 이 사이클에서 함께 판단할지 Design 에서 결정한다.

### 1.3 Related Documents

- `docs/archive/2026-08/ksways-focus-ring-contrast/` — 발견 경위, §5 및 report §5
- 관련 파일: `src/components/HomePage.tsx`(78~91행 출처 마크업), `src/app/globals.css`(`ks-hero-bg-cycle` 키프레임 + reduced-motion 블록), `src/lib/unsplash.ts`(`withReferralParams`), `src/components/HomePage.render.test.tsx:51`(슬라이드 3개 이상 단언)
- 패턴은 `HomePage.tsx` **1개 파일에만** 존재 (ServiceLandingPage·quote 페이지에는 없음)

---

## 2. Scope

### 2.1 In Scope

- [ ] 보이지 않는 출처 링크가 Tab 순서에 들어가지 않게 한다 — 애니메이션 경로와 reduced-motion 경로 **양쪽**
- [ ] 보이는 출처 링크는 계속 키보드로 도달 가능하고 포커스 링이 정상 표시될 것
- [ ] Unsplash 출처 표기·referral 파라미터 요건 유지 (링크 제거·`nofollow` 화 금지)
- [ ] 회귀 가드 — 이번 결함은 CSS 값이 아니라 **런타임 상속**이라 기존 정적 가드로는 안 잡힌다. 검증 수단을 Design 에서 확정

### 2.2 Out of Scope

- 포커스 링 색·구조 (직전 사이클에서 확정)
- 히어로 이미지 소스·슬라이드 수·애니메이션 타이밍 변경
- Unsplash API 연동 로직 (`unsplash.ts` 데이터 취득부)
- 사이트 전역 Tab 순서 감사 — 이 컨테이너에 한정

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | `opacity: 0` 인 출처 컨테이너의 링크가 Tab 순서에 없을 것 (애니메이션 경로) | **Critical** | Pending |
| FR-02 | reduced-motion 경로에서도 동일 — 영구 비가시 링크 4개 제거 | **Critical** | Pending |
| FR-03 | 현재 보이는 출처 링크는 키보드 도달 가능 + 포커스 링 정상 | High | Pending |
| FR-04 | Unsplash 출처 표기·referral 유지 (사진작가명·Unsplash 링크·utm 파라미터) | High | Pending |
| FR-05 | 회귀 가드 — 런타임 검증 수단 확정 및 도입 | High | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| 회귀 안전 | 94 tests 유지 + 4게이트(lint·tsc·test·build) GREEN | 로컬 + CI |
| 검증 실효성 | 결함 주입으로 가드 실패 재현 | 임시 원복 → 실패 → 복구 |
| 실측 확인 | 실브라우저 Tab 순회로 비가시 링크 도달 불가 확인 (**애니메이션·reduced-motion 양쪽**) | `/browse` + `prefers-reduced-motion` 에뮬레이션 |
| 시각 보존 | 히어로 출처 표기의 현재 인상 유지 또는 의도적 개선 | 스크린샷 대조 |

---

## 4. Success Criteria

- [ ] 두 경로 모두에서 비가시 링크가 Tab 순서에 없음 (실측)
- [ ] 보이는 링크는 도달 가능 + 포커스 링 표시 (실측)
- [ ] Unsplash 요건 유지
- [ ] 가드 결함 주입 검증 통과
- [ ] 4게이트 GREEN + PR merge

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| `visibility` 를 키프레임에 넣을 때 페이드 구간 해석이 브라우저마다 다름 → 크로스페이드 시각 손상 | Medium | **High** | Design 에서 `visibility` 안을 채택한다면 페이드 구간 동작을 실브라우저로 먼저 확인. 대안(정적 표기·`inert`)을 함께 저울질 |
| JS 로 `inert`/`tabindex` 를 토글하면 CSS 애니메이션 상태를 JS 가 추적해야 함 → 동기화 깨짐 | Medium | Medium | CSS 단독 해결을 우선 검토. JS 필요 시 애니메이션을 JS 주도로 바꾸는 비용까지 포함해 판단 |
| 출처 표기 방식 변경이 Unsplash 요건을 건드림 | **High** | Medium | 링크·작성자명·utm 파라미터는 **불변 조건**으로 고정. 표기 위치/개수만 설계 변수로 다룸 |
| 모바일 출처 부재(③)를 이 사이클에 끌어들이면 범위가 커짐 | Low | Medium | Design 에서 **명시적으로 포함/제외 결정**하고 근거를 기록. 제외 시 별도 후보로 등록 |
| 런타임 결함이라 정적 테스트로 회귀를 막기 어려움 | Medium | High | FR-05 를 독립 요구사항으로 분리. jsdom 한계를 감안해 실브라우저 검증 스크립트화 여부를 Design 에서 판단 |

---

## 6. Architecture Considerations

수정 지점은 `HomePage.tsx` 의 출처 마크업과 `globals.css` 의 애니메이션·reduced-motion 블록 두 곳이다. 슬라이드 이미지(`.ks-hero-bg-slide`)는 `<img>` 라 포커스 대상이 아니므로 **같은 키프레임을 공유하더라도 문제는 출처 컨테이너에만 있다** — 애니메이션을 분리할지도 설계 변수.

후보 방향(Design 에서 확정):
1. `visibility` 를 키프레임/reduced-motion 에 추가 — CSS 단독, Tab 순서에서 자동 제외
2. 활성 슬라이드의 출처만 렌더 — 마크업 단순화, 애니메이션을 JS 주도로 전환하는 비용
3. **정적 통합 표기** — 3인 크레딧을 항상 보이게. 가장 단순·항상 준수·a11y 충돌 없음. 시각 변화 있음
4. `inert` 토글 — JS 필요, 동기화 리스크

## 7. Convention Prerequisites

- [x] 포커스 링 이중 구조 확정 (직전 사이클)
- [x] `/browse` 실브라우저 검증 경로 확립 — 실제 Tab 키로 `:focus-visible` 발동 검증 가능
- [x] CI 4게이트
- [ ] `prefers-reduced-motion` 에뮬레이션 방법 확인 (미검증)

## 8. Next Steps

1. [ ] Design (`/pdca design ksways-hero-attribution-a11y`) — 4개 후보 중 확정, 모바일 표기(③) 포함 여부, 가드 수단
2. [ ] Do → Analyze → Report

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-08-07 | Initial draft — focus-ring 사이클 스팟체크 발원. 실측: 링크 6개 중 4개 상시 비가시, reduced-motion 에서는 영구 | jhlim725 |
