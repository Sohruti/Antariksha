'use client'

/* eslint-disable react-hooks/immutability -- THREE.js textures are mutated by design. */

import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import type { CelestialData } from '@/data/planets'
import { useAppStore } from '@/store/useAppStore'
import { Atmosphere } from './Planet'

export function Jupiter({ body }: { body: CelestialData }) {
  const planetRef = useRef<THREE.Mesh>(null!)
  const stormRef = useRef<THREE.Mesh>(null!)
  const setHoveredPlanet = useAppStore((s) => s.setHoveredPlanet)
  const hoveredPlanet = useAppStore((s) => s.hoveredPlanet)

  const texture = useTexture(body.texture ?? '')
  useEffect(() => {
    texture.anisotropy = 4
    texture.colorSpace = THREE.SRGBColorSpace
  }, [texture])

  useFrame((_, delta) => {
    if (planetRef.current) {
      const speed = body.rotationSpeed ?? 1.0
      planetRef.current.rotation.y += delta * speed
    }
    if (stormRef.current) {
      stormRef.current.rotation.y = (planetRef.current?.rotation.y ?? 0) * 0.96
    }
  })

  const isHovered = hoveredPlanet === body.id

  return (
    <group position={[body.x, 0, 0]}>
      <mesh
        ref={planetRef}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHoveredPlanet(body.id)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHoveredPlanet(null)
          document.body.style.cursor = 'auto'
        }}
        scale={isHovered ? 1.06 : 1.0}
      >
        <sphereGeometry args={[body.size, 96, 96]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.75}
          metalness={0.05}
          emissive={new THREE.Color('#3a2a1a')}
          emissiveIntensity={0.05}
        />
      </mesh>

      <mesh
        ref={stormRef}
        position={[0, -body.size * 0.25, body.size * 0.92]}
        scale={[body.size * 0.28, body.size * 0.12, body.size * 0.04]}
        renderOrder={1}
      >
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial
          color="#C13B1E"
          transparent
          opacity={0.92}
          depthWrite={false}
        />
      </mesh>

      {body.atmosphere && (
        <Atmosphere
          size={body.size}
          color={body.atmosphere.color}
          intensity={body.atmosphere.intensity}
          scale={body.atmosphere.scale}
        />
      )}
    </group>
  )
}
