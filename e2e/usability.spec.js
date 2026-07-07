import { test, expect } from '@playwright/test'

// Durchgängiger Nutzbarkeits-Test: Jede Hauptseite der Verwaltung wird im
// Demo-Modus geöffnet und muss ohne Absturz laden (Überschrift sichtbar) und
// frei von unbehandelten JS-Fehlern sein. Ergänzt die fachlichen E2E-Tests
// (billing / review-center / guardian-form) um eine breite Erreichbarkeits-
// Abdeckung aller Menüpunkte und Anlege-Formulare.

const OVERVIEWS = [
  { path: '/admin/billing', heading: 'Abrechnungszentrale' },
  { path: '/admin/guardian', heading: 'Mitarbeiter-Zentrale' },
  { path: '/admin/children', heading: 'Klienten-Zentrale' },
  { path: '/admin/carrier', heading: 'Kostenträger-Zentrale' },
  { path: '/admin/carrier-contact', heading: 'Kontakt-Zentrale' },
  { path: '/admin/documents/reports', heading: 'Dokumentationszentrale' },
  { path: '/admin/documents/timesheets', heading: 'Nachweiszentrale' },
  { path: '/admin/documents/invoices', heading: 'Rechnungszentrale' },
  { path: '/admin/sharebox', heading: 'Sharebox-Zentrale' },
  { path: '/admin/notebox', heading: 'Notebox-Zentrale' },
  { path: '/admin/calendar', heading: 'Kalender-Zentrale' },
  { path: '/admin/user', heading: 'Administratoren-Zentrale' }
]

const FORMS = [
  { path: '/admin/children/add-child', heading: 'Klient hinzufügen' },
  { path: '/admin/carrier/add-carrier', heading: 'Kostenträger / Jugendamt hinzufügen' },
  { path: '/admin/user/add-guardian', heading: 'Betreuer hinzufügen' },
  { path: '/admin/carrier-contact/add-carrier-contact', heading: 'Kostenträger-Kontakt hinzufügen' }
]

async function loginDemo(page) {
  await page.goto('/')
  const demoButton = page.getByRole('button', { name: 'Demo-App öffnen' })
  await expect(demoButton).toBeVisible()
  await demoButton.click()
  await page.waitForURL(/\/admin/, { timeout: 15000 })
}

test.describe('Nutzbarkeit – alle Hauptseiten', () => {
  test('Übersichtsseiten laden ohne Absturz', async ({ page }) => {
    const pageErrors = []
    page.on('pageerror', (error) => pageErrors.push(error.message))

    await loginDemo(page)

    for (const item of OVERVIEWS) {
      await page.goto(item.path)
      await expect(
        page.getByRole('heading', { name: item.heading }),
        `Übersicht ${item.path} muss laden`
      ).toBeVisible()
    }

    expect(pageErrors, `Unbehandelte JS-Fehler: ${pageErrors.join(' | ')}`).toEqual([])
  })

  test('Anlege-Formulare laden ohne Absturz', async ({ page }) => {
    const pageErrors = []
    page.on('pageerror', (error) => pageErrors.push(error.message))

    await loginDemo(page)

    for (const item of FORMS) {
      await page.goto(item.path)
      await expect(
        page.getByRole('heading', { name: item.heading }),
        `Formular ${item.path} muss laden`
      ).toBeVisible()
    }

    expect(pageErrors, `Unbehandelte JS-Fehler: ${pageErrors.join(' | ')}`).toEqual([])
  })
})
