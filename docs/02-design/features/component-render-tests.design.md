# component-render-tests Design Document

> **Summary**: jsdom+RTL 렌더 테스트 설계 — Plan 미결 3건을 스모크 실측으로 확정(jsdom·next/image mock·navigate 주입), site-quality grep 12항목의 처리 매핑표 포함
>
> **Project**: ksways-web
> **Version**: 0.1.0
> **Author**: jhlim725
> **Date**: 2026-07-12
> **Status**: Draft
> **Planning Doc**: [component-render-tests.plan.md](../../01-plan/features/component-render-tests.plan.md)

---

## 1. Design Decisions (Plan 미결 3건 — 스모크 실측으로 확정)

Design 단계에서 devDeps 설치 + HomePage 스모크 렌더를 실행해 실측 근거를 확보했다 (57/57 GREEN, lint·tsc 클린).

| 결정 | 선택 | 실측 근거 |
|------|------|----------|
| **DOM 환경** | **jsdom** (파일별 `// @vitest-environment jsdom` docblock) | React 19.2 + RTL 16 + vitest 4에서 무설정 동작 확인. JSX transform·jest-dom 매처 정상. happy-dom 탐색 불필요 |
| **next/image** | **alias mock** (`src/test-mocks/next-image.tsx` → 순수 `<img>`) | 실컴포넌트는 standalone 렌더에서 next.config remotePatterns를 못 읽어 **throw** (실측: "hostname not configured"). next/link는 실컴포넌트 그대로 동작 |
| **clipboard / location** | clipboard=`vi.stubGlobal` 스텁, location=**`navigate` prop 주입** (QuoteForm에 `navigate?: (href: string) => void` 추가, 기본값 `window.location.href` 할당) | jsdom은 clipboard 미구현·href 할당 시 "Not implemented: navigation" 가상콘솔 에러. prop 주입이 유일하게 결정적(스파이 가능)이며 프로덕션 동작 불변 |

**스모크에서 확보한 추가 사실**:
- 기존 `vitest.config.ts`의 `include: ['src/**/*.test.ts']`는 `.tsx` 테스트를 **조용히 무시** → `.test.{ts,tsx}`로 확장 완료
- `setupFiles: ['./src/test-setup.ts']` (jest-dom/vitest 매처) 추가 완료
- 중복 텍스트 함정: CTA 라벨이 nav·hero·contact에 반복(예: "견적 문의") → **role 스코프 쿼리 우선**, 전역 getByText 금지

---

## 2. Architecture

### 2.1 테스트 인프라 (Design 단계에서 선구축 완료)

| 파일 | 역할 |
|------|------|
| `vitest.config.ts` | include `.test.{ts,tsx}` + setupFiles + `next/image` alias |
| `src/test-setup.ts` | `@testing-library/jest-dom/vitest` 매처 |
| `src/test-mocks/next-image.tsx` | Next 전용 prop 걸러낸 `<img>` 대체 |
| devDeps | jsdom · @testing-library/react · user-event · jest-dom (0 vulns) |

환경 분리: 컴포넌트 테스트 파일만 docblock으로 jsdom, 기존 lib 테스트 55개는 node 유지.

### 2.2 프로덕션 코드 변경 (최소 1건)

`QuoteForm.tsx`: `navigate?: (href: string) => void` prop 추가 —

```tsx
export function QuoteForm({ initialValues = {...}, navigate }: { initialValues?: QuoteFormValues; navigate?: (href: string) => void }) {
  ...
  function handleOpenEmailDraft() {
    ...
    (navigate ?? ((target: string) => { window.location.href = target; }))(href);
  }
```

동작 불변(기본값 동일), 테스트에서만 스파이 주입.

---

## 3. Test Spec

### 3.1 QuoteForm.render.test.tsx (핵심, ≥6 시나리오)

| # | 시나리오 | 어서션 |
|---|---------|--------|
| 1 | 필수 미완성 + "Open email draft" 클릭 | `role=alert`에 누락 필드 라벨 노출, navigate 미호출 |
| 2 | transport mode 버튼(Ocean) 클릭 | shipmentType select 값 'FCL'로 동기화, `aria-pressed` 전환 |
| 3 | Air 선택 | 'Ocean equipment' 섹션(legend) 미표시 |
| 4 | cargoNature='DG cargo' 선택 | DG 안내 박스 텍스트 표시 |
| 5 | 필수 6필드 입력 후 클릭 | navigate가 `mailto:info@ksways.co...` + 인코딩된 회사명 포함 href로 1회 호출 |
| 6 | "Copy request summary" 클릭 | 스텁된 `clipboard.writeText`가 이메일 본문으로 호출 + 완료 문구 표시 |

