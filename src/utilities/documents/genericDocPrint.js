/*
Einfacher, gebrandeter Dokument-Öffner für die Demo (z. B. Sharebox-Dateien).
Öffnet ein druckbares HTML-Dokument (Impuls-Kopf + Inhalt) in einem neuen Tab.
Kein echter S3-Download – dient als Demo-Ersatz für hinterlegte Dateien.
*/

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br />')
}

export function buildGenericDocHtml({ title, subtitle, body }) {
  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8" />
<title>${esc(title)}</title>
<style>
  @page { size: A4; margin: 20mm; }
  body { font-family: "Helvetica Neue", Arial, sans-serif; color: #111; line-height: 1.5; }
  .logo { font-weight: 800; font-size: 14pt; color: #00376b; }
  .logo span { color: #d10019; }
  h1 { font-size: 17pt; margin: 6mm 0 1mm; }
  .sub { color: #555; font-size: 10pt; margin: 0 0 4mm; }
  hr { border: none; border-top: 0.5px solid #ccc; margin: 4mm 0; }
  p.body { font-size: 11pt; }
</style>
</head>
<body>
  <div class="logo">IMPULS<span>▲</span></div>
  <h1>${esc(title)}</h1>
  <p class="sub">${esc(subtitle || '')}</p>
  <hr />
  <p class="body">${esc(body || '')}</p>
</body>
</html>`
}

export function openGenericDoc(doc) {
  const win = window.open('', '_blank')
  if (!win) return false
  win.document.open()
  win.document.write(buildGenericDocHtml(doc))
  win.document.close()
  win.focus()
  win.setTimeout(() => win.print(), 350)
  return true
}
