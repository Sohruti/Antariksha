export interface CelestialData {
  id: string
  name: string
  color: string
  size: number
  x: number
  info: string
  details: string[]
  satellites?: { name: string; type: string }[]
  texture?: string
  rotationSpeed?: number
  hasClouds?: boolean
  stormSpot?: boolean
  atmosphere?: {
    color: string
    scale: number
    intensity: number
  }
  ring?: {
    innerRadius: number
    outerRadius: number
    color: string
    opacity: number
    tilt: number
  }
  emissive?: string
  emissiveIntensity?: number
}

export const SATELLITES = [
  { name: 'ISS', type: 'Space Station' },
  { name: 'Hubble', type: 'Space Telescope' },
  { name: 'GPS III', type: 'Navigation' },
  { name: 'GOES-18', type: 'Weather' },
  { name: 'Starlink', type: 'Constellation' },
  { name: 'Landsat 9', type: 'Earth Observation' },
  { name: 'Sentinel-6', type: 'Ocean Monitoring' },
  { name: 'TDRS-M', type: 'Communications' },
]

export const CELESTIAL_BODIES: CelestialData[] = [
  {
    id: 'earth',
    name: 'Earth',
    color: '#4B7BE5',
    size: 1,
    x: 60,
    rotationSpeed: 0.4,
    texture: '/textures/earth.png',
    hasClouds: true,
    atmosphere: { color: '#87CEEB', scale: 1.18, intensity: 0.9 },
    info: 'Our Home Planet — the third rock from the Sun',
    details: [
      'Diameter: 12,742 km',
      'Orbit: 365.25 days',
      'Atmosphere: 78% Nitrogen, 21% Oxygen',
      'Water covers 71% of surface',
      'Only known planet with life',
    ],
    satellites: SATELLITES,
  },
  {
    id: 'sun',
    name: 'Sun',
    color: '#FDB813',
    size: 3.5,
    x: 0,
    rotationSpeed: 0.04,
    emissive: '#FFB347',
    emissiveIntensity: 1.0,
    info: 'The Star at the Center of Our Solar System',
    details: [
      'Diameter: 1,391,000 km (109x Earth)',
      'Surface temp: 5,500°C',
      'Core temp: 15,000,000°C',
      'Contains 99.86% of solar system mass',
      'Converts 600M tons of H to He per second',
    ],
  },
  {
    id: 'mercury',
    name: 'Mercury',
    color: '#B5B5B5',
    size: 0.38,
    x: 28,
    rotationSpeed: 0.08,
    texture: '/textures/mercury.png',
    info: 'The Smallest Planet & Closest to the Sun',
    details: [
      'Diameter: 4,879 km',
      'Orbit: 88 Earth days',
      'Surface temp: -180°C to 430°C',
      'No atmosphere',
      'Second densest planet after Earth',
    ],
  },
  {
    id: 'venus',
    name: 'Venus',
    color: '#E8D5A3',
    size: 0.95,
    x: 42,
    rotationSpeed: -0.06,
    texture: '/textures/venus.png',
    atmosphere: { color: '#FFD7A0', scale: 1.14, intensity: 1.1 },
    info: "Earth's Twin — The Hottest Planet",
    details: [
      'Diameter: 12,104 km',
      'Orbit: 225 Earth days',
      'Surface temp: 462°C (hottest planet)',
      'Rotates backwards (retrograde)',
      'Thick CO2 atmosphere with sulfuric acid clouds',
    ],
  },
  {
    id: 'mars',
    name: 'Mars',
    color: '#E27B58',
    size: 0.53,
    x: 80,
    rotationSpeed: 0.38,
    texture: '/textures/mars.png',
    atmosphere: { color: '#FFB088', scale: 1.08, intensity: 0.4 },
    info: 'The Red Planet — Our Next Frontier',
    details: [
      'Diameter: 6,779 km',
      'Orbit: 687 Earth days',
      'Surface temp: -87°C to -5°C',
      'Home to Olympus Mons — largest volcano',
      'Two moons: Phobos & Deimos',
    ],
    satellites: [
      { name: 'Phobos', type: 'Moon' },
      { name: 'Deimos', type: 'Moon' },
    ],
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    color: '#C8A06E',
    size: 2.5,
    x: 105,
    rotationSpeed: 1.0,
    texture: '/textures/jupiter.png',
    stormSpot: true,
    atmosphere: { color: '#E8C68E', scale: 1.06, intensity: 0.5 },
    info: 'The Giant of the Solar System',
    details: [
      'Diameter: 139,820 km (11x Earth)',
      'Orbit: 4,333 Earth days (11.86 years)',
      'Great Red Spot — storm larger than Earth',
      '95 known moons',
      'Strongest magnetic field of any planet',
    ],
    satellites: [
      { name: 'Io', type: 'Volcanic Moon' },
      { name: 'Europa', type: 'Icy Moon' },
      { name: 'Ganymede', type: 'Largest Moon' },
      { name: 'Callisto', type: 'Cratered Moon' },
    ],
  },
  {
    id: 'saturn',
    name: 'Saturn',
    color: '#EAD6B8',
    size: 2,
    x: 135,
    rotationSpeed: 0.9,
    texture: '/textures/saturn.png',
    atmosphere: { color: '#F5E6C8', scale: 1.05, intensity: 0.35 },
    ring: {
      innerRadius: 2.4,
      outerRadius: 4.2,
      color: '#D4B896',
      opacity: 0.85,
      tilt: 0.45,
    },
    info: 'The Ringed Jewel of the Solar System',
    details: [
      'Diameter: 116,460 km (9.5x Earth)',
      'Orbit: 10,759 Earth days (29.46 years)',
      'Ring system spans 282,000 km',
      'Least dense planet (would float in water)',
      '146 known moons',
    ],
    satellites: [
      { name: 'Titan', type: 'Largest Moon' },
      { name: 'Enceladus', type: 'Icy Geyser Moon' },
      { name: 'Mimas', type: 'Death Star Moon' },
    ],
  },
  {
    id: 'uranus',
    name: 'Uranus',
    color: '#7EC8E3',
    size: 1.2,
    x: 165,
    rotationSpeed: 0.7,
    texture: '/textures/uranus.png',
    atmosphere: { color: '#A8E0F0', scale: 1.08, intensity: 0.5 },
    info: 'The Sideways Ice Giant',
    details: [
      'Diameter: 50,724 km (4x Earth)',
      'Orbit: 30,687 Earth days (84 years)',
      'Rotates on its side (98° tilt)',
      '27 known moons',
      'Faint ring system',
    ],
    satellites: [
      { name: 'Miranda', type: 'Extreme terrain' },
      { name: 'Titania', type: 'Largest Moon' },
    ],
  },
  {
    id: 'neptune',
    name: 'Neptune',
    color: '#3B4CE8',
    size: 1.1,
    x: 195,
    rotationSpeed: 0.75,
    texture: '/textures/neptune.png',
    atmosphere: { color: '#5577FF', scale: 1.08, intensity: 0.55 },
    info: 'The Windiest Planet at the Edge',
    details: [
      'Diameter: 49,244 km (3.9x Earth)',
      'Orbit: 60,190 Earth days (164.8 years)',
      'Winds reach 2,100 km/h',
      '16 known moons',
      'Discovered mathematically before observation',
    ],
    satellites: [
      { name: 'Triton', type: 'Captured KBO' },
      { name: 'Nereid', type: 'Irregular Moon' },
    ],
  },
]

