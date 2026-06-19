# SAYAS – Pooling (Anforderungen & geplante Datenmodell-Erweiterung)

**Stand:** 2026-06 · **Status:** Konzept – noch NICHT umgesetzt (außer n:m-Basis)

## Was ist Pooling?

Eine Schulbegleitungskraft (Betreuer / THA-Kraft) betreut mehrere Kinder
gleichzeitig („Poollösung"). Üblich in der Eingliederungshilfe; muss in SAYAS
durchgängig abgebildet werden – besonders in der Mitarbeiter-App
(Doku + Zeiterfassung) und in der Abrechnung.

## Heutiger Stand im Datenmodell

Die Beziehung Betreuer ↔ Klient ist bereits **n:m** über `CareAssignment`
(`Guardian.careAssignments` ⇄ `Child.careAssignments`). Die Betreuer-
Profilseite (`UserDetails.vue`) zeigt die zugeordneten Klienten als Tabelle
(Klient · Schule · Wochenstunden · Fallakte-Link · Entfernen mit Bestätigung).

## Geplante Erweiterung (später, je nach Detailregeln)

1. **Pool als eigene Einheit**: neuer Typ `Pool { id, school, schoolClass,
   periodFrom, periodTo, carrier? }` plus Zuordnung der Kinder
   (`CareAssignment.poolId` oder `Pool.members`).
2. **Mitarbeiter-App – Doku & Zeiterfassung** (neu zu entwerfen):
   - Zeit den anwesenden Kindern zuordnen – einzeln oder als Pool-Einheit
     (z. B. 4 h mit 3 anwesenden Kindern) nach klarer Aufteilungsregel.
   - Jedes Kind braucht trotzdem **eigene** inhaltliche Doku je Fallakte.
   - Anwesenheit je Kind erfassbar (für Krankheits-/Ausfallregeln je Amt).
3. **Abrechnung**: Pool-Stunden pro Kind UND pro Kostenträger abrechnen
   (verschiedene Ämter, Sätze, Regeln). Aufteilungslogik je Amt konfigurierbar
   – speist das bestehende Strategie-Pattern (`billingRulesFor`).

## Offen / zu klären (Herr Sari)

- Aufteilung der Pool-Zeit auf die Kinder: gleichmäßig / nach Bewilligung /
  nach Anwesenheit?
- Aufteilungsregel pro Amt oder einheitlich?
- Praktische Lösung der individuellen Doku-Pflicht je Kind (Vorlagen / Kopieren
  / getrennt)?

## Betroffene Bildschirme (Reihenfolge später)

- Mitarbeiter-App: Zeiterfassung / Leistungsnachweis (neu)
- Dokumentationen (pro Klient)
- Abrechnungszentrale (Pool-Aufteilung in der Berechnung)
- Klient-Fallakte & Betreuer-Profil (Pool-Zuordnung sichtbar)
