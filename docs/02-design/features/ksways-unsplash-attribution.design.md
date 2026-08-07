# ksways-unsplash-attribution Design Document

> **Summary**: FR-00 수행 결과 **약관 원문과 작가 정보 모두 이 환경에서 취득 불가** — `unsplash.com` 전체가 BotStopper 로 403. 다만 `api.unsplash.com` 은 **401(키 무효)** 로 응답해 **접근 키만 있으면 전 과정이 자동화 가능**함이 확인됐다. 이 사이클은 **키 확보를 선행 조건**으로 두고, 키 없이 할 수 있는 부분 작업은 **의도적으로 하지 않는다**
>
> **Project**: ksways-web
> **Plan**: `docs/01-plan/features/ksways-unsplash-attribution.plan.md`
> **Author**: jhlim725
> **Date**: 2026-08-07
> **Status**: Draft — **선행 조건 대기**

---

## 0. FR-00 수행 결과

Plan 이 "Unsplash 현행 요구사항 원문 확인" 을 선행 과제로 두었다. 수행했고, **확인하지 못했다.** 확인하지 못한 이유 자체가 이 사이클의 핵심 제약이므로 기록한다.

### 0.1 `unsplash.com` 은 자동 접근이 전면 차단돼 있다

| 대상 | 결과 |
|---|---|
| `unsplash.com/api-guidelines` | **403** |
| `unsplash.com/license` | **403** |
| `unsplash.com/photos/{id}` | **403** |
| `unsplash.com/oembed?url=…` | **403** |
| `images.unsplash.com/...` (CDN) | **200** ✅ |

403 응답 본문: `Access Denied … Protected by BotStopper`. 헤드리스 브라우저(`/browse`)로도 동일하다. 이미지 CDN 만 열려 있어 **사이트는 정상 렌더되지만 메타데이터는 못 가져온다.**

→ **약관 원문 확인 불가**, **공개 사진 페이지에서 작가명 추출 불가**. Plan §5 의 리스크 두 개가 **동시에 현실화**됐다.

### 0.2 그러나 API 호스트는 살아 있다

```
api.unsplash.com/photos/E0AHdsENmDg
  → HTTP 401  {"errors":["OAuth error: The access token is invalid"]}
```

**403(봇 차단)이 아니라 401(인증 실패)**이다. 즉 `api.unsplash.com` 은 이 환경에서 도달 가능하며, **유효한 access key 만 있으면 정상 응답**한다.

### 0.3 그래서 플레이스홀더가 있는 것이다

`.env*` 파일이 **하나도 없고** `UNSPLASH_ACCESS_KEY` 도 미설정이다. 그런데 코드의 API 경로(`getUnsplashImages` → `normalizeUnsplashPhoto`)는 `photo.user.name` · `photo.user.links.html` · `photo.links.download_location` 을 **정확히 채우도록 이미 구현돼 있다.**

즉 플레이스홀더는 설계 실수가 아니라 **키가 한 번도 제공되지 않아 API 경로가 실행된 적이 없고, 그 자리를 손으로 채운 큐레이션 데이터**다. 원래 의도된 메커니즘은 처음부터 존재했다.

---

## 1. Design Decisions

| # | 쟁점 | 결정 |
|---|---|---|
| D-1 | 진행 조건 | **Unsplash access key 확보를 선행 조건으로 고정.** 키 없이는 Do 를 시작하지 않는다 |
| D-2 | 작가 정보 확보 경로 | **API (`api.unsplash.com/photos/{id}`)**. 수동 입력은 대안으로만 |
| D-3 | 키 없이 가능한 부분 작업 | **하지 않는다** — 아래 상세 |
| D-4 | `downloadLocation` | 키 확보 후 **호출**. 필드 제거안은 기각 |
| D-5 | 모바일 표기(Plan D) | **A·B 해소 이후로 순서 고정.** 먼저 하지 않는다 |
| D-6 | 렌더 안 되는 7개 | **포함.** 같은 API 호출로 함께 해소되므로 분리 이득이 없다 |
| D-7 | 회귀 가드 | 플레이스홀더 재유입 차단 — 키 없이도 **지금 만들 수 있는 유일한 산출물** |

