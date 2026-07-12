# mailto-optimization Design Document

> **Summary**: 견적 mailto 본문 최적화 구현 설계 — 미결 3건 확정: 섹션 골격 유지+빈 라인 생략(사용자 확인), 경고+진행 허용 가드(사용자 확인), 임계치 1800자(기술 근거)
>
> **Project**: ksways-web
> **Version**: 0.1.0
> **Author**: jhlim725
> **Date**: 2026-07-12
> **Status**: Draft
> **Planning Doc**: [mailto-optimization.plan.md](../../01-plan/features/mailto-optimization.plan.md)

---

## 1. Design Decisions (전부 확정)

| 결정 | 확정값 | 근거 |
|------|--------|------|
| **본문 형식** | **섹션 골격 유지 + 빈 라인만 생략** — 섹션 헤더([Company / Contact] 등 5종)는 항상 표시, 값 없는 필드 라인만 제거 | **사용자 확인(2026-07-12)**: 수신 팀이 익숙한 구조 유지가 우선. 빈 섹션도 헤더는 남음 |
| **가드 방식** | **경고 + 진행 허용** — 임계치 초과 시 안내 문구 표시("일부 메일 앱은 긴 내용을 자를 수 있음 — 요약 복사 권장")하되 mailto 열기는 허용 | **사용자 확인(2026-07-12)**: Gmail 웹 등 긴 URL을 처리하는 클라이언트 사용자를 막지 않음 |
| **임계치** | `QUOTE_MAILTO_LENGTH_LIMIT = 1800` (인코딩된 href 전체 길이 기준) | 문서화된 최소 클라이언트 URL 한도가 레거시 Outlook/IE 계열 **2083자** — 안전 여유 약 280자를 둔 보수값. 상수로 노출해 조정 가능 |

---

## 2. Implementation Spec

### 2.1 `src/lib/quote-form.ts` — 데이터 주도 직렬화로 재구성

현행 `buildQuoteEmailText`는 30개 필드를 하드코딩 flat 배열로 직렬화. 다음으로 대체:

```ts
const quoteEmailSections: Array<{ title: string; fields: Array<[keyof QuoteFormValues, string]> }> = [
  { title: '[Company / Contact]', fields: [['enquiryContext', 'Enquiry context'], ['companyName', 'Company name'], ['contactName', 'Contact person / title'], ['emailOrPhone', 'Email / phone']] },
  { title: '[Mode / Route]', fields: [/* transportMode…pickupContact 9종 */] },
  { title: '[Cargo]', fields: [/* commodity…cargoReadyDate 8종 */] },
  { title: '[Ocean / Equipment]', fields: [/* containerType, containerQuantity */] },
  { title: '[DG / Special Handling]', fields: [/* temperatureRange…additionalNotes 6종 */] },
];

export function buildQuoteEmailText(values: QuoteFormValues = {}) {
  const body = quoteEmailSections.flatMap(({ title, fields }) => {
    const lines = fields.filter(([key]) => value(values, key)).map(([key, label]) => `- ${label}: ${value(values, key)}`);
    return [title, ...lines, ''];   // 섹션 헤더는 값 유무와 무관하게 항상 유지 (§1 확정)
  });
  return ['Dear KS WAYS team,', '', 'Please review the website quote request below.', '', ...body].join('\n');
}
```

- 필드 순서·라벨은 현행과 동일하게 보존 (수신 팀 가독성)
- 라벨 매핑은 기존 문자열 그대로 이관 — 오타 유입 방지 위해 Do에서 현행 함수와 diff 대조

### 2.2 길이 가드 유틸 (동일 파일)

```ts
export const QUOTE_MAILTO_LENGTH_LIMIT = 1800;

export function isQuoteMailtoOverLimit(values: QuoteFormValues = {}) {
  return buildQuoteMailto(values).length > QUOTE_MAILTO_LENGTH_LIMIT;
}
```

### 2.3 `src/components/QuoteForm.tsx` — 가드 UI

- `const mailtoOverLimit = href.length > QUOTE_MAILTO_LENGTH_LIMIT;` (href는 기존 useMemo 재사용 — 재계산 없음)
- 초과 시 안내 배너를 **양쪽 CTA 영역**(aside "Email handoff" + 모바일 review 박스)에 조건부 렌더:
  - 문구: "본문이 깁니다. 일부 메일 앱은 긴 내용을 자를 수 있어요 — 아래 '요약 복사'로 붙여넣기를 권장합니다." (en 카피는 기존 톤 맞춰 Do에서 확정)
  - `role="status"` (경고성 정보, alert 아님 — 차단이 아니므로)
- "Open email draft" 버튼·navigate 흐름은 변경 없음 (진행 허용)

### 2.4 테스트

| 파일 | 내용 |
|------|------|
| `src/lib/quote-form.test.ts` | ⚠️ **Do 착수 시 파일 재읽기 필수**(218줄, 전체 직렬화 가정 — 병행작업 드리프트 학습). 갱신: 빈 필드 라인 부재 어서션으로 재구성. 신규: ①빈 값 필드 라인 생략 ②섹션 헤더 5종 항상 존재 ③값 있는 필드는 라벨과 함께 포함 ④필수만 입력 시 `buildQuoteMailto` < 1000자 ⑤경계값 — LIMIT 이하 false/초과 true (`isQuoteMailtoOverLimit`) |
| `src/components/QuoteForm.render.test.tsx` | 신규 시나리오 2: ①긴 `additionalNotes` 입력 → 경고 문구(role=status) 표시 + navigate 여전히 호출 가능 ②짧은 입력 → 경고 미표시 |

### 2.5 변경 파일 목록

| 파일 | 변경 | FR |
|------|------|----|
| `src/lib/quote-form.ts` | 직렬화 재구성 + LIMIT 상수 + 판정 유틸 | FR-01, FR-02 |
| `src/components/QuoteForm.tsx` | 가드 배너 (양쪽 CTA 영역) | FR-03 |
| `src/lib/quote-form.test.ts` | 갱신 + 신규 5케이스 | FR-04 |
| `src/components/QuoteForm.render.test.tsx` | 신규 2시나리오 | FR-04 |

---

## 3. Implementation Order (Do)

1. **대상 소스 재읽기** (quote-form.ts·quote-form.test.ts·QuoteForm.tsx 현행 확인 — 병행작업 드리프트 대비)
2. 브랜치 생성 → lib 재구성(§2.1~2.2) + lib 테스트(§2.4) → 현행 대비 본문 diff 스팟 확인
3. UI 가드(§2.3) + 렌더 테스트
4. 4게이트(lint·tsc·test·**build**) → PR → CI GREEN
5. merge(사용자 결정) → 사이클 마감

## 4. Verification & Exit Criteria

| 검증 | 기준 |
|------|------|
| 본문 축소 실효 | 필수만 입력 시 mailto href < 1000자 (테스트로 고정, 측정치 report에 기록) |
| 형식 보존 | 섹션 헤더 5종·필드 순서·라벨 현행 동일 |
| 가드 동작 | 초과 시 경고 표시 + 진행 허용 (렌더 테스트) |
| 회귀 | 71 tests 기준 전부 GREEN (갱신분 반영), CI quality+build GREEN |

**Exit 조건**: 없음 (외부 의존 없는 순수 로직 사이클 — 차단 요인 없음).

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-07-12 | Initial draft — 미결 3건 확정(형식·가드=사용자 확인, 임계치=기술 근거) | jhlim725 |
