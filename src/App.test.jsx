import '@testing-library/jest-dom/vitest'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders onboarding heading', () => {
    render(<App />)
    expect(screen.getByText(/별들의 도서관/i)).toBeInTheDocument()
  })
})
