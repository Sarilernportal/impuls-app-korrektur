import { describe, it, expect } from 'vitest'
import {
  REVIEW_STATUS,
  reviewStatus,
  canRelease,
  docMatch,
  reviewMeta
} from '@/utilities/billing/review.js'

const COMPLETE_SIG = { parent: true, school: true, professional: true }

function ts(items, extra = {}) {
  return { reportType: 'standard', dailyReport: { items }, signatures: COMPLETE_SIG, ...extra }
}

describe('Nachweisprüfung – reviewStatus', () => {
  it('"doku_fehlt" ohne Tages-Dokus', () => {
    expect(reviewStatus(ts([]))).toBe(REVIEW_STATUS.DOKU_FEHLT)
  })
  it('"rueckfrage" bei markierter Doku', () => {
    expect(reviewStatus(ts([{ flag: 'revise' }]))).toBe(REVIEW_STATUS.RUECKFRAGE)
  })
  it('"in_pruefung" bei fehlender Unterschrift', () => {
    const sheet = ts([{ flag: null }], { signatures: { parent: true, school: false, professional: true } })
    expect(reviewStatus(sheet)).toBe(REVIEW_STATUS.IN_PRUEFUNG)
  })
  it('"eingegangen" wenn Doku da und Unterschriften vollständig', () => {
    expect(reviewStatus(ts([{ flag: null }]))).toBe(REVIEW_STATUS.EINGEGANGEN)
  })
  it('override "released" → freigegeben', () => {
    expect(reviewStatus(ts([{ flag: null }]), { released: true })).toBe(REVIEW_STATUS.FREIGEGEBEN)
  })
  it('override "queried" → rueckfrage', () => {
    expect(reviewStatus(ts([{ flag: null }]), { queried: true })).toBe(REVIEW_STATUS.RUECKFRAGE)
  })
  it('persistiertes reviewStatus-Feld hat Vorrang', () => {
    expect(reviewStatus(ts([{ flag: null }], { reviewStatus: 'freigegeben' }))).toBe(REVIEW_STATUS.FREIGEGEBEN)
  })
})

describe('Nachweisprüfung – Freigabe-Regel', () => {
  it('freigebbar nur bei vollständigen Unterschriften UND Doku-Abgleich', () => {
    expect(canRelease(ts([{ flag: null }]))).toBe(true)
  })
  it('nicht freigebbar bei fehlender Unterschrift', () => {
    expect(canRelease(ts([{ flag: null }], { signatures: { parent: true, school: false, professional: true } }))).toBe(false)
  })
  it('nicht freigebbar bei Rückfrage-Doku', () => {
    expect(canRelease(ts([{ flag: 'revise' }]))).toBe(false)
  })
  it('nicht freigebbar ohne Doku', () => {
    expect(canRelease(ts([]))).toBe(false)
  })
  it('nicht erneut freigebbar, wenn bereits freigegeben', () => {
    expect(canRelease(ts([{ flag: null }]), { released: true })).toBe(false)
  })
})

describe('Nachweisprüfung – Doku-Abgleich', () => {
  it('ok mit Anzahl', () => {
    expect(docMatch(ts([{ flag: null }, { flag: null }]))).toEqual({ ok: true, label: '2 Dokus' })
  })
  it('keine Doku', () => {
    expect(docMatch(ts([])).ok).toBe(false)
  })
  it('Rückfrage blockiert', () => {
    expect(docMatch(ts([{ flag: 'revise' }]))).toEqual({ ok: false, label: 'Rückfrage' })
  })
})

describe('Nachweisprüfung – reviewMeta', () => {
  it('liefert Labels für alle Status', () => {
    expect(reviewMeta(REVIEW_STATUS.EINGEGANGEN).label).toBe('Eingegangen')
    expect(reviewMeta(REVIEW_STATUS.FREIGEGEBEN).label).toBe('Freigegeben')
  })
})
