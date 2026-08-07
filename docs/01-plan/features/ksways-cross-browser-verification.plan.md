# ksways-cross-browser-verification Planning Document

> **Summary**: 두 사이클 연속으로 a11y 핵심 CSS 메커니즘이 **Chromium 에서만** 검증된 채 머지됐다. 지원 브라우저 타깃(`browserslist`)조차 정의돼 있지 않아 "크로스브라우저 검증" 의 범위 자체가 없다. 타깃을 정하고, 누적된 미검증 2건을 해소하고, 검증 수단을 결정한다
>
> **Project**: ksways-web
> **Version**: 0.1.0
> **Author**: jhlim725
> **Date**: 2026-08-07
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

접근성 수정 두 사이클이 **핵심 동작을 Chromium 으로만 확인**하고 잔여로 남겼다. 각각은 표준 동작이라 위험이 낮지만 **누적되고 있고**, 둘 다 키보드 접근성의 핵심 경로다.

| # | 미검증 메커니즘 | 발원 사이클 | 실패 시 영향 |
|---|---|---|---|
| 1 | `outline` 이 `border-radius` 를 따르는가 | `ksways-focus-ring-contrast` | 포커스 링이 라운드 요소에서 사각형으로 튀어 시각 품질 저하 (대비는 유지) |
| 2 | `@keyframes` 내 `visibility` 보간 — 페이드 중 `visible` 유지, opacity 0 에서만 `hidden` | `ksways-hero-attribution-a11y` | **보이는 출처 링크가 Tab 에서 사라지거나**, 비가시 링크가 Tab 에 남음 (Level A 회귀) |

2번이 더 무겁다. 보간이 다르게 구현되면 **고치려던 것보다 나쁜 회귀**(가시 링크의 Tab 제외)가 가능하다.

### 1.2 Background — 검증 범위를 정할 근거가 없다

조사 결과 이 저장소에는 **지원 브라우저 타깃이 정의돼 있지 않다.**

- `package.json` 에 `browserslist` 없음, `.browserslistrc` 없음
- Playwright / Puppeteer / Selenium 등 브라우저 자동화 의존성 **없음** (devDependencies 14개 전부 확인)
- `/browse`(gstack)는 **Chromium 전용**
- Vercel Web Analytics 로 실제 방문자 브라우저 분포를 확인하려 했으나 **MCP 가 `goodman-ksways` 스코프에 인증되지 않음(403)** → 트래픽 기반 범위 설정 불가

즉 "어떤 브라우저를 지원하는가" 가 미정인 상태에서 "크로스브라우저 검증" 을 하겠다는 것이므로, **타깃 정의가 이 사이클의 선행 과제**다.

### 1.3 Related Documents

- `docs/archive/2026-08/ksways-focus-ring-contrast/` — 잔여 §6
- `docs/archive/2026-08/ksways-hero-attribution-a11y/` — 잔여 §6, 선행 실험 §0
- 관련 파일: `src/app/globals.css`(`:focus-visible`, `ks-hero-bg-cycle`), `src/focus-visible.test.ts`(가드 14건), `package.json`

---

## 2. Scope

### 2.1 In Scope

- [ ] **지원 브라우저 타깃 정의** — 근거와 함께 문서화. 이것이 없으면 나머지가 무의미
- [ ] 미검증 2건을 타깃 브라우저에서 실제 확인
- [ ] 검증 수단 결정 — 1회성 수동 / 로컬 스크립트 / CI 자동화 중 택1 (비용·회귀보호 트레이드오프)
- [ ] 결과를 `DESIGN.md` 또는 적절한 위치에 기록해 다음 사람이 재확인하지 않도록

### 2.2 Out of Scope

