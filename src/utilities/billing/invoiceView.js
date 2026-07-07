/*
Project: Impuls / SAYAS – Schulbegleitung / Teilhabeassistenz (§ 35a SGB VIII)
Scope: Rechnungsansicht – Positionen, Korrekturen, Berechnungsgrundlage

Baut aus einer Rechnung (Invoice + Tages-Dokus) die anzeigbaren Positionen,
verrechnet Rechnungskorrekturen (vor dem Versand, mit Pflicht-Begründung) und
liefert die BERECHNUNGSGRUNDLAGE als Anlage für den Kostenträger/die Behörde.

WICHTIG: Jeder Kostenträger hat eine eigene Berechnungsgrundlage (Krankheit,
Soll, Pool, Stundensatz). Die konkreten Detailregeln werden nachgeliefert –
hier wird NUR ausgewiesen, welche Regel gilt; bei "teilweise" bleibt der
Betrag offen ("Regel folgt"), statt eine falsche Zahl zu erfinden.
*/

import { hourlyRateFor, billingRulesFor, formatEuro, formatHours } from './calculation.js'

// ──────────────────────────────────────────────────────────────────────────
// Regel-Beschriftungen (Berechnungsgrundlage)
// ──────────────────────────────────────────────────────────────────────────

export const SICKNESS_RULE_LABELS = Object.freeze({
  none: 'Krankheitstage des Kindes werden nicht vergütet',
  partial: 'Krankheitstage des Kindes werden teilweise vergütet (Detailregel des Amtes)',
  full: 'Krankheitstage des Kindes werden voll vergütet'
})

export const POOL_RULE_LABELS = Object.freeze({
  none: 'Kein Stundenpool / kein Übertrag',
  carryover: 'Nicht geleistete Stunden werden in den Folgemonat übertragen'
})

export const SOLL_RULE_LABELS = Object.freeze({
  schooldays: 'Monatssoll aus tatsächlichen Schultagen (Ferien-/Feiertagskalender)'
})

// ──────────────────────────────────────────────────────────────────────────
// Stunden nach Art trennen (regulär / Krankheit des Kindes)
// ──────────────────────────────────────────────────────────────────────────

function reportHours(report) {
  if (typeof report.hourFrom !== 'number' || typeof report.hourTo !== 'number') {
    return 0
  }
  const from = report.hourFrom + (report.minuteFrom || 0) / 60
  const to = report.hourTo + (report.minuteTo || 0) / 60
  return Math.max(to - from, 0)
}

export function splitInvoiceHours(invoice) {
  const items = invoice?.dailyReport?.items || []
  let regular = 0
  let sick = 0
  items.forEach((report) => {
    const hours = reportHours(report)
    if (report.sick) sick += hours
    else regular += hours
  })
  return { regular: round2(regular), sick: round2(sick) }
}

// ──────────────────────────────────────────────────────────────────────────
// Positionen der Rechnungsansicht
// ──────────────────────────────────────────────────────────────────────────

/*
Positionen: reguläre THA-Stunden × Satz; Krankheitsstunden je Amtsregel:
  none    → 0 € (ausgewiesen als "nicht vergütet")
  full    → voller Satz
  partial → Betrag offen (Detailregel folgt, wird NICHT geraten)
→ [{ key, label, hours, rate, amount, note? }]
*/
export function invoicePositions(invoice) {
  const carrier = invoice?.carrier || {}
  const rules = billingRulesFor(carrier)
  const rate = hourlyRateFor(invoice?.child || {}, carrier, invoice?.guardian || null, rules)
  const { regular, sick } = splitInvoiceHours(invoice)

  const positions = [
    {
      key: 'tha',
      label: 'Teilhabeassistenz / Schulbegleitung (§ 35a SGB VIII)',
      hours: regular,
      rate,
      amount: rate !== null ? round2(regular * rate) : null
    }
  ]

  if (sick > 0) {
    const sicknessRule = carrier.sicknessRule || 'none'
    let amount = 0
    let note = SICKNESS_RULE_LABELS.none
    if (sicknessRule === 'full') {
      amount = rate !== null ? round2(sick * rate) : null
      note = SICKNESS_RULE_LABELS.full
    } else if (sicknessRule === 'partial') {
      amount = null
      note = SICKNESS_RULE_LABELS.partial
    }
    positions.push({
      key: 'sick',
      label: 'Ausfallzeiten bei Krankheit des Kindes',
      hours: sick,
      rate,
      amount,
      note
    })
  }

  return positions
}

