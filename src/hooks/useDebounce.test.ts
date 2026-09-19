import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDebounce } from './useDebounce'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useDebounce', () => {
  it('returns the initial value straight away', () => {
    const { result } = renderHook(() => useDebounce('a', 500))

    expect(result.current).toBe('a')
  })

  it('updates only after the value has been still for the delay', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'a' },
    })

    rerender({ value: 'ab' })
    act(() => vi.advanceTimersByTime(499))
    expect(result.current).toBe('a')

    act(() => vi.advanceTimersByTime(1))
    expect(result.current).toBe('ab')
  })

  it('restarts the wait on every change, so rapid typing yields only the last value', () => {
    const seen: string[] = []
    const { rerender } = renderHook(
      ({ value }) => {
        const debounced = useDebounce(value, 500)
        if (seen.at(-1) !== debounced) seen.push(debounced)
        return debounced
      },
      { initialProps: { value: '' } },
    )

    for (const value of ['C', 'Cl', 'Cle', 'Clem']) {
      rerender({ value })
      act(() => vi.advanceTimersByTime(200))
    }
    act(() => vi.advanceTimersByTime(500))

    expect(seen).toEqual(['', 'Clem'])
  })

  it('leaves no pending timer after unmount', () => {
    const { rerender, unmount } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'a' },
    })
    rerender({ value: 'b' })
    expect(vi.getTimerCount()).toBe(1)

    unmount()

    expect(vi.getTimerCount()).toBe(0)
  })
})
