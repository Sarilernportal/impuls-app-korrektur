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

import {
  hourlyRateFor,
  sickRateFor,
  billingRulesFor,
  formatEuro,
  formatHours
} from './calculation.js'

// ──────────────────────────────────────────────────────────────────────────
// Regel-Beschriftungen (Berechnungsgrundlage)
// ──────────────────────────────────────────────────────────────────────────

export const SICKNESS_RULE_LABELS = Object.freeze({
  none: 'Kurzfristige Terminabsagen werden nicht vergütet',
  partial: 'Kurzfristige Terminabsage: 30 % des Stundensatzes (THA-Vorlage)',
  full: 'Kurzfristige Terminabsagen werden voll vergütet'
})

// Faktor für kurzfristige Terminabsagen laut THA-Rechnungsvorlage (30 %).
// Gilt als DEFAULT – jede Behörde kann am Kostenträger einen eigenen
// Prozentsatz hinterlegen (sicknessPercent), siehe sicknessPercentFor().
export const CANCELLATION_FACTOR = 0.3

// Prozentsatz für „teilweise vergütete" Terminabsagen der jeweiligen Behörde.
// Fallback: 30 % laut THA-Vorlage, solange das Amt nichts anderes vorgibt.
export function sicknessPercentFor(carrier) {
  const percent = Number(carrier?.sicknessPercent)
  return Number.isFinite(percent) && percent > 0 && percent <= 100
    ? percent
    : CANCELLATION_FACTOR * 100
}

/*
Allgemeine Krankheitsregel (Default, wenn die Behörde nichts anderes vorgibt):
max. 3 kurzfristige Krankmeldungen (< 24 Std. vorher) pro Monat, vergütet mit
30 % des Stundensatzes. Rechtzeitige Krankmeldungen sowie Folgetage werden
NICHT abgerechnet.
*/
export const SICKNESS_DEFAULT_MAX_PER_MONTH = 3

/*
Wie viele Krankmeldungen pro Monat sind abrechenbar?
- Explizit am Kostenträger gepflegt (sicknessMaxPerMonth) → dieser Wert.
- Behörde mit eigenem Krankmeldungs-Satz (z. B. Groß-Gerau): JEDE
  Krankmeldung < 24 Std. ist abrechenbar → Infinity.
- Sonst allgemeine Regel: max. 3 pro Monat.
*/
export function sicknessMaxFor(carrier, guardian = null) {
  const configured = Number(carrier?.sicknessMaxPerMonth)
  if (Number.isFinite(configured) && configured > 0) return configured
  return sickRateFor(carrier, guardian) !== null
    ? Infinity
    : SICKNESS_DEFAULT_MAX_PER_MONTH
}

// Beschreibt die Krankheits-/Absageregel der Behörde (für Berechnungsgrundlage).
export function sicknessRuleLabel(carrier) {
  const rule = carrier?.sicknessRule || 'none'
  if (rule === 'partial') {
    if (sickRateFor(carrier) !== null || sickRateFor(carrier, { professional: false }) !== null) {
      return 'Kurzfristige Krankmeldung (< 24 Std.): eigener Satz der Behörde'
    }
    return `Kurzfristige Terminabsage: ${formatPercent(sicknessPercentFor(carrier))} % des Stundensatzes`
  }
  return SICKNESS_RULE_LABELS[rule] || SICKNESS_RULE_LABELS.none
}

function formatPercent(percent) {
  return Number.isInteger(percent) ? String(percent) : String(percent).replace('.', ',')
}
// Pool-Lösung laut THA-Rechnungsvorlage: 65 % des Stundensatzes.
export const POOL_FACTOR = 0.65

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

// Rundung auf Viertelstunden laut THA-Vorlage („gerundet Viertelstunden").
export function roundToQuarter(hours) {
  return Math.round(hours * 4) / 4
}

