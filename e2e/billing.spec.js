import { test, expect } from '@playwright/test'

// End-to-End-Tests für die Abrechnungszentrale (/admin/billing) gegen den
// Demo-Modus. Sie sichern das visuelle Verhalten im echten Chromium der CI ab:
// Status-Filter-Chips, Master-Detail (Liste links / Detail rechts),
// Überhang-Korrektur, Sammelabrechnung und die Unterschriften-Ampel.
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
  await expect(page.getByRole('heading', { name: 'Abrechnung', exact: true })).toBeVisible()
}

test.describe('Abrechnungszentrale', () => {
  test('Master-Detail: Liste zeigt Klienten, Detail die Kennzahlen', async ({ page }) => {
    await openBilling(page)

    // Liste (links) mit Klient, Fachkraft und Betrag
    const list = page.getByTestId('billing-list')
    await expect(list).toBeVisible()
    await expect(list.getByText('Lina Beispiel')).toBeVisible()
    await expect(list.getByText('Mira Demir').first()).toBeVisible()
    await expect(list.getByText('2.366,00', { exact: false }).first()).toBeVisible()

    // Detail (rechts) für die vorausgewählte Zeile mit KPI-Feldern
    const detail = page.getByTestId('billing-detail')
    await expect(detail).toBeVisible()
    await expect(detail.getByRole('heading', { name: 'Lina Beispiel', exact: true })).toBeVisible()
    await expect(detail.getByText('2.366,00', { exact: false })).toBeVisible()
    for (const kpi of ['Soll', 'Geleistet', 'Abrechenbar']) {
      await expect(detail.getByText(kpi, { exact: true }).first()).toBeVisible()
    }
  })

  test('Filter-Chips filtern die Liste konsistent', async ({ page }) => {
    await openBilling(page)

    // "Doku offen" -> nur Tom Klein, kein abrechenbarer Klient
    // (der ausgewählte Klient steht in Liste UND Detail -> .first())
    await page.getByTestId('filter-doku_offen').click()
    await expect(page.getByText('Tom Klein').first()).toBeVisible()
    await expect(page.getByText('Lina Beispiel')).toHaveCount(0)

    // "Abrechenbar" -> Lina + Sara (Überhang zählt mit), kein Tom
    await page.getByTestId('filter-abrechenbar').click()
    await expect(page.getByText('Lina Beispiel').first()).toBeVisible()
    await expect(page.getByText('Sara Yıldız').first()).toBeVisible()
    await expect(page.getByText('Tom Klein')).toHaveCount(0)

    // Übrige Chips sind klickbar und rendern die Liste ohne Absturz
    for (const status of ['nachweis_pruefen', 'rechnung_erstellt', 'offen_unbezahlt']) {
      await page.getByTestId('filter-' + status).click()
      await expect(page.getByTestId('billing-list')).toBeVisible()
    }
  })

  test('Überhang-Korrektur bietet die drei Optionen (Sara +6 h)', async ({ page }) => {
    await openBilling(page)
    await page.getByTestId('filter-abrechenbar').click()

    // Sara (einzige Überhang-Zeile) in der Liste auswählen -> Detail zeigt "Korrigieren"
    await page.getByText('Sara Yıldız').first().click()
    await page.getByTestId('overhang-correct').click()

    await expect(page.getByRole('heading', { name: 'Überhang korrigieren', exact: true })).toBeVisible()
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
    await expect(page.getByRole('heading', { name: 'Ausgewählte abrechnen', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: /Rechnung(en)? erstellen/ })).toBeVisible()
  })

  test('Unterschriften-Ampel zeigt E/S/F im Detail', async ({ page }) => {
    await openBilling(page)

    const ampel = page.getByTestId('signatures').first()
    await expect(ampel).toBeVisible()
    await expect(ampel).toContainText('E')
    await expect(ampel).toContainText('S')
    await expect(ampel).toContainText('F')
  })
})
