/*
Project: Impuls / SAYAS – Schulbegleitung / Teilhabeassistenz (§ 35a SGB VIII)
Scope: Prüf-Lebenszyklus der Nachweiszentrale (Prüfen & Freigeben)

Bewusst getrennt vom Abrechnungs-Status (status.js). Die Nachweiszentrale
prüft und gibt Leistungsnachweise frei; die Abrechnung passiert danach in der
Abrechnungszentrale. Ein FREIGEGEBENER Nachweis erscheint dort automatisch als
"abrechenbar".

Ablauf: eingegangen → in_pruefung → rueckfrage → doku_fehlt → freigegeben
*/

import { dailyReportItems, hasReviseReport } from './billing.js'
import { signatureStatus, signaturesComplete } from './signatures.js'

export const REVIEW_STATUS = Object.freeze({
  EINGEGANGEN: 'eingegangen',
  IN_PRUEFUNG: 'in_pruefung',
  RUECKFRAGE: 'rueckfrage',
  DOKU_FEHLT: 'doku_fehlt',
  FREIGEGEBEN: 'freigegeben'
})

export const REVIEW_META = Object.freeze({
  [REVIEW_STATUS.EINGEGANGEN]: {
    label: 'Eingegangen',
    badgeClass: 'bg-sky-100 text-sky-700',
    cardClass: 'bg-sky-100 text-sky-700'
  },
  [REVIEW_STATUS.IN_PRUEFUNG]: {
    label: 'In Prüfung',
    badgeClass: 'bg-blue-100 text-blue-700',
    cardClass: 'bg-blue-100 text-blue-700'
  },
  [REVIEW_STATUS.RUECKFRAGE]: {
    label: 'Rückfrage offen',
    badgeClass: 'bg-amber-100 text-amber-700',
    cardClass: 'bg-amber-100 text-amber-700'
  },
  [REVIEW_STATUS.DOKU_FEHLT]: {
    label: 'Doku fehlt',
    badgeClass: 'bg-orange-100 text-orange-700',
    cardClass: 'bg-orange-100 text-orange-700'
  },
  [REVIEW_STATUS.FREIGEGEBEN]: {
    label: 'Freigegeben',
    badgeClass: 'bg-emerald-100 text-emerald-700',
    cardClass: 'bg-emerald-100 text-emerald-700'
  }
})

export const REVIEW_CARD_ORDER = Object.freeze([
  REVIEW_STATUS.EINGEGANGEN,
  REVIEW_STATUS.IN_PRUEFUNG,
  REVIEW_STATUS.RUECKFRAGE,
  REVIEW_STATUS.DOKU_FEHLT,
  REVIEW_STATUS.FREIGEGEBEN
])

export function reviewMeta(status) {
  return (
    REVIEW_META[status] || {
      label: 'Unbekannt',
      badgeClass: 'bg-slate-100 text-slate-600',
      cardClass: 'bg-slate-100 text-slate-600'
    }
  )
}

/*
Doku-Abgleich: Ist die passende Dokumentation zum Nachweis vorhanden?
Pooling-Hinweis: Bei mehreren Kindern muss je Kind eine eigene Doku geprüft
werden – das Modell unterstützt das über die Liste der Tages-Dokus; die
kindgenaue Aufschlüsselung wird ergänzt, sobald Pooling umgesetzt ist.
→ { ok: boolean, label: string }
*/
export function docMatch(timeSheet) {
  const items = dailyReportItems(timeSheet)
  if (items.length === 0) return { ok: false, label: 'keine Doku' }
  if (hasReviseReport(timeSheet)) return { ok: false, label: 'Rückfrage' }
  return { ok: true, label: `${items.length} Doku${items.length === 1 ? '' : 's'}` }
}

/*
Bestimmt den Prüf-Status eines Nachweises.
overrides: { released?: boolean, queried?: boolean } für UI-Aktionen, solange
kein persistiertes reviewStatus-Feld vorliegt (frontend-first).
*/
export function reviewStatus(timeSheet, overrides = {}) {
  if (overrides.released) return REVIEW_STATUS.FREIGEGEBEN
  if (overrides.queried) return REVIEW_STATUS.RUECKFRAGE

  // Persistiertes Feld (nach Backend-Erweiterung) hat Vorrang.
  if (timeSheet.reviewStatus && REVIEW_META[timeSheet.reviewStatus]) {
    return timeSheet.reviewStatus
  }

  if (dailyReportItems(timeSheet).length === 0) return REVIEW_STATUS.DOKU_FEHLT
  if (hasReviseReport(timeSheet)) return REVIEW_STATUS.RUECKFRAGE
  if (!signaturesComplete(timeSheet)) return REVIEW_STATUS.IN_PRUEFUNG
  return REVIEW_STATUS.EINGEGANGEN
}

// Freigabe nur, wenn Unterschriften vollständig UND Doku-Abgleich ok.
export function canRelease(timeSheet, overrides = {}) {
  if (overrides.released) return false
  return signaturesComplete(timeSheet) && docMatch(timeSheet).ok
}

// Liefert den Unterschriften-Status (Ampel) durch.
export function reviewSignatures(timeSheet) {
  return signatureStatus(timeSheet)
}