user-event 사용, 고정 대기 금지.

### 3.2 페이지·부속 컴포넌트

| 파일 | 검증 |
|------|------|
| `HomePage.render.test.tsx` (확장) | en/kr copy, h1 하이라이트, JSON-LD 2개, Unsplash img 존재, FAQ `<details>`+`aria-hidden` 아이콘, footer 컬럼 링크 href |
| `ServiceLandingPage.render.test.tsx` | `servicePages` 실데이터로 h1=title, trustCards("Partner confidence"), checklist, FAQ, quote href(`quoteServiceKey` 분기: special-cargo → `/quote?service=special-cargo`), JSON-LD 2개 |
| `ContactActions.render.test.tsx` | 3 액션 mailto href(subject 인코딩), scheduleUrl 제공 시 `target="_blank"`+`rel="noopener noreferrer"` |
| `HtmlLangSync.render.test.tsx` | 렌더 후 `document.documentElement.lang` = 'ko-KR'/'en' |

### 3.3 site-quality.test.ts 매핑표 (grep 12항목 처리)

| # | 현행 grep 항목 | 처리 | 대체 |
|---|---------------|------|------|
| 1 | next.config remotePatterns·키 미노출 | **유지** | config 객체 검증 (grep 아님) |
| 2 | 보안 헤더 + CSP | **유지** | 〃 |
| 3 | README 브랜드·라우트 | **유지** | 파일 검사가 목적 그 자체 |
| 4 | qa-capture 마커 | **유지** | 〃 |
| 5 | globals.css focus-visible·reduced-motion | **유지** | CSS 파일은 렌더로 검증 불가 |
| 6 | FAQ affordance·CTA 클래스 (HomePage/ServiceLandingPage 소스 grep) | **삭제→렌더 대체** | §3.2 FAQ·CTA·trustCards 어서션 |
| 7 | max-w 컨테이너 클래스 | **삭제 (descope 명시)** | 시각 레이아웃은 시각 회귀 영역 — 렌더 어서션으로 의미있게 대체 불가 |
| 8 | hero unsplash (소스 grep+css) | **분할** | HomePage 소스 grep → 렌더 대체(img·attribution), css keyframes grep은 유지 |
| 9 | share-card/twitter (seo.ts·service-pages.ts 문자열) | **데이터 검증 대체** | `homeSeo.en.twitter.card === 'summary_large_image'` 등 import 객체 어서션 |
| 10 | Intercom layout.tsx grep | **유지** | RootLayout은 async+`next/headers` — jsdom 렌더 부적합 |
| 11 | Korean SSR lang (proxy·layout grep) | **유지** | 서버 파이프라인 검증 |
| 12 | sitemap 문자열 | **데이터 검증 대체** | `sitemap()` 호출 반환 배열 검증 |

### 3.4 Coverage 설정

```ts
coverage: {
  include: ['src/**/*.{ts,tsx}'],
  exclude: ['src/**/*.test.{ts,tsx}', 'src/test-setup.ts', 'src/test-mocks/**'],
}
```

목표: `src/components` 라인 커버리지 ≥80% (현행 렌더 경로 0%).

---

## 4. Implementation Order (Do)

1. 브랜치 생성 → Design 단계 선구축 인프라(vitest.config·setup·mock·smoke·deps) 커밋
2. QuoteForm `navigate` prop 리팩터 + QuoteForm.render.test.tsx (§3.1)
3. ServiceLandingPage·ContactActions·HtmlLangSync 렌더 테스트 + HomePage 확장 (§3.2)
4. site-quality.test.ts 매핑표 적용 (§3.3 — 6·7·8 삭제/대체, 9·12 데이터 검증화)
5. coverage 설정 + 측정 → components ≥80% 확인
6. 로컬 3게이트 → PR → CI GREEN → merge

## 5. Verification & Exit Criteria

| 검증 | 기준 |
|------|------|
| 전체 테스트 | 기존 유지분 + 신규 전부 GREEN, flaky 0 (CI 1회+로컬 반복) |
| 커버리지 | components ≥80% lines |
| lint·tsc | 0 errors (테스트 파일 포함) |
| CI quality | GREEN, 총 2분 이내 유지 |

**Exit 조건**: React 19/RTL 비호환 등 인프라 차단 발생 시(스모크 통과로 가능성 낮음) 해당 컴포넌트만 descope하고 매핑표에 기록.

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-07-12 | Initial draft — 미결 3건 실측 확정, grep 12항목 매핑표, 스모크 GREEN(57/57) | jhlim725 |
