function buildFallbackBooks(zodiac, mbti) {
  return [
    {
      title: '코스모스',
      author: '칼 세이건',
      reason: `${zodiac}의 호기심과 ${mbti}의 탐구심을 함께 끌어올려 주는 과학 교양서입니다. 복잡한 우주를 쉽게 풀어내며 생각의 폭을 넓혀줍니다.`,
    },
    {
      title: '아몬드',
      author: '손원평',
      reason: `${zodiac}의 감수성과 ${mbti}의 깊은 내면 성향을 잘 살려주는 소설입니다. 인간의 마음을 정교하게 그려내며 여운을 남깁니다.`,
    },
    {
      title: '나는 나로 살기로 했다',
      author: '김수현',
      reason: `${zodiac}의 자신만의 길을 찾고 싶은 마음과 ${mbti}의 자기 이해 욕구를 잘 반영한 자기계발서입니다. 삶의 방향을 정리하는 데 도움이 됩니다.`,
    },
  ]
}

export async function onRequestPost({ request, env }) {
  const { zodiac, mbti } = await request.json()

  if (!zodiac || !mbti) {
    return new Response(JSON.stringify({ error: '별자리와 MBTI를 모두 입력해주세요.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!env.OPENAI_API_KEY) {
    return new Response(JSON.stringify(buildFallbackBooks(zodiac, mbti)), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const prompt = `당신은 도서 추천 전문가입니다.
사용자의 별자리는 "${zodiac}"이고 MBTI는 "${mbti}"입니다.
이 사람의 성향에 딱 맞는 실제로 존재하는 책 세 권을 추천해주세요. 서로 다른 장르로 골라주세요.

반드시 아래 JSON 배열 형식으로만 답하세요. 다른 텍스트는 절대 포함하지 마세요:
[
  {
    "title": "책 제목",
    "author": "저자명",
    "reason": "이 책을 추천하는 이유 (2~3문장, 별자리와 MBTI 성향과 연결해서 설명)"
  },
  {
    "title": "책 제목",
    "author": "저자명",
    "reason": "이 책을 추천하는 이유 (2~3문장, 별자리와 MBTI 성향과 연결해서 설명)"
  },
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
    }),
  })

  if (!response.ok) {
    return new Response(JSON.stringify({ error: 'OpenAI API 호출에 실패했습니다.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const data = await response.json()
  const content = data.choices[0].message.content.trim()

  try {
    const books = JSON.parse(content)
    return new Response(JSON.stringify(books), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch {
    return new Response(JSON.stringify({ error: '응답 파싱에 실패했습니다.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
