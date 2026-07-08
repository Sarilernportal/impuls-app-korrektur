// Bereitet den lokalen Demo-Modus vor:
// Kopiert die Demo-Konfiguration nach src/aws-exports.js – aber NUR, wenn dort
// noch keine Datei liegt. Eine vorhandene (z. B. produktive) Konfiguration wird
// nie überschrieben. Läuft plattformübergreifend (Windows, macOS, Linux).
import { existsSync, copyFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const target = join(here, '..', 'src', 'aws-exports.js')
const demo = join(here, '..', 'src', 'aws-exports.demo.js')

if (existsSync(target)) {
  console.log('[demo] Bestehende src/aws-exports.js gefunden – sie wird nicht verändert.')
} else {
  copyFileSync(demo, target)
  console.log('[demo] Demo-Konfiguration nach src/aws-exports.js angelegt (lokaler Demo-Modus aktiv).')
}
