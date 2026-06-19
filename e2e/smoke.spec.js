import { test, expect } from '@playwright/test'

// End-to-End-Smoke-Tests gegen den Demo-Modus (npm run demo).
// Sie prüfen, dass Login und die zentralen Verwaltungs-Seiten ohne Fehler
// laden – das fängt kaputte Routen/Render-Abstürze, bevor sie produktiv gehen.
//
// Hinweis: Der vollständige transaktionale Ablauf (Doku -> Nachweis ->
// Rechnung *anlegen*) braucht ein echtes Backend und gehört auf eine
// Staging-Umgebung. Im Demo-Modus werden Beispieldaten angezeigt.

async function loginDemo(page) {
  await page.goto('/')
  // Auf der Anmeldeseite den Demo-Zugang öffnen
  const demoButton = page.getByRole('button', { name: 'Demo-App öffnen' })
  await expect(demoButton).toBeVisible()
  await demoButton.click()
  // Nach dem Login landet man in der Abrechnungszentrale
  await expect(page.getByRole('heading', { name: 'Abrechnungszentrale' })).toBeVisible()
}

test('Anmeldeseite zeigt Marke und Wertversprechen', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Teilhabeassistenz · §35a SGB VIII')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Demo-App öffnen' })).toBeVisible()
})

test('Demo-Login führt in die Abrechnungszentrale', async ({ page }) => {
  await loginDemo(page)
})

test('Navigation durch die zentralen Verwaltungs-Seiten', async ({ page }) => {
  await loginDemo(page)

  await page.getByRole('button', { name: 'Betreuer' }).click()
  await expect(page.getByRole('heading', { name: 'Mitarbeiter-Zentrale' })).toBeVisible()

  await page.getByRole('button', { name: 'Träger' }).click()
  await expect(page.getByRole('heading', { name: 'Träger-Zentrale' })).toBeVisible()

  await page.getByRole('button', { name: 'Dokumentationen' }).click()
  await expect(page.getByRole('heading', { name: 'Dokumentationszentrale' })).toBeVisible()
})

test('Filter-Dialog öffnet sich in der Dokumentationszentrale', async ({ page }) => {
  await loginDemo(page)
  await page.getByRole('button', { name: 'Dokumentationen' }).click()
  await expect(page.getByRole('heading', { name: 'Dokumentationszentrale' })).toBeVisible()

  // Klient-Auswahlfeld öffnen -> Suchdialog erscheint
  await page.getByRole('button', { name: /Klient/ }).first().click()
  await expect(page.getByPlaceholder('Nach Namen suchen …')).toBeVisible()
})
