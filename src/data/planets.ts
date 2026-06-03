export interface CelestialData {
  id: string
  name: string
  color: string
  x: number
  radius: number
  info: string
  details: string[]
  trivia: string
  distanceFromSun: string
  actualRadius: string
  temperature: string
  dayLength: string
  yearLength: string
  satellites?: { name: string; type: string }[]
  orbitTilt?: number
  hasRings?: boolean
  moons?: number
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

export const PLANET_ORDER = ['sun', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'] as const

export type PlanetId = (typeof PLANET_ORDER)[number]

export const CELESTIAL_BODIES: CelestialData[] = [
  {
    id: 'sun',
    name: 'Sun',
    color: '#FDB813',
    x: 0,
    radius: 2.5,
    info: 'The Star at the Center of Our Solar System',
    details: [
      'Diameter: 1,391,000 km (109x Earth)',
      'Surface temp: 5,500°C',
      'Core temp: 15,000,000°C',
      'Contains 99.86% of solar system mass',
    ],
    trivia: 'A single grain of sand has more atoms than there are stars in the observable universe — yet our Sun contains 99.86% of all mass in our solar system.',
    distanceFromSun: '0 km',
    actualRadius: '696,340 km',
    temperature: '5,500°C (surface)',
    dayLength: '25.4 Earth days',
    yearLength: '—',
  },
  {
    id: 'mercury',
    name: 'Mercury',
    color: '#B5B5B5',
    x: 9.69,
    radius: 0.18,
    info: 'The Smallest Planet & Closest to the Sun',
    details: [
      'Diameter: 4,879 km',
      'Orbit: 88 Earth days',
      'Surface temp: -180°C to 430°C',
      'No atmosphere',
    ],
    trivia: 'A year on Mercury is just 88 Earth days, but a day lasts 59 Earth days. You\'d celebrate two birthdays per day!',
    distanceFromSun: '57.9 million km',
    actualRadius: '2,439.7 km',
    temperature: '-180°C to 430°C',
    dayLength: '58.6 Earth days',
    yearLength: '88 Earth days',
    moons: 0,
  },
  {
    id: 'venus',
    name: 'Venus',
    color: '#E8D5A3',
    x: 12.23,
    radius: 0.35,
    info: 'Earth\'s Twin — The Hottest Planet',
    details: [
      'Diameter: 12,104 km',
      'Orbit: 225 Earth days',
      'Surface temp: 462°C (hottest planet)',
      'Rotates backwards (retrograde)',
    ],
    trivia: 'Venus spins so slowly that its day is longer than its year. It also spins backwards — the Sun rises in the west and sets in the east.',
    distanceFromSun: '108.2 million km',
    actualRadius: '6,051.8 km',
    temperature: '462°C (average surface)',
    dayLength: '243 Earth days',
    yearLength: '225 Earth days',
    moons: 0,
  },
  {
    id: 'earth',
    name: 'Earth',
    color: '#4B7BE5',
    x: 16.11,
    radius: 0.38,
    info: 'Our Home Planet — the third rock from the Sun',
    details: [
      'Diameter: 12,742 km',
      'Orbit: 365.25 days',
      'Atmosphere: 78% Nitrogen, 21% Oxygen',
      'Water covers 71% of surface',
    ],
    trivia: 'Earth is the only planet not named after a Roman god. And it\'s the only known world to harbor life — making it the most precious planet in the universe.',
    distanceFromSun: '149.6 million km',
    actualRadius: '6,371 km',
    temperature: '-89°C to 57°C',
    dayLength: '24 hours',
    yearLength: '365.25 days',
    satellites: SATELLITES,
    moons: 1,
  },
  {
    id: 'mars',
    name: 'Mars',
    color: '#E27B58',
    x: 20.45,
    radius: 0.25,
    info: 'The Red Planet — Our Next Frontier',
    details: [
      'Diameter: 6,779 km',
      'Orbit: 687 Earth days',
      'Surface temp: -87°C to -5°C',
      'Home to Olympus Mons — largest volcano',
    ],
    trivia: 'Olympus Mons is nearly 3x the height of Everest. A human jumping from its peak would be in freefall for nearly 8 minutes before landing.',
    distanceFromSun: '227.9 million km',
    actualRadius: '3,389.5 km',
    temperature: '-87°C to -5°C',
    dayLength: '24.6 hours',
    yearLength: '687 Earth days',
    satellites: [
      { name: 'Phobos', type: 'Moon' },
      { name: 'Deimos', type: 'Moon' },
    ],
    moons: 2,
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    color: '#C8A06E',
    x: 28.78,
    radius: 1.2,
    info: 'The Giant of the Solar System',
    details: [
      'Diameter: 139,820 km (11x Earth)',
      'Orbit: 4,333 Earth days (11.86 years)',
      'Great Red Spot — storm larger than Earth',
      '95 known moons',
    ],
    trivia: 'The Great Red Spot is a storm that has raged for at least 400 years. It\'s so large that Earth could fit inside it three times over.',
    distanceFromSun: '778.5 million km',
    actualRadius: '69,911 km',
    temperature: '-110°C (cloud top)',
    dayLength: '9.9 hours',
    yearLength: '11.86 Earth years',
    satellites: [
      { name: 'Io', type: 'Volcanic Moon' },
      { name: 'Europa', type: 'Icy Moon' },
      { name: 'Ganymede', type: 'Largest Moon' },
      { name: 'Callisto', type: 'Cratered Moon' },
    ],
    moons: 95,
  },
  {
    id: 'saturn',
    name: 'Saturn',
    color: '#EAD6B8',
    x: 36.61,
    radius: 1.0,
    info: 'The Ringed Jewel of the Solar System',
    details: [
      'Diameter: 116,460 km (9.5x Earth)',
      'Orbit: 10,759 Earth days (29.46 years)',
      'Ring system spans 282,000 km',
      'Least dense planet (would float in water)',
    ],
    trivia: 'Saturn\'s rings span 282,000 km but are only 10 meters thick. If Saturn were a bathtub, it would float — it\'s less dense than water!',
    distanceFromSun: '1.434 billion km',
    actualRadius: '58,232 km',
    temperature: '-140°C',
    dayLength: '10.7 hours',
    yearLength: '29.46 Earth years',
    satellites: [
      { name: 'Titan', type: 'Largest Moon' },
      { name: 'Enceladus', type: 'Icy Geyser Moon' },
      { name: 'Mimas', type: 'Death Star Moon' },
    ],
    hasRings: true,
    moons: 146,
  },
  {
    id: 'uranus',
    name: 'Uranus',
    color: '#7EC8E3',
    x: 44.26,
    radius: 0.7,
    info: 'The Sideways Ice Giant',
    details: [
      'Diameter: 50,724 km (4x Earth)',
      'Orbit: 30,687 Earth days (84 years)',
      'Rotates on its side (98° tilt)',
      '27 known moons',
    ],
    trivia: 'Uranus rotates on its side — likely from a massive ancient collision. It also smells like rotten eggs (hydrogen sulfide in the upper atmosphere).',
    distanceFromSun: '2.871 billion km',
    actualRadius: '25,362 km',
    temperature: '-224°C',
    dayLength: '17.2 hours',
    yearLength: '84 Earth years',
    satellites: [
      { name: 'Miranda', type: 'Extreme terrain' },
      { name: 'Titania', type: 'Largest Moon' },
    ],
    orbitTilt: 98,
    moons: 27,
  },
  {
    id: 'neptune',
    name: 'Neptune',
    color: '#3B4CE8',
    x: 49.93,
    radius: 0.65,
    info: 'The Windiest Planet at the Edge',
    details: [
      'Diameter: 49,244 km (3.9x Earth)',
      'Orbit: 60,190 Earth days (164.8 years)',
      'Winds reach 2,100 km/h',
      '16 known moons',
    ],
    trivia: 'Neptune has the fastest winds in the solar system — up to 2,100 km/h. It was also the first planet found using math rather than observation.',
    distanceFromSun: '4.495 billion km',
    actualRadius: '24,622 km',
    temperature: '-214°C',
    dayLength: '16.1 hours',
    yearLength: '164.8 Earth years',
    satellites: [
      { name: 'Triton', type: 'Captured KBO' },
      { name: 'Nereid', type: 'Irregular Moon' },
    ],
    moons: 16,
  },
]

export function getPlanetById(id: string): CelestialData | undefined {
  return CELESTIAL_BODIES.find((b) => b.id === id)
}

export function getPlanetIndex(id: string): number {
  return CELESTIAL_BODIES.findIndex((b) => b.id === id)
}
