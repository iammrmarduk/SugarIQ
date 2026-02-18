import { useEffect } from 'react'

export function useKeyboardNav(
  onTabChange: (index: number) => void,
  tabCount: number,
) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't capture if user is typing in an input
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      // '0' key → demos tab (index 8) when 10+ tabs
      if (e.key === '0' && tabCount >= 10) {
        e.preventDefault()
        onTabChange(8)
        return
      }

      const num = parseInt(e.key, 10)
      if (num >= 1 && num <= 8 && num <= tabCount) {
        e.preventDefault()
        onTabChange(num - 1)
      } else if (num === 9) {
        // '9' → sources (last tab if 10+, index 8 if 9 tabs)
        e.preventDefault()
        onTabChange(tabCount >= 10 ? tabCount - 1 : 8)
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onTabChange, tabCount])
}
