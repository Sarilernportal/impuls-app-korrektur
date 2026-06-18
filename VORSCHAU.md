# Impuls-App lokal ansehen (Vorschau / Demo)

Diese Anleitung zeigt Schritt für Schritt, wie du die App **auf deinem eigenen
Computer** im Demo-Modus startest – ganz ohne AWS-Konto und ohne echte Daten.
Du brauchst keine Programmierkenntnisse, nur etwas Geduld beim ersten Mal.

> 💡 **Demo-Modus** = die App läuft mit ein paar Beispiel-Einträgen, damit du das
> Design und die Bedienung anschauen kannst. Es werden **keine echten Daten**
> geladen oder gespeichert.

---

## 1. Einmalig: Node.js installieren

Node.js ist das Programm, das die App auf deinem Rechner startet.

1. Gehe auf **https://nodejs.org**
2. Lade die große grüne Schaltfläche **„LTS"** herunter und installiere sie
   (einfach durchklicken, Standard­einstellungen lassen).
3. Fertig. Das musst du nur **einmal** machen.

---

## 2. Das Projekt herunterladen

**Variante A – ohne Git (am einfachsten):**
1. Öffne im Browser:
   `https://github.com/Sarilernportal/impuls-app-korrektur`
2. Wechsle oben links über das Branch-Auswahlfeld auf den Branch
   **`claude/magical-brahmagupta-lbgfcf`** (das ist das neue Design).
3. Klicke auf den grünen Knopf **„Code"** → **„Download ZIP"**.
4. Entpacke die ZIP-Datei in einen Ordner deiner Wahl
   (z. B. auf den Schreibtisch).

**Variante B – mit Git** (falls du Git kennst):
```bash
git clone https://github.com/Sarilernportal/impuls-app-korrektur.git
cd impuls-app-korrektur
git checkout claude/magical-brahmagupta-lbgfcf
```

---

## 3. Ein Terminal im Projektordner öffnen

Das „Terminal" ist ein Eingabefenster für Befehle.

- **Windows:** Öffne den entpackten Projektordner im Datei-Explorer, klicke oben
  in die Adresszeile, tippe `cmd` und drücke Enter.
- **Mac:** Rechtsklick auf den Projektordner → „Neuer Terminal-Tab im Ordner"
  (oder die App „Terminal" öffnen und mit `cd` in den Ordner wechseln).

Du solltest jetzt ein Fenster sehen, in dem der Pfad zum Projektordner steht.

---

## 4. Die App vorbereiten und starten

Tippe nacheinander diese **zwei Befehle** ein (jeweils mit Enter bestätigen):

```bash
npm install
```
> Lädt einmalig alle benötigten Bausteine. Das dauert beim ersten Mal ein paar
> Minuten – bitte warten, bis es fertig ist.

```bash
npm run demo
```
> Richtet automatisch den Demo-Modus ein und startet die App.

Wenn alles läuft, erscheint im Terminal eine Zeile wie:

```
➜  Local:   http://localhost:5173/
```

---

## 5. Die App im Browser öffnen

1. Öffne deinen Browser (Chrome, Edge, Safari …).
2. Gib in die Adresszeile ein: **http://localhost:5173**
3. Auf der Login-Seite klickst du unten auf **„Demo-App öffnen"**.
   *(Alternativ: irgendeine E-Mail-Adresse und ein beliebiges Passwort eingeben
   und auf „Login" klicken.)*

🎉 Jetzt kannst du dich durch die App klicken und das neue Design ansehen.

---

## App wieder beenden

Klicke ins Terminal-Fenster und drücke **`Strg` + `C`** (Mac: `Ctrl` + `C`).
Zum erneuten Anschauen genügt später wieder `npm run demo` im Projektordner.

---

## Häufige Fragen

**„`npm` wird nicht erkannt"** → Node.js war noch nicht (richtig) installiert.
Schritt 1 wiederholen und das Terminal danach neu öffnen.

**Die Seite im Browser bleibt leer / lädt nicht** → Prüfe, ob im Terminal die
Zeile `http://localhost:5173/` steht. Erst dann ist die App bereit.

**Sehe ich hier echte Daten unserer Kollegen?** → Nein. Der Demo-Modus zeigt nur
Beispieldaten. Für den echten Betrieb wird die produktive AWS/Cognito-
Konfiguration (`src/aws-exports.js` aus Amplify) benötigt – siehe README.

**Kann ich aus Versehen etwas kaputt machen?** → Nein. Der Demo-Modus verändert
keine echten Daten, und `npm run demo` überschreibt eine vorhandene echte
Konfiguration niemals.
