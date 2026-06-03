'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'

export function ScrollProgress() {
  const scrollProgress = useAppStore((s) => s.scrollProgress)

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[2px] z-40 bg-white/5">
      <motion.div
        className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-400"
        style={{ width: `${scrollProgress * 100}%` }}
        transition={{ duration: 0.1 }}
      />
    </div>
  )
}
