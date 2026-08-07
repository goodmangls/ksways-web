# ksways-focus-ring-contrast Design Document

> **Summary**: 이중 링(navy 내곽 + gold 외곽)으로 전 표면 ≥12.14:1 확보, 폼 입력의 `outline-none`·충돌 ring 유틸 제거로 Level A 해소, 표면별 대비를 계산 검증하는 가드 신설
>
> **Project**: ksways-web
> **Plan**: `docs/01-plan/features/ksways-focus-ring-contrast.plan.md`
> **Author**: jhlim725
> **Date**: 2026-08-07
> **Status**: Draft

---

## 1. Design Decisions (전부 확정)

| # | 쟁점 | 결정 | 근거 |
|---|---|---|---|
| D-1 | 이중 링 vs 표면별 토큰 | **이중 링** | 표면별 토큰은 "어떤 표면 위인가"를 CSS가 알아야 해서 컴포넌트마다 클래스를 달아야 하고, 그게 [B](폼)처럼 전역 규칙이 조용히 무력화되는 경로를 다시 만든다. 이중 링은 전역 규칙 1곳으로 끝난다 |
| D-2 | 링 색 조합 | **navy `#001112` 내곽 + gold `#e7c99a` 외곽** | 후보 4종 실측 결과 아래 표. 최저 마진 12.14:1로 압도적이고, 둘 다 기존 브랜드 토큰(`--ks-navy` / `--ks-accent-soft`)이라 색을 새로 만들지 않는다 |
| D-3 | 구현 수단 | `outline`(외곽 gold) + `box-shadow`(내곽 navy) | `box-shadow`는 `border-radius`를 자동으로 따르고, `outline`도 모던 브라우저에서 따른다. 두 겹을 한 규칙으로 표현 가능 |
| D-4 | 폼 입력 처리 | **`outline-none` 제거** + 충돌하는 `ring-*` 유틸 제거 | 전역 규칙을 그대로 받게 하는 것이 D-1의 취지. Tailwind `ring`은 `box-shadow` 기반이라 내곽 링과 **직접 충돌**한다 |
| D-5 | 장식 효과 존치 | `focus:border-[#b88a5a]` · `focus:bg-white` **유지** | 이들은 포커스 표시가 아니라 보조 어포던스. 대비 책임은 링이 진다 |
| D-6 | 가드 배치 | 신규 `src/focus-visible.test.ts` + 공통 헬퍼 `src/test-utils/contrast.ts` | 팔레트(값)와 포커스(상호작용 상태)는 관심사가 다름. `contrastRatio` 중복만 헬퍼로 추출 |

### D-2 근거 — 후보 실측

각 표면에서 **두 링 중 더 잘 보이는 쪽**의 대비 (AA 비텍스트 3:1):

| 후보 | 두 링 상호 | dark `#001112` | paper `#f4f7f6` | white | 최저 마진 |
|---|---|---|---|---|---|
| A 브랜드 이중링 `#805d3b`+`#e7c99a` | 3.73:1 | 12.14 | 5.49 | 5.92 | 5.49 ✅ |
| B 중립 이중링 `#001112`+`#ffffff` | 19.29:1 | 19.29 | 17.89 | 19.29 | 17.89 ✅ |
| C 액센트+골드 `#b88a5a`+`#e7c99a` | 1.94:1 | 12.14 | **2.86** | 3.08 | ❌ |
| **D 잉크+골드 `#001112`+`#e7c99a`** | 12.14:1 | 12.14 | 17.89 | 19.29 | **12.14 ✅** |

- **C 기각**: paper에서 2.86:1로 미달. 두 링 상호 대비도 1.94라 사실상 한 겹으로 보인다.
- **A 기각**: 통과하지만 상호 대비 3.73으로 이중 링의 경계가 흐리고, 최저 마진이 D의 절반 이하.
- **B 기각**: 마진은 최고지만 흑백 링이라 브랜드 인상이 없고, 새 색(순백)을 링 전용으로 도입해야 한다.
- **D 채택**: 최저 12.14:1. 어두운 면에서는 gold가, 밝은 면에서는 navy가 대비를 책임지는 **상호 보완 구조**. 두 색 모두 기존 토큰.

