import { create } from 'zustand'

export type AppPhase = 'intro' | 'exploring'

interface AppState {
  phase: AppPhase
  setPhase: (phase: AppPhase) => void
  scrollProgress: number
  setScrollProgress: (progress: number) => void
  hoveredPlanet: string | null
  setHoveredPlanet: (id: string | null) => void
  focusedPlanet: string | null
  setFocusedPlanet: (id: string | null) => void
  scrollToTarget: number | null
  requestScrollTo: (progress: number) => void
  clearScrollTarget: () => void
}

export const useAppStore = create<AppState>((set) => ({
  phase: 'intro',
  setPhase: (phase) => set({ phase }),
  scrollProgress: 0,
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  hoveredPlanet: null,
  setHoveredPlanet: (id) => set({ hoveredPlanet: id }),
  focusedPlanet: null,
  setFocusedPlanet: (id) => set({ focusedPlanet: id }),
  scrollToTarget: null,
  requestScrollTo: (progress) => set({ scrollToTarget: progress }),
  clearScrollTarget: () => set({ scrollToTarget: null }),
}))
