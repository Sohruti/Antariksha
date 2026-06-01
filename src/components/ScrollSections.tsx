'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import { SECTION_INFO, getSectionIndex, CELESTIAL_BODIES } from '@/data/planets'

function ParallaxSection({
  children,
  index,
}: {
  children: React.ReactNode
  index: number
}) {
  return (
    <section
      className="h-screen w-full flex items-center justify-center relative"
      style={{ zIndex: 10 - index }}
    >
      {children}
    </section>
  )
}

function InfoCard({
  info,
  isActive,
}: {
  info: (typeof SECTION_INFO)[0]
  isActive: boolean
}) {
  return (
    <motion.div
      className="text-center max-w-2xl px-6 pointer-events-auto"
      initial={{ opacity: 0, y: 60 }}
      animate={
        isActive
          ? { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
          : { opacity: 0, y: -30, transition: { duration: 0 } }
      }
    >
      <motion.p
        className="text-sm tracking-[0.3em] text-blue-300/70 uppercase mb-4 font-serif"
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1, transition: { delay: 0.2 } } : { opacity: 0, transition: { duration: 0 } }}
      >
        {info.subtitle}
      </motion.p>

      <motion.h2
        className="text-5xl md:text-7xl font-serif tracking-[0.05em] text-white mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={
          isActive
            ? { opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.8 } }
            : { opacity: 0, y: 20, transition: { duration: 0 } }
        }
      >
        {info.title}
      </motion.h2>

      <div className="space-y-3">
        {info.lines.map((line, i) => (
          <motion.p
            key={i}
            className="text-base md:text-lg text-white/60 leading-relaxed font-serif"
            initial={{ opacity: 0, y: 20 }}
            animate={
              isActive
                ? { opacity: 1, y: 0, transition: { delay: 0.5 + i * 0.15, duration: 0.6 } }
                : { opacity: 0, y: 10, transition: { duration: 0 } }
            }
          >
            {line}
          </motion.p>
        ))}
      </div>
    </motion.div>
  )
}

function SatelliteNameList() {
  const earth = CELESTIAL_BODIES.find((b) => b.id === 'earth')

  return (
    <motion.div
      className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-3 px-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0, transition: { delay: 1.2, duration: 0.8 } }}
      exit={{ opacity: 0, y: 20, transition: { duration: 0 } }}
    >
      {earth?.satellites?.slice(0, 6).map((sat, i) => (
        <motion.div
          key={sat.name}
          className="px-4 py-2 rounded-full border border-white/10 backdrop-blur-md bg-white/[0.03]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: { delay: 1.4 + i * 0.1, duration: 0.4 },
          }}
        >
          <span className="text-xs tracking-[0.15em] text-white/80 font-serif">
            {sat.name}
          </span>
          <span className="text-[10px] text-white/40 ml-2 font-serif">{sat.type}</span>
        </motion.div>
      ))}
    </motion.div>
  )
}

function PlanetInfoSidebar({ bodyId }: { bodyId: string }) {
  const body = CELESTIAL_BODIES.find((b) => b.id === bodyId)
  if (!body || !body.details) return null

  return (
    <motion.div
      className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0, transition: { delay: 0.8, duration: 0.6 } }}
      exit={{ opacity: 0, x: 20, transition: { duration: 0 } }}
    >
      <div className="backdrop-blur-md bg-white/[0.03] border border-white/10 rounded-2xl p-6 w-64">
        <h3 className="text-xs tracking-[0.2em] text-blue-300/60 uppercase mb-4 font-serif">
          Key Facts
        </h3>
        <div className="space-y-3">
          {body.details.map((detail, i) => (
            <motion.p
              key={i}
              className="text-sm text-white/70 leading-relaxed font-serif"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 1 + i * 0.1 } }}
            >
              {detail}
            </motion.p>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function ScrollProgressBar() {
  const scrollProgress = useAppStore((s) => s.scrollProgress)

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 h-48 w-[2px] z-50 hidden lg:block">
      <div className="absolute inset-0 bg-white/10 rounded-full" />
      <motion.div
        className="absolute top-0 left-0 w-full bg-blue-400 rounded-full"
        style={{ height: `${scrollProgress * 100}%` }}
      />
      <div
        className="absolute -left-1 top-0 w-4 h-4 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50"
        style={{ marginTop: `calc(${scrollProgress * 100}% - 8px)` }}
      />
    </div>
  )
}

function ScrollHint() {
  const scrollProgress = useAppStore((s) => s.scrollProgress)

  if (scrollProgress > 0.02) return null

  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.p
        className="text-xs tracking-[0.2em] text-white/40 uppercase font-serif"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        Scroll to explore
      </motion.p>
      <motion.div
        className="w-5 h-8 border border-white/20 rounded-full flex items-start justify-center p-1"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.div
          className="w-1 h-2 bg-white/60 rounded-full"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.div>
  )
}

export default function ScrollSections() {
  const scrollProgress = useAppStore((s) => s.scrollProgress)
  const sectionIndex = getSectionIndex(scrollProgress)
  const currentInfo = SECTION_INFO[sectionIndex]

  const showSatellites =
    currentInfo.id === 'earth-intro' || currentInfo.id === 'earth-satellites'

  function getCurrentBodyId(): string | null {
    if (currentInfo.id === 'earth-intro' || currentInfo.id === 'earth-satellites') return 'earth'
    if (currentInfo.id === 'earth-revisit') return 'earth'
    const body = CELESTIAL_BODIES.find((b) => b.id === currentInfo.id)
    return body?.id ?? null
  }

  const currentBodyId = getCurrentBodyId()

  return (
    <>
      <ScrollProgressBar />
      <ScrollHint />

      {SECTION_INFO.map((info, i) => (
        <ParallaxSection key={info.id} index={i}>
          {sectionIndex === i && <InfoCard info={info} isActive={true} />}
          {showSatellites && sectionIndex === i && <SatelliteNameList />}
          {currentBodyId && sectionIndex === i && (
            <PlanetInfoSidebar bodyId={currentBodyId} />
          )}
        </ParallaxSection>
      ))}
    </>
  )
}
