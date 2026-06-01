import { create } from 'zustand'

export type AppPhase = 'intro' | 'exploring'

interface AppState {
  phase: AppPhase
  setPhase: (phase: AppPhase) => void
  scrollProgress: number
  setScrollProgress: (progress: number) => void
  hoveredPlanet: string | null
  setHoveredPlanet: (id: string | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  phase: 'intro',
  setPhase: (phase) => set({ phase }),
  scrollProgress: 0,
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  hoveredPlanet: null,
  setHoveredPlanet: (id) => set({ hoveredPlanet: id }),
}))
