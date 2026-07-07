/*
Project: Impuls / SAYAS – Schulbegleitung / Teilhabeassistenz (§ 35a SGB VIII)
Scope: Druckfertiger Rechnungsvordruck (PDF über den Browser-Druckdialog)

Erzeugt aus der Rechnungsansicht ein vollständiges, druckoptimiertes
HTML-Dokument im DIN-A4-Layout: Briefkopf mit Impuls-Logo, Empfänger-
Adressfeld, Rechnungsdaten, Positionen, Korrekturen, Summe und die
Berechnungsgrundlage als Anlage für den Kostenträger. „PDF" entsteht über
Drucken → „Als PDF speichern" – funktioniert im Demo- UND Live-Betrieb,
unabhängig vom Backend-PDF (Lambda), das es für echte Daten weiterhin gibt.
*/

// Absender-Stammdaten des Leistungserbringers. Bitte vom Team pflegen –
// bis dahin sind die Platzhalter bewusst als solche erkennbar.
export const INVOICE_SENDER = Object.freeze({
  name: 'IMPULS GmbH',
  addressLine1: '[Straße und Hausnummer pflegen]',
  addressLine2: '[PLZ und Ort pflegen]',
  phone: '[Telefon pflegen]',
  email: '[E-Mail pflegen]',
  bank: '[Bankverbindung / IBAN pflegen]',
  taxId: '[Steuernummer / USt-ID pflegen]'
})

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/*
Baut das komplette Druck-HTML.
context: {
  invoiceNumber, invoiceDate, period, recordNumber,
  recipient: { name, addressLine1, addressLine2, contact },
  childName, guardianName,
  positions: [{ label, hours, rate, amount, note? }]   (formatiert via fmt*)
  corrections: [{ label, amount, reason }],
  total, basis: [{ label, value }],
  logoUrl, formatEuro, formatHours
}
*/
export function buildInvoiceHtml(context) {
  const {
    invoiceNumber,
    invoiceDate,
    period,
    recordNumber,
    recipient,
    childName,
    guardianName,
    positions,
    corrections,
    total,
    basis,
    logoUrl,
    formatEuro,
    formatHours
  } = context

  const positionRows = positions
    .map(
      (position) => `
        <tr>
          <td>${escapeHtml(position.label)}${
            position.note ? `<div class="note">${escapeHtml(position.note)}</div>` : ''
          }</td>
          <td class="num">${escapeHtml(formatHours(position.hours))}</td>
          <td class="num">${position.rate !== null ? escapeHtml(formatEuro(position.rate)) : '–'}</td>
          <td class="num">${position.amount !== null ? escapeHtml(formatEuro(position.amount)) : 'offen'}</td>
        </tr>`
    )
    .join('')

  const correctionRows = (corrections || [])
    .map(
      (correction) => `
        <tr>
          <td>Korrektur: ${escapeHtml(correction.label)}<div class="note">${escapeHtml(
            correction.reason
          )}</div></td>
          <td class="num"></td>
          <td class="num"></td>
          <td class="num">${correction.amount > 0 ? '+' : ''}${escapeHtml(formatEuro(correction.amount))}</td>
        </tr>`
    )
    .join('')

  const basisRows = (basis || [])
    .map(
      (row) => `
        <tr>
          <td class="basis-label">${escapeHtml(row.label)}</td>
          <td>${escapeHtml(row.value)}</td>
        </tr>`
    )
    .join('')

  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8" />
<title>Rechnung ${escapeHtml(invoiceNumber)}</title>
<style>
  @page { size: A4; margin: 18mm 18mm 22mm 22mm; }
  * { box-sizing: border-box; }
  body { font-family: "Helvetica Neue", Arial, sans-serif; color: #1c1f23; font-size: 11pt; line-height: 1.45; margin: 0; }
  .head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14mm; }
  .head img { height: 22mm; max-width: 60mm; object-fit: contain; }
  .sender-block { text-align: right; font-size: 9pt; color: #555; }
  .sender-line { font-size: 7.5pt; color: #888; text-decoration: underline; margin-bottom: 2mm; }
  .recipient { min-height: 28mm; margin-bottom: 10mm; white-space: pre-line; }
  .meta { width: 100%; margin-bottom: 8mm; border-collapse: collapse; font-size: 10pt; }
  .meta td { padding: 1px 0; vertical-align: top; }
  .meta .label { color: #666; width: 42mm; }
  h1 { font-size: 14pt; margin: 0 0 6mm; }
  table.positions { width: 100%; border-collapse: collapse; margin-bottom: 4mm; }
  table.positions th { text-align: left; font-size: 9pt; color: #666; border-bottom: 1.5px solid #1c1f23; padding: 2mm 2mm 1.5mm 0; }
  table.positions td { border-bottom: 0.5px solid #ccc; padding: 2.5mm 2mm 2.5mm 0; vertical-align: top; }
  table.positions .num { text-align: right; white-space: nowrap; }
  .note { font-size: 8.5pt; color: #854f0b; margin-top: 0.5mm; }
  .total-row { display: flex; justify-content: flex-end; margin: 3mm 0 8mm; }
  .total { border-top: 2px solid #1c1f23; padding-top: 2mm; min-width: 62mm; display: flex; justify-content: space-between; font-weight: 700; font-size: 12pt; }
  .basis { margin-top: 8mm; padding: 4mm; border: 1px solid #b5d4f4; background: #f2f8fe; border-radius: 2mm; page-break-inside: avoid; }
  .basis h2 { font-size: 10.5pt; margin: 0 0 2mm; color: #0c447c; }
  .basis p.intro { font-size: 8.5pt; color: #0c447c; margin: 0 0 3mm; }
  .basis table { width: 100%; border-collapse: collapse; font-size: 9.5pt; }
  .basis td { padding: 1mm 2mm 1mm 0; vertical-align: top; }
  .basis .basis-label { color: #0c447c; font-weight: 600; width: 48mm; }
  .foot { position: fixed; bottom: 0; left: 0; right: 0; border-top: 0.5px solid #999; padding-top: 2mm; font-size: 7.5pt; color: #777; display: flex; justify-content: space-between; gap: 6mm; }
  .muted { color: #666; }
</style>
</head>
<body>
  <div class="head">
    <div>
      <img src="${escapeHtml(logoUrl)}" alt="Impuls Logo" />
    </div>
    <div class="sender-block">
      <strong>${escapeHtml(INVOICE_SENDER.name)}</strong><br />
      ${escapeHtml(INVOICE_SENDER.addressLine1)}<br />
      ${escapeHtml(INVOICE_SENDER.addressLine2)}<br />
      ${escapeHtml(INVOICE_SENDER.phone)} · ${escapeHtml(INVOICE_SENDER.email)}
    </div>
  </div>

  <div class="sender-line">${escapeHtml(INVOICE_SENDER.name)} · ${escapeHtml(
    INVOICE_SENDER.addressLine1
  )} · ${escapeHtml(INVOICE_SENDER.addressLine2)}</div>
  <div class="recipient">${escapeHtml(recipient.name)}
${escapeHtml(recipient.contact || '')}
${escapeHtml(recipient.addressLine1 || '')}
${escapeHtml(recipient.addressLine2 || '')}</div>

  <table class="meta">
    <tr><td class="label">Rechnungsnummer</td><td><strong>${escapeHtml(invoiceNumber)}</strong></td></tr>
    <tr><td class="label">Rechnungsdatum</td><td>${escapeHtml(invoiceDate)}</td></tr>
    <tr><td class="label">Leistungszeitraum</td><td>${escapeHtml(period)}</td></tr>
    <tr><td class="label">Klient / Aktenzeichen</td><td>${escapeHtml(childName)}${
    recordNumber ? ` · ${escapeHtml(recordNumber)}` : ''
  }</td></tr>
    <tr><td class="label">Fachkraft</td><td>${escapeHtml(guardianName)}</td></tr>
  </table>

  <h1>Rechnung</h1>
  <p class="muted">Leistungen der Teilhabeassistenz / Schulbegleitung nach § 35a SGB VIII.</p>

  <table class="positions">
    <thead>
      <tr><th>Leistung</th><th style="text-align:right">Stunden</th><th style="text-align:right">Satz</th><th style="text-align:right">Betrag</th></tr>
    </thead>
    <tbody>
      ${positionRows}
      ${correctionRows}
    </tbody>
  </table>

  <div class="total-row">
    <div class="total"><span>Rechnungsbetrag</span><span>${escapeHtml(formatEuro(total))}</span></div>
  </div>

  <div class="basis">
    <h2>Anlage: Berechnungsgrundlage</h2>
    <p class="intro">Regeln dieses Kostenträgers, mit denen die Rechnung berechnet wurde – zur Prüfbarkeit durch die Behörde.</p>
    <table>${basisRows}</table>
  </div>

  <div class="foot">
    <span>${escapeHtml(INVOICE_SENDER.name)} · ${escapeHtml(INVOICE_SENDER.bank)}</span>
    <span>${escapeHtml(INVOICE_SENDER.taxId)}</span>
  </div>
</body>
</html>`
}

// Öffnet das Druck-HTML in einem eigenen Fenster und startet den Druckdialog
// (dort „Als PDF speichern" wählen).
export function openInvoicePrintWindow(html) {
  const printWindow = window.open('', '_blank')
  if (!printWindow) return false
  printWindow.document.open()
  printWindow.document.write(html)
  printWindow.document.close()
  printWindow.focus()
  // Kurz warten, bis Logo/Layout geladen sind, dann Druckdialog öffnen.
  printWindow.setTimeout(() => printWindow.print(), 350)
  return true
}
