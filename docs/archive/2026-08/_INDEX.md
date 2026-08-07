# PDCA Archive Index — 2026-08

| Feature | 기간 | 결과 | Match Rate | 문서 |
|---------|------|------|-----------|------|
| [ksways-focus-ring-contrast](ksways-focus-ring-contrast/) | 2026-08-07 (당일) | **완료** — 키보드 포커스 링을 이중화(navy 2px `box-shadow` 내곽 + gold 3px `outline` 외곽, offset 2px). 브론즈가 중간톤이라 단일 색으로 밝은·어두운 표면 동시 만족이 불가함을 후보 4종 실측으로 확인하고 상호 보완 구조 채택 — 최저 마진 12.14:1(변경 전 paper 1.47:1 / white 1.59:1). **견적 폼 28필드의 `outline-none`+14% ring(1.14:1) 제거로 WCAG 2.4.7 Level A 해소**, 실브라우저 Tab 순회로 육안 확정. 신규 가드 `src/focus-visible.test.ts` 9건(표면별 대비 계산·두 링 상호 대비·`outline-none`/ring 유틸 차단, 주석 제외 스캔) — 결함 주입 3종 재현 확인. 85→94 tests. PR #21 squash `b40275b`. **신규 발견 이관: 히어로 Unsplash 출처 링크 6개 중 4개가 매 순간 opacity 0 인 채 Tab 순서 잔존(Level A) → `ksways-hero-attribution-a11y`** | 100% | [plan](ksways-focus-ring-contrast/ksways-focus-ring-contrast.plan.md) · [design](ksways-focus-ring-contrast/ksways-focus-ring-contrast.design.md) · [analysis](ksways-focus-ring-contrast/ksways-focus-ring-contrast.analysis.md) · [report](ksways-focus-ring-contrast/ksways-focus-ring-contrast.report.md) |

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
