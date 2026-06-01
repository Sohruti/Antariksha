'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useAppStore } from '@/store/useAppStore'
import { CELESTIAL_BODIES } from '@/data/planets'

const PLANET_LAYOUT = CELESTIAL_BODIES.map((b) => ({
  id: b.id,
  x: b.x,
  size: b.size,
  color: b.color,
}))

const EARTH = CELESTIAL_BODIES.find((b) => b.id === 'earth')!

interface Keyframe {
  progress: number
  pos: [number, number, number]
  target: [number, number, number]
}

const KEYFRAMES: Keyframe[] = [
  { progress: 0, pos: [EARTH.x, 0.3, 3], target: [EARTH.x, 0, 0] },
  { progress: 0.07, pos: [EARTH.x, 1, 8], target: [EARTH.x, 0, 0] },
  { progress: 0.14, pos: [EARTH.x, 3, 18], target: [EARTH.x, 0, 0] },
  { progress: 0.19, pos: [8, 4, 20], target: [0, 0, 0] },
  { progress: 0.23, pos: [28, 0.8, 5], target: [28, 0, 0] },
  { progress: 0.31, pos: [42, 0.8, 5], target: [42, 0, 0] },
  { progress: 0.40, pos: [EARTH.x, 0.8, 5], target: [EARTH.x, 0, 0] },
  { progress: 0.48, pos: [80, 0.8, 5], target: [80, 0, 0] },
  { progress: 0.57, pos: [105, 1.5, 6], target: [105, 0, 0] },
  { progress: 0.65, pos: [135, 1.5, 6], target: [135, 0, 0] },
  { progress: 0.73, pos: [165, 1.2, 5], target: [165, 0, 0] },
  { progress: 0.82, pos: [195, 1.2, 5], target: [195, 0, 0] },
  { progress: 1.0, pos: [40, 40, 80], target: [0, 0, 0] },
]

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t)
}

function interpolateKeyframes(progress: number, keyframes: Keyframe[]): {
  pos: [number, number, number]
  target: [number, number, number]
} {
  if (progress <= keyframes[0].progress) {
    return { pos: keyframes[0].pos, target: keyframes[0].target }
  }
  const last = keyframes.length - 1
  if (progress >= keyframes[last].progress) {
    return { pos: keyframes[last].pos, target: keyframes[last].target }
  }
  for (let i = 0; i < last; i++) {
    const a = keyframes[i]
    const b = keyframes[i + 1]
    if (progress >= a.progress && progress <= b.progress) {
      const t = smoothstep((progress - a.progress) / (b.progress - a.progress))
      return {
        pos: [
          lerp(a.pos[0], b.pos[0], t),
          lerp(a.pos[1], b.pos[1], t),
          lerp(a.pos[2], b.pos[2], t),
        ],
        target: [
          lerp(a.target[0], b.target[0], t),
          lerp(a.target[1], b.target[1], t),
          lerp(a.target[2], b.target[2], t),
        ],
      }
    }
  }
  return { pos: keyframes[last].pos, target: keyframes[last].target }
}

const LABELS_DATA = [
  { id: 'iss', name: 'ISS', pos: [0, 2.2, 0], color: '#ffffff', size: 0.08 },
  { id: 'hubble', name: 'HST', pos: [2, -1.5, 0.5], color: '#87CEEB', size: 0.06 },
  { id: 'gps', name: 'GPS', pos: [-1.5, -2, -1], color: '#90EE90', size: 0.05 },
  { id: 'goes', name: 'GOES-18', pos: [1.8, 1.2, -1.2], color: '#FFD700', size: 0.07 },
  { id: 'starlink', name: 'Starlink', pos: [-2, 1.8, 0.8], color: '#C0C0C0', size: 0.04 },
]

const SAT_ORBIT_RADIUS = 1.8
const SAT_COUNT = 40
const satPositions = Array.from({ length: SAT_COUNT }, (_, i) => {
  const angle = (i / SAT_COUNT) * Math.PI * 2
  const tilt = (Math.random() - 0.5) * 0.6
  return new THREE.Vector3(
    Math.cos(angle) * SAT_ORBIT_RADIUS,
    tilt,
    Math.sin(angle) * SAT_ORBIT_RADIUS,
  )
})

const LABEL_TAGS = [
  { id: 'iss-label', name: 'ISS', pos: new THREE.Vector3(0, 2.2, 0) },
  { id: 'hubble-label', name: 'HST', pos: new THREE.Vector3(2, -1.5, 0.5) },
  { id: 'gps-label', name: 'GPS', pos: new THREE.Vector3(-1.5, -2, -1) },
  { id: 'goes-label', name: 'GOES-18', pos: new THREE.Vector3(1.8, 1.2, -1.2) },
  { id: 'starlink-label', name: 'Starlink', pos: new THREE.Vector3(-0.8, 1.5, 2) },
]

