import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockOnRequestPost = vi.fn()

vi.mock('./functions/api/delete-account.js', () => ({
  onRequestPost: mockOnRequestPost,
}))

import config, { loadRuntimeEnv } from './vite.config.js'

describe('delete-account dev handler', () => {
  beforeEach(() => {
    mockOnRequestPost.mockReset()
  })

  it('loads Supabase service role credentials from .dev.vars for local delete-account requests', () => {
    const runtimeEnv = loadRuntimeEnv('development', process.cwd())

    expect(runtimeEnv.SUPABASE_SERVICE_ROLE_KEY).toBeTruthy()
    expect(runtimeEnv.SUPABASE_SERVICE_ROLE_KEY).toContain('sb_secret_')
  })

  it('delegates delete-account requests to the real handler instead of returning a local stub', async () => {
    mockOnRequestPost.mockResolvedValue(
      new Response(JSON.stringify({ error: '실패' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    )

    const { plugins } = config({ mode: 'development' })
    const deleteAccountPlugin = plugins.find(plugin => plugin.name === 'recommend-api-dev-handler')
    const middlewareCalls = []
    const server = {
      middlewares: {
        use: (...args) => middlewareCalls.push(args),
      },
    }

    deleteAccountPlugin.configureServer(server)

    const [, deleteMiddleware] = middlewareCalls.find(([path]) => path === '/api/delete-account') || []
    expect(deleteMiddleware).toBeTypeOf('function')

    const req = {
      method: 'POST',
      url: '/api/delete-account',
      headers: { host: 'localhost:5173' },
    }
    const res = {
      statusCode: 200,
      headers: {},
      setHeader(name, value) {
        this.headers[name] = value
      },
      end: vi.fn(),
    }

    await deleteMiddleware(req, res, vi.fn())

    expect(mockOnRequestPost).toHaveBeenCalledTimes(1)
    expect(res.statusCode).toBe(500)
    expect(res.end).toHaveBeenCalledWith(JSON.stringify({ error: '실패' }))
  })
})
