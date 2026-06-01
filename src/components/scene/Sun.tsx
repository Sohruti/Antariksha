'use client'

/* eslint-disable react-hooks/immutability -- THREE.js shader materials, uniforms, and textures are mutated by design each frame. */

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useAppStore } from '@/store/useAppStore'

const SUN_VERT = /* glsl */ `
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

const SUN_FRAG = /* glsl */ `
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
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv * 3.0;
    float t = uTime * 0.08;

    float n1 = fbm(uv + vec2(t, t * 0.6));
    float n2 = fbm(uv * 2.1 + vec2(-t * 0.7, t * 0.4) + 4.0);
    float plasma = pow(n1, 1.3) * 0.7 + pow(n2, 1.6) * 0.5;

    vec3 deepOrange = vec3(1.0, 0.25, 0.04);
    vec3 hotYellow  = vec3(1.0, 0.78, 0.18);
    vec3 whiteHot   = vec3(1.0, 0.96, 0.78);

    vec3 col = mix(deepOrange, hotYellow, smoothstep(0.25, 0.7, plasma));
    col = mix(col, whiteHot, smoothstep(0.7, 0.95, n2));

    float fresnel = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 2.2);
    col += vec3(1.0, 0.45, 0.12) * fresnel * 0.85;

    col *= 1.15;

    gl_FragColor = vec4(col, 1.0);
  }
`

const CORONA_FRAG = /* glsl */ `
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

  void main() {
    float fresnel = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 3.0);
    float flare = noise(vUv * 6.0 + uTime * 0.5);
    float a = fresnel * (0.55 + 0.45 * flare);
    vec3 col = mix(vec3(1.0, 0.4, 0.08), vec3(1.0, 0.85, 0.35), flare);
    gl_FragColor = vec4(col, a);
  }
`

export function Sun({ position, size = 3.5 }: { position: [number, number, number]; size?: number }) {
  const coreRef = useRef<THREE.Mesh>(null!)
  const coronaRef = useRef<THREE.Mesh>(null!)
  const outerGlowRef = useRef<THREE.Mesh>(null!)
  const setHoveredPlanet = useAppStore((s) => s.setHoveredPlanet)

  const sunMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: SUN_VERT,
        fragmentShader: SUN_FRAG,
        uniforms: { uTime: { value: 0 } },
        transparent: false,
      }),
    [],
  )

  const coronaMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: SUN_VERT,
        fragmentShader: CORONA_FRAG,
        uniforms: { uTime: { value: 0 } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
      }),
    [],
  )

  // eslint-disable react-hooks/immutability -- THREE.js shader uniforms are mutated each frame.
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    sunMaterial.uniforms.uTime.value = t
    coronaMaterial.uniforms.uTime.value = t

    if (coreRef.current) coreRef.current.rotation.y += delta * 0.05
    if (coronaRef.current) {
      const pulse = 1 + Math.sin(t * 0.6) * 0.04
      coronaRef.current.scale.setScalar(pulse)
      coronaRef.current.rotation.y -= delta * 0.02
    }
    if (outerGlowRef.current) {
      const slow = 1 + Math.sin(t * 0.3) * 0.06
      outerGlowRef.current.scale.setScalar(slow)
    }
  })
  // eslint-enable react-hooks/immutability

  return (
    <group position={position}>
      <mesh
        ref={coreRef}
        material={sunMaterial}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHoveredPlanet('sun')
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHoveredPlanet(null)
          document.body.style.cursor = 'auto'
        }}
      >
        <sphereGeometry args={[size, 96, 96]} />
      </mesh>

      <mesh ref={coronaRef} material={coronaMaterial} renderOrder={2}>
        <sphereGeometry args={[size * 1.18, 64, 64]} />
      </mesh>

      <mesh ref={outerGlowRef} renderOrder={1}>
        <sphereGeometry args={[size * 1.6, 32, 32]} />
        <meshBasicMaterial
          color="#FF6A1A"
          transparent
          opacity={0.06}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      <mesh renderOrder={0}>
        <sphereGeometry args={[size * 2.2, 32, 32]} />
        <meshBasicMaterial
          color="#FF8A30"
          transparent
          opacity={0.025}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}
