'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import { CELESTIAL_BODIES } from '@/data/planets'

export function NavigationBar() {
  const scrollProgress = useAppStore((s) => s.scrollProgress)
  const requestScrollTo = useAppStore((s) => s.requestScrollTo)
  const setFocusedPlanet = useAppStore((s) => s.setFocusedPlanet)
  const total = CELESTIAL_BODIES.length
  const activeIndex = Math.min(Math.floor(scrollProgress * total), total - 1)
  const progressPct = Math.round(scrollProgress * 100)

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.8 }}
      className="fixed top-0 left-0 right-0 z-40 pointer-events-none"
    >
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <button
          onClick={() => requestScrollTo(0)}
          className="pointer-events-auto text-[10px] tracking-[0.4em] text-white/40 uppercase font-mono hover:text-white/80 transition-all duration-300"
        >
          ← ANTARIKSH.A
        </button>

        <div className="hidden md:flex items-center gap-1 pointer-events-auto">
          {CELESTIAL_BODIES.slice(0, 9).map((body, i) => (
            <button
              key={body.id}
              onClick={() => {
                requestScrollTo(i / (total - 1))
                setFocusedPlanet(null)
              }}
              className="group relative flex items-center justify-center"
            >
              <span
                className={`block rounded-full transition-all duration-500 ${
                  i === activeIndex
                    ? 'w-2.5 h-2.5 shadow-lg'
                    : 'w-1.5 h-1.5'
                }`}
                style={{
                  backgroundColor: i === activeIndex ? body.color : 'rgba(255,255,255,0.15)',
                  boxShadow: i === activeIndex ? `0 0 12px ${body.color}` : 'none',
                }}
              />
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                <span className="text-[9px] text-white/60 font-mono tracking-wider">{body.name}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 pointer-events-auto">
          <span className="text-[10px] font-mono tracking-wider text-white/30">{progressPct}%</span>
          <div className="w-16 h-[1px] bg-white/10 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-400 to-cyan-300"
              style={{ width: `${progressPct}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
        </div>
      </div>
    </motion.header>
  )
}
