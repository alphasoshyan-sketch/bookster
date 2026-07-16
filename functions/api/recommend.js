import { findLatestCover } from './_bookCover.js'
import { CORS_HEADERS, handleOptions } from './_cors.js'

export const onRequestOptions = handleOptions

// 표지 검색(알라딘/예스24/교보)은 실패할 수 있으므로 찾으면 붙이고 못 찾아도 책 자체는
// 그대로 통과시킨다 (프론트엔드가 coverUrl 없는 책은 Google Books로 다시 조회한다).
async function resolveBooks(books, env) {
  return Promise.all(
    books.map(async book => {
      try {
        const best = await findLatestCover(book.title, book.author, env)
        return best ? { ...book, coverUrl: best.coverUrl, coverSource: best.source, pubDate: best.pubDate } : book
      } catch {
        return book
      }
    })
  )
}

// LLM이 추천한 책은 알라딘/예스24/교보문고(국내 서점) 중 한 곳에서라도 실제로 검색되는
// 경우에만 채택한다. 이 서점들은 한국어 번역본/한국 저자 도서 위주로 취급하므로, 어디서도
// 검색되지 않는 책은 미번역 해외원서이거나 LLM이 지어낸 책일 가능성이 높아 걸러낸다.
async function resolveVerifiedBooks(books, env) {
  const resolved = await resolveBooks(books, env)
  return resolved.filter(book => book.coverUrl)
}

function buildFallbackBooks(zodiac, mbti) {
  return [
    {
      title: '아몬드',
      author: '손원평',
      reason: `${zodiac}의 감수성과 ${mbti}의 깊은 내면 성향을 잘 살려주는 소설입니다. 인간의 마음을 정교하게 그려내며 여운을 남깁니다.`,
    },
    {
      title: '채식주의자',
      author: '한강',
      reason: `${zodiac}의 예민한 감각과 ${mbti}의 내면 탐구 성향이 만나 깊이 몰입할 수 있는 소설입니다. 강렬한 이미지와 여운이 오래 남습니다.`,
    },
    {
      title: '불편한 편의점',
      author: '김호연',
      reason: `${zodiac}의 따뜻한 시선과 ${mbti}의 사람에 대한 관심을 자극하는 소설입니다. 평범한 일상 속 온기를 잔잔하게 그려냅니다.`,
    },
    {
      title: '데미안',
      author: '헤르만 헤세',
      reason: `${zodiac}의 내면 성장 욕구와 ${mbti}의 자아 탐구 성향에 깊이 와닿는 성장 소설입니다. 자기 자신에게 이르는 길을 그려냅니다.`,
    },
    {
      title: '어린 왕자',
      author: '앙투안 드 생텍쥐페리',
      reason: `${zodiac}의 순수한 감성과 ${mbti}의 본질을 꿰뚫는 사고를 자극하는 우화입니다. 짧지만 깊은 여운을 남기는 고전입니다.`,
    },
    {
      title: '나는 나로 살기로 했다',
      author: '김수현',
      reason: `${zodiac}의 자신만의 길을 찾고 싶은 마음과 ${mbti}의 자기 이해 욕구를 잘 반영한 자기계발서입니다. 삶의 방향을 정리하는 데 도움이 됩니다.`,
    },
    {
      title: '언어의 온도',
      author: '이기주',
      reason: `${zodiac}의 섬세한 표현력과 ${mbti}의 말과 관계에 대한 고민을 어루만져 주는 에세이입니다. 짧은 글마다 따뜻한 여운이 남습니다.`,
    },
    {
      title: '코스모스',
      author: '칼 세이건',
      reason: `${zodiac}의 호기심과 ${mbti}의 탐구심을 함께 끌어올려 주는 과학 교양서입니다. 복잡한 우주를 쉽게 풀어내며 생각의 폭을 넓혀줍니다.`,
    },
    {
      title: '미움받을 용기',
      author: '기시미 이치로',
      reason: `${zodiac}의 관계 고민과 ${mbti}의 자기 성찰 욕구에 맞닿아 있는 책입니다. 아들러 심리학을 통해 삶의 방향을 다시 세우게 해줍니다.`,
    },
    {
      title: '사피엔스',
      author: '유발 하라리',
      reason: `${zodiac}의 큰 그림을 보는 시야와 ${mbti}의 지적 호기심을 자극하는 인문 교양서입니다. 인류사를 새로운 시각으로 조망합니다.`,
    },
  ]
}

function dedupByTitle(books) {
  const seen = new Set()
  return books.filter(book => {
    if (!book?.title || seen.has(book.title)) return false
    seen.add(book.title)
    return true
  })
}

