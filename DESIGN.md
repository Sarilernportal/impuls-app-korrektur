# Design System — Impuls / SAYAS

> Erstellt nach der Methodik von gstack (`/design-consultation`) am 2026-07-07.
> Referenz-Mockup: `Abrechnungszentrale` als Master-Detail (siehe Desktop-Ordner `mockup-redesign/`).

## Product Context
- **What this is:** Web-App (PWA) zur Teilhabeassistenz/Schulbegleitung nach § 35a SGB VIII – Dokumentation, Leistungsnachweise und Abrechnung gegenüber Jugendämtern.
- **Who it's for:** Mitarbeiter:innen (Betreuer:innen im Außeneinsatz, mobil) und Verwaltung/Buchhaltung (Desktop).
- **Space/industry:** Soziale Träger / Eingliederungshilfe; verwandt mit Fachsoftware für Pflege-/Sozialabrechnung.
- **Project type:** Internes Fach- & Verwaltungswerkzeug + mobile Mitarbeiter-App.

## Aesthetic Direction
- **Direction:** Ruhiges Utilitarian (function-first, datenklar) – nicht kalt, sondern warm-neutral und vertrauenswürdig.
- **Decoration level:** minimal (Typografie und Weißraum tragen; keine Verläufe/Muster).
- **Mood:** Ruhig, aufgeräumt, verlässlich. Zahlen stehen im Vordergrund, nichts lenkt ab.
- **Reference sites:** Linear, Stripe Dashboard, Things (Aufgeräumtheit & tabellarische Zahlen als Vorbild).

## Typography
- **Display/Hero:** Satoshi (700/900) — geometrisch, eigenständig, modern; gibt der App ein Gesicht abseits der Standard-Fonts.
- **Body:** DM Sans (400/500/600) — freundlich, hervorragend lesbar in Formularen und Listen.
- **UI/Labels:** DM Sans (same as body), Labels 11–12px, uppercase, letter-spacing .05–.08em.
- **Data/Tables:** DM Sans mit `font-variant-numeric: tabular-nums` — Stunden/Beträge scannbar untereinander ausgerichtet.
- **Code:** JetBrains Mono (falls je benötigt, z.B. IDs/Debug).
- **Loading:** LOKAL GEBÜNDELT (Offline-PWA, keine externen Font-Server):
  `@fontsource-variable/dm-sans` (Body/Data) und `@fontsource-variable/plus-jakarta-sans`
  als OFL-lizenzierter Display-Ersatz für Satoshi (per `src/main.js` importiert,
  woff2 im Service-Worker-Precache). `Satoshi` steht weiter vorn im
  `font-display`-Stack: Sobald die Originaldateien von Fontshare (deren Lizenz
  erlaubt Self-Hosting, aber keinen Weitervertrieb) als `@font-face` eingespielt
  werden, greift Satoshi automatisch. Bewusst NICHT Inter/`system-ui` als Primärschrift.
- **Scale (px):** 11 (label) · 12.5 (meta) · 14 (body) · 16 (h3) · 22 (h2) · 26 (h1). Zeilenhöhe Body 1.45.

## Color
- **Approach:** restrained — eine Akzentfarbe + warme Neutraltöne; Farbe ist selten und bedeutungstragend.
- **Primary:** `#1256b8` (Akzent-Blau) — Aktionen, aktive Navigation, Fokus; abgeleitet aus der Impuls-Marke.
- **Primary-soft:** `#eaf1fc` — aktive Zeilen/Chips, Akzentflächen.
- **Secondary:** keine zweite Markenfarbe; Ruhe durch Verzicht.
- **Neutrals (warm, stone):** Canvas `#f6f5f2` · Karte `#ffffff` · Linie `#e7e5e4` · Tinte `#1c1917` · Text-2 `#57534e` · Text-3 `#a8a29e`.
- **Semantic:** success `#0f7a4f` (soft `#e6f4ec`) · warning `#a8600a` (soft `#fbf0dd`) · error `#b42318` · info = Primary.
- **Dark mode:** später; Strategie: Flächen neu denken (nicht invertieren), Sättigung 10–20% reduzieren.

## Spacing
- **Base unit:** 4px.
- **Density:** comfortable (Listenzeile ~60px, Tabellenzeile ~44px) — dicht genug für Daten, ohne Enge.
- **Scale:** 2xs(2) xs(4) sm(8) md(16) lg(24) xl(32) 2xl(48) 3xl(64).

## Layout
- **Approach:** grid-disciplined; **Master-Detail** für datenlastige Verwaltungsansichten (Liste links ~360px, Detail rechts).
- **Grid:** App = Sidebar(232px) + Inhalt; Detail-KPIs 4 Spalten; mobil (Mitarbeiter-App) einspaltig gestapelt + Bottom-Nav.
- **Max content width:** Detailinhalt bis ~1040px, Listen fluid.
- **Border radius:** sm 8px · md 10px · lg 14px · pill 9999px (Chips/Status). Keine überall gleiche „Bubble"-Rundung.

## Motion
- **Approach:** minimal-functional — nur Übergänge, die Verständnis unterstützen (Auswahl, Aufklappen).
- **Easing:** enter(ease-out) exit(ease-in) move(ease-in-out).
- **Duration:** micro(80ms) short(180ms) medium(300ms).

## Komponenten-Muster
- **Status-Chips:** Filter oben als Pills mit Punkt + Zahl (ersetzen große Status-Kacheln).
- **Master-Liste:** Zeile = Avatar-Initialen · Name (Satoshi) · Meta (Fachkraft · Amt) · Status-Pill · Betrag/Stunden (tabular) rechts.
- **Detail:** Kopf (Name, Zeitraum, Unterschriften E/S/F) · KPI-Karte (Soll/Geleistet/Überhang/Abrechenbar) · Positionstabelle (rechtsbündige, tabellarische Zahlen) · ein Primär-Button + Sekundäraktionen.
- **Buttons:** genau EIN Primär-Button (gefüllt, Akzent) pro Kontext; Rest ghost (Rahmen).

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-07-07 | Initiales Design-System erstellt | Nach gstack `/design-consultation`, basierend auf App-Kontext (Abrechnung/Doku § 35a) und Referenz-Mockup Abrechnungszentrale |
| 2026-07-07 | Satoshi + DM Sans statt Inter/system-ui | Eigenständige Typografie; Inter/`system-ui` laut gstack „Typografie aufgegeben"-Signal |
| 2026-07-07 | Restrained-Palette, ein Akzent-Blau, warm-neutrale Fläche | Ruhe & Fokus auf Zahlen; Status ausschließlich über Ampel-Pills |
| 2026-07-07 | Master-Detail für Verwaltung | Löst „alles unübersichtlich" – schlanke Liste statt breiter Tabelle |
