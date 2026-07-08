/*
Project: Impuls Child care
Scope: Abrechnungs-Kernlogik (rein, testbar)

Diese Funktionen bestimmen, ob/welcher Status ein Nachweis bzw. eine Rechnung
hat und berechnen die geleisteten Stunden. Sie sind bewusst frei von UI/Store,
damit sie isoliert getestet werden können (siehe tests/billing.spec.js).

Der Anzeige-Status nutzt ausschließlich das einheitliche Vokabular aus
status.js (BILLING_STATUS) – siehe SAYAS-Auftrag „einheitliches Status-Enum".
*/

import { BILLING_STATUS } from './status.js'
import { signaturesComplete } from './signatures.js'

// Liefert die verknüpften Tages-Dokumentationen eines Dokuments (oder []).
export function dailyReportItems(document) {
  return document?.dailyReport?.items || []
}

// Enthält das Dokument eine zur Überarbeitung markierte Doku?
export function hasReviseReport(document) {
  return dailyReportItems(document).some((report) => report.flag === 'revise')
}

// Wurde bereits eine der Dokus abgerechnet?
export function hasInvoicedReport(document) {
  return dailyReportItems(document).some((report) => report.charged)
}

// Ist ein Nachweis grundsätzlich abrechenbar? (kein Sonderzeit-Nachweis, hat
// Dokus, nichts in Prüfung, noch nicht abgerechnet). Die Unterschriften-Prüfung
// erfolgt zusätzlich über den Status (siehe timeSheetBillingStatus).
export function canInvoiceTimeSheet(timeSheet) {
  return (
    timeSheet.reportType !== 'special' &&
    dailyReportItems(timeSheet).length > 0 &&
    !hasReviseReport(timeSheet) &&
    !hasInvoicedReport(timeSheet)
  )
}

/*
Einheitlicher Abrechnungs-Status eines Nachweises (timeSheet).
Validierungsregel (SAYAS Punkt 6): "abrechenbar" nur bei vorhandener Doku UND
allen nötigen Unterschriften; sonst "Nachweis prüfen". Liegt geleistet über
dem Soll, wird "Überhang" gemeldet.
ctx: { hasOverhang?: boolean }
*/
export function timeSheetBillingStatus(timeSheet, ctx = {}) {
  if (hasInvoicedReport(timeSheet)) return BILLING_STATUS.RECHNUNG_ERSTELLT
  if (dailyReportItems(timeSheet).length === 0) return BILLING_STATUS.DOKU_OFFEN
  if (hasReviseReport(timeSheet)) return BILLING_STATUS.NACHWEIS_PRUEFEN
  if (!signaturesComplete(timeSheet)) return BILLING_STATUS.NACHWEIS_PRUEFEN
  if (ctx.hasOverhang) return BILLING_STATUS.UEBERHANG
  return BILLING_STATUS.ABRECHENBAR
}

// Einheitlicher Status einer Rechnung im selben Vokabular.
// erstellt → offen/unbezahlt (versendet) → bezahlt.
export function invoiceBillingStatus(invoice) {
  if (invoice.charged) return BILLING_STATUS.BEZAHLT
  if (invoice.transmitted) return BILLING_STATUS.OFFEN_UNBEZAHLT
  return BILLING_STATUS.RECHNUNG_ERSTELLT
}
