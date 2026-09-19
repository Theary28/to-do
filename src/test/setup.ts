import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Unmount rendered trees and reset storage so every test starts clean.
afterEach(() => {
  cleanup()
  localStorage.clear()
})
