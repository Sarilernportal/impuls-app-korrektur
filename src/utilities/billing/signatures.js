/*
Project: Impuls / SAYAS – Schulbegleitung / Teilhabeassistenz (§ 35a SGB VIII)
Scope: Unterschriften-Ampel (Eltern / Schule / Fachkraft)

Für einen abrechenbaren Nachweis müssen die nötigen Unterschriften vorliegen.
Fehlt eine, blockiert das den Status "abrechenbar" (→ "Nachweis prüfen").

Quelle (frontend-first): ein optionales `signatures`-Objekt am Dokument
{ parent, school, professional }. Solange das Backend diese Felder noch nicht
führt, fällt die Fachkraft-Unterschrift auf das vorhandene `signatureImage`
zurück (die Fachkraft unterschreibt den Leistungsnachweis beim Einreichen).
*/

// Die drei erforderlichen Unterschriften mit Anzeige-Label.
export const SIGNATURE_KINDS = Object.freeze([
  { key: 'parent', label: 'Eltern' },
  { key: 'school', label: 'Schule' },
  { key: 'professional', label: 'Fachkraft' }
])

// Liefert den Unterschriften-Status eines Dokuments.
// → { parent, school, professional, complete, missing: [Label, …] }
export function signatureStatus(document) {
  const signatures = document?.signatures || {}

  const parent = toBool(signatures.parent)
  const school = toBool(signatures.school)
  // Fallback: ältere Datensätze haben nur signatureImage (= Fachkraft).
  const professional =
    toBool(signatures.professional) || hasLegacySignature(document)

  const present = { parent, school, professional }
  const missing = SIGNATURE_KINDS.filter((kind) => !present[kind.key]).map(
    (kind) => kind.label
  )

  return {
    parent,
    school,
    professional,
    complete: missing.length === 0,
    missing
  }
}

// Sind alle nötigen Unterschriften vorhanden?
export function signaturesComplete(document) {
  return signatureStatus(document).complete
}

function toBool(value) {
  return value === true || value === 'true' || value === 1
}

function hasLegacySignature(document) {
  return Boolean(document?.signatureImage || document?.key)
}
