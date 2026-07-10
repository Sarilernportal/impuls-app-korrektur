import { describe, it, expect } from 'vitest'
import { buildReportHtml } from '@/utilities/documents/reportPrint.js'
import { buildTimesheetHtml } from '@/utilities/documents/timesheetPrint.js'

// Druckvorlagen für Tages-Doku und Stundennachweis (PDF via Drucken-Dialog).
// Sichert ab, dass die aus den Zentralen übergebenen Objekte korrekt gerendert
// werden – inkl. HTML-Escaping (Doku-Texte sind freie Eingaben).

describe('Tages-Doku – Druckvorlage', () => {
  const report = {
    child: { name: 'Lina', familyName: 'Beispiel' },
    guardian: { name: 'Mira', familyName: 'Demir' },
    school: 'Grundschule Groß-Gerau · Klasse 3b',
    reportActivity: 'school',
    mood: 'happy',
    documentDate: '2026-07-01T08:00:00.000Z',
    report: 'Ruhiger Schultag.',
    exchange: 'Abstimmung mit der Klassenlehrerin.',
    parentreport: 'Entspannter Nachmittag.',
    homework: { german: 'Leseübung S. 42', maths: 'AB Einmaleins', english: '–' }
  }

  it('enthält Kind, Begleitung, Schule und Berichtstexte', () => {
    const html = buildReportHtml(report)
    expect(html).toContain('Lina Beispiel')
    expect(html).toContain('Mira Demir')
    expect(html).toContain('Grundschule Groß-Gerau')
    expect(html).toContain('Ruhiger Schultag.')
    expect(html).toContain('Leseübung S. 42')
    expect(html).toContain('Dokumentation – Schulbegleitung')
  })

  it('escapet HTML in freien Texten', () => {
    const html = buildReportHtml({ ...report, report: '<script>alert(1)</script>' })
    expect(html).not.toContain('<script>alert(1)')
    expect(html).toContain('&lt;script&gt;')
  })
})

describe('Stundennachweis – Druckvorlage', () => {
  const context = {
    preview: false,
    child: {
      data: { name: 'Lina', familyName: 'Beispiel', weeklyHours: 15, weeklyHoursByPlan: false },
      guardian: { name: 'Mira', familyName: 'Demir' },
      dateOfRegistration: '01.02.2026'
    },
    month: 'Juni',
    documentYear: 2026,
    documents: [
      { documentDate: '2026-06-02T00:00:00.000Z', hourFrom: 9, minuteFrom: 0, hourTo: 12, minuteTo: 0, sick: false, reportActivity: 'school' }
    ],
    signatureImage: null
  }

  it('enthält Kopfdaten, Monat und die Einzelnachweis-Zeile', () => {
    const html = buildTimesheetHtml(context)
    expect(html).toContain('Lina Beispiel')
    expect(html).toContain('Mira Demir')
    expect(html).toContain('Juni 2026')
    expect(html).toContain('Schule')
    expect(html).toContain('Face-to-Face-Stunden')
  })

  it('Vorschau-Variante trägt Wasserzeichen', () => {
    const html = buildTimesheetHtml({ ...context, preview: true })
    expect(html).toContain('VORSCHAU')
  })
})
