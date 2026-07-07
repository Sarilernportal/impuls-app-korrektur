import { describe, it, expect } from 'vitest'
import { buildInvoiceHtml, INVOICE_SENDER } from '@/utilities/billing/invoicePrint.js'
import { formatEuro, formatHours } from '@/utilities/billing/invoiceView.js'

function context(overrides = {}) {
  return {
    invoiceNumber: 'RE-2026-0501',
    invoiceDate: '07.07.2026',
    period: 'Juni 2026',
    recordNumber: 'THA-2026-0042',
    recipient: {
      name: 'Jugendamt Groß-Gerau',
      contact: 'z. Hd. Leistungsabrechnung',
      addressLine1: 'Wilhelm-Seipp-Straße 4',
      addressLine2: '64521 Groß-Gerau'
    },
    childName: 'Lina Beispiel',
    guardianName: 'Mira Demir',
    positions: [
      { key: 'tha', label: 'Teilhabeassistenz / Schulbegleitung (§ 35a SGB VIII)', hours: 3, rate: 45.5, amount: 136.5 },
      { key: 'sick', label: 'Ausfallzeiten bei Krankheit des Kindes', hours: 3, rate: 45.5, amount: 0, note: 'nicht vergütet' }
    ],
    corrections: [{ label: 'Kürzung nach Prüfung', amount: -36.5, reason: 'Absprache Sachbearbeitung' }],
    total: 100,
    basis: [
      { label: 'Stundensatz', value: '45,50 € / Std. (aus Bescheid/Fallakte)' },
      { label: 'Krankheit des Kindes', value: 'Krankheitstage des Kindes werden nicht vergütet' }
    ],
    logoUrl: '/assets/logo_main.png',
    formatEuro,
    formatHours,
    ...overrides
  }
}

describe('Rechnungsvordruck (Druck-HTML)', () => {
  it('enthält Briefkopf mit Logo und Absender', () => {
    const html = buildInvoiceHtml(context())
    expect(html).toContain('logo_main.png')
    expect(html).toContain(INVOICE_SENDER.name)
  })
  it('enthält Empfänger, Rechnungsdaten und Aktenzeichen', () => {
    const html = buildInvoiceHtml(context())
    expect(html).toContain('Jugendamt Groß-Gerau')
    expect(html).toContain('Wilhelm-Seipp-Straße 4')
    expect(html).toContain('RE-2026-0501')
    expect(html).toContain('THA-2026-0042')
  })
  it('listet Positionen inkl. Krankheits-Hinweis und Korrektur mit Begründung', () => {
    const html = buildInvoiceHtml(context())
    expect(html).toContain('Teilhabeassistenz / Schulbegleitung')
    expect(html).toContain('nicht vergütet')
    expect(html).toContain('Korrektur: Kürzung nach Prüfung')
    expect(html).toContain('Absprache Sachbearbeitung')
  })
  it('weist Gesamtbetrag und Berechnungsgrundlage aus', () => {
    const html = buildInvoiceHtml(context())
    expect(html).toContain('100,00')
    expect(html).toContain('Anlage: Berechnungsgrundlage')
    expect(html).toContain('Krankheitstage des Kindes werden nicht vergütet')
  })
  it('escaped HTML in Nutzereingaben (kein Einschleusen möglich)', () => {
    const html = buildInvoiceHtml(
      context({ corrections: [{ label: '<script>x</script>', amount: -1, reason: '<b>r</b>' }] })
    )
    expect(html).not.toContain('<script>x</script>')
    expect(html).toContain('&lt;script&gt;')
  })
})
