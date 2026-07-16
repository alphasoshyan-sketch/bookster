import { CORS_HEADERS, handleOptions } from './_cors.js'

export const onRequestOptions = handleOptions

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  })
}

export async function onRequestPost({ request, env }) {
  if (!env.RESEND_API_KEY) {
    return jsonResponse({ error: '서버 설정이 완료되지 않았습니다.' }, 500)
  }

  const { email } = await request.json().catch(() => ({}))
  if (!email) return jsonResponse({ error: '이메일 주소가 없습니다.' }, 400)

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: '별들의 도서관 <no-reply@attofemto.win>',
      to: email,
      subject: '[별들의 도서관] 가입이 완료되었습니다',
      html: `<p>안녕하세요,</p><p>별들의 도서관 회원가입이 정상적으로 완료되었습니다.</p><p>이용해주셔서 감사합니다.</p>`,
    }),
  })

  if (!resendResponse.ok) {
    const detail = await resendResponse.text().catch(() => '')
    return jsonResponse({ error: '메일 발송에 실패했습니다.', status: resendResponse.status, detail }, 500)
  }

  return jsonResponse({ success: true })
}
