import { CORS_HEADERS, handleOptions } from './_cors.js'

export const onRequestOptions = handleOptions

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  })
}

export async function onRequestPost({ request, env }) {
  const token = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '')
  if (!token) return jsonResponse({ error: '인증 정보가 없습니다.' }, 401)

  const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL
  if (!supabaseUrl || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return jsonResponse({ error: '서버 설정이 완료되지 않았습니다.' }, 500)
  }

  // 요청에 담긴 access token으로 사용자를 조회해, 토큰 소유자 본인의 계정만 삭제되도록 한다.
  const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
    },
  })
  if (!userResponse.ok) return jsonResponse({ error: '유효하지 않은 세션입니다.' }, 401)
  const user = await userResponse.json()

  const deleteResponse = await fetch(`${supabaseUrl}/auth/v1/admin/users/${user.id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
    },
  })
  if (!deleteResponse.ok) return jsonResponse({ error: '계정 삭제에 실패했습니다.' }, 500)

  return jsonResponse({ success: true })
}
