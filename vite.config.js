import { readFileSync, existsSync } from 'node:fs'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { onRequestPost } from './functions/api/recommend.js'

// Cloudflare Pages Functions용 로컬 시크릿 파일(.dev.vars, gitignore 처리됨)을
// vite dev 서버의 process.env에도 반영해 함수 핸들러가 그대로 사용할 수 있게 한다.
function loadDevVars() {
  if (!existsSync('.dev.vars')) return
  for (const line of readFileSync('.dev.vars', 'utf-8').split('\n')) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
    if (!match) continue
    const [, key, value = ''] = match
    if (!(key in process.env)) process.env[key] = value.trim()
  }
}

export default defineConfig(({ mode }) => {
  loadDevVars()
  const env = loadEnv(mode, process.cwd(), '')
  const basePath = env.VITE_BASE_PATH || (process.env.GITHUB_ACTIONS ? '/bookster/' : '/')

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        // Cloudflare Pages Functions(functions/api/recommend.js)를 그대로 호출해, 로컬
        // dev 서버와 배포 환경의 추천 로직이 항상 같은 코드 경로를 타도록 한다
        // (예전에는 이 파일에 로직을 복제해뒀다가 배포판과 어긋나는 문제가 있었다).
        name: 'recommend-api-dev-handler',
        configureServer(server) {
          server.middlewares.use('/api/recommend', async (req, res, next) => {
            if (req.method !== 'POST') {
              next()
              return
            }

            let body = ''
            req.on('data', chunk => {
              body += chunk
            })

            req.on('end', async () => {
              try {
                const request = new Request('http://localhost/api/recommend', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body,
                })
                const devEnv = {
                  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
                  ALADIN_TTB_KEY: process.env.ALADIN_TTB_KEY,
                }

                const response = await onRequestPost({ request, env: devEnv })
                res.statusCode = response.status
                res.setHeader('Content-Type', response.headers.get('Content-Type') || 'application/json')
                res.end(await response.text())
              } catch (error) {
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: error.message || '추천 요청 중 오류가 발생했습니다.' }))
              }
            })
          })
        },
      },
    ],
    base: basePath,
  }
})
