'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function SpaceDust({ count = 800 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!)

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 200
      pos[i * 3 + 1] = (Math.random() - 0.5) * 200
      pos[i * 3 + 2] = (Math.random() - 0.5) * 200
    }
    return pos
  }, [count])

  useFrame((_, delta) => {
    if (!ref.current) return
    const positions = ref.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1] += delta * (0.02 + Math.sin(i) * 0.01)
      if (positions[i * 3 + 1] > 100) positions[i * 3 + 1] = -100
    }
    ref.current.geometry.attributes.position.needsUpdate = true
    ref.current.rotation.y += delta * 0.005
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#8899cc"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
