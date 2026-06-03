'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import { useScrollManager } from '@/hooks/useScrollManager'
import { IntroOverlay } from '@/components/IntroOverlay'
import { NavigationBar } from '@/components/ui/NavigationBar'
import { BottomInfoBar } from '@/components/ui/BottomInfoBar'
import { PlanetInfoPanel } from '@/components/ui/PlanetInfoPanel'
import { PlanetModal } from '@/components/ui/PlanetModal'
import { EducationalPanel } from '@/components/ui/EducationalPanel'
import { ScrollProgress } from '@/components/ui/ScrollProgress'

const SolarScene = dynamic(() => import('@/components/scene/SolarScene'), {
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
  const wrapperRef = useRef<HTMLDivElement>(null!)
  const contentRef = useRef<HTMLDivElement>(null!)
  useScrollManager(wrapperRef, contentRef)
  const scrollToTarget = useAppStore((s) => s.scrollToTarget)
  const clearScrollTarget = useAppStore((s) => s.clearScrollTarget)
  const focusedPlanet = useAppStore((s) => s.focusedPlanet)
  const setFocusedPlanet = useAppStore((s) => s.setFocusedPlanet)

  useEffect(() => {
    if (scrollToTarget === null || !wrapperRef.current) return
    const wrapper = wrapperRef.current
    const target = scrollToTarget * wrapper.scrollHeight
    const startTop = wrapper.scrollTop
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
      wrapper.scrollTop = startTop + distance * eased
      if (t < 1) {
        raf = requestAnimationFrame(step)
      } else {
        clearScrollTarget()
      }
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [scrollToTarget, clearScrollTarget])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && focusedPlanet) {
        setFocusedPlanet(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [focusedPlanet, setFocusedPlanet])

  return (
    <motion.main
      key="exploring"
      ref={wrapperRef}
      className="h-screen bg-[#020010]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 1.5, ease: 'easeInOut' } }}
      style={{ overscrollBehavior: 'none' }}
    >
      <div className="fixed inset-0 z-0 pointer-events-none">
        <SolarScene />
      </div>

      <div ref={contentRef}>
        <div className="relative z-10" style={{ height: '900vh' }} />
      </div>

      <NavigationBar />
      <BottomInfoBar />
      <PlanetInfoPanel />
      <EducationalPanel />
      <ScrollProgress />
      <PlanetModal />
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
