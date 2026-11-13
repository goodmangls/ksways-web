# Code Analysis Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 2026-09-17 코드 분석에서 나온 결함 중 실제로 남은 두 건을 처리한다 — 필수 필드 목록 4중 복제 해소, 도달 불가능한 `/api/unsplash` 표면 제거.

**Architecture:** Task 1 은 단일 출처 파생으로 조용한 실패를 막는다. Task 2 는 삭제다 — 도달 불가 라우트를 지우면 `in` 연산자 허용목록 우회·레이트리미터 O(n) 스윕·무제한 키맵·`x-forwarded-for` 최좌측 사용이 **수정 없이 함께 사라진다**(네 건 모두 그 라우트를 통해서만 도달 가능). 두 태스크는 서로 다른 파일을 건드리고 의존하지 않는다.

**Tech Stack:** Next.js 16 App Router, TypeScript, vitest, Playwright

**Spec:** 없음. 이 계획의 근거는 2026-09-17 세션의 `/code_analysis` 결과이며, 각 주장은 아래 Evidence 블록에 재현 명령과 함께 기록했다. 스펙이 없으므로 판정(ruling)은 잠정적이다.

## Global Constraints

- **라이브 페이지 동작 변경 금지.** 두 태스크 모두 사용자에게 보이는 동작을 바꾸지 않는다.
- **게이트 유지:** `npm run lint` 0 · `npm run type-check` 0 · `npm run test:coverage` 통과.
- **커버리지 하한:** 79 / 75 / 85 / 79 (statements / branches / functions / lines). 작업 전 실측 85.04 / 80.52 / 89.34 / 84.95.
- **새 가드는 결함 주입으로 증명한다.** 통과만으로는 증거가 아니다. 주입은 **한 번에 하나씩** — 여러 개를 동시에 주입하면 기존 단언이 먼저 실패해 새 가드의 발화 여부를 알 수 없다(2026-09-17 실제 사례).
- **`.commit_message.txt`** 에 한 줄 한국어 설명을 남긴다.
- **git 은 `/Library/Developer/CommandLineTools/usr/bin/git`** 을 쓴다. 기본 `git` 은 Xcode 라이선스 미동의로 막혀 있고 **exit 0 이 아닌 69** 로 죽는다.
- **`npm run dev` / e2e 실행은 `next-env.d.ts` 를 오염시킨다.** 커밋 전 `git checkout -- next-env.d.ts`.
- 로컬 `npm run build` 는 macOS 한정으로 실패한다(`/_global-error` prerender). **원인 재조사 금지**, 빌드 검증은 CI 담당.

---

### Task 1: 필수 필드 단일 출처 파생

**Files:**
- Modify: `src/lib/quote-form.ts:135` (`requiredQuoteFieldNames` 선언)
- Modify: `src/components/QuoteForm.tsx:5-18` (import 블록), `src/components/QuoteForm.tsx:96` (`focusFirstMissingField`)
- Test: `src/lib/quote-form.test.ts`

**Interfaces:**
- Consumes: `quoteFormFields: QuoteFormField[]` (이미 `quote-form.ts:102` 에 존재, `required?: boolean` 필드 보유)
- Produces: `requiredQuoteFieldNames: readonly (keyof QuoteFormValues)[]` — 파생값. 이름과 export 위치는 그대로라 외부 호출부는 수정 불필요.

**Evidence (착수 전 확인용):**

같은 목록이 네 곳에 하드코딩돼 있고 서로를 검증하지 않는다.

```bash
grep -n "requiredQuoteFieldNames" src/lib/quote-form.ts        # 135(선언), 165(사용)
grep -n "companyName', 'contactName'" src/components/QuoteForm.tsx  # 96
grep -c "required: true" src/lib/quote-form.ts                 # 6
```

`as const satisfies readonly (keyof QuoteFormValues)[]` 는 **이름이 유효한 키인지만** 검사한다. `required: true` 집합과 일치하는지는 검사하지 않는다.

**파생 순서가 현재 리터럴과 동일함은 확인됨** — 선언 순서 `companyName contactName emailOrPhone origin destination commodity` 가 기존 배열과 같다. 따라서 이 태스크는 동작 변경이 아니다.

- [ ] **Step 1: 세 출처를 묶는 실패 테스트 작성**

`src/lib/quote-form.test.ts` 의 기존 `it('identifies required quote fields before opening the email draft', ...)` 바로 뒤에 추가:

