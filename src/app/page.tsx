'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import { IntroOverlay } from '@/components/IntroOverlay'
import ScrollSections from '@/components/ScrollSections'
import { NavigationSidebar, MobileJumpButton } from '@/components/NavigationSidebar'
import { useSmoothScroll } from '@/hooks/useSmoothScroll'

const CosmicJourney = dynamic(() => import('@/components/CosmicJourney'), {
  ssr: false,
})

function IntroPage() {
  return (
    <motion.main
      key="intro"
      className="fixed inset-0 bg-black z-50"
      exit={{ opacity: 0, transition: { duration: 1.5, ease: 'easeInOut' } }}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/Video1.mp4" type="video/mp4" />
      </video>
      <IntroOverlay />
    </motion.main>
  )
}

function ExplorePage() {
  const containerRef = useRef<HTMLDivElement>(null!)
  useSmoothScroll()
  const scrollToTarget = useAppStore((s) => s.scrollToTarget)
  const clearScrollTarget = useAppStore((s) => s.clearScrollTarget)

  useEffect(() => {
    if (scrollToTarget === null || !containerRef.current) return
    const container = containerRef.current
    const target = scrollToTarget * container.scrollHeight
    const startTop = container.scrollTop
    const distance = target - startTop
    if (Math.abs(distance) < 1) {
      clearScrollTarget()
      return
    }
    const duration = Math.min(2200, Math.max(900, Math.abs(distance) * 0.9))
    const startTime = performance.now()
    let raf = 0
    function step(now: number) {
      const t = Math.min(1, (now - startTime) / duration)
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
      container.scrollTop = startTop + distance * eased
      if (t < 1) {
        raf = requestAnimationFrame(step)
      } else {
        clearScrollTarget()
      }
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [scrollToTarget, clearScrollTarget])

  return (
    <motion.main
      key="exploring"
      ref={containerRef}
      className="h-screen overflow-y-scroll bg-[#020010]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 1.5, ease: 'easeInOut' } }}
      style={{ overscrollBehavior: 'none' }}
    >
      <div className="fixed inset-0 z-0">
        <CosmicJourney />
      </div>

      <div className="relative z-10">
        <ScrollSections />
      </div>

      <NavigationSidebar />
      <MobileJumpButton />
    </motion.main>
  )
}

export default function Home() {
  const phase = useAppStore((s) => s.phase)

  return (
    <AnimatePresence mode="wait">
      {phase === 'intro' ? <IntroPage /> : <ExplorePage />}
    </AnimatePresence>
  )
}
