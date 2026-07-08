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

/*
Stundensatz des Kostenträgers: Behörden hinterlegen IMMER ZWEI Sätze –
„mit Päd. Fachkraft" und „ohne Fachkraft" (Hilfskraft). Welcher gilt,
entscheidet der Fachkraft-Status des eingesetzten Betreuers. Fallback ist
der alte Einzelsatz (defaultHourlyRate), solange nur der gepflegt ist.
*/
export function carrierRateFor(carrier, guardian = null) {
  const professional = guardian?.professional !== false
  const specific = professional
    ? positiveOrNull(carrier?.hourlyRateSpecialist)
    : positiveOrNull(carrier?.hourlyRateAssistant)
  return specific ?? positiveOrNull(carrier?.defaultHourlyRate)
}

/*
Krankmeldungs-Satz (< 24 Std.) der Behörde: manche Ämter (z. B. Groß-Gerau,
SGB VIII + IX) vergüten kurzfristige Krankmeldungen mit einem eigenen
ABSOLUTEN Stundensatz je Fachkraft-Status (Fachkraft 42,91 € / Hilfskraft
29,71 €) statt prozentual. null = kein eigener Satz hinterlegt → dann gilt
die prozentuale Regel (Default 30 %, max. 3 Meldungen/Monat).
*/
export function sickRateFor(carrier, guardian = null) {
  const professional = guardian?.professional !== false
  return professional
    ? positiveOrNull(carrier?.sickRateSpecialist)
    : positiveOrNull(carrier?.sickRateAssistant)
}

/*
Pooling-Satz (1:2-Betreuung) der Behörde je Fachkraft-Status
(Groß-Gerau: Fachkraft 75,49 € / Hilfskraft 52,70 €). null = nicht hinterlegt.
*/
export function poolRateFor(carrier, guardian = null) {
  const professional = guardian?.professional !== false
  return professional
    ? positiveOrNull(carrier?.poolRateSpecialist)
    : positiveOrNull(carrier?.poolRateAssistant)
}

/*
Liefert den anzuwendenden Stundensatz. Quellen: Fallakte (Bescheid),
Betreuer (Vergütung) und Kostenträger (zwei Sätze: mit/ohne Fachkraft).
Welche Quelle Vorrang hat, ist je Jugendamt konfigurierbar über den
Regelsatz (rules.rateSource):
  'case'     → Fallakte > Betreuer > Kostenträger   (Default)
  'guardian' → Betreuer > Fallakte > Kostenträger
Es wird jeweils der erste positive, gültige Satz genommen.
*/
export function hourlyRateFor(child, carrier, guardian = null, rules = null) {
  const caseRate = positiveOrNull(child?.hourlyRate)
  const guardianRate = positiveOrNull(guardian?.hourlyRate)
  const carrierRate = carrierRateFor(carrier, guardian)

  const source = (rules && rules.rateSource) || 'case'
  const order =
    source === 'guardian'
      ? [guardianRate, caseRate, carrierRate]
      : [caseRate, guardianRate, carrierRate]

  return order.find((rate) => rate !== null) ?? null
}

function positiveOrNull(value) {
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? n : null
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

  // Quelle des Abrechnungs-Stundensatzes: 'case' (Fallakte zuerst) oder
  // 'guardian' (Betreuer-Vergütung zuerst). Je Jugendamt überschreibbar.
  rateSource: 'case',

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
