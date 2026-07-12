# component-render-tests Completion Report

> **Feature**: component-render-tests
> **Project**: ksways-web 0.1.0
> **Date**: 2026-07-12 (단일 세션 사이클, ksways-ci-hardening 직후 연속)
> **Match Rate**: **95%** (iterate 0회, Gap 4건 전부 Low·문서동기화로 Check 내 소거)
> **PR**: [#17](https://github.com/goodmangls/ksways-web/pull/17) — `6876274`(인프라)·`07de1c6`(테스트)·`07cbc42`(분석·동기화)
> **Status**: 구현·검증 완료, **merge 대기**

---

## 1. 사이클 개요

코드 분석(2026-07-12) MEDIUM M1 해소: React 컴포넌트 **렌더 커버리지 0% → 96.63%**, brittle 소스-문자열 grep 테스트를 렌더/데이터 검증으로 대체.

## 2. 산출물

| 파일 | 내용 |
|------|------|
| `vitest.config.ts` | include `.test.{ts,tsx}`(**잠복버그 수정** — 기존엔 .tsx 테스트 조용히 무시), setupFiles, next/image alias, coverage 설정 |
| `src/test-setup.ts` | jest-dom 매처 + scrollIntoView 폴리필 |
| `src/test-mocks/next-image.tsx` | Next 전용 prop 필터링한 `<img>` mock |
| `src/components/QuoteForm.tsx` | `navigate` prop 주입 (유일한 프로덕션 변경, 동작 불변) |
| 렌더 테스트 5파일 | QuoteForm 6시나리오 + HomePage 6 + ServiceLandingPage 3 + ContactActions 2 + HtmlLangSync 2 |
| `src/site-quality.test.ts` | grep 12항목 매핑 적용 (렌더 대체·descope·데이터 검증화) |
| devDeps | jsdom·@testing-library/react·user-event·jest-dom (0 vulns) |

## 3. 검증 증거

| 게이트 | 결과 |
|--------|------|
| 테스트 | 57 → **71/71**, 3회 반복 결정적(비flaky) |
| Coverage | **components 96.63%** / 전체 80.32% lines (목표 80%) |
| lint / tsc | 무경고 / 0 errors |
| CI | quality PASS 28s · build-experiment PASS 30s (3연속 — 승격 근거 적립) |

## 4. 학습 (차기 사이클 참조)

1. **설계 시점 소스 스냅샷은 병행 작업으로 낡는다** — 세션 초기에 읽은 ContactActions가 동시 커밋(`9fdb064`)으로 변경되어 테스트 첫 실행 실패. 테스트는 현재 동작 기준으로 작성하고, Design 문서를 사후 동기화. **Do 착수 직전 대상 컴포넌트 재읽기**가 처방
2. **user-event는 자체 clipboard 스텁을 설치** — `vi.stubGlobal` 무효, 설치된 스텁에 `vi.spyOn`이 정답
3. **jsdom 미구현 API는 setup 폴리필로 일원화** — scrollIntoView (QuoteForm 포커스 이동)
4. **vitest include 패턴 감사** — `.test.ts`만 잡는 설정은 `.tsx` 테스트를 조용히 버린다. 신규 테스트 유형 도입 시 include부터 확인
5. **Next Metadata 유니언 타입**(`Twitter`)은 필드 직접 접근 거부 → `toMatchObject`로 검증

## 5. 후속 후보

| 항목 | 우선순위 | 비고 |
|------|---------|------|
| PR #17 merge | 즉시 (사용자) | merge = prod 자동 배포 (테스트 전용 + navigate prop 동작 불변이라 위험 낮음) |
| build 필수 게이트 승격 | Medium | build-experiment 3연속 PASS |
| mailto 본문 최적화 | Low | 코드 분석 M2 (Task #4) — navigate prop 도입으로 테스트 기반 마련됨 |
| HomePage.footer/mobile.test.ts grep 정리 | Low | 이번 범위 외 잔존 소스-grep 테스트 2파일 |

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-07-12 | 완료 보고서 — Match 95%, merge 대기 명기 | jhlim725 |
