# Migration: SAYAS-Kostenträger-Felder (Jugendamt, § 35a SGB VIII)

**Stand:** 2026-06 · **Typ:** additive Schema-Erweiterung · **Datenmigration nötig:** nein

## Hintergrund

Überarbeitung des Formulars „Träger hinzufügen" (`/admin/carrier/add-carrier`)
zu **„Kostenträger / Jugendamt"** (Rechnungsempfänger). UI-Änderungen
(`NewCarrierForm.vue`, `NewCarrier.vue`):

- Begriff „Kostenträger / Jugendamt" (Name bleibt = Institution).
- Adress-Übernahme-Checkbox „Rechnungsadresse entspricht Hauptadresse"
  (Default aktiv) – Rechnungsadressfelder erscheinen nur bei Abweichung.
- Kompakte Adressfelder „Straße & Hausnr." und „PLZ & Stadt" (werden beim
  Speichern in die bestehenden Einzel-Keys geparst – Speicherweg unverändert).
- Abschnitt Rechnungskontakt/Buchhaltung (allgemein, **kein** fallbezogener
  Sachbearbeiter – der bleibt am Klienten/in der Fallakte).
- Abschnitt Rechnung & E-Rechnung (Leitweg-ID, Debitorennr., Zahlungsziel, USt-ID).
- Abschnitt Abrechnungsregeln je Amt (nur Felder, Logik folgt).

Neue Felder werden frontend-first erfasst; diese Migration ergänzt das
Datenmodell. Alle Felder **nullable/additiv** – kein Backfill.

## Schema-Änderungen

Datei: `amplify/backend/api/ChildCareAPI/schema.graphql`, `type Carrier`

| Feld                | Typ      | Bedeutung                                              |
| ------------------- | -------- | ------------------------------------------------------ |
| `carrierType`       | `String` | Jugendamt / Sozialamt-EGH / Sonstiger                  |
| `billingContactName`| `String` | Rechnungs-/Buchhaltungskontakt (Name)                  |
| `leitwegId`         | `String` | Leitweg-ID für XRechnung/E-Rechnung                    |
| `debtorNumber`      | `String` | Debitoren-/Kundennummer                                |
| `paymentTermDays`   | `Int`    | Zahlungsziel in Tagen                                  |
| `vatId`             | `String` | USt-ID / Steuernummer                                  |
| `sicknessRule`      | `String` | Krankheit Kind: none / partial / full                  |
| `poolRule`          | `String` | Stundenpool: none / carryover                          |
| `sollRule`          | `String` | Soll-Berechnung: schooldays                            |

**Ergänzung 2026-07 (zwei Stundensätze + Krankheits-% je Behörde):**

| Feld                   | Typ     | Bedeutung                                                    |
| ---------------------- | ------- | ------------------------------------------------------------ |
| `hourlyRateSpecialist` | `Float` | Stundensatz **mit** Päd. Fachkraft                            |
| `hourlyRateAssistant`  | `Float` | Stundensatz **ohne** Fachkraft (Päd. Hilfskraft)              |
| `sicknessPercent`      | `Float` | %-Satz bei `sicknessRule=partial` (je Behörde; Default 30)    |

Jede Behörde hinterlegt IMMER ZWEI Sätze. Welcher greift, entscheidet der
Fachkraft-Status des eingesetzten Betreuers (`Guardian.professional`) –
Auswahl-Logik: `carrierRateFor(carrier, guardian)` in
`src/utilities/billing/calculation.js`. `defaultHourlyRate` bleibt als
Alt-Feld/Fallback bestehen.

**Ergänzung 2026-07 (Krankmeldungs-/Pooling-Sätze + Monatslimit):**

