import { describe, it, expect } from 'vitest'
import {
  splitInvoiceHours,
  invoicePositions,
  correctionsTotal,
  invoiceTotal,
  canCorrect,
  calculationBasis,
  SICKNESS_RULE_LABELS
} from '@/utilities/billing/invoiceView.js'

// Rechnung mit 3 h regulär + optional 2 h Krankheit, Satz 40 €.
function invoice(extra = {}, carrierExtra = {}, withSick = false) {
  const items = [{ hourFrom: 9, minuteFrom: 0, hourTo: 12, minuteTo: 0 }]
  if (withSick) items.push({ hourFrom: 10, minuteFrom: 0, hourTo: 12, minuteTo: 0, sick: true })
  return {
    id: 'inv-1',
    child: { hourlyRate: 40 },
    carrier: { name: 'JA Test', ...carrierExtra },
    dailyReport: { items },
    ...extra
  }
}

describe('Rechnungsansicht – Stunden-Aufteilung', () => {
  it('trennt reguläre und Krankheitsstunden', () => {
    expect(splitInvoiceHours(invoice({}, {}, true))).toEqual({ regular: 3, sick: 2 })
  })
  it('ohne Krankheit nur regulär', () => {
    expect(splitInvoiceHours(invoice())).toEqual({ regular: 3, sick: 0 })
  })
})

describe('Rechnungsansicht – Positionen nach THA-Vorlage', () => {
  it('Betreuungs-Position: Stunden × Satz, Label je Fachkraftstatus', () => {
    const [tha] = invoicePositions(invoice())
    expect(tha.label).toBe('Betreuung (Päd. Fachkraft)')
    expect(tha.hours).toBe(3)
    expect(tha.rate).toBe(40)
    expect(tha.amount).toBe(120)
  })
  it('Hilfskraft-Label bei professional=false', () => {
    const [tha] = invoicePositions(invoice({ guardian: { professional: false } }))
    expect(tha.label).toBe('Betreuung (Päd. Hilfskraft)')
  })
  it('Terminabsage "none" → 0 € mit Hinweis „nicht vergütet"', () => {
    const positions = invoicePositions(invoice({}, { sicknessRule: 'none' }, true))
    const sick = positions.find((p) => p.key === 'sick')
    expect(sick.label).toContain('Kurzfristige Terminabsage')
    expect(sick.amount).toBe(0)
    expect(sick.note).toBe('nicht vergütet')
  })
  it('Terminabsage "full" → voller Satz', () => {
    const positions = invoicePositions(invoice({}, { sicknessRule: 'full' }, true))
    const sick = positions.find((p) => p.key === 'sick')
    expect(sick.amount).toBe(80)
  })
  it('Terminabsage "partial" → 30 % des Stundensatzes (Vorlage)', () => {
    const positions = invoicePositions(invoice({}, { sicknessRule: 'partial' }, true))
    const sick = positions.find((p) => p.key === 'sick')
    expect(sick.label).toContain('30% des Stundensatzes')
    expect(sick.rate).toBe(12) // 40 × 0,3
    expect(sick.amount).toBe(24) // 2 h × 12
  })
  it('Stunden werden auf Viertelstunden gerundet', () => {
    // 9:00–12:10 = 3,1667 h → 3,25 h
    const inv = invoice()
    inv.dailyReport.items = [{ hourFrom: 9, minuteFrom: 0, hourTo: 12, minuteTo: 10 }]
    const [tha] = invoicePositions(inv)
    expect(tha.hours).toBe(3.25)
  })
  it('ohne Terminabsagen keine Absage-Position', () => {
    expect(invoicePositions(invoice()).some((p) => p.key === 'sick')).toBe(false)
  })
})

describe('Rechnungsansicht – Korrekturen & Gesamtbetrag', () => {
  it('summiert signierte Korrekturen', () => {
    expect(correctionsTotal([{ amount: -20 }, { amount: 5.5 }])).toBe(-14.5)
  })
  it('Gesamt = Positionen + Korrekturen (inkl. 30%-Terminabsage)', () => {
    const positions = invoicePositions(invoice({}, { sicknessRule: 'partial' }, true)) // 120 + 24
    expect(invoiceTotal(positions, [{ amount: -20 }])).toBe(124)
  })
  it('Korrekturen nur vor Versand zulässig', () => {
    expect(canCorrect(invoice())).toBe(true)
    expect(canCorrect(invoice({ transmitted: true }))).toBe(false)
    expect(canCorrect(invoice({ charged: true }))).toBe(false)
  })
})

describe('Berechnungsgrundlage je Kostenträger', () => {
  it('weist Satz, Soll, Krankheit und Pool aus', () => {
    const rows = calculationBasis(invoice({}, { sicknessRule: 'full', poolRule: 'carryover', paymentTermDays: 14 }))
    const byLabel = Object.fromEntries(rows.map((r) => [r.label, r.value]))
    expect(byLabel['Stundensatz']).toContain('40')
    expect(byLabel['Stundensatz']).toContain('Bescheid/Fallakte')
    expect(byLabel['Krankheit des Kindes']).toBe(SICKNESS_RULE_LABELS.full)
    expect(byLabel['Stundenpool']).toContain('Folgemonat')
    expect(byLabel['Zahlungsziel']).toBe('14 Tage')
  })
  it('unterschiedliche Ämter → unterschiedliche Grundlage', () => {
    const a = calculationBasis(invoice({}, { sicknessRule: 'none' }))
    const b = calculationBasis(invoice({}, { sicknessRule: 'full' }))
    const val = (rows) => rows.find((r) => r.label === 'Krankheit des Kindes').value
    expect(val(a)).not.toBe(val(b))
  })
  it('nennt E-Rechnungsdaten, wenn vorhanden', () => {
    const rows = calculationBasis(invoice({}, { leitwegId: '06433-04001-77', debtorNumber: 'DEB-1' }))
    expect(rows.some((r) => r.label.includes('Leitweg'))).toBe(true)
    expect(rows.some((r) => r.label.includes('Debitoren'))).toBe(true)
  })
})
