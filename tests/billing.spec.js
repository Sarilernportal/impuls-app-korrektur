import { describe, it, expect } from 'vitest'
import {
  dailyReportItems,
  hasReviseReport,
  hasInvoicedReport,
  canInvoiceTimeSheet,
  timeSheetBillingStatus,
  invoiceBillingStatus
} from '@/utilities/billing/billing.js'
import { BILLING_STATUS } from '@/utilities/billing/status.js'
import {
  workedHoursDecimal,
  hourlyRateFor,
  billingRulesFor,
  defaultBillingRules,
  computeOverhang,
  computeBillableHours,
  computeAmount,
  formatHours,
  formatEuro
} from '@/utilities/billing/calculation.js'
import { signatureStatus, signaturesComplete } from '@/utilities/billing/signatures.js'
import { buildTimeSheetRow, buildInvoiceRow, monthContextFor } from '@/utilities/billing/rows.js'

const COMPLETE_SIG = { parent: true, school: true, professional: true }

// Hilfsfunktion: baut einen Nachweis mit gegebenen Doku-Items (Default: alle
// Unterschriften vorhanden, damit "abrechenbar" geprüft werden kann).
function timeSheet(items, extra = {}) {
  return { reportType: 'standard', dailyReport: { items }, signatures: COMPLETE_SIG, ...extra }
}

describe('Abrechnung – dailyReportItems', () => {
  it('liefert die Items', () => {
    expect(dailyReportItems(timeSheet([{ id: 1 }]))).toHaveLength(1)
  })
  it('liefert [] bei fehlenden Daten', () => {
    expect(dailyReportItems({})).toEqual([])
    expect(dailyReportItems(undefined)).toEqual([])
  })
})

describe('Abrechnung – Flags', () => {
  it('erkennt eine zur Überarbeitung markierte Doku', () => {
    expect(hasReviseReport(timeSheet([{ flag: 'revise' }]))).toBe(true)
    expect(hasReviseReport(timeSheet([{ flag: null }]))).toBe(false)
  })
  it('erkennt bereits abgerechnete Dokus', () => {
    expect(hasInvoicedReport(timeSheet([{ charged: true }]))).toBe(true)
    expect(hasInvoicedReport(timeSheet([{ charged: false }]))).toBe(false)
  })
})

describe('Abrechnung – canInvoiceTimeSheet (abrechenbar?)', () => {
  it('ist abrechenbar bei vorhandenen, sauberen Dokus', () => {
    expect(canInvoiceTimeSheet(timeSheet([{ flag: null, charged: false }]))).toBe(true)
  })
  it('ist NICHT abrechenbar ohne Dokus', () => {
    expect(canInvoiceTimeSheet(timeSheet([]))).toBe(false)
  })
  it('ist NICHT abrechenbar bei Sonderzeiten-Nachweis', () => {
    expect(canInvoiceTimeSheet(timeSheet([{ flag: null }], { reportType: 'special' }))).toBe(false)
  })
  it('ist NICHT abrechenbar bei Doku in Prüfung', () => {
    expect(canInvoiceTimeSheet(timeSheet([{ flag: 'revise' }]))).toBe(false)
  })
  it('ist NICHT abrechenbar wenn bereits abgerechnet', () => {
    expect(canInvoiceTimeSheet(timeSheet([{ charged: true }]))).toBe(false)
  })
})

describe('Abrechnung – timeSheetBillingStatus (einheitliches Vokabular)', () => {
  it('"rechnung_erstellt" wenn eine Doku abgerechnet ist', () => {
    expect(timeSheetBillingStatus(timeSheet([{ charged: true }]))).toBe(BILLING_STATUS.RECHNUNG_ERSTELLT)
  })
  it('"doku_offen" ohne Items', () => {
    expect(timeSheetBillingStatus(timeSheet([]))).toBe(BILLING_STATUS.DOKU_OFFEN)
  })
  it('"nachweis_pruefen" bei markierter Doku', () => {
    expect(timeSheetBillingStatus(timeSheet([{ flag: 'revise' }]))).toBe(BILLING_STATUS.NACHWEIS_PRUEFEN)
  })
  it('"nachweis_pruefen" bei fehlender Unterschrift', () => {
    const ts = timeSheet([{ flag: null }], { signatures: { parent: true, school: false, professional: true } })
    expect(timeSheetBillingStatus(ts)).toBe(BILLING_STATUS.NACHWEIS_PRUEFEN)
  })
  it('"abrechenbar" bei sauberen Dokus mit vollständigen Unterschriften', () => {
    expect(timeSheetBillingStatus(timeSheet([{ flag: null, charged: false }]))).toBe(BILLING_STATUS.ABRECHENBAR)
  })
  it('"ueberhang" wenn geleistet über Soll (ctx.hasOverhang)', () => {
    expect(timeSheetBillingStatus(timeSheet([{ flag: null }]), { hasOverhang: true })).toBe(BILLING_STATUS.UEBERHANG)
  })
})

