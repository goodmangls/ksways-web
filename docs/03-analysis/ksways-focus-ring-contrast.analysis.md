# ksways-focus-ring-contrast Gap Analysis (Check)

> **Project**: ksways-web
> **Design**: `docs/02-design/features/ksways-focus-ring-contrast.design.md`
> **PR**: #21 (`7a7b96b`) — CI quality·build·Vercel 전부 pass
> **Date**: 2026-08-07

---

## 1. 종합 판정

**Match Rate: 100%** — Design 명세 7개 파일·6개 결정 전부 구현됨. Gap 0.

FR-01~04 모두 충족, NFR 4항 중 3항 충족, 1항(실브라우저 스팟체크)은 **이번 Check에서 실측 완료**.

다만 스팟체크 과정에서 **본 사이클 범위 밖의 신규 결함 1건**을 발견했다(§5). 설계-구현 간 Gap 은 아니지만 같은 도메인(포커스 가시성)의 Level A 사안이라 기록한다.

---

## 2. Design 대조

| Design 항목 | 구현 | 판정 |
|---|---|---|
| 2.1 `globals.css` 이중 링 (navy 2px box-shadow + gold 3px outline, offset 2px) | 그대로 | ✅ |
| 2.2 `commonClass` `outline-none`·`focus:ring` 제거, `focus:border`/`bg-white` 유지 | 그대로 | ✅ |
| 2.3 DG 필드 정적 `ring-4` → `border-[#805d3b]/60` | 그대로 | ✅ |
| 2.4 `test-utils/contrast.ts` 추출 + coverage exclude | 그대로 | ✅ |
| 2.5 가드 6개 관심사 | 9개 테스트로 구현 (아래) | ✅ |
| 2.6 `DESIGN.md` `## Focus` 절 | 구조·대비표·금지 4항 | ✅ |
| 2.7 변경 파일 7개 | 7개 전부 | ✅ |
| 3. 구현 순서 8단계 | 순서대로 실행 | ✅ |

### 2.5 가드 상세

| Design 관심사 | 테스트 |
|---|---|
| ① 두 겹 선언 | `draws two layers, not one` |
| ② 토큰 참조 | `sources both ring colors from brand tokens` |
| ③ offset 맞물림 | `keeps the rings flush` |
| ④ 표면별 대비 | `stays visible on the %s surface` × 3 |
| ⑤ `outline-none` 차단 | `lets no component strip the indicator` |
| ⑥ `focus:ring` 차단 | `lets no component shadow the inner ring` |
| (추가) 두 링 상호 대비 | `keeps the two rings distinguishable` |

### Design 대비 의도적 확장 2건

두 건 모두 Design 명세를 **좁히지 않고 넓힌** 변경이며, 구현 중 근거가 드러나 반영했다.

1. **정적 `ring-` 도 차단** — Design §2.5 ⑥은 `focus:ring-` 만 명시했으나, DG 필드처럼 **정적** ring 도 포커스 시 `box-shadow` 를 덮어쓴다(§2.3 이 그 사례). 패턴을 `focus:ring-|ring-\d` 로 확장.
2. **주석 제외 스캔** — 금지 유틸을 *설명하는* 주석이 스스로를 위반으로 신고했다. 실제로 `QuoteForm.tsx` 주석 때문에 가드가 실패했고, 주석/블록주석을 벗겨낸 뒤 검사하도록 수정.

---

## 3. 검증 증거

### 정적

| 게이트 | 결과 |
|---|---|
| lint | 0 |
| tsc | 0 |
| test | **94 passed** (85 → 94) |
| CI build (ubuntu) | pass |
| Vercel | pass |

### 결함 주입 3종 (Design NFR "가드 실효성")

| 주입 | 실패한 테스트 | 판정 |
|---|---|---|
| `outline-offset` 2px → 4px | `keeps the rings flush` | ✅ |
| `commonClass` 에 `outline-none` 재삽입 | `lets no component strip the indicator` | ✅ |
| `box-shadow` 제거(단일 gold 링 회귀) | `draws two layers` / `token 참조` / `flush` (3건) | ✅ |

각각 원복 확인.

### 실브라우저 스팟체크 (Design NFR "시각 확인" — 이번 Check 에서 수행)

헤드리스 Chromium 에 **실제 Tab 키 입력**을 주어 `:focus-visible` 을 발동시켰다. 프로그래밍 방식 `.focus()` 는 `:focus-visible` 을 트리거하지 않으므로 키 입력이 필수.