| Feld                  | Typ     | Bedeutung                                                       |
| --------------------- | ------- | ---------------------------------------------------------------- |
| `sickRateSpecialist`  | `Float` | Krankmeldung < 24 Std., Satz **mit** Fachkraft (GG: 42,91 €)      |
| `sickRateAssistant`   | `Float` | Krankmeldung < 24 Std., Satz **ohne** Fachkraft (GG: 29,71 €)     |
| `sicknessMaxPerMonth` | `Int`   | abrechenbare Krankmeldungen/Monat (null = allg. Regel: max. 3)    |
| `poolRateSpecialist`  | `Float` | Pooling 1:2, Satz **mit** Fachkraft (GG: 75,49 €)                 |
| `poolRateAssistant`   | `Float` | Pooling 1:2, Satz **ohne** Fachkraft (GG: 52,70 €)                |

Referenzwerte Groß-Gerau (SGB VIII + IX): Stundensätze Fachkraft 55,51 € /
Hilfskraft 38,75 €. Allgemeine Krankheitsregel (ohne eigenen Satz): max. 3
kurzfristige Krankmeldungen (< 24 Std.) pro Monat à 30 % des Stundensatzes;
rechtzeitige Krankmeldungen und Folgetage werden nicht abgerechnet
(`SICKNESS_DEFAULT_MAX_PER_MONTH` und `sicknessMaxFor()` in
`src/utilities/billing/invoiceView.js`; eigener Satz: `sickRateFor()`,
Pooling: `poolRateFor()` in `calculation.js`). Tages-Dokus können
rechtzeitige Meldungen/Folgetage mit `sickTimely: true` kennzeichnen –
die Erfassungs-UI dafür folgt mit der Doku-Maske.

`defaultHourlyRate` und `billingRuleSet` existieren bereits (siehe
`2026-06-sayas-abrechnung-felder.md`). `useBillingAddress` und die `billing*`-
Adressfelder existieren ebenfalls bereits.

## Verknüpfung zur Abrechnungszentrale

Die Felder `sicknessRule`, `poolRule`, `sollRule`, `defaultHourlyRate` sind die
am Kostenträger gepflegten **Abrechnungsregeln je Amt**. Sie speisen das bereits
angelegte Strategie-Pattern (`billingRulesFor(carrier)` in
`src/utilities/billing/calculation.js`). Die konkrete Rechen-Logik (Krankheit,
Pool, schultagebasiertes Soll) wird nachgeliefert und je Amt aktiviert – ohne
UI-Umbau. Der fallbezogene Sachbearbeiter bleibt am Klienten; die Fallakte
referenziert den Kostenträger nur, E-Rechnungsdaten/Regeln zieht die Abrechnung
automatisch vom referenzierten Kostenträger.

## Adress-Übernahme

UI-Checkbox „entspricht Hauptadresse" (Default an). Beim Speichern:
- aktiv → `billing*`-Felder leer (Abrechnung nutzt die Hauptadresse).
- inaktiv → `billing*`-Felder aus den abweichenden, kompakten Feldern geparst.

Empfehlung: `useBillingAddress` entsprechend setzen (`= !sameAsMain`), sobald
der Speicherpfad die neuen Felder mitführt.

## Deployment durch das Team

```bash
amplify push
amplify codegen
```

## Frontend-Anbindung (nach erfolgreichem `amplify push`)

Heute emittiert `NewCarrierForm.vue` nur die bestehenden `carrierInput`-Keys
(Adresse, phone, email, billing*). Nach dem Deploy:

1. Die `extra`-Felder (carrierType, billingContactName, E-Rechnung,
   Abrechnungsregeln, hourlyRateSpecialist, hourlyRateAssistant,
   sicknessPercent) in den `createCarrier`-Aufruf
   (`store/modules/admin/actions.js → addCarrier`) aufnehmen.
2. `useBillingAddress = !sameAsMain` mit speichern.
3. Info-Banner im Formular entfernen.

## Sicherheit / Auth

Keine Änderung an den `@auth`-Regeln. Neue Felder erben die Regeln des
`Carrier`-Typs.
