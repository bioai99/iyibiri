// Vol-28: Tier Journey premium tasarımdan port edildi.
// 5 tier — kelebek metamorfoz progression. Mevcut iyibiri tier sistemi
// (lib/supabase/queries/profiles.ts getKarmaLevel) ile karma threshold'lar uyumlu.

export type WingComplexity = 'simple' | 'scallop' | 'detailed' | 'ornate' | 'fractal'
export type AmbientEffectKind = 'none' | 'pollen' | 'rings' | 'sparks' | 'aurora'

export interface TierPalette {
  wL: [string, string, string] // left wing gradient (3 stops)
  wR: [string, string, string] // right wing gradient (3 stops)
  body: [string, string]       // body gradient (2 stops)
  glow: string                 // rgba aura color
}

export interface TierData {
  id: number
  name: string
  karma: number
  desc: string
  palette: TierPalette
  wingComplexity: WingComplexity
  foldPattern: number[]
  foldDuration: number
  glowOpacity: number
  ambientEffect: AmbientEffectKind
  auraIntensity: number
}

export const TIER_DATA: TierData[] = [
  {
    id: 1,
    name: 'İyi Biri',
    karma: 0,
    desc: 'İyilik yolculuğun başlıyor.',
    palette: {
      wL: ['#F5E4B0', '#E8C268', '#B58F3D'],
      wR: ['#F5E4B0', '#E8C268', '#B58F3D'],
      body: ['#F4EEDF', '#C8B788'],
      glow: 'rgba(232,194,104,0.25)',
    },
    wingComplexity: 'simple',
    foldPattern: [0, 12, 0],
    foldDuration: 4.0,
    glowOpacity: 0.15,
    ambientEffect: 'none',
    auraIntensity: 0.3,
  },
  {
    id: 2,
    name: 'İyi Yürekli',
    karma: 500,
    desc: 'İyilik sende bir alışkanlık olmaya başladı.',
    palette: {
      wL: ['#FBE4A8', '#F0B85C', '#C88534'],
      wR: ['#F4A88E', '#D17156', '#A04A35'],
      body: ['#F4EEDF', '#A89070'],
      glow: 'rgba(240,184,92,0.30)',
    },
    wingComplexity: 'scallop',
    foldPattern: [0, 12, 0],
    foldDuration: 4.0,
    glowOpacity: 0.25,
    ambientEffect: 'pollen',
    auraIntensity: 0.5,
  },
  {
    id: 3,
    name: 'İyilik Elçisi',
    karma: 2000,
    desc: 'Çevrende değişim yaratıyorsun.',
    palette: {
      wL: ['#A8E5C8', '#5DC395', '#2E8C68'],
      wR: ['#7AC9A8', '#3DA478', '#1F6B4E'],
      body: ['#E8DCC4', '#7A6B50'],
      glow: 'rgba(93,195,149,0.35)',
    },
    wingComplexity: 'detailed',
    foldPattern: [0, 12, 0],
    foldDuration: 4.0,
    glowOpacity: 0.35,
    ambientEffect: 'rings',
    auraIntensity: 0.7,
  },
  {
    id: 4,
    name: 'İyilik Savaşçısı',
    karma: 5000,
    desc: 'Topluluk seni tanıyor, etkini hissediyor.',
    palette: {
      wL: ['#F4D98A', '#D89030', '#8C5410'],
      wR: ['#E89060', '#C45228', '#7A2C10'],
      body: ['#F4EEDF', '#5C4A2E'],
      glow: 'rgba(216,144,48,0.45)',
    },
    wingComplexity: 'ornate',
    foldPattern: [0, 12, 0],
    foldDuration: 4.0,
    glowOpacity: 0.45,
    ambientEffect: 'sparks',
    auraIntensity: 0.85,
  },
  {
    id: 5,
    name: 'İyiliğin Işığı',
    karma: 10000,
    desc: 'İyiliğin en üst seviyesine ulaştın.',
    palette: {
      wL: ['#FFFCE8', '#E8C268', '#A878E0'],
      wR: ['#F4D9FF', '#A878E0', '#5A3098'],
      body: ['#FFFCE8', '#A878E0'],
      glow: 'rgba(232,194,104,0.55)',
    },
    wingComplexity: 'fractal',
    foldPattern: [0, 12, 0],
    foldDuration: 4.0,
    glowOpacity: 0.7,
    ambientEffect: 'aurora',
    auraIntensity: 1.0,
  },
]

export function getTierByKarma(karma: number): TierData {
  for (let i = TIER_DATA.length - 1; i >= 0; i--) {
    if (karma >= TIER_DATA[i].karma) return TIER_DATA[i]
  }
  return TIER_DATA[0]
}

export function getNextTier(currentTierId: number): TierData | null {
  const next = TIER_DATA.find((t) => t.id === currentTierId + 1)
  return next ?? null
}