| 대상 | `:focus-visible` | 계산된 outline | 계산된 box-shadow | 육안 |
|---|---|---|---|---|
| `/quote` `companyName` 입력 (흰 카드) | `true` | `rgb(231,201,154) solid 3px`, offset 2px | `rgb(0,17,18) 0 0 0 2px` | ✅ 뚜렷 |
| 홈 FAQ `<summary>` (밝은 섹션) | `true` | 동일 | 동일 | ✅ 뚜렷 |

- `/quote` 에 `input/select/textarea` **28개 렌더**, `outline-none` 사용 **0개** → **FR-02 / WCAG 2.4.7 Level A 해소 확정**
- 밝은 섹션은 변경 전 1.47:1 로 사실상 비가시였던 케이스 — 육안으로 명확히 개선
- 서빙 CSS 55,854 B (0바이트 아님), `:focus-visible` 규칙 두 겹 모두 정상 서빙

### Design 미해결 항목 처리

| Design §4 미해결 | 결과 |
|---|---|
| `outline` + `border-radius` 브라우저 지원 | Chromium 에서 라운드 코너 정상 추종 확인. **다른 엔진 하한 버전은 여전히 미확인** — Firefox/Safari 실기 확인 필요 |
| 이중 링 5px + offset 2px 의 조밀 레이아웃 겹침 | 폼·FAQ 에서 겹침 없음. 푸터 링크 6개는 미확인 |

---

## 4. 잔여 (Low)

- Tailwind 가 모든 소스를 평문 스캔하므로, 가드 테스트와 `DESIGN.md` 가 금지 유틸명을 **언급하는 것만으로** 죽은 `.outline-none` 클래스가 생성된다(~60B). 렌더 요소 0개, 기능 영향 없음.
- Firefox/Safari 포커스 링 렌더 미확인.
- 푸터(어두운 표면) 링크 6개 육안 미확인.

---

## 5. 신규 발견 — 히어로 출처 링크 (본 사이클 범위 밖, **Level A**)

스팟체크 중 어두운 히어로에서 포커스 링이 보이지 않아 조사한 결과, **링 자체의 결함이 아니라** 조상 요소의 opacity 애니메이션이 링까지 감쇠시키는 것이었다.

```
포커스된 링크의 계산값:
  outline    rgba(235, 211, 173, 0.855)   ← 감쇠됨 (본래 불투명)
  box-shadow rgba(0, 17, 18, 0.694) 0 0 0 1.3912px
```

`.ks-hero-bg-attribution` 3개 컨테이너가 `ks-hero-bg-cycle` (21s) 로 opacity 0↔1 을 순환하고, 각 컨테이너에 Unsplash 출처 링크가 2개씩 = **포커스 가능한 링크 6개**.

실측 opacity: `[0.37, 0.912, 0]` → 3초 후 `[0, 1, 0]`.
즉 **매 순간 컨테이너 2개(링크 4개)가 opacity 0 인 채로 Tab 순서에 남아 있다.** 키보드 사용자가 완전히 보이지 않는 링크로 포커스를 옮기게 되며, 포커스 표시도 함께 사라진다 — **WCAG 2.4.7 Focus Visible (Level A)**.

### 이 사이클에서 고치지 않은 이유

1. **범위 밖**: Plan §2.2 가 "포커스 순서(tabindex) 및 스킵 링크 — 별도 관심사" 로 명시적 제외.
2. **선행 결함**: `fb91a87`(히어로 Unsplash 전환) 이래 존재. 본 변경이 만든 회귀가 아니다.
3. **라이선스 결합**: Unsplash API 가이드라인은 **사진작가 출처 표기를 요구**한다. 링크를 숨기거나 Tab 순서에서 빼는 처리는 라이선스 준수와 직결되므로 즉흥 패치가 아니라 설계가 필요하다.
4. 수정 후보(`visibility` 키프레임 / `inert` / 활성 슬라이드만 렌더)마다 애니메이션 의미와 출처 표기 요건에 다른 영향을 준다.

**→ 별도 사이클 권고**: `ksways-hero-attribution-a11y`

또한 이번 가드는 **CSS 값**을 검사하므로 이런 **런타임 상속** 결함을 잡지 못한다. 후속 사이클에서 런타임 검증(실브라우저 opacity/tab 순서 점검)을 가드에 추가할지 결정할 것.

---

## 6. 결론

**Match Rate 100% — Gap 0.** Design 명세 전부 구현, 확장 2건은 모두 명세를 넓히는 방향이며 근거 기록됨.

FR-02(Level A) 는 실브라우저 28필드 확인으로 **해소 확정**. `/pdca report` 진행 가능.

신규 발견(§5)은 본 사이클의 Gap 이 아니라 **후속 사이클 후보**로 이관한다.
