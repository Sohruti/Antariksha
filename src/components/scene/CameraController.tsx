'use client'

import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useAppStore } from '@/store/useAppStore'
import { CELESTIAL_BODIES } from '@/data/planets'
import * as THREE from 'three'

interface Waypoint {
  progress: number
  pos: [number, number, number]
  target: [number, number, number]
  fov?: number
}

const WAYPOINTS: Waypoint[] = [
  { progress: 0,    pos: [0, 3, 15],     target: [0, 0, 0] },
  { progress: 0.05, pos: [0, 5, 25],     target: [0, 0, 0] },
  { progress: 0.15, pos: [9.69, 1, 3],   target: [9.69, 0, 0] },
  { progress: 0.25, pos: [12.23, 1, 4],  target: [12.23, 0, 0] },
  { progress: 0.35, pos: [16.11, 1, 4],  target: [16.11, 0, 0] },
  { progress: 0.45, pos: [20.45, 1, 3],  target: [20.45, 0, 0] },
  { progress: 0.55, pos: [28.78, 2, 7],  target: [28.78, 0, 0] },
  { progress: 0.65, pos: [36.61, 2, 7],  target: [36.61, 0, 0] },
  { progress: 0.75, pos: [44.26, 1.5, 5], target: [44.26, 0, 0] },
  { progress: 0.85, pos: [49.93, 1.5, 5], target: [49.93, 0, 0] },
  { progress: 0.95, pos: [30, 20, 50],   target: [25, 0, 0] },
  { progress: 1.0,  pos: [25, 30, 60],   target: [25, 0, 0] },
]

function interpolate(progress: number, waypoints: Waypoint[]) {
  if (progress <= waypoints[0].progress) return { pos: waypoints[0].pos, target: waypoints[0].target }
  const last = waypoints.length - 1
  if (progress >= waypoints[last].progress) return { pos: waypoints[last].pos, target: waypoints[last].target }

  for (let i = 0; i < last; i++) {
    const a = waypoints[i]
    const b = waypoints[i + 1]
    if (progress >= a.progress && progress <= b.progress) {
      const t = (progress - a.progress) / (b.progress - a.progress)
      const s = t * t * (3 - 2 * t)
      return {
        pos: [
          a.pos[0] + (b.pos[0] - a.pos[0]) * s,
          a.pos[1] + (b.pos[1] - a.pos[1]) * s,
          a.pos[2] + (b.pos[2] - a.pos[2]) * s,
        ] as [number, number, number],
        target: [
          a.target[0] + (b.target[0] - a.target[0]) * s,
          a.target[1] + (b.target[1] - a.target[1]) * s,
          a.target[2] + (b.target[2] - a.target[2]) * s,
        ] as [number, number, number],
      }
    }
  }
  return { pos: waypoints[last].pos, target: waypoints[last].target }
}

export function CameraController() {
  const scrollProgress = useAppStore((s) => s.scrollProgress)
  const focusedPlanet = useAppStore((s) => s.focusedPlanet)
  const currentPos = useRef(new THREE.Vector3(0, 3, 15))
  const currentTarget = useRef(new THREE.Vector3(0, 0, 0))
  const { camera } = useThree()
  const controlsRef = useRef<any>(null!)

  useFrame((state, delta) => {
    if (focusedPlanet) return

    const wp = interpolate(scrollProgress, WAYPOINTS)
    const targetPos = new THREE.Vector3(wp.pos[0], wp.pos[1], wp.pos[2])
    const targetLook = new THREE.Vector3(wp.target[0], wp.target[1], wp.target[2])

    const smoothFactor = 1 - Math.exp(-4 * delta)
    currentPos.current.lerp(targetPos, smoothFactor)
    currentTarget.current.lerp(targetLook, smoothFactor)

    state.camera.position.copy(currentPos.current)
    state.camera.lookAt(currentTarget.current)
  })

  return <OrbitControls ref={controlsRef} enableZoom={false} enablePan={false} enableRotate={false} />
}