### D-3 상세 — 왜 부분 작업을 하지 않는가

키 없이 지금 할 수 있는 것은 **모바일 표기 노출(Plan D)** 과 **가드(FR-05)** 다. 이 중 모바일 표기는 **하면 안 된다.**

현재 표기 문구는 `Photo: Unsplash Contributor / Unsplash` 이고 앞 링크는 Unsplash 홈으로 간다. 이 상태에서 모바일에 표기를 노출하면 **아무도 크레딧하지 않는 문구를 더 많은 화면에 퍼뜨리는 것**이다. 준수도 개선되지 않고 사용자에게 주는 정보도 0 인 채 시각 노이즈만 는다.

→ **D-5**: 모바일 표기는 A·B 가 해소돼 문구가 실제 작가를 가리키게 된 뒤에 결정한다.

가드(D-7)는 다르다. 지금 만들어도 **손해가 없고**, 나중에 실제 데이터가 들어올 때 플레이스홀더 잔존을 잡아준다. 이번 사이클에서 유일하게 선행 가능한 산출물이다.

### D-4 상세 — 필드 제거안을 기각하는 이유

Plan FR-03 은 "호출 또는 필드 제거" 로 열어두었다. 제거를 기각한다:

- `downloadLocation` 은 API 가 주는 값이고 `normalizeUnsplashPhoto` 가 이미 매핑한다. 필드를 지우면 **API 경로를 훼손**하게 된다
- 호출 자체는 키가 있으면 사소하다(사진당 GET 1회)
- 저장해두고 호출하지 않는 현 상태가 **의도의 미완성**이라는 판단은 유지

단, **호출 시점**(빌드 타임 큐레이션 시 1회 vs 렌더마다)은 키 확보 후 Design 보강에서 결정한다. 현재 구조가 하드코딩 배열이므로 **큐레이션 스크립트에서 1회** 가 유력하다.

### D-6 상세 — 7개를 포함하는 이유

히어로에 렌더되는 것은 3개지만, 나머지 7개도 동일한 플레이스홀더를 갖고 있고 `brandUse` 가 `service-support` 등으로 **향후 사용 가능성이 열려 있다.** API 호출은 사진 ID 단위이므로 10개를 처리하는 비용이 3개와 실질적으로 같다. 나중에 7개가 쓰일 때 같은 문제를 다시 발견하는 것이 더 비싸다.

---

## 2. Implementation Spec

### 2.1 선행 조건 (사용자 작업)

Unsplash Developers 에서 애플리케이션을 등록하고 Access Key 를 발급받아 `.env.local` 에 설정한다.

```
UNSPLASH_ACCESS_KEY=<발급받은 키>
```

> 등록 과정에서 **API Guidelines 원문을 함께 확인**해 FR-00 을 마무리한다. 이 환경에서는 403 으로 읽을 수 없으므로 사용자 확인이 유일한 경로다. 확인 결과(특히 attribution 문구 형식·download 트리거 요구 여부)를 analysis 에 기록한다.

`.env.local` 은 `.gitignore` 대상인지 확인이 필요하다 (현재 `.env*` 파일이 전혀 없어 미검증).

### 2.2 `scripts/refresh-unsplash-credits.mjs` (신규, 키 확보 후)

`approvedUnsplashImages` 의 사진 ID 10개로 `api.unsplash.com/photos/{id}` 를 조회해 `photographer` · `photographerUrl` 을 실제 값으로 갱신한다. `normalizeUnsplashPhoto` 와 **동일한 변환**(`withReferralParams`)을 적용해 API 경로와 결과가 일치하게 한다.

`downloadLocation` 트리거도 이 스크립트에서 수행한다(D-4).

출력은 사람이 검토 가능한 diff 형태로 두고, 파일을 직접 덮어쓸지 여부는 Do 에서 결정한다.

### 2.3 `src/lib/unsplash.test.ts` 확장 — 플레이스홀더 가드 (D-7, **지금 가능**)