```ts
  it('derives the required-field list from the field definitions, not a parallel literal', () => {
    // 이 세 곳이 어긋나면 UI 는 필수라고 표시하는데 검증·포커스는 그 필드를 모른다.
    // 조용한 실패이므로 단언으로 묶는다.
    const declaredRequired = quoteFormFields.filter((field) => field.required).map((field) => field.name);

    expect([...requiredQuoteFieldNames]).toEqual(declaredRequired);
    expect(declaredRequired.length).toBeGreaterThan(0);
  });
```

- [ ] **Step 2: 테스트 실행 — 현재는 통과함을 확인**

Run: `npx vitest run src/lib/quote-form.test.ts -t "derives the required-field list"`
Expected: PASS (현재 두 목록이 우연히 일치하므로 통과한다. 이 시점의 PASS 는 증거가 아니다 — Step 3 에서 판별력을 증명한다.)

- [ ] **Step 3: 결함 주입으로 가드의 판별력 증명**

`src/lib/quote-form.ts` 의 `hsCode` 필드에 `required: true` 를 임시로 추가한다:

```ts
  { name: 'hsCode', label: 'HS code', placeholder: '3304.99', section: 'cargo', required: true },
```

Run: `npx vitest run src/lib/quote-form.test.ts -t "derives the required-field list"`
Expected: **FAIL** — `expected [ 'companyName', ... ] to deeply equal [ 'companyName', ..., 'hsCode' ]`

주입을 되돌린다:
```bash
/Library/Developer/CommandLineTools/usr/bin/git checkout -- src/lib/quote-form.ts
```

실패가 나지 않으면 가드가 무효다. 멈추고 보고할 것.

- [ ] **Step 4: `requiredQuoteFieldNames` 를 파생으로 교체**

`src/lib/quote-form.ts:135` 의 리터럴 배열을 대체:

```ts
// 단일 출처: quoteFormFields 의 required 플래그에서 파생한다.
// 예전에는 같은 목록이 병렬 리터럴로 중복돼 있었고, 두 곳이 어긋나도
// 아무 테스트가 잡지 못했다(필드를 추가하면 UI 만 필수 표시되고
// 검증·포커스는 조용히 무시). quote-form.test.ts 가 이 파생을 고정한다.
export const requiredQuoteFieldNames: readonly (keyof QuoteFormValues)[] = quoteFormFields
  .filter((field) => field.required)
  .map((field) => field.name);
```

주의: `quoteFormFields` 가 먼저 선언(102행)돼 있어야 한다. 이미 그렇다.

- [ ] **Step 5: 테스트 실행**

Run: `npx vitest run src/lib/quote-form.test.ts`
Expected: PASS (기존 `toEqual([...])` 단언 포함 전부)

- [ ] **Step 6: `QuoteForm.tsx` 의 네 번째 사본 제거**

import 블록(5-18행)의 알파벳 순서를 지켜 `requiredQuoteFieldNames` 를 추가한다 — `QUOTE_MAILTO_LENGTH_LIMIT` 와 `quoteFormFields` 사이:

```ts
  QUOTE_MAILTO_LENGTH_LIMIT,
  quoteFormFields,
  requiredQuoteFieldNames,
  transportModeOptions,
```

`focusFirstMissingField`(96행)의 하드코딩 배열을 교체:

```ts
  function focusFirstMissingField() {
    const firstMissingName = requiredQuoteFieldNames.find((name) => !values[name]?.trim());
    const field = firstMissingName ? formRef.current?.querySelector<HTMLElement>(`[name="${firstMissingName}"]`) : null;
    field?.focus();
    field?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
```

`requiredQuoteFieldNames` 가 이미 `keyof QuoteFormValues` 로 타입돼 있어 기존의 `name as keyof QuoteFormValues` 캐스트가 불필요해진다.

- [ ] **Step 7: 전체 게이트**

Run: `npm run lint && npm run type-check && npm run test:coverage`
Expected: lint 0, tsc 0, 127 tests pass(기존 126 + 신규 1), 커버리지 하한 이상

- [ ] **Step 8: 커밋**

```bash
G=/Library/Developer/CommandLineTools/usr/bin/git
printf '%s\n' "🔗 fix(quote): 필수 필드 목록 4중 복제 해소 — quoteFormFields 의 required 플래그에서 파생하고 가드 테스트로 고정(결함 주입 검증)" > .commit_message.txt
$G add src/lib/quote-form.ts src/lib/quote-form.test.ts src/components/QuoteForm.tsx .commit_message.txt
$G commit -m "🔗 fix(quote): 필수 필드 목록 4중 복제 해소

같은 6개 목록이 네 곳(quoteFormFields 의 required:true, requiredQuoteFieldNames
리터럴, QuoteForm.focusFirstMissingField, 테스트 기대값)에 하드코딩돼 있었고
서로를 검증하지 않았다. 7번째 required 필드를 추가하면 UI 는 필수로 표시하는데
검증과 포커스는 그 필드를 모르는 조용한 실패가 난다.

as const satisfies 는 이름이 유효한 키인지만 보고 required:true 집합과
일치하는지는 보지 않는다.

파생으로 바꾸고 가드 테스트를 추가했다. hsCode 에 required:true 를 주입해
가드가 실제로 발화하는 것을 확인했다(파생 순서는 기존 리터럴과 동일해
동작 변경 없음)."
```

