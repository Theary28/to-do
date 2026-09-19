import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { AuthProvider } from '../context/AuthProvider'
import AuthControls from './AuthControls'

function renderAuthControls() {
  const user = userEvent.setup()
  render(
    <AuthProvider>
      <AuthControls />
    </AuthProvider>,
  )
  return { user }
}

describe('AuthControls sign-in form', () => {
  it('renders an email field and a Sign in button', () => {
    // Arrange
    renderAuthControls()

    // Assert
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument()
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('shows a validation error when the email is invalid', async () => {
    // Arrange
    const { user } = renderAuthControls()

    // Act
    await user.type(screen.getByLabelText('Email'), 'not-an-email')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    // Assert
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid email address')
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.queryByText(/^Hi,/)).toBeNull()
  })

  it('signs in with a valid email, and the form and error are gone', async () => {
    // Arrange
    const { user } = renderAuthControls()
    await user.click(screen.getByRole('button', { name: 'Sign in' }))
    expect(screen.getByRole('alert')).toBeInTheDocument()

    // Act
    await user.type(screen.getByLabelText('Email'), 'theary@example.com')
    await user.keyboard('{Enter}')

    // Assert: the greeting appears and the conditional elements are absent
    expect(screen.getByText('Hi, theary@example.com')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).toBeNull()
    expect(screen.queryByLabelText('Email')).toBeNull()
    expect(screen.queryByRole('button', { name: 'Sign in' })).toBeNull()
  })

  it('brings the form back after signing out', async () => {
    // Arrange
    const { user } = renderAuthControls()
    await user.type(screen.getByLabelText('Email'), 'theary@example.com{Enter}')

    // Act
    await user.click(screen.getByRole('button', { name: 'Sign out' }))

    // Assert
    expect(screen.queryByText('Hi, theary@example.com')).toBeNull()
    expect(screen.getByLabelText('Email')).toHaveValue('')
  })

  describe('edge cases', () => {
    it('asks for an email when submitted empty', async () => {
      const { user } = renderAuthControls()

      await user.click(screen.getByRole('button', { name: 'Sign in' }))

      expect(screen.getByRole('alert')).toHaveTextContent('Enter your email address.')
    })

    it('treats whitespace-only input as empty', async () => {
      const { user } = renderAuthControls()

      await user.type(screen.getByLabelText('Email'), '    {Enter}')

      expect(screen.getByRole('alert')).toHaveTextContent('Enter your email address.')
      expect(screen.queryByText(/^Hi,/)).toBeNull()
    })

    it('trims surrounding spaces from a valid email', async () => {
      const { user } = renderAuthControls()

      await user.type(screen.getByLabelText('Email'), '  theary@example.com  {Enter}')

      expect(screen.getByText('Hi, theary@example.com')).toBeInTheDocument()
    })

    it('rejects an address with no domain dot', async () => {
      const { user } = renderAuthControls()

      await user.type(screen.getByLabelText('Email'), 'theary@example{Enter}')

      expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid email address')
    })

    it('clears the error as soon as the user starts typing again', async () => {
      const { user } = renderAuthControls()
      await user.click(screen.getByRole('button', { name: 'Sign in' }))
      expect(screen.getByRole('alert')).toBeInTheDocument()

      await user.type(screen.getByLabelText('Email'), 't')

      expect(screen.queryByRole('alert')).toBeNull()
      expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'false')
    })
  })
})
