'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const backgroundStarData = (() => {
  const count = 2500
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const radius = 45 + Math.random() * 35

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = radius * Math.cos(phi)

    const temp = Math.random()
    colors[i * 3] = 0.65 + temp * 0.35
    colors[i * 3 + 1] = 0.7 + temp * 0.25
    colors[i * 3 + 2] = 0.75 + temp * 0.25
  }

  return { positions, colors }
})()

const twinkleLayersData = Array.from({ length: 5 }, (_, layerIdx) => {
  const count = 20
  const positions = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const radius = 30 + Math.random() * 45

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = radius * Math.cos(phi)
  }

  return { positions, phase: (layerIdx / 5) * Math.PI * 2 }
})

function BackgroundStars() {
  const ref = useRef<THREE.Points>(null!)

  useFrame(() => {
    ref.current.rotation.y += 0.00012
    ref.current.rotation.x += 0.00004
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[backgroundStarData.positions, 3]}
        />
        <bufferAttribute attach="attributes-color" args={[backgroundStarData.colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function TwinkleStars() {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    groupRef.current.children.forEach((child, i) => {
      const mesh = child as THREE.Points
      mesh.rotation.y += 0.0002 + i * 0.00005
      mesh.rotation.x += 0.00007

      const mat = mesh.material as THREE.PointsMaterial
      const { phase } = twinkleLayersData[i]
      mat.opacity = 0.15 + 0.4 * (0.5 + 0.5 * Math.sin(t * 1.8 + phase))
    })
  })

  return (
    <group ref={groupRef}>
      {twinkleLayersData.map(({ positions }, i) => (
        <points key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[positions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.18 + i * 0.02}
            color="#ffffff"
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      ))}
    </group>
  )
}

function CameraDrift() {
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    state.camera.position.x = Math.sin(t * 0.08) * 2.5
    state.camera.position.y = Math.cos(t * 0.12) * 2
    state.camera.position.z = 12 + Math.sin(t * 0.05) * 1.5
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

export default function StarfieldScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 60 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <color attach="background" args={['#020010']} />
      <BackgroundStars />
      <TwinkleStars />
      <CameraDrift />
    </Canvas>
  )
}
