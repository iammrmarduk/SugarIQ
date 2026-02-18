import { useState, useEffect, useRef } from 'react'

export function useAnimatedCounter(
  target: number,
  duration = 1500,
  enabled = true,
): number {
  const [value, setValue] = useState(0)
  const startTime = useRef<number | null>(null)
  const rafId = useRef<number>(0)

  useEffect(() => {
    if (!enabled) {
      setValue(0)
      return
    }

    startTime.current = null

    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp
      const elapsed = timestamp - startTime.current
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.floor(eased * target))

      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate)
      } else {
        setValue(target)
      }
    }

    rafId.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId.current)
  }, [target, duration, enabled])

  return value
}
