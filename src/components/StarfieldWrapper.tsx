'use client'

import dynamic from 'next/dynamic'

const StarfieldScene = dynamic(() => import('@/components/Starfield'), {
  ssr: false,
})

export function StarfieldWrapper() {
  return <StarfieldScene />
}
