/*
Clientseitige Druckvorlage für den Stundennachweis / die Abrechnung der
erbrachten Face-to-Face-Stunden (ambulante pädagogische Leistungen).
Bildet die serverseitigen Lambda-PDFs createTimesheet.py (endgültiger Nachweis)
und createTemporaryTimesheet.py (Vorschau) als druckbares HTML nach –
funktioniert im Demo UND live über „Drucken → Als PDF speichern".

Layout und Texte folgen dem Original 1:1 (Impuls-Briefkopf, Kopfdaten
Hilfeempfänger / Träger-Fachkraft / Beginn der Hilfe / Abrechnungsmonat /
Std. pro Woche, Einzelnachweis-Tabelle mit Datum, Uhrzeit von/bis, Anzahl
Stunden (dezimal) und Aktivität, Gesamtsumme, Unterschrift Klassenlehrer/in).

context.preview === true erzeugt die Vorschau-Variante: geänderter Titel
(„Vorschau …"), kein Unterschriftsbild und ein „VORSCHAU"-Wasserzeichen.
*/

const SENDER = Object.freeze({
  line1: 'Impuls GmbH, Ins. für',
  line2: 'Erziehungshilfen und Therapien',
  address: 'Bahnhofstrasse 23, 65428 Rüsselsheim',
  contact: 'Tel.:06142- 489 80 80- Fax. 06142- 489 80 37',
  title: 'Nachweis/Abrechnung der erbrachten Face-to-Face-Stunden für ambulante pädagogische Leistungen',
  titlePreview: 'Vorschau der erbrachten Face-to-Face-Stunden für ambulante pädagogische Leistungen'
})

