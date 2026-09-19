import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useLocalStorage } from './useLocalStorage'

describe('useLocalStorage', () => {
  it('uses the initial value when nothing is stored', () => {
    const { result } = renderHook(() => useLocalStorage('theme', 'system'))

    expect(result.current[0]).toBe('system')
  })

  it('writes updates to localStorage as JSON', () => {
    const { result } = renderHook(() => useLocalStorage('theme', 'system'))

    act(() => result.current[1]('dark'))

    expect(result.current[0]).toBe('dark')
    expect(localStorage.getItem('theme')).toBe('"dark"')
  })

  it('restores the saved value on the next mount, as after a refresh', () => {
    const first = renderHook(() => useLocalStorage('theme', 'system'))
    act(() => first.result.current[1]('light'))
    first.unmount()

    const second = renderHook(() => useLocalStorage('theme', 'system'))

    expect(second.result.current[0]).toBe('light')
  })

  it('supports functional updates like useState', () => {
    const { result } = renderHook(() => useLocalStorage('count', 0))

    act(() => result.current[1]((n) => n + 1))
    act(() => result.current[1]((n) => n + 1))

    expect(result.current[0]).toBe(2)
  })

  it('falls back to the initial value when stored JSON is corrupt', () => {
    localStorage.setItem('theme', '{not json')

    const { result } = renderHook(() => useLocalStorage('theme', 'system'))

    expect(result.current[0]).toBe('system')
  })
})
