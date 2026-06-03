'use client'

import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { AdaptiveDpr, AdaptiveEvents } from '@react-three/drei'
import { CELESTIAL_BODIES } from '@/data/planets'
import { GlbPlanet, useGlbPlanets } from './GlbPlanet'
import { OrbitRing, SaturnRings } from './OrbitRing'
import { Starfield } from './Starfield'
import { SpaceDust } from './SpaceDust'
import { CameraController } from './CameraController'
import { Effects } from './Effects'

const PLANET_IDS = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'] as const

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 0, 0]} intensity={3.0} color="#FDB813" decay={0.3} distance={200} />
      <pointLight position={[0, 0, 0]} intensity={1.5} color="#FFE4B5" decay={0.5} distance={100} />
      <directionalLight position={[30, 50, 30]} intensity={0.4} color="#ffffff" castShadow />
      <hemisphereLight args={['#0a0a2a', '#020010', 0.3]} />
    </>
  )
}

function PlanetSystem() {
  const getPlanetMesh = useGlbPlanets()

  return (
    <>
      {CELESTIAL_BODIES.map((body) => (
        <GlbPlanet key={body.id} data={body} planetMesh={getPlanetMesh(body.id)} />
      ))}
    </>
  )
}

function OrbitRings() {
  return (
    <>
      {PLANET_IDS.map((id) => {
        const body = CELESTIAL_BODIES.find((b) => b.id === id)
        if (!body) return null
        const ringRadius = Math.abs(body.x) + 0.5
        return <OrbitRing key={id} radius={ringRadius} color={body.color} />
      })}
    </>
  )
}

function SceneContent() {
  return (
    <Suspense fallback={null}>
      <SceneLights />
      <OrbitRings />
      <PlanetSystem />
      <SaturnRings innerRadius={1.3} outerRadius={2.4} />
      <Starfield count={4000} />
      <SpaceDust count={600} />
      <CameraController />
      <Effects enabled={true} />
    </Suspense>
  )
}

export default function SolarScene() {
  return (
    <Canvas
      camera={{ fov: 55, near: 0.1, far: 1000, position: [0, 3, 15] }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
      shadows={{ enabled: true, type: THREE.PCFSoftShadowMap }}
      dpr={[1, 1.5]}
    >
      <color attach="background" args={['#020010']} />
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      <SceneContent />
    </Canvas>
  )
}
