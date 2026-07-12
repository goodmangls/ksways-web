# node24-build-fix Planning Document

> **Summary**: 로컬 Node 22 → 24 업그레이드로 Next 16 `/_global-error` prerender 빌드 실패를 해소하고, ksways-web 로컬 빌드 게이트 복원 + goodman-gls `|| true` 마스킹 제거까지 연계
>
> **Project**: ksways-web
> **Version**: 0.1.0
> **Author**: jhlim725
> **Date**: 2026-07-12
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

로컬 환경(Node 22)에서 `npm run build`가 `/_global-error` prerender 단계에서 `TypeError: Cannot read properties of null (reading 'useContext')`로 실패한다. 이 사이클의 목적은:

1. **가설 검증**: "이 버그는 Node 22에서만 발생하고 Node 24에서는 해소된다"를 결정적으로 확인
2. **로컬 빌드 게이트 복원**: ksways-web에서 `next build` exit 0
3. **연계 정리**: 검증 성공 시 goodman-gls의 `vercel.json` `|| true` 마스킹 제거 (실제 빌드 게이트 복원)

### 1.2 Background

- **동일 시그니처 전례**: goodman-gls에서 2026-05-29 6-build 매트릭스(Next 16.2.4/16.2.6/16.3-canary × React 19.2/19.1)로 application-level 해결 불가 확정 → `vercel.json`에 `next build || true` 마스킹, "Next 16.3 stable 대기" 결론 (`goodman-gls/docs/archive/2026-05/goodman-gls-prerender-debt/`)
- **2026-07-12 신규 발견**: ksways-web Vercel 프로젝트(스코프 `goodman-ksways`)는 **Node 24.x + 마스킹 없는 `npm run build`로 배포 전부 Ready**. 로컬(Node 22.22.3)만 실패 → 당시 매트릭스에 없던 변수 = **Node 런타임 버전**
- goodman-gls Vercel 프로젝트도 동일 스코프에서 Node 24.x 설정 확인됨 (2026-07-12)
- 로컬 Node 현황: `~/.local/bin/node` → `~/.hermes/node` v22.22.3 (hermes 관리) + `/usr/local/bin/node` v22.13.1. 버전 매니저(nvm/fnm/mise) 없음

### 1.3 Related Documents

- 전례 분석: `goodman-gls/docs/archive/2026-05/goodman-gls-prerender-debt/goodman-gls-prerender-debt.report.md`
- 메모리: `project_ksways_web_setup.md`, `project_goodman_gls_build_prerender_debt_candidate.md`

---

## 2. Scope

### 2.1 In Scope

- [ ] 로컬 Node 24 확보 (방식은 §3.1 FR-01 옵션 중 사용자 결정)
- [ ] **결정적 검증**: 동일 커밋·동일 lockfile에서 Node 22 fail / Node 24 pass 재현 (ksways-web)
- [ ] ksways-web 기존 게이트 회귀 0 확인 (lint · tsc · vitest 51 · build)
- [ ] ksways-web Node 버전 명시: `package.json` engines 상향 + `.node-version` 추가 (Vercel 24.x와 정합)
- [ ] goodman-gls Node 24 빌드 검증 → 통과 시 `vercel.json` `|| true` 마스킹 제거 + 배포 Ready 확인

### 2.2 Out of Scope

