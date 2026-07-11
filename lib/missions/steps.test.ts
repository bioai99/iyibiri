import { describe, it, expect } from 'vitest'
import { parseMissionJourney } from './steps'

describe('parseMissionJourney', () => {
  it('null/undefined → boş journey', () => {
    expect(parseMissionJourney(null)).toEqual({ title: null, steps: [] })
    expect(parseMissionJourney(undefined)).toEqual({ title: null, steps: [] })
  })

  it('boş dizi (014 seed default) → boş journey', () => {
    expect(parseMissionJourney([])).toEqual({ title: null, steps: [] })
  })

  it('düz dizi biçimini parse eder (legacy)', () => {
    const r = parseMissionJourney([
      { icon: 'gift', title: 'Hazırla', description: 'Kutuyu hazırla' },
    ])
    expect(r.title).toBeNull()
    expect(r.steps).toEqual([{ icon: 'gift', title: 'Hazırla', description: 'Kutuyu hazırla' }])
  })

  it('başlıklı obje biçimini parse eder', () => {
    const r = parseMissionJourney({
      title: 'Dilek Yolculuğu',
      steps: [
        { icon: 'star', title: 'Başvuru', description: 'Aile başvurur' },
        { icon: 'party', title: 'Dilek Günü' },
      ],
    })
    expect(r.title).toBe('Dilek Yolculuğu')
    expect(r.steps).toHaveLength(2)
    expect(r.steps[1]).toEqual({ icon: 'party', title: 'Dilek Günü', description: '' })
  })

  it('icon verilmezse star fallback', () => {
    const r = parseMissionJourney([{ title: 'Adım' }])
    expect(r.steps[0].icon).toBe('star')
  })

  it('title olmayan/bozuk adımları eler', () => {
    const r = parseMissionJourney([
      { title: 'Geçerli' },
      { description: 'başlıksız' },
      'string',
      42,
      null,
      { title: '   ' },
    ])
    expect(r.steps).toHaveLength(1)
    expect(r.steps[0].title).toBe('Geçerli')
  })

  it('steps alanı dizi olmayan obje → boş journey', () => {
    expect(parseMissionJourney({ title: 'X', steps: 'yanlış' })).toEqual({ title: null, steps: [] })
    expect(parseMissionJourney({ foo: 1 })).toEqual({ title: null, steps: [] })
  })

  it('skaler json → boş journey', () => {
    expect(parseMissionJourney('metin')).toEqual({ title: null, steps: [] })
    expect(parseMissionJourney(5)).toEqual({ title: null, steps: [] })
    expect(parseMissionJourney(true)).toEqual({ title: null, steps: [] })
  })

  it('boşluklu title trim edilir', () => {
    const r = parseMissionJourney([{ title: '  Dilek Keşfi  ' }])
    expect(r.steps[0].title).toBe('Dilek Keşfi')
  })
})
