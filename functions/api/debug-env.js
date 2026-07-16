export async function onRequestGet({ env }) {
  return new Response(JSON.stringify({
    hasSupabaseUrl: !!env.SUPABASE_URL,
    hasViteSupabaseUrl: !!env.VITE_SUPABASE_URL,
    hasServiceRoleKey: !!env.SUPABASE_SERVICE_ROLE_KEY,
    envKeys: Object.keys(env).sort(),
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
