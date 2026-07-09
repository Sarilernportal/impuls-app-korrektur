// Preflight für den "Echt-Modus" (npm run real):
// Stellt sicher, dass src/aws-exports.js die ECHTE Amplify/AWS-Konfiguration ist
// (nicht die Demo-Konfig mit localOnly:true) – sonst würde die App wieder nur
// Demodaten zeigen. Bricht mit klarer Meldung ab, wenn Demo/fehlt.
import { readFileSync, existsSync } from 'node:fs'

const path = new URL('../src/aws-exports.js', import.meta.url)

if (!existsSync(path)) {
  console.error('\n[real] Es liegt keine src/aws-exports.js vor.')
  console.error('[real] Lege die ECHTE Amplify-Konfiguration als src/aws-exports.js ab.')
  console.error('[real] Anleitung: ECHTE-DATEN.md\n')
  process.exit(1)
}

const txt = readFileSync(path, 'utf8')

if (/localOnly\s*:\s*true/.test(txt)) {
  console.error('\n[real] src/aws-exports.js ist die DEMO-Konfiguration (localOnly: true).')
  console.error('[real] Ersetze sie durch die ECHTE Amplify-Konfiguration, um echte Daten zu sehen.')
  console.error('[real] Anleitung: ECHTE-DATEN.md\n')
  process.exit(1)
}

const pool = (txt.match(/aws_user_pools_id["']?\s*[:=]\s*["']([^"']+)["']/) || [])[1]
const region = (txt.match(/aws_project_region["']?\s*[:=]\s*["']([^"']+)["']/) || [])[1]

if (!pool) {
  console.error('\n[real] src/aws-exports.js enthält keine aws_user_pools_id.')
  console.error('[real] Bitte die vollständige, echte Amplify-Konfiguration verwenden. (ECHTE-DATEN.md)\n')
  process.exit(1)
}

console.log(`[real] Echt-Modus aktiv: verbinde mit AWS (Region ${region || '?'}, User Pool ${pool}).`)
console.log('[real] Login mit ECHTEM Konto (nicht „Demo-App öffnen"). Echte Dokumentationen werden geladen.')
