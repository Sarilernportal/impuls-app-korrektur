import { describe, it, expect } from 'vitest'
import {
  dailyReportItems,
  hasReviseReport,
  hasInvoicedReport,
  canInvoiceTimeSheet,
  timeSheetStatus,
  invoiceStatus,
  hoursWorked
} from '@/utilities/billing/billing.js'

// Hilfsfunktion: baut einen Nachweis mit gegebenen Doku-Items
function timeSheet(items, reportType = 'standard') {
  return { reportType, dailyReport: { items } }
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
    expect(canInvoiceTimeSheet(timeSheet([{ flag: null }], 'special'))).toBe(false)
  })
  it('ist NICHT abrechenbar bei Doku in Prüfung', () => {
    expect(canInvoiceTimeSheet(timeSheet([{ flag: 'revise' }]))).toBe(false)
  })
  it('ist NICHT abrechenbar wenn bereits abgerechnet', () => {
    expect(canInvoiceTimeSheet(timeSheet([{ charged: true }]))).toBe(false)
  })
})

describe('Abrechnung – timeSheetStatus', () => {
  it('"abgerechnet" wenn eine Doku abgerechnet ist', () => {
    expect(timeSheetStatus(timeSheet([{ charged: true }])).label).toBe('abgerechnet')
  })
  it('"in Prüfung" bei markierter Doku', () => {
    expect(timeSheetStatus(timeSheet([{ flag: 'revise' }])).label).toBe('in Prüfung')
  })
  it('"Doku fehlt" ohne Items', () => {
    expect(timeSheetStatus(timeSheet([])).label).toBe('Doku fehlt')
  })
  it('"bereit" bei sauberen Dokus', () => {
    expect(timeSheetStatus(timeSheet([{ flag: null, charged: false }])).label).toBe('bereit')
  })
})

describe('Abrechnung – invoiceStatus', () => {
  it('"bezahlt" wenn charged', () => {
    expect(invoiceStatus({ charged: true }).label).toBe('bezahlt')
  })
  it('"Rückfrage" bei markierter Doku', () => {
    expect(invoiceStatus({ charged: false, dailyReport: { items: [{ flag: 'revise' }] } }).label).toBe('Rückfrage')
  })
  it('"versandbereit" mit interner Rechnungsnummer', () => {
    expect(invoiceStatus({ charged: false, internalNumber: 'RE-2026-1' }).label).toBe('versandbereit')
  })
  it('"GF-Prüfung" ohne Rechnungsnummer', () => {
    expect(invoiceStatus({ charged: false }).label).toBe('GF-Prüfung')
  })
})

describe('Abrechnung – hoursWorked (Stundenberechnung)', () => {
  it('berechnet volle Stunden', () => {
    expect(hoursWorked([{ hourFrom: 9, hourTo: 12 }])).toBe('3h 0m')
  })
  it('berücksichtigt Minuten', () => {
    expect(hoursWorked([{ hourFrom: 9, minuteFrom: 15, hourTo: 10, minuteTo: 45 }])).toBe('1h 30m')
  })
  it('summiert mehrere Einträge', () => {
    expect(hoursWorked([
      { hourFrom: 8, hourTo: 10 },
      { hourFrom: 13, minuteFrom: 0, hourTo: 13, minuteTo: 30 }
    ])).toBe('2h 30m')
  })
  it('wertet negative Zeitspannen als 0', () => {
    expect(hoursWorked([{ hourFrom: 12, hourTo: 9 }])).toBe('0h 0m')
  })
  it('ignoriert Einträge ohne gültige Zeiten', () => {
    expect(hoursWorked([{ hourFrom: '9', hourTo: 12 }, { hourFrom: 9, hourTo: 11 }])).toBe('2h 0m')
  })
  it('liefert 0 bei leerer Liste', () => {
    expect(hoursWorked([])).toBe('0h 0m')
  })
})
