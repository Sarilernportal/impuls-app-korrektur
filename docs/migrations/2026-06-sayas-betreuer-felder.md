# Migration: SAYAS-Betreuer-Felder (THA, § 35a SGB VIII)

**Stand:** 2026-06 · **Typ:** additive Schema-Erweiterung · **Datenmigration nötig:** nein

## Hintergrund

Überarbeitung des Formulars „Betreuer hinzufügen" (`/admin/user/add-guardian`,
`NewUserForm.vue`): Gliederung in Stammdaten · Funktion & Qualifikation ·
§ 72a-Führungszeugnis, Label „Vorname", Funktion/Tätigkeit statt System-Rolle,
Abrechnungsfelder und Einladungs-Flow.

Die neuen Felder werden im UI erfasst (frontend-first). Diese Migration
ergänzt das Datenmodell; alle neuen Felder sind **nullable/additiv** – kein
Backfill (DynamoDB schemalos).

## Schema-Änderungen

Datei: `amplify/backend/api/ChildCareAPI/schema.graphql`, `type Guardian`

| Feld                       | Typ       | Bedeutung                                                   |
| -------------------------- | --------- | ----------------------------------------------------------- |
| `jobFunction`              | `String`  | Funktion/Tätigkeit (Schulbegleiter:in, Päd. Fachkraft …)    |
| `hourlyRate`               | `Float`   | Vergütung/Stundensatz des Betreuers (Personalkosten)        |
| `employmentType`           | `String`  | Festanstellung / Honorarkraft / Minijob                     |
| `startDate`                | `String`  | Eintrittsdatum                                              |
| `active`                   | `Boolean` | Einsatzbereit? Ohne § 72a-Nachweis = false                  |
| `certificateSubmitted`     | `Boolean` | Erweitertes Führungszeugnis vorgelegt                       |
| `certificateSubmittedDate` | `String`  | Vorgelegt am                                                |
| `certificateRenewalDate`   | `String`  | Wiedervorlage (UI: auto +5 Jahre)                           |

`qualification` und `professional` (Fachkraftstatus) existieren bereits.

## Stundensatz & Abrechnung (Entscheidung: „beide + konfigurierbar")

Es gibt nun **zwei** Sätze:
- **Fallakte** (`Child.hourlyRate`) – Bescheid-/Abrechnungssatz gegenüber dem Jugendamt.
- **Betreuer** (`Guardian.hourlyRate`) – Vergütung/Personalkosten.

`hourlyRateFor(child, carrier, guardian, rules)` in
`src/utilities/billing/calculation.js` wählt die Quelle anhand des Regelsatzes
je Jugendamt (`rules.rateSource`):
- `'case'` (Default): Fallakte > Betreuer > Träger
- `'guardian'`: Betreuer > Fallakte > Träger

Damit ist konfigurierbar, welcher Satz in der Abrechnungszentrale für die
Betrag-Berechnung gilt – ohne Änderung an der UI. (50 Tests in
`tests/billing.spec.js`.)

## § 72a-Führungszeugnis – Einsatz-Sperre & Erinnerung

- Solange `certificateSubmitted = false`, soll der Zugang **inaktiv** sein
  (`active = false`). Das Formular weist darauf hin („inaktiv / Nachweis
  fehlt"). Beim Aktivieren des Zugangs serverseitig prüfen.
- **Wiedervorlage-Erinnerung**: Ein periodischer Job (z. B. Lambda/Scheduler)
  sollte vor Ablauf von `certificateRenewalDate` erinnern. Im Frontend kann die
  Mitarbeiter-/Betreuerübersicht ablaufende Nachweise hervorheben.

## Deployment durch das Team

```bash
amplify push      # Schema-Änderungen deployen
amplify codegen   # src/graphql/* aktualisieren
```

## Frontend-Anbindung (nach erfolgreichem `amplify push`)

Heute emittiert `NewUserForm.vue` nur die bestehenden Cognito-Attribute
(name, familyName, email, phone, professional). Nach dem Deploy:

1. Die `extra`-Felder in den Speicherweg aufnehmen. Da `addUser` über das
   Cognito-Lambda `/createUser` läuft, die fachlichen Felder am
   **Guardian-AppSync-Objekt** speichern (nicht als Cognito-Attribute) –
   entweder im createUser-Lambda ergänzen oder per `updateGuardian` direkt
   nach dem Anlegen.
2. `active` aus `certificateSubmitted` ableiten und die Einsatz-Sperre
   serverseitig durchsetzen.
3. `Carrier.billingRuleSet` pflegen, falls ein Jugendamt den Betreuersatz
   (`rateSource: 'guardian'`) abrechnen soll.

Danach den Info-Banner im Formular entfernen.

## Sicherheit / Auth

Keine Änderung an den `@auth`-Regeln. Neue Felder erben die Regeln des
`Guardian`-Typs.
