# node24-build-fix Completion Report

> **Status**: Complete (검증 사이클 — 가설 반증으로 종결, Exit-A 설계 경로)
>
> **Project**: ksways-web
> **Version**: 0.1.0
> **Author**: jhlim725
> **Completion Date**: 2026-07-12
> **PDCA Cycle**: ksways-web #1

---

## 1. Summary

### 1.1 Project Overview

| Item | Content |
|------|---------|
| Feature | node24-build-fix |
| Start Date | 2026-07-12 |
| End Date | 2026-07-12 (당일 완결) |
| Duration | 단일 세션 (~30분) |
| 유형 | 환경/검증 사이클 — 코드 변경 0줄 |

### 1.2 Results Summary

```
┌──────────────────────────────────────────────────────────┐
│  가설 판정: ❌ REFUTED (Node 버전은 원인 아님)             │
│  실행 충실도: 100% (12/12 — Exit-A는 설계된 정상 경로)     │
├──────────────────────────────────────────────────────────┤
│  ✅ G0 Node 22 FAIL 재현     ✅ G1 mise+node@24.18.0      │
│  ❌ G2 Node 24도 동일 FAIL   ⏭️ G3~G6 설계대로 미실행      │
│  ✅ Exit-A 의무 5종 전부 이행 (커밋 0건·복원·문서화)        │
└──────────────────────────────────────────────────────────┘
```

**한 줄 결론**: macOS에서 이 스택(Next 16.2.x + React 19.2)의 `next build` 실패는 Node 22→24 업그레이드로 해결되지 않는다. goodman-gls 2026-05 결론("framework debt, Next 16.3 stable 대기")이 그대로 유효하며, 로컬 빌드 게이트는 Vercel preview 배포로 대체한다.

---

## 2. Related Documents

| Phase | Document | Status |
|-------|----------|--------|
| Plan | [node24-build-fix.plan.md](../01-plan/features/node24-build-fix.plan.md) | ✅ Finalized |
| Design | [node24-build-fix.design.md](../02-design/features/node24-build-fix.design.md) | ✅ Finalized (G0~G6 + Exit-A/B/C) |
| Check | [node24-build-fix.analysis.md](../03-analysis/node24-build-fix.analysis.md) | ✅ Complete (충실도 100%) |
| Act | 본 문서 | ✅ |
| 전례 | goodman-gls `docs/archive/2026-05/goodman-gls-prerender-debt/` | 참조 (동일 마감 유형) |

---

## 3. Completed Items

### 3.1 Functional Requirements

| ID | Requirement | Status | Notes |
|----|-------------|--------|-------|
| FR-01 | 로컬 Node 24 확보 (mise, 사용자 선택) | ✅ Complete | brew mise + node@24.18.0, 셸 비활성(`mise exec` 전용) |
| FR-02 | 결정적 검증 (22 fail / 24 pass) | ✅ 실행 / ❌ 가설 반증 | 동일 커밋 `3b61cb4`·동일 lockfile에서 22·24 동일 실패 |
| FR-03 | ksways-web engines/.node-version 핀 | ⏭️ N/A | Exit-A — 근거 소멸로 미적용 (설계된 조건부) |
| FR-04 | goodman-gls Node 24 검증 | ⏭️ N/A | Exit-A로 미실행 |
| FR-05 | goodman-gls 마스킹 제거 | ⏭️ N/A → 후속 후보로 이관 | PR preview 게이트 방식으로 재설계 (§8.2) |

### 3.2 Non-Functional Requirements

| Item | Target | Achieved | Status |
|------|--------|----------|--------|
| 환경 격리 | 전역 Node 22 무영향 | `node --version`=v22.22.3 유지, zshrc 무변경 | ✅ |
| 회귀 안전 | 기존 게이트 유지 | lint 0·tsc 0·vitest 51/51 (Node 22, /check 시점) + node_modules 복원 | ✅ |
| 커밋 위생 | 검증 실패 시 0건 | tracked 변경 0 (PDCA 문서만 untracked) | ✅ |

### 3.3 Deliverables

| Deliverable | Location | Status |
|-------------|----------|--------|
| PDCA 문서 4종 | docs/01-plan·02-design·03-analysis·04-report | ✅ |
| 실패 매트릭스 (digest 포함) | analysis §2 | ✅ |
| mise + node@24 런타임 | 로컬 환경 (재사용 가능 자산) | ✅ |
| 메모리 정정 | `project_ksways_web_setup.md` (가설 반증 반영) | ✅ |

