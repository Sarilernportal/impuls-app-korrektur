# Migration: SAYAS-Abrechnungsfelder (§ 35a SGB VIII)

**Stand:** 2026-06 · **Typ:** additive Schema-Erweiterung · **Datenmigration nötig:** nein

## Hintergrund

Überarbeitung der Abrechnungszentrale (`/admin/billing`) gemäß SAYAS-Auftrag:
einheitliches Status-Vokabular, klickbare Filter-Karten, THA-/§-35a-Spalten
(h/Woche, Soll, Geleistet, Überhang, Abrechenbar, Betrag), Unterschriften-Ampel,
Überhang-Korrektur, Sammelabrechnung und Gruppierung pro Klient.

Die komplette Stunden-/Betragslogik liegt **frontend-first** als reine, getestete
Module vor. Diese Migration ergänzt das Datenmodell um die Felder, damit
Stundensatz, Unterschriften und Korrekturen persistiert werden können. Alle
neuen Felder sind **nullable / additiv** – kein Backfill (DynamoDB schemalos).

## Neue Logik-Module (kein Deploy nötig, bereits aktiv)

| Datei                                  | Inhalt                                                            |
| -------------------------------------- | ----------------------------------------------------------------- |
| `src/utilities/billing/status.js`      | EIN Status-Enum `BILLING_STATUS` + Labels/Farben (Karten & Badges)|
| `src/utilities/billing/calculation.js` | Stundensatz, Soll/Überhang/Abrechenbar/Betrag, Regelsätze je Amt  |
| `src/utilities/billing/signatures.js`  | Unterschriften-Ampel (Eltern/Schule/Fachkraft)                    |
| `src/utilities/billing/rows.js`        | Zusammenbau einer Abrechnungszeile aus Nachweis/Rechnung          |
| `src/utilities/billing/billing.js`     | erweitert: `timeSheetBillingStatus`, `invoiceBillingStatus`       |

Status-Ablauf (überall identisch):
`doku_offen → nachweis_pruefen → abrechenbar → rechnung_erstellt → offen_unbezahlt → bezahlt`
(`ueberhang` zweigt von `abrechenbar` ab).

## Strategie-Pattern für amtsspezifische Regeln (Details folgen)

Die noch offenen Regeln sind als austauschbare **Regelsätze je Jugendamt**
angelegt und NICHT fest verdrahtet (`BILLING_RULE_SETS` in `calculation.js`,
Auswahl über `Carrier.billingRuleSet`):

- **Soll über Schultage**: `defaultBillingRules.computeSoll()` rechnet
  `Schultage × Stunden/Schultag`, sobald ein Schul-/Ferienkalender Schultage
  liefert. Ohne Kalender liefert sie eine als `provisional` markierte Näherung
  (in der UI mit „*" gekennzeichnet).
- **Krankheits-Vergütung**: `sicknessCompensation()` – Default ohne Annahme.
- **Stundenpool/Übertrag**: `poolPolicy` – Default ohne Übertrag.

Sobald die Detailregeln vorliegen, je Amt einen Regelsatz in `BILLING_RULE_SETS`
registrieren – kein UI-Umbau nötig.

## Schema-Änderungen

Datei: `amplify/backend/api/ChildCareAPI/schema.graphql`

### `type Child`
| Feld         | Typ     | Bedeutung                                              |
| ------------ | ------- | ------------------------------------------------------ |
| `hourlyRate` | `Float` | Stundensatz aus Bescheid (Vorrang vor Träger-Default)  |

### `type Carrier`
| Feld                | Typ      | Bedeutung                                          |
| ------------------- | -------- | -------------------------------------------------- |
| `defaultHourlyRate` | `Float`  | Standard-Stundensatz des Kostenträgers             |
| `billingRuleSet`    | `String` | Schlüssel des amtsspezifischen Regelsatzes         |

### `type TimeSheets`
| Feld                 | Typ                 | Bedeutung                                  |
| -------------------- | ------------------- | ------------------------------------------ |
| `signatures`         | `SignatureSet`      | Unterschriften-Ampel des Nachweises        |
| `overhangCorrection` | `OverhangCorrection`| Überhang-Korrektur mit Protokoll           |

### `type Invoices`
| Feld                 | Typ                 | Bedeutung                                  |
| -------------------- | ------------------- | ------------------------------------------ |
| `billableHours`      | `Float`             | abgerechnete Stunden                       |
| `amount`             | `Float`             | abgerechneter Betrag                       |
| `overhangCorrection` | `OverhangCorrection`| Rechnungskorrektur mit Protokoll           |

### Neue eingebettete Typen
- `SignatureSet { parent, parentAt, school, schoolAt, professional, professionalAt }`
- `OverhangCorrection { mode, releasedHours, reason, correctedBy, correctedAt }`
  (`mode`: `cap` | `release` | `carryover`)

## Deployment durch das Team

```bash
amplify push      # Schema-Änderungen deployen
amplify codegen   # src/graphql/* an die neuen Felder anpassen
```

## Frontend-Anbindung (Folgeschritt nach erfolgreichem `amplify push`)

Die UI rechnet bereits vollständig; angebunden werden müssen nach dem Deploy:

1. **Stundensatz**: `Child.hourlyRate` / `Carrier.defaultHourlyRate` in die
   Lade-Selection-Sets aufnehmen (heute über Demo-Daten gefüllt). `hourlyRateFor`
   liest sie dann automatisch.
2. **Unterschriften**: `TimeSheets.signatures` beim Einreichen/Prüfen setzen.
   Bis dahin greift der Fallback (Fachkraft aus `signatureImage`).
3. **Überhang-Korrektur**: In `BillingCenter.vue → applyCorrection` zusätzlich
   `store.dispatch` auf eine neue Action `saveOverhangCorrection` legen, die
   `overhangCorrection` am Nachweis/an der Rechnung speichert (inkl. `correctedBy`
   = aktueller Admin, `correctedAt`).
4. **Sammelabrechnung**: In `confirmBatch` je Kostenträger-Gruppe die bestehende
   `createInvoice`-Action aufrufen (Nachweise gebündelt übergeben) statt nur die
   Erfolgsmeldung anzuzeigen.

## Sicherheit / Auth

Keine Änderung an den `@auth`-Regeln. Neue Felder erben die Regeln ihres Typs.
