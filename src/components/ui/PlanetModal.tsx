'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Ruler, Thermometer, Clock, Globe } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { CELESTIAL_BODIES } from '@/data/planets'

export function PlanetModal() {
  const focusedPlanet = useAppStore((s) => s.focusedPlanet)
  const setFocusedPlanet = useAppStore((s) => s.setFocusedPlanet)

  const data = focusedPlanet ? CELESTIAL_BODIES.find((b) => b.id === focusedPlanet) : null

  return (
    <AnimatePresence>
      {data && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setFocusedPlanet(null)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl backdrop-blur-2xl bg-black/70 border border-white/10 rounded-3xl p-8 md:p-10 overflow-hidden"
            style={{
              boxShadow: '0 24px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.08)',
            }}
          >
            <button
              onClick={() => setFocusedPlanet(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all"
            >
              <X size={14} />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <span
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: data.color, boxShadow: `0 0 20px ${data.color}` }}
              />
              <div>
                <h2 className="text-2xl md:text-3xl font-serif text-white tracking-wide">{data.name}</h2>
                <p className="text-sm text-white/50 font-serif mt-1">{data.info}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { icon: Ruler, label: 'Distance from Sun', value: data.distanceFromSun },
                { icon: Globe, label: 'Radius', value: data.actualRadius },
                { icon: Thermometer, label: 'Temperature', value: data.temperature },
                { icon: Clock, label: 'Day Length', value: data.dayLength },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <item.icon size={14} className="text-blue-400/70 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[9px] tracking-[0.2em] text-white/40 uppercase font-mono">{item.label}</p>
                    <p className="text-sm text-white/80 font-serif">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
              <p className="text-[10px] tracking-[0.3em] text-blue-300/60 uppercase mb-2 font-mono">Did you know?</p>
              <p className="text-sm text-white/70 font-serif leading-relaxed">{data.trivia}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