### 왜 단일 색은 불가능한가 (Plan §1.2 재확인)

| 단일 후보 | dark | paper | white |
|---|---|---|---|
| `#e7c99a` | 12.14 ✅ | 1.47 ❌ | 1.59 ❌ |
| `#b88a5a` | 6.26 ✅ | 2.89 ❌ | 3.08 ⚠️ |
| `#805d3b` | 3.26 ⚠️ | 5.55 ✅ | 5.92 ✅ |

브론즈 계열이 중간톤이라 어떤 값을 골라도 한쪽이 실패하거나 간신히 걸친다.

---

## 2. Implementation Spec

### 2.1 `src/app/globals.css` — 전역 포커스 규칙

```css
:focus-visible {
  /* 이중 링: 요소 바깥으로 navy 2px → gold 3px.
     어두운 면에서는 gold 가, 밝은 면에서는 navy 가 대비를 책임진다.
     둘 다 기존 브랜드 토큰이며 최저 대비 12.14:1 — src/focus-visible.test.ts 참조. */
  outline: 3px solid var(--ks-accent-soft);
  outline-offset: 2px;
  box-shadow: 0 0 0 2px var(--ks-navy);
}
```

기하: 요소 가장자리 → `box-shadow` navy 2px(오프셋 간격을 정확히 채움) → `outline` gold 3px. 간격에 배경이 비치지 않으므로 링이 항상 연속된 두 겹으로 보인다.

기존 `outline-offset: 4px` → `2px`. 4px는 간격에 **주변 표면**이 그대로 드러나 대비 계산 기준면이 요소가 아닌 페이지 배경이 되던 원인(Plan 리스크 2).

### 2.2 `src/components/QuoteForm.tsx:100` — `commonClass`

```diff
- ... text-[#001112] outline-none transition placeholder:text-[#001112]/35
-   focus:border-[#b88a5a] focus:bg-white focus:ring-4 focus:ring-[#b88a5a]/14
+ ... text-[#001112] transition placeholder:text-[#001112]/35
+   focus:border-[#b88a5a] focus:bg-white
```

- `outline-none` 제거 → 전역 이중 링 적용 (**FR-02 / WCAG 2.4.7 해소**)
- `focus:ring-4 focus:ring-[#b88a5a]/14` 제거 → `box-shadow` 충돌 해소. 이 링은 1.14:1로 애초에 아무것도 표시하지 못하고 있었으므로 기능 손실 없음
- `focus:border` · `focus:bg-white` 유지 (D-5)

### 2.3 `src/components/QuoteForm.tsx:148` — DG 필드 정적 ring

```
'border-[#805d3b]/35 bg-white ring-4 ring-[#b88a5a]/12'
```

이건 포커스가 아니라 **위험물 검토 필드 강조**용 정적 상태다. 다만 Tailwind `ring`이 `box-shadow`를 쓰므로, 해당 필드가 포커스되면 내곽 navy 링을 덮어쓴다.

**결정**: `ring-4 ring-[#b88a5a]/12` → `border-[#805d3b]/60`(테두리 강화)로 대체해 `box-shadow` 사용을 없앤다. 강조 의도는 보존하면서 포커스 링과의 충돌을 구조적으로 제거.

### 2.4 `src/test-utils/contrast.ts` (신규)

`brand-palette.test.ts`의 `relativeLuminance` / `contrastRatio`를 그대로 이동. 두 테스트가 import.

⚠️ `vitest.config.ts`의 `coverage.exclude`에 `'src/test-utils/**'` 추가 필요 (현재 `test-mocks`만 제외됨). `include`는 `src/**/*.test.{ts,tsx}`라 헬퍼가 테스트로 오인 수집되지는 않음.

### 2.5 `src/focus-visible.test.ts` (신규)

