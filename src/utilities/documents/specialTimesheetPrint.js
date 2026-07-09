/*
Clientseitige Druckvorlage für den „Nachweis/Abrechnung der erbrachten
Sonderzeiten". Bildet das serverseitige Lambda-PDF (createSpecialTimesheet.py)
als druckbares HTML nach – funktioniert im Demo UND live über „Drucken →
Als PDF speichern".

Layout und Texte folgen dem Original (Impuls-Briefkopf, Träger/Fachkraft,
Abrechnungsmonat, Einzelnachweis-Tabelle mit Datum / Uhrzeit von–bis /
Anzahl Stunden (dezimal) / Aktivität, Gesamtsumme, Unterschrift Betreuer/in).
*/

const SENDER = Object.freeze({
  line1: 'Impuls GmbH, Institut für',
  line2: 'Erziehungshilfen und Therapien',
  address: 'Bahnhofstraße 23, 65428 Rüsselsheim',
  contact: 'Tel.: 06142-489 80 80 · Fax: 06142-489 80 37',
  title: 'Nachweis/Abrechnung der erbrachten Sonderzeiten'
})

// Übersetzung der reportActivity (analog createSpecialTimesheet.py).
const ACTIVITY_LABEL = {
  school: 'Schule',
  helpPlanDiscussion: 'Hilfeplangespräch',
  getToKnowInterview: 'Kennenlerngespräch',
  hospitation: 'Hospitation',
  excursion: 'Ausflug / Klassenfahrt',
  holiday: 'Feiertag',
  vacation: 'Urlaub',
  employeeSickness: 'Krankmeldung',
  other: 'Sonstiges',
  supervision: 'Supervision',
  teamMeeting: 'Teamsitzung'
}

// Tätigkeiten, für die keine Zeiten notiert werden (Zeilen mit 0-Werten).
const BLACKLIST = ['holiday', 'vacation', 'employeeSickness', 'other']

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br />')
}

function fullName(person) {
  if (!person) return ''
  return [person.name, person.familyName].filter(Boolean).join(' ')
}

