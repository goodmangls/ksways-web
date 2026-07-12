# node24-build-fix Analysis Report

> **Analysis Type**: Gap Analysis (검증 사이클 — 설계 대비 실행 충실도 + 가설 판정)
>
> **Project**: ksways-web
> **Version**: 0.1.0
> **Analyst**: jhlim725
> **Date**: 2026-07-12
> **Design Doc**: [node24-build-fix.design.md](../02-design/features/node24-build-fix.design.md)

---

## 1. Analysis Overview

### 1.1 Analysis Purpose

Design의 게이트 G0~G6 + Exit 조건 대비 실제 실행 결과를 검증하고, 핵심 가설("`/_global-error` prerender 빌드 실패는 Node 22 한정, Node 24에서 해소")의 판정을 공식 기록한다.

### 1.2 Analysis Scope

- **Design Document**: `docs/02-design/features/node24-build-fix.design.md`
- **Implementation**: 코드 산출물 없음 — 검증 게이트 실행 로그가 곧 구현 (2026-07-12 세션)
- **판정 방식**: gap-detector 서브에이전트 미사용 — 비교 대상이 세션-로컬 실행 증거이므로 세션 당사자가 직접 분석 (서브에이전트는 게이트 출력에 접근 불가)

---

## 2. 가설 판정 (핵심 결과)

### ❌ 가설 반증 (REFUTED)

| 실행 | 런타임 | 결과 | 오류 시그니처 |
|------|--------|------|---------------|
| G0 | Node **22.22.3** (hermes) | ❌ FAIL | `/_global-error` prerender, `useContext` null, digest `2216620448` |
| G2 | Node **24.18.0** (mise, 동일 커밋 `3b61cb4`·동일 lockfile·`npm ci` 재설치) | ❌ FAIL | **완전 동일** (`/_global-error`, digest `2216620448`) |
| 프로브(scope+) | Node 24.18.0 + `CI=1 VERCEL=1 NEXT_TELEMETRY_DISABLED=1` | ❌ FAIL | **다른 지점**: `/_not-found`, "reading 'length'", digest `2376153931` |

**판정**: Node 버전은 원인이 아니다. macOS(darwin arm64)에서는 Node 22·24 모두 동일하게 실패한다.

**프로브의 부가 정보**: Vercel 유사 env를 주면 실패 지점·오류가 바뀐다 → Next 16.2.x prerender 파이프라인은 env-민감. Vercel(linux, Node 24)이 실제로 통과하는 이유로 남은 유력 변수는 **플랫폼(linux vs darwin)** 또는 Vercel 빌드 러너 내부 처리. Docker 데몬 다운으로 linux 검증은 미수행 (데몬 기동은 진단 가치 대비 과잉 판단).

---

## 3. Gap Analysis (Design vs 실행)

### 3.1 게이트별 실행 충실도

| Design 항목 | 기대 | 실제 | Status |
|-------------|------|------|--------|
| G0 베이스라인 재확인 | Node 22 FAIL 재현 | FAIL 재현 (동일 시그니처) | ✅ |
| G1 `brew install mise` | 설치 성공 | 성공 | ✅ |
| G1 `mise install node@24` | v24.x 확보 | v24.18.0 | ✅ |
| G1 제약: 셸 활성화 금지 | rc 파일 무변경 | `.zshrc` mise 참조 0건 | ✅ |
| G2 동일 커밋·lockfile 검증 | `npm ci` 후 build | 절차 준수 (HEAD `3b61cb4` 불변) | ✅ |
| G2 판정 분기 | FAIL 시 Exit-A | Exit-A 발동 | ✅ |
| Exit-A: 즉시 종료 | G3~G6 미실행 | 미실행 | ✅ |
| Exit-A: 커밋 0건 | tracked 변경 0 | `git status` PDCA 문서 untracked만 | ✅ |
| Exit-A: 실패 매트릭스 기록 | Analysis 문서 | 본 문서 §2 | ✅ |
| Exit-A: "16.3 대기" 결론 복귀 | 메모리/문서 갱신 | `project_ksways_web_setup.md` 정정 완료 | ✅ |
| NFR 격리성 | 전역 node v22 유지 | `node --version` = v22.22.3 | ✅ |
| NFR 회귀 안전 | — | node_modules Node 22 상태 복원(설계는 "불필요"였으나 보수적 수행) | ✅+ |