| # | 검증 | 실패 시 의미 |
|---|---|---|
| 1 | `globals.css`가 `outline`·`box-shadow` 두 겹을 모두 선언 | 이중 링 구조 파괴 |
| 2 | 두 링 색이 `var(--ks-accent-soft)` / `var(--ks-navy)` 토큰 참조 | 리터럴 하드코딩 회귀 |
| 3 | dark·paper·white 세 표면에서 **최댓값 ≥3:1** 계산 검증 | 팔레트 변경이 포커스를 깨뜨림 |
| 4 | 두 링 상호 대비 ≥3:1 | 두 겹이 한 겹처럼 보이는 조합으로 회귀 |
| 5 | `src/` 어디에도 `outline-none`이 **가시 대체 없이** 존재하지 않음 | [B] 유형 재발 — 컴포넌트가 전역 규칙을 조용히 무력화 |
| 6 | `focus:ring` 유틸이 `commonClass`에 없음 | `box-shadow` 충돌 재도입 |

**결함 주입 계획** (NFR): ①`outline-offset`을 4px로 되돌려 표면 기준 계산이 실패하는지 ②`commonClass`에 `outline-none` 재삽입 → #5 실패 ③gold를 단일 링으로 되돌림 → #1·#3 실패. 각각 확인 후 원복.

### 2.6 `DESIGN.md` — 포커스 규정 신설 (FR-04)

`## Elevation & Depth` 뒤에 `## Focus` 절 추가:
- 이중 링 구조와 두 토큰 명시
- 최소 대비 3:1, 기준면은 **인접색**(요소 배경 및 페이지 표면 양쪽)
- **금지**: `outline-none` 단독 사용, `ring-*` 유틸로 포커스 표시 대체, 단일 브론즈 링
- 근거 표(후보 4종 실측)를 축약 수록

### 2.7 변경 파일 목록

| 파일 | 변경 |
|---|---|
| `src/app/globals.css` | `:focus-visible` 이중 링으로 교체 |
| `src/components/QuoteForm.tsx` | `commonClass` `outline-none`·`focus:ring` 제거 / DG 필드 `ring`→`border` |
| `src/test-utils/contrast.ts` | 신규 (헬퍼 추출) |
| `src/brand-palette.test.ts` | 헬퍼 import로 전환 |
| `src/focus-visible.test.ts` | 신규 6건 |
| `vitest.config.ts` | coverage exclude에 `test-utils` 추가 |
| `DESIGN.md` | `## Focus` 절 신설 |

---

## 3. Implementation Order (Do)

1. `src/test-utils/contrast.ts` 추출 + `brand-palette.test.ts` import 전환 → **85 tests 유지 확인** (순수 리팩터, 여기서 깨지면 이후 판단이 흐려짐)
2. `vitest.config.ts` coverage exclude
3. `globals.css` 이중 링 적용
4. `focus-visible.test.ts` 6건 작성 → 통과 확인
5. **결함 주입 3종** 실행 → 각 실패 확인 → 원복
6. `QuoteForm.tsx` `commonClass` + DG 필드 수정
7. `DESIGN.md` `## Focus` 절
8. 4게이트 + 실브라우저 키보드 스팟체크

---

## 4. Verification & Exit Criteria

| 항목 | 기준 | 수단 |
|---|---|---|
| 전 표면 대비 | 세 표면 최댓값 ≥3:1 (설계 예상 최저 12.14) | `focus-visible.test.ts` 계산 |
| 폼 Level A | 28필드 키보드 포커스 **육안 확인** | 실브라우저 수동 (headless 불가) |
| 가드 실효 | 결함 주입 3종 전부 실패 재현 | 수동 주입 → 원복 |
| 회귀 | 85 → 91 tests, lint 0 · tsc 0 · build | 로컬 + CI |
| 문서 정합 | DESIGN.md `## Focus` ↔ globals.css | 리뷰 |

### 미해결 / Do에서 확인할 것

- **`outline` + `border-radius` 브라우저 지원**: 모던 브라우저는 따르지만 정확한 하한 버전은 미확인. Do 단계에서 확인하고, 문제 시 외곽도 `box-shadow` 2겹으로 전환(대비 계산은 동일하게 유지됨)
- 이중 링 총 두께 5px + offset 2px가 조밀한 레이아웃(푸터 링크 6개, 폼 필드)에서 시각적으로 겹치는지 — 스팟체크 항목

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-08-07 | Initial draft — 후보 4종 실측 후 D(navy+gold) 채택, 폼 `outline-none`·ring 충돌 해소 설계 | jhlim725 |