describe('Abrechnung – invoiceBillingStatus', () => {
  it('"bezahlt" wenn charged', () => {
    expect(invoiceBillingStatus({ charged: true })).toBe(BILLING_STATUS.BEZAHLT)
  })
  it('"offen_unbezahlt" wenn versendet, aber nicht bezahlt', () => {
    expect(invoiceBillingStatus({ charged: false, transmitted: true })).toBe(BILLING_STATUS.OFFEN_UNBEZAHLT)
  })
  it('"rechnung_erstellt" wenn weder versendet noch bezahlt', () => {
    expect(invoiceBillingStatus({ charged: false })).toBe(BILLING_STATUS.RECHNUNG_ERSTELLT)
  })
})

describe('Berechnung – workedHoursDecimal', () => {
  it('berechnet volle Stunden', () => {
    expect(workedHoursDecimal([{ hourFrom: 9, hourTo: 12 }])).toBe(3)
  })
  it('berücksichtigt Minuten', () => {
    expect(workedHoursDecimal([{ hourFrom: 9, minuteFrom: 15, hourTo: 10, minuteTo: 45 }])).toBe(1.5)
  })
  it('wertet negative Zeitspannen als 0', () => {
    expect(workedHoursDecimal([{ hourFrom: 12, hourTo: 9 }])).toBe(0)
  })
  it('ignoriert Einträge ohne gültige Zeiten', () => {
    expect(workedHoursDecimal([{ hourFrom: '9', hourTo: 12 }, { hourFrom: 9, hourTo: 11 }])).toBe(2)
  })
  it('liefert 0 bei leerer Liste', () => {
    expect(workedHoursDecimal([])).toBe(0)
  })
})

describe('Berechnung – Stundensatz', () => {
  it('nimmt den Satz der Fallakte zuerst', () => {
    expect(hourlyRateFor({ hourlyRate: 47 }, { defaultHourlyRate: 45.5 })).toBe(47)
  })
  it('fällt auf den Default des Jugendamts zurück', () => {
    expect(hourlyRateFor({}, { defaultHourlyRate: 45.5 })).toBe(45.5)
  })
  it('liefert null ohne Satz', () => {
    expect(hourlyRateFor({}, {})).toBe(null)
  })
  it('nutzt den Betreuersatz als Fallback (Default: Fallakte zuerst)', () => {
    // Fallakte leer -> Betreuer vor Träger
    expect(hourlyRateFor({}, { defaultHourlyRate: 50 }, { hourlyRate: 42 })).toBe(42)
  })
  it('priorisiert den Betreuersatz bei rateSource "guardian"', () => {
    const rules = { rateSource: 'guardian' }
    expect(hourlyRateFor({ hourlyRate: 47 }, { defaultHourlyRate: 50 }, { hourlyRate: 42 }, rules)).toBe(42)
  })
  it('priorisiert die Fallakte bei rateSource "case"', () => {
    const rules = { rateSource: 'case' }
    expect(hourlyRateFor({ hourlyRate: 47 }, { defaultHourlyRate: 50 }, { hourlyRate: 42 }, rules)).toBe(47)
  })
})

describe('Berechnung – Überhang / Abrechenbar / Betrag', () => {
  it('Überhang = geleistet − Soll (nur positiv)', () => {
    expect(computeOverhang(46, 40)).toBe(6)
    expect(computeOverhang(38, 40)).toBe(0)
  })
  it('Abrechenbar standardmäßig auf Soll gedeckelt', () => {
    expect(computeBillableHours(46, 40)).toBe(40)
    expect(computeBillableHours(38, 40)).toBe(38)
  })
  it('Freigabe rechnet Überhang-Stunden zusätzlich ab (max. Überhang)', () => {
    expect(computeBillableHours(46, 40, { mode: 'release', releasedHours: 4 })).toBe(44)
    expect(computeBillableHours(46, 40, { mode: 'release', releasedHours: 99 })).toBe(46)
  })
  it('Deckeln/Carryover rechnen nur das Soll ab', () => {
    expect(computeBillableHours(46, 40, { mode: 'cap' })).toBe(40)
    expect(computeBillableHours(46, 40, { mode: 'carryover' })).toBe(40)
  })
  it('ohne bekanntes Soll → geleistete Stunden', () => {
    expect(computeBillableHours(46, null)).toBe(46)
  })
  it('Betrag = abrechenbar × Satz', () => {
    expect(computeAmount(40, 45.5)).toBe(1820)
    expect(computeAmount(40, null)).toBe(null)
  })
})

