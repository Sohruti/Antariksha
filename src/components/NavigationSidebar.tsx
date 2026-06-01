'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import { SECTION_INFO } from '@/data/planets'

function sectionIcon(id: string): string {
  if (id.startsWith('earth')) return '◐'
  if (id === 'sun') return '☀'
  if (id === 'mercury') return '☿'
  if (id === 'venus') return '♀'
  if (id === 'mars') return '♂'
  if (id === 'jupiter') return '♃'
  if (id === 'saturn') return '♄'
  if (id === 'uranus') return '♅'
  if (id === 'neptune') return '♆'
  return '✦'
}

export function NavigationSidebar() {
  const scrollProgress = useAppStore((s) => s.scrollProgress)
  const requestScrollTo = useAppStore((s) => s.requestScrollTo)
  const total = SECTION_INFO.length

  const activeIndex = Math.min(Math.floor(scrollProgress * total), total - 1)
  const progressPct = Math.round(scrollProgress * 100)

  function jumpTo(index: number) {
    const target = index / total
    requestScrollTo(target)
  }

  function jumpHome() {
    requestScrollTo(0)
  }

  return (
    <motion.aside
      initial={{ x: 80, opacity: 0 }}
      animate={{ x: 0, opacity: 1, transition: { delay: 0.4, duration: 0.9, ease: 'easeOut' } }}
      className="fixed right-0 top-0 h-screen w-72 z-40 hidden lg:flex flex-col
                 backdrop-blur-xl bg-black/40 border-l border-white/10
                 pointer-events-auto"
    >
      <div className="px-6 pt-8 pb-5 border-b border-white/10">
        <p className="text-[10px] tracking-[0.4em] text-blue-300/60 uppercase font-serif">
          Cosmic Journey
        </p>
        <h2 className="mt-2 text-2xl font-serif text-white/90 tracking-wide">
          Chapters
        </h2>
        <p className="mt-1 text-[11px] text-white/40 font-serif">
          {progressPct}% explored · {activeIndex + 1} / {total}
        </p>

        <div className="mt-4 h-[2px] w-full bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-400 to-cyan-300"
            style={{ width: `${progressPct}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>

        <button
          onClick={jumpHome}
          className="mt-4 w-full text-[10px] tracking-[0.3em] text-white/60 uppercase
                     border border-white/10 rounded-full py-2
                     hover:bg-white/[0.05] hover:text-white hover:border-white/20
                     transition-all duration-300 font-serif"
        >
          ↺ Return to Earth
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-3">
        {SECTION_INFO.map((info, i) => {
          const isActive = i === activeIndex
          return (
            <button
              key={info.id}
              onClick={() => jumpTo(i)}
              className={`group w-full text-left px-6 py-3 flex items-center gap-3
                          border-l-2 transition-all duration-300
                          ${
                            isActive
                              ? 'border-blue-400 bg-white/[0.06] text-white'
                              : 'border-transparent text-white/45 hover:bg-white/[0.03] hover:text-white/85'
                          }`}
            >
              <span
                className={`text-base w-5 text-center font-serif transition-colors
                            ${isActive ? 'text-blue-300' : 'text-white/30 group-hover:text-white/55'}`}
              >
                {sectionIcon(info.id)}
              </span>

              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-mono tracking-wider text-white/30 mb-0.5">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <p className="text-xs font-serif truncate leading-tight">{info.title}</p>
                <p className="text-[10px] text-white/35 truncate font-serif mt-0.5">
                  {info.subtitle}
                </p>
              </div>

              {isActive && (
                <motion.span
                  layoutId="active-dot"
                  className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]"
                />
              )}
            </button>
          )
        })}
      </nav>

      <div className="px-6 py-4 border-t border-white/10">
        <p className="text-[10px] text-white/30 font-serif leading-relaxed">
          Click any chapter to zoom there. Scroll to continue the cinematic journey.
        </p>
      </div>
    </motion.aside>
  )
}

export function MobileJumpButton() {
  const requestScrollTo = useAppStore((s) => s.requestScrollTo)
  const scrollProgress = useAppStore((s) => s.scrollProgress)
  const total = SECTION_INFO.length
  const activeIndex = Math.min(Math.floor(scrollProgress * total), total - 1)
  const current = SECTION_INFO[activeIndex]

  return (
    <button
      onClick={() => requestScrollTo(0)}
      className="fixed bottom-6 right-6 z-40 lg:hidden
                 px-4 py-2 rounded-full backdrop-blur-md
                 bg-black/40 border border-white/10
                 text-[10px] tracking-[0.2em] uppercase text-white/70
                 font-serif hover:bg-white/[0.06] hover:text-white
                 transition-all duration-300"
    >
      {current?.title ?? 'Chapters'}
    </button>
  )
}
