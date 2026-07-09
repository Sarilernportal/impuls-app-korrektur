# Echte Daten (AWS) – für SPÄTER

> Aktuell arbeiten wir im **Demo-Modus** (`npm run demo`). Diese Anleitung ist
> für den späteren Umstieg auf die **echten Daten** aus AWS. Bis dahin brauchst
> du hier nichts zu tun.

Der Demo-Modus zeigt bewusst nur Beispieldaten – er ist **nicht** mit AWS
verbunden. Die echten Dokumentationen/Rechnungen liegen im AWS-Backend
(Cognito/AppSync) und werden erst geladen, wenn die App mit der **echten**
Amplify-Konfiguration läuft.

## Wenn es so weit ist

1. **Echte Konfig einlegen:** die produktive `aws-exports.js` (aus dem Amplify-
   Projekt bzw. `amplify pull`) nach `src/aws-exports.js` kopieren – sie
   ersetzt die Demo-Datei. *(Die Datei ist geheim und absichtlich nicht im
   Repo/Git.)*

2. **Echt-Modus starten:**
   ```bash
   npm run real
   ```
   Der Vorab-Check (`scripts/check-real.mjs`) stellt sicher, dass wirklich die
   echte Konfig aktiv ist (nicht die Demo). Bei Demo/fehlender Konfig bricht er
   mit einer klaren Meldung ab.

3. **Mit echtem Konto anmelden:** auf der Login-Seite die echten Cognito-
   Zugangsdaten eingeben – **nicht** „Demo-App öffnen". Danach zeigt die (neu
   gestaltete) App die echten Daten.

## Zurück zum Demo
```bash
rm src/aws-exports.js   # echte Konfig entfernen
npm run demo            # Demo-Konfig wird neu angelegt
```

## Gut zu wissen
- Alle bisherigen Design-/Feature-Änderungen betreffen nur das **Frontend**.
  Das AWS-Backend und die echten Daten sind **unverändert**.
- Die Demo-Beispieldaten (`src/services/localDemoData.js`) werden **nur** im
  Demo-Modus genutzt – im Echt-Modus erscheinen sie nie.
