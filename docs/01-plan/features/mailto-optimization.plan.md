# mailto-optimization Planning Document

> **Summary**: 견적 mailto 본문 최적화 — 빈 필드 생략으로 본문 축소 + 인코딩 길이 가드로 일부 메일 클라이언트의 조용한 URL 잘림(~2000자) 방지 (코드 분석 M2, Task #4)
>
> **Project**: ksways-web
> **Version**: 0.1.0
> **Author**: jhlim725
> **Date**: 2026-07-12
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

`buildQuoteEmailText`(quote-form.ts)가 약 30개 필드를 **빈 값 포함 전부** 직렬화해 mailto URL이 불필요하게 길다. 일부 클라이언트(Outlook 데스크톱 등)는 ~2000자 초과 URL을 조용히 자르므로, 긴 입력 시 견적 요청 본문이 유실될 수 있다.

1. **빈 필드 생략**: 값이 있는 필드만 본문에 포함 → 기본 케이스에서 본문 대폭 축소
2. **길이 가드**: 인코딩 후 임계치 초과 시 사용자를 "요약 복사" 경로로 안내 → 유실 대신 명시적 대안

### 1.2 Background

- 완화책 기존재: "Copy request summary" 버튼 + 안내 문구. 그러나 초과 여부를 사용자가 알 수 없어 수동 대안이 작동 안 함
- **테스트 기반 마련됨**: component-render-tests 사이클의 `navigate` prop 주입으로 mailto 흐름이 단위 테스트 가능
- 수신 측(KS WAYS 팀)이 고정 템플릿 형태에 익숙할 수 있음 — 섹션 골격 유지 여부가 설계 쟁점

### 1.3 Related Documents

- 코드 분석 M2 (Task #4), component-render-tests report §5 후속
- 관련 파일: `src/lib/quote-form.ts`(buildQuoteEmailText·buildQuoteMailto), `src/components/QuoteForm.tsx`, `src/lib/quote-form.test.ts`(218줄 — 전체 직렬화 가정), `src/components/QuoteForm.render.test.tsx`

---

## 2. Scope

### 2.1 In Scope

- [ ] `buildQuoteEmailText`: 값 있는 필드만 직렬화. 섹션 처리 방식(빈 섹션 헤더 생략 vs 골격 유지)은 Design에서 확정
- [ ] `buildQuoteMailto` 길이 측정 + 임계치(기본 1800자, Design 확정) 초과 판정 유틸
- [ ] QuoteForm UI 가드: 초과 시 mailto 열기 전 "요약 복사" 경로 안내 (경고 vs 자동 전환 — Design 확정)
- [ ] 테스트: 기존 quote-form.test.ts 갱신(직렬화 가정 변경 반영) + 신규(빈 필드 생략·경계값·가드 UI 시나리오)

### 2.2 Out of Scope

- 서버 제출(폼 백엔드) 전환 — mailto 아키텍처 유지
- 폼 필드 구성·순서 변경
- ContactActions의 partner/schedule mailto (정적 템플릿 ~1KB 수준, 위험 없음)
- 이메일 본문 다국어화

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | 빈 필드 생략 직렬화 — 필수 최소 골격(인사말·회사/연락처)은 항상 포함, 값 없는 선택 필드는 라인 생략 | High | Pending |
| FR-02 | 길이 판정 유틸: 인코딩된 mailto href 길이 vs 임계치, 순수 함수로 테스트 가능하게 | High | Pending |
| FR-03 | QuoteForm 가드 UI: 초과 시 사용자에게 명시 안내 + 요약 복사 유도 (mailto 유실 방지) | High | Pending |
| FR-04 | 테스트 갱신·신규 — quote-form.test.ts 재정렬 + 생략/경계/가드 케이스, 렌더 테스트 1+ 시나리오 | High | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| 회귀 안전 | 71 tests 기준 유지(갱신분 제외) + 4게이트(lint·tsc·test·**build**) GREEN | 로컬+CI (build 승격 반영) |
| 실효성 | 필수 필드만 입력 시 mailto href < 1000자, 전 필드 상식적 입력 시 < 임계치 | 단위 테스트로 고정 |
| 수신 품질 | 생략 후에도 KS WAYS 팀이 요청을 파싱할 수 있는 구조 유지 | Design에서 섹션 골격 결정 |

---

## 4. Success Criteria

- [ ] 빈 값 라인이 본문에서 사라짐 (필수만 입력 시 본문 길이 측정치 문서화)
- [ ] 임계치 초과 시 유실 없이 안내 경로 작동 (렌더 테스트로 고정)
- [ ] 4게이트 GREEN + PR merge

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| 수신 측이 고정 템플릿 파싱에 의존 → 생략 형식이 업무 혼란 | Medium | Low~Medium | 섹션 헤더 골격은 유지하고 라인만 생략하는 보수안을 Design 기본값으로. 최종 형식은 사용자(=수신 측 대표) 확인 1회 |
| 기존 quote-form.test.ts(218줄)가 전체 직렬화를 광범위 가정 | Medium | High | FR-04에 갱신 비용 명시 — 스냅샷성 어서션을 필드 단위 어서션으로 재구성 |
| 임계치 과소/과대 설정 | Low | Medium | 보수적 1800 기본 + 상수로 노출, Design에서 근거 문서화 |

---

## 6. Architecture Considerations

로직은 `lib/quote-form.ts` 순수 함수 계층에 집중, UI 변경은 QuoteForm 가드 분기 1곳 — 기존 컨벤션(순수 함수 + 렌더 테스트) 그대로.

## 7. Convention Prerequisites

- [x] jsdom+RTL 인프라 (component-render-tests에서 구축)
- [x] navigate prop (mailto 흐름 테스트 가능)
- [x] CI 4게이트 (build 승격 PR #18 진행 중)

## 8. Next Steps

1. [ ] Design (`/pdca design mailto-optimization`) — 섹션 골격 vs 완전 생략, 경고 vs 자동 전환, 임계치 근거 확정
2. [ ] Do → Analyze → Report

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-07-12 | Initial draft — 코드 분석 M2 해소 계획 | jhlim725 |
