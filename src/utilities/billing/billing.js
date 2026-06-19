/*
Project: Impuls Child care
Scope: Abrechnungs-Kernlogik (rein, testbar)

Diese Funktionen bestimmen, ob/welcher Status ein Nachweis bzw. eine Rechnung
hat und berechnen die geleisteten Stunden. Sie sind bewusst frei von UI/Store,
damit sie isoliert getestet werden können (siehe tests/billing.spec.js).
*/

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

// Ist ein Nachweis abrechenbar? (kein Sonderzeit-Nachweis, hat Dokus,
// nichts in Prüfung, noch nicht abgerechnet)
export function canInvoiceTimeSheet(timeSheet) {
  return (
    timeSheet.reportType !== 'special' &&
    dailyReportItems(timeSheet).length > 0 &&
    !hasReviseReport(timeSheet) &&
    !hasInvoicedReport(timeSheet)
  )
}

// Status eines Nachweises für die Anzeige.
export function timeSheetStatus(timeSheet) {
  if (hasInvoicedReport(timeSheet)) {
    return { label: 'abgerechnet', badgeClass: 'bg-orange-100 text-orange-700' }
  }
  if (hasReviseReport(timeSheet)) {
    return { label: 'in Prüfung', badgeClass: 'bg-sky-100 text-sky-700' }
  }
  if (dailyReportItems(timeSheet).length === 0) {
    return { label: 'Doku fehlt', badgeClass: 'bg-orange-100 text-orange-700' }
  }
  return { label: 'bereit', badgeClass: 'bg-emerald-100 text-emerald-700' }
}

// Status einer Rechnung für die Anzeige.
export function invoiceStatus(invoice) {
  if (invoice.charged) {
    return { label: 'bezahlt', badgeClass: 'bg-orange-100 text-orange-700' }
  }
  if (hasReviseReport(invoice)) {
    return { label: 'Rückfrage', badgeClass: 'bg-amber-100 text-amber-700' }
  }
  return {
    label: invoice.internalNumber ? 'versandbereit' : 'GF-Prüfung',
    badgeClass: invoice.internalNumber
      ? 'bg-emerald-100 text-emerald-700'
      : 'bg-sky-100 text-sky-700'
  }
}

// Summiert die geleisteten Stunden aus einer Liste von Dokus und gibt sie als
// "Xh Ym" zurück. Negative Zeitspannen werden als 0 gewertet.
export function hoursWorked(reports) {
  const workedHours = (reports || []).reduce((total, report) => {
    if (typeof report.hourFrom !== 'number' || typeof report.hourTo !== 'number') {
      return total
    }
    const minuteFrom = report.minuteFrom || 0
    const minuteTo = report.minuteTo || 0
    const timeFrom = report.hourFrom + minuteFrom / 60
    const timeTo = report.hourTo + minuteTo / 60
    return total + Math.max(timeTo - timeFrom, 0)
  }, 0)

  const hours = Math.floor(workedHours)
  const minutes = Math.round((workedHours % 1) * 60)
  return `${hours}h ${minutes}m`
}