function createTextSprite(name: string, color = '#ffffff'): THREE.Sprite {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 128
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, 512, 128)
  ctx.font = 'Bold 42px "Times New Roman", Times, serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  ctx.shadowColor = 'rgba(0,0,0,0.8)'
  ctx.shadowBlur = 8
  ctx.fillStyle = color
  ctx.fillText(name, 256, 60)

  ctx.shadowBlur = 0
  ctx.font = '24px "Times New Roman", Times, serif'
  ctx.fillStyle = `${color}88`
  ctx.fillText('\u25CF', 256, 100)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    depthTest: true,
  })
  const sprite = new THREE.Sprite(material)
  sprite.scale.set(3, 0.75, 1)
  return sprite
}

const satSpriteTextures = LABEL_TAGS.map((tag) => {
  const sprite = createTextSprite(tag.name, '#ffffff')
  sprite.position.copy(tag.pos)
  return sprite
})

function ParallaxStars({ depth, count, size, color, speed }: {
  depth: number
  count: number
  size: number
  color: string
  speed: number
}) {
  const ref = useRef<THREE.Points>(null!)
  const scrollProgress = useAppStore((s) => s.scrollProgress)

  const positionsRef = useRef<Float32Array | null>(null)
  if (!positionsRef.current) {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const radius = 100 + Math.random() * 300
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = radius * Math.cos(phi)
    }
    positionsRef.current = pos
  }
  const positions = positionsRef.current

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * speed * 0.1
      const parallaxOffset = (scrollProgress - 0.5) * depth
      ref.current.position.z = parallaxOffset
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[new Float32Array(positions), 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={0.4 + depth * 0.2}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function CinematicCamera() {
  const scrollProgress = useAppStore((s) => s.scrollProgress)
  const currentPos = useRef(new THREE.Vector3(EARTH.x, 0.3, 3))
  const currentTarget = useRef(new THREE.Vector3(EARTH.x, 0, 0))

  useFrame((state, delta) => {
    const kf = interpolateKeyframes(scrollProgress, KEYFRAMES)
    const targetPos = new THREE.Vector3(kf.pos[0], kf.pos[1], kf.pos[2])
    const targetLook = new THREE.Vector3(kf.target[0], kf.target[1], kf.target[2])

    const smoothFactor = 1 - Math.exp(-6 * delta)
    currentPos.current.lerp(targetPos, smoothFactor)
    currentTarget.current.lerp(targetLook, smoothFactor)

    state.camera.position.copy(currentPos.current)
    state.camera.lookAt(currentTarget.current)
  })

  return null
}

function SceneContent() {
  const scrollProgress = useAppStore((s) => s.scrollProgress)
  const groupRef = useRef<THREE.Group>(null!)
  const earthRef = useRef<THREE.Mesh>(null!)
  const earthAtmoRef = useRef<THREE.Mesh>(null!)
  const satGroupRef = useRef<THREE.Group>(null!)
  const sunRef = useRef<THREE.Mesh>(null!)
  const sunGlowRef = useRef<THREE.Mesh>(null!)
  const ringRef = useRef<THREE.Mesh>(null!)

  useFrame((state, delta) => {
    const progress = scrollProgress
    const kf = interpolateKeyframes(progress, KEYFRAMES)

    if (groupRef.current) {
      groupRef.current.position.x = -kf.target[0] * 0.02
      groupRef.current.position.y = -kf.target[1] * 0.02
    }

    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.15
    }
    if (earthAtmoRef.current) {
      earthAtmoRef.current.rotation.y += delta * 0.12
    }
    if (satGroupRef.current) {
      satGroupRef.current.rotation.y += delta * 0.35
    }
    if (sunRef.current) {
      sunRef.current.rotation.y += delta * 0.04
    }
    if (sunGlowRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05
      sunGlowRef.current.scale.setScalar(scale)
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI * 0.5
      ringRef.current.rotation.z += delta * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 0, 0]} intensity={5} color="#FDB813" decay={0.3} />
      <directionalLight position={[10, 15, 10]} intensity={0.3} />

      {/* Parallax star layers */}
      <ParallaxStars depth={0.1} count={1500} size={0.06} color="#4488ff" speed={0.3} />
      <ParallaxStars depth={0.3} count={1000} size={0.1} color="#ffffff" speed={0.6} />
      <ParallaxStars depth={0.6} count={500} size={0.15} color="#ff8844" speed={1.0} />

      {/* Sun */}
      <mesh ref={sunRef} position={[0, 0, 0]}>
        <sphereGeometry args={[3.5, 48, 48]} />
        <meshBasicMaterial color="#FDB813" />
      </mesh>

      {/* Sun glow */}
      <mesh ref={sunGlowRef} position={[0, 0, 0]}>
        <sphereGeometry args={[4.5, 32, 32]} />
        <meshBasicMaterial color="#FDB813" transparent opacity={0.12} />
      </mesh>

      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[6.5, 32, 32]} />
        <meshBasicMaterial color="#FF8C00" transparent opacity={0.04} />
      </mesh>

      {/* Earth system */}
      <group position={[EARTH.x, 0, 0]}>
        {/* Earth */}
        <mesh ref={earthRef}>
          <sphereGeometry args={[1, 48, 48]} />
          <meshPhongMaterial
            color="#2E6BB5"
            emissive="#1a3a7a"
            emissiveIntensity={0.15}
            specular="#4477CC"
            shininess={25}
          />
        </mesh>

        {/* Continents approximation */}
        <mesh>
          <sphereGeometry args={[1.01, 48, 48]} />
          <meshPhongMaterial
            color="#3D8B37"
            emissive="#2A5E25"
            emissiveIntensity={0.05}
            transparent
            opacity={0.3}
            wireframe={false}
          />
        </mesh>

        {/* Atmosphere glow */}
        <mesh ref={earthAtmoRef}>
          <sphereGeometry args={[1.12, 32, 32]} />
          <meshPhongMaterial
            color="#87CEEB"
            transparent
            opacity={0.15}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Outer glow */}
        <mesh>
          <sphereGeometry args={[1.25, 32, 32]} />
          <meshBasicMaterial color="#4488FF" transparent opacity={0.06} side={THREE.BackSide} />
        </mesh>

        {/* Satellite orbit ring */}
        <mesh rotation={[Math.PI * 0.3, 0, 0]}>
          <ringGeometry args={[SAT_ORBIT_RADIUS - 0.02, SAT_ORBIT_RADIUS + 0.02, 64]} />
          <meshBasicMaterial color="#4488FF" transparent opacity={0.06} side={THREE.DoubleSide} />
        </mesh>

        <mesh rotation={[Math.PI * 0.5, 0.5, 0]}>
          <ringGeometry args={[SAT_ORBIT_RADIUS - 0.01, SAT_ORBIT_RADIUS + 0.01, 64]} />
          <meshBasicMaterial color="#44FF88" transparent opacity={0.04} side={THREE.DoubleSide} />
        </mesh>

        {/* Satellites */}
        <group ref={satGroupRef}>
          {satPositions.map((pos, i) => (
            <mesh key={i} position={pos}>
              <sphereGeometry args={[0.04, 6, 6]} />
              <meshBasicMaterial color={i < 8 ? '#ffffff' : '#88BBFF'} />
            </mesh>
          ))}
        </group>

        {/* Satellite label sprites */}
        {satSpriteTextures.map((sprite) => (
          <primitive key={sprite.uuid} object={sprite} />
        ))}
      </group>

      {/* Planets */}
      {PLANET_LAYOUT.filter((p) => p.id !== 'earth' && p.id !== 'sun').map((planet) => (
        <mesh key={planet.id} position={[planet.x, 0, 0]}>
          <sphereGeometry args={[planet.size, 32, 32]} />
          <meshPhongMaterial
            color={planet.color}
            emissive={planet.color}
            emissiveIntensity={0.05}
          />
        </mesh>
      ))}

      {/* Saturn rings */}
      <mesh ref={ringRef} position={[135, 0, 0]}>
        <ringGeometry args={[2.8, 4.5, 64]} />
        <meshBasicMaterial
          color="#D4B896"
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Orbit trails */}
      {PLANET_LAYOUT.filter((p) => p.id !== 'sun').map((planet) => (
        <mesh key={`orbit-${planet.id}`} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[planet.x - 0.05, planet.x + 0.05, 64]} />
          <meshBasicMaterial
            color={planet.color}
            transparent
            opacity={0.04}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Background starfield */}
      <StarField />
    </group>
  )
}

const starPositions = Array.from({ length: 4000 }, () => {
  const theta = Math.random() * Math.PI * 2
  const phi = Math.acos(2 * Math.random() - 1)
  const radius = 200 + Math.random() * 400
  return [
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.sin(phi) * Math.sin(theta),
    radius * Math.cos(phi),
  ]
}).flat()

function StarField() {
  const ref = useRef<THREE.Points>(null!)

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.00005
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[new Float32Array(starPositions), 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default function CosmicJourney() {
  return (
    <Canvas
      camera={{ fov: 50, near: 0.1, far: 1000 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#020010']} />
      <CinematicCamera />
      <SceneContent />
    </Canvas>
  )
}
