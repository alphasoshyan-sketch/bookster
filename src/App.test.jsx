import '@testing-library/jest-dom/vitest'
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from './App'

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
})
