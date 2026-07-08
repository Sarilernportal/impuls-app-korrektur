/*
Clientseitige Druckvorlage für die Tages-Dokumentation (Schulbegleitung).
Bildet das serverseitige Lambda-PDF (createReport.py) als druckbares HTML nach –
funktioniert im Demo UND live über „Drucken → Als PDF speichern".
Layout und Texte folgen dem Original (Impuls-Briefkopf, Info-Tabelle,
Haupttabelle mit Stimmung/Tätigkeit/Tagesbericht/Hausaufgaben/Austausch/
Elternbericht, Unterschrift).
*/

const SENDER = Object.freeze({
  line1: 'Impuls GmbH, Institut für',
  line2: 'Erziehungshilfen und Therapien',
  address: 'Bahnhofstraße 23, 65428 Rüsselsheim',
  contact: 'Tel.: 06142-489 80 80 · Fax: 06142-489 80 37',
  title: 'Dokumentation – Schulbegleitung'
})

const ACTIVITY_LABEL = {
  school: 'Schule',
  helpPlanDiscussion: 'Hilfeplangespräch',
  getToKnowInterview: 'Kennenlerngespräch',
  hospitation: 'Hospitation',
  excursion: 'Ausflug / Klassenfahrt',
  miscellaneous: 'Sonstiges',
  holiday: 'Feiertag',
  vacation: 'Urlaub',
  employeeSickness: 'Krankmeldung',
  other: 'Sonstiges',
  supervision: 'Supervision',
  teamMeeting: 'Teamsitzung'
}

const MOOD = {
  happy: '🙂  gut',
  neutral: '😐  neutral',
  sad: '🙁  belastet',
  sick: '🤒  krank',
  nothing: '–'
}

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

function formatDate(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  const pad = (n) => (n < 10 ? `0${n}` : `${n}`)
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// Baut das komplette Druck-HTML aus einem (Demo- oder echten) Report-Objekt.
export function buildReportHtml(report) {
  const hw = report.homework || {}
  const homeworkCells = [
    { title: 'Deutsch', text: hw.german },
    { title: 'Mathematik', text: hw.maths },
    { title: 'Englisch', text: hw.english }
  ]
  if (hw.individual1?.name && hw.individual1?.value) {
    homeworkCells.push({ title: hw.individual1.name, text: hw.individual1.value })
  }
  if (hw.individual2?.name && hw.individual2?.value) {
    homeworkCells.push({ title: hw.individual2.name, text: hw.individual2.value })
  }

  const mood = report.reportActivity === 'miscellaneous' ? 'nothing' : report.mood
  const homeworkTable = `
    <table class="hw">
      <tr>${homeworkCells.map((c) => `<th>${esc(c.title)}</th>`).join('')}</tr>
      <tr>${homeworkCells.map((c) => `<td>${esc(c.text) || '&nbsp;'}</td>`).join('')}</tr>
    </table>`

  const signature = report.signatureImage
    ? `<img class="sig-img" src="${esc(report.signatureImage)}" alt="Unterschrift" />`
    : '<span class="sig-empty"></span>'

  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8" />
<title>Dokumentation ${esc(fullName(report.child))}</title>
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
  .info td, .info th { border: 0.4px solid #111; padding: 3mm 2mm; vertical-align: top; }
  .info th { font-weight: 700; text-align: left; font-size: 9.5pt; }
  .main { margin-top: 5mm; }
  .main td { border: 0.4px solid #111; padding: 2.5mm 2mm; vertical-align: top; }
  .main .lbl { width: 34%; font-weight: 700; }
  .main .hint { font-size: 8pt; color: #444; font-weight: 400; }
  .main .eltern td { background: #ededed; }
  .hw { margin: 0; } .hw th, .hw td { border: 0.4px solid #111; padding: 1.5mm; font-size: 9.5pt; text-align: left; }
  .hw th { font-weight: 700; }
  .sig { margin-top: 6mm; }
  .sig .row { display: flex; align-items: flex-end; gap: 6mm; border-bottom: 0.4px solid #111; padding-bottom: 1mm; }
  .sig-img { height: 18mm; } .sig-empty { display: inline-block; height: 18mm; }
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
    <tr><th>Name v. Kind</th><th>Name Schulbegleiter</th><th>Schule / Klasse</th></tr>
    <tr>
      <td>${esc(fullName(report.child))}</td>
      <td>${esc(report.schoolguardian || fullName(report.guardian))}</td>
      <td>${esc(report.school || '')}</td>
    </tr>
  </table>

  <table class="main">
    <tr>
      <td class="lbl">Verfassung / Stimmung</td>
      <td>${esc(MOOD[mood] || '–')}</td>
      <td style="width:32%">Datum: ${esc(formatDate(report.documentDate))}</td>
    </tr>
    <tr><td class="lbl">Tätigkeit</td><td colspan="2">${esc(ACTIVITY_LABEL[report.reportActivity] || report.reportActivity || '')}</td></tr>
    <tr>
      <td class="lbl">Tagesbericht<div class="hint">(Positive / schöne Erlebnisse / Reaktion, negative / unschöne Erlebnisse / Reaktion, Sonstiges)</div></td>
      <td colspan="2">${esc(report.report)}</td>
    </tr>
    <tr><td class="lbl">Hausaufgaben</td><td colspan="2">${homeworkTable}</td></tr>
    <tr>
      <td class="lbl">Austausch mit der Schule / LehrerInnen / Fachkräfte<div class="hint">(Abmachungen, Vereinbarungen, Infos, Sonstiges)</div></td>
      <td colspan="2">${esc(report.exchange)}</td>
    </tr>
    <tr class="eltern">
      <td class="lbl">Bericht der Eltern<div class="hint">(Wie war der Nachmittag / Abend / morgens vor der Schule zuhause? Wie war die Hausaufgabenzeit?)</div></td>
      <td colspan="2">${esc(report.parentreport)}</td>
    </tr>
  </table>

  <div class="sig">
    <div class="row"><span>Unterschrift:</span>${signature}</div>
    <div class="cap">Schulbegleitung</div>
  </div>
</body>
</html>`
}

// Öffnet das Druck-HTML in einem neuen Fenster und startet den Druckdialog.
export function openReportPdf(report) {
  const win = window.open('', '_blank')
  if (!win) return false
  win.document.open()
  win.document.write(buildReportHtml(report))
  win.document.close()
  win.focus()
  win.setTimeout(() => win.print(), 350)
  return true
}
