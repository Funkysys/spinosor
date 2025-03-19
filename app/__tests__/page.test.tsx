import { render, screen, fireEvent } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import Home from '../page'

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

describe('Home Page', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    // Reset mocks before each test
    ;(useRouter as jest.Mock).mockImplementation(() => ({
      push: mockPush
    }))
  })

  it('renders the welcome message', () => {
    render(<Home />)
    const heading = screen.getByRole('heading', { name: /Bienvenue chez Spinosor Records/i })
    expect(heading).toBeInTheDocument()
  })

  it('displays the Spinosor logo', () => {
    render(<Home />)
    const logo = screen.getByAltText('Spinosor Records logo')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', '/assets/images/spinosor_Logo.svg')
  })

  it('contains an enter button that navigates to artists page', () => {
    render(<Home />)
    const button = screen.getByRole('button', { name: /ENTRER/i })
    expect(button).toBeInTheDocument()

    // Click the button
    fireEvent.click(button)

    // Verify navigation
    expect(mockPush).toHaveBeenCalledWith('/home/artists')
  })

  it('applies correct styling classes', () => {
    render(<Home />)
    const mainElement = screen.getByRole('main')
    expect(mainElement).toHaveClass(
      'flex',
      'min-h-screen',
      'flex-col',
      'items-center',
      'justify-center',
      'bg-black'
    )
  })
})
