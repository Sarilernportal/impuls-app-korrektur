# Migration: SAYAS-Nachweis-Prüfstatus (Nachweiszentrale)

**Stand:** 2026-06 · **Typ:** additive Schema-Erweiterung · **Datenmigration nötig:** nein

## Hintergrund

Nachweiszentrale (`/admin/documents/timesheets`) und Abrechnungszentrale
machten fast dasselbe. Jetzt sauber getrennt:

- **Nachweiszentrale = Schritt 1:** nur Prüfen & Freigeben der Leistungs-
  nachweise (keine Rechnungserstellung mehr).
- **Abrechnungszentrale = Schritt 2:** Rechnungserstellung aus FREIGEGEBENEN
  Nachweisen.

Fluss: Fachkraft reicht ein → Nachweiszentrale prüft/gibt frei → Abrechnungs-
zentrale fakturiert.

## Was sich geändert hat (Frontend)

- Aus `TimesheetOverview.vue` entfernt: „Rechnung vorbereiten"/„Rechnungen
  öffnen", Auswahl-/Bündelungsbereich, `InvoiceCreationModal`, `createInvoice`,
  Overwrite-Stunden, die Regel-Box „Gleicher Klient und Träger" (→ in die
  Abrechnungszentrale verschoben).
- Neu: Sammelaktion „Geprüfte freigeben", pro Zeile „Öffnen / Freigeben /
  Rückfrage", Unterschriften-Ampel, Doku-Abgleich-Spalte, Hinweisbox zum
  Übergang in die Abrechnung.
- Neues Prüf-Status-Vokabular in `src/utilities/billing/review.js`
  (`REVIEW_STATUS`): `eingegangen → in_pruefung → rueckfrage → doku_fehlt →
  freigegeben`. Karten als Filter. (16 Tests in `tests/review.spec.js`.)
- Freigabe-Regel: `canRelease` nur bei vollständigen Unterschriften UND
  Doku-Abgleich ok.

## Schema-Änderung

`type TimeSheets` (additiv, nullable):

| Feld           | Typ      | Bedeutung                                                       |
| -------------- | -------- | --------------------------------------------------------------- |
| `reviewStatus` | `String` | Prüf-Status (s. o.). `freigegeben` ⇒ in Abrechnung „abrechenbar" |

`signatures` (Unterschriften-Ampel) wurde bereits früher ergänzt.

## Übergang zur Abrechnung

Ein `reviewStatus = 'freigegeben'` ist die Voraussetzung dafür, dass der
Nachweis in der Abrechnungszentrale als „abrechenbar" erscheint. Die
Abrechnungslogik (`timeSheetBillingStatus`) sollte nach dem Deploy zusätzlich
`reviewStatus === 'freigegeben'` als Bedingung für „abrechenbar" prüfen, damit
nur freigegebene Nachweise fakturiert werden (Single Source of Truth, kein
Doppelerfassen).

## Frontend-Anbindung (nach `amplify push` + `amplify codegen`)

Heute werden Freigabe/Rückfrage in der UI lokal gehalten (frontend-first).
Nach dem Deploy:

1. `release()` / `query()` in `TimesheetOverview.vue` auf einen Store-Dispatch
   legen, der `TimeSheets.reviewStatus` setzt (`freigegeben` bzw. `rueckfrage`).
2. In `timeSheetBillingStatus` (`billing.js`) `reviewStatus === 'freigegeben'`
   als Voraussetzung für `ABRECHENBAR` ergänzen.

## Pooling

Der Doku-Abgleich ist je Nachweis vorgesehen; bei mehreren Kindern (Pooling)
ist je Kind eine eigene Doku zu prüfen. Datenmodell ist dafür nicht verbaut
(n:m über CareAssignment); Details siehe `docs/sayas-pooling.md`.

## Sicherheit / Auth

Keine Änderung an `@auth`-Regeln.