// Formatiert ein ISO-Datum als TT.MM.JJJJ; leere Werte werden zu ''.
function formatDate(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  const pad = (n) => (n < 10 ? `0${n}` : `${n}`)
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`
}

function toNumber(value) {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

// Baut das komplette Druck-HTML aus einem (Demo- oder echten) Timesheet-Objekt.
export function buildSpecialTimesheetHtml(context) {
  const ctx = context || {}
  const guardianName = fullName(ctx.guardian) || '–'
  const month = ctx.month || ''
  const documentYear = ctx.documentYear ?? ''
  const documents = Array.isArray(ctx.documents) ? ctx.documents : []

  let totalCalcHours = 0

  const rows = documents
    .map((document) => {
      const activity = document.reportActivity
      const isBlacklisted = BLACKLIST.includes(activity)
      const activityLabel = ACTIVITY_LABEL[activity] || activity || '–'

      // Datum – bei Urlaub/Krankmeldung mit Enddatum als von–bis.
      let dateText = formatDate(document.documentDate)
      if (
        document.documentEndDate &&
        (activity === 'vacation' || activity === 'employeeSickness')
      ) {
        dateText = `${formatDate(document.documentDate)}\n-\n${formatDate(
          document.documentEndDate
        )}`
      }

      if (isBlacklisted) {
        return `
      <tr>
        <td class="c">${esc(dateText) || '&nbsp;'}</td>
        <td class="c">0</td>
        <td class="c">0</td>
        <td class="c">0</td>
        <td class="c">0</td>
        <td class="c sum">0</td>
        <td>${esc(activityLabel)}</td>
      </tr>`
      }

      const hourFrom = toNumber(document.hourFrom)
      const minuteFrom = toNumber(document.minuteFrom)
      const hourTo = toNumber(document.hourTo)
      const minuteTo = toNumber(document.minuteTo)
      const hoursDecimal = hourTo - hourFrom + (minuteTo - minuteFrom) / 60
      totalCalcHours += hoursDecimal

      return `
      <tr>
        <td class="c">${esc(dateText) || '&nbsp;'}</td>
        <td class="c">${esc(hourFrom)}</td>
        <td class="c">${esc(minuteFrom)}</td>
        <td class="c">${esc(hourTo)}</td>
        <td class="c">${esc(minuteTo)}</td>
        <td class="c sum">${esc(hoursDecimal.toFixed(2))}</td>
        <td>${esc(activityLabel)}</td>
      </tr>`
    })
    .join('')

  const signature = ctx.signatureImage
    ? `<img class="sig-img" src="${esc(ctx.signatureImage)}" alt="Unterschrift" />`
    : '<span class="sig-empty"></span>'

  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8" />
<title>Sonderzeiten ${esc(guardianName)}</title>
<style>
  @page { size: A4; margin: 12mm 10mm 12mm 18mm; }
  * { box-sizing: border-box; }
  body { font-family: "Helvetica Neue", Arial, sans-serif; color: #111; font-size: 10.5pt; margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .head { display: flex; justify-content: space-between; align-items: flex-start; }
  .sender b { font-size: 8.5pt; } .sender p { margin: 0; font-size: 8pt; color: #333; }
  .logo { text-align: right; font-weight: 800; color: #00376b; font-size: 13pt; }
  .logo span { color: #d10019; }
  .title { margin-top: 6mm; font-size: 15pt; font-weight: 800; text-align: center; }
  table { width: 100%; border-collapse: collapse; }
  .info { margin-top: 5mm; }
  .info td { padding: 2mm 2mm; vertical-align: middle; }
  .info .lbl { width: 34%; font-weight: 700; }
  .info .val { border: 0.4px solid #111; }
  .proof-head { margin-top: 6mm; display: flex; align-items: baseline; gap: 4mm; }
  .proof-head b { font-size: 11pt; }
  .proof-head span { font-size: 9.5pt; color: #333; }
  .proof { margin-top: 2mm; }
  .proof th, .proof td { border: 0.4px solid #111; padding: 1.5mm 1.5mm; vertical-align: middle; font-size: 9.5pt; }
  .proof th { font-weight: 700; text-align: center; }
  .proof td.c { text-align: center; }
  .proof .sum { background: #dedede; }
  .total { margin-top: 6mm; }
  .total td { padding: 2mm; vertical-align: middle; }
  .total .lbl { text-align: right; font-weight: 700; }
  .total .val { width: 22mm; text-align: center; background: #dedede; border-bottom: 0.4px solid #111; }
  .sig { margin-top: 12mm; text-align: center; }
  .sig-img { height: 18mm; } .sig-empty { display: inline-block; height: 18mm; }
  .sig .line { display: inline-block; min-width: 60mm; border-bottom: 0.4px solid #111; padding-bottom: 1mm; }
  .sig .cap { text-align: center; font-size: 9pt; margin-top: 1mm; }
</style>
</head>
<body>
  <div class="head">
    <div class="sender">
      <b>${esc(SENDER.line1)}</b><br /><b>${esc(SENDER.line2)}</b>
      <p style="margin-top:2mm">${esc(SENDER.address)}</p>
      <p>${esc(SENDER.contact)}</p>
    </div>
    <div class="logo">IMPULS<span>▲</span></div>
  </div>
  <div class="title">${esc(SENDER.title)}</div>

  <table class="info">
    <tr>
      <td class="lbl">Träger / Fachkraft:</td>
      <td class="val">${esc(guardianName)}</td>
    </tr>
  </table>
  <table class="info" style="margin-top:2mm">
    <tr>
      <td class="lbl">Abrechnungsmonat:</td>
      <td class="val">${esc([month, documentYear].filter((p) => p !== '' && p !== null && p !== undefined).join(' ')) || '–'}</td>
    </tr>
  </table>

  <div class="proof-head">
    <b>Einzelnachweise:</b>
    <span>(Zeitangaben viertelstunden-genau)</span>
  </div>

  <table class="proof">
    <thead>
      <tr>
        <th rowspan="2">Datum</th>
        <th colspan="2">Uhrzeit von</th>
        <th colspan="2">bis</th>
        <th rowspan="2" class="sum">Anzahl Stunden<br />(dezimal)</th>
        <th rowspan="2">Aktivität</th>
      </tr>
      <tr>
        <th>Stunde</th>
        <th>Minuten</th>
        <th>Stunde</th>
        <th>Minuten</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>

  <table class="total">
    <tr>
      <td class="lbl">Gesamtsumme der geleisteten Stunden:</td>
      <td class="val">${esc(totalCalcHours.toFixed(2))}</td>
    </tr>
  </table>

  <div class="sig">
    <span class="line">${signature}</span>
    <div class="cap">Unterschrift Betreuer/in</div>
  </div>
</body>
</html>`
}

// Öffnet das Druck-HTML in einem neuen Fenster und startet den Druckdialog.
export function openSpecialTimesheetPdf(context) {
  const win = window.open('', '_blank')
  if (!win) return false
  win.document.open()
  win.document.write(buildSpecialTimesheetHtml(context))
  win.document.close()
  win.focus()
  win.setTimeout(() => win.print(), 350)
  return true
}
