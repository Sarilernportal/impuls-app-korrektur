import { test, expect } from '@playwright/test'

// End-to-End-Tests für die Nachweiszentrale (/admin/documents/timesheets) gegen
// den Demo-Modus. Sichert die Trennung „Prüfen & Freigeben" (keine Rechnung)
// im echten Chromium der CI ab.
//
// Demo-Status: Lina = eingegangen (freigebbar), Sara = in Prüfung (Unterschrift
// fehlt), Max = Rückfrage (Doku zur Überarbeitung).

async function openReviewCenter(page) {
  await page.goto('/')
  const demoButton = page.getByRole('button', { name: 'Demo-App öffnen' })
  await expect(demoButton).toBeVisible()
  await demoButton.click()
  await page.waitForURL(/\/admin/, { timeout: 15000 })
  await page.goto('/admin/documents/timesheets')
  await expect(page.getByRole('heading', { name: 'Nachweise', exact: true })).toBeVisible()
}

test.describe('Nachweiszentrale', () => {
  test('zeigt Prüf-Fokus ohne Rechnungserstellung', async ({ page }) => {
    await openReviewCenter(page)

    // Sammelaktion „Geprüfte freigeben" vorhanden
    await expect(page.getByTestId('release-all-btn')).toBeVisible()
    // Keine Rechnungserstellung mehr hier
    await expect(page.getByRole('button', { name: 'Rechnung vorbereiten' })).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Rechnungen öffnen' })).toHaveCount(0)
  })

  test('Statuskarten filtern die Prüfliste', async ({ page }) => {
    await openReviewCenter(page)

    const table = page.getByTestId('review-table')
    // Rückfrage -> Max sichtbar, Lina nicht
    await page.getByTestId('review-filter-rueckfrage').click()
    await expect(table.getByText('Max Muster')).toBeVisible()
    await expect(table.getByText('Lina Beispiel')).toHaveCount(0)

    // Eingegangen -> Lina sichtbar
    await page.getByTestId('review-filter-eingegangen').click()
    await expect(table.getByText('Lina Beispiel')).toBeVisible()
  })

  test('Freigabe nur bei vollständiger Prüfung möglich', async ({ page }) => {
    await openReviewCenter(page)

    // Nur der eingegangene Nachweis (Lina) ist freigebbar -> genau ein Freigeben-Button
    await expect(page.getByTestId('release-btn')).toHaveCount(1)

    await page.getByTestId('release-btn').click()
    // Erfolgsmeldung des Freigabe-Dialogs (eindeutig ggü. Karten/Badges)
    await expect(page.getByText(/erscheint nun in der Abrechnungszentrale/)).toBeVisible()
  })

  test('„Öffnen" zeigt die Prüfansicht mit Tages-Dokus', async ({ page }) => {
    await openReviewCenter(page)

    await page.getByRole('button', { name: 'Öffnen' }).first().click()
    const dialog = page.getByTestId('review-dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.getByText('Nachweis prüfen')).toBeVisible()
    // Tages-Doku mit Zeit und Tätigkeit sichtbar
    await expect(page.getByTestId('review-reports')).toBeVisible()
    await expect(dialog.getByText('Schulbegleitung').first()).toBeVisible()
    // Freigabe direkt aus dem Dialog (Lina ist freigebbar)
    await expect(page.getByTestId('dialog-release-btn')).toBeVisible()
  })

  test('Unterschriften-Ampel zeigt E/S/F je Zeile', async ({ page }) => {
    await openReviewCenter(page)
    const ampel = page.getByTestId('review-signatures').first()
    await expect(ampel).toBeVisible()
    await expect(ampel).toContainText('E')
    await expect(ampel).toContainText('S')
    await expect(ampel).toContainText('F')
  })
})
