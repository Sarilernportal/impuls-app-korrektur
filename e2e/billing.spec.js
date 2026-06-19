import { test, expect } from '@playwright/test'

// End-to-End-Tests für die Abrechnungszentrale (/admin/billing) gegen den
// Demo-Modus. Sie sichern das visuelle Verhalten im echten Chromium der CI ab:
// Status-/Filterkarten, Prüftabelle (THA-/§35a-Spalten), Überhang-Korrektur,
// Sammelabrechnung und die Unterschriften-Ampel.
//
// Grundlage sind die deterministischen Demo-Daten (u. a. Lina Beispiel,
// Sara Yıldız mit +6 h Überhang, Tom Klein ohne Doku).

async function openBilling(page) {
  await page.goto('/')
  const demoButton = page.getByRole('button', { name: 'Demo-App öffnen' })
  await expect(demoButton).toBeVisible()
  await demoButton.click()
  await page.waitForURL(/\/admin/, { timeout: 15000 })
  await page.goto('/admin/billing')
  await expect(page.getByRole('heading', { name: 'Abrechnungszentrale' })).toBeVisible()
}

test.describe('Abrechnungszentrale', () => {
  test('Prüftabelle rendert die THA-/§35a-Spalten und Klientzeilen', async ({ page }) => {
    await openBilling(page)

    const table = page.getByTestId('billing-table')
    await expect(table).toBeVisible()

    // Alle geforderten Spaltenüberschriften vorhanden
    for (const col of [
      'Klient / Fachkraft',
      'Jugendamt',
      'Monat',
      'h/Wo',
      'Soll',
      'Geleistet',
      'Überhang',
      'Abrechenbar',
      'Betrag',
      'Unterschriften',
      'Status / Aktion'
    ]) {
      await expect(table.getByRole('columnheader', { name: col, exact: false })).toBeVisible()
    }

    // Klient/Fachkraft je Zeile + korrekter Betrag (Lina: 52 h × 45,50 €)
    await expect(table.getByText('Lina Beispiel')).toBeVisible()
    // "Mira Demir" ist in den Demo-Daten mehrfach Fachkraft -> erstes Vorkommen
    await expect(table.getByText('Mira Demir').first()).toBeVisible()
    await expect(table.getByText('2.366,00', { exact: false }).first()).toBeVisible()
  })

  test('Filterkarten filtern die Tabelle konsistent', async ({ page }) => {
    await openBilling(page)

    // "Doku offen" -> nur Tom Klein, kein abrechenbarer Klient
    await page.getByTestId('filter-doku_offen').click()
    await expect(page.getByText('Tom Klein')).toBeVisible()
    await expect(page.getByText('Lina Beispiel')).toHaveCount(0)

    // "Abrechenbar" -> Lina + Sara (Überhang zählt mit), kein Tom
    await page.getByTestId('filter-abrechenbar').click()
    await expect(page.getByText('Lina Beispiel')).toBeVisible()
    await expect(page.getByText('Sara Yıldız')).toBeVisible()
    await expect(page.getByText('Tom Klein')).toHaveCount(0)

    // Übrige Karten sind klickbar und rendern die Tabelle ohne Absturz
    for (const status of ['nachweis_pruefen', 'rechnung_erstellt', 'offen_unbezahlt']) {
      await page.getByTestId('filter-' + status).click()
      await expect(page.getByTestId('billing-table')).toBeVisible()
    }
  })

  test('Überhang-Korrektur bietet die drei Optionen (Sara +6 h)', async ({ page }) => {
    await openBilling(page)
    await page.getByTestId('filter-abrechenbar').click()

    // Sara ist die einzige Überhang-Zeile -> einziger "korrigieren"-Button
    await page.getByTestId('overhang-correct').first().click()

    await expect(page.getByRole('heading', { name: 'Überhang korrigieren' })).toBeVisible()
    await expect(page.getByText('Deckeln', { exact: true })).toBeVisible()
    await expect(page.getByText('Freigeben', { exact: true })).toBeVisible()
    await expect(page.getByText('In Folgemonat verschieben', { exact: true })).toBeVisible()
  })

  test('Sammelabrechnung lässt sich über die Auswahl auslösen', async ({ page }) => {
    await openBilling(page)

    // Alle abrechenbaren Nachweise auswählen -> Button wird aktiv
    await page.getByTestId('select-all').check()
    const batchBtn = page.getByTestId('batch-invoice-btn')
    await expect(batchBtn).toBeEnabled()
    await batchBtn.click()

    // Bestätigungs-Dialog gruppiert pro Kostenträger
    await expect(page.getByRole('heading', { name: 'Ausgewählte abrechnen' })).toBeVisible()
    await expect(page.getByRole('button', { name: /Rechnung(en)? erstellen/ })).toBeVisible()
  })

  test('Unterschriften-Ampel zeigt E/S/F je Zeile', async ({ page }) => {
    await openBilling(page)

    const ampel = page.getByTestId('signatures').first()
    await expect(ampel).toBeVisible()
    await expect(ampel).toContainText('E')
    await expect(ampel).toContainText('S')
    await expect(ampel).toContainText('F')
  })
})