---

### Task 2: 도달 불가능한 `/api/unsplash` 표면 삭제

**Files:**
- Delete: `src/app/api/unsplash/route.ts`, `src/app/api/unsplash/route.test.ts`
- Delete: `src/lib/rate-limit.ts`, `src/lib/rate-limit.test.ts`
- Modify: `src/lib/unsplash.ts` (도달 불가 export 제거)
- Modify: `src/lib/unsplash.test.ts` (삭제된 export 를 참조하는 케이스 제거)

**Interfaces:**
- Consumes: 없음(Task 1 과 독립)
- Produces: `src/lib/unsplash.ts` 의 잔존 export — `UNSPLASH_APP_NAME`, `UNSPLASH_CACHE_REVALIDATE_SECONDS`, `ALLOWED_UNSPLASH_TOPICS`, 전체 타입, `normalizeUnsplashPhoto`, `getHeroUnsplashImages`, `withReferralParams`

**Evidence (착수 전 확인용):**

```bash
grep -rn "api/unsplash" src e2e | grep -v "^src/app/api/unsplash"   # 주석 1줄뿐
grep -rn "fetch(" src --include='*.ts' --include='*.tsx' | grep -v "fetcher = fetch"  # 0건
grep -rn "createFixedWindowRateLimiter" src | grep -v "^src/lib/rate-limit"  # route.ts 만
grep -n "resolveTopic" src/lib/unsplash.ts   # 85(선언), 117·323(호출) — 둘 다 라우트 경유만
```

파킹된 `docs/01-plan/features/ksways-unsplash-attribution.plan.md` 의 **§2.2 Out of Scope** 가 "런타임 Unsplash API 전환 — 하드코딩 큐레이션 구조 자체는 유지" 라고 못박는다. 즉 향후 계획된 소비자도 없다.

**이 삭제로 함께 사라지는 결함 3건** (수정 불필요):
1. `resolveTopic` 의 `in` 연산자가 `constructor` · `__proto__` · `toString` 을 허용목록 통과시킴
2. 레이트리미터가 요청마다 맵 전체를 순회(O(n))
3. `x-forwarded-for` 최좌측 값 사용

**보존 결정(ruling):** `normalizeUnsplashPhoto` 는 삭제 후 호출자가 0이 되지만 **남긴다.** 파킹된 plan 이 이 함수를 "API 경로는 `photo.user.name` 등을 정상적으로 채운다"는 근거로 인용하며 재개 시 build-on 대상으로 삼는다. 틀렸을 경우 비용: 사용되지 않는 함수 1개와 그 테스트가 남는다.

- [ ] **Step 1: 삭제 전 기준선 기록**

```bash
npm run test:coverage 2>&1 | grep -E "^All files|Tests "
```

출력을 기록해 둔다. Step 6 에서 커버리지 변동을 비교한다.

- [ ] **Step 2: 라우트와 레이트리미터 삭제**

```bash
G=/Library/Developer/CommandLineTools/usr/bin/git
$G rm src/app/api/unsplash/route.ts src/app/api/unsplash/route.test.ts
$G rm src/lib/rate-limit.ts src/lib/rate-limit.test.ts
rmdir src/app/api/unsplash src/app/api 2>/dev/null || true
```

- [ ] **Step 3: `unsplash.ts` 의 도달 불가 export 제거**

다음 네 가지를 삭제한다:

1. `export const UNSPLASH_LIVE_MODE_MAX_REQUESTS = 10;` (4행) — 주석 포함
2. `function resolveTopic(...)` (85행)
3. `export async function searchUnsplashImages({...})` (106행부터 함수 전체)
4. `export function getApprovedUnsplashImages(topic?: string)` (318행부터 함수 전체)

`SearchUnsplashResult` 타입(74행)도 `searchUnsplashImages` 의 반환 타입 전용이므로 함께 삭제한다.

`ALLOWED_UNSPLASH_TOPICS` 와 `UnsplashTopic` 은 **남긴다** — `ApprovedUnsplashImage` 타입이 `topic` 필드에서 참조하고, `approvedUnsplashImages` 배열이 그 값을 쓴다.