---

## 4. Incomplete Items

### 4.1 Carried Over (후속 사이클 후보)

| Item | Reason | Priority | Estimated Effort |
|------|--------|----------|------------------|
| **goodman-gls-masking-removal** | 로컬 검증 불가하나 Vercel 자체는 통과(ksways-web이 증거) → PR preview 빌드를 게이트로 재설계 | High | ~1h |
| **linux-build-verification** | Docker 데몬 다운으로 darwin/linux 변수 미확정 | Medium | ~30min (데몬 기동 필요) |
| Next 16.3 stable 추적 → 로컬 빌드 재시도 | 현재 16.3.0-preview.5 | Medium | 출시 대기 |

### 4.2 Cancelled Items

| Item | Reason | Alternative |
|------|--------|-------------|
| FR-03~05 (설정 커밋 일체) | 가설 반증 — 적용 근거 소멸 | 로컬 빌드 게이트 = Vercel preview로 대체 |

---

## 5. Quality Metrics

| Metric | Target | Final | 비고 |
|--------|--------|-------|------|
| Design Match Rate (실행 충실도) | 90% | **100%** | Exit-A 포함 12/12 |
| 코드 변경 | 0줄 목표 (검증 사이클) | 0줄 | ✅ |
| 신규 진단 정보 | — | env-민감성 발견 (`VERCEL=1` 시 실패 지점 변화, digest 2216620448→2376153931) | 전례 매트릭스에 없던 데이터 |

---

## 6. Lessons Learned & Retrospective

### 6.1 What Went Well (Keep)

- **Exit 조건을 설계에 내장** — G2 실패 시 즉시 종료가 사전에 정의돼 있어 rabbit-hole 없이 30분 내 반증 완결. 커밋 0건으로 청결 종료.
- **`mise exec` 명시 호출 설계** — 셸 활성화 없이 검증해 사용자 환경 완전 불변. 검증 실패에도 잔존 리스크 0.
- **전례 문서 활용** — goodman-gls 6-build 매트릭스를 읽고 시작해 중복 진단(React 다운그레이드, canary 시도 등)을 건너뜀.

### 6.2 What Needs Improvement (Problem)

- **가설 수립 시 교란 변수 누락**: "Vercel Node 24 = 통과"에서 Node 버전만 변수로 세웠으나 플랫폼(linux/darwin)·빌드 러너가 공존 변수였음. Plan 단계에서 변수 매트릭스를 명시했다면 가설 신뢰도를 더 낮게 잡았을 것.
- **Vercel 빌드 로그 미확보**: `vercel inspect --logs`가 빈 출력 — 실제 Vercel 빌드의 Next 출력(어느 라우트가 prerender되는지)을 확인했다면 가설을 사전에 기각했을 수도 있음.

### 6.3 What to Try Next (Try)

- 환경-차이 가설은 **변수 분해표**(runtime / platform / env vars / 빌드 러너)를 Plan에 포함하고, 가장 싼 변수부터 검증.
- Docker 기반 linux 재현을 진단 표준 도구로 (데몬 상시 기동 여부는 사용자 결정).

---

## 7. Process Improvement Suggestions

| Phase | Current | Improvement Suggestion |
|-------|---------|------------------------|
| Plan | 가설 단일 변수 프레임 | 환경 이슈는 변수 분해표 필수 |
| Check | gap-detector 서브에이전트 | 세션-로컬 증거 사이클은 직접 분석이 정확 (이번에 적용, 유지) |

---

## 8. Next Steps

### 8.1 Immediate

- [ ] PDCA 문서 4종 + `.bkit-memory.json` 커밋 여부 결정 (사용자)
- [ ] `/pdca archive node24-build-fix`

### 8.2 Next PDCA Cycle 후보

| Item | Priority | 비고 |
|------|----------|------|
| goodman-gls-masking-removal | High | PR preview 빌드 게이트, 로컬 빌드 불요 |
| linux-build-verification | Medium | Docker 데몬 기동 전제 |

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-07-12 | Completion report — 가설 반증 종결, 후속 2건 이관 | jhlim725 |
