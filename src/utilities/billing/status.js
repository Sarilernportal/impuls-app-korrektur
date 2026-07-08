/*
Project: Impuls / SAYAS – Schulbegleitung / Teilhabeassistenz (§ 35a SGB VIII)
Scope: Einheitliches Status-Vokabular für die Abrechnung

EINE zentrale Quelle für alle Abrechnungs-Status. Karten, Tabelle und Badges
verwenden ausschließlich diese Begriffe, Reihenfolge und Farben – kein
abweichendes Vokabular mehr ("Päd.", "versandbereit", "GF-Prüfung" entfallen).

Ablauf:
  doku_offen → nachweis_pruefen → abrechenbar → rechnung_erstellt
            → offen_unbezahlt → bezahlt
"ueberhang" ist ein abzweigender Sonderzustand von "abrechenbar".
*/

// Kanonischer Status-Enum (Werte = stabile Keys, auch für Persistenz nutzbar).
export const BILLING_STATUS = Object.freeze({
  DOKU_OFFEN: 'doku_offen',
  NACHWEIS_PRUEFEN: 'nachweis_pruefen',
  ABRECHENBAR: 'abrechenbar',
  UEBERHANG: 'ueberhang',
  RECHNUNG_ERSTELLT: 'rechnung_erstellt',
  OFFEN_UNBEZAHLT: 'offen_unbezahlt',
  BEZAHLT: 'bezahlt'
})

// Anzeige-Metadaten je Status: Label, Badge-Farben und Reihenfolge im Ablauf.
// order dient zum Sortieren/Stufen; ueberhang teilt sich die Stufe mit abrechenbar.
export const STATUS_META = Object.freeze({
  [BILLING_STATUS.DOKU_OFFEN]: {
    label: 'Doku offen',
    short: 'Doku offen',
    badgeClass: 'bg-orange-100 text-orange-700',
    cardClass: 'bg-orange-100 text-orange-700',
    order: 1
  },
  [BILLING_STATUS.NACHWEIS_PRUEFEN]: {
    label: 'Nachweis prüfen',
    short: 'Nachweis prüfen',
    badgeClass: 'bg-sky-100 text-sky-700',
    cardClass: 'bg-sky-100 text-sky-700',
    order: 2
  },
  [BILLING_STATUS.ABRECHENBAR]: {
    label: 'Abrechenbar',
    short: 'Abrechenbar',
    badgeClass: 'bg-emerald-100 text-emerald-700',
    cardClass: 'bg-emerald-100 text-emerald-700',
    order: 3
  },
  [BILLING_STATUS.UEBERHANG]: {
    label: 'Überhang',
    short: 'Überhang',
    badgeClass: 'bg-amber-100 text-amber-700',
    cardClass: 'bg-amber-100 text-amber-700',
    order: 3
  },
  [BILLING_STATUS.RECHNUNG_ERSTELLT]: {
    label: 'Rechnung erstellt',
    short: 'Rechnung erstellt',
    badgeClass: 'bg-blue-100 text-blue-700',
    cardClass: 'bg-blue-100 text-blue-700',
    order: 4
  },
  [BILLING_STATUS.OFFEN_UNBEZAHLT]: {
    label: 'Offen / unbezahlt',
    short: 'Offen / unbezahlt',
    badgeClass: 'bg-amber-100 text-amber-700',
    cardClass: 'bg-amber-100 text-amber-700',
    order: 5
  },
  [BILLING_STATUS.BEZAHLT]: {
    label: 'Bezahlt',
    short: 'Bezahlt',
    badgeClass: 'bg-slate-100 text-slate-600',
    cardClass: 'bg-slate-100 text-slate-600',
    order: 6
  }
})

// Reihenfolge der Filter-Karten oben in der Abrechnungszentrale.
export const STATUS_CARD_ORDER = Object.freeze([
  BILLING_STATUS.DOKU_OFFEN,
  BILLING_STATUS.NACHWEIS_PRUEFEN,
  BILLING_STATUS.ABRECHENBAR,
  BILLING_STATUS.RECHNUNG_ERSTELLT,
  BILLING_STATUS.OFFEN_UNBEZAHLT
])

// Liefert die Anzeige-Metadaten zu einem Status (mit sicherem Fallback).
export function statusMeta(status) {
  return (
    STATUS_META[status] || {
      label: 'Unbekannt',
      short: 'Unbekannt',
      badgeClass: 'bg-slate-100 text-slate-600',
      cardClass: 'bg-slate-100 text-slate-600',
      order: 0
    }
  )
}
