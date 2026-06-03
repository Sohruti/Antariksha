'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function starShader() {
  return {
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#ffffff') },
    },
    vertexShader: `
      attribute float size;
      attribute float twinkle;
      varying float vTwinkle;
      void main() {
        vTwinkle = twinkle;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uTime;
      varying float vTwinkle;
      void main() {
        float d = distance(gl_PointCoord, vec2(0.5));
        if (d > 0.5) discard;
        float alpha = 1.0 - smoothstep(0.0, 0.5, d);
        float twinkle = 0.6 + 0.4 * sin(uTime * vTwinkle * 2.0 + vTwinkle * 100.0);
        gl_FragColor = vec4(uColor, alpha * twinkle);
      }
    `,
  }
}

export function Starfield({ count = 3000 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!)
  const materialRef = useRef<THREE.ShaderMaterial>(null!)

  const [positions, sizes, twinkles] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const sz = new Float32Array(count)
    const tw = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const radius = 100 + Math.random() * 500
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = radius * Math.cos(phi)
      sz[i] = 0.5 + Math.random() * 2.0
      tw[i] = 0.5 + Math.random() * 1.5
    }
    return [pos, sz, tw]
  }, [count])

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.elapsedTime
    }
    if (ref.current) ref.current.rotation.y += 0.00003
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-twinkle" args={[twinkles, 1]} />
      </bufferGeometry>
      <shaderMaterial ref={materialRef} args={[starShader()]} transparent depthWrite={false} />
    </points>
  )
}
