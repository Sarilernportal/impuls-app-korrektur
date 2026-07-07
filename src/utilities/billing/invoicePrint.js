/*
Project: Impuls / SAYAS – Schulbegleitung / Teilhabeassistenz (§ 35a SGB VIII)
Scope: Druckfertiger Rechnungsvordruck nach der IMPULS-Rechnungsvorlage

Layout und Texte folgen der Word-Vorlage der Verwaltung (Briefkopf, Betreff
„Rechnung für den Zeitraum … gemäß § 35a SGB VIII", Tabelle
Menge × Satz = Betrag | Bezeichnung, Umsatzsteuer-Befreiung nach
§ 4 Nr. 25 UStG, Fußzeile mit GF/Handelsregister/Bank). Zusätzlich wird die
Berechnungsgrundlage des Kostenträgers als Anlage angehängt.

„PDF" entsteht über Drucken → „Als PDF speichern" – funktioniert im Demo-
UND Live-Betrieb; das serverseitige Lambda-PDF bleibt unberührt.
*/

// Absender-Stammdaten (aus der Rechnungsvorlage der Verwaltung übernommen).
export const INVOICE_SENDER = Object.freeze({
  name: 'IMPULS GmbH',
  addressLine1: 'Bahnhofstraße 23',
  addressLine2: '65428 Rüsselsheim',
  phone: 'Tel.: 06142-4898080',
  fax: 'Fax: 06142-4898037',
  web: 'www.impuls-erziehungshilfen.de',
  email: 'info@impuls-erziehungshilfen.de',
  managingDirector: 'Geschäftsführer: Süreyya Sari',
  register: 'Handelsregister Darmstadt · HRB-Nr.: 94700',
  taxId: 'Steuernummer: 007 236 01904',
  bankName: 'Nassauische Sparkasse',
  iban: 'IBAN: DE61 5105 0015 0107 0942 52',
  // Unterzeichner:in der Rechnung – bitte je nach Sachbearbeitung pflegen.
  signer: 'i. A. die Verwaltung',
  vatNote: 'Die Leistungen sind nach § 4 Nr. 25 UStG von der Umsatzsteuer befreit.'
})

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/*
Baut das komplette Druck-HTML nach der IMPULS-Vorlage.
context: {
  invoiceNumber, invoiceDate, period, recordNumber, birthDate?,
  debtorNumber?, recipient: { name, contact, addressLine1, addressLine2 },
  childName, guardianName,
  positions: [{ label, hours, rate, amount, note? }],
  corrections: [{ label, quantity?, unitAmount?, amount, reason? }],
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
    birthDate,
    debtorNumber,
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

  // Tabellenzeile im Vorlagen-Format: Menge | x | Satz | = | Betrag | Bezeichnung
  function row(quantityLabel, rate, amount, label, note) {
    return `
      <tr>
        <td class="num">${escapeHtml(quantityLabel)}</td>
        <td class="op">x</td>
        <td class="num">${rate !== null && rate !== undefined ? escapeHtml(formatEuro(rate)) : '–'}</td>
        <td class="op">=</td>
        <td class="num">${amount !== null && amount !== undefined ? escapeHtml(formatEuro(amount)) : 'offen'}</td>
        <td>${escapeHtml(label)}${note ? `<div class="note">${escapeHtml(note)}</div>` : ''}</td>
      </tr>`
  }

  const positionRows = positions
    .map((position) => row(formatHours(position.hours), position.rate, position.amount, position.label, position.note))
    .join('')

  const correctionRows = (corrections || [])
    .map((correction) =>
      row(
        String(correction.quantity ?? 1),
        correction.unitAmount ?? correction.amount,
        correction.amount,
        correction.label,
        correction.reason
      )
    )
    .join('')

  const basisRows = (basis || [])
    .map(
      (rowItem) => `
        <tr>
          <td class="basis-label">${escapeHtml(rowItem.label)}</td>
          <td>${escapeHtml(rowItem.value)}</td>
        </tr>`
    )
    .join('')

  const subjectParts = [`für ${childName}`]
  if (birthDate) subjectParts.push(`geb. am ${birthDate}`)
  if (recordNumber) subjectParts.push(`AktZ. ${recordNumber}`)

  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8" />
<title>Rechnung Nr. ${escapeHtml(invoiceNumber)}</title>
<style>
  @page { size: A4; margin: 16mm 20mm 30mm 24mm; }
  * { box-sizing: border-box; }
  body { font-family: "Helvetica Neue", Arial, sans-serif; color: #1c1f23; font-size: 11pt; line-height: 1.45; margin: 0; }
  .head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12mm; }
  .head img { height: 20mm; max-width: 58mm; object-fit: contain; }
  .sender-block { text-align: right; font-size: 9pt; color: #333; line-height: 1.4; }
  .sender-line { font-size: 7.5pt; color: #888; text-decoration: underline; margin-bottom: 2mm; }
  .addr-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8mm; }
  .recipient { min-height: 30mm; white-space: pre-line; }
  .right-meta { text-align: right; font-size: 10pt; color: #333; }
  h1 { font-size: 12pt; margin: 0 0 2mm; }
  .subject { font-weight: 700; margin: 0 0 6mm; }
  p { margin: 0 0 3.5mm; }
  table.positions { width: 100%; border-collapse: collapse; margin: 4mm 0; }
  table.positions th { text-align: left; font-size: 9pt; color: #555; border-bottom: 1.2px solid #1c1f23; padding: 1.5mm 2mm 1mm 0; }
  table.positions td { padding: 1.8mm 2mm 1.8mm 0; vertical-align: top; }
  table.positions .num { text-align: right; white-space: nowrap; }
  table.positions .op { text-align: center; width: 6mm; color: #555; }
  table.positions tr.sum td { border-top: 1.2px solid #1c1f23; font-weight: 700; padding-top: 2mm; }
  .note { font-size: 8.5pt; color: #854f0b; margin-top: 0.5mm; font-weight: 400; }
  .vat { margin-top: 6mm; font-size: 9.5pt; }
  .signer { margin-top: 10mm; }
  .basis { margin-top: 8mm; padding: 4mm; border: 1px solid #b5d4f4; background: #f2f8fe; border-radius: 2mm; page-break-inside: avoid; }
  .basis h2 { font-size: 10.5pt; margin: 0 0 2mm; color: #0c447c; }
  .basis p.intro { font-size: 8.5pt; color: #0c447c; margin: 0 0 3mm; }
  .basis table { width: 100%; border-collapse: collapse; font-size: 9.5pt; }
  .basis td { padding: 1mm 2mm 1mm 0; vertical-align: top; }
  .basis .basis-label { color: #0c447c; font-weight: 600; width: 48mm; }
  .foot { position: fixed; bottom: 0; left: 0; right: 0; border-top: 0.5px solid #999; padding-top: 2mm; font-size: 7.5pt; color: #666; display: flex; justify-content: space-between; gap: 6mm; }
  .foot div { line-height: 1.5; }
</style>
</head>
<body>
  <div class="head">
    <div><img src="${escapeHtml(logoUrl)}" alt="IMPULS Logo" /></div>
    <div class="sender-block">
      <strong>${escapeHtml(INVOICE_SENDER.name)}</strong><br />
      ${escapeHtml(INVOICE_SENDER.addressLine1)}<br />
      ${escapeHtml(INVOICE_SENDER.addressLine2)}<br /><br />
      ${escapeHtml(INVOICE_SENDER.phone)}<br />
      ${escapeHtml(INVOICE_SENDER.fax)}<br /><br />
      ${escapeHtml(INVOICE_SENDER.web)}<br />
      ${escapeHtml(INVOICE_SENDER.email)}
    </div>
  </div>

  <div class="sender-line">${escapeHtml(INVOICE_SENDER.name)} · ${escapeHtml(
    INVOICE_SENDER.addressLine1
  )} · ${escapeHtml(INVOICE_SENDER.addressLine2)}</div>

  <div class="addr-row">
    <div class="recipient">${escapeHtml(recipient.name)}
${escapeHtml(recipient.contact || '')}
${escapeHtml(recipient.addressLine1 || '')}
${escapeHtml(recipient.addressLine2 || '')}</div>
    <div class="right-meta">
      ${debtorNumber ? `Kundennr.: ${escapeHtml(debtorNumber)}<br />` : ''}
      ${escapeHtml(invoiceDate)}
    </div>
  </div>

  <h1>Rechnung Nr.: ${escapeHtml(invoiceNumber)}</h1>
  <p class="subject">Rechnung für den Zeitraum (${escapeHtml(period)}) gemäß § 35a SGB VIII<br />${escapeHtml(
    subjectParts.join(', ')
  )}</p>

  <p>Sehr geehrte Damen und Herren,</p>
  <p>für die Durchführung der oben genannten Maßnahme stellen wir Ihnen wie vereinbart folgende Leistungen in Rechnung:</p>

  <table class="positions">
    <thead>
      <tr><th style="text-align:right">Menge</th><th></th><th style="text-align:right">Satz</th><th></th><th style="text-align:right">Betrag</th><th>Bezeichnung</th></tr>
    </thead>
    <tbody>
      ${positionRows}
      ${correctionRows}
      <tr class="sum">
        <td></td><td></td><td class="num">Summe</td><td class="op">=</td>
        <td class="num">${escapeHtml(formatEuro(total))}</td><td></td>
      </tr>
    </tbody>
  </table>

  <p>Wir bitten Sie, den oben genannten Betrag auf die unten angegebene Kontonummer zu überweisen.</p>
  <p>Wir danken für die freundliche Zusammenarbeit.</p>
  <p class="signer">Mit freundlichen Grüßen<br /><br />${escapeHtml(INVOICE_SENDER.signer)}</p>
  <p class="vat">${escapeHtml(INVOICE_SENDER.vatNote)}</p>
  <p style="font-size:9pt; color:#666;">Fachkraft: ${escapeHtml(guardianName)}</p>

  <div class="basis">
    <h2>Anlage: Berechnungsgrundlage</h2>
    <p class="intro">Regeln dieses Kostenträgers, mit denen die Rechnung berechnet wurde – zur Prüfbarkeit durch die Behörde.</p>
    <table>${basisRows}</table>
  </div>

  <div class="foot">
    <div>${escapeHtml(INVOICE_SENDER.managingDirector)}<br />${escapeHtml(INVOICE_SENDER.register)}</div>
    <div>${escapeHtml(INVOICE_SENDER.taxId)}</div>
    <div>Bankverbindung: ${escapeHtml(INVOICE_SENDER.bankName)}<br />${escapeHtml(INVOICE_SENDER.iban)}</div>
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