### 3.2 설계 외 추가 실행 (scope+)

| 항목 | 근거 | 평가 |
|------|------|------|
| `VERCEL=1` env 프로브 1건 | Analysis 품질 향상 (Vercel 통과 원인 좁히기) | 긍정적 일탈 — 커밋/상태 변경 없는 read-only 진단 |
| Docker linux 검증 시도 → 중단 | 데몬 다운 확인 후 포기 | 설계 정신(rabbit-hole 방지) 준수 |

### 3.3 Match Rate Summary

```
┌─────────────────────────────────────────────────────┐
│  실행 충실도 (Design conformance): 100% (12/12)      │
│  가설 판정: ❌ REFUTED — Exit-A는 설계된 정상 경로    │
├─────────────────────────────────────────────────────┤
│  ✅ 설계대로 실행·종료:  12 items                     │
│  ⚠️ 설계 누락 발견:       0 items                     │
│  ❌ 설계 위반:            0 items                     │
└─────────────────────────────────────────────────────┘
```

**주**: Plan §4.1 DoD 중 "Node 24 build exit 0"(1~4번)은 가설 반증으로 N/A 처리 — Exit-A가 Plan §5 리스크 1의 명시된 완화책이며, DoD 5번("검증 결과 성공/실패 무관 기록")은 달성. 전례(goodman-gls prerender-debt, Do=failed-upstream-blocked)와 동일한 마감 유형.

---

## 4. Code Quality / Architecture / Convention

N/A — 소스 코드·설정 변경 0건 (Exit-A). 기존 게이트 상태 (참고, Node 22): lint 0 err · tsc 0 err · vitest 51/51.

---

## 5. 잔존 환경 변화 (의도적)

| 항목 | 상태 | 처리 |
|------|------|------|
| mise (brew) | 설치됨, 비활성 | 유지 — 향후 프로젝트별 런타임 관리에 재사용 가능. 제거 시 `brew uninstall mise` |
| node@24.18.0 (mise 관리) | 설치됨 | 유지 — `mise exec node@24 --`로만 접근 가능 |
| PDCA 문서 4종 + `.bkit-memory.json` | untracked | Report 후 커밋 여부 사용자 결정 |

---

## 6. Recommended Actions

### 6.1 이 사이클 마감

| Priority | Item |
|----------|------|
| 🟢 1 | `/pdca report node24-build-fix` — failed-upstream-blocked 유형 완료 보고서 |
| 🟢 2 | Report 후 archive |

### 6.2 후속 사이클 후보 (이 사이클 산출)

| 후보 | 내용 | 근거 |
|------|------|------|
| **goodman-gls-masking-removal** | `vercel.json` `\|\| true` 제거를 **PR preview 빌드를 게이트로** 검증 (로컬 빌드 불요) | ksways-web이 마스킹 없이 Vercel 빌드 통과 중 = 살아있는 증거. Vercel Node 24 기설정 확인됨 |
| **linux-build-verification** | Docker(node:24 linux)로 darwin/linux 변수 확정 | 실패 원인 완전 규명 + 로컬 빌드 게이트 대안(컨테이너 빌드) 타당성 판단 |
| Next 16.3 stable 추적 | stable 출시 시 로컬 빌드 재시도 (현재 16.3.0-preview.5) | goodman-gls 2026-05 결론 유지 |

---

## 7. Design Document Updates Needed

없음 — Exit-A 경로까지 설계에 명시돼 있었고 실행이 이를 따름.

---

## 8. Next Steps

- [x] 실패 매트릭스 공식 기록 (본 문서)
- [ ] `/pdca report node24-build-fix`
- [ ] archive

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-07-12 | Initial analysis — 가설 반증 판정, 실행 충실도 100%, 후속 후보 3건 | jhlim725 |
