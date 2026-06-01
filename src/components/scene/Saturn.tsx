'use client'

/* eslint-disable react-hooks/immutability -- THREE.js textures and shader materials are mutated by design. */

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import type { CelestialData } from '@/data/planets'
import { useAppStore } from '@/store/useAppStore'
import { Atmosphere } from './Planet'

const RING_VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vViewDir;

  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`

const RING_FRAG = /* glsl */ `
  uniform float uInner;
  uniform float uOuter;
  uniform vec3 uColor;
  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vViewDir;

  float hash(float n) { return fract(sin(n) * 43758.5453); }
  float noise(float x) {
    float i = floor(x);
    float f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(hash(i), hash(i + 1.0), f);
  }

  void main() {
    float r = length(vWorldPos.xz);
    float t = (r - uInner) / (uOuter - uInner);
    if (t < 0.0 || t > 1.0) discard;

    float bands = 0.0;
    bands += 0.5 * sin(t * 90.0);
    bands += 0.3 * sin(t * 140.0 + 1.7);
    bands += 0.2 * sin(t * 220.0 + 0.5);
    bands = bands * 0.5 + 0.5;

    float gap1 = smoothstep(0.42, 0.44, t) * (1.0 - smoothstep(0.46, 0.48, t));
    float gap2 = smoothstep(0.62, 0.64, t) * (1.0 - smoothstep(0.66, 0.68, t));
    bands *= 1.0 - (gap1 + gap2);

    float n = noise(t * 50.0) * 0.25;
    float density = bands * 0.85 + n;

    float fade = smoothstep(0.0, 0.08, t) * (1.0 - smoothstep(0.92, 1.0, t));

    float viewDot = abs(vViewDir.y);
    float ringShade = mix(0.6, 1.0, viewDot);

    vec3 col = uColor * ringShade;
    float alpha = density * fade * 0.92;

    gl_FragColor = vec4(col, alpha);
  }
`

export function Saturn({ body }: { body: CelestialData }) {
  const planetRef = useRef<THREE.Mesh>(null!)
  const ringGroupRef = useRef<THREE.Group>(null!)
  const setHoveredPlanet = useAppStore((s) => s.setHoveredPlanet)
  const hoveredPlanet = useAppStore((s) => s.hoveredPlanet)

  const texture = useTexture(body.texture ?? '')
  useEffect(() => {
    texture.anisotropy = 4
    texture.colorSpace = THREE.SRGBColorSpace
  }, [texture])

  const ringMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: RING_VERT,
        fragmentShader: RING_FRAG,
        uniforms: {
          uInner: { value: 0 },
          uOuter: { value: 1 },
          uColor: { value: new THREE.Color(body.ring?.color ?? '#D4B896') },
        },
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.NormalBlending,
      }),
    [body.ring?.color],
  )

  useFrame((_, delta) => {
    if (planetRef.current) {
      const speed = body.rotationSpeed ?? 0.9
      planetRef.current.rotation.y += delta * speed
    }
    if (ringGroupRef.current) {
      ringGroupRef.current.rotation.z += delta * 0.05
    }
  })

  const isHovered = hoveredPlanet === body.id

  if (!body.ring) return null

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
        <sphereGeometry args={[body.size, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.8}
          metalness={0.05}
          emissive={new THREE.Color('#3a2a1a')}
          emissiveIntensity={0.05}
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

      <group ref={ringGroupRef} rotation={[Math.PI * 0.5 - body.ring.tilt, 0, 0]}>
        <mesh
          material={ringMaterial}
          onUpdate={(self) => {
            const m = self.material as THREE.ShaderMaterial
            m.uniforms.uInner.value = body.size * body.ring!.innerRadius
            m.uniforms.uOuter.value = body.size * body.ring!.outerRadius
          }}
          renderOrder={2}
        >
          <ringGeometry
            args={[
              body.size * body.ring.innerRadius,
              body.size * body.ring.outerRadius,
              192,
            ]}
          />
        </mesh>
      </group>
    </group>
  )
}
