const UA_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
  'Accept-Language': 'ko-KR,ko;q=0.9',
}

// 부제/에디션 표기(":", "(" 뒤)를 잘라내고 핵심 제목만 비교해
// "코스모스를 넘어"처럼 우연히 앞글자만 겹치는 다른 책을 걸러낸다.
function titleMatches(resultTitle, title) {
  const seg = resultTitle.split(/[:(（]/)[0].trim().toLowerCase()
  const base = title.trim().toLowerCase()
  if (seg === base) return true
  const [longer, shorter] = seg.length >= base.length ? [seg, base] : [base, seg]
  if (!longer.startsWith(shorter)) return false
  const rest = longer.slice(shorter.length)
  return rest === '' || /^[\s,·:]/.test(rest)
}

function parseKoreanDate(str) {
  if (!str) return null
  const m = str.match(/(\d{4})\D+(\d{1,2})(?:\D+(\d{1,2}))?/)
  if (!m) return null
  const year = Number(m[1])
  const month = Number(m[2]) - 1
  const day = m[3] ? Number(m[3]) : 1
  const date = new Date(Date.UTC(year, month, day))
  return Number.isNaN(date.getTime()) ? null : date
}

async function searchAladin(title, author, env) {
  if (!env.ALADIN_TTB_KEY) return []
  try {
    const q = encodeURIComponent(`${title} ${author}`)
    const url = `https://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=${env.ALADIN_TTB_KEY}&Query=${q}&QueryType=Keyword&MaxResults=5&start=1&SearchTarget=Book&output=js&Version=20131101`
    const res = await fetch(url, { headers: UA_HEADERS })
    if (!res.ok) return []
    const data = await res.json()
    return (data.item || [])
      .filter(it => it.title && titleMatches(it.title, title) && it.cover)
      .map(it => ({
        source: '알라딘',
        date: parseKoreanDate(it.pubDate),
        coverUrl: it.cover.replace(/cover(sum|\d+)/, 'cover500'),
      }))
      .filter(it => it.date)
  } catch {
    return []
  }
}

async function searchYes24(title, author) {
  try {
    const q = encodeURIComponent(`${title} ${author}`)
    const url = `https://www.yes24.com/Product/Search?domain=BOOK&query=${q}`
    const res = await fetch(url, { headers: UA_HEADERS })
    if (!res.ok) return []
    const html = await res.text()
    const results = []
    const re = /data-original="(https:\/\/image\.yes24\.com\/goods\/\d+\/L)"[\s\S]*?class="gd_name"[^>]*>([^<]+)<[\s\S]*?class="authPub info_date">([^<]+)</g
    let m
    while ((m = re.exec(html)) && results.length < 5) {
      const [, coverUrl, resultTitle, pubDateText] = m
      if (!titleMatches(resultTitle, title)) continue
      const date = parseKoreanDate(pubDateText)
      if (!date) continue
      results.push({ source: '예스24', date, coverUrl })
    }
    return results
  } catch {
    return []
  }
}

async function searchKyobo(title, author) {
  try {
    const q = encodeURIComponent(`${title} ${author}`)
    const url = `https://search.kyobobook.co.kr/search?keyword=${q}&target=total`
    const res = await fetch(url, { headers: UA_HEADERS })
    if (!res.ok) return []
    const html = await res.text()
    const results = []
    const re = /data-kbbfn-bid="(\d+)"[^>]*data-kbbfn-title="([^"]+)"[\s\S]*?class="date">([^<]+)</g
    let m
    while ((m = re.exec(html)) && results.length < 5) {
      const [, isbn13, resultTitle, pubDateText] = m
      if (!titleMatches(resultTitle, title)) continue
      const date = parseKoreanDate(pubDateText)
      if (!date) continue
      results.push({ source: '교보문고', date, coverUrl: `https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/${isbn13}.jpg` })
    }
    return results
  } catch {
    return []
  }
}

export async function findLatestCover(title, author, env) {
  const [aladin, yes24, kyobo] = await Promise.all([
    searchAladin(title, author, env),
    searchYes24(title, author),
    searchKyobo(title, author),
  ])
  const candidates = [...aladin, ...yes24, ...kyobo]
  if (candidates.length === 0) return null

  candidates.sort((a, b) => b.date - a.date)
  const best = candidates[0]
  return { coverUrl: best.coverUrl, source: best.source, pubDate: best.date.toISOString().slice(0, 10) }
}