export const SECTION_INFO = [
  {
    id: 'earth-intro',
    title: 'Entering Earth Orbit',
    subtitle: 'Our Home Planet',
    lines: [
      'Approaching Earth — a pale blue dot in the vast cosmos.',
      'Over 10,000 satellites orbit our planet today.',
      'The International Space Station circles Earth every 90 minutes.',
    ],
  },
  {
    id: 'earth-satellites',
    title: 'The Satellite Network',
    subtitle: "Humanity's Eyes & Ears in Space",
    lines: [
      'From weather monitoring to global communications — satellites connect our world.',
      'The Hubble Space Telescope has transformed our understanding of the universe.',
      'Thousands of satellites now form a technological mesh around Earth.',
    ],
  },
  {
    id: 'sun',
    title: 'The Sun',
    subtitle: 'Our Life-Giving Star',
    lines: [
      'A massive fusion reactor 109 times wider than Earth.',
      'Every second, 600 million tons of hydrogen fuse into helium.',
      "The Sun's light takes 8 minutes and 20 seconds to reach us.",
    ],
  },
  {
    id: 'mercury',
    title: 'Mercury',
    subtitle: 'The Scorched & Frozen World',
    lines: [
      'The smallest planet, only slightly larger than our Moon.',
      'A single day on Mercury lasts 59 Earth days.',
      'Temperatures swing from -180°C at night to 430°C in daylight.',
    ],
  },
  {
    id: 'venus',
    title: 'Venus',
    subtitle: "Earth's Toxic Twin",
    lines: [
      'Shrouded in thick clouds of sulfuric acid.',
      'The surface is hot enough to melt lead at 462°C.',
      'Venus rotates backwards — the Sun rises in the west.',
    ],
  },
  {
    id: 'earth-revisit',
    title: 'Earth — A Second Look',
    subtitle: 'The Pale Blue Dot',
    lines: [
      'From afar, Earth is a tiny speck in the cosmic ocean.',
      'Every human who ever lived called this small world home.',
      'As Carl Sagan said: "That\'s here. That\'s home. That\'s us."',
    ],
  },
  {
    id: 'mars',
    title: 'Mars',
    subtitle: 'The Next Human Destination',
    lines: [
      'Olympus Mons — the tallest mountain in the solar system at 21.9 km.',
      'Evidence suggests liquid water once flowed on Mars.',
      'Multiple rovers explore its surface — and humans may follow.',
    ],
  },
  {
    id: 'jupiter',
    title: 'Jupiter',
    subtitle: 'King of the Planets',
    lines: [
      'The Great Red Spot is a storm that has raged for centuries.',
      "Jupiter's moon Europa may harbor a subsurface ocean with life.",
      "Jupiter's magnetic field is 20,000 times stronger than Earth's.",
    ],
  },
  {
    id: 'saturn',
    title: 'Saturn',
    subtitle: 'Lord of the Rings',
    lines: [
      'The rings span 282,000 km but are only 10 meters thick.',
      'Saturn is so light it would float in water.',
      'Titan has liquid methane lakes and a thick atmosphere.',
    ],
  },
  {
    id: 'uranus',
    title: 'Uranus',
    subtitle: 'The Sideways World',
    lines: [
      'Uranus rotates on its side, likely from a massive ancient collision.',
      'It smells like rotten eggs — hydrogen sulfide in the atmosphere.',
      'The coldest planetary atmosphere at -224°C.',
    ],
  },
  {
    id: 'neptune',
    title: 'Neptune',
    subtitle: 'The Edge of the Solar System',
    lines: [
      'The fastest winds in the solar system — up to 2,100 km/h.',
      'Neptune was the first planet located through mathematical prediction.',
      'Its moon Triton orbits in the opposite direction of Neptune\'s spin.',
    ],
  },
  {
    id: 'beyond',
    title: 'Beyond the Solar System',
    subtitle: 'The Cosmic Frontier',
    lines: [
      'Our solar system is just one of billions in the Milky Way.',
      'The nearest star system, Alpha Centauri, is 4.37 light-years away.',
      'Scroll further to explore the wider cosmos...',
    ],
  },
]

export function getSectionIndex(progress: number): number {
  const count = SECTION_INFO.length
  const raw = progress * count
  return Math.min(Math.floor(raw), count - 1)
}

export function getSectionProgress(progress: number): number {
  const count = SECTION_INFO.length
  const raw = progress * count
  return raw - Math.floor(raw)
}
