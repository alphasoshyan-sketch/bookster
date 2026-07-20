// Cloudflare Workers는 요청 1건당 발생시킬 수 있는 subrequest(하위 fetch) 개수에
// 상한이 있다. 표지 검색(알라딘/예스24/교보문고)은 책 한 권당 최대 6번 fetch가 발생할 수
// 있어 추천 후보 10권을 모두 검색하면 쉽게 한도에 다다른다. 이 한도를 넘기면 그 시점에
// 실행되던 fetch가 통째로 실패하는데, 하필 이력 저장(saveRecommendedBooks)이 요청 흐름의
// 맨 마지막에 실행되어 한도를 넘긴 fetch가 되는 경우가 많았다.
// 여기서 전체 fetch 횟수를 세어, 한도에 가까워지면 표지 검색처럼 "실패해도 괜찮은"
// 요청은 미리 건너뛰게 하고, 이력 저장처럼 반드시 성공해야 하는 마지막 fetch를 위한
// 여유분을 항상 남겨둔다.
let count = 0
const BUDGET = 45
const RESERVED = 3

const originalFetch = globalThis.fetch
globalThis.fetch = (...args) => {
  count++
  return originalFetch(...args)
}

export function hasBudget() {
  return count < BUDGET - RESERVED
}
