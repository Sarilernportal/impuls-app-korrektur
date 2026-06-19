/*
Project: Impuls Child care
Scope: Absende-Regeln für Erfassung & Nachweis (rein, testbar)

Diese Funktionen kapseln die Bedingungen, unter denen ein Formular abgesendet
werden darf. Sie sind frei von UI/Store, damit die Regeln (z. B. "Nachweis nur
mit Unterschrift") isoliert getestet werden können (tests/submitGuards.spec.js).
*/

// Sind die ausgewählten Dokus für den Nachweis grundsätzlich gültig?
// - kein nachträglich (durch Admin) erstellter Bericht
// - mindestens eine passende Auswahl (normal bzw. Sonderzeiten)
export function reportsReadyForProof({
  documents = [],
  showSpecialTimes = false,
  selectedReports = [],
  selectedSpecialReports = []
} = {}) {
  if (documents.some((report) => report && report.retrospectively)) {
    return false
  }
  if (!showSpecialTimes && selectedReports.length < 1) {
    return false
  }
  if (showSpecialTimes && selectedSpecialReports.length < 1) {
    return false
  }
  return true
}

// Darf der Nachweis abgesendet werden?
// Pflicht: Unterschrift vorhanden + Wahrheits- und Datenschutz-Bestätigung +
// gültige Auswahl. Ohne Unterschrift NIE absendbar.
export function canSubmitProof({
  signature = null,
  truthfull = false,
  gdprConfirm = false,
  ready = false
} = {}) {
  return Boolean(signature) && Boolean(truthfull) && Boolean(gdprConfirm) && Boolean(ready)
}

// Ist die erfasste Betreuungszeit positiv (Ende nach Beginn)?
export function careTimeIsPositive({
  hourFrom = 0,
  minuteFrom = 0,
  hourTo = 0,
  minuteTo = 0
} = {}) {
  const from = hourFrom + minuteFrom / 60
  const to = hourTo + minuteTo / 60
  return to - from > 0
}
