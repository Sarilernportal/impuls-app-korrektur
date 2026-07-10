import { test, expect } from '@playwright/test'

// Durchgängiger Nutzbarkeits-Test: Jede Hauptseite der Verwaltung wird im
// Demo-Modus geöffnet und muss ohne Absturz laden (Überschrift sichtbar) und
// frei von unbehandelten JS-Fehlern sein. Ergänzt die fachlichen E2E-Tests
// (billing / review-center / guardian-form) um eine breite Erreichbarkeits-
// Abdeckung aller Menüpunkte und Anlege-Formulare.

const OVERVIEWS = [
  { path: '/admin/billing', heading: 'Abrechnung' },
  { path: '/admin/guardian', heading: 'Mitarbeiter' },
  { path: '/admin/children', heading: 'Klienten' },
  { path: '/admin/carrier', heading: 'Kostenträger' },
  { path: '/admin/carrier-contact', heading: 'Kontakte' },
  { path: '/admin/documents/reports', heading: 'Dokumentationen' },
  { path: '/admin/documents/timesheets', heading: 'Nachweise' },
  { path: '/admin/documents/invoices', heading: 'Rechnungen' },
  { path: '/admin/sharebox', heading: 'Sharebox' },
  { path: '/admin/notebox', heading: 'Notebox' },
  { path: '/admin/calendar', heading: 'Kalender' },
  { path: '/admin/user', heading: 'Administratoren' }
]

const FORMS = [
  { path: '/admin/children/add-child', heading: 'Klient hinzufügen' },
  { path: '/admin/carrier/add-carrier', heading: 'Kostenträger / Jugendamt hinzufügen' },
  { path: '/admin/user/add-guardian', heading: 'Betreuer hinzufügen' },
  { path: '/admin/carrier-contact/add-carrier-contact', heading: 'ASD-Fachkraft hinzufügen' }
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
        page.getByRole('heading', { name: item.heading, exact: true }),
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
        page.getByRole('heading', { name: item.heading, exact: true }),
        `Formular ${item.path} muss laden`
      ).toBeVisible()
    }

    expect(pageErrors, `Unbehandelte JS-Fehler: ${pageErrors.join(' | ')}`).toEqual([])
  })
})
