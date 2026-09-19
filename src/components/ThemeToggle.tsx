import { useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

type Theme = 'system' | 'light' | 'dark'

const NEXT: Record<Theme, Theme> = { system: 'light', light: 'dark', dark: 'system' }
const LABEL: Record<Theme, string> = { system: 'System', light: 'Light', dark: 'Dark' }

export default function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'system')

  // Mirror the choice onto <html> so the CSS tokens switch. index.html applies
  // the stored value before React loads, so a refresh doesn't flash.
  useEffect(() => {
    if (theme === 'system') {
      delete document.documentElement.dataset.theme
    } else {
      document.documentElement.dataset.theme = theme
    }
  }, [theme])

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => setTheme(NEXT[theme])}
      aria-label={`Theme: ${LABEL[theme]}. Switch to ${LABEL[NEXT[theme]]}`}
    >
      Theme: {LABEL[theme]}
    </button>
  )
}
