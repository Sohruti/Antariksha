'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CELESTIAL_BODIES } from '@/data/planets'
import { useAppStore } from '@/store/useAppStore'

type Tab = 'timeline' | 'compare' | 'scale' | 'quiz'

const QUIZ = [
  {
    q: 'Which planet has the shortest day?',
    options: ['Earth', 'Jupiter', 'Mercury', 'Venus'],
    answer: 1,
  },
  {
    q: 'Which planet is the hottest?',
    options: ['Mercury', 'Venus', 'Mars', 'Jupiter'],
    answer: 1,
  },
  {
    q: 'How many moons does Jupiter have?',
    options: ['27', '53', '95', '146'],
    answer: 2,
  },
  {
    q: 'Which planet rotates on its side?',
    options: ['Neptune', 'Uranus', 'Saturn', 'Pluto'],
    answer: 1,
  },
  {
    q: 'What is the largest planet in our solar system?',
    options: ['Saturn', 'Neptune', 'Jupiter', 'Uranus'],
    answer: 2,
  },
]

export function EducationalPanel() {
  const [tab, setTab] = useState<Tab>('timeline')
  const [quizIndex, setQuizIndex] = useState(0)
  const [quizScore, setQuizScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const requestScrollTo = useAppStore((s) => s.requestScrollTo)

  function handleAnswer(i: number) {
    if (answered) return
    setSelected(i)
    setAnswered(true)
    if (i === QUIZ[quizIndex].answer) setQuizScore((s) => s + 1)
  }

  function nextQuestion() {
    if (quizIndex < QUIZ.length - 1) {
      setQuizIndex((i) => i + 1)
      setAnswered(false)
      setSelected(null)
    }
  }

  function resetQuiz() {
    setQuizIndex(0)
    setQuizScore(0)
    setAnswered(false)
    setSelected(null)
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'timeline', label: 'Timeline' },
    { id: 'compare', label: 'Compare' },
    { id: 'scale', label: 'Scale' },
    { id: 'quiz', label: 'Quiz' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="fixed bottom-24 right-6 z-30 hidden lg:block"
    >
      <div className="backdrop-blur-2xl bg-black/60 border border-white/10 rounded-2xl w-72 overflow-hidden"
        style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.6)' }}
      >
        <div className="flex border-b border-white/10">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 text-[9px] tracking-[0.2em] py-2.5 font-mono uppercase transition-all duration-300 ${
                tab === t.id ? 'text-blue-300 bg-white/[0.04]' : 'text-white/30 hover:text-white/60'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-4 max-h-60 overflow-y-auto">
          <AnimatePresence mode="wait">
            {tab === 'timeline' && (
              <motion.div key="timeline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="text-[10px] tracking-[0.3em] text-blue-300/50 uppercase mb-3 font-mono">Solar System Timeline</p>
                <div className="space-y-2">
                  {CELESTIAL_BODIES.filter((b) => b.id !== 'sun').map((body, i) => (
                    <button
                      key={body.id}
                      onClick={() => requestScrollTo((i + 1) / (CELESTIAL_BODIES.length - 1))}
                      className="w-full text-left flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.04] transition-colors group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: body.color }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white/70 font-serif group-hover:text-white transition-colors truncate">{body.name}</p>
                        <p className="text-[9px] text-white/30 font-mono">{body.distanceFromSun}</p>
                      </div>
                      <span className="text-[9px] text-white/20 font-mono">0{i + 1}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {tab === 'compare' && (
              <motion.div key="compare" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="text-[10px] tracking-[0.3em] text-blue-300/50 uppercase mb-3 font-mono">Planet Comparison</p>
                <div className="space-y-2">
                  {CELESTIAL_BODIES.filter((b) => b.id !== 'sun').map((body) => (
                    <div key={body.id} className="flex items-center gap-2 p-2">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: body.color }} />
                      <span className="text-xs text-white/60 font-serif w-16">{body.name}</span>
                      <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(parseFloat(body.actualRadius.replace(/[, km]/g, '')) / 69911) * 100}%`,
                            backgroundColor: body.color,
                          }}
                        />
                      </div>
                      <span className="text-[9px] text-white/30 font-mono w-14 text-right">{body.actualRadius}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {tab === 'scale' && (
              <motion.div key="scale" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="text-[10px] tracking-[0.3em] text-blue-300/50 uppercase mb-3 font-mono">Scale Visualization</p>
                <div className="space-y-3">
                  {[
                    { label: 'Sun vs Earth', ratio: '109x' },
                    { label: 'Jupiter vs Earth', ratio: '11x' },
                    { label: 'Earth vs Mars', ratio: '1.9x' },
                    { label: 'Saturn vs Earth', ratio: '9.5x' },
                    { label: 'Distance: Sun to Earth', ratio: '149.6M km' },
                    { label: 'Distance: Sun to Neptune', ratio: '4.5B km' },
                  ].map((item) => (
                    <div key={item.label} className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                      <p className="text-[10px] text-white/60 font-serif">{item.label}</p>
                      <p className="text-sm text-blue-300/80 font-mono mt-0.5">{item.ratio}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {tab === 'quiz' && (
              <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="text-[10px] tracking-[0.3em] text-blue-300/50 uppercase mb-3 font-mono">Space Quiz</p>
                <p className="text-xs text-white/70 font-serif mb-3">{QUIZ[quizIndex].q}</p>
                <div className="space-y-1.5">
                  {QUIZ[quizIndex].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      className={`w-full text-left text-xs p-2 rounded-lg border transition-all duration-300 font-serif ${
                        answered
                          ? i === QUIZ[quizIndex].answer
                            ? 'border-green-500/50 bg-green-500/10 text-green-300'
                            : i === selected
                              ? 'border-red-500/50 bg-red-500/10 text-red-300'
                              : 'border-white/5 text-white/40'
                          : 'border-white/5 text-white/60 hover:border-white/20 hover:text-white/80'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {answered && (
                  <div className="mt-3">
                    {quizIndex < QUIZ.length - 1 ? (
                      <button
                        onClick={nextQuestion}
                        className="text-[10px] tracking-[0.2em] text-blue-300/70 uppercase font-mono hover:text-blue-300"
                      >
                        Next →
                      </button>
                    ) : (
                      <div>
                        <p className="text-xs text-white/70 font-serif mb-2">
                          Score: {quizScore}/{QUIZ.length}
                        </p>
                        <button
                          onClick={resetQuiz}
                          className="text-[10px] tracking-[0.2em] text-blue-300/70 uppercase font-mono hover:text-blue-300"
                        >
                          Retry
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
