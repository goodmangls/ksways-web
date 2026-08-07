# ksways-focus-ring-contrast Planning Document

> **Summary**: 키보드 포커스 표시 복구 — 밝은 표면에서 전역 포커스 링이 1.47:1로 비가시(WCAG 1.4.11 미달)이고, 견적 폼 28개 필드는 `outline-none` + 14% 링으로 1.14:1 사실상 무표시(**WCAG 2.4.7 Level A 미달**). brand-pivot-bronze 후속 ①
>
> **Project**: ksways-web
> **Version**: 0.1.0
> **Author**: jhlim725
> **Date**: 2026-08-07
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

이 사이트에는 **포커스 시스템이 두 개** 있고, 둘 다 밝은 표면에서 보이지 않는다.

**[A] 전역 `:focus-visible`** (`globals.css:29`) — `outline: 3px solid var(--ks-accent-soft)`, `offset: 4px`

| 표면 | 대비 | 판정 (AA 3:1) |
|---|---|---|
| 히어로·네트워크·푸터 (`#001112`) | **12.14:1** | ✅ |
| 섹션 배경 paper (`#f4f7f6`) | **1.47:1** | ❌ |
| 흰 카드 (`#ffffff`) | **1.59:1** | ❌ |

`outline-offset: 4px` 때문에 링은 요소가 아니라 **주변 표면 위**에 놓인다. 따라서 밝은 섹션의 링크·버튼·`<summary>`는 포커스해도 링이 배경에 묻힌다.

**[B] 견적 폼 입력** (`QuoteForm.tsx:100` `commonClass`) — `outline-none` + `focus:ring-4 focus:ring-[#b88a5a]/14`

| 표면 | 대비 | 판정 |
|---|---|---|
| 흰 카드 위 | **1.14:1** | ❌ |
| paper 위 | **1.13:1** | ❌ |

이쪽이 더 심각하다. `outline-none`이 브라우저 기본 표시를 **제거**하고 대체물이 사실상 보이지 않으므로, 대비 미달(1.4.11 AA)을 넘어 **포커스 표시 자체의 부재 = WCAG 2.4.7 Focus Visible (Level A)** 에 해당한다. 영향 범위는 견적 폼 **28개 필드 정의** 전체이며, 이는 사이트의 유일한 전환 경로다.

### 1.2 Background