- 포커스 링·출처 표기의 **동작 변경** — 검증이 목적이며, 문제가 나오면 별도 사이클
- 전체 UI 의 크로스브라우저 시각 회귀 테스트 — 이번은 **명시된 2건**에 한정
- 모바일 브라우저(iOS Safari / Android Chrome) 실기 검증 — 데스크톱 엔진 3종 우선
- `ksways-mobile-attribution`(라이선스 사안, 별도)

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | 지원 브라우저 타깃을 결정하고 근거와 함께 기록 | **High** | Pending |
| FR-02 | `outline` + `border-radius` 를 타깃 엔진에서 확인 | Medium | Pending |
| FR-03 | `@keyframes` `visibility` 보간을 타깃 엔진에서 확인 — **가시 링크가 Tab 에 남는지** 포함 | **High** | Pending |
| FR-04 | 검증 수단 결정 + 재현 절차 기록 | High | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| 비용 통제 | 도구 도입 시 설치 용량·CI 시간 증가를 수치로 제시하고 판단 | 실측 |
| 회귀 안전 | 99 tests 유지 + 4게이트 GREEN | 로컬 + CI |
| 빌드 영향 | `browserslist` 추가가 컴파일 산출물을 바꾸는지 확인 | 도입 전후 빌드 산출물 대조 |

---

## 4. Success Criteria

- [ ] 지원 타깃이 문서에 명시됨
- [ ] 2건이 타깃 엔진에서 확인되고 결과가 기록됨
- [ ] 문제 발견 시 별도 사이클로 이관 (이번 사이클에서 고치지 않음)
- [ ] 4게이트 GREEN

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| **`browserslist` 추가가 빌드 산출물을 바꾼다** — Next/Tailwind v4 가 자체 타깃 처리를 하고 있어 명시 설정이 트랜스파일·프리픽스 범위를 변경할 수 있음 | **High** | Medium | 도입 전후 빌드 산출물(번들 크기·생성 CSS)을 대조. 산출물이 바뀌면 타깃은 **문서로만** 정의하고 설정 파일은 넣지 않는 선택지 검토 |
| Playwright 도입이 과한 비용 | Medium | **High** | Design 에서 3안(수동/로컬/CI)을 **설치 용량·CI 시간 실측치**와 함께 비교. 검증 대상이 2건뿐이라는 점을 판단에 반영 |
| WebKit 이 실제 Safari 와 다르게 동작 | Medium | Medium | Playwright WebKit ≠ Safari 임을 명시. 최종 확인은 실제 Safari 1회 수동 |
| 검증만 하고 회귀 보호가 없으면 같은 문제가 재발 | Medium | Medium | 1회성을 택하더라도 **결과와 재현 절차를 문서화**해 다음 사람이 처음부터 조사하지 않게 |
| 트래픽 데이터 부재로 타깃이 자의적 | Low | High | Vercel MCP 403 을 기록하고, 대안 근거(B2B 물류 고객 특성·국내외 데스크톱 비중 등)를 Design 에서 명시. 필요 시 사용자 판단 요청 |

---

## 6. Architecture Considerations

검증 대상이 **CSS 동작 2건**이라 애플리케이션 코드 변경이 없을 가능성이 높다. 산출물은 대부분 **설정·문서·검증 스크립트**다.

`/browse` 는 Chromium 전용이므로 재사용 불가. `ksways-hero-attribution-a11y` §0 의 **진행률 고정 기법**(`animation-play-state: paused` + 음수 `animation-delay`)은 엔진 무관하게 유효하므로 그대로 이식할 수 있다.

## 7. Convention Prerequisites

- [x] 검증 대상 2건이 명확히 특정됨 (아카이브 문서에 기록)
- [x] 진행률 고정 실험 기법 확립
- [ ] 지원 브라우저 타깃 — **이 사이클에서 정의**
- [ ] Firefox / Safari 로컬 설치 여부 미확인

## 8. Next Steps

1. [ ] Design (`/pdca design ksways-cross-browser-verification`) — 타깃 정의 근거, 검증 수단 3안 비교(실측 비용), `browserslist` 도입 여부
2. [ ] Do → Analyze → Report

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-08-07 | Initial draft — 미검증 2건 누적. 조사 결과 browserslist·브라우저 자동화 부재, Vercel Analytics MCP 403 으로 트래픽 기반 범위 설정 불가 | jhlim725 |
