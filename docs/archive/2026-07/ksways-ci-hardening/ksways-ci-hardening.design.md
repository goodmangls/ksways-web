# ksways-ci-hardening Design Document

> **Summary**: GitHub Actions CI(필수 3게이트 + build 실험 job) 및 Content-Security-Policy(Intercom 공식 도메인 + Unsplash) 구현 설계 — Plan의 미결 2건(script-src 전략·롤아웃 방식) 확정 포함
>
> **Project**: ksways-web
> **Version**: 0.1.0
> **Author**: jhlim725
> **Date**: 2026-07-12
> **Status**: Draft
> **Planning Doc**: [ksways-ci-hardening.plan.md](../../01-plan/features/ksways-ci-hardening.plan.md)

---

## 1. Overview

### 1.1 Design Goals

1. push/PR 시 lint·tsc·vitest가 자동 실행되는 회귀 게이트 확립 (Node 24, Vercel 정합)
2. Intercom·Unsplash·Next.js 요구사항을 정확히 반영한 enforce 모드 CSP — 프리뷰 검증 후 무회귀 배포
3. build 실험 job으로 darwin/linux 변수 무비용 검증 (게이트 비오염)

### 1.2 Design Decisions (Plan 미결 2건 확정)

| 결정 | 선택 | 근거 |
|------|------|------|
| **script-src 전략** | `'self' 'unsafe-inline'` + Intercom 스크립트 호스트 3종 (nonce 채택 안 함) | nonce는 전 페이지를 dynamic rendering으로 강제 → SSG 마케팅 사이트의 정적 최적화 상실. 이 사이트는 사용자 입력을 렌더링하지 않아(mailto 기반, 서버 저장 없음) inline-XSS sink가 없고, 호스트 화이트리스트만으로도 외부 스크립트 주입 차단 실효. nonce 강화는 동적 콘텐츠 도입 시 후속 사이클 |
| **롤아웃 방식** | 즉시 enforce (Report-Only 생략) | violation 수집 엔드포인트가 없어 Report-Only의 실익 없음. 대신 Vercel preview에서 기존 `scripts/qa-capture.js`(콘솔 에러 수집)를 전 라우트에 돌려 CSP violation을 merge 전에 검출 |

---

## 2. Architecture

### 2.1 Component Diagram

```
┌───────────────────────┐      ┌───────────────────────────┐
│ GitHub push / PR      │─────▶│ Actions: quality job (필수) │──▶ merge 게이트
│ (main)                │      │  eslint · tsc · vitest     │
│                       │─────▶│ Actions: build job (실험)   │──▶ 결과 기록만
└───────────────────────┘      └───────────────────────────┘
┌───────────────────────┐      ┌───────────────────────────┐
│ next.config.ts        │─────▶│ 모든 응답 헤더에 CSP 부착     │──▶ preview에서
│ headers() + CSP 상수   │      │ (기존 5종 + CSP 1종)        │    qa-capture 검증
└───────────────────────┘      └───────────────────────────┘
```

### 2.2 Dependencies

| Component | Depends On | Purpose |
|-----------|-----------|---------|
| ci.yml quality job | `package-lock.json`(존재 확인됨), npm scripts | `npm ci` 재현성 |
| ci.yml build job | quality와 독립 (병렬) | 실험 격리 |
| CSP 헤더 | Intercom 공식 CSP 도메인(2026-07-12 문서 확인), `images.unsplash.com` | 서드파티 무회귀 |
| site-quality.test.ts | `next.config.ts` headers() | CSP 회귀 고정 |

---

## 3. Implementation Spec

