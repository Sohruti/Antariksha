'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'

export function IntroOverlay() {
  const phase = useAppStore((s) => s.phase)
  const setPhase = useAppStore((s) => s.setPhase)

  return (
    <AnimatePresence>
      {phase === 'intro' && (
        <motion.div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center"
          exit={{ opacity: 0, transition: { duration: 1.5, ease: 'easeInOut' } }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at center, transparent 50%, rgba(2, 0, 16, 0.6) 100%)',
            }}
          />

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, ease: 'easeOut', delay: 0.5 }}
            className="font-spacetime text-7xl md:text-8xl tracking-[0.2em] text-white select-none"
            style={{
              textShadow:
                '0 0 30px rgba(96, 165, 250, 0.5), 0 0 60px rgba(96, 165, 250, 0.25), 0 0 100px rgba(96, 165, 250, 0.15)',
            }}
          >
            antariksha
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, ease: 'easeOut', delay: 1.2 }}
            className="mt-6 text-lg md:text-xl tracking-[0.15em] text-white/60 font-serif select-none"
          >
            Journey Through The Cosmos
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setPhase('exploring')}
            className="mt-12 px-10 py-4 text-sm tracking-[0.2em] text-white/80 uppercase rounded-full
                       border border-white/10 backdrop-blur-md
                       bg-white/[0.03] hover:bg-white/[0.08]
                       hover:border-white/20 hover:text-white
                       transition-all duration-500 select-none font-serif
                       shadow-[0_0_30px_rgba(96,165,250,0.15)] hover:shadow-[0_0_50px_rgba(96,165,250,0.3)]"
          >
            Enter the Universe
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
