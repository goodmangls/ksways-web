# AGENTS.md — ksways-web

KS WAYS 이중언어 Next.js 랜딩 페이지. 영어 기본 + `/kr` 라우트. prod = `ksways.co`.

이 파일은 에이전트 중립 규약이다. Claude Code · Codex · Cursor · Gemini CLI · opencode 가 모두 읽는다.

## 워크플로우

경량형 조합 — **gstack + mattpocock/skills**. bkit 은 사용하지 않는다(`docs/archive/*` 의 PDCA 이력은 보존).

- **스프린트 케이던스**: gstack 규칙 준수
- **요구사항 정렬**: 작업 시작 전 `/grill-me` 로 의도·범위 확정
- **디버깅**: `/diagnose` **6-Phase** 준수 — feedback loop → reproduce → hypothesise → instrument → fix + regression test → cleanup
- **Git 안전장치**: 차단형 가드레일은 쓰지 않는다. 알림 훅만 있다.
  - `/git-guardrails-claude-code` 를 2026-08-08 에 설치했다가 **같은 날 제거**했다. 훅이 명령 문자열 전체를 정규식으로 훑기 때문에, 차단 대상 문자열이 **문서 본문에 들어 있기만 해도** 무관한 작업이 막힌다 — 가드레일을 설명하는 이 문서를 작성하는 것조차 차단됐다.
  - 에이전트가 브랜치·커밋·원격 반영까지 수행한다. 다만 되돌리기 계열(`reset --hard` · `clean -f` · `branch -D`)은 실행 전에 사용자 확인을 받는다.

## Agent skills

### Issue tracker

이슈는 GitHub Issues(`goodmangls/ksways-web`)에 두고 `gh` CLI 로 다룬다. See `docs/agents/issue-tracker.md`.

> 참고: 지금까지 실제 작업은 이슈 없이 PR 로만 진행돼 왔다(#1~#27). 이슈 트래커 사용은 이 설정 이후 시작한다.

### Triage labels

다섯 개 표준 역할을 기본 이름 그대로 쓴다 — `needs-triage` · `needs-info` · `ready-for-agent` · `ready-for-human` · `wontfix`. See `docs/agents/triage-labels.md`.

> 이 라벨들은 아직 저장소에 생성돼 있지 않다. `triage` 를 처음 쓸 때 `gh label create` 로 만들면 된다.

### Domain docs

Single-context — 루트 `CONTEXT.md` + `docs/adr/`. See `docs/agents/domain.md`.

> 둘 다 아직 없다. `domain-modeling` 이 실제로 용어·결정을 해소할 때 지연 생성한다(`docs/agents/domain.md` 의 "proceed silently" 규칙).

## 이 저장소의 기존 문서 체계

에이전트 스킬 규약과 **별개로** 이미 자리잡은 것들이 있다. 겹치지 않게 쓸 것.

| 문서 | 역할 |
|---|---|
| `DESIGN.md` | 디자인 시스템 단일 출처 — 팔레트·타이포·포커스·브라우저 타깃. 색/대비 변경 전 반드시 확인 |
| `COPY.md` | 카피 가이드 |
| `docs/archive/2026-07`, `2026-08` | bkit PDCA 6사이클 이력(plan/design/analysis/report). **이력 보존용이며 신규 작업은 여기 쓰지 않는다** |

## 빌드·검증

```bash
npm run dev          # 개발 서버
npm run lint         # ESLint
npm run type-check   # tsc --noEmit
npm run test:run     # vitest (현재 106)
npm run build        # ⚠️ 로컬 macOS 에서는 실패한다
```

### 로컬 빌드 실패는 알려진 부채다

`npm run build` 는 macOS 에서 `/_global-error` prerender 오류(`TypeError: Cannot read properties of null (reading 'useContext')`, digest `2216620448`)로 실패한다. **Node 22·24 양쪽에서 반증 완료**된 framework debt이며 CI(ubuntu)에서는 통과한다. 로컬 빌드 실패를 보고 원인을 다시 찾지 말 것 — Next 16.3 stable 대기 중이다.

로컬 게이트는 lint · tsc · test 세 가지, 빌드 게이트는 CI 가 담당한다.

## 가드 테스트

CI 를 통과시키려면 이것들을 알고 있어야 한다. 모두 "실제로 구분을 담당하는 속성" 을 단언한다.

| 파일 | 무엇을 막나 |
|---|---|
| `src/brand-palette.test.ts` | 구 팔레트 잔존(저장소 전역 스윕) · white-on-bronze 금지 · 대비 계산 · `DESIGN.md` ↔ CSS 값 일치 · 경고색과 브랜드색 hue 거리 ≥20° · body 기본 대비 |
| `src/focus-visible.test.ts` | 포커스 링 이중 구조 · 표면별 대비 · `outline-none`/`ring` 유틸 차단 · `opacity`/`visibility` 짝 |
| `src/browser-target.test.ts` | 지원 브라우저 타깃 고정(Next `MODERN_BROWSERSLIST_TARGET`) · `browserslist` 설정파일 부재 |
| `src/site-quality.test.ts` | 보안 헤더 · CSP · 브랜드 표기 붕괴 · 금지 포지셔닝 |

**색·포커스·타깃을 건드리면 이 가드들이 먼저 걸린다.** 눈으로 맞추지 말고 값을 계산할 것.

## 크로스 엔진 검증

```bash
node scripts/verify-css-engines.mjs --browser firefox   # Playwright
node scripts/verify-safari.mjs                          # safaridriver, 의존성 0
```

CI 에는 넣지 않는다 — 엔진 동작은 우리 커밋이 아니라 브라우저 업데이트로 바뀐다. Safari 쪽은 **설정 → 개발자용 → 원격 자동화 허용** 이 켜져 있어야 하며, 꺼져 있으면 `exit 2` 로 안내하고 끝난다.

## 작업 규칙

- 코드 변경 시 `.commit_message.txt` 에 한 줄 설명(한국어)을 기록한다. **PR 을 연달아 낼 때 이 파일이 충돌**하니 리베이스로 해소할 것.
- `main` 직접 커밋 대신 브랜치 → PR. CI 게이트는 `quality`(lint·tsc·test)와 `build` 두 개가 필수다.
- 병행 작업자 이력이 있으므로 push 전 `git fetch`.
- `npm run dev` 는 `next-env.d.ts` 를 `.next/dev/types` 로 바꿔놓는다. 스테이징에 섞이면 CI 빌드와 어긋나니 검증 후 `git status` 를 확인할 것.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
