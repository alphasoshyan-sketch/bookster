import '@testing-library/jest-dom/vitest'
import { afterEach, describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from './App'
import { supabase } from './lib/supabaseClient'

HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  getImageData: vi.fn(() => ({ data: [] })),
  putImageData: vi.fn(),
  createImageData: vi.fn(() => []),
  setTransform: vi.fn(),
  drawImage: vi.fn(),
  save: vi.fn(),
  fillText: vi.fn(),
  restore: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  stroke: vi.fn(),
  translate: vi.fn(),
  scale: vi.fn(),
  rotate: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  measureText: vi.fn(() => ({ width: 0 })),
  transform: vi.fn(),
  rect: vi.fn(),
  clip: vi.fn(),
}))

vi.mock('./lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
  },
}))

afterEach(() => {
  vi.restoreAllMocks()
  window.history.replaceState({}, '', '/')
})

describe('App', () => {
  it('renders onboarding heading', () => {
    render(<App />)
    expect(screen.getByText(/별들의 도서관/i)).toBeInTheDocument()
  })

  it('supports browser back navigation from the home page to onboarding', async () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /시작하기/i }))
    expect(screen.getByText(/당신의 별자리를 선택하세요/i)).toBeInTheDocument()

    window.history.replaceState({ page: 'onboarding' }, '', '/')
    window.dispatchEvent(new PopStateEvent('popstate'))

    await waitFor(() => {
      expect(screen.getByText(/당신의 별이 들려주는/i)).toBeInTheDocument()
    })
  })

  it('returns to the home page when retrying from the result page', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify([{ title: '테스트 책', author: '테스트 작가' }]),
    })

    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /시작하기/i }))
    fireEvent.click(screen.getByRole('button', { name: /양자리/i }))
    fireEvent.click(screen.getByRole('button', { name: /INTJ/i }))
    fireEvent.click(screen.getByRole('button', { name: /추천 받기/i }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /다시 하기/i })).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: /다시 하기/i }))

    await waitFor(() => {
      expect(screen.getByText(/당신의 별자리를 선택하세요/i)).toBeInTheDocument()
    })
    expect(window.location.pathname).toBe('/home')
  })

  it('returns to onboarding when the logout button is clicked from the result page', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: { user: { email: 'test@example.com' }, access_token: 'token' } },
    })
    vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null })
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify([{ title: '테스트 책', author: '테스트 작가' }]),
    })

    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /시작하기/i }))
    fireEvent.click(screen.getByRole('button', { name: /양자리/i }))
    fireEvent.click(screen.getByRole('button', { name: /INTJ/i }))
    fireEvent.click(screen.getByRole('button', { name: /추천 받기/i }))

    await screen.findByText('test@example.com')
    fireEvent.click(screen.getByRole('button', { name: /로그아웃/i }))

    await waitFor(() => {
      expect(screen.getByText(/당신의 별이 들려주는/i)).toBeInTheDocument()
    })
    expect(window.location.pathname).toBe('/')
  })
})
