# 추천 이력 저장 실패 디버깅 노트

## 1. 문제

로그인한 사용자가 도서 추천을 받아도 Supabase `recommended_books` 테이블(Table Editor)에
아무 행도 쌓이지 않음. 응답 자체는 200으로 정상적으로 책 목록을 반환하고 있었음.

## 2. 1차 진단 — Cloudflare subrequest 한도 초과

Cloudflare Pages Functions 실시간 로그(functions realtime log)를 확인한 결과, 매번
동일한 스택트레이스로 에러가 찍힘:

```
Error: Too many subrequests by single Worker invocation.
    at globalThis.fetch
    at saveRecommendedBooks (functions/api/recommend.js)
    at onRequestPost
```

### 원인 분석
- `functions/api/recommend.js`의 추천 흐름은 다음 순서로 fetch를 소모한다:
  1. `getUserId` — Supabase Auth 사용자 조회 (fetch 1회)
  2. `fetchPreviouslyRecommendedTitles` — 이전 추천 이력 조회 (fetch 1회)
  3. OpenAI Chat Completions 호출 (fetch 1회)
  4. `selectBooks` → `resolveVerifiedBooks` / `resolveBooks` — LLM 추천 후보(최대 10권)
     + 폴백 후보에 대해 **알라딘/예스24/교보문고** 표지 검색. 책 한 권당 최대
     3개 서점 × (기본 검색 + 제목만 재검색) = 최대 6회 fetch.
  5. `saveRecommendedBooks` — Supabase에 추천 이력 INSERT (fetch 1회, **요청 흐름의
     맨 마지막**)
- 표지 검색(4번)만으로 최대 60~120회의 fetch가 발생할 수 있어, Cloudflare Workers의
  요청당 subrequest 한도(무료 플랜 기준 요청당 50)를 이미 다 써버림.
- 그 결과 **맨 마지막에 실행되는 이력 저장 fetch(5번)가 한도를 넘긴 요청이 되어
  실패**. `saveRecommendedBooks`는 실패를 `catch`로 무시하도록 설계되어 있어
  (이력 저장 실패가 추천 결과 자체에 영향을 주지 않도록) 사용자에게는 아무 에러도
  보이지 않고 조용히 이력만 안 쌓였던 것.

## 3. 수정 내역

### 3-1. `functions/api/_fetchBudget.js` (신규)
- 전역 `fetch` 호출 횟수를 추적하는 공용 모듈.
- `hasBudget()`을 제공해, 예산(BUDGET)에서 예약분(RESERVED)을 뺀 수치 미만일 때만
  `true`를 반환.
- 한도에 가까워지면 "실패해도 괜찮은" 표지 검색은 건너뛰고, 이력 저장처럼 반드시
  성공해야 하는 마지막 fetch를 위한 여유분을 항상 남겨두는 설계.
- 초기값: `BUDGET = 45, RESERVED = 3` → 실전에서도 여전히 한도 초과 재현되어
  이후 `BUDGET = 20, RESERVED = 5`로 크게 낮춤.
- fetch가 실패(throw)하면 그 시점의 count를 `console.error`로 남겨, 실제 Cloudflare
  한도를 역산할 수 있게 계측 코드 추가.

### 3-2. `functions/api/_bookCover.js`
- `findLatestCover` 및 각 서점 검색 함수(`searchAladin`, `searchYes24`,
  `searchKyobo`)의 재검색(제목만으로 재시도) 분기에 `hasBudget()` 체크 추가.
  예산이 부족하면 추가 fetch 없이 즉시 빈 결과/스킵.

### 3-3. `functions/api/recommend.js`
- 임시 디버그용 `__fetchCount` 전역 카운터와 `X-Fetch-Count` 응답 헤더 제거
  (`_fetchBudget.js`의 정식 예산 관리 로직으로 대체).
- **진짜 버그 하나 추가 발견**: 이전 커밋(`65677e0`)이 "폴백 표지 조회는 부족한
  만큼만 수행"하도록 고쳤다고 되어 있었지만, 실제 코드는 `filter`만 하고
  `slice`를 하지 않아 **남은 폴백 후보 전체(최대 10권)**를 계속 조회하고 있었음.
  `.slice(0, shortfall)`을 추가해 정말로 부족한 개수만큼만 조회하도록 수정.

## 4. 배포/테스트 결과

- 두 차례 커밋(`fb93771`, `cdacecf`) 배포 후 로그인 상태로 추천을 2번 요청.
- 1번째 요청: 10권 추천, 2번째 요청: 4권만 추천.
- Supabase Table Editor에서 `recommended_books`에 총 14개 행(10+4) 확인 —
  **이력 저장 자체는 해결됨.**

## 5. 남은 문제 — 추천 개수 부족/중복

두 번째 요청에서 10권을 못 채우고 4권만 나온 원인 분석 (OpenAI 문제가 아님):

1. **예산을 20까지 낮춘 부작용**: `resolveVerifiedBooks`가 LLM이 준 후보를
   순서대로 표지 검색하는데, 예산이 낮으면 앞쪽 3~4권만 검색을 시도하고 나머지는
   예산 소진으로 아예 시도조차 못 한 채 "표지 없음 → 미검증 → 탈락" 처리됨.
   실제로 좋은 후보였어도 순서상 뒤에 있으면 버려짐.
2. **폴백 목록이 고정된 10권뿐**: `buildFallbackBooks`는 별자리/MBTI와 무관하게
   항상 동일한 10권(아몬드, 채식주의자, 불편한 편의점, 데미안, 어린 왕자,
   나는 나로 살기로 했다, 언어의 온도, 코스모스, 미움받을 용기, 사피엔스)을
   반환함. 사용자가 추천을 반복해서 받을수록 이 10권이 `recommended_books`
   이력에 쌓여 `excludeTitles`로 제외되고, 폴백 풀 자체가 금방 고갈됨.

### Cloudflare 유료 플랜 전환에 대한 검토
- 유료 전환 시 subrequest 한도가 50 → 1000으로 늘어남.
- **도움되는 부분**: `BUDGET`을 넉넉히 올리면 LLM 후보 10권 + 필요한 폴백을
  예산 걱정 없이 다 검증할 수 있어, "순서 때문에 탈락"하는 문제(위 1번)는
  확실히 해결됨.
- **안 풀리는 부분**: 폴백 목록이 고정 10권인 구조적 문제(위 2번)는 예산과
  무관하므로, 유료 전환만으로는 완전히 해결되지 않음. 반복 이용자는 여전히
  폴백 풀 고갈을 겪을 수 있음.
- 유료 전환은 월 비용(Workers Paid $5/월)이 발생.

### 다음 단계 (미결정, 사용자 선택 대기)
- (A) 무료로 코드 개선: 예산을 지금 실패 안 나는 선에서 점진적으로 올려보고,
  폴백 목록을 20~30권 이상으로 확장(가능하면 별자리/MBTI별로 다양화)
- (B) Cloudflare Workers 유료 플랜 전환 후 예산 상향
- (A) 먼저 시도해보고 부족하면 (B) 고려하는 순서를 권장했음.
