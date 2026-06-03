'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import type { CelestialData } from '@/data/planets'

const MODEL_URL = '/models/solar_system_animation.glb'
useGLTF.preload(MODEL_URL)

function GlowSprite({ color, radius }: { color: string; radius: number }) {
  const ref = useRef<THREE.Sprite>(null!)
  const textureRef = useRef<THREE.CanvasTexture | null>(null)

  if (!textureRef.current) {
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 128
    const ctx = canvas.getContext('2d')!
    const c = new THREE.Color(color)
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
    gradient.addColorStop(0, `rgba(${c.r*255|0},${c.g*255|0},${c.b*255|0},0.5)`)
    gradient.addColorStop(0.2, `rgba(${c.r*255|0},${c.g*255|0},${c.b*255|0},0.2)`)
    gradient.addColorStop(0.6, `rgba(${c.r*255|0},${c.g*255|0},${c.b*255|0},0.05)`)
    gradient.addColorStop(1, `rgba(${c.r*255|0},${c.g*255|0},${c.b*255|0},0)`)
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 128, 128)
    textureRef.current = new THREE.CanvasTexture(canvas)
  }

  return (
    <sprite ref={ref} scale={[radius * 8, radius * 8, 1]}>
      <spriteMaterial map={textureRef.current} transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.7} />
    </sprite>
  )
}

function HoverOutline({ radius, color, visible }: { radius: number; color: string; visible: boolean }) {
  return (
    <mesh scale={[1.15, 1.15, 1.15]} visible={visible}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.3} wireframe side={THREE.BackSide} />
    </mesh>
  )
}

export function GlbPlanet({ data, planetMesh }: { data: CelestialData; planetMesh: THREE.Object3D | null }) {
  const groupRef = useRef<THREE.Group>(null!)
  const [hovered, setHovered] = useState(false)
  const isSun = data.id === 'sun'

  useFrame((_, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += delta * (isSun ? 0.03 : 0.08)
    if (isSun) {
      groupRef.current.rotation.x += delta * 0.01
    }
  })

  const scale = data.radius

  return (
    <group
      ref={groupRef}
      position={[data.x, 0, 0]}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
      onPointerOut={() => setHovered(false)}
    >
      {planetMesh ? (
        <primitive
          object={planetMesh}
          scale={[scale, scale, scale]}
          userData={{ planetId: data.id }}
        />
      ) : (
        <mesh>
          <sphereGeometry args={[scale, 48, 48]} />
          <meshStandardMaterial
            color={data.color}
            roughness={0.6}
            metalness={0.1}
            emissive={isSun ? '#FDB813' : data.color}
            emissiveIntensity={isSun ? 0.8 : 0.05}
          />
        </mesh>
      )}

      <GlowSprite color={data.color} radius={scale} />
      <HoverOutline radius={scale} color={isSun ? '#FDB813' : data.color} visible={hovered} />
    </group>
  )
}

export function useGlbPlanets() {
  const { scene } = useGLTF(MODEL_URL)
  const planetMeshes = useRef<Map<string, THREE.Object3D>>(new Map())

  scene.traverse((child) => {
    if (child.type === 'Mesh' || child.type === 'Group') {
      const name = child.name.toLowerCase()
      for (const id of ['sun', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune']) {
        if (name.includes(id) && !planetMeshes.current.has(id)) {
          const clone = child.clone()
          planetMeshes.current.set(id, clone)
        }
      }
    }
  })

  return (id: string) => planetMeshes.current.get(id) ?? null
}
