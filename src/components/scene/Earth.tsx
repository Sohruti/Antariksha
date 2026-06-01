'use client'

/* eslint-disable react-hooks/immutability -- THREE.js textures, shader materials, and uniforms are mutated by design. */

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { useAppStore } from '@/store/useAppStore'
import { Atmosphere } from './Planet'

const CLOUD_VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`

const CLOUD_FRAG = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 6; i++) {
      v += a * noise(p);
      p *= 2.05;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv * 4.0;
    float t = uTime * 0.012;

    float n1 = fbm(uv + vec2(t, t * 0.4));
    float n2 = fbm(uv * 2.3 - vec2(t * 0.6, t * 0.3) + 7.0);
    float clouds = smoothstep(0.42, 0.78, n1) * 0.85 + smoothstep(0.5, 0.85, n2) * 0.35;
    clouds = clamp(clouds, 0.0, 1.0);

    float v = abs(dot(vNormal, vViewDir));
    float facing = smoothstep(0.0, 0.35, v);
    float alpha = clouds * facing * 0.9;

    vec3 cloudCol = vec3(1.0, 0.99, 0.96);
    float lit = clamp(dot(vNormal, normalize(vec3(0.5, 0.5, 1.0))), 0.0, 1.0);
    cloudCol *= 0.75 + 0.25 * lit;

    gl_FragColor = vec4(cloudCol, alpha);
  }
`

interface EarthProps {
  position: [number, number, number]
  size: number
  texture: string
  atmosphereColor: string
  atmosphereIntensity: number
  satGroupRef?: React.RefObject<THREE.Group>
  satelliteOrbitRadius?: number
}

export function Earth({
  position,
  size,
  texture: texturePath,
  atmosphereColor,
  atmosphereIntensity,
  satGroupRef,
  satelliteOrbitRadius = 1.8,
}: EarthProps) {
  const earthRef = useRef<THREE.Mesh>(null!)
  const cloudRef = useRef<THREE.Mesh>(null!)
  const setHoveredPlanet = useAppStore((s) => s.setHoveredPlanet)
  const hoveredPlanet = useAppStore((s) => s.hoveredPlanet)

  const texture = useTexture(texturePath)
  useEffect(() => {
    texture.anisotropy = 8
    texture.colorSpace = THREE.SRGBColorSpace
  }, [texture])

  const cloudMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: CLOUD_VERT,
        fragmentShader: CLOUD_FRAG,
        uniforms: { uTime: { value: 0 } },
        transparent: true,
        depthWrite: false,
      }),
    [],
  )

  useFrame((state, delta) => {
    cloudMaterial.uniforms.uTime.value = state.clock.elapsedTime
    if (earthRef.current) earthRef.current.rotation.y += delta * 0.4
    if (cloudRef.current) cloudRef.current.rotation.y += delta * 0.5
  })

  const isHovered = hoveredPlanet === 'earth'

  return (
    <group position={position}>
      <mesh
        ref={earthRef}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHoveredPlanet('earth')
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHoveredPlanet(null)
          document.body.style.cursor = 'auto'
        }}
        scale={isHovered ? 1.06 : 1.0}
      >
        <sphereGeometry args={[size, 96, 96]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.78}
          metalness={0.1}
          emissive="#1a3a7a"
          emissiveIntensity={0.06}
        />
      </mesh>

      <mesh ref={cloudRef} material={cloudMaterial} renderOrder={2}>
        <sphereGeometry args={[size * 1.015, 96, 96]} />
      </mesh>

      <Atmosphere
        size={size}
        color={atmosphereColor}
        intensity={atmosphereIntensity}
        scale={1.18}
      />

      {satGroupRef && (
        <group ref={satGroupRef}>
          <mesh rotation={[Math.PI * 0.3, 0, 0]}>
            <ringGeometry args={[satelliteOrbitRadius - 0.02, satelliteOrbitRadius + 0.02, 64]} />
            <meshBasicMaterial color="#4488FF" transparent opacity={0.08} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}
    </group>
  )
}
