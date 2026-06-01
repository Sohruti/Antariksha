'use client'

/* eslint-disable react-hooks/immutability -- THREE.js textures and shader materials are mutated by design. */

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import type { CelestialData } from '@/data/planets'
import { useAppStore } from '@/store/useAppStore'

const ATMOSPHERE_VERT = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`

const ATMOSPHERE_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    float fresnel = pow(1.0 - abs(dot(vNormal, vViewDir)), 2.0);
    vec3 col = uColor * uIntensity;
    gl_FragColor = vec4(col, fresnel);
  }
`

export function Atmosphere({
  size,
  color,
  intensity,
  scale = 1.15,
}: {
  size: number
  color: string
  intensity: number
  scale?: number
}) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: ATMOSPHERE_VERT,
        fragmentShader: ATMOSPHERE_FRAG,
        uniforms: {
          uColor: { value: new THREE.Color(color) },
          uIntensity: { value: intensity },
        },
        transparent: true,
        side: THREE.BackSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [color, intensity],
  )

  return (
    <mesh material={material} renderOrder={3}>
      <sphereGeometry args={[size * scale, 64, 64]} />
    </mesh>
  )
}

export function Planet({
  body,
  position,
}: {
  body: CelestialData
  position: [number, number, number]
}) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const setHoveredPlanet = useAppStore((s) => s.setHoveredPlanet)
  const hoveredPlanet = useAppStore((s) => s.hoveredPlanet)

  const texture = useTexture(body.texture ?? '')

  useEffect(() => {
    texture.anisotropy = 4
    texture.colorSpace = THREE.SRGBColorSpace
  }, [texture])

  useFrame((_, delta) => {
    if (meshRef.current) {
      const speed = body.rotationSpeed ?? 0.2
      meshRef.current.rotation.y += delta * speed
    }
  })

  const isHovered = hoveredPlanet === body.id

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
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
        <sphereGeometry args={[body.size, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.85}
          metalness={0.05}
          emissive={body.emissive ? new THREE.Color(body.emissive) : new THREE.Color(body.color)}
          emissiveIntensity={body.emissiveIntensity ?? 0.04}
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

      {body.ring && (
        <mesh rotation={[Math.PI * 0.5 - body.ring.tilt, 0, 0]} renderOrder={2}>
          <ringGeometry
            args={[body.size * body.ring.innerRadius, body.size * body.ring.outerRadius, 128]}
          />
          <meshStandardMaterial
            color={body.ring.color}
            transparent
            opacity={body.ring.opacity}
            side={THREE.DoubleSide}
            roughness={0.6}
            metalness={0.2}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  )
}
