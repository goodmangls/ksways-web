# PDCA Archive Index — 2026-08

| Feature | 기간 | 결과 | Match Rate | 문서 |
|---------|------|------|-----------|------|
| [ksways-focus-ring-contrast](ksways-focus-ring-contrast/) | 2026-08-07 (당일) | **완료** — 키보드 포커스 링을 이중화(navy 2px `box-shadow` 내곽 + gold 3px `outline` 외곽, offset 2px). 브론즈가 중간톤이라 단일 색으로 밝은·어두운 표면 동시 만족이 불가함을 후보 4종 실측으로 확인하고 상호 보완 구조 채택 — 최저 마진 12.14:1(변경 전 paper 1.47:1 / white 1.59:1). **견적 폼 28필드의 `outline-none`+14% ring(1.14:1) 제거로 WCAG 2.4.7 Level A 해소**, 실브라우저 Tab 순회로 육안 확정. 신규 가드 `src/focus-visible.test.ts` 9건(표면별 대비 계산·두 링 상호 대비·`outline-none`/ring 유틸 차단, 주석 제외 스캔) — 결함 주입 3종 재현 확인. 85→94 tests. PR #21 squash `b40275b`. **신규 발견 이관: 히어로 Unsplash 출처 링크 6개 중 4개가 매 순간 opacity 0 인 채 Tab 순서 잔존(Level A) → `ksways-hero-attribution-a11y`** | 100% | [plan](ksways-focus-ring-contrast/ksways-focus-ring-contrast.plan.md) · [design](ksways-focus-ring-contrast/ksways-focus-ring-contrast.design.md) · [analysis](ksways-focus-ring-contrast/ksways-focus-ring-contrast.analysis.md) · [report](ksways-focus-ring-contrast/ksways-focus-ring-contrast.report.md) |
| [ksways-hero-attribution-a11y](ksways-hero-attribution-a11y/) | 2026-08-07 (당일) | **완료** — 히어로 Unsplash 출처 링크 6개 중 4개가 `opacity: 0` 인 채 Tab 순서에 잔존(WCAG 2.4.7 **Level A**), `prefers-reduced-motion` 에서는 **영구**. `opacity` 를 선언하는 **3곳 전부**(키프레임·reduced-motion·**기본 규칙**)에 `visibility` 동반으로 해소. 선행 실험(`animation-play-state: paused` + 음수 delay 로 진행률 고정)으로 페이드 구간 안전성 실증 → Plan 최대 리스크 반증. **Gap 은 구현이 아니라 Design 초안에 있었다**: `animation-delay` 가 양수라 딜레이 구간엔 기본 규칙이 적용되는데 초안이 이를 놓쳐 로드 후 14초간 결함 잔존했고, 정적 가드 13건도 같은 사각지대라 GREEN — **실브라우저 Tab 순회가 잡음**. Design v0.2 로 정정. 가드 5건·결함 주입 3종. 94→99 tests. PR #22 squash `a58b008` | **84%** (Gap 4건 전건 Do 단계 해소) | [plan](ksways-hero-attribution-a11y/ksways-hero-attribution-a11y.plan.md) · [design](ksways-hero-attribution-a11y/ksways-hero-attribution-a11y.design.md) · [analysis](ksways-hero-attribution-a11y/ksways-hero-attribution-a11y.analysis.md) · [report](ksways-hero-attribution-a11y/ksways-hero-attribution-a11y.report.md) |
| [ksways-cross-browser-verification](ksways-cross-browser-verification/) | 2026-08-07 (당일) | **부분 완료 (경로 B)** — a11y 두 사이클이 핵심 CSS 를 Chromium 에서만 확인한 것이 누적돼 착수. 조사 결과 **타깃은 미정의가 아니라 미문서화**였다: Next 가 `MODERN_BROWSERSLIST_TARGET`(chrome/edge/firefox 111, safari 16.4)을 이미 강제 중. 실효값을 채택·문서화하고 `browserslist` 설정 파일은 **의도적으로 미도입**(Tailwind v4 는 참조 0건이라 CSS 영향 없음이 반증됐고, Next 기본값 복제는 뒤처짐만 유발) — 대신 `src/browser-target.test.ts` 가 값을 감시. **Firefox 153 A 5/5·B 5/5·C 통과.** 검증 도구: 공유 프로브(실제 globals.css 인라인) + Playwright 러너 + **safaridriver WebDriver 러너(npm 의존성 0)**. 비용 실측 후 WebKit 77MB 제외(WebKit≠Safari, 실기 보유). CI 미포함·playwright devDep 미추가. 99→102 tests. PR #23 squash `dc5110f`. ⏸️ **Safari 실행은 환경 권한 차단으로 이관** → `ksways-safari-verification` (재개 비용 ~1분) | **75%** (FR 3/4, 경로 B 확정) | [plan](ksways-cross-browser-verification/ksways-cross-browser-verification.plan.md) · [design](ksways-cross-browser-verification/ksways-cross-browser-verification.design.md) · [analysis](ksways-cross-browser-verification/ksways-cross-browser-verification.analysis.md) · [report](ksways-cross-browser-verification/ksways-cross-browser-verification.report.md) |

