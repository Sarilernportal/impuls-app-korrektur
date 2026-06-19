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
   Abrechnungsregeln, defaultHourlyRate) in den `createCarrier`-Aufruf
   (`store/modules/admin/actions.js → addCarrier`) aufnehmen.
2. `useBillingAddress = !sameAsMain` mit speichern.
3. Info-Banner im Formular entfernen.

## Sicherheit / Auth

Keine Änderung an den `@auth`-Regeln. Neue Felder erben die Regeln des
`Carrier`-Typs.
