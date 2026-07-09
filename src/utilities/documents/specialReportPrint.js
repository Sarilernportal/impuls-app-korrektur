/*
Clientseitige Druckvorlage für den Sonderzeitenbericht (Schulbegleitung).
Bildet das serverseitige Lambda-PDF (createSpecialReport.py) als druckbares HTML nach –
funktioniert im Demo UND live über „Drucken → Als PDF speichern".
Layout und Texte folgen dem Original (Impuls-Briefkopf, Info-Tabelle mit
Berichterteller/in + Datum, Haupttabelle mit Tätigkeit + Begründung, Unterschrift).
*/

const SENDER = Object.freeze({
  line1: 'Impuls GmbH, Ins. für',
  line2: 'Erziehungshilfen und Therapien',
  address: 'Bahnhofstrasse 23, 65428 Rüsselsheim',
  contact: 'Tel.:06142- 489 80 80- Fax. 06142- 489 80 37',
  title: 'Sonderzeitenbericht – Schulbegleitung'
})

const ACTIVITY_LABEL = {
  holiday: 'Feiertag',
  vacation: 'Urlaub',
  employeeSickness: 'Krankmeldung',
  other: 'Sonstiges',
  supervision: 'Supervision',
  teamMeeting: 'Teamsitzung'
}

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br />')
}

// Formatiert ein ISO-Datum als dd.mm.yyyy (analog Python __format__('%d.%m.%Y')).
function formatDay(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  const pad = (n) => (n < 10 ? `0${n}` : `${n}`)
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`
}

function pad2(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return String(value ?? '')
  return n < 10 ? `0${n}` : `${n}`
}

// Baut die Datums-/Zeitangabe passend zur Tätigkeit auf.
function buildDateString(context) {
  const activity = context.reportActivity
  let out = formatDay(context.date)

  if (context.endDate && (activity === 'vacation' || activity === 'employeeSickness')) {
    out = `${formatDay(context.date)} - ${formatDay(context.endDate)}`
  }

  if (activity === 'supervision' || activity === 'teamMeeting') {
    const from = `${context.hourFrom ?? ''}:${pad2(context.minuteFrom)}`
    const to = `${context.hourTo ?? ''}:${pad2(context.minuteTo)}`
    out += `, ${from} - ${to}`
  }

  return out
}

// Baut das komplette Druck-HTML aus einem (Demo- oder echten) Sonderzeiten-Objekt.
export function buildSpecialReportHtml(context) {
  const data = context || {}
  const companion = data.schoolguardian || ''
  const dateString = buildDateString(data)
  const activityLabel = ACTIVITY_LABEL[data.reportActivity] || data.reportActivity || '–'

  const signature = data.signatureImage
    ? `<img class="sig-img" src="${esc(data.signatureImage)}" alt="Unterschrift" />`
    : '<span class="sig-empty"></span>'

  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8" />
<title>Sonderzeitenbericht ${esc(companion)}</title>
<style>
  @page { size: A4; margin: 12mm 10mm 12mm 18mm; }
  * { box-sizing: border-box; }
  body { font-family: "Helvetica Neue", Arial, sans-serif; color: #111; font-size: 10.5pt; margin: 0; }
  .head { display: flex; justify-content: space-between; align-items: flex-start; }
  .sender b { font-size: 8.5pt; } .sender p { margin: 0; font-size: 8pt; color: #333; }
  .title { margin-top: 6mm; font-size: 15pt; font-weight: 800; }
  .logo { text-align: right; font-weight: 800; color: #00376b; font-size: 13pt; }
  .logo span { color: #d10019; }
  table { width: 100%; border-collapse: collapse; }
  .info td, .info th { border: 0.4px solid #111; padding: 3mm 2mm; vertical-align: middle; }
  .info th { font-weight: 700; text-align: left; font-size: 9.5pt; }
  .main { margin-top: 5mm; }
  .main td { border: 0.4px solid #111; padding: 2.5mm 2mm; vertical-align: middle; }
  .main .lbl { width: 34%; font-weight: 700; }
  .main .hint { font-size: 8pt; color: #444; font-weight: 400; }
  .main .justify { text-align: center; }
  .sig { margin-top: 6mm; }
  .sig .row { display: flex; align-items: flex-end; gap: 6mm; border-bottom: 0.4px solid #111; padding-bottom: 1mm; }
  .sig-img { height: 20mm; } .sig-empty { display: inline-block; height: 20mm; }
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

  <table class="info" style="margin-top:5mm">
    <tr><th>Name Berichterteller/in</th><th>Datum</th></tr>
    <tr>
      <td>${esc(companion) || '–'}</td>
      <td>${esc(dateString) || '–'}</td>
    </tr>
  </table>

  <table class="main">
    <tr>
      <td class="lbl">Tätigkeit</td>
      <td class="justify">${esc(activityLabel)}</td>
    </tr>
    <tr>
      <td class="lbl">Begründung<div class="hint">(Ereignisse / Notizen / Sonstiges)</div></td>
      <td>${esc(data.report) || '&nbsp;'}</td>
    </tr>
  </table>

  <div class="sig">
    <div class="row"><span>Unterschrift:</span>${signature}</div>
    <div class="cap">Berichterteller/in</div>
  </div>
</body>
</html>`
}

// Öffnet das Druck-HTML in einem neuen Fenster und startet den Druckdialog.
export function openSpecialReportPdf(context) {
  const win = window.open('', '_blank')
  if (!win) return false
  win.document.open()
  win.document.write(buildSpecialReportHtml(context))
  win.document.close()
  win.focus()
  win.setTimeout(() => win.print(), 350)
  return true
}
