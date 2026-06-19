/*
Project: Impuls / SAYAS – Schulbegleitung / Teilhabeassistenz (§ 35a SGB VIII)
Scope: Stunden- und Betragsberechnung der Abrechnung

WICHTIG zum Modell:
- Bewilligung ist WÖCHENTLICH (h/Woche aus dem Bescheid, an der Fallakte).
- Abrechnung läuft MONATLICH.
- "Soll" (Monatsdeckel) ist NICHT Wochen × 4, sondern ergibt sich aus den
  tatsächlichen Schultagen im Abrechnungsmonat (abzüglich Feiertage/Ferien) ×
  Stunden pro Tag. Das erfordert einen hinterlegten Schul-/Ferienkalender je
  Bundesland/Schule.
- "Geleistet" kommt aus den monatlichen Leistungsnachweisen.
- "Überhang" und "Abrechenbar" werden BERECHNET, nicht eingegeben – außer bei
  manueller Korrektur (dann mit Begründung gespeichert).

STRATEGIE-PATTERN: Die konkreten Rechenregeln (Soll über Schultage,
Krankheits-Vergütung, Stundenpool/Übertrag) sind je Jugendamt unterschiedlich
und werden NACHGELIEFERT. Deshalb sind sie hier als austauschbare Regelsätze
angelegt und NICHT fest verdrahtet. Der Default markiert sein Soll-Ergebnis
ausdrücklich als `provisional`, solange kein Schulkalender hinterlegt ist.
*/

// ──────────────────────────────────────────────────────────────────────────
// Stunden aus Leistungsnachweisen
// ──────────────────────────────────────────────────────────────────────────

// Summiert die geleisteten Stunden (Dezimal) aus einer Liste von Tages-Dokus.
// Negative Zeitspannen werden als 0 gewertet.
export function workedHoursDecimal(reports) {
  return (reports || []).reduce((total, report) => {
    if (
      typeof report.hourFrom !== 'number' ||
      typeof report.hourTo !== 'number'
    ) {
      return total
    }
    const minuteFrom = report.minuteFrom || 0
    const minuteTo = report.minuteTo || 0
    const timeFrom = report.hourFrom + minuteFrom / 60
    const timeTo = report.hourTo + minuteTo / 60
    return total + Math.max(timeTo - timeFrom, 0)
  }, 0)
}

// ──────────────────────────────────────────────────────────────────────────
// Stundensatz: Fallakte (Bescheid) zuerst, sonst Default vom Jugendamt/Träger
// ──────────────────────────────────────────────────────────────────────────

export function hourlyRateFor(child, carrier) {
  const fromChild = Number(child?.hourlyRate)
  if (Number.isFinite(fromChild) && fromChild > 0) return fromChild
  const fromCarrier = Number(carrier?.defaultHourlyRate)
  if (Number.isFinite(fromCarrier) && fromCarrier > 0) return fromCarrier
  return null
}

// ──────────────────────────────────────────────────────────────────────────
// Regelsätze je Jugendamt (Strategie-Pattern) – konkrete Regeln folgen
// ──────────────────────────────────────────────────────────────────────────

/*
Ein Regelsatz beschreibt die amtsspezifische Berechnung. Methoden bekommen
einen Kontext und liefern Werte. Solange keine Detailregeln vorliegen, bleiben
Default-Implementierungen bewusst konservativ und kennzeichnen Schätzungen.
*/
export const defaultBillingRules = Object.freeze({
  key: 'default',
  label: 'Standard (vorläufig – Detailregeln folgen)',

  // Soll-Monatsdeckel. ctx: { weeklyHours, hoursPerSchoolDay, schoolDays,
  // monthWeeks }. Liefert { hours, provisional, basis }.
  computeSoll(ctx = {}) {
    const { weeklyHours, hoursPerSchoolDay, schoolDays, monthWeeks } = ctx

    // Bevorzugt: tatsächliche Schultage × Stunden/Schultag (sobald ein
    // Schul-/Ferienkalender Schultage liefert).
    if (
      Number.isFinite(schoolDays) &&
      Number.isFinite(hoursPerSchoolDay) &&
      schoolDays >= 0
    ) {
      return {
        hours: round2(schoolDays * hoursPerSchoolDay),
        provisional: false,
        basis: 'schultage'
      }
    }

    // Fallback ohne Kalender: vorläufige Näherung über die Wochen im Monat –
    // ausdrücklich als provisorisch markiert, NICHT als feste Regel gedacht.
    if (Number.isFinite(weeklyHours) && Number.isFinite(monthWeeks)) {
      return {
        hours: round2(weeklyHours * monthWeeks),
        provisional: true,
        basis: 'naeherung_wochen'
      }
    }

    return { hours: null, provisional: true, basis: 'unbekannt' }
  },

  // Krankheits-Vergütung des Kindes: je Amt nicht/teilweise/voll. Default:
  // keine Annahme (0 vergütete Ausfallstunden), bis Regel geliefert wird.
  sicknessCompensation() {
    return { compensatedHours: 0, configured: false }
  },

  // Stundenpool/Übertrag: Default ohne Übertrag, bis Regel geliefert wird.
  poolPolicy: Object.freeze({ carryOver: false, cap: null, configured: false })
})

