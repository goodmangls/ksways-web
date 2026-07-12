# node24-build-fix Design Document

> **Summary**: mise 기반 Node 24 프로젝트-로컬 도입 → 결정적 2×2 검증 → ksways-web 버전 핀 + goodman-gls `|| true` 마스킹 제거의 조건부 실행 설계
>
> **Project**: ksways-web
> **Version**: 0.1.0
> **Author**: jhlim725
> **Date**: 2026-07-12
> **Status**: Draft
> **Planning Doc**: [node24-build-fix.plan.md](../../01-plan/features/node24-build-fix.plan.md)

---

## 1. Overview

### 1.1 Design Goals

1. **결정성**: "Node 버전이 원인"을 같은 커밋·같은 lockfile에서 22 fail / 24 pass로 증명 — 다른 변수(캐시, 의존성 드리프트) 배제
2. **격리성**: 전역 Node 22(hermes 관리)를 건드리지 않고 프로젝트 단위로만 24 적용 (사용자 결정: **mise 도입**, 2026-07-12)
3. **조건부 전파**: 검증 성공 시에만 설정 변경을 커밋 — 실패 경로가 명시된 단계별 게이트

### 1.2 Design Principles

- 환경/설정 사이클 — **애플리케이션 코드 변경 0줄** (설정 파일만: `.node-version`, `package.json` engines, goodman-gls `vercel.json`)
- 각 단계는 이전 단계 PASS가 전제조건 (아래 §2.2 게이트 순서)
- 모든 실행은 `mise exec`로 명시 호출 — 셸 활성화(hook) 의존 없이 재현 가능

---

## 2. Architecture

### 2.1 Component Diagram

```
┌──────────────────┐    brew install     ┌──────────────────┐
│  Homebrew        │ ──────────────────▶ │  mise            │
└──────────────────┘                     │  (~/.local/share/│
                                         │   mise/…/node/24)│
                                         └────────┬─────────┘
                              mise exec node@24 --│
              ┌───────────────────────┬───────────┴────────────┐
              ▼                       ▼                        ▼
   ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐
   │ ksways-web         │  │ goodman-gls        │  │ (전역 Node 22       │
   │ .node-version=24   │  │ vercel.json 마스킹  │  │  hermes — 불변)     │
   │ engines >=24       │  │ 제거 (조건부)        │  └────────────────────┘
   └────────────────────┘  └────────────────────┘
```

### 2.2 검증 게이트 순서 (Data Flow)

```
G0 베이스라인 재확인: Node 22 + ksways-web HEAD → build FAIL (이미 관측, 1회 재확인)
G1 mise 설치 + node@24 확보 → mise exec node@24 -- node --version = v24.x
G2 [핵심] ksways-web: mise exec node@24 -- npm ci && npm run build → exit 0
   └─ FAIL → ❌ 사이클 종료 (§6 Exit-A)
G3 ksways-web 전체 게이트: lint · tsc --noEmit · vitest run (Node 24) → 전부 GREEN
   └─ FAIL → 원인이 Node 24 비호환이면 §6 Exit-A, 개별 이슈면 기록 후 판단
G4 goodman-gls: mise exec node@24 -- npm ci && npm run build → exit 0
   └─ FAIL → ⚠️ §6 Exit-B (goodman-gls만 descope, ksways-web 적용은 진행)
G5 설정 커밋: ksways-web 핀 + goodman-gls 마스킹 제거 (각 repo 별도 PR)
G6 goodman-gls PR preview 배포 빌드 PASS 확인 → merge → prod Ready 확인
```

### 2.3 Dependencies

| Component | Depends On | Purpose |
|-----------|-----------|---------|
| G2~G4 검증 | G1 (mise + node@24) | 실행 런타임 |
| G5 ksways-web 커밋 | G2·G3 PASS | 핀 적용 근거 |
| G5 goodman-gls 커밋 | G4 PASS | 마스킹 제거 근거 |
| G6 merge | PR preview 빌드 PASS | prod 배포 안전 |

---

## 3. 변경 파일 명세 (Data Model 대체)

### 3.1 ksways-web (G5-a)

| 파일 | 변경 | 내용 |
|------|------|------|
| `.node-version` | 신규 | `24` (major 핀 — mise가 최신 24.x 해석, Vercel 24.x 설정과 정합) |
| `package.json` | 수정 | `engines.node`: `">=20.0.0"` → `">=24.0.0"` (경고 게이트 — engine-strict 미사용이므로 강제 아님) |
| `.commit_message.txt` | 갱신 | 한 줄 설명 (레포 규칙) |

### 3.2 goodman-gls (G5-b, G4 PASS 조건부)

| 파일 | 변경 | 내용 |
|------|------|------|
| `vercel.json` | 수정 | `"buildCommand": "next build \|\| true"` → `"next build"` (마스킹 제거, 실제 빌드 게이트 복원) |
| `.node-version` | 신규 | `24` (로컬 mise 정합) |
| `package.json` | 조건부 | engines 필드 존재 시 `>=24.0.0`로 정합화, 없으면 추가하지 않음 (변경 최소화) |
| `.commit_message.txt` | 갱신 | 한 줄 설명 |

### 3.3 로컬 환경 (커밋 대상 아님)

| 항목 | 내용 |
|------|------|
| mise 설치 | `brew install mise` — 셸 rc 자동 활성화(hook)는 **이 사이클에서 설정하지 않음** (`mise exec` 명시 호출만 사용, 사용자 셸 환경 불변) |
| node@24 | `mise install node@24` (mise 관리 경로에 격리 설치) |