- **회귀가 아니다.** 구 네온 시안 링은 밝은 배경에서 1.15:1로 **더 나빴다**. brand-pivot-bronze(PR #20, `e7de26c`)에서 발견했으나, 동작 변경을 피하려 토큰 이름만 바꾸고(`--ks-cyan` → `--ks-accent-soft`) 값·동작은 보존한 채 후속으로 남긴 건이다.
- 브론즈 계열은 **중간톤**이라 단일 값으로 밝은 표면과 어두운 표면을 동시에 만족시키기 어렵다. 실측:
  - `#e7c99a`(gold): dark 12.14 ✅ / light 1.47 ❌
  - `#b88a5a`(accent): dark 6.26 ✅ / white 3.08 ⚠️(간신히) / paper 2.89 ❌
  - `#805d3b`(accent-ink): light 5.55~5.92 ✅ / dark 3.26 ⚠️(간신히)
  → **단일 색 선택으로는 양쪽 모두 여유 있게 통과하지 못한다.** 표면 인지 방식이 필요하다는 것이 이 사이클의 핵심 설계 쟁점.
- 포커스 대상 분포: 어두운 표면 = 히어로 헤더/CTA + 푸터 링크 6, 밝은 표면 = HomePage 링크 17·`<summary>` 1, ServiceLandingPage 링크 4·`<summary>` 1, quote 페이지 링크 2, 폼 버튼 4 + 입력 3종(28필드).

### 1.3 Related Documents

- `docs/archive/2026-07/ksways-ci-hardening/` (CI 게이트·CSP 기반)
- brand-pivot-bronze PR #20 (`e7de26c`) — 팔레트 토큰·`src/brand-palette.test.ts` 가드 도입. 본 사이클의 대비 검증은 그 패턴을 따른다.
- 관련 파일: `src/app/globals.css`(`:focus-visible`), `src/components/QuoteForm.tsx:100`(`commonClass`), `src/site-quality.test.ts:79`, `src/brand-palette.test.ts`

---

## 2. Scope

### 2.1 In Scope

- [ ] 전역 `:focus-visible`을 **모든 표면에서 3:1 이상**으로. 표면 인지 방식(이중 링 vs 표면별 토큰 vs 기타)은 Design에서 확정
- [ ] 견적 폼 `commonClass`의 `outline-none` + 14% 링 대체 — 가시 포커스 복구 (Level A 해소)
- [ ] 포커스 대비 가드 테스트 — `brand-palette.test.ts` 패턴대로 **값·대비를 계산 검증**, `outline-none` 재도입 차단 포함
- [ ] DESIGN.md에 포커스 표시 규정 추가 (현재 관련 서술 없음)

### 2.2 Out of Scope

- 포커스 **순서**(tabindex) 및 스킵 링크 — 별도 관심사
- 색상 팔레트 값 자체의 변경 (brand-pivot-bronze에서 확정)
- 호버/액티브 상태 재설계
- `prefers-contrast` / 강제 색상 모드 대응 — 필요 시 후속

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | 전역 `:focus-visible`이 dark(`#001112`)·paper(`#f4f7f6`)·white 세 표면 모두에서 **≥3:1** | High | Pending |
| FR-02 | 견적 폼 입력의 가시 포커스 복구 — `outline-none` 제거 또는 ≥3:1 대체 표시 제공 (WCAG 2.4.7) | **Critical** | Pending |
| FR-03 | 포커스 대비 가드 테스트 — 표면별 대비 계산 검증 + `outline-none` 무방비 재도입 차단 | High | Pending |
| FR-04 | DESIGN.md 포커스 규정 신설 — 표면별 토큰·최소 대비·금지 패턴 명문화 | Medium | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| 회귀 안전 | 85 tests 유지 + 4게이트(lint·tsc·test·build) GREEN | 로컬 + CI |
| 가드 실효성 | 신규 가드가 **결함 주입으로 실제 실패**함을 확인 | 임시 저대비 값 주입 → 실패 → 원복 |
| 시각 확인 | 실브라우저 키보드 탭 순회로 전 표면 링 가시 확인 | 수동 스팟체크 (headless 불가) |
| 브랜드 정합 | 포커스 표시가 브론즈 아이덴티티와 충돌하지 않음 | DESIGN.md 대조 |

---

## 4. Success Criteria

- [ ] 세 표면 전부 ≥3:1 (계산치 문서화)
- [ ] 폼 28필드 키보드 포커스 육안 확인 — Level A 해소
- [ ] 가드 테스트 결함 주입 검증 통과
- [ ] 4게이트 GREEN + PR merge

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| 단일 색으로 양 표면 만족 시도 → 어느 한쪽이 간신히 통과(3.08/3.26)하는 취약한 해 | High | **High** | Design에서 **이중 링**(밝은 외곽 + 어두운 내곽, 어떤 배경에서도 한쪽이 대비 확보) 을 기본안으로 검토. 단일 토큰안은 여유 마진 부족을 근거로 기각 후보 |
| `outline-offset: 4px` 탓에 링이 *주변* 표면에 놓여, 요소 기준으로 계산하면 오판 | Medium | High | 대비 계산 기준면을 **인접 표면**으로 명시하고 테스트 주석에 근거 기록 |
| 폼 `outline-none` 제거 시 라운드 코너와 아웃라인 모양 충돌(시각 품질 저하) | Medium | Medium | `outline` + `border-radius` 브라우저 지원 확인, 필요 시 `box-shadow` 링으로 대체 — Design에서 결정 |
| 포커스 대비는 headless로 검증 불가(실제 렌더 필요) | Medium | High | 계산 검증(테스트) + 실브라우저 수동 스팟체크 **2단** 구성. Vercel preview는 Auth 보호라 익명 접근 불가 |
| 밝은 표면 요소가 다수(24+)라 회귀 범위 넓음 | Low | Medium | 전역 규칙 1곳 수정이므로 실제 diff는 작음. 요소별 오버라이드 도입은 In Scope에서 배제 |

---

## 6. Architecture Considerations

수정 지점은 사실상 **2곳**이다: `globals.css`의 `:focus-visible` 블록, `QuoteForm.tsx`의 `commonClass`. 컴포넌트별 포커스 오버라이드를 새로 만들지 않는다 — 그것이 [B]처럼 전역 규칙이 조용히 무력화되는 원인이었다.

가드는 `src/brand-palette.test.ts`와 같은 계층(값·대비 계산 검증)에 둔다. 별도 파일 신설 vs 기존 파일 확장은 Design에서 결정.

## 7. Convention Prerequisites

- [x] 팔레트 토큰 역할 기반 정리 (`--ks-accent` 계열, PR #20)
- [x] 대비 계산 유틸 존재 (`brand-palette.test.ts`의 `contrastRatio`) — 재사용 또는 공통화 대상
- [x] CI 4게이트 (quality + build)
- [ ] 실브라우저 스팟체크 경로 — prod(ksways.co) 또는 로컬 dev. preview는 Vercel Auth로 불가

## 8. Next Steps

1. [ ] Design (`/pdca design ksways-focus-ring-contrast`) — **이중 링 vs 표면별 토큰** 확정, 폼 링 대체 방식, 가드 배치, DESIGN.md 규정 문안
2. [ ] Do → Analyze → Report

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-08-07 | Initial draft — brand-pivot-bronze 후속 ①. 실측 기반: 전역 링 light 1.47:1, 폼 링 1.14:1(Level A) | jhlim725 |
