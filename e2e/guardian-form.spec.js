import { test, expect } from '@playwright/test'

// End-to-End-Tests für „Betreuer hinzufügen" (/admin/user/add-guardian) gegen
// den Demo-Modus. Sichert Struktur, Label-Korrektur, Pflichtfeld
// Funktion/Tätigkeit und die § 72a-Führungszeugnis-Einsatzsperre im echten
// Chromium der CI ab.

async function openGuardianForm(page) {
  await page.goto('/')
  const demoButton = page.getByRole('button', { name: 'Demo-App öffnen' })
  await expect(demoButton).toBeVisible()
  await demoButton.click()
  await page.waitForURL(/\/admin/, { timeout: 15000 })
  await page.goto('/admin/user/add-guardian')
  await expect(page.getByRole('heading', { name: 'Betreuer hinzufügen', exact: true })).toBeVisible()
}

test.describe('Betreuer hinzufügen', () => {
  test('gliedert sich in die drei Abschnitte und nutzt das Label „Vorname"', async ({ page }) => {
    await openGuardianForm(page)

    await expect(page.getByText('Stammdaten', { exact: true }).first()).toBeVisible()
    await expect(page.getByText('Funktion & Qualifikation')).toBeVisible()
    await expect(page.getByText('Erweitertes Führungszeugnis (§ 72a SGB VIII)')).toBeVisible()

    // Label-Korrektur: „Vorname" statt „Name"
    await expect(page.getByText(/Vorname/).first()).toBeVisible()
    await expect(page.getByText('Name*', { exact: true })).toHaveCount(0)
  })

  test('bietet Funktion/Tätigkeit mit den Betreuungs-Funktionen (keine System-Rollen)', async ({ page }) => {
    await openGuardianForm(page)

    const select = page.locator('#jobFunction')
    await expect(select).toBeVisible()
    await expect(select.locator('option')).toContainText([
      'Bitte wählen',
      'Schulbegleiter:in (THA-Kraft)',
      'Pädagogische Fachkraft',
      'Vertretung / Springer:in'
    ])
  })

  test('§ 72a-Führungszeugnis steuert den Einsatz-Status', async ({ page }) => {
    await openGuardianForm(page)

    // Ohne Vorlage: Sperr-Hinweis sichtbar
    await expect(page.getByText(/Nachweis fehlt/)).toBeVisible()

    // Nach „vorgelegt": einsatzbereit
    await page.getByRole('checkbox').check()
    await expect(page.getByText(/Nachweis liegt vor/)).toBeVisible()
  })

  test('erzwingt Pflichtfeld Funktion/Tätigkeit vor dem Hinzufügen', async ({ page }) => {
    await openGuardianForm(page)

    const submit = page.getByRole('button', { name: 'Hinzufügen' })
    await expect(submit).toBeDisabled()

    // Stammdaten ausfüllen – Button bleibt gesperrt, solange Funktion fehlt
    await page.locator('#name').fill('Max')
    await page.locator('#familyName').fill('Mustermann')
    await page.locator('#email').fill('max.muster@beispiel.de')
    await expect(submit).toBeDisabled()

    // Funktion/Tätigkeit wählen -> Button wird aktiv
    await page.locator('#jobFunction').selectOption({ label: 'Schulbegleiter:in (THA-Kraft)' })
    await expect(submit).toBeEnabled()
  })
})
