# Abhängigkeiten & Sicherheit – Status und Empfehlungen

**Stand:** 2026-06

## Zusammenfassung

| Zeitpunkt                              | Befunde (npm audit) |
| -------------------------------------- | ------------------- |
| Ausgangslage                           | 122 (9 low, 62 mod, 45 high, 6 crit) |
| nach nicht-breaking `npm audit fix`    | 69                  |
| nach Entfernen `@tailwindcss/postcss7-compat` | **64** (4 low, 42 mod, 17 high, 1 crit) |

Die **64 verbleibenden** Befunde hängen alle an Paketen, die nur per
**Major-Update** (Breaking Change) zu beheben sind. Sie wurden bewusst NICHT
automatisch angewandt, da sie Test/Build/Runtime gefährden. Wichtig: Fast alle
betreffen die **Dev-/Build-Toolchain** und landen damit nicht im
ausgelieferten Produktiv-Bundle.

## Bereits erledigt (sicher)

- Alle semver-kompatiblen Sicherheitsfixes via `npm audit fix` (nur Lockfile,
  `package.json` unverändert).
- `@tailwindcss/postcss7-compat` entfernt (war ungenutzt; PostCSS-Config nutzt
  das reguläre `tailwindcss`).

## Verbleibende Major-Updates – Bewertung & Empfehlung

Reihenfolge nach Risiko/Aufwand (geringstes zuerst):

### 1. vitest 0.34 → 4 (critical, **dev-only**)
- Lücke betrifft den **Vitest-UI-Server**, der hier nicht verwendet wird
  (`vitest run`, kein `--ui`). Reales Risiko gering.
- Major-Sprung über mehrere Versionen; Test-Setup (`@vue/test-utils`, jsdom)
  muss mitgezogen und die 80 Tests müssen grün bleiben.
- **Empfehlung:** in eigenem Branch aktualisieren, `npm test` verifizieren.
  Kein Produktiv-Risiko.

### 2. vite 3 → 8 (+ @vitejs/plugin-vue → 6, vite-plugin-pwa → 1) (high, **dev/build**)
- Großer Sprung (5 Major-Versionen). Betrifft Build, Dev-Server und PWA-Erzeugung.
- Risiko: Build-Konfiguration (`vite.config`), PWA-/Workbox-Optionen und
  Plugin-Kompatibilität. Kein Runtime-Code im Bundle betroffen, aber bei
  Bruch ist die App nicht baubar.
- **Empfehlung:** zusammen aktualisieren (vite + plugin-vue + vite-plugin-pwa),
  Build + PWA (Service Worker) + Demo-Modus testen. Eigener Branch.

### 3. @vue/cli-plugin-babel → 3.12 (moderate, **dev/codegen**)
- Wird ausschließlich über `babel.config.js` für die GraphQL-Codegen-Skripte
  (`updateAppsyncOperations`, `updateResolverGraphQL`) genutzt – nicht im
  App-Build (Vite).
- Achtung: Das Preset bringt core-js-Polyfills mit; ein Wechsel auf reines
  `@babel/preset-env` verändert den transpilierten Lambda-Output und muss in
  der Amplify-/Lambda-Umgebung getestet werden.
- **Empfehlung:** nur zusammen mit einem bewussten Test der Lambda-Codegen-
  Pipeline anfassen. Alternativ Paket behalten, bis die Pipeline ohnehin
  überarbeitet wird.

### 4. aws-amplify 4 → 6 (high, **RUNTIME – größtes Vorhaben**)
- Kompletter API-Umbau (Auth/API/Storage). Betrifft praktisch jede
  Store-Action und die Auth-Schicht.
- **Empfehlung:** eigenes, abgegrenztes Migrationsprojekt mit eigener
  Test-/Abnahmephase. Nicht im Rahmen der laufenden UI-Arbeiten.

## Empfohlene Reihenfolge

1. vitest (dev, geringes Risiko) → 2. vite-Toolchain (dev/build) →
3. ggf. @vue/cli-plugin-babel (mit Lambda-Test) → 4. aws-amplify (separates
Projekt).

Jeweils in eigenem Branch, mit `npm run lint`, `npm test`, `npm run build`
und einem Demo-/Smoke-Test als Gate.