// LLM이 정확히 10권을 채우지 못하거나 중복 제목을 내놓는 경우가 있어,
// 부족한 만큼 폴백 목록에서 채워 최대 10권까지 채운다. 폴백 표지 조회는
// Cloudflare Workers의 subrequest 한도를 넘지 않도록 실제로 부족한 만큼만 수행한다.
// excludeTitles(로그인 사용자의 이전 추천작)는 항상 걸러내며, 그 결과 10권을
// 못 채우더라도(추천 이력이 많이 쌓인 경우) 중복 추천은 하지 않는다.
async function selectBooks(llmBooks, zodiac, mbti, env, excludeTitles = new Set()) {
  const fallback = buildFallbackBooks(zodiac, mbti)
  const verifiedLlmBooks = await resolveVerifiedBooks(dedupByTitle((llmBooks || []).filter(b => b?.title)), env)

  const picked = []
  const used = new Set()

  function collect(resolved) {
    for (const book of resolved) {
      if (used.has(book.title) || picked.length >= 10) continue
      if (excludeTitles.has(book.title)) continue
      picked.push(book)
      used.add(book.title)
    }
  }

  collect(verifiedLlmBooks)

  if (picked.length < 10) {
    const remainingFallback = fallback.filter(b => !used.has(b.title) && !excludeTitles.has(b.title))
    collect(await resolveBooks(remainingFallback, env))
  }

  return picked
}

// Authorization 헤더의 access token으로 로그인 사용자를 조회한다. 토큰이 없거나
// 유효하지 않으면 null을 반환해 비로그인 사용자와 동일하게(추천 이력 없이) 동작시킨다.
async function getUserId(request, env) {
  const token = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '')
  const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL
  if (!token || !supabaseUrl || !env.SUPABASE_SERVICE_ROLE_KEY) return null

  try {
    const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { Authorization: `Bearer ${token}`, apikey: env.SUPABASE_SERVICE_ROLE_KEY },
    })
    if (!userResponse.ok) return null
    const user = await userResponse.json()
    return user.id || null
  } catch {
    return null
  }
}

async function fetchPreviouslyRecommendedTitles(userId, env) {
  const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL
  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/recommended_books?user_id=eq.${userId}&select=title`,
      { headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` } }
    )
    if (!res.ok) return new Set()
    const rows = await res.json()
    return new Set(rows.map(row => row.title))
  } catch {
    return new Set()
  }
}

async function saveRecommendedBooks(userId, books, env) {
  const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL
  try {
    await fetch(`${supabaseUrl}/rest/v1/recommended_books`, {
      method: 'POST',
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(books.map(book => ({ user_id: userId, title: book.title, author: book.author }))),
    })
  } catch {
    // 이력 저장 실패는 추천 결과 자체에 영향을 주지 않도록 무시한다.
  }
}

export async function onRequestPost({ request, env }) {
  const { zodiac, mbti } = await request.json()

  if (!zodiac || !mbti) {
    return new Response(JSON.stringify({ error: '별자리와 MBTI를 모두 입력해주세요.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    })
  }

  const userId = await getUserId(request, env)
  const excludeTitles = userId ? await fetchPreviouslyRecommendedTitles(userId, env) : new Set()

  if (!env.OPENAI_API_KEY) {
    const fallbackBooks = await selectBooks([], zodiac, mbti, env, excludeTitles)
    if (userId) await saveRecommendedBooks(userId, fallbackBooks, env)
    return new Response(JSON.stringify(fallbackBooks), {
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    })
  }

  const excludeNote = excludeTitles.size > 0
    ? `\n다음 책들은 이 사용자에게 이전에 이미 추천했으니, 이번에는 겹치지 않는 다른 책으로 추천해주세요: ${[...excludeTitles].join(', ')}\n`
    : ''

  const prompt = `당신은 도서 추천 전문가입니다.
사용자의 별자리는 "${zodiac}"이고 MBTI는 "${mbti}"입니다.
이 사람의 성향에 딱 맞는 실제로 존재하는 책을 총 열 권 추천해주세요.
서로 다른 장르로 다양하게 골라주세요.
${excludeNote}

반드시 아래 조건을 지켜주세요:
- 한국에서 정식으로 번역 출간된 외국 도서이거나, 한국인 저자가 쓴 책만 추천하세요.
- 국내에 번역 출간되지 않은 해외 원서(원서 그대로만 존재하는 책)는 절대 추천하지 마세요.
- 번역서의 제목은 원서 제목이 아니라 국내 출간본의 한국어 제목으로 적어주세요.

반드시 아래와 같은 JSON 배열 형식으로만 답하세요. 총 10개의 객체를 포함해야 하며, 다른 텍스트는 절대 포함하지 마세요. 아래는 형식 예시입니다:
[
  {
    "title": "책 제목",
    "author": "저자명",
    "reason": "이 책을 추천하는 이유 (2~3문장, 별자리와 MBTI 성향과 연결해서 설명)"
  }
]`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 2000,
    }),
  })

  if (!response.ok) {
    return new Response(JSON.stringify({ error: 'OpenAI API 호출에 실패했습니다.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    })
  }

  const data = await response.json()
  let content = data.choices[0].message.content.trim()
  // 모델이 지시를 무시하고 ```json ... ``` 코드펜스로 감싸는 경우가 있어 배열 부분만 추출한다.
  const arrayMatch = content.match(/\[[\s\S]*\]/)
  if (arrayMatch) content = arrayMatch[0]

  try {
    const parsed = JSON.parse(content)
    const books = await selectBooks(parsed, zodiac, mbti, env, excludeTitles)
    if (userId) await saveRecommendedBooks(userId, books, env)
    return new Response(JSON.stringify(books), {
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    })
  } catch {
    return new Response(JSON.stringify({ error: '응답 파싱에 실패했습니다.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    })
  }
}
