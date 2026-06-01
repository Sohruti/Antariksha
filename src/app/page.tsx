'use client'

import { useRef } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import { IntroOverlay } from '@/components/IntroOverlay'
import ScrollSections from '@/components/ScrollSections'
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
