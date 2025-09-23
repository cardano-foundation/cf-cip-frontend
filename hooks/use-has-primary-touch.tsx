import { useEffect, useState } from 'react'

export function useTouchPrimary() {
  const [isTouchPrimary, setIsTouchPrimary] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const coarseQuery = window.matchMedia?.('(pointer: coarse)') ?? null
    const fineQuery = window.matchMedia?.('(pointer: fine)') ?? null

    const updateTouchPreference = () => {
      const hasTouch =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-expect-error: older browsers expose msMaxTouchPoints on navigator
        navigator.msMaxTouchPoints > 0

      const coarseSupported = coarseQuery?.media !== 'not all'
      const fineSupported = fineQuery?.media !== 'not all'

      const prefersCoarse = coarseSupported ? coarseQuery.matches : false
      const prefersFine = fineSupported ? fineQuery.matches : false

      // Treat devices that report touch but have no fine pointer (like iOS Safari)
      // as primary touch even when the coarse pointer media query is unavailable.
      const prefersTouch = prefersCoarse || (!prefersFine && hasTouch)

      setIsTouchPrimary(hasTouch && prefersTouch)
    }

    const handleChange = () => updateTouchPreference()

    updateTouchPreference()

    if (coarseQuery?.addEventListener) {
      coarseQuery.addEventListener('change', handleChange)
    } else if (coarseQuery?.addListener) {
      coarseQuery.addListener(handleChange)
    }

    if (fineQuery?.addEventListener) {
      fineQuery.addEventListener('change', handleChange)
    } else if (fineQuery?.addListener) {
      fineQuery.addListener(handleChange)
    }

    window.addEventListener('pointerdown', handleChange)
    window.addEventListener('touchstart', handleChange)

    return () => {
      if (coarseQuery?.removeEventListener) {
        coarseQuery.removeEventListener('change', handleChange)
      } else if (coarseQuery?.removeListener) {
        coarseQuery.removeListener(handleChange)
      }

      if (fineQuery?.removeEventListener) {
        fineQuery.removeEventListener('change', handleChange)
      } else if (fineQuery?.removeListener) {
        fineQuery.removeListener(handleChange)
      }

      window.removeEventListener('pointerdown', handleChange)
      window.removeEventListener('touchstart', handleChange)
    }
  }, [])

  return isTouchPrimary
}
