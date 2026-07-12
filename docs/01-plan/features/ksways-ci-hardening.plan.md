# ksways-ci-hardening Planning Document

> **Summary**: 코드 분석(2026-07-12)에서 확인된 HIGH 2건 해소 — GitHub Actions CI 게이트(lint·tsc·vitest) 신설 + Content-Security-Policy 헤더 도입. CI ubuntu 환경을 활용해 잔여 변수였던 linux `next build` 검증도 실험적으로 겸행
>
> **Project**: ksways-web
> **Version**: 0.1.0
> **Author**: jhlim725
> **Date**: 2026-07-12
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

1. **CI 게이트 신설**: `.github/workflows/`가 없어 lint·type-check·test가 로컬 수동 실행에만 의존 → push/PR 시 자동 회귀 게이트 확보
2. **CSP 도입**: `next.config.ts`에 보안 헤더 5종(HSTS·nosniff·Referrer-Policy·Permissions-Policy·X-Frame-Options)은 있으나 Content-Security-Policy 부재 → Intercom(서드파티 스크립트 주입)·Unsplash 이미지를 허용하는 프로덕션 CSP 구성
3. **(부수 실험) linux build 검증**: node24-build-fix 사이클(archived, Exit-A)의 잔여 변수 = darwin/linux. CI가 ubuntu이므로 `next build` 스텝을 non-blocking으로 넣어 이 변수를 무비용 검증

### 1.2 Background

