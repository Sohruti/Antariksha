'use client'

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom, DepthOfField, Noise } from '@react-three/postprocessing'
import { KernelSize, Resolution } from 'postprocessing'
import * as THREE from 'three'

function LensFlare() {
  const ref = useRef<THREE.Sprite>(null!)
  const { gl } = useThree()

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')!

    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
    gradient.addColorStop(0, 'rgba(255, 220, 100, 0.8)')
    gradient.addColorStop(0.05, 'rgba(255, 200, 80, 0.6)')
    gradient.addColorStop(0.1, 'rgba(255, 180, 60, 0.3)')
    gradient.addColorStop(0.3, 'rgba(255, 150, 40, 0.1)')
    gradient.addColorStop(1, 'rgba(255, 100, 20, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 256, 256)

    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2
      const dx = Math.cos(angle) * 30
      const dy = Math.sin(angle) * 30
      ctx.beginPath()
      ctx.moveTo(128 + dx * 3, 128 + dy * 3)
      ctx.lineTo(128 + dx * 5, 128 + dy * 5)
      ctx.strokeStyle = `rgba(255, 200, 100, ${0.2 - i * 0.03})`
      ctx.lineWidth = 2
      ctx.stroke()
    }

    return new THREE.CanvasTexture(canvas)
  }, [])

  useFrame(({ camera }) => {
    if (!ref.current) return
    const sunPos = new THREE.Vector3(0, 0, 0)
    const screenPos = sunPos.clone().project(camera)
    const isOnScreen = Math.abs(screenPos.x) <= 1 && Math.abs(screenPos.y) <= 1 && screenPos.z < 1
    ref.current.visible = isOnScreen

    if (isOnScreen) {
      const x = (screenPos.x * 0.5 + 0.5) * gl.domElement.width
      const y = (-screenPos.y * 0.5 + 0.5) * gl.domElement.height
      ref.current.position.set(x - gl.domElement.width / 2, -(y - gl.domElement.height / 2), -5)
      ref.current.scale.setScalar(Math.max(0, 3 - Math.abs(screenPos.z)) * 1.5)
    }
  })

  return <sprite ref={ref} scale={[5, 5, 1]}><spriteMaterial map={texture} transparent depthTest={false} opacity={0.8} blending={THREE.AdditiveBlending} /></sprite>
}

export function Effects({ enabled = true }: { enabled?: boolean }) {
  if (!enabled) return null

  return (
    <>
      <EffectComposer multisampling={2} autoClear={false}>
        <Bloom
          intensity={0.8}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.7}
          kernelSize={KernelSize.MEDIUM}
          resolutionX={Resolution.AUTO_SIZE}
          resolutionY={Resolution.AUTO_SIZE}
        />
        <DepthOfField
          focusDistance={0.02}
          focalLength={0.05}
          bokehScale={4}
        />
        <Noise opacity={0.02} />
      </EffectComposer>
      <LensFlare />
    </>
  )
}
