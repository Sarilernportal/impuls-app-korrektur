# Migration: SAYAS-Fallakte-Felder (§ 35a SGB VIII)

**Stand:** 2026-06 · **Typ:** additive Schema-Erweiterung · **Datenmigration nötig:** nein

## Hintergrund

Der neue „Fallakte anlegen"-Wizard (`NewChildWizard.vue`) erfasst bereits eine
Reihe zusätzlicher Felder für die Teilhabeassistenz / Schulbegleitung nach
§ 35a SGB VIII. Diese Felder werden im Frontend gesammelt, aber noch **nicht
gespeichert** (siehe Info-Banner im Wizard), weil das Datenmodell sie bisher
nicht kennt.

Diese Migration ergänzt das GraphQL-Schema um genau diese Felder. Alle neuen
Felder sind **nullable** und werden additiv hinzugefügt — bestehende
Datensätze bleiben unangetastet, ein Backfill ist nicht erforderlich
(DynamoDB ist schemalos).

## Schema-Änderungen

Datei: `amplify/backend/api/ChildCareAPI/schema.graphql`

### `type Child` — neue Felder

| Feld             | Typ       | Wizard-Schritt        | Bedeutung                                   |
| ---------------- | --------- | --------------------- | ------------------------------------------- |
| `gender`         | `String`  | 1 Stammdaten          | Geschlecht                                  |
| `address`        | `String`  | 1 Stammdaten          | Adresse (Straße, PLZ, Ort) als Freitext     |
| `nativeLanguage` | `String`  | 1 Stammdaten          | Muttersprache                               |
| `schoolForm`     | `String`  | 3 Schule & Begleitung | Schulform                                   |
| `schoolClass`    | `String`  | 3 Schule & Begleitung | Klasse                                      |
| `supportNeed`    | `String`  | 3 Schule & Begleitung | Förder-/Unterstützungsbedarf                |
| `legalBasis`     | `String`  | 4 Hilfe & Abrechnung  | Rechtsgrundlage (Default „§ 35a SGB VIII")  |
| `caseworker`     | `String`  | 4 Hilfe & Abrechnung  | Sachbearbeiter:in Jugendamt                 |
| `decisionRef`    | `String`  | 4 Hilfe & Abrechnung  | Bescheid-Aktenzeichen                       |
| `approvedUntil`  | `String`  | 4 Hilfe & Abrechnung  | Bewilligt bis (Datum TT.MM.JJJJ)            |
| `consentGiven`   | `Boolean` | 1 Datenschutz         | Einwilligung/Schweigepflichtentbindung      |
| `consentDate`    | `String`  | 1 Datenschutz         | Datum der Einwilligung                      |
| `legalGuardians` | `[Parent]`| 2 Sorgeberechtigte    | Dynamische Liste aller Sorgeberechtigten    |

### `type Parent` — neue Felder

| Feld      | Typ       | Bedeutung                                                  |
| --------- | --------- | ---------------------------------------------------------- |
| `role`    | `String`  | Mutter, Vater, Vormund, Pflegeeltern, Amtsvormund, sonstige|
| `custody` | `Boolean` | personensorgeberechtigt                                    |

> Hinweis: `Parent` ist ein eingebetteter (non-`@model`) Typ. Die bestehenden
> Felder `mother`/`father` bleiben erhalten; `legalGuardians` nimmt zusätzlich
> die vollständige dynamische Liste auf.

## Deployment durch das Team

```bash
# 1. Schema-Änderungen ins Backend deployen
amplify push

# 2. Generierte GraphQL-Operationen (queries/mutations) aktualisieren
amplify codegen
```

`amplify codegen` aktualisiert `src/graphql/{queries,mutations}.js` und
`src/graphql/schema.json` mit den neuen Feldern. Ohne diesen Schritt liefern
die generierten Selection-Sets die neuen Felder nicht zurück.

## Frontend-Anbindung (Folgeschritt nach erfolgreichem `amplify push`)

Solange das Backend die Felder noch nicht kennt, würde ein Mitsenden zu einem
GraphQL-Validierungsfehler führen. Daher werden die neuen Felder bewusst erst
**nach** dem Deploy angebunden. Sobald `amplify push` + `amplify codegen`
gelaufen sind, sind folgende zwei Stellen anzupassen:

### a) `src/components/Main/Admin/Children/NewChildWizard.vue`

In `buildAndEmit()` die `extra`-Felder und `guardiansList` mit in das
emittierte Payload aufnehmen (heute wird nur `childInput` emittiert). Die
`extra`-Keys 1:1 auf die neuen Schema-Felder mappen; `guardiansList` auf
`legalGuardians` (`role`, `name`, `familyName`, `phone`, `email`, `custody`).

### b) `src/store/modules/admin/actions.js` → `addChild`

Die neuen Felder aus dem Payload entnehmen und in das `input`-Objekt der
`createChild`-Mutation übernehmen, z. B.:

```js
const input = {
  archiveStatus: 'unarchived',
  // …bestehende Felder…
  gender,
  address,
  nativeLanguage,
  schoolForm,
  schoolClass,
  supportNeed,
  legalBasis: legalBasis || '§ 35a SGB VIII',
  caseworker,
  decisionRef,
  approvedUntil,
  consentGiven,
  consentDate,
  legalGuardians // [{ role, name, familyName, phone, email, custody }]
}
```

Danach kann der Info-Banner im Wizard („… werden gespeichert, sobald das
Datenmodell erweitert ist") entfernt werden.

## Sicherheit / Auth

Keine Änderung an den `@auth`-Regeln. Die neuen Felder erben die bestehenden
Regeln des jeweiligen Typs (Admin: create/read/update; Guardian: read auf
`Child`).
