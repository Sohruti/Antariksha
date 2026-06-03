'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { getPlanetIndex, CELESTIAL_BODIES, type CelestialData } from '@/data/planets'
import { useAppStore } from '@/store/useAppStore'

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0">
      <span className="text-[10px] tracking-[0.2em] text-white/40 uppercase font-mono">{label}</span>
      <span className="text-xs text-white/80 font-serif">{value}</span>
    </div>
  )
}

export function PlanetInfoPanel() {
  const scrollProgress = useAppStore((s) => s.scrollProgress)
  const total = CELESTIAL_BODIES.length
  const index = Math.min(Math.floor(scrollProgress * total), total - 1)
  const data = CELESTIAL_BODIES[index]

  if (!data || data.id === 'sun') return null

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={data.id}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed right-6 top-1/2 -translate-y-1/2 z-30 hidden lg:block pointer-events-none"
      >
        <div
          className="backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-2xl p-6 w-64"
          style={{
            boxShadow: '0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: data.color, boxShadow: `0 0 12px ${data.color}` }}
            />
            <div>
              <h3 className="text-sm font-serif text-white tracking-wide">{data.name}</h3>
              <p className="text-[10px] text-white/40 font-mono tracking-wider">
                0{index} · {getPlanetIndex(data.id) + 1} of {total}
              </p>
            </div>
          </div>

          <p className="text-xs text-white/50 font-serif leading-relaxed mb-4">{data.info}</p>

          <div className="space-y-0.5">
            <InfoRow label="Distance" value={data.distanceFromSun} />
            <InfoRow label="Radius" value={data.actualRadius} />
            <InfoRow label="Temperature" value={data.temperature} />
            <InfoRow label="Day Length" value={data.dayLength} />
            <InfoRow label="Year Length" value={data.yearLength} />
            {data.moons !== undefined && <InfoRow label="Moons" value={String(data.moons)} />}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
