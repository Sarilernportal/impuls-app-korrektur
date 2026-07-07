import { test, expect } from '@playwright/test'

// End-to-End-Smoke-Tests gegen den Demo-Modus (npm run demo).
// Sie prüfen, dass Login und die zentralen Verwaltungs-Seiten ohne Fehler
// laden – das fängt kaputte Routen/Render-Abstürze, bevor sie produktiv gehen.
//
// Hinweis: Der vollständige transaktionale Ablauf (Doku -> Nachweis ->
// Rechnung *anlegen*) braucht ein echtes Backend und gehört auf eine
// Staging-Umgebung. Im Demo-Modus werden Beispieldaten angezeigt.

// Meldet sich über den Demo-Zugang an. Nach dem Login landet man im
// Admin-Bereich (Mitarbeiter-Zentrale) – wir warten nur darauf, dass die
// URL in den /admin-Bereich wechselt.
async function loginDemo(page) {
  await page.goto('/')
  const demoButton = page.getByRole('button', { name: 'Demo-App öffnen' })
  await expect(demoButton).toBeVisible()
  await demoButton.click()
  await page.waitForURL(/\/admin/, { timeout: 15000 })
}

test('Anmeldeseite zeigt Marke und Wertversprechen', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Teilhabeassistenz · §35a SGB VIII')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Demo-App öffnen' })).toBeVisible()
})

test('Demo-Login öffnet den Admin-Bereich', async ({ page }) => {
  await loginDemo(page)
  await expect(page.getByRole('heading', { name: 'Mitarbeiter-Zentrale' })).toBeVisible()
})

test('Demo als Mitarbeiter öffnet die Mitarbeiter-Startseite', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Demo als Mitarbeiter öffnen' }).click()
  await page.waitForURL(/\/guardian/, { timeout: 15000 })
  // Moderner Hellblau-Hero der Mitarbeiter-Startseite
  await expect(page.getByRole('heading', { name: /Hallo/ })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Dokumentation starten' })).toBeVisible()
})

test('Zentrale Verwaltungs-Seiten laden', async ({ page }) => {
  await loginDemo(page)

  await page.goto('/admin/billing')
  await expect(page.getByRole('heading', { name: 'Abrechnungszentrale' })).toBeVisible()

  await page.goto('/admin/carrier')
  await expect(page.getByRole('heading', { name: 'Kostenträger-Zentrale' })).toBeVisible()

  await page.goto('/admin/documents/reports')
  await expect(page.getByRole('heading', { name: 'Dokumentationszentrale' })).toBeVisible()
})

// Hinweis: Das Öffnen der Auswahl-Dialoge (Klient/Betreuer/Träger) lädt die
// Liste aus dem Backend. Dieser interaktive Schritt – und der vollständige
// Ablauf bis zur Rechnung – gehört auf eine Staging-Umgebung mit echtem
// Backend und ist daher hier (Demo-Modus) bewusst nicht als Smoke-Test.
