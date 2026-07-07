import { describe, it, expect } from 'vitest'
import { buildInvoiceHtml, INVOICE_SENDER } from '@/utilities/billing/invoicePrint.js'
import { formatEuro, formatHours } from '@/utilities/billing/invoiceView.js'

function context(overrides = {}) {
  return {
    invoiceNumber: '40',
    invoiceDate: '10.02.2026',
    period: '01.01.2026 – 31.01.2026',
    recordNumber: '51.1.17.1625',
    birthDate: '12.08.2008',
    debtorNumber: '0171450',
    recipient: {
      name: 'Kreis Offenbach',
      contact: 'Wirtschaftliche Jugendhilfe',
      addressLine1: 'Postfach 12 65',
      addressLine2: '63112 Dietzenbach'
    },
    childName: 'Damien Hornung',
    guardianName: 'Mira Demir',
    positions: [
      { key: 'tha', label: 'Betreuung (Päd. Fachkraft)', hours: 3, rate: 45.5, amount: 136.5 },
      { key: 'sick', label: 'Kurzfristige Terminabsage (30% des Stundensatzes)', hours: 3, rate: 13.65, amount: 40.95, note: '' }
    ],
    corrections: [
      { label: 'Bekleidungspauschale', quantity: 1, unitAmount: 60, amount: 60 },
      { label: 'Kürzung nach Prüfung', quantity: 1, unitAmount: -36.5, amount: -36.5, reason: 'Absprache Sachbearbeitung' }
    ],
    total: 160,
    basis: [
      { label: 'Stundensatz', value: '45,50 € / Std. (aus Bescheid/Fallakte)' },
      { label: 'Krankheit des Kindes', value: 'Kurzfristige Terminabsage: 30 % des Stundensatzes (THA-Vorlage)' }
    ],
    logoUrl: '/assets/logo_main.png',
    formatEuro,
    formatHours,
    ...overrides
  }
}

describe('Rechnungsvordruck nach IMPULS-Vorlage', () => {
  it('Briefkopf: Logo + echte Absenderdaten aus der Vorlage', () => {
    const html = buildInvoiceHtml(context())
    expect(html).toContain('logo_main.png')
    expect(html).toContain('IMPULS GmbH')
    expect(html).toContain('Bahnhofstraße 23')
    expect(html).toContain('65428 Rüsselsheim')
    expect(html).toContain('impuls-erziehungshilfen.de')
  })
  it('Empfänger, Kundennummer, Rechnungsnummer und Betreff nach Vorlage', () => {
    const html = buildInvoiceHtml(context())
    expect(html).toContain('Kreis Offenbach')
    expect(html).toContain('Kundennr.: 0171450')
    expect(html).toContain('Rechnung Nr.: 40')
    expect(html).toContain('Rechnung für den Monat')
    expect(html).toContain('gemäß § 35a SGB VIII')
    expect(html).toContain('geb. am 12.08.2008')
    expect(html).toContain('Aktz. 51.1.17.1625')
  })
  it('Tabelle nach Vorlage: Leistungsstunden × Stundensatz = Betrag | Bezeichnung', () => {
    const html = buildInvoiceHtml(context())
    expect(html).toContain('Leistungsstunden')
    expect(html).toContain('Stundensatz')
    expect(html).toContain('Bezeichnung')
    expect(html).toContain('Betreuung (Päd. Fachkraft)')
    expect(html).toContain('Kurzfristige Terminabsage (30% des Stundensatzes)')
    expect(html).toContain('Bekleidungspauschale')
    expect(html).toContain('Kürzung nach Prüfung')
    expect(html).toContain('Absprache Sachbearbeitung')
    expect(html).toContain('Summe')
    expect(html).toContain('160,00')
  })
  it('Einleitung mit Gesamtstunden (gerundet auf Viertelstunden)', () => {
    const html = buildInvoiceHtml(context())
    expect(html).toContain('Leistungsstunden (gerundet auf Viertelstunden)')
    expect(html).toContain('in Rechnung.')
  })
  it('Schlussteil: Zahlungsbitte, Buchhaltung, USt-Befreiung und Fußzeile', () => {
    const html = buildInvoiceHtml(context())
    expect(html).toContain('zu überweisen')
    expect(html).toContain('Buchhaltung Impuls')
    expect(html).toContain('§ 4 Nr. 25 UStG')
    expect(html).toContain('HRB-Nr.: 94700')
    expect(html).toContain('DE61 5105 0015 0107 0942 52')
    expect(html).toContain(INVOICE_SENDER.managingDirector)
  })
  it('enthält die Berechnungsgrundlage als Anlage', () => {
    const html = buildInvoiceHtml(context())
    expect(html).toContain('Anlage: Berechnungsgrundlage')
    expect(html).toContain('30 % des Stundensatzes')
  })
  it('escaped HTML in Nutzereingaben (kein Einschleusen möglich)', () => {
    const html = buildInvoiceHtml(
      context({ corrections: [{ label: '<script>x</script>', quantity: 1, unitAmount: -1, amount: -1, reason: '<b>r</b>' }] })
    )
    expect(html).not.toContain('<script>x</script>')
    expect(html).toContain('&lt;script&gt;')
  })
})
