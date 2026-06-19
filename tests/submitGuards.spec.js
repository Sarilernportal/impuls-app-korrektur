import { describe, it, expect } from 'vitest'
import {
  reportsReadyForProof,
  canSubmitProof,
  careTimeIsPositive
} from '@/utilities/forms/submitGuards.js'

describe('Nachweis – reportsReadyForProof (gültige Auswahl)', () => {
  it('gültig bei ausgewählten normalen Dokus', () => {
    expect(reportsReadyForProof({ showSpecialTimes: false, selectedReports: [{ id: 1 }] })).toBe(true)
  })
  it('ungültig ohne Auswahl (normal)', () => {
    expect(reportsReadyForProof({ showSpecialTimes: false, selectedReports: [] })).toBe(false)
  })
  it('gültig bei ausgewählten Sonderzeiten', () => {
    expect(reportsReadyForProof({ showSpecialTimes: true, selectedSpecialReports: [{ id: 1 }] })).toBe(true)
  })
  it('ungültig ohne Auswahl (Sonderzeiten)', () => {
    expect(reportsReadyForProof({ showSpecialTimes: true, selectedSpecialReports: [] })).toBe(false)
  })
  it('ungültig, wenn ein nachträglich erstellter Bericht enthalten ist', () => {
    expect(
      reportsReadyForProof({
        documents: [{ retrospectively: true }],
        showSpecialTimes: false,
        selectedReports: [{ id: 1 }]
      })
    ).toBe(false)
  })
})

describe('Nachweis – canSubmitProof (Unterschrift ist Pflicht)', () => {
  const ok = { signature: 'data:image/png;base64,xxx', truthfull: true, gdprConfirm: true, ready: true }

  it('absendbar, wenn alles erfüllt ist', () => {
    expect(canSubmitProof(ok)).toBe(true)
  })
  it('NICHT absendbar ohne Unterschrift', () => {
    expect(canSubmitProof({ ...ok, signature: null })).toBe(false)
  })
  it('NICHT absendbar ohne Wahrheits-Bestätigung', () => {
    expect(canSubmitProof({ ...ok, truthfull: false })).toBe(false)
  })
  it('NICHT absendbar ohne Datenschutz-Bestätigung', () => {
    expect(canSubmitProof({ ...ok, gdprConfirm: false })).toBe(false)
  })
  it('NICHT absendbar bei ungültiger Auswahl', () => {
    expect(canSubmitProof({ ...ok, ready: false })).toBe(false)
  })
  it('NICHT absendbar ohne jegliche Angaben', () => {
    expect(canSubmitProof()).toBe(false)
  })
})

describe('Doku – careTimeIsPositive (Ende nach Beginn)', () => {
  it('positiv bei späterem Ende', () => {
    expect(careTimeIsPositive({ hourFrom: 9, hourTo: 12 })).toBe(true)
  })
  it('positiv mit Minuten', () => {
    expect(careTimeIsPositive({ hourFrom: 9, minuteFrom: 0, hourTo: 9, minuteTo: 30 })).toBe(true)
  })
  it('nicht positiv bei gleicher Zeit', () => {
    expect(careTimeIsPositive({ hourFrom: 9, hourTo: 9 })).toBe(false)
  })
  it('nicht positiv bei früherem Ende', () => {
    expect(careTimeIsPositive({ hourFrom: 12, hourTo: 9 })).toBe(false)
  })
})
