import { test, expect } from '@playwright/test'

// End-to-End-Tests für die Rechnungsansicht (Rechnungszentrale): Vorschau vor
// Versand, Rechnungskorrekturen mit Pflicht-Begründung und die
// Berechnungsgrundlage je Kostenträger (Anlage für die Behörde).
//
// Demo-Rechnungen: RE-2026-0501 (JA Groß-Gerau mit den ECHTEN Sätzen:
// Fachkraft 55,51 €, Krankmeldung < 24 Std. 42,91 €, jede Meldung abrechenbar;
// Entwurf/korrigierbar) und RE-2026-0502 (JA Mitte, Krankheit voll vergütet,
// bereits bezahlt → nicht korrigierbar).

async function openInvoiceCenter(page) {
  await page.goto('/')
  const demoButton = page.getByRole('button', { name: 'Demo-App öffnen' })
  await expect(demoButton).toBeVisible()
  await demoButton.click()
  await page.waitForURL(/\/admin/, { timeout: 15000 })
  await page.goto('/admin/documents/invoices')
  await expect(page.getByRole('heading', { name: 'Rechnungen', exact: true })).toBeVisible()
}

test.describe('Rechnungsansicht', () => {
  test('zeigt Positionen, Empfänger und Berechnungsgrundlage des Kostenträgers', async ({ page }) => {
    await openInvoiceCenter(page)

    await page.getByTestId('invoice-view-btn').first().click()
    const preview = page.getByTestId('invoice-preview')
    await expect(preview).toBeVisible()

    // Empfänger + Positionen (Labels nach THA-Vorlage, echte GG-Sätze)
    await expect(preview.getByText('Jugendamt Groß-Gerau')).toBeVisible()
    await expect(preview.getByText('Betreuung (Päd. Fachkraft)')).toBeVisible()
    // Krankmeldung < 24 Std. mit eigenem Behörden-Satz (42,91 €)
    await expect(preview.getByText(/Krankmeldung < 24 Std\./).first()).toBeVisible()
    await expect(preview.getByText(/42,91/).first()).toBeVisible()

    // Berechnungsgrundlage als Anlage (inkl. Krankmeldungs- und Pooling-Sätzen)
    const basis = page.getByTestId('calculation-basis')
    await expect(basis).toBeVisible()
    await expect(basis.getByText('Stundensatz', { exact: true })).toBeVisible()
    await expect(basis.getByText(/29,71/)).toBeVisible()
    await expect(basis.getByText(/Pooling 1:2/)).toBeVisible()
    await expect(basis.getByText(/75,49/)).toBeVisible()
    await expect(basis.getByText(/Jede Krankmeldung/)).toBeVisible()
    await expect(basis.getByText(/Leitweg-ID/)).toBeVisible()

    // Druck-/PDF-Funktion (Rechnungsvordruck mit Logo) verfügbar
    await expect(page.getByTestId('print-invoice-btn')).toBeVisible()
  })

  test('Rechnungskorrektur vor Versand: Pflicht-Begründung, Summe passt sich an', async ({ page }) => {
    await openInvoiceCenter(page)

    await page.getByTestId('invoice-view-btn').first().click()
    const preview = page.getByTestId('invoice-preview')
    await expect(preview).toBeVisible()

    // Ausgangsbetrag: 3 h × 55,51 € + 3 h Krankmeldung × 42,91 € = 295,26 €
    await expect(page.getByTestId('invoice-total')).toContainText('295,26')

    // Kürzung ohne Begründung wird abgewiesen (Protokollpflicht)
    await page.getByTestId('add-correction-btn').click()
    await page.locator('#correctionLabel').fill('Kürzung nach Prüfung')
    await page.locator('#correctionAmount').fill('-36.50')
    await page.getByTestId('save-correction-btn').click()
    await expect(preview.getByText(/Begründung Pflicht/)).toBeVisible()

    // Mit Begründung wird übernommen und die Summe angepasst
    await page.locator('#correctionReason').fill('Absprache mit Sachbearbeitung vom 15.06.')
    await page.getByTestId('save-correction-btn').click()
    await expect(page.getByTestId('correction-list')).toContainText('Kürzung nach Prüfung')
    await expect(page.getByTestId('invoice-total')).toContainText('258,76')

    // Zusatzposition wie in der Vorlage (Menge × Einzelbetrag, ohne Begründung)
    await page.getByTestId('add-correction-btn').click()
    await page.locator('#correctionLabel').fill('Bekleidungspauschale')
    await page.locator('#correctionQuantity').fill('2')
    await page.locator('#correctionAmount').fill('30')
    await page.getByTestId('save-correction-btn').click()
    await expect(page.getByTestId('correction-list')).toContainText('Bekleidungspauschale')
    await expect(page.getByTestId('invoice-total')).toContainText('318,76')
  })

  test('bezahlte Rechnung ist nicht mehr korrigierbar (anderes Amt, andere Grundlage)', async ({ page }) => {
    await openInvoiceCenter(page)

    // Zweite Demo-Rechnung (JA Mitte, bezahlt)
    await page.getByTestId('invoice-view-btn').nth(1).click()
    const preview = page.getByTestId('invoice-preview')
    await expect(preview).toBeVisible()

    // Keine Korrektur mehr möglich
    await expect(page.getByTestId('add-correction-btn')).toHaveCount(0)
    await expect(preview.getByText(/Korrekturen sind nicht mehr möglich/)).toBeVisible()

    // Andere Berechnungsgrundlage: Krankheit voll vergütet
    await expect(page.getByTestId('calculation-basis').getByText(/voll vergütet/)).toBeVisible()
  })
})
