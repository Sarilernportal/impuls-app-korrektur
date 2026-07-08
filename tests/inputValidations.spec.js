import { describe, it, expect } from 'vitest'
import {
  emptyValidation,
  emailValidation,
  passwordValidation,
  floatOrIntegerValidation,
  phoneValidation,
  percentageValidation
} from '@/utilities/others/inputValidations.js'

describe('Validierung – Pflichtfeld', () => {
  it('leer ist ungültig', () => {
    expect(emptyValidation('')).toBe(false)
  })
  it('mit Inhalt ist gültig', () => {
    expect(emptyValidation('Max')).toBe(true)
  })
})

describe('Validierung – E-Mail', () => {
  it('akzeptiert korrekte Adressen', () => {
    expect(emailValidation('a.b@impuls-erziehungshilfen.de')).toBe(true)
  })
  it('lehnt fehlerhafte Adressen ab', () => {
    expect(emailValidation('keine-email')).toBe(false)
    expect(emailValidation('a@b')).toBe(false)
    expect(emailValidation('')).toBe(false)
  })
})

describe('Validierung – Passwort (min. 12, Groß/Klein, Zahl, Sonderzeichen)', () => {
  it('akzeptiert ein starkes Passwort', () => {
    expect(passwordValidation('Impuls2026!xx')).toBe(true)
  })
  it('lehnt zu kurze Passwörter ab', () => {
    expect(passwordValidation('Imp1!')).toBe(false)
  })
  it('lehnt Passwörter ohne Sonderzeichen ab', () => {
    expect(passwordValidation('Impuls2026xxx')).toBe(false)
  })
  it('lehnt Passwörter mit Leerzeichen ab', () => {
    expect(passwordValidation('Impuls 2026!x')).toBe(false)
  })
})

describe('Validierung – Telefonnummer', () => {
  it('akzeptiert gültige Nummern (national, international, ohne führende 0)', () => {
    expect(phoneValidation('017612345678')).toBe(true)
    expect(phoneValidation('+4917612345678')).toBe(true)
    expect(phoneValidation('17612345678')).toBe(true)
  })
  it('lehnt Buchstaben und Leeres ab', () => {
    expect(phoneValidation('abc')).toBe(false)
    expect(phoneValidation('')).toBe(false)
  })
})

describe('Validierung – Zahl/Float', () => {
  it('akzeptiert Ganzzahlen', () => {
    expect(floatOrIntegerValidation(5)).toBe(true)
  })
  it('lehnt Leeres ab', () => {
    expect(floatOrIntegerValidation('')).toBe(false)
  })
})

describe('Validierung – Prozent (max. 100)', () => {
  it('akzeptiert Werte bis 100', () => {
    expect(percentageValidation('80')).toBe(true)
  })
  it('lehnt über 100 ab', () => {
    expect(percentageValidation('120')).toBe(false)
  })
})