- Next.js 16.3 업그레이드 (아직 preview — stable 출시 후 별도 사이클)
- goodman-gls 외 다른 repo(ASCA 등)의 Node 24 롤아웃 — 검증 결과만 기록, 적용은 별도
- Vercel 17s 빌드가 full build인지 캐시인지 포렌식 — 마스킹 제거 후 배포 Ready면 충분
- hermes 툴체인 자체의 개선/교체

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | 로컬 Node 24 확보. 옵션: (a) mise/fnm 도입 후 프로젝트별 24 지정 — 전역 영향 없음(권장), (b) 스탠드얼론 tarball을 프로젝트 외부 경로에 설치, (c) hermes 전역 업그레이드 — 타 프로젝트 영향 검토 필요. **사용자 승인 필수** (2026-07-12 스탠드얼론 다운로드 1회 거부 이력) | High | Pending |
| FR-02 | ksways-web 결정적 검증: 같은 커밋에서 Node 22 `next build` fail + Node 24 `next build` exit 0. 실패 시 §5 Exit 조건 발동 | High | Pending |
| FR-03 | ksways-web `package.json` engines `>=20.0.0` → `>=24.0.0` 상향 + `.node-version`(24) 추가 | Medium | Pending |
| FR-04 | goodman-gls에서 Node 24 `next build` exit 0 검증 | High | Pending |
| FR-05 | (FR-04 통과 조건부) goodman-gls `vercel.json` `"next build \|\| true"` → `"next build"` 복원, push 후 Vercel 배포 Ready 확인 | High | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| 회귀 안전 | ksways-web lint 0 · tsc 0 · vitest 51/51 유지 | 각 게이트 Node 24에서 재실행 |
| 환경 격리 | 기존 Node 22 의존 프로젝트 무영향 | 전역 `node --version` 변경 여부 확인 (옵션 a/b면 불변) |
| 배포 안전 | goodman-gls 마스킹 제거 후 prod 배포 Ready | `vercel ls` 상태 확인 (Vercel Node 24.x 기설정 확인됨) |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] Node 24에서 ksways-web `npm run build` exit 0 (로컬)
- [ ] ksways-web 4개 게이트(lint/tsc/test/build) 전부 GREEN
- [ ] ksways-web engines + `.node-version` 커밋 (PR)
- [ ] goodman-gls 마스킹 제거 커밋 (PR) + Vercel 배포 Ready
- [ ] 검증 결과(성공/실패 무관)를 메모리 및 goodman-gls debt 문서 후속 노트에 기록

### 4.2 Quality Criteria

- [ ] Zero lint errors (기존 유지)
- [ ] Build succeeds — 이 사이클의 핵심 지표
- [ ] 테스트 51/51 유지 (커버리지 신규 요구 없음 — 코드 로직 변경 없는 환경/설정 사이클)

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Node 24로도 로컬 빌드 실패 (Vercel 통과가 다른 요인일 가능성) | High | Medium | FR-02를 최우선 실행. 실패 시 **즉시 사이클 종료**(split-cycle 원칙) — 마스킹 유지, "Next 16.3 stable 대기" 결론 복귀, 결과만 문서화 |
| hermes 전역 Node 교체 시 타 프로젝트(ASCA 등 engines >=20) 빌드 영향 | Medium | Medium | 옵션 (a) mise/fnm 프로젝트-로컬 방식 우선 권장. 전역 교체는 사용자 명시 승인 시만 |
| goodman-gls 마스킹 제거 후 Vercel 빌드 실패 → prod 배포 차단 | High | Low | Vercel Node 24.x 기설정 확인됨. PR preview 배포에서 빌드 통과 확인 후 merge |
| Node 24와 기존 devDeps 비호환 (vitest/eslint 등) | Low | Low | FR-02 검증 시 4개 게이트 전부 실행해 조기 발견 |
| 사용자 승인 지연으로 사이클 정체 | Low | Medium | FR-01 옵션 결정만 사용자 입력 필요 — Design 단계에서 1회 질문으로 확정 |

---

## 6. Architecture Considerations

환경/인프라 사이클로 애플리케이션 아키텍처 변경 없음.

| Decision | Options | Selected | Rationale |
|----------|---------|----------|-----------|
| Node 버전 관리 | mise / fnm / 스탠드얼론 / hermes 전역 | Design에서 확정 | 전역 영향 최소화 vs 관리 단순성 트레이드오프, 사용자 승인 필요 |
| 버전 핀 방식 | engines only / .node-version / .nvmrc | engines + .node-version | Vercel·로컬 매니저 양쪽 인식, nvm 미사용 환경 |

---

## 7. Convention Prerequisites

- [x] ESLint 설정 존재 (`eslint.config.mjs`)
- [x] TypeScript 설정 존재 (`tsconfig.json`)
- [ ] `CLAUDE.md` 없음 — 이 사이클 범위 아님
- 환경 변수 신규 필요 없음

---

## 8. Next Steps

1. [ ] Design 문서 작성 (`/pdca design node24-build-fix`) — FR-01 옵션 확정(사용자 1회 질문) + 검증 시퀀스 상세화
2. [ ] Do: 검증 → 조건부 적용
3. [ ] Analyze: Gap 분석

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-07-12 | Initial draft — Node 24 가설 검증 + 2-repo 연계 정리 계획 | jhlim725 |
