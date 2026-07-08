import { test, expect } from '@playwright/test'

// End-to-End-Tests für das Kostenträger-Formular (/admin/carrier/add-carrier)
// gegen den Demo-Modus. Sichert die Abrechnungsregeln JE BEHÖRDE ab:
// - immer ZWEI Stundensätze (mit Fachkraft / ohne Fachkraft)
// - Krankheits-/Absageregel mit behördeneigenem Prozentsatz bei "teilweise"
// - Adress-Übernahme ("entspricht der Hauptadresse") bleibt erhalten.

async function openCarrierForm(page) {
  await page.goto('/')
  const demoButton = page.getByRole('button', { name: 'Demo-App öffnen' })
  await expect(demoButton).toBeVisible()
  await demoButton.click()
  await page.waitForURL(/\/admin/, { timeout: 15000 })
  await page.goto('/admin/carrier/add-carrier')
  await expect(
    page.getByRole('heading', { name: 'Kostenträger / Jugendamt hinzufügen', exact: true })
  ).toBeVisible()
}

test.describe('Kostenträger-Formular – Abrechnungsregeln je Behörde', () => {
  test('bietet immer zwei Stundensätze: mit und ohne Fachkraft', async ({ page }) => {
    await openCarrierForm(page)

    await expect(page.getByLabel('Stundensatz mit Fachkraft (€)')).toBeVisible()
    await expect(page.getByLabel('Stundensatz ohne Fachkraft (€)')).toBeVisible()
    // Kein einzelner Alt-Stundensatz mehr im Formular
    await expect(page.getByLabel('Stundensatz (€)', { exact: true })).toHaveCount(0)
  })

  test('Krankheitsregel "teilweise" blendet den %-Satz der Behörde ein', async ({ page }) => {
    await openCarrierForm(page)

    const sickSelect = page.getByLabel('Krankheit Kind / Terminabsage')
    await expect(sickSelect).toBeVisible()
    // Vor der Auswahl kein Prozentfeld
    await expect(page.getByLabel('Vergütung Absage (%)')).toHaveCount(0)

    await sickSelect.selectOption('partial')
    const percentField = page.getByLabel('Vergütung Absage (%)')
    await expect(percentField).toBeVisible()
    await expect(page.getByText(/THA-Standard: 30/)).toBeVisible()
    await percentField.fill('50')

    // Andere Regel -> Prozentfeld verschwindet wieder
    await sickSelect.selectOption('full')
    await expect(page.getByLabel('Vergütung Absage (%)')).toHaveCount(0)
  })

  test('Adress-Übernahme "entspricht der Hauptadresse" bleibt erhalten', async ({ page }) => {
    await openCarrierForm(page)

    const takeover = page.getByLabel(/Entspricht der Hauptadresse/)
    await expect(takeover).toBeChecked()
    // Abweichende Rechnungsadresse erst nach Abwahl sichtbar
    await expect(page.getByLabel('Abweichender Name')).toHaveCount(0)
    await takeover.uncheck()
    await expect(page.getByLabel('Abweichender Name')).toBeVisible()
  })
})
