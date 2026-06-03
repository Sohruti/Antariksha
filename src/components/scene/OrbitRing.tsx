'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function OrbitRing({ radius, color = '#ffffff' }: { radius: number; color?: string }) {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(() => {
    if (ref.current) ref.current.rotation.x += 0.001
  })

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.02, radius + 0.02, 128]} />
      <meshBasicMaterial color={color} transparent opacity={0.15} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  )
}

export function SaturnRings({ innerRadius, outerRadius }: { innerRadius: number; outerRadius: number }) {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.05
  })

  return (
    <mesh ref={ref} rotation={[0.4, 0, 0]}>
      <ringGeometry args={[innerRadius, outerRadius, 64]} />
      <meshStandardMaterial
        color="#C8A06E"
        transparent
        opacity={0.5}
        side={THREE.DoubleSide}
        depthWrite={false}
        roughness={0.8}
        metalness={0.2}
      />
    </mesh>
  )
}
