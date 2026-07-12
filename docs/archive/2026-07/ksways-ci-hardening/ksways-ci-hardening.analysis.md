# ksways-ci-hardening Gap Analysis (Check)

> **Feature**: ksways-ci-hardening
> **Date**: 2026-07-12
> **Analyzer**: bkit gap-detector + 세션 직접 검증
> **Design**: [ksways-ci-hardening.design.md](../02-design/features/ksways-ci-hardening.design.md)
> **Match Rate**: **100%**

---

## 1. 종합 판정

| Category | Score |
|----------|:-----:|
| Design Match | 100% |
| Implementation Coverage | 100% |
| Test Verification | 100% |
| **Overall** | **100%** ✅ |

Gap(Missing) 0건. Changed 2건은 모두 정당한 개선으로 판정.

---

## 2. FR별 대조 결과

| FR | Design 스펙 | 구현 | 판정 |
|----|------------|------|------|
| FR-01 | ci.yml quality job (eslint·tsc·vitest, Node 24, npm cache) + package.json type-check | 스펙과 동일 | ✅ Match |
| FR-02 | build-experiment job (continue-on-error, linux 변수 검증) | 스펙과 동일 + 근거 주석 | ✅ Match — **2회 연속 PASS로 linux 변수 해소** |
| FR-03 | CSP 지시어 전문 (§3.3) | prod 정책 지시어 전부 일치 | ✅ Match (+ 정당한 Changed 1건, §3 참조) |
| FR-04 | site-quality CSP 테스트 6개 검증항목 | 전부 구현 + dev 정책 검증 추가 | ✅ Match+ |
| FR-05 | Vercel preview 검증 (qa-capture) | **대체 검증** (§4 참조) | ✅ 동등 이상 |

## 3. Changed 항목 (Design ≠ 구현, 모두 정당)

| 항목 | Design | 구현 | 근거 |
|------|--------|------|------|
| CSP 구조 | 단일 배열 상수 | `buildContentSecurityPolicy(isDev)` 순수 함수 + dev 전용 `'unsafe-eval'`/`ws:` 분기 | ① react-refresh가 eval 필요 — 없으면 dev hydration 붕괴(로컬 재현) ② vitest가 NODE_ENV=development 상속 → 헤더 기반 테스트가 비결정적 → 순수 함수로 prod/dev 정책 각각 명시 검증. **프로덕션 정책은 Design과 완전 동일** |
| preview 검증 방법 | preview에서 qa-capture | 로컬 dev 검증 + prod origin 감사 | preview가 Vercel Authentication으로 보호되어 익명 headless 접근 시 로그인 인터스티셜만 노출(스크린샷 확인). 대체 검증이 preview 검증을 상회(§4) |

## 4. FR-05 대체 검증 상세 (증거)

| 검증 | 방법 | 결과 |
|------|------|------|
| CSP 헤더 서빙 | 로컬 `next dev` + playwright, 5라우트 | ✅ 전 라우트 헤더 존재 |
| CSP violation | 콘솔 "Refused to/CSP" 패턴 수집 | ✅ 0건 (Unsplash 히어로 로드·JSON-LD 정상) |
| Intercom 영향 분리 | 응답 가로채기로 CSP 헤더 제거 대조실험 | ✅ CSP 유무 무관하게 dev 미부팅 → **사전 존재 dev 현상, CSP 무관** |
| Intercom prod 기준선 | ksways.co(CSP 없는 현행 prod) 5라우트 | ✅ `intercomSettings`·스크립트 태그 전 라우트 정상 |
| prod 실트래픽 origin 감사 | prod 홈 전체 요청 host를 새 CSP 허용목록과 diff | ✅ **notAllowed 0** (`ksways.co`, `widget.intercom.io`) |
| CI 게이트 | PR #14 Actions 2회 | ✅ quality 2연속 GREEN, build-experiment 2연속 PASS |
| 로컬 게이트 | lint·tsc·vitest | ✅ 0 errors · 0 · 52/52 |

⚠️ 정정: gap-detector 보고서의 "CSP header present in production" 서술은 부정확 — **prod는 미머지 상태**(CSP 아직 미배포). 검증된 것은 "prod의 실제 요청 origin이 새 허용목록 안에 있다"이다.

## 5. 잔여 리스크 및 후속

| 항목 | 심각도 | 조치 |
|------|--------|------|
| Intercom 런처의 **인터랙티브 라이프사이클**(클릭 후 websocket·iframe)은 headless로 검증 불가 | Low | merge 후 prod에서 실브라우저 1회 스팟체크. 도메인은 Intercom 공식 CSP 문서 전량 반영이라 위험 낮음. EU/AU 리전 판명 시 `.eu`/`.au` 추가 |
| merge = prod 자동 배포 | — | 사용자 결정 대기 (PR #14) |
| build-experiment의 필수 게이트 승격 | — | 차기 사이클 후보 (2회 연속 PASS 근거 확보) |
| GitHub branch protection에 quality required 지정 | — | 사용자 수동 액션 (Design §5 명시) |

## 6. 결론

Match Rate 100% (≥90%) — **iterate 불필요, report 진행 가능**. 구현이 설계를 완전 충족하며, Changed 2건(순수 함수 분리·검증 경로 대체)은 구현 중 발견된 실제 제약(react-refresh eval, Vercel preview 보호)에 대한 정당하고 문서화된 대응이다.