---

## 4. 실행 커맨드 명세 (API Specification 대체)

```bash
# G0 베이스라인 (Node 22, 이미 관측된 실패 1회 재확인)
cd ~/Developer/Projects/ksways-web && npm run build   # expect: exit 1, /_global-error

# G1 mise + Node 24
brew install mise
mise install node@24
mise exec node@24 -- node --version                    # expect: v24.x.y

# G2 핵심 검증 (동일 커밋·동일 lockfile)
cd ~/Developer/Projects/ksways-web
mise exec node@24 -- npm ci
mise exec node@24 -- npm run build                     # expect: exit 0  ← 사이클 성패 분기점

# G3 회귀 게이트 (Node 24)
mise exec node@24 -- npm run lint
mise exec node@24 -- npx tsc --noEmit
mise exec node@24 -- npm run test:run                  # expect: 51/51

# G4 goodman-gls 검증
cd ~/Developer/Projects/goodman-gls
mise exec node@24 -- npm ci
mise exec node@24 -- npm run build                     # expect: exit 0

# G6 배포 확인 (merge 후)
vercel ls goodman-gls --scope goodman-ksways           # expect: 최신 Production Ready
```

**주의**: G2·G4의 `npm ci`는 Node 22의 `node_modules`를 덮어씀 — 검증 후 원상복구 불필요 (같은 lockfile이므로 산출물 동일, 네이티브 애드온 없음 확인됨).

---

## 5. UI/UX Design

N/A — 환경/설정 사이클.

---

## 6. Error Handling (Exit 조건)

| ID | 트리거 | 처리 |
|----|--------|------|
| **Exit-A** | G2 FAIL (Node 24로도 ksways-web 빌드 실패) | 사이클 즉시 종료. 커밋 0건. Analysis 문서에 실패 매트릭스 기록, "Next 16.3 stable 대기" 결론 복귀, 메모리 갱신 (split-cycle 원칙) |
| **Exit-B** | G4 FAIL (goodman-gls만 실패) | goodman-gls descope — 마스킹 유지, 실패 원인 1단락 기록. ksways-web G5-a는 정상 진행 (부분 성공) |
| **Exit-C** | G6 FAIL (preview 빌드 실패) | goodman-gls PR close, `vercel.json` 변경 revert. 로컬-Vercel 환경차 기록 |
| G1 실패 | brew/mise 설치 오류 | 네트워크/권한 문제 해결 시도 1회, 불가 시 사용자에게 보고 후 중단 |
| G3 부분 실패 | 특정 도구만 Node 24 비호환 | 해당 도구 이슈 기록. build+2개 이상 GREEN이면 진행 여부 사용자 확인 |

---

## 7. Security Considerations

- [x] mise는 Homebrew 공식 formula로 설치 (서드파티 tap 없음)
- [x] Node 24는 mise의 공식 node 플러그인(nodejs.org 릴리스) 사용
- [x] 신규 환경 변수·시크릿 없음
- [x] `vercel.json` 변경은 빌드 커맨드 복원뿐 — 배포 권한/도메인 무관

---

## 8. Test Plan

이 사이클은 **검증 자체가 구현**이므로 §2.2 게이트가 곧 테스트 케이스다.

| Type | Target | 판정 기준 |
|------|--------|----------|
| 베이스라인 | G0: Node 22 build | FAIL 재현 (`/_global-error` + useContext null) |
| 핵심 가설 | G2: Node 24 build | exit 0 + `.next` 산출물 생성 |
| 회귀 | G3: lint/tsc/vitest | 0 err / 0 err / 51 passed |
| 전파 | G4: goodman-gls build | exit 0 |
| 배포 | G6: Vercel preview→prod | 빌드 로그 PASS, 상태 Ready |
| 격리 | 전역 무영향 | `node --version` (mise exec 밖) = v22.22.3 유지 |

---

## 9. Clean Architecture

N/A — 소스 코드 레이어 변경 없음. 설정 파일 3종(§3)만 변경.

---

## 10. Coding Convention Reference

| Item | Convention Applied |
|------|-------------------|
| 커밋 메시지 | conventional commits + 이모지, `.commit_message.txt` 한 줄 기록 (양 repo) |
| 자동 커밋 금지 | G5 커밋 전 사용자에게 diff 요약 제시 후 진행 (전역 규칙) |
| PR 플로우 | repo별 별도 브랜치·별도 PR (`chore/node24-pin`, `chore/remove-build-masking`) — main 직접 push 금지 |

---

## 11. Implementation Guide

### 11.1 File Structure

```
ksways-web/
├── .node-version          # 신규: "24"
├── package.json           # engines.node >=24.0.0
└── docs/{01-plan,02-design,03-analysis}/…

goodman-gls/
├── .node-version          # 신규: "24"
└── vercel.json            # buildCommand: "next build" (|| true 제거)
```

### 11.2 Implementation Order

1. [ ] G0 베이스라인 재확인 (Node 22 FAIL)
2. [ ] G1 mise 설치 + node@24
3. [ ] G2 ksways-web Node 24 빌드 — **성패 분기점**
4. [ ] G3 ksways-web 회귀 게이트 3종
5. [ ] G4 goodman-gls Node 24 빌드
6. [ ] G5 설정 변경 + 브랜치/PR 생성 (repo별)
7. [ ] G6 preview 빌드 확인 → merge → prod Ready 확인

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-07-12 | Initial draft — mise 확정(사용자 선택), 게이트 G0~G6 + Exit-A/B/C 설계 | jhlim725 |
