import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import UserDirectory from './UserDirectory'

const USERS = [
  { id: 1, name: 'Leanne Graham', email: 'Sincere@april.biz' },
  { id: 3, name: 'Clementine Bauch', email: 'Nathan@yesenia.net' },
]

// Stand-in for the real API: filters by ?q= like JSONPlaceholder does.
function fakeApi(input: RequestInfo | URL): Promise<Response> {
  const url = new URL(String(input))
  const q = url.searchParams.get('q')?.toLowerCase()
  const body = q ? USERS.filter((u) => u.name.toLowerCase().includes(q)) : USERS
  return Promise.resolve(new Response(JSON.stringify(body), { status: 200 }))
}

const fetchMock = vi.fn(fakeApi)

function searchedTerms(): (string | null)[] {
  return fetchMock.mock.calls.map(([input]) => new URL(String(input)).searchParams.get('q'))
}

function renderDirectory() {
  const user = userEvent.setup()
  render(
    <MemoryRouter>
      <UserDirectory />
    </MemoryRouter>,
  )
  return { user }
}

beforeEach(() => {
  fetchMock.mockClear()
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('UserDirectory', () => {
  it('shows a loading skeleton, then the users once the fetch resolves', async () => {
    // Arrange
    renderDirectory()
    expect(screen.getByRole('list', { name: 'Loading users' })).toBeInTheDocument()

    // Act: wait for the async data
    const leanne = await screen.findByRole('link', { name: /Leanne Graham/ })

    // Assert
    expect(leanne).toHaveAttribute('href', '/users/1')
    expect(screen.getByRole('link', { name: /Clementine Bauch/ })).toBeInTheDocument()
    expect(screen.queryByRole('list', { name: 'Loading users' })).toBeNull()
  })

  it('shows an error with a retry button when the request fails', async () => {
    // Arrange
    fetchMock.mockResolvedValueOnce(new Response('oops', { status: 500 }))
    const { user } = renderDirectory()

    // Act
    const alert = await screen.findByRole('alert')

    // Assert
    expect(alert).toHaveTextContent('Request failed with status 500')
    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(await screen.findByRole('link', { name: /Leanne Graham/ })).toBeInTheDocument()
    expect(screen.queryByRole('alert')).toBeNull()
  })

  describe('debounced search (edge cases)', () => {
    it('sends one request for rapid typing, not one per keystroke', async () => {
      const { user } = renderDirectory()
      await screen.findByRole('link', { name: /Leanne Graham/ })

      await user.type(screen.getByRole('searchbox', { name: 'Search users' }), 'Clem')

      // Leanne only disappears once the debounced "Clem" search has returned.
      await waitFor(() => expect(screen.queryByRole('link', { name: /Leanne Graham/ })).toBeNull(), {
        timeout: 2000,
      })
      expect(await screen.findByRole('link', { name: /Clementine Bauch/ })).toBeInTheDocument()
      expect(searchedTerms()).toEqual([null, 'Clem'])
    })

    it('shows the raw value immediately and the debounced value only after the pause', async () => {
      const { user } = renderDirectory()
      await screen.findByRole('link', { name: /Leanne Graham/ })

      await user.type(screen.getByRole('searchbox', { name: 'Search users' }), 'Le')

      const [raw, debounced] = screen.getAllByRole('definition')
      expect(raw).toHaveTextContent('“Le”')
      expect(debounced).toHaveTextContent('—')
      await waitFor(() => expect(debounced).toHaveTextContent('“Le”'), { timeout: 2000 })
    })

    it('shows the empty state when nothing matches', async () => {
      const { user } = renderDirectory()
      await screen.findByRole('link', { name: /Leanne Graham/ })

      await user.type(screen.getByRole('searchbox', { name: 'Search users' }), 'zzzz')

      expect(await screen.findByText(/No users match/, {}, { timeout: 2000 })).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: 'Clear search' }))
      expect(await screen.findByRole('link', { name: /Leanne Graham/ }, { timeout: 2000 })).toBeInTheDocument()
    })

    it('does not search for whitespace-only input', async () => {
      const { user } = renderDirectory()
      await screen.findByRole('link', { name: /Leanne Graham/ })

      await user.type(screen.getByRole('searchbox', { name: 'Search users' }), '   ')
      const debounced = screen.getAllByRole('definition')[1]
      await waitFor(() => expect(debounced).not.toHaveTextContent('—'), { timeout: 2000 })

      expect(searchedTerms()).toEqual([null])
      expect(screen.getByRole('link', { name: /Leanne Graham/ })).toBeInTheDocument()
    })
  })
})
