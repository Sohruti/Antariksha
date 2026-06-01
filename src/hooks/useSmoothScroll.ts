'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { useAppStore } from '@/store/useAppStore'

export function useSmoothScroll() {
  const setScrollProgress = useAppStore((s) => s.setScrollProgress)
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      wheelMultiplier: 1,
      smoothWheel: true,
      touchMultiplier: 2,
      infinite: false,
    })

    lenisRef.current = lenis

    lenis.on('scroll', (e: { progress: number }) => {
      setScrollProgress(e.progress)
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
      lenisRef.current = null
    }
  }, [setScrollProgress])

  return lenisRef
}
