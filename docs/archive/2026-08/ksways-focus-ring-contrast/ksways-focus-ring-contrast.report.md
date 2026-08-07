# ksways-focus-ring-contrast Completion Report

> **Project**: ksways-web
> **Match Rate**: 100% (Gap 0)
> **PR**: #21 `7a7b96b` — **OPEN·미머지**, CI quality·build·Vercel 전부 pass
> **Date**: 2026-08-07
> **Author**: jhlim725

---

## 1. 사이클 개요

밝은 표면에서 키보드 포커스 표시가 보이지 않던 문제를 해소했다. 발단은 brand-pivot-bronze (PR #20, squash `e7de26c`) 에서 후속 ①로 남긴 건이었으나, 착수 후 **포커스 시스템이 하나가 아니라 둘이고 두 번째는 대비 미달이 아니라 표시 부재**임이 드러나 심각도가 올라갔다.

| | 변경 전 | 변경 후 |
|---|---|---|
| 전역 링 (paper) | 1.47:1 ❌ | **17.89:1** ✅ |
| 전역 링 (white) | 1.59:1 ❌ | **19.29:1** ✅ |
| 전역 링 (dark) | 12.14:1 ✅ | 12.14:1 ✅ |
| 견적 폼 28필드 | **1.14:1 — 표시 없음** (WCAG 2.4.7 **Level A**) | 전역 링 상속, 육안 확인 ✅ |

Level A 위반이 사이트의 **유일한 전환 경로**에 있었다는 점이 이 사이클의 실질적 무게였다.

---

## 2. 산출물

| 파일 | 내용 |
|---|---|
| `src/app/globals.css` | `:focus-visible` 이중 링 (navy 2px `box-shadow` + gold 3px `outline`, offset 2px) |
| `src/components/QuoteForm.tsx` | `commonClass` 에서 `outline-none`·`focus:ring` 제거 / DG 필드 정적 ring → border |
| `src/focus-visible.test.ts` | 신규 가드 9건 |
| `src/test-utils/contrast.ts` | `contrastRatio` 추출 (팔레트 가드와 공유) |
| `src/brand-palette.test.ts` | 헬퍼 import 로 전환 |
| `vitest.config.ts` | coverage exclude 에 `test-utils` |
| `DESIGN.md` | `## Focus` 절 신설 — 구조·대비표·금지 4항 |
| PDCA 4종 | plan / design / analysis / report |

### 설계 핵심 — 왜 이중 링인가

브론즈 계열은 중간톤이라 **단일 값으로 밝은 면과 어두운 면을 동시에 만족시킬 수 없다.**

| 단일 후보 | dark | paper | white |
|---|---|---|---|
| `#E7C99A` | 12.14 ✅ | 1.47 ❌ | 1.59 ❌ |
| `#B88A5A` | 6.26 ✅ | 2.89 ❌ | 3.08 ⚠️ |
| `#805D3B` | 3.26 ⚠️ | 5.55 ✅ | 5.92 ✅ |

후보 4종을 실측해 **navy 내곽 + gold 외곽**(최저 마진 12.14:1)을 채택했다. 어두운 면은 gold 가, 밝은 면은 navy 가 대비를 책임지는 상호 보완 구조이며 두 색 모두 기존 토큰이다.

**표면별 토큰을 기각한 이유**: 컴포넌트마다 "어떤 표면 위인가"를 클래스로 알려줘야 하는데, **그게 정확히 폼이 전역 규칙을 무력화한 경로**였다. 이중 링은 전역 규칙 1곳으로 끝난다.

---

## 3. 검증 증거

| 항목 | 결과 |
|---|---|
| lint / tsc | 0 / 0 |
| test | **94 passed** (85 → 94) |
| CI build (ubuntu) / Vercel | pass / pass |
| 결함 주입 3종 | 각각 의도한 테스트가 실패 재현 → 원복 |
| 실브라우저 스팟체크 | `/quote` 28필드 + 밝은 섹션 `<summary>` 육안 확인 |
| 서빙 CSS | 55,854 B, `:focus-visible` 두 겹 정상 |

가드는 작성 직후 **아직 고치지 않은 폼 결함을 스스로 지목**했고(red), 수정 후 green 이 되었다. 통과만 보고 넘어가지 않았다는 근거다.

---

## 4. 학습

1. **중간톤 액센트는 단일 포커스 링으로 커버 불가.** 표면이 밝고 어두운 두 종류면 상호 보완하는 두 겹이 단일 색 튜닝보다 구조적으로 안전하다. 단일 색을 고르면 어느 한쪽이 3.08/3.26 처럼 간신히 걸치는 취약한 해가 된다.

2. **`:focus-visible` 은 헤드리스로 검증 가능하다.** Plan·Design 단계에서 "headless 불가"로 판단해 수동 스팟체크로 미뤘으나 틀렸다. **실제 Tab 키 입력**을 주면 발동한다(프로그래밍 `.focus()` 는 안 됨). 계산 스타일·스크린샷까지 자동 확보된다. 다음부터 포커스 검증은 자동화 대상으로 볼 것.

3. **금지 패턴 가드는 자기 문서를 위반으로 신고한다.** 금지 유틸을 *설명하는* 주석이 스캔에 걸려 실제로 실패했다. 이런 가드는 주석을 벗겨낸 뒤 검사해야 한다.

4. **CSS 값 가드는 런타임 상속 결함을 못 잡는다.** 히어로 출처 링크는 규칙이 올바른데도 조상의 opacity 애니메이션이 링까지 감쇠시켜 보이지 않았다(§5). 정적 검증의 명확한 경계.

5. **Tailwind 는 주석까지 평문 스캔한다.** 가드 테스트와 DESIGN.md 가 금지 유틸명을 언급하는 것만으로 죽은 클래스가 생성된다(~60B, 렌더 0개). 소스에 등장하는 문자열이 곧 빌드 산출물이 되는 도구의 특성.

6. **`next dev` 실행이 `next-env.d.ts` 를 수정한다.** `.next/types` → `.next/dev/types`. 실브라우저 검증 후 이 파일이 스테이징에 섞이면 CI 빌드와 어긋난다. 검증 뒤 반드시 확인할 것.

---

## 5. 신규 발견 — 별도 사이클 이관

**`ksways-hero-attribution-a11y`** (Level A, 미시작)

`.ks-hero-bg-attribution` 3개 컨테이너가 21s 주기로 opacity 0↔1 을 순환하고 각각 Unsplash 출처 링크를 2개씩 보유 = **포커스 가능한 링크 6개**. 실측 opacity `[0.37, 0.912, 0]` → 3초 후 `[0, 1, 0]` — **매 순간 링크 4개가 완전히 보이지 않는 채 Tab 순서에 남아 있다.**

이 사이클에서 고치지 않은 이유:
1. Plan §2.2 가 포커스 순서·숨김 콘텐츠를 명시적으로 범위 밖에 둠
2. `fb91a87`(히어로 Unsplash 전환) 이래의 선행 결함 — 본 변경의 회귀가 아님
3. **Unsplash API 가이드라인이 사진작가 출처 표기를 요구** — 링크를 숨기거나 Tab 에서 빼는 처리는 라이선스 준수와 직결되므로 설계가 필요
4. 수정 후보(`visibility` 키프레임 / `inert` / 활성 슬라이드만 렌더)마다 애니메이션 의미와 표기 요건에 다른 영향

후속 사이클에서 **런타임 검증을 가드에 추가할지**도 함께 결정할 것.

---

## 6. 잔여 · 후속 후보

### 이 사이클 잔여 (Low)
- Firefox / Safari 포커스 링 렌더 미확인 (Chromium 만 확인)
- 푸터(어두운 표면) 링크 6개 육안 미확인
- 죽은 `.outline-none` 클래스 ~60B (렌더 0개, 기능 영향 없음)

### 후속 후보
| # | 항목 | 출처 | 우선도 |
|---|---|---|---|
| 1 | `ksways-hero-attribution-a11y` | 본 사이클 §5 | **High (Level A)** |
| 2 | amber(`#FFB84D`/`#A15C00`) ↔ 브론즈 색상군 근접 — 검증 색의 의미 구분 약화 | brand-pivot 후속 ② | Medium |
| 3 | 로고 구현 4벌 중복 | brand-pivot 후속 ③ | Low |
| 4 | `body { color: var(--ks-ink) }` near-white on near-white 잠복 버그 | brand-pivot 후속 ④ | Low |

---

## 7. 상태

- **PR #21 미머지.** CI 전부 GREEN·MERGEABLE 이나 머지는 미실행.
- `.bkit-memory.json`: `phase: "completed"`, `matchRate: 100`
- Archive 는 머지 후 `/pdca archive ksways-focus-ring-contrast`

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-08-07 | 완료 보고 — Match 100%, Level A 해소 확정, 신규 결함 1건 이관 | jhlim725 |
