/*
Project: Impuls / SAYAS – Schulbegleitung / Teilhabeassistenz (§ 35a SGB VIII)
Scope: Aufbau einer Abrechnungszeile aus einem Nachweis/einer Rechnung

Orchestriert die reinen Bausteine (billing/calculation/signatures/status) zu
einer fertigen Zeile für die Abrechnungstabelle. Bewusst frei von UI/Store,
damit die komplette Stunden-/Betragslogik isoliert testbar bleibt.
*/

import {
  dailyReportItems,
  timeSheetBillingStatus,
  invoiceBillingStatus
} from './billing.js'
import {
  workedHoursDecimal,
  hourlyRateFor,
  billingRulesFor,
  computeOverhang,
  computeBillableHours,
  computeAmount,
  formatHours,
  formatEuro
} from './calculation.js'
import { signatureStatus } from './signatures.js'
import { statusMeta } from './status.js'

// Grober Monatskontext aus einem Datum: Anzahl Wochen für die vorläufige
// Soll-Näherung (bis ein Schul-/Ferienkalender echte Schultage liefert).
export function monthContextFor(date) {
  const d = date ? new Date(date) : new Date()
  const year = d.getFullYear()
  const month = d.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  return {
    year,
    month,
    monthWeeks: round2(daysInMonth / 7)
  }
}

// Baut eine Abrechnungszeile aus einem Leistungsnachweis (timeSheet).
export function buildTimeSheetRow(timeSheet, options = {}) {
  const { monthContext = {}, correction = null } = options
  const reports = dailyReportItems(timeSheet)
  const child = timeSheet.child || {}
  const carrier = timeSheet.carrier || {}

  const weeklyHours = toNumber(child.weeklyHours)
  const worked = workedHoursDecimal(reports)
  const rules = billingRulesFor(carrier)
  const soll = rules.computeSoll({
    weeklyHours,
    hoursPerSchoolDay: monthContext.hoursPerSchoolDay,
    schoolDays: monthContext.schoolDays,
    monthWeeks: monthContext.monthWeeks
  })

  const overhangHours = computeOverhang(worked, soll.hours)
  const hasOverhang = overhangHours > 0
  const billableHours = computeBillableHours(worked, soll.hours, correction)
  const rate = hourlyRateFor(child, carrier)
  const amount = computeAmount(billableHours, rate)
  const signatures = signatureStatus(timeSheet)
  const status = timeSheetBillingStatus(timeSheet, { hasOverhang })

  return {
    id: timeSheet.id,
    kind: 'timeSheet',
    document: timeSheet,
    weeklyHours,
    soll,
    workedHours: worked,
    overhangHours,
    hasOverhang,
    billableHours,
    hourlyRate: rate,
    amount,
    signatures,
    correction,
    status,
    statusMeta: statusMeta(status),
    // Vorformatierte Anzeige-Werte
    display: {
      weeklyHours: Number.isFinite(weeklyHours) ? `${weeklyHours}` : '–',
      soll: formatHours(soll.hours),
      sollProvisional: soll.provisional,
      worked: formatHours(worked),
      overhang: hasOverhang ? `+${formatHours(overhangHours)}` : '–',
      billable: formatHours(billableHours),
      amount: formatEuro(amount)
    }
  }
}

// Baut eine Abrechnungszeile aus einer Rechnung (invoice).
export function buildInvoiceRow(invoice) {
  const reports = dailyReportItems(invoice)
  const child = invoice.child || {}
  const carrier = invoice.carrier || {}
  const worked = workedHoursDecimal(reports)
  const rate = hourlyRateFor(child, carrier)
  const amount = computeAmount(worked, rate)
  const status = invoiceBillingStatus(invoice)

  return {
    id: invoice.id,
    kind: 'invoice',
    document: invoice,
    weeklyHours: toNumber(child.weeklyHours),
    soll: { hours: null, provisional: true, basis: 'rechnung' },
    workedHours: worked,
    overhangHours: 0,
    hasOverhang: false,
    billableHours: worked,
    hourlyRate: rate,
    amount,
    signatures: signatureStatus(invoice),
    correction: null,
    status,
    statusMeta: statusMeta(status),
    display: {
      weeklyHours: Number.isFinite(toNumber(child.weeklyHours))
        ? `${toNumber(child.weeklyHours)}`
        : '–',
      soll: '–',
      sollProvisional: false,
      worked: formatHours(worked),
      overhang: '–',
      billable: formatHours(worked),
      amount: formatEuro(amount)
    }
  }
}

function toNumber(value) {
  const n = Number(value)
  return Number.isFinite(n) ? n : NaN
}

function round2(value) {
  return Math.round(value * 100) / 100
}