### 3.1 `.github/workflows/ci.yml` (신규)

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test:run

  build-experiment:
    # linux 변수 검증용 — 실패해도 PR을 막지 않음 (Plan FR-02)
    runs-on: ubuntu-latest
    continue-on-error: true
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm run build
```

### 3.2 `package.json` 스크립트 추가

```json
"type-check": "tsc --noEmit"
```

(`lint`는 ESLint 9 flat config로 인자 없이 cwd 전체 — 기존 스크립트 그대로 사용)

### 3.3 CSP — `next.config.ts`

지시어 배열 상수로 정의 후 `join('; ')`, 기존 headers() 배열에 1개 항목 추가.

```
default-src 'self'
script-src 'self' 'unsafe-inline' https://app.intercom.io https://widget.intercom.io https://js.intercomcdn.com
style-src 'self' 'unsafe-inline'
img-src 'self' data: blob: https://images.unsplash.com https://js.intercomcdn.com https://static.intercomassets.com https://downloads.intercomcdn.com https://uploads.intercomusercontent.com https://gifs.intercomcdn.com https://video-messages.intercomcdn.com https://messenger-apps.intercom.io
font-src 'self' https://js.intercomcdn.com https://fonts.intercomcdn.com
connect-src 'self' https://via.intercom.io https://api.intercom.io https://api-iam.intercom.io https://api-ping.intercom.io https://*.intercom-messenger.com wss://*.intercom-messenger.com https://nexus-websocket-a.intercom.io wss://nexus-websocket-a.intercom.io https://nexus-websocket-b.intercom.io wss://nexus-websocket-b.intercom.io https://uploads.intercomcdn.com https://uploads.intercomusercontent.com
frame-src https://intercom-sheets.com https://www.intercom-reporting.com https://www.youtube.com https://player.vimeo.com https://fast.wistia.net
media-src https://js.intercomcdn.com https://downloads.intercomcdn.com
worker-src 'self' blob:
child-src blob: https://intercom-sheets.com https://www.intercom-reporting.com https://www.youtube.com https://player.vimeo.com https://fast.wistia.net
object-src 'none'
base-uri 'self'
form-action 'self' https://intercom.help https://api-iam.intercom.io
frame-ancestors 'none'
upgrade-insecure-requests
```

**설계 노트**:
- Intercom 도메인은 2026-07-12 공식 문서(intercom.com/help/en/articles/3894) 기준 **US 리전 + 신형 `*.intercom-messenger.com` 와일드카드**. KS WAYS 워크스페이스가 EU/AU 호스팅으로 판명되면 `.eu`/`.au` 변형을 추가 (preview 콘솔 violation으로 검출됨)
- `style-src 'unsafe-inline'`: Intercom 공식 요구 + framer-motion 인라인 style 속성 (Plan 리스크 표 반영)
- `frame-ancestors 'none'` = 기존 `X-Frame-Options: DENY`와 동치 (양쪽 유지, 모던 브라우저는 CSP 우선)
- `form-action`: 사이트 자체 폼은 mailto 네비게이션이라 무관하나 Intercom 공식 요구값 포함
- mailto/tel 링크는 CSP navigation 제약 대상 아님 — 견적 폼 무영향

### 3.4 `src/site-quality.test.ts` 추가 테스트

기존 "baseline production security headers" 테스트 패턴을 따라 신규 it 블록 1개:

```
- content-security-policy 헤더 존재
- "default-src 'self'" 포함
- 'https://images.unsplash.com' 포함 (img-src)
- 'https://widget.intercom.io' 포함 (script-src)
- "object-src 'none'" · "frame-ancestors 'none'" · "base-uri 'self'" 포함
- 'unsafe-eval' 미포함 (금지 지시어 네거티브 검증)
```

### 3.5 변경 파일 목록

| 파일 | 변경 | FR |
|------|------|----|
| `.github/workflows/ci.yml` | 신규 | FR-01, FR-02 |
| `package.json` | `type-check` 스크립트 추가 | FR-01 |
| `next.config.ts` | CSP 상수 + headers() 항목 추가 | FR-03 |
| `src/site-quality.test.ts` | CSP 회귀 테스트 추가 | FR-04 |

---

## 4. Implementation Order (Do)

1. `package.json` type-check 스크립트 → `.github/workflows/ci.yml` 작성 (FR-01·02)
2. `next.config.ts` CSP 추가 (FR-03)
3. `site-quality.test.ts` 테스트 추가 (FR-04) → 로컬 3게이트(lint·type-check·test:run) GREEN
4. 브랜치 push → PR 생성 → **CI 첫 실행 GREEN 확인** (quality 필수, build-experiment 결과 기록)
5. Vercel preview 검증 (FR-05):
   - `curl -sI {preview}/ | grep -i content-security-policy` — 헤더 존재
   - `QA_BASE_URL={preview} node scripts/qa-capture.js` — 6라우트 × 2뷰포트 콘솔 CSP violation 0
   - Intercom boot 스팟체크: 실브라우저에서 런처 렌더 + `window.intercomSettings` 확인 (headless 한계 — 기존 학습)
6. merge → prod 배포 Ready + prod 헤더 1회 스팟체크

---

## 5. Verification & Exit Criteria

| 검증 | 방법 | 기준 |
|------|------|------|
| CI 게이트 동작 | PR에서 Actions 실행 | quality job GREEN |
| linux build 실험 | build-experiment job 결과 | 성공/실패 무관 기록 (성공 시 차기 필수 승격 후보) |
| CSP 무회귀 | qa-capture(preview) + 실브라우저 | violation 0, Intercom 렌더, 히어로 이미지 정상 |
| 테스트 회귀 | vitest run | 기존 51 + 신규 전부 통과 |

**Exit 조건**: preview에서 CSP violation이 반복 수정에도 해소 불가한 Intercom 내부 도메인 변동 등 외부 요인이면, CSP를 `.eu`/`.au` 포함 전체 목록으로 확장 후 재검증. 그래도 실패 시 CSP 커밋만 revert하고 CI만으로 사이클 분리 종결 (split-cycle 원칙).

**수동 후속(범위 외, 사용자 액션)**: GitHub repo Settings → Branch protection에서 `quality`를 required check로 지정.

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-07-12 | Initial draft — 미결 2건 확정(unsafe-inline 실용 CSP·즉시 enforce), Intercom 공식 도메인 반영 | jhlim725 |
