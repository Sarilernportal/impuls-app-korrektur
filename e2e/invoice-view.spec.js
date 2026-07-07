import { test, expect } from '@playwright/test'

// End-to-End-Tests für die Rechnungsansicht (Rechnungszentrale): Vorschau vor
// Versand, Rechnungskorrekturen mit Pflicht-Begründung und die
// Berechnungsgrundlage je Kostenträger (Anlage für die Behörde).
//
// Demo-Rechnungen: RE-2026-0501 (JA Groß-Gerau, Krankheit NICHT vergütet,
// Entwurf/korrigierbar) und RE-2026-0502 (JA Mitte, Krankheit voll vergütet,
// bereits bezahlt → nicht korrigierbar).

async function openInvoiceCenter(page) {
  await page.goto('/')
  const demoButton = page.getByRole('button', { name: 'Demo-App öffnen' })
  await expect(demoButton).toBeVisible()
  await demoButton.click()
  await page.waitForURL(/\/admin/, { timeout: 15000 })
  await page.goto('/admin/documents/invoices')
  await expect(page.getByRole('heading', { name: 'Rechnungszentrale' })).toBeVisible()
}

test.describe('Rechnungsansicht', () => {
  test('zeigt Positionen, Empfänger und Berechnungsgrundlage des Kostenträgers', async ({ page }) => {
    await openInvoiceCenter(page)

    await page.getByTestId('invoice-view-btn').first().click()
    const preview = page.getByTestId('invoice-preview')
    await expect(preview).toBeVisible()

    // Empfänger + Positionen
    await expect(preview.getByText('Jugendamt Groß-Gerau')).toBeVisible()
    await expect(preview.getByText('Teilhabeassistenz / Schulbegleitung (§ 35a SGB VIII)')).toBeVisible()
    // Krankheitsposition mit amtsspezifischer Regel (nicht vergütet)
    await expect(preview.getByText('Ausfallzeiten bei Krankheit des Kindes')).toBeVisible()
    await expect(preview.getByText(/werden nicht vergütet/).first()).toBeVisible()

    // Berechnungsgrundlage als Anlage
    const basis = page.getByTestId('calculation-basis')
    await expect(basis).toBeVisible()
    await expect(basis.getByText('Stundensatz')).toBeVisible()
    await expect(basis.getByText(/Leitweg-ID/)).toBeVisible()

    // Druck-/PDF-Funktion (Rechnungsvordruck mit Logo) verfügbar
    await expect(page.getByTestId('print-invoice-btn')).toBeVisible()
  })

  test('Rechnungskorrektur vor Versand: Pflicht-Begründung, Summe passt sich an', async ({ page }) => {
    await openInvoiceCenter(page)

    await page.getByTestId('invoice-view-btn').first().click()
    const preview = page.getByTestId('invoice-preview')
    await expect(preview).toBeVisible()

    // Ausgangsbetrag: 3 h × 45,50 € = 136,50 € (Krankheit nicht vergütet)
    await expect(page.getByTestId('invoice-total')).toContainText('136,50')

    // Korrektur ohne Begründung wird abgewiesen
    await page.getByTestId('add-correction-btn').click()
    await page.locator('#correctionLabel').fill('Kürzung nach Prüfung')
    await page.locator('#correctionAmount').fill('-36.50')
    await page.getByTestId('save-correction-btn').click()
    await expect(preview.getByText(/Begründung ist Pflicht/)).toBeVisible()

    // Mit Begründung wird übernommen und die Summe angepasst
    await page.locator('#correctionReason').fill('Absprache mit Sachbearbeitung vom 15.06.')
    await page.getByTestId('save-correction-btn').click()
    await expect(page.getByTestId('correction-list')).toContainText('Kürzung nach Prüfung')
    await expect(page.getByTestId('invoice-total')).toContainText('100,00')
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