describe('Berechnung – Soll-Strategie (default, vorläufig)', () => {
  it('rechnet Schultage × Stunden/Tag, wenn Kalender-Daten vorliegen', () => {
    const soll = defaultBillingRules.computeSoll({ schoolDays: 20, hoursPerSchoolDay: 3 })
    expect(soll.hours).toBe(60)
    expect(soll.provisional).toBe(false)
  })
  it('nutzt eine als vorläufig markierte Näherung ohne Kalender', () => {
    const soll = defaultBillingRules.computeSoll({ weeklyHours: 10, monthWeeks: 4.3 })
    expect(soll.hours).toBe(43)
    expect(soll.provisional).toBe(true)
  })
  it('liefert null bei fehlenden Angaben', () => {
    expect(defaultBillingRules.computeSoll({}).hours).toBe(null)
  })
  it('billingRulesFor fällt auf default zurück', () => {
    expect(billingRulesFor({})).toBe(defaultBillingRules)
    expect(billingRulesFor({ billingRuleSet: 'unbekannt' })).toBe(defaultBillingRules)
  })
})

describe('Formatierung', () => {
  it('formatHours', () => {
    expect(formatHours(3)).toBe('3 h')
    expect(formatHours(1.5)).toBe('1 h 30 m')
    expect(formatHours(NaN)).toBe('–')
  })
  it('formatEuro', () => {
    expect(formatEuro(1820)).toContain('1.820')
    expect(formatEuro(null)).toBe('–')
  })
})

describe('Unterschriften-Ampel', () => {
  it('vollständig, wenn alle drei vorliegen', () => {
    const status = signatureStatus({ signatures: COMPLETE_SIG })
    expect(status.complete).toBe(true)
    expect(status.missing).toEqual([])
  })
  it('meldet fehlende Unterschriften', () => {
    const status = signatureStatus({ signatures: { parent: true, school: false, professional: false } })
    expect(status.complete).toBe(false)
    expect(status.missing).toContain('Schule')
    expect(status.missing).toContain('Fachkraft')
  })
  it('Fallback: Fachkraft-Unterschrift aus signatureImage/key', () => {
    expect(signatureStatus({ signatureImage: 'x' }).professional).toBe(true)
  })
  it('signaturesComplete als Kurzform', () => {
    expect(signaturesComplete({ signatures: COMPLETE_SIG })).toBe(true)
    expect(signaturesComplete({})).toBe(false)
  })
})

describe('Zeilenaufbau – buildTimeSheetRow / buildInvoiceRow', () => {
  const ctx = { schoolDays: 20, hoursPerSchoolDay: 3 } // Soll = 60 h

  function ts(days, hoursPerDay, extra = {}) {
    const items = Array.from({ length: days }, () => ({ hourFrom: 9, hourTo: 9 + hoursPerDay }))
    return {
      id: 't1',
      reportType: 'standard',
      signatures: COMPLETE_SIG,
      child: { weeklyHours: 15, hourlyRate: 45.5 },
      carrier: { defaultHourlyRate: 45.5 },
      dailyReport: { items },
      ...extra
    }
  }

  it('baut eine abrechenbare Zeile ohne Überhang', () => {
    const row = buildTimeSheetRow(ts(18, 3), { monthContext: ctx }) // 54 h geleistet < 60 Soll
    expect(row.workedHours).toBe(54)
    expect(row.hasOverhang).toBe(false)
    expect(row.billableHours).toBe(54)
    expect(row.amount).toBe(2457)
    expect(row.status).toBe(BILLING_STATUS.ABRECHENBAR)
  })

  it('erkennt Überhang und deckelt abrechenbar auf das Soll', () => {
    const row = buildTimeSheetRow(ts(22, 3), { monthContext: ctx }) // 66 h > 60 Soll
    expect(row.hasOverhang).toBe(true)
    expect(row.overhangHours).toBe(6)
    expect(row.billableHours).toBe(60)
    expect(row.status).toBe(BILLING_STATUS.UEBERHANG)
  })

  it('berücksichtigt eine Freigabe-Korrektur', () => {
    const row = buildTimeSheetRow(ts(22, 3), { monthContext: ctx, correction: { mode: 'release', releasedHours: 6 } })
    expect(row.billableHours).toBe(66)
  })

  it('buildInvoiceRow setzt den Status nach Rechnungslage', () => {
    const row = buildInvoiceRow({ id: 'i1', charged: true, child: {}, carrier: {}, dailyReport: { items: [] } })
    expect(row.status).toBe(BILLING_STATUS.BEZAHLT)
  })
})

describe('monthContextFor', () => {
  it('liefert Jahr, Monat und Wochenanzahl', () => {
    const ctx = monthContextFor('2026-06-15')
    expect(ctx.year).toBe(2026)
    expect(ctx.month).toBe(5) // Juni (0-basiert)
    expect(ctx.monthWeeks).toBeGreaterThan(4)
  })
})
