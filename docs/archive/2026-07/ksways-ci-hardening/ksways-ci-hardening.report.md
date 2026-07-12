# ksways-ci-hardening Completion Report

> **Feature**: ksways-ci-hardening
> **Project**: ksways-web 0.1.0
> **Date**: 2026-07-12 (단일 세션 사이클)
> **Match Rate**: **100%** (iterate 0회)
> **PR**: [#14](https://github.com/goodmangls/ksways-web/pull/14) — 커밋 `2f7c4d0`(구현) + `1335cb9`(dev CSP 분기)
> **Status**: 구현·검증 완료, **merge 대기** (merge = prod 자동 배포)

---

## 1. 사이클 개요

2026-07-12 전체 코드 분석(종합 8.2/10)에서 확인된 HIGH 2건을 한 사이클로 해소:

1. **CI 게이트 부재** → GitHub Actions `quality` job (eslint·tsc·vitest, Node 24) — 이 repo 최초의 자동 회귀 게이트
2. **CSP 미설정** → Intercom 공식 도메인 + Unsplash 허용 enforce CSP + 회귀 테스트

부수 성과: **build-experiment job(non-blocking)이 2회 연속 PASS** — node24-build-fix 사이클(Exit-A archived)이 남긴 잔여 변수(darwin/linux)를 해소. 로컬 `next build` 실패는 **macOS 한정**으로 확정.

## 2. 산출물

| 파일 | 내용 |
|------|------|
| `.github/workflows/ci.yml` | quality(필수) + build-experiment(실험) 2-job |
| `package.json` | `type-check` 스크립트 |
| `next.config.ts` | `buildContentSecurityPolicy(isDev)` — prod 엄격/dev 완화(`'unsafe-eval'`·`ws:`) |
| `src/site-quality.test.ts` | CSP 회귀 테스트 (prod `unsafe-eval` 부재 포함, 51→52) |
| PDCA 문서 4종 | plan / design / analysis / report |

## 3. 검증 증거

| 게이트 | 결과 |
|--------|------|
| CI quality | 2회 연속 GREEN (33s → 26s) |
| CI build-experiment | 2회 연속 PASS (linux 변수 해소) |
| 로컬 | lint 0 errors · tsc 0 · vitest 52/52 |
| CSP 헤더 서빙 | 로컬 dev 5라우트 전부 확인, violation 0 |
| Intercom 무회귀 | CSP 헤더 스트립 대조실험으로 CSP 무관 판정 + prod 기준선 정상 부팅 + prod origin 감사 notAllowed 0 |

## 4. 구현 중 발견 사항 (설계 대비 Changed 2건, 모두 정당)

1. **dev CSP 완화 필요**: `'unsafe-eval'` 없이 `next dev`에서 react-refresh가 hydration을 붕괴시킴(직접 재현). 순수 함수 분기로 해결, 프로덕션 정책 불변. vitest가 NODE_ENV=development를 상속하는 함정도 함께 발견 — 순수 함수 테스트로 결정화.
2. **Vercel preview는 Authentication 보호**: 익명 headless 접근 시 로그인 인터스티셜만 노출(스크린샷 증거). qa-capture가 12/12 status 200을 반환하면서도 실제로는 로그인 페이지를 캡처 — **"200 OK ≠ 우리 앱"**. JSON-LD 0·미지의 GSI 경고가 판별 신호였음. preview 검증은 로컬 dev + prod origin 감사로 대체.

## 5. 학습 (차기 사이클 참조)

- **preview 스모크는 콘텐츠 지문 필수**: status 코드만 믿지 말고 JSON-LD 수·타이틀 같은 앱 고유 지문으로 "우리 앱인지"를 먼저 판별
- **CSP 도입 시 dev 번들러 요구사항(eval, ws HMR)을 처음부터 분기 설계**에 포함할 것
- **vitest는 NODE_ENV=development를 상속** — 환경 분기 설정값은 순수 함수로 추출해 테스트
- **대조실험(헤더 스트립)이 인과 판정에 결정적** — "CSP 켰더니 X가 안 됨"은 CSP 끄고 재현해야 결론 가능

## 6. 후속 후보

| 항목 | 우선순위 | 비고 |
|------|---------|------|
| PR #14 merge + prod CSP 스팟체크 + 실브라우저 Intercom 런처 확인 | 즉시 (사용자) | merge = prod 자동 배포 |
| branch protection: `quality` required check 지정 | High (수동 1분) | GitHub Settings |
| build를 CI 필수 게이트로 승격 | Medium | 2회 연속 PASS 근거 확보됨 |
| 컴포넌트 렌더 테스트 + 소스-문자열 테스트 대체 | Medium | 코드 분석 M1 (Task #3) |
| mailto 본문 최적화 | Low | 코드 분석 M2 (Task #4) |

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-07-12 | 완료 보고서 — Match 100%, merge 대기 상태 명기 | jhlim725 |
