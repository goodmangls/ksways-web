# component-render-tests Planning Document

> **Summary**: React 컴포넌트 렌더 테스트 0% 해소 — vitest jsdom + Testing Library 도입, QuoteForm 인터랙션·페이지 컴포넌트 렌더 검증, site-quality.test.ts의 brittle 소스-문자열 grep 테스트를 렌더 기반으로 대체
>
> **Project**: ksways-web
> **Version**: 0.1.0
> **Author**: jhlim725
> **Date**: 2026-07-12
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

코드 분석(2026-07-12, 종합 8.2/10)의 MEDIUM M1 해소:

1. **렌더 경로 커버리지 0%**: `HomePage`·`QuoteForm`·`ServiceLandingPage`·`ContactActions`·`HtmlLangSync`의 React 렌더/인터랙션이 전혀 실행되지 않음 — 현행 55개 테스트는 lib 함수(node)와 소스 문자열 검사뿐
2. **brittle 테스트 대체**: `site-quality.test.ts`가 소스 파일을 `readFileSync`로 읽어 `max-w-[1280px]` 같은 클래스 리터럴을 grep — 정상 리팩터링에도 깨지는 취약 결합을 렌더 기반 검증으로 전환

### 1.2 Background

- 현행 테스트 스택: vitest 4 (node 환경, jsdom 미설치), Testing Library 부재
- 최근 사이클(ksways-ci-hardening)로 CI quality 게이트 가동 중 — 신규 테스트는 자동으로 게이트에 편입됨
- 관련 학습(타 프로젝트): jsdom 렌더 테스트는 transitive 데이터 훅 전부 mock 필수(부분 mock=CI-only flaky) — 이 프로젝트는 데이터 훅이 없어 리스크 낮음. React 19 + RTL 16 호환 확인 필요

### 1.3 Related Documents

