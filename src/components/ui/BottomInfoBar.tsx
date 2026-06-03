'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import { CELESTIAL_BODIES } from '@/data/planets'

export function BottomInfoBar() {
  const scrollProgress = useAppStore((s) => s.scrollProgress)
  const setFocusedPlanet = useAppStore((s) => s.setFocusedPlanet)
  const total = CELESTIAL_BODIES.length
  const index = Math.min(Math.floor(scrollProgress * total), total - 1)
  const data = CELESTIAL_BODIES[index]

  return (
    <AnimatePresence mode="wait">
      {data && (
        <motion.div
          key={data.id}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none"
        >
          <div className="max-w-5xl mx-auto px-4 pb-6 md:pb-8">
            <div
              className="backdrop-blur-2xl bg-black/60 border border-white/10 rounded-2xl px-6 py-5 md:px-8 md:py-6"
              style={{
                boxShadow: '0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: data.color, boxShadow: `0 0 10px ${data.color}` }}
                />
                <span className="text-[10px] tracking-[0.35em] text-white/50 uppercase font-mono">{data.name}</span>
                <span className="text-[8px] text-white/20 font-mono">·</span>
                <span className="text-[9px] text-white/30 font-mono tracking-wider">{data.distanceFromSun}</span>
              </div>

              <h2 className="text-xl md:text-2xl font-serif text-white tracking-wide mb-1">{data.info}</h2>

              <div className="flex flex-wrap gap-3 mt-2">
                <span className="text-[11px] text-white/40 font-serif">{data.actualRadius} radius</span>
                <span className="text-[11px] text-white/20">·</span>
                <span className="text-[11px] text-white/40 font-serif">{data.temperature}</span>
                <span className="text-[11px] text-white/20">·</span>
                <span className="text-[11px] text-white/40 font-serif">{data.yearLength}</span>
              </div>

              {data.id !== 'sun' && (
                <button
                  onClick={() => setFocusedPlanet(data.id)}
                  className="pointer-events-auto mt-3 text-[9px] tracking-[0.3em] text-blue-300/60 uppercase font-mono hover:text-blue-300 transition-colors"
                >
                  Explore {data.name} →
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