- **코드 분석 결과(2026-07-12, 이 세션)**: 종합 8.2/10, HIGH 2건이 모두 이 사이클 범위 (Task #1 CI, Task #2 CSP)
- **로컬 빌드 현황**: 로컬 macOS에서 `next build`가 `/_global-error` prerender에서 실패 — Node 22·24 동일(가설 반증, digest 2216620448). 빌드 게이트는 Vercel preview로 대체 중. **Vercel(linux·Node 24)은 전 배포 Ready** → CI ubuntu에서 build가 통과할 개연성 높음
- **Intercom**: `layout.tsx`에 위젯 로더 인라인 스크립트 존재(app_id `k5z51xs2` 폴백). CSP 도입 시 Intercom 공식 CSP 도메인 허용 필수
- **검증 제약**: Intercom 런처 iframe은 headless에서 안 뜸 — CSS/렌더 검증은 실브라우저, boot는 `window.intercomSettings`로 확인 (기존 학습)

### 1.3 Related Documents

- 코드 분석: 이 세션 보고서 (HIGH H1·H2, Task #1·#2)
- 전례: `docs/archive/2026-07/node24-build-fix/` (build 게이트 대체 경위, linux 변수 미검증)
- 메모리: `project_ksways_web_setup.md`, `reference_intercom_headless_no_launcher.md`

---

## 2. Scope

### 2.1 In Scope

- [ ] GitHub Actions CI 워크플로우 신설: push/PR(main) 시 `eslint` + `tsc --noEmit` + `vitest run` (필수 게이트, Node 24)
- [ ] CI에 `next build` 스텝 추가 — **non-blocking**(실험): 통과 시 차기 사이클에서 필수 게이트 승격 검토, 실패 시 결과만 기록
- [ ] `next.config.ts`에 Content-Security-Policy 헤더 추가 (Intercom + Unsplash + Next.js 요구사항 반영)
- [ ] `site-quality.test.ts` 보안 헤더 테스트에 CSP 존재·핵심 지시어 검증 추가
- [ ] Vercel preview에서 CSP 적용 후 회귀 검증: Intercom boot(`window.intercomSettings`)·히어로 이미지·콘솔 CSP violation 0

### 2.2 Out of Scope

- 컴포넌트 렌더 테스트 도입 (Task #3 — 별도 사이클)
- mailto 본문 최적화 (Task #4 — 별도 사이클)
- `/api/unsplash` rate limiting (MEDIUM M3 — upstream 정규화·데이터 캐시로 완화 확인됨, 별도 후보)
- 로컬 macOS build 실패 자체의 해결 (Next 16.3 stable 대기 — 기존 결론 유지)
- CSP 위반 리포트 수집 인프라(report-uri/report-to 엔드포인트) — 도입 여부만 Design에서 결정, 수집 서버 구축은 범위 외

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | `.github/workflows/ci.yml` 신설: push/PR(main) 트리거, Node 24 + `npm ci`, 필수 3게이트 `eslint`·`tsc --noEmit`·`vitest run` | High | Pending |
| FR-02 | 동일 워크플로우에 `next build` 스텝을 non-blocking(`continue-on-error` 또는 별도 job)으로 추가 — linux 변수 검증 겸용 | Medium | Pending |
| FR-03 | CSP 헤더 추가: `default-src 'self'` 기반, Intercom(script/connect/frame/img/media)·`images.unsplash.com`(img)·Next.js 인라인 요구사항 반영. script-src 전략(nonce via `proxy.ts` vs `'unsafe-inline'`)은 Design에서 확정 | High | Pending |
| FR-04 | `site-quality.test.ts`에 CSP 헤더 존재 + 핵심 지시어(`default-src`, Intercom·Unsplash 허용) 회귀 테스트 추가 | High | Pending |
| FR-05 | Vercel preview 실검증: CSP 응답 헤더 확인, 콘솔 CSP violation 0, Intercom boot·Unsplash 이미지 렌더 정상 | High | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| 회귀 안전 | lint 0 · tsc 0 · vitest 51/51+ 유지 | CI 및 로컬 재실행 |
| 보안 | CSP가 XSS 완화에 실효적 (`object-src 'none'`, `base-uri 'self'` 포함) | 헤더 검사 + 테스트 |
| 기능 무회귀 | Intercom·히어로 슬라이드쇼·mailto CTA 정상 | Vercel preview 실브라우저 확인 |
| CI 비용 | 필수 게이트 job 5분 이내 | Actions 실행 시간 |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] main 대상 PR에서 CI 3게이트(lint/tsc/test) 자동 실행 + GREEN
- [ ] CSP 헤더가 프로덕션 응답에 존재하고 테스트로 고정됨
- [ ] Vercel preview에서 CSP violation 0 + Intercom·이미지 회귀 0
- [ ] build 스텝(linux) 결과가 성공/실패 무관하게 기록됨 (성공 시 차기 승격 후보 메모)
- [ ] PR merge + 배포 Ready

### 4.2 Quality Criteria

- [ ] Zero lint errors (기존 유지)
- [ ] 테스트 전체 통과 (FR-04 추가분 포함)
- [ ] Build: Vercel preview 기준 succeeds (로컬 macOS build는 게이트 아님 — 기존 결론)

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| CSP가 Intercom 부팅/위젯을 차단 | High | Medium | Intercom 공식 CSP 도메인 목록 적용, preview에서 실브라우저 검증 후 merge. 필요 시 `Content-Security-Policy-Report-Only`로 1단계 선행 배포 |
| Next.js 인라인 스크립트가 strict CSP와 충돌 | High | Medium | Design에서 nonce(`proxy.ts` 활용) vs `'unsafe-inline'` 트레이드오프 확정 — 1차는 실용적 수준, strict-nonce는 후속 강화 |
| framer-motion 인라인 style로 style-src 위반 | Medium | High | `style-src 'self' 'unsafe-inline'` 허용 (인라인 style 속성은 현실적 필수) |
| CI build 스텝이 linux에서도 실패 | Low | Low | non-blocking이므로 게이트 영향 0 — 결과만 기록하고 "Next 16.3 대기" 결론 유지 |
| CI Node 버전과 로컬(22)·Vercel(24) 불일치로 혼선 | Low | Medium | CI는 Vercel과 동일한 24로 고정, 필수 3게이트는 로컬 22에서도 통과 확인됨 |
| Preview 환경에서만 통과하고 prod 헤더 누락 | Medium | Low | `next.config.ts` headers()는 환경 무관 동일 적용 — prod 배포 후 1회 스팟체크 |

---

## 6. Architecture Considerations

앱 코드 로직 변경 없음 — 인프라(CI)·설정(next.config.ts)·테스트만 변경.

| Decision | Options | Selected | Rationale |
|----------|---------|----------|-----------|
| CI 플랫폼 | GitHub Actions / 기타 | GitHub Actions | repo가 GitHub, 표준 |
| CI Node | 20 / 22 / 24 | 24 | Vercel 런타임(24.x)과 정합 |
| build 스텝 처리 | 필수 / non-blocking / 제외 | non-blocking | linux 변수 무비용 검증 + 게이트 오염 방지 |
| CSP script-src | nonce / 'unsafe-inline' / 해시 | Design에서 확정 | proxy.ts로 nonce 가능하나 Intercom 로더 등 복잡도 대비 효과 검토 필요 |
| CSP 롤아웃 | 즉시 enforce / Report-Only 선행 | Design에서 확정 | violation 수집 엔드포인트 부재 시 Report-Only 실익 제한적 |

---

## 7. Convention Prerequisites

- [x] ESLint 설정 존재 (`eslint.config.mjs`)
- [x] TypeScript 설정 존재 (`tsconfig.json`)
- [x] 기존 보안 헤더 테스트 패턴 존재 (`site-quality.test.ts` — FR-04는 이 패턴 확장)
- 신규 환경 변수 없음 (CSP는 정적 설정)

---

## 8. Next Steps

1. [ ] Design 문서 작성 (`/pdca design ksways-ci-hardening`) — CSP 지시어 전문 확정(Intercom 도메인 목록 조사 포함), ci.yml 구조, script-src 전략 결정
2. [ ] Do: CI → CSP → 테스트 → preview 검증
3. [ ] Analyze: Gap 분석

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-07-12 | Initial draft — 코드 분석 HIGH 2건(CI·CSP) + linux build 실험 계획 | jhlim725 |
