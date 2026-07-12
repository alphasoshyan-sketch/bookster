import { findLatestCover } from './_bookCover.js'
import { CORS_HEADERS, handleOptions } from './_cors.js'

export const onRequestOptions = handleOptions

// 표지가 실제로 검색되는 책만 통과시키고, 알라딘에서 국적(국내도서/외국도서)이
// 확인되면 LLM이 잘못 붙인 category(한국 작가가 foreign으로 분류되는 등)를 바로잡는다.
async function resolveBooks(books, env) {
  const resolved = await Promise.all(
    books.map(async book => {
      try {
        const best = await findLatestCover(book.title, book.author, env)
        if (!best) return null
        return {
          ...book,
          category: best.nationality || book.category,
          coverUrl: best.coverUrl,
          coverSource: best.source,
          pubDate: best.pubDate,
        }
      } catch {
        return null
      }
    })
  )
  return resolved.filter(Boolean)
}

function buildFallbackBooks(zodiac, mbti) {
  return [
    {
      title: '아몬드',
      author: '손원평',
      category: 'korean',
      reason: `${zodiac}의 감수성과 ${mbti}의 깊은 내면 성향을 잘 살려주는 소설입니다. 인간의 마음을 정교하게 그려내며 여운을 남깁니다.`,
    },
    {
      title: '나는 나로 살기로 했다',
      author: '김수현',
      category: 'korean',
      reason: `${zodiac}의 자신만의 길을 찾고 싶은 마음과 ${mbti}의 자기 이해 욕구를 잘 반영한 자기계발서입니다. 삶의 방향을 정리하는 데 도움이 됩니다.`,
    },
    {
      title: '채식주의자',
      author: '한강',
      category: 'korean',
      reason: `${zodiac}의 예민한 감각과 ${mbti}의 내면 탐구 성향이 만나 깊이 몰입할 수 있는 소설입니다. 강렬한 이미지와 여운이 오래 남습니다.`,
    },
    {
      title: '82년생 김지영',
      author: '조남주',
      category: 'korean',
      reason: `${zodiac}의 공감 능력과 ${mbti}의 현실 인식 성향이 맞닿아 있는 소설입니다. 한 사람의 삶을 통해 우리 사회를 되돌아보게 합니다.`,
    },
    {
      title: '언어의 온도',
      author: '이기주',
      category: 'korean',
      reason: `${zodiac}의 섬세한 표현력과 ${mbti}의 말과 관계에 대한 고민을 어루만져 주는 에세이입니다. 짧은 글마다 따뜻한 여운이 남습니다.`,
    },
    {
      title: '완전한 행복',
      author: '정유정',
      category: 'korean',
      reason: `${zodiac}의 몰입력과 ${mbti}의 인간 심리에 대한 호기심을 자극하는 스릴러입니다. 긴장감 있는 전개로 단숨에 읽히는 작품입니다.`,
    },
    {
      title: '죽고 싶지만 떡볶이는 먹고 싶어',
      author: '백세희',
      category: 'korean',
      reason: `${zodiac}의 솔직한 감정 표현과 ${mbti}의 자기 이해 욕구에 맞닿아 있는 에세이입니다. 담담한 고백이 위로를 건넵니다.`,
    },
    {
      title: '불편한 편의점',
      author: '김호연',
      category: 'korean',
      reason: `${zodiac}의 따뜻한 시선과 ${mbti}의 사람에 대한 관심을 자극하는 소설입니다. 평범한 일상 속 온기를 잔잔하게 그려냅니다.`,
    },
    {
      title: '여행의 이유',
      author: '김영하',
      category: 'korean',
      reason: `${zodiac}의 자유로운 기질과 ${mbti}의 사색적인 면모를 함께 채워주는 에세이입니다. 떠남과 머묾에 대한 통찰을 전합니다.`,
    },
    {
      title: '지구 끝의 온실',
      author: '김초엽',
      category: 'korean',
      reason: `${zodiac}의 상상력과 ${mbti}의 논리적 세계관 구축 욕구를 동시에 만족시키는 SF 소설입니다. 희망을 이야기하는 방식이 인상적입니다.`,
    },
    {
      title: '코스모스',
      author: '칼 세이건',
      category: 'foreign',
      reason: `${zodiac}의 호기심과 ${mbti}의 탐구심을 함께 끌어올려 주는 과학 교양서입니다. 복잡한 우주를 쉽게 풀어내며 생각의 폭을 넓혀줍니다.`,
    },
    {
      title: '미움받을 용기',
      author: '기시미 이치로',
      category: 'foreign',
      reason: `${zodiac}의 관계 고민과 ${mbti}의 자기 성찰 욕구에 맞닿아 있는 책입니다. 아들러 심리학을 통해 삶의 방향을 다시 세우게 해줍니다.`,
    },
    {
      title: '사피엔스',
      author: '유발 하라리',
      category: 'foreign',
      reason: `${zodiac}의 큰 그림을 보는 시야와 ${mbti}의 지적 호기심을 자극하는 인문 교양서입니다. 인류사를 새로운 시각으로 조망합니다.`,
    },
    {
      title: '데미안',
      author: '헤르만 헤세',
      category: 'foreign',
      reason: `${zodiac}의 내면 성장 욕구와 ${mbti}의 자아 탐구 성향에 깊이 와닿는 성장 소설입니다. 자기 자신에게 이르는 길을 그려냅니다.`,
    },
    {
      title: '1984',
      author: '조지 오웰',
      category: 'foreign',
      reason: `${zodiac}의 비판적 시각과 ${mbti}의 체계적 사고를 자극하는 고전입니다. 시대를 초월한 통찰로 여전히 강렬한 메시지를 전합니다.`,
    },
    {
      title: '노르웨이의 숲',
      author: '무라카미 하루키',
      category: 'foreign',
      reason: `${zodiac}의 감성적인 면과 ${mbti}의 내밀한 정서를 건드리는 소설입니다. 상실과 사랑을 섬세한 문체로 그려냅니다.`,
    },
    {
      title: '마인드셋',
      author: '캐럴 드웩',
      category: 'foreign',
      reason: `${zodiac}의 성장 욕구와 ${mbti}의 자기계발 성향에 실질적인 도움을 주는 심리학 도서입니다. 사고방식의 전환을 이끌어냅니다.`,
    },
    {
      title: '어린 왕자',
      author: '앙투안 드 생텍쥐페리',
      category: 'foreign',
      reason: `${zodiac}의 순수한 감성과 ${mbti}의 본질을 꿰뚫는 사고를 자극하는 우화입니다. 짧지만 깊은 여운을 남기는 고전입니다.`,
    },
    {
      title: '총, 균, 쇠',
      author: '재레드 다이아몬드',
      category: 'foreign',
      reason: `${zodiac}의 넓은 시야와 ${mbti}의 인과관계를 파헤치는 성향을 만족시키는 인문 교양서입니다. 문명사를 새로운 관점으로 조망합니다.`,
    },
    {
      title: '죽음의 수용소에서',
      author: '빅터 프랭클',
      category: 'foreign',
      reason: `${zodiac}의 삶에 대한 깊은 사유와 ${mbti}의 의미 탐구 욕구에 맞닿아 있는 책입니다. 극한 상황 속 인간 존엄을 이야기합니다.`,
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

// LLM이 카테고리당 정확히 10권을 채우지 못하거나, 중복 제목을 내놓거나, 표지가 없는/
// 국적이 잘못 분류된 책을 내놓는 경우가 있다. 표지가 실제로 검색되는 책만 채택하고
// (알라딘 기준) 국적이 확인되면 category를 바로잡은 뒤, 그래도 부족한 만큼은
// 폴백 목록에서 같은 방식(표지 검증 + 국적 확인)으로 채워 넣어 korean 10 + foreign 10을 보장한다.
async function selectBooks(llmBooks, zodiac, mbti, env) {
  const fallback = buildFallbackBooks(zodiac, mbti)

  const korean = []
  const foreign = []
  const used = new Set()

  function bucketFor(category) {
    return category === 'foreign' ? foreign : korean
  }

  function collect(resolved) {
    for (const book of resolved) {
      if (used.has(book.title)) continue
      const bucket = bucketFor(book.category)
      if (bucket.length >= 10) continue
      bucket.push(book)
      used.add(book.title)
    }
  }

  collect(await resolveBooks(dedupByTitle((llmBooks || []).filter(b => b?.title)), env))

  if (korean.length < 10 || foreign.length < 10) {
    const remainingFallback = fallback.filter(b => !used.has(b.title))
    collect(await resolveBooks(remainingFallback, env))
  }

  return [...korean, ...foreign]
}

export async function onRequestPost({ request, env }) {
  const { zodiac, mbti } = await request.json()

  if (!zodiac || !mbti) {
    return new Response(JSON.stringify({ error: '별자리와 MBTI를 모두 입력해주세요.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    })
  }

  if (!env.OPENAI_API_KEY) {
    const fallbackBooks = await selectBooks([], zodiac, mbti, env)
    return new Response(JSON.stringify(fallbackBooks), {
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    })
  }

  const prompt = `당신은 도서 추천 전문가입니다.
사용자의 별자리는 "${zodiac}"이고 MBTI는 "${mbti}"입니다.
이 사람의 성향에 딱 맞는 실제로 존재하는 책을 총 스무 권 추천해주세요.
- 저자가 한국인인 책 열 권 (category: "korean")
- 저자가 한국인이 아닌 책 열 권 (category: "foreign")
category는 반드시 저자의 실제 국적 기준으로만 정확하게 분류하세요. 번역서라도 저자가
한국인이면 "korean"이며, 이름이 한글로 표기된다는 이유만으로 "foreign"으로 분류하지 마세요.
같은 카테고리 안에서도 서로 다른 장르로 골라주세요.

반드시 아래와 같은 JSON 배열 형식으로만 답하세요. 배열 순서는 korean 열 권, foreign 열 권 순으로 정렬하고, 총 20개의 객체를 포함해야 하며, 다른 텍스트는 절대 포함하지 마세요. 아래는 형식 예시입니다 (실제로는 각 category당 10개씩 채워주세요):
[
  {
    "title": "책 제목",
    "author": "저자명",
    "category": "korean",
    "reason": "이 책을 추천하는 이유 (2~3문장, 별자리와 MBTI 성향과 연결해서 설명)"
  },
  {
    "title": "책 제목",
    "author": "저자명",
    "category": "foreign",
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
      max_tokens: 4000,
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
    const books = await selectBooks(parsed, zodiac, mbti, env)
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