// ──────────────────────────────────────────────────────────────────────────
// Rechnungskorrekturen (vor Versand, mit Begründung)
// ──────────────────────────────────────────────────────────────────────────

// Eine Korrektur: { label, amount (signiert, €), reason, at }
export function correctionsTotal(corrections) {
  return round2(
    (corrections || []).reduce((total, correction) => {
      const amount = Number(correction.amount)
      return total + (Number.isFinite(amount) ? amount : 0)
    }, 0)
  )
}

// Gesamtbetrag = Summe bezifferter Positionen + Korrektursumme.
export function invoiceTotal(positions, corrections) {
  const base = (positions || []).reduce((total, position) => {
    return total + (Number.isFinite(position.amount) ? position.amount : 0)
  }, 0)
  return round2(base + correctionsTotal(corrections))
}

// Korrekturen sind nur vor dem Versand zulässig.
export function canCorrect(invoice) {
  return !invoice?.transmitted && !invoice?.charged
}

// ──────────────────────────────────────────────────────────────────────────
// Berechnungsgrundlage (Anlage für den Kostenträger / die Behörde)
// ──────────────────────────────────────────────────────────────────────────

/*
→ [{ label, value }] – weist je Kostenträger aus, mit welchen Regeln die
Rechnung berechnet wurde (Stundensatz + Quelle, Soll, Krankheit, Pool,
Zahlungsziel). Grundlage für Prüfbarkeit beim Amt.
*/
export function calculationBasis(invoice) {
  const carrier = invoice?.carrier || {}
  const child = invoice?.child || {}
  const rules = billingRulesFor(carrier)
  const rate = hourlyRateFor(child, carrier, invoice?.guardian || null, rules)

  let rateSource = 'kein Satz hinterlegt'
  if (rate !== null) {
    if (Number(child.hourlyRate) === rate) rateSource = 'aus Bescheid/Fallakte'
    else if (Number(invoice?.guardian?.hourlyRate) === rate) rateSource = 'Vergütungssatz der Fachkraft'
    else rateSource = 'Standardsatz des Kostenträgers'
  }

  const rows = [
    {
      label: 'Stundensatz',
      value: rate !== null ? `${formatEuro(rate)} / Std. (${rateSource})` : rateSource
    },
    {
      label: 'Soll-Berechnung',
      value: SOLL_RULE_LABELS[carrier.sollRule] || SOLL_RULE_LABELS.schooldays
    },
    {
      label: 'Krankheit des Kindes',
      value: SICKNESS_RULE_LABELS[carrier.sicknessRule] || SICKNESS_RULE_LABELS.none
    },
    {
      label: 'Stundenpool',
      value: POOL_RULE_LABELS[carrier.poolRule] || POOL_RULE_LABELS.none
    }
  ]

  if (carrier.paymentTermDays) {
    rows.push({ label: 'Zahlungsziel', value: `${carrier.paymentTermDays} Tage` })
  }
  if (carrier.leitwegId) {
    rows.push({ label: 'Leitweg-ID (XRechnung)', value: carrier.leitwegId })
  }
  if (carrier.debtorNumber) {
    rows.push({ label: 'Debitoren-/Kundennr.', value: carrier.debtorNumber })
  }

  return rows
}

// ──────────────────────────────────────────────────────────────────────────
// Formatierung (Durchreichung für die Ansicht)
// ──────────────────────────────────────────────────────────────────────────

export { formatEuro, formatHours }

function round2(value) {
  return Math.round(value * 100) / 100
}