// Übersetzung der reportActivity-Schlüssel (deutsch, wie im Python-Dict).
const REPORT_ACTIVITY = {
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

// Wandelt einen ISO-Zeitstempel (…T…Z) in ein deutsches Datum (dd.mm.yyyy).
function formatDate(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  const pad = (n) => (n < 10 ? `0${n}` : `${n}`)
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`
}

// Zahl mit fester Anzahl Nachkommastellen, robust gegen fehlende Werte.
function toFixedSafe(value, digits) {
  const n = Number(value)
  return Number.isFinite(n) ? n.toFixed(digits) : (0).toFixed(digits)
}

// Std. pro Woche: „gemäß Stundenplan" oder Dezimalwert mit 2 Nachkommastellen.
function weeklyHoursLabel(childData) {
  const data = childData || {}
  if (data.weeklyHoursByPlan === true) return 'gemäß Stundenplan'
  return toFixedSafe(data.weeklyHours, 2)
}

/*
Ermittelt aus den Dokumenten die Nachweis-Zeilen und die Gesamtsumme –
identisch zur Python-Logik (Krank-Regel bis 3 Tage mit „Meldezeit kürzer
wie 24 Std", sonst reguläre Betreuung/Aktivität; kranke Tage sonst raus).
*/
function buildRows(documents) {
  const rows = []
  let totalCalcHours = 0
  let sickDayCount = 0

  for (const document of documents || []) {
    const date = formatDate(document.documentDate)
    const hoursDecimal =
      (Number(document.hourTo) || 0) -
      (Number(document.hourFrom) || 0) +
      ((Number(document.minuteTo) || 0) - (Number(document.minuteFrom) || 0)) / 60

    const isSick = document.sick === true
    const notOnTime = document.sickOnTime === false || document.sickOnTime === null || document.sickOnTime === undefined

    if (isSick && notOnTime) {
      sickDayCount += 1
    }

    if (sickDayCount <= 3 && isSick && notOnTime) {
      totalCalcHours += hoursDecimal
      rows.push({
        date,
        hourFrom: document.hourFrom,
        minuteFrom: document.minuteFrom,
        hourTo: document.hourTo,
        minuteTo: document.minuteTo,
        hours: hoursDecimal,
        activity: 'Krank (Meldezeit ist kürzer wie 24 Std)'
      })
    }

    if (isSick === false) {
      totalCalcHours += hoursDecimal
      const activity = document.reportActivity == null
        ? 'Betreuung'
        : (REPORT_ACTIVITY[document.reportActivity] || document.reportActivity)
      rows.push({
        date,
        hourFrom: document.hourFrom,
        minuteFrom: document.minuteFrom,
        hourTo: document.hourTo,
        minuteTo: document.minuteTo,
        hours: hoursDecimal,
        activity
      })
    }
  }

  return { rows, totalCalcHours }
}

// Baut das komplette Druck-HTML aus einem (Demo- oder echten) Timesheet-Objekt.
export function buildTimesheetHtml(context) {
  const ctx = context || {}
  const preview = ctx.preview === true
  const child = ctx.child || {}
  const childData = child.data || {}
  const guardian = child.guardian || {}

  const childName = fullName(childData) || '–'
  const companionName = fullName(guardian) || '–'
  const helpStartDate = esc(child.dateOfRegistration) || '–'
  const monthLabel = [ctx.month, ctx.documentYear].filter((v) => v !== undefined && v !== null && v !== '').join(' ')
  const weeklyHours = weeklyHoursLabel(childData)

  const { rows, totalCalcHours } = buildRows(ctx.documents)

  const bodyRows = rows.length
    ? rows
        .map(
          (r) => `
        <tr>
          <td class="c">${esc(r.date) || '&nbsp;'}</td>
          <td class="c">${esc(r.hourFrom)}</td>
          <td class="c">${esc(r.minuteFrom)}</td>
          <td class="c">${esc(r.hourTo)}</td>
          <td class="c">${esc(r.minuteTo)}</td>
          <td class="c sum-col">${esc(toFixedSafe(r.hours, 2))}</td>
          <td>${esc(r.activity)}</td>
        </tr>`
        )
        .join('')
    : `<tr><td class="c">&nbsp;</td><td class="c">&nbsp;</td><td class="c">&nbsp;</td><td class="c">&nbsp;</td><td class="c">&nbsp;</td><td class="c sum-col">&nbsp;</td><td>&nbsp;</td></tr>`

  const title = preview ? SENDER.titlePreview : SENDER.title

  const signature = preview
    ? ''
    : ctx.signatureImage
      ? `<img class="sig-img" src="${esc(ctx.signatureImage)}" alt="Unterschrift" />`
      : '<span class="sig-empty"></span>'

  const watermark = preview ? '<div class="watermark">VORSCHAU</div>' : ''

  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8" />
<title>Stundennachweis ${esc(childName)}</title>
<style>
  @page { size: A4; margin: 12mm 10mm 12mm 18mm; }
  * { box-sizing: border-box; }
  body { font-family: "Helvetica Neue", Arial, sans-serif; color: #111; font-size: 10pt; margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .head { display: flex; justify-content: space-between; align-items: flex-start; }
  .sender b { font-size: 8.5pt; } .sender p { margin: 0; font-size: 8pt; color: #333; }
  .logo { text-align: right; font-weight: 800; color: #00376b; font-size: 13pt; }
  .logo span { color: #d10019; }
  .title { margin-top: 5mm; text-align: center; font-size: 14pt; font-weight: 800; line-height: 1.25; }
  table { width: 100%; border-collapse: collapse; }
  .kv { margin-top: 5mm; }
  .kv td { padding: 2mm 2mm; vertical-align: middle; font-size: 10pt; }
  .kv .lbl { width: 26%; white-space: nowrap; }
  .kv .box { border: 0.4px solid #111; }
  .kv .right { text-align: right; white-space: nowrap; width: 22%; }
  .proof-head { margin-top: 6mm; font-size: 10pt; }
  .proof-head b { font-weight: 700; } .proof-head .hint { text-align: center; }
  .proof { margin-top: 2mm; }
  .proof th, .proof td { border: 0.4px solid #111; padding: 1.5mm; vertical-align: middle; font-size: 9.5pt; }
  .proof th { font-weight: 700; text-align: center; }
  .proof td.c { text-align: center; }
  .proof .sum-col { background: #dedede; }
  .total { margin-top: 6mm; }
  .total td { padding: 2mm; font-size: 10pt; vertical-align: middle; }
  .total .lbl { text-align: right; font-weight: 700; }
  .total .val { text-align: center; width: 18%; background: #dedede; border-bottom: 0.4px solid #111; }
  .sig { margin-top: 16mm; text-align: center; }
  .sig .line { display: inline-block; min-width: 60mm; border-bottom: 0.4px solid #111; padding-bottom: 1mm; }
  .sig-img { height: 18mm; } .sig-empty { display: inline-block; height: 18mm; min-width: 60mm; }
  .sig .cap { margin-top: 1mm; font-size: 9.5pt; }
  .watermark { position: fixed; top: 45%; left: 0; right: 0; text-align: center; font-size: 70pt; font-weight: 800; color: rgba(200, 30, 40, 0.12); transform: rotate(-24deg); letter-spacing: 8px; z-index: 0; pointer-events: none; }
  body > *:not(.watermark) { position: relative; z-index: 1; }
</style>
</head>
<body>
  ${watermark}
  <div class="head">
    <div class="sender">
      <b>${esc(SENDER.line1)}</b><br /><b>${esc(SENDER.line2)}</b>
      <p style="margin-top:2mm">${esc(SENDER.address)}</p>
      <p>${esc(SENDER.contact)}</p>
    </div>
    <div class="logo">IMPULS<span>▲</span></div>
  </div>

  <div class="title">${esc(title)}</div>

  <table class="kv">
    <tr>
      <td class="lbl">Hilfeempfänger:</td>
      <td class="box">${esc(childName)}</td>
    </tr>
    <tr>
      <td class="lbl">Träger / Fachkraft:</td>
      <td class="box">${esc(companionName)}</td>
    </tr>
    <tr>
      <td class="lbl">Beginn der Hilfe:</td>
      <td class="box">${helpStartDate}</td>
      <td class="right">Abrechnungsmonat:</td>
      <td class="box">${esc(monthLabel) || '–'}</td>
    </tr>
    <tr>
      <td class="lbl">Std. pro Woche</td>
      <td class="box" style="text-align:center; width:22%">${esc(weeklyHours)}</td>
      <td></td>
      <td></td>
    </tr>
  </table>

  <div class="proof-head">
    <table>
      <tr>
        <td style="width:30%"><b>Einzelnachweise:</b></td>
        <td class="hint">(Zeitangaben viertelstunden-genau)</td>
      </tr>
    </table>
  </div>

  <table class="proof">
    <thead>
      <tr>
        <th rowspan="2">Datum</th>
        <th colspan="2">Uhrzeit von</th>
        <th colspan="2">bis</th>
        <th rowspan="2">Anzahl Stunden<br />(dezimal)</th>
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
      ${bodyRows}
    </tbody>
  </table>

  <table class="total">
    <tr>
      <td class="lbl">Gesamtsumme der geleisteten Stunden:</td>
      <td class="val">${esc(toFixedSafe(totalCalcHours, 2))}</td>
    </tr>
  </table>

  <div class="sig">
    ${signature ? `<div class="line">${signature}</div>` : '<div class="line"><span class="sig-empty"></span></div>'}
    <div class="cap">Unterschrift Klassenlehrer/in</div>
  </div>
</body>
</html>`
}

// Öffnet das Druck-HTML in einem neuen Fenster und startet den Druckdialog
// (dort „Als PDF speichern" wählen). context.preview === true → Vorschau.
export function openTimesheetPdf(context) {
  const win = window.open('', '_blank')
  if (!win) return false
  win.document.open()
  win.document.write(buildTimesheetHtml(context))
  win.document.close()
  win.focus()
  win.setTimeout(() => win.print(), 350)
  return true
}
