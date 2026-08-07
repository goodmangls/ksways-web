# ksways-unsplash-attribution Planning Document

> **Summary**: 후속 후보였던 `ksways-mobile-attribution`(모바일 출처 표기 부재)을 조사하다 **더 큰 문제**를 발견했다 — 사진 10개 전부 작가명이 `'Unsplash Contributor'` 플레이스홀더이고 작가 링크가 Unsplash **홈페이지**를 가리킨다. 즉 데스크톱에서도 출처 표기가 **어느 작가도 식별하지 못한다.** 모바일 부재는 이 중 가장 작은 증상이다
>
> **Project**: ksways-web
> **Version**: 0.1.0
> **Author**: jhlim725
> **Date**: 2026-08-07
> **Status**: Draft
> **Supersedes**: `ksways-mobile-attribution` 후보 (범위 확대)

---

## 1. Overview

### 1.1 Purpose — 발견된 것

`ksways-hero-attribution-a11y`(#22) 에서 "640px 미만 출처 표기 부재" 를 후속 후보로 남겼다. 착수하려 조사한 결과, 표기가 **있는 쪽(데스크톱)도 제 역할을 못 하고 있었다.**

| # | 사실 | 확인 방법 |
|---|---|---|
| **A** | 사진 **10개 전부** `photographer: 'Unsplash Contributor'` | `grep -o "photographer: '[^']*'"` → 고유값 1개 ×10 |
| **B** | 사진 **10개 전부** `photographerUrl` 이 `https://unsplash.com/?utm_source=…` — **작가 프로필이 아니라 Unsplash 홈** | 동일 grep → 고유값 1개 ×10 |
| **C** | `downloadLocation` 이 저장·테스트되지만 **애플리케이션 코드에서 호출 0건** | `grep -rn downloadLocation src/` → `unsplash.ts` 와 테스트에만 존재 |
| **D** | 640px 미만에서 출처 표기 전체가 `display: none` | `hidden ... sm:block` |

화면에 실제로 나오는 문구는 **"Photo: Unsplash Contributor / Unsplash"** 이며, 앞 링크는 Unsplash 홈으로 간다. **아무도 크레딧되지 않는다.**

`unsplashUrl` 만 사진별로 정확하다(`/photos/{id}`).

### 1.2 Background — 의도는 있었으나 데이터가 비어 있다

이 코드는 출처 표기를 **하려고 만들어졌다**:

- `withReferralParams()` 가 `utm_source=ksways&utm_medium=referral` 을 부착 — Unsplash 가 요구하는 referral 파라미터 형태
- `photographer` · `photographerUrl` · `downloadLocation` 필드가 타입에 정의돼 있음
- API 경로(`normalizeUnsplashPhoto`)는 `photo.user.name` · `photo.user.links.html` · `photo.links.download_location` 을 **정상적으로 채운다**

문제는 **런타임에 API 를 쓰지 않는다는 점**이다. `getHeroUnsplashImages()` 는 하드코딩된 `approvedUnsplashImages` 배열을 반환하고, 그 배열의 작가 필드가 플레이스홀더로 채워져 있다. API 경로는 살아 있지만 히어로는 그 경로를 타지 않는다.

즉 **A·B 는 큐레이션 시점에 실제 작가 정보를 채우지 않은 데이터 부채**다.

### 1.3 확인하지 못한 것 (중요)

**Unsplash 의 현행 약관·API 가이드라인 원문을 이 사이클에서 확인하지 못했다.** 따라서 "무엇이 규정 위반인가" 는 단정하지 않는다. 다만 규정과 무관하게 다음은 성립한다:

- "Photo: Unsplash Contributor" 는 **사용자에게 아무 정보도 주지 않는다** — 제품 품질 결함
- 작가 링크가 홈으로 가는 것은 **링크 레이블과 목적지의 불일치** — 그 자체로 결함
- `downloadLocation` 을 저장해두고 호출하지 않는 것은 **의도한 동작의 미완성**

Design 단계에서 **원문 확인을 선행 과제로 둔다.** 확인 결과에 따라 우선도와 범위가 달라진다.

### 1.4 Related Documents

- `docs/archive/2026-08/ksways-hero-attribution-a11y/` — D 를 후속으로 남긴 사이클
- 관련 파일: `src/lib/unsplash.ts`(`approvedUnsplashImages` 148행~, `normalizeUnsplashPhoto`, `withReferralParams`), `src/components/HomePage.tsx`(78~91 출처 마크업), `src/lib/unsplash.test.ts`

---

## 2. Scope

### 2.1 In Scope

- [ ] **선행: Unsplash 현행 요구사항 원문 확인** — 이후 항목의 우선도가 여기서 갈린다
- [ ] A·B: 히어로에 쓰이는 사진(3개)의 **실제 작가명·작가 프로필 URL** 확보 및 반영
- [ ] C: `downloadLocation` 호출 여부 결정 및 (필요 시) 구현
- [ ] D: 모바일 표기 방식 결정
- [ ] 회귀 가드 — 플레이스홀더 값이 다시 들어오지 못하게

### 2.2 Out of Scope

- 히어로 이미지 **교체** — 현재 사진을 유지하고 표기만 바로잡는다
- 런타임 Unsplash API 전환 — 하드코딩 큐레이션 구조 자체는 유지 (별도 판단 사안)
- `brandUse` 가 `approved-hero-candidate` 가 아닌 나머지 7개 — 렌더되지 않으므로 후순위 (단, 같은 플레이스홀더 문제를 공유하므로 Design 에서 포함 여부 결정)
- 포커스·Tab 순서 — `ksways-hero-attribution-a11y` 에서 완료

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-00 | Unsplash 현행 요구사항 확인 및 문서화 | **선행** | Pending |
| FR-01 | 히어로 3개 사진의 실제 작가명 표시 | High | Pending |
| FR-02 | 작가 링크가 **해당 작가 프로필**로 연결 (referral 파라미터 유지) | High | Pending |
| FR-03 | `downloadLocation` 처리 방침 확정 — 호출 또는 필드 제거 | Medium | Pending |
| FR-04 | 모바일 표기 방식 확정 (표시 / 축약 / 현행 유지 중 근거 있는 선택) | Medium | Pending |
| FR-05 | 플레이스홀더 재유입 차단 가드 | High | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| 회귀 안전 | 102 tests 유지 + 4게이트 GREEN | 로컬 + CI |
| 가드 실효성 | 결함 주입으로 실패 재현 | 플레이스홀더 재삽입 → 실패 → 원복 |
| 시각 영향 | 히어로 레이아웃 붕괴 없음 (작가명이 길어질 수 있음) | 실브라우저 스팟체크 |
| 데이터 정확성 | 표시되는 작가명이 **실제 해당 사진의 작가** | 사진 ID 별 대조 |

---

## 4. Success Criteria

- [ ] Unsplash 요구사항이 문서에 기록되고 그에 따른 범위가 확정됨
- [ ] 히어로 3개 사진이 실제 작가를 크레딧하고 링크가 정확
- [ ] 플레이스홀더 가드 결함 주입 통과
- [ ] 4게이트 GREEN + PR merge

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| **실제 작가 정보를 얻을 수 없다** — 사진 ID 는 있으나 API 키가 없으면 조회 불가 | **High** | Medium | `UNSPLASH_ACCESS_KEY` 보유 여부를 Design 에서 먼저 확인. 없으면 공개 사진 페이지(`unsplash.com/photos/{id}`)에서 수동 확인하는 경로를 검토 |
| Unsplash 요구사항 원문을 확인 못 하면 범위가 흐려진다 | **High** | Medium | FR-00 을 선행으로 고정. 확인 불가 시 **"규정 준수" 가 아니라 "제품 품질"** 근거로만 진행하고 그 한계를 명시 |
| 작가명이 길어 히어로 레이아웃이 깨진다 | Low | Medium | 현재 `max-w-[280px]` · `text-[11px]`. 실제 이름 반영 후 스팟체크 |
| `downloadLocation` 호출은 서버 사이드 API 키를 요구 | Medium | High | 호출이 필요하다고 판명되면 구현 비용이 커진다. FR-03 을 "호출 또는 **필드 제거**" 로 열어둔 이유 |
| 렌더되지 않는 7개까지 손대면 범위가 두 배 | Low | Medium | Design 에서 명시적으로 포함/제외 결정 |

---

## 6. Architecture Considerations

변경은 대부분 **데이터**(`approvedUnsplashImages` 배열)이며 마크업은 그대로일 가능성이 높다. `HomePage.tsx` 의 출처 렌더는 이미 `slide.photographer` · `slide.photographerUrl` 을 쓰므로, 데이터만 정확해지면 표시도 정확해진다.

API 경로(`normalizeUnsplashPhoto`)는 이미 올바르게 구현돼 있다 — 이 사이클은 그 경로를 고치는 게 아니라 **하드코딩 데이터를 API 경로가 만들어냈을 값과 일치시키는** 작업이다.

## 7. Convention Prerequisites

- [x] 결함 주입 검증 관행
- [x] 실브라우저 스팟체크 경로(`/browse`)
- [ ] `UNSPLASH_ACCESS_KEY` 보유 여부 — **미확인**
- [ ] Unsplash 현행 요구사항 — **미확인 (FR-00)**

## 8. Next Steps

1. [ ] Design (`/pdca design ksways-unsplash-attribution`) — FR-00 선행 수행, 작가 정보 확보 경로, `downloadLocation` 방침, 모바일 표기, 7개 포함 여부
2. [ ] Do → Analyze → Report

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-08-07 | Initial draft — `ksways-mobile-attribution` 조사 중 플레이스홀더 작가 정보(10/10)·미호출 `downloadLocation` 발견해 범위 확대 | jhlim725 |