// Registry: hier später weitere amtsspezifische Regelsätze registrieren.
export const BILLING_RULE_SETS = Object.freeze({
  default: defaultBillingRules
})

// Liefert den Regelsatz für einen Träger/Kostenträger (Fallback: default).
export function billingRulesFor(carrier) {
  const key = carrier?.billingRuleSet
  return BILLING_RULE_SETS[key] || defaultBillingRules
}

// ──────────────────────────────────────────────────────────────────────────
// Überhang / Abrechenbar / Betrag
// ──────────────────────────────────────────────────────────────────────────

// Überhang = geleistet − Soll, nur wenn positiv (sonst 0).
export function computeOverhang(workedHours, sollHours) {
  if (!Number.isFinite(workedHours) || !Number.isFinite(sollHours)) return 0
  return round2(Math.max(workedHours - sollHours, 0))
}

/*
Abrechenbare Stunden. Standard: auf das Soll gedeckelt = min(geleistet, soll).
Eine Korrektur kann das überschreiben:
  { mode: 'cap' }                       → nur Soll (Default)
  { mode: 'release', releasedHours: n } → Soll + freigegebene Überhang-Stunden
  { mode: 'carryover' }                 → nur Soll (Rest wandert in Folgemonat)
*/
export function computeBillableHours(workedHours, sollHours, correction = null) {
  if (!Number.isFinite(workedHours)) return 0
  // Ohne bekanntes Soll ist (noch) nichts gedeckelt → geleistete Stunden.
  if (!Number.isFinite(sollHours)) return round2(workedHours)

  const capped = Math.min(workedHours, sollHours)
  if (!correction) return round2(capped)

  if (correction.mode === 'release') {
    const released = Number(correction.releasedHours) || 0
    const overhang = Math.max(workedHours - sollHours, 0)
    return round2(sollHours + Math.min(Math.max(released, 0), overhang))
  }
  // 'cap' und 'carryover' rechnen beide nur das Soll ab.
  return round2(capped)
}

// Betrag = abrechenbare Stunden × Stundensatz. Ohne Satz → null.
export function computeAmount(billableHours, hourlyRate) {
  if (!Number.isFinite(billableHours) || !Number.isFinite(hourlyRate)) {
    return null
  }
  return round2(billableHours * hourlyRate)
}

// ──────────────────────────────────────────────────────────────────────────
// Formatierung
// ──────────────────────────────────────────────────────────────────────────

// "Xh Ym" aus Dezimalstunden (oder "–" wenn unbekannt).
export function formatHours(decimalHours) {
  if (!Number.isFinite(decimalHours)) return '–'
  const hours = Math.floor(decimalHours)
  const minutes = Math.round((decimalHours % 1) * 60)
  return minutes === 0 ? `${hours} h` : `${hours} h ${minutes} m`
}

// Euro-Betrag in de-DE (oder "–" wenn unbekannt).
export function formatEuro(amount) {
  if (!Number.isFinite(amount)) return '–'
  return amount.toLocaleString('de-DE', {
    style: 'currency',
    currency: 'EUR'
  })
}

function round2(value) {
  return Math.round(value * 100) / 100
}