- [ ] **Step 4: 테스트에서 삭제된 export 참조 제거**

Run: `npx vitest run src/lib/unsplash.test.ts`

실패하는 케이스는 삭제된 함수를 부르는 것들이다. 해당 `it(...)` 블록과 import 를 제거한다. `normalizeUnsplashPhoto` · `getHeroUnsplashImages` · `withReferralParams` 테스트는 **남긴다**.

- [ ] **Step 5: 타입·린트 확인**

Run: `npm run type-check && npm run lint`
Expected: 둘 다 0. 에러가 나면 놓친 참조가 있다는 뜻이므로 그 파일을 고친다.

- [ ] **Step 6: 커버리지 하한 재확인**

Run: `npm run test:coverage 2>&1 | grep -E "^All files|Tests "`
Expected: 하한 79 / 75 / 85 / 79 이상.

**잘 테스트된 파일을 지우면 커버리지가 내려갈 수 있다.** Step 1 기준선과 비교한다. 하한을 깨면 **하한을 낮추지 말고** 멈추고 보고한다 — 그건 발견이지 조정할 숫자가 아니다.

- [ ] **Step 7: e2e 로 라이브 동작 무변경 확인**

Run: `npm run test:e2e`
Expected: 15/15 pass

```bash
/Library/Developer/CommandLineTools/usr/bin/git checkout -- next-env.d.ts
```

- [ ] **Step 8: 커밋**

```bash
G=/Library/Developer/CommandLineTools/usr/bin/git
printf '%s\n' "🗑️ refactor(api): 도달 불가 /api/unsplash 표면 삭제 — 호출자 0·fetch 0·파킹된 plan 도 out of scope. in 연산자 우회·O(n) 스윕·x-forwarded-for 3건이 수정 없이 함께 해소" > .commit_message.txt
$G add -A
$G commit -m "🗑️ refactor(api): 도달 불가 /api/unsplash 표면 삭제

호출자가 없다. src/ 전체에 fetch( 가 0건이고, api/unsplash 문자열은
주석 한 줄뿐이다. 히어로는 getHeroUnsplashImages() 의 하드코딩 배열을 쓴다.

파킹된 ksways-unsplash-attribution plan 의 §2.2 Out of Scope 가
'런타임 Unsplash API 전환 — 하드코딩 큐레이션 구조 자체는 유지' 라고
못박으므로 향후 계획된 소비자도 없다.

삭제로 결함 3건이 수정 없이 사라진다:
- resolveTopic 의 in 연산자가 constructor·__proto__ 를 허용목록 통과시킴
- 레이트리미터가 요청마다 맵 전체 순회(O(n)) + 키 개수 무제한
- x-forwarded-for 최좌측 값 사용

normalizeUnsplashPhoto 는 호출자 0 이 되지만 남긴다 — 파킹된 plan 이
재개 시 build-on 대상으로 인용한다."
```

---

## Self-Review

**1. Spec coverage** — 스펙이 없으므로 `/code_analysis` 결과 5건 대조:

| 결함 | 처리 |
|---|---|
| High: 필수 필드 4중 복제 | Task 1 |
| Medium: `in` 연산자 허용목록 우회 | Task 2 삭제로 해소 |
| Medium: `/api/unsplash` 도달 불가 | Task 2 |
| Low: 레이트리미터 O(n) 스윕 + 무제한 키 | Task 2 삭제로 해소 |
| Low: `x-forwarded-for` 최좌측 | Task 2 삭제로 해소 |

누락 없음.

**2. Placeholder scan** — TBD·TODO·"적절히 처리" 없음. 모든 코드 단계에 실제 코드 블록이 있다.

**3. Type consistency** — `requiredQuoteFieldNames` 의 타입이 `as const satisfies readonly (keyof QuoteFormValues)[]`(튜플 리터럴)에서 `readonly (keyof QuoteFormValues)[]`(배열)로 넓어진다. 기존 소비자 `getMissingRequiredQuoteFields`(165행)는 `.filter().map()` 만 하므로 영향 없고, 테스트의 `toEqual([...])` 도 값 비교라 통과한다. Task 2 의 잔존 export 목록은 Step 3 의 삭제 목록과 상보적이다.

**4. 태스크 독립성** — Task 1 은 `quote-form.ts` · `QuoteForm.tsx` · `quote-form.test.ts`, Task 2 는 `unsplash.ts` · `rate-limit.ts` · `api/`. 공유 파일은 `.commit_message.txt` 뿐이고 순차 실행이므로 충돌하지 않는다.