| # | 검증 | 실패 시 의미 |
|---|---|---|
| 1 | `photographer` 가 `'Unsplash Contributor'` 가 **아닐 것** | 플레이스홀더 잔존 |
| 2 | `photographerUrl` 이 `unsplash.com/@…` 형태의 **작가 프로필**일 것 (홈페이지 URL 금지) | 링크 레이블/목적지 불일치 |
| 3 | `photographer` 값이 **모두 동일하지 않을 것** | 일괄 플레이스홀더 재유입 |
| 4 | 모든 항목에 `utm_source`·`utm_medium` 유지 | referral 파라미터 소실 |

⚠️ **1~3 은 현재 데이터에서 실패한다.** 이것이 정상이다 — 가드는 결함을 드러내려고 만든다. 다만 **CI 를 빨갛게 두면 다른 작업이 막히므로**, 도입 시점을 Do 에서 결정한다(현 데이터 수정과 **같은 PR** 에 넣는 것이 유력).

### 2.4 변경 파일 목록 (예정)

| 파일 | 변경 | 시점 |
|---|---|---|
| `src/lib/unsplash.ts` | `approvedUnsplashImages` 작가 필드 10건 | 키 확보 후 |
| `scripts/refresh-unsplash-credits.mjs` | 신규 | 키 확보 후 |
| `src/lib/unsplash.test.ts` | 가드 4건 | 데이터 수정과 동일 PR |
| `src/components/HomePage.tsx` | 모바일 표기 (D-5) | A·B 이후 별도 판단 |
| `.env.local` / `.gitignore` | 키 설정·제외 확인 | 선행 |

---

## 3. Implementation Order (Do)

**0. [선행·사용자] Access Key 발급 + API Guidelines 확인** ← 여기서 막히면 이후 전부 불가

1. `.gitignore` 의 `.env*` 처리 확인
2. `scripts/refresh-unsplash-credits.mjs` 작성 → 10개 조회 → diff 검토
3. `approvedUnsplashImages` 갱신
4. `unsplash.test.ts` 가드 4건 추가 → 통과 확인
5. 결함 주입(플레이스홀더 재삽입) → 실패 확인 → 원복
6. `downloadLocation` 트리거 구현
7. 실브라우저 스팟체크 — 작가명이 길어져 히어로 레이아웃이 깨지지 않는지
8. 4게이트 + 모바일 표기(D-5) 별도 판단

---

## 4. Verification & Exit Criteria

| 항목 | 기준 | 수단 |
|---|---|---|
| FR-00 | 요구사항이 문서에 기록 | **사용자 확인** (자동 취득 불가) |
| FR-01·02 | 10개 전부 실제 작가명·프로필 URL | API 응답 대조 + 가드 |
| FR-03 | `downloadLocation` 트리거 동작 | 응답 코드 확인 |
| FR-05 | 결함 주입 재현 | 플레이스홀더 재삽입 |
| 회귀 | 102 tests 유지, 4게이트 GREEN | 로컬 + CI |

### 알려진 한계

- **FR-00 은 이 환경에서 자동 검증 불가** — BotStopper. 사용자 확인이 유일한 경로이며, 확인 없이는 "규정 준수" 를 주장하지 않고 **제품 품질 근거로만** 진행한다
- API 응답의 작가명이 **현재 사진의 실제 작가와 일치하는지**는 사진 ID 신뢰에 의존한다. ID 는 `unsplashUrl` 과 `downloadLocation` 양쪽에서 일관되므로 신뢰 가능하다고 본다

---

## 5. 현재 상태

**이 사이클은 선행 조건(§2.1)에서 대기 중이다.** 키 없이 Do 를 시작하면 D-3 에서 기각한 부분 작업만 남는다.

키 확보가 어렵다면 대안은 **수동 데이터 입력**이다 — 사용자가 브라우저로 `unsplash.com/photos/{id}` 3~10개를 열어 작가명·프로필 URL 을 옮겨 적는 방식. 자동화보다 느리고 오타 위험이 있으나 키 없이 가능하다. 이 경우에도 가드(D-7)는 동일하게 적용된다.

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-08-07 | Initial draft — FR-00 수행(원문 취득 불가·BotStopper 403 확인), api.unsplash.com 은 401 로 도달 가능함을 확인해 키 확보를 선행 조건으로 고정. 부분 작업 기각 근거 명시 | jhlim725 |