/*
Trennt die Stunden einer Rechnung:
- regular:       reguläre Betreuungsstunden
- sick:          kurzfristige Krankmeldungen (< 24 Std.) gesamt
- sickMeldungen: Stunden JE Krankmeldung (für das Monatslimit, z. B. max. 3)
- sickTimely:    rechtzeitige Krankmeldungen / Folgetage → nie abrechenbar
                 (Tages-Doku mit sick: true UND sickTimely: true)
*/
export function splitInvoiceHours(invoice) {
  const items = invoice?.dailyReport?.items || []
  let regular = 0
  let sickTimely = 0
  const sickMeldungen = []
  items.forEach((report) => {
    const hours = reportHours(report)
    if (report.sick && report.sickTimely) sickTimely += hours
    else if (report.sick) sickMeldungen.push(hours)
    else regular += hours
  })
  const sickTotal = sickMeldungen.reduce((total, hours) => total + hours, 0)
  return {
    regular: roundToQuarter(regular),
    sick: roundToQuarter(sickTotal),
    sickMeldungen,
    sickTimely: roundToQuarter(sickTimely)
  }
}

// ──────────────────────────────────────────────────────────────────────────
// Positionen der Rechnungsansicht
// ──────────────────────────────────────────────────────────────────────────

/*
Positionen nach THA-Rechnungsvorlage:
- „Betreuung (Päd. Fachkraft)" bzw. „(Päd. Hilfskraft)" je Fachkraftstatus.
- Kurzfristige Krankmeldungen/Terminabsagen (< 24 Std.) je Amtsregel:
    none    → 0 € („nicht vergütet")
    partial → eigener Krankmeldungs-Satz der Behörde (z. B. Groß-Gerau:
              Fachkraft 42,91 € / Hilfskraft 29,71 €, jede Meldung abrechenbar)
              ODER prozentual (Default 30 %, max. 3 Meldungen/Monat)
    full    → voller Satz
- Meldungen ÜBER dem Monatslimit → 0 € (eigene Position, transparent).
- Rechtzeitige Krankmeldungen / Folgetage → 0 € („nicht abrechenbar").
→ [{ key, label, hours, rate, amount, note? }]
*/
export function invoicePositions(invoice) {
  const carrier = invoice?.carrier || {}
  const guardian = invoice?.guardian || null
  const rules = billingRulesFor(carrier)
  const rate = hourlyRateFor(invoice?.child || {}, carrier, guardian, rules)
  const { regular, sick, sickMeldungen, sickTimely } = splitInvoiceHours(invoice)

  const professional = guardian?.professional !== false
  const careLabel = professional ? 'Betreuung (Päd. Fachkraft)' : 'Betreuung (Päd. Hilfskraft)'

  const positions = [
    {
      key: 'tha',
      label: careLabel,
      hours: regular,
      rate,
      amount: rate !== null ? round2(regular * rate) : null
    }
  ]

  if (sick > 0) {
    const sicknessRule = carrier.sicknessRule || 'none'
    if (sicknessRule === 'partial') {
      // Monatslimit: nur die ersten N Krankmeldungen sind abrechenbar.
      const max = sicknessMaxFor(carrier, guardian)
      const billableRaw = sickMeldungen
        .slice(0, max === Infinity ? sickMeldungen.length : max)
        .reduce((total, hours) => total + hours, 0)
      const excessRaw = sickMeldungen
        .slice(max === Infinity ? sickMeldungen.length : max)
        .reduce((total, hours) => total + hours, 0)
      const billableHours = roundToQuarter(billableRaw)
      const excessHours = roundToQuarter(excessRaw)

      // Eigener Krankmeldungs-Satz der Behörde vor Prozent-Regel.
      const ownRate = sickRateFor(carrier, guardian)
      let cancelRate
      let label
      if (ownRate !== null) {
        cancelRate = ownRate
        label = 'Krankmeldung < 24 Std. (Satz der Behörde)'
      } else {
        const percent = sicknessPercentFor(carrier)
        cancelRate = rate !== null ? round2((rate * percent) / 100) : null
        label = `Kurzfristige Terminabsage (${formatPercent(percent)}% des Stundensatzes)`
      }

      if (billableHours > 0) {
        positions.push({
          key: 'sick',
          label,
          hours: billableHours,
          rate: cancelRate,
          amount: cancelRate !== null ? round2(billableHours * cancelRate) : null,
          note: ''
        })
      }
      if (excessHours > 0) {
        positions.push({
          key: 'sick-excess',
          label: 'Krankmeldung über Monatslimit',
          hours: excessHours,
          rate: 0,
          amount: 0,
          note: `max. ${max} Krankmeldungen/Monat abrechenbar`
        })
      }
    } else {
      const full = sicknessRule === 'full'
      positions.push({
        key: 'sick',
        label: 'Kurzfristige Terminabsage',
        hours: sick,
        rate: full ? rate : 0,
        amount: full ? (rate !== null ? round2(sick * rate) : null) : 0,
        note: full ? 'voll vergütet' : 'nicht vergütet'
      })
    }
  }

  // Rechtzeitige Krankmeldungen und Folgetage sind NIE abrechenbar
  // (allgemeine Regel) – transparent als 0-€-Position ausgewiesen.
  if (sickTimely > 0) {
    positions.push({
      key: 'sick-timely',
      label: 'Rechtzeitige Krankmeldung / Folgetag',
      hours: sickTimely,
      rate: 0,
      amount: 0,
      note: 'nicht abrechenbar'
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
    else if (Number(carrier.hourlyRateSpecialist) === rate) rateSource = 'Satz der Behörde (Päd. Fachkraft)'
    else if (Number(carrier.hourlyRateAssistant) === rate) rateSource = 'Satz der Behörde (ohne Fachkraft)'
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
      value: sicknessRuleLabel(carrier)
    },
    {
      label: 'Stundenpool',
      value: POOL_RULE_LABELS[carrier.poolRule] || POOL_RULE_LABELS.none
    }
  ]

  // Jede Behörde hinterlegt ZWEI Sätze (mit/ohne Fachkraft) – beide ausweisen,
  // damit das Amt die Grundlage unabhängig vom eingesetzten Betreuer prüfen kann.
  const specialistRate = Number(carrier.hourlyRateSpecialist)
  const assistantRate = Number(carrier.hourlyRateAssistant)
  if (specialistRate > 0 || assistantRate > 0) {
    const parts = []
    if (specialistRate > 0) parts.push(`Päd. Fachkraft ${formatEuro(specialistRate)}`)
    if (assistantRate > 0) parts.push(`ohne Fachkraft ${formatEuro(assistantRate)}`)
    rows.splice(1, 0, { label: 'Stundensätze der Behörde', value: parts.join(' · ') })
  }

  // Eigene Krankmeldungs-Sätze der Behörde (z. B. Groß-Gerau).
  const sickSpecialist = Number(carrier.sickRateSpecialist)
  const sickAssistant = Number(carrier.sickRateAssistant)
  if (sickSpecialist > 0 || sickAssistant > 0) {
    const parts = []
    if (sickSpecialist > 0) parts.push(`Päd. Fachkraft ${formatEuro(sickSpecialist)}`)
    if (sickAssistant > 0) parts.push(`ohne Fachkraft ${formatEuro(sickAssistant)}`)
    rows.push({ label: 'Krankmeldung < 24 Std. (Satz)', value: parts.join(' · ') })
  }

  // Krankmeldungs-Limit pro Monat (nur bei teilweiser Vergütung relevant).
  if ((carrier.sicknessRule || 'none') === 'partial') {
    const max = sicknessMaxFor(carrier)
    rows.push({
      label: 'Krankmeldungs-Limit',
      value:
        max === Infinity
          ? 'Jede Krankmeldung < 24 Std. abrechenbar; rechtzeitige Meldungen und Folgetage nicht'
          : `max. ${max} Krankmeldungen/Monat (< 24 Std.); rechtzeitige Meldungen und Folgetage nicht abrechenbar`
    })
  }

  // Pooling-Sätze (1:2-Betreuung) der Behörde.
  const poolSpecialist = Number(carrier.poolRateSpecialist)
  const poolAssistant = Number(carrier.poolRateAssistant)
  if (poolSpecialist > 0 || poolAssistant > 0) {
    const parts = []
    if (poolSpecialist > 0) parts.push(`Fachkraft ${formatEuro(poolSpecialist)}`)
    if (poolAssistant > 0) parts.push(`Hilfskraft ${formatEuro(poolAssistant)}`)
    rows.push({ label: 'Pooling 1:2 (Satz je Std.)', value: parts.join(' · ') })
  }

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