- 코드 분석 M1 (Task #3), ksways-ci-hardening report §6 후속 후보
- 메모리: `partial-hook-mock-teardown-flaky`, `jest-globals-hoisting`(vitest 무관하나 mock 함정 참고)

---

## 2. Scope

### 2.1 In Scope

- [ ] vitest jsdom 환경 구성 + `@testing-library/react`·`@testing-library/user-event`·`@testing-library/jest-dom` 도입 (컴포넌트 테스트 파일에만 jsdom 적용, lib 테스트는 node 유지)
- [ ] **QuoteForm 인터랙션 테스트** (핵심): 필수필드 미완성 시 검증 메시지·포커스 이동, transport mode 선택 → shipmentType 동기화, Air/Express 선택 시 ocean 섹션 숨김, DG cargo 선택 시 UN/Class 필드 강조, 요약 복사(clipboard mock)
- [ ] **페이지 컴포넌트 렌더 테스트**: HomePage(en/kr copy·JSON-LD script·FAQ·footer), ServiceLandingPage(trustCards·checklist·FAQ·quote href), ContactActions(3개 액션 href·외부 링크 rel)
- [ ] `site-quality.test.ts`의 UI-구조 문자열 grep 항목(§"FAQ visual affordance"·"desktop layouts"·"hero background" 등)을 렌더 테스트로 대체 후 축소 — **next.config·CSS 파일·README 등 비컴포넌트 검사는 유지**
- [ ] coverage 설정 정비: `src/**` 전체를 분모에 포함(`coverage.include`)해 미테스트 파일이 수치에 드러나게

### 2.2 Out of Scope

- E2E(Playwright) 도입 — qa-capture 스크립트 별도 존재, E2E 정식화는 별도 사이클
- 시각 회귀(스크린샷) 테스트
- mailto 본문 최적화 (Task #4 — 별도 사이클)
- app/ 라우트 파일(page.tsx 래퍼)·proxy.ts 테스트 — 래퍼는 렌더 대상 컴포넌트로 커버

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | 테스트 인프라: jsdom + RTL 설치, vitest 환경 분리(컴포넌트 `.test.tsx`=jsdom, 기존 `.test.ts`=node), next/image·next/link jsdom 동작 확인(필요 시 mock) | High | Pending |
| FR-02 | QuoteForm 인터랙션 테스트 ≥5 시나리오 (검증·동기화·섹션 표시·DG 강조·클립보드) | High | Pending |
| FR-03 | HomePage·ServiceLandingPage·ContactActions·HtmlLangSync 렌더 테스트 (locale별 copy, JSON-LD, 링크 href/rel) | High | Pending |
| FR-04 | site-quality.test.ts 컴포넌트-소스 grep 항목을 렌더 검증으로 대체·삭제 (비컴포넌트 검사 유지) | Medium | Pending |
| FR-05 | coverage.include=src 전체 설정 + 컴포넌트 라인 커버리지 ≥80% 달성 | Medium | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| 회귀 안전 | 기존 55 테스트 전부 유지·통과 (대체로 삭제되는 항목 제외) | vitest run |
| CI 성능 | quality job 총 소요 2분 이내 유지 | Actions 시간 |
| 안정성 | jsdom 테스트 flaky 0 — 타이머/클립보드/location mock 명시적 관리 | CI 3연속 GREEN |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] 컴포넌트 5종 렌더/인터랙션 테스트 GREEN
- [ ] brittle 소스-grep 항목이 렌더 테스트로 대체되고 site-quality.test.ts 축소
- [ ] coverage 분모에 src 전체 포함 + 컴포넌트 커버리지 ≥80%
- [ ] 로컬 3게이트 + CI quality GREEN
- [ ] PR merge

### 4.2 Quality Criteria

- [ ] Zero lint errors (현행 무경고 유지)
- [ ] tsc 0 (테스트 파일 포함)
- [ ] flaky 없는 결정적 테스트 (고정 대기·타임아웃 어서션 금지)

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| React 19.2 + RTL 버전 비호환 | High | Low | RTL 16.x(React 19 지원) 고정, 설치 직후 스모크 렌더로 조기 검증 |
| next/image가 jsdom에서 미동작 | Medium | Medium | 스모크 실패 시 vitest alias로 img 대체 mock — Design에서 방식 확정 |
| `navigator.clipboard`·`window.location.href` jsdom 제약 (QuoteForm mailto/복사) | Medium | High | clipboard는 vi.stubGlobal, location은 spy 가능한 래퍼 또는 href getter 검증으로 우회 — Design에서 확정 |
| 문자열 테스트 삭제 시 의도 회귀 감지력 상실 | Medium | Low | 각 grep 항목을 1:1로 렌더 어서션에 매핑 후 삭제 (매핑표를 Design에 명시) |
| jsdom 도입으로 테스트 시간 증가 | Low | Medium | 컴포넌트 파일에만 jsdom 적용(파일별 environment 주석), lib는 node 유지 |

---

## 6. Architecture Considerations

프로덕션 코드 변경 최소화 원칙 — 테스트 인프라·테스트 파일 중심. 단, location/clipboard 테스트 가능성을 위해 QuoteForm에 소규모 리팩터링(주입 가능한 내비게이션 함수 등)이 필요하면 Design에서 결정.

| Decision | Options | Selected | Rationale |
|----------|---------|----------|-----------|
| DOM 환경 | jsdom / happy-dom | Design에서 확정 | happy-dom이 빠르나 호환성은 jsdom 우위 |
| 환경 적용 범위 | 전역 jsdom / 파일별 지시 | 파일별(`@vitest-environment`) | lib 테스트 55개는 node 유지, 오염 방지 |
| next/image 처리 | 실컴포넌트 / mock | Design에서 확정 | 스모크 결과 기반 |

---

## 7. Convention Prerequisites

- [x] vitest 4 기설치, `test`/`test:run` 스크립트 존재
- [x] CI quality 게이트 가동 중 (신규 테스트 자동 편입)
- [x] TS strict — 테스트 파일도 tsc 대상
- 신규 devDeps: `jsdom`(또는 happy-dom), `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`

---

## 8. Next Steps

1. [ ] Design 문서 작성 (`/pdca design component-render-tests`) — DOM 환경·mock 전략·grep→렌더 매핑표 확정
2. [ ] Do: 인프라 → QuoteForm → 페이지 컴포넌트 → 대체·축소
3. [ ] Analyze: Gap 분석

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-07-12 | Initial draft — 코드 분석 M1(렌더 테스트 0%·brittle grep) 해소 계획 | jhlim725 |