---

## PDCA 밖 작업 (문서 없음, 참조용)

| 작업 | 기간 | 결과 |
|---|---|---|
| brand-pivot-bronze | 2026-08-07 | PDCA 사이클 밖 진행·머지(PR #20 squash `e7de26c`). 네온틸→브론즈 피벗이 `HomePage.tsx` 한 파일에만 적용된 채 78/78 GREEN 이던 상태를 전역 적용 — 구 팔레트 129건(hex 27 + rgba 8 + 고아 SVG 102) → **0건**, CTA `text-white` on 브론즈 3.08:1 → `ink` 6.26:1, CSS 변수 역할 기반 재명명, `kicker` 죽은 데이터 12건 제거, `DESIGN.md` 동기화. 신규 `src/brand-palette.test.ts` 7건(저장소 전역 스윕·대비 계산·문서↔코드 일치). 78→85 tests. 후속 ①이 위 사이클 |

## 이 달의 학습

- **토큰 참조 단언은 값을 지키지 못한다.** `expect(css).toContain('var(--ks-cyan)')` 는 그 뒤의 색이 바뀌어도 GREEN. 디자인 토큰은 값을 직접 단언하고, 전역 잔존 0건 스윕을 함께 둘 것 — 부분 적용이 이 계열의 실패 양상이다.
- **중간톤 액센트는 단일 포커스 링으로 커버 불가.** 표면이 밝고 어두운 두 종류면 상호 보완하는 두 겹이 단일 색 튜닝보다 구조적으로 안전하다.
- **`:focus-visible` 은 헤드리스로 검증 가능하다.** 실제 Tab 키 입력을 주면 발동한다(프로그래밍 `.focus()` 는 안 됨). 초기에 "headless 불가" 로 판단해 수동 스팟체크로 미룬 것은 오판이었다.
- **금지 패턴 가드는 자기 문서를 위반으로 신고한다.** 금지 유틸을 설명하는 주석이 스캔에 걸린다 — 주석을 벗겨낸 뒤 검사할 것.
- **CSS 값 가드는 런타임 상속 결함을 못 잡는다.** 규칙이 올바른데 조상의 opacity 애니메이션이 포커스 링까지 감쇠시킨 사례가 실제로 나왔다.
- **Tailwind 는 주석까지 평문 스캔한다.** 소스에 등장하는 문자열이 곧 빌드 산출물이 된다.
- **`next dev` 는 `next-env.d.ts` 를 수정한다**(`.next/types` → `.next/dev/types`). 실브라우저 검증 후 스테이징에 섞이면 CI 빌드와 어긋난다.
- **범위는 "무엇을 고치나" 가 아니라 "그 속성이 선언된 모든 곳" 으로 잡을 것.** `animation-delay` 가 양수이고 `animation-fill-mode` 가 없으면 딜레이 구간의 실효 스타일은 키프레임이 아니라 기본 규칙이다.
- **정적 가드의 검사 범위를 설계 범위와 같게 잡으면, 설계가 놓친 것은 가드도 놓친다.** 가드는 "그 속성이 나타날 수 있는 곳 전체" 를 훑어야 한다.
- **실브라우저 검증은 정적 검증의 대체재가 아니라 상위 검증이다.** "정적 단언이 타당한 대리" 라는 판단이 옳아도, 대리의 범위가 좁으면 대리도 좁다.
- **결함 주입은 "주입이 실제로 일어났는지" 부터 확인할 것.** 주입 스크립트가 조용히 실패하면 "가드 통과" 는 무의미하다 — 제거된 줄 수를 단언해 검증.
- **Gap 이 구현이 아니라 설계에 있을 수 있다.** "Design → 구현 충실도" 만 재면 100% 로 보인다. 요구사항 기준으로 재야 드러난다.
- **"미정의" 로 보이는 것이 "미문서화" 일 수 있다.** 설정 파일이 없다고 기본값이 없는 것은 아니다 — Next 는 `browserslist` 가 없으면 자체 기본 타깃을 강제한다. 새 값을 발명하기 전에 실효값을 찾을 것.
- **설정 파일을 넣지 않는 것도 결정이다.** 상위 도구의 기본값을 복제해 두면 그 도구가 기본을 올릴 때 조용히 뒤처진다. 값을 고정하는 대신 **값을 감시**하는 편이 나을 수 있다.
- **검증이 사용자 설정에 좌우되면 안 된다.** Safari 의 Tab 하이라이트 설정은 `<a>` 만 좌우하고 폼 컨트롤은 무관하므로, 프로브에 `<input>` 을 넣어 설정 의존성을 제거했다.
- **인증과 권한은 다르다.** `safaridriver --enable`(인증)과 Safari "원격 자동화 허용"(권한)은 별개다. 오류 메시지를 끝까지 읽을 것.
- **`not a tty` 환경에서 Authorization 암호 입력은 실패한다.** 대화형 인증이 필요한 명령은 실제 터미널에서.
