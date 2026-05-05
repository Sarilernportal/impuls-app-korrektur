<template>
  <div class="min-h-full bg-slate-50 px-4 py-5 sm:px-6 lg:px-8">
    <div class="mx-auto flex max-w-7xl flex-col gap-5">
      <section class="rounded-lg bg-impuls-blue p-4 text-white sm:px-5 sm:py-6 shadow-sm">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-sm font-medium text-blue-100">Verwaltung</p>
            <h1 class="mt-1 text-2xl font-bold sm:text-3xl">Abrechnungszentrale</h1>
            <p class="mt-2 max-w-3xl text-sm text-blue-100">
              Dokus und Nachweise der Mitarbeitenden prüfen, fehlende Unterlagen erkennen und Rechnungen vorbereiten.
            </p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              class="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-impuls-blue hover:bg-blue-50"
              @click="navigate('Timesheets')"
            >
              Rechnung aus Nachweisen erstellen
            </button>
            <button
              class="rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/25"
              @click="navigate('Invoices')"
            >
              Rechnungen öffnen
            </button>
          </div>
        </div>
      </section>

      <section
        v-if="localAuthMode && hasOnlyDemoData"
        class="rounded-lg border border-sky-200 bg-sky-50 p-4 text-sm text-sky-800"
      >
        Lokale Vorschau: Es werden Demo-Abrechnungsdaten angezeigt. Produktiv lädt diese Zentrale echte Dokus,
        Nachweise und Rechnungen aus AWS.
      </section>

      <section class="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <button
          v-for="metric in metrics"
          :key="metric.title"
          @click="navigate(metric.route)"
          class="rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm hover:border-blue-200 hover:bg-blue-50"
        >
          <div class="flex items-center justify-between">
            <component
              :is="metric.icon"
              :class="['h-6 w-6', metric.iconClass]"
              aria-hidden="true"
            />
            <span :class="['rounded-full px-2 py-0.5 text-xs font-semibold', metric.badgeClass]">
              {{ metric.badge }}
            </span>
          </div>
          <p class="mt-4 text-3xl font-bold text-slate-900">{{ metric.value }}</p>
          <p class="mt-1 text-sm font-medium text-slate-600">{{ metric.title }}</p>
        </button>
      </section>

      <div class="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(340px,0.6fr)]">
        <section class="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div class="border-b border-slate-200 px-5 py-4">
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 class="text-lg font-semibold text-slate-900">Abrechnungsprüfung</h2>
                <p class="text-sm text-slate-500">Pro Klient, Monat und Mitarbeiter: Was ist abrechenbar?</p>
              </div>
              <button
                class="rounded-lg px-3 py-2 text-sm font-semibold text-impuls-blue hover:bg-blue-50"
                @click="navigate('Timesheets')"
              >
                Alle Nachweise
              </button>
            </div>
          </div>
          <div class="divide-y divide-slate-100">
            <div
              v-if="isLoading"
              class="px-5 py-10 text-center text-sm font-semibold text-slate-500"
            >
              Abrechnungsdaten werden geladen...
            </div>
            <div
              v-else-if="billingRows.length === 0"
              class="px-5 py-10 text-center"
            >
              <p class="text-sm font-semibold text-slate-900">Keine Abrechnungsdaten gefunden</p>
              <p class="mt-1 text-sm text-slate-500">Dokus, Nachweise oder Rechnungen liegen für die aktuelle Ansicht noch nicht vor.</p>
            </div>
            <div
              v-else
              v-for="row in billingRows"
              :key="row.id"
              class="grid gap-3 px-5 py-4 2xl:grid-cols-[minmax(0,1fr)_140px_150px_180px]"
            >
              <div>
                <p class="font-semibold text-slate-900">{{ row.client }}</p>
                <p class="text-sm text-slate-600">{{ row.employee }} · {{ row.carrier }}</p>
              </div>
              <div>
                <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Zeitraum</p>
                <p class="text-sm font-semibold text-slate-800">{{ row.month }}</p>
              </div>
              <div>
                <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Betrag</p>
                <p class="text-sm font-semibold text-slate-800">{{ row.amount }}</p>
              </div>
              <div class="flex items-center justify-between gap-3">
                <span :class="['rounded-full px-2.5 py-1 text-xs font-semibold', row.badgeClass]">
                  {{ row.status }}
                </span>
                <button
                  class="rounded-lg px-3 py-2 text-sm font-semibold text-impuls-blue hover:bg-blue-50"
                  @click="navigate(row.route)"
                >
                  Öffnen
                </button>
              </div>
            </div>
          </div>
        </section>

        <aside class="grid gap-5">
          <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 class="text-lg font-semibold text-slate-900">Ablauf</h2>
            <div class="mt-4 grid gap-3">
              <div
                v-for="step in workflow"
                :key="step.title"
                class="flex gap-3 rounded-lg bg-slate-50 p-3"
              >
                <span :class="['flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg', step.bgClass]">
                  <component
                    :is="step.icon"
                    class="h-5 w-5"
                    aria-hidden="true"
                  />
                </span>
                <div>
                  <p class="font-semibold text-slate-900">{{ step.title }}</p>
                  <p class="text-sm text-slate-600">{{ step.description }}</p>
                </div>
              </div>
            </div>
          </section>

          <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 class="text-lg font-semibold text-slate-900">Schnellzugriff</h2>
            <div class="mt-4 grid gap-2">
              <button
                v-for="link in quickLinks"
                :key="link.title"
                class="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-3 text-left hover:border-blue-200 hover:bg-blue-50"
                @click="navigate(link.route)"
              >
                <span>
                  <span class="block text-sm font-semibold text-slate-900">{{ link.title }}</span>
                  <span class="block text-xs text-slate-500">{{ link.description }}</span>
                </span>
                <ArrowRightIcon
                  class="h-4 w-4 text-slate-400"
                  aria-hidden="true"
                />
              </button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { isLocalAuthMode } from '@/services/authService.js'
import {
  ArrowRightIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentCheckIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'BillingCenter',
  components: {
    ArrowRightIcon,
    BanknotesIcon,
    CheckCircleIcon,
    ClockIcon,
    DocumentCheckIcon,
    DocumentTextIcon,
    ExclamationTriangleIcon
  },
  setup() {
    const router = useRouter()
    const store = useStore()
    const dailyReports = ref([])
    const invoices = ref([])
    const isLoading = ref(false)
    const localAuthMode = isLocalAuthMode
    const timeSheets = ref([])

    const demoDailyReports = [
      createDemoReport({
        id: 'demo-report-billing-1',
        childName: 'Lina',
        childFamilyName: 'Beispiel',
        guardianName: 'Mira',
        guardianFamilyName: 'Demir',
        hourFrom: 9,
        hourTo: 12,
        charged: false,
        flag: null
      }),
      createDemoReport({
        id: 'demo-report-billing-2',
        childName: 'Max',
        childFamilyName: 'Muster',
        guardianName: 'Jonas',
        guardianFamilyName: 'Keller',
        hourFrom: 10,
        hourTo: 12,
        charged: false,
        flag: 'revise'
      })
    ]

    const demoTimeSheets = [
      createDemoTimeSheet({
        id: 'demo-timesheet-billing-1',
        childName: 'Lina',
        childFamilyName: 'Beispiel',
        guardianName: 'Mira',
        guardianFamilyName: 'Demir',
        carrierName: 'Impuls Demo Träger',
        hourFrom: 9,
        hourTo: 12,
        flag: null,
        charged: false
      }),
      createDemoTimeSheet({
        id: 'demo-timesheet-billing-2',
        childName: 'Max',
        childFamilyName: 'Muster',
        guardianName: 'Jonas',
        guardianFamilyName: 'Keller',
        carrierName: 'Jugendamt Mitte',
        hourFrom: 10,
        hourTo: 12,
        flag: 'revise',
        charged: false
      })
    ]

    const demoInvoices = [
      createDemoInvoice({
        id: 'demo-invoice-billing-1',
        internalNumber: 'RE-2026-0501',
        childName: 'Lina',
        childFamilyName: 'Beispiel',
        guardianName: 'Mira',
        guardianFamilyName: 'Demir',
        carrierName: 'Impuls Demo Träger',
        hourFrom: 9,
        hourTo: 12,
        charged: false,
        flag: null
      })
    ]

    onMounted(loadBillingData)

    const sourceDailyReports = computed(() => {
      if (localAuthMode && dailyReports.value.length === 0) {
        return demoDailyReports
      }

      return dailyReports.value
    })

    const sourceTimeSheets = computed(() => {
      if (localAuthMode && timeSheets.value.length === 0) {
        return demoTimeSheets
      }

      return timeSheets.value
    })

    const sourceInvoices = computed(() => {
      if (localAuthMode && invoices.value.length === 0) {
        return demoInvoices
      }

      return invoices.value
    })

    const hasOnlyDemoData = computed(() => dailyReports.value.length === 0 && timeSheets.value.length === 0 && invoices.value.length === 0)

    const readyTimeSheets = computed(() => sourceTimeSheets.value.filter(canInvoiceTimeSheet))
    const flaggedDocuments = computed(() => [
      ...sourceDailyReports.value.filter((report) => report.flag === 'revise'),
      ...sourceTimeSheets.value.filter((timeSheet) => hasReviseReport(timeSheet))
    ])
    const missingDocs = computed(() => sourceTimeSheets.value.filter((timeSheet) => dailyReportItems(timeSheet).length === 0))
    const openInvoices = computed(() => sourceInvoices.value.filter((invoice) => !invoice.charged))

    const metrics = computed(() => [
      {
        title: 'Bereit zur Abrechnung',
        value: readyTimeSheets.value.length,
        badge: 'bereit',
        route: 'Timesheets',
        icon: CheckCircleIcon,
        iconClass: 'text-emerald-500',
        badgeClass: 'bg-emerald-100 text-emerald-700'
      },
      {
        title: 'Nachweise gesamt',
        value: sourceTimeSheets.value.length,
        badge: 'Nachweis',
        route: 'Timesheets',
        icon: ClockIcon,
        iconClass: 'text-amber-500',
        badgeClass: 'bg-amber-100 text-amber-700'
      },
      {
        title: 'Doku fehlt',
        value: missingDocs.value.length,
        badge: 'prüfen',
        route: 'Reports',
        icon: DocumentTextIcon,
        iconClass: 'text-orange-500',
        badgeClass: 'bg-orange-100 text-orange-700'
      },
      {
        title: 'In Prüfung',
        value: flaggedDocuments.value.length,
        badge: 'Päd.',
        route: 'Reports',
        icon: ExclamationTriangleIcon,
        iconClass: 'text-sky-500',
        badgeClass: 'bg-sky-100 text-sky-700'
      },
      {
        title: 'Rechnungen offen',
        value: openInvoices.value.length,
        badge: 'offen',
        route: 'Invoices',
        icon: BanknotesIcon,
        iconClass: 'text-blue-500',
        badgeClass: 'bg-blue-100 text-blue-700'
      }
    ])

    const billingRows = computed(() => {
      const rows = sourceTimeSheets.value.slice(0, 6).map((timeSheet) => {
        const status = timeSheetStatus(timeSheet)
        return {
          id: timeSheet.id,
          client: childName(timeSheet),
          employee: guardianName(timeSheet),
          carrier: carrierName(timeSheet),
          month: documentMonth(timeSheet),
          amount: hoursWorked(dailyReportItems(timeSheet)),
          status: status.label,
          badgeClass: status.badgeClass,
          route: 'Timesheets'
        }
      })

      const invoiceRows = sourceInvoices.value.slice(0, 3).map((invoice) => {
        const status = invoiceStatus(invoice)
        return {
          id: invoice.id,
          client: childName(invoice),
          employee: guardianName(invoice),
          carrier: carrierName(invoice),
          month: documentMonth(invoice),
          amount: hoursWorked(dailyReportItems(invoice)),
          status: status.label,
          badgeClass: status.badgeClass,
          route: 'Invoices'
        }
      })

      return [...rows, ...invoiceRows].slice(0, 8)
    })

    const workflow = [
      {
        title: '1. Doku vorhanden',
        description: 'Mitarbeitende erfassen die pädagogische Leistung.',
        icon: DocumentTextIcon,
        bgClass: 'bg-orange-100 text-orange-700'
      },
      {
        title: '2. Nachweis vollständig',
        description: 'Stunden und Unterschriften werden geprüft.',
        icon: DocumentCheckIcon,
        bgClass: 'bg-emerald-100 text-emerald-700'
      },
      {
        title: '3. Rechnung erstellen',
        description: 'Verwaltung erzeugt die Rechnung aus den Nachweisen.',
        icon: BanknotesIcon,
        bgClass: 'bg-blue-100 text-blue-700'
      }
    ]

    const quickLinks = [
      {
        title: 'Rechnung erstellen',
        description: 'Nachweise auswählen und Rechnung erzeugen',
        route: 'Timesheets'
      },
      {
        title: 'Rechnungen prüfen',
        description: 'Erstellte Rechnungen öffnen',
        route: 'Invoices'
      },
      {
        title: 'Dokumentationen prüfen',
        description: 'Dokus nach Klient und Zeitraum filtern',
        route: 'Reports'
      },
      {
        title: 'Klienten öffnen',
        description: 'Stammdaten und Zuordnungen prüfen',
        route: 'ChildrenOverview'
      }
    ]

    function navigate(routeName) {
      router.push({ name: routeName })
    }

    async function loadBillingData() {
      try {
        isLoading.value = true
        const [reportResponse, timeSheetResponse, invoiceResponse] = await Promise.all([
          store.dispatch('getDailyReportDocuments', {
            nextToken: null
          }),
          store.dispatch('getTimeSheetDocuments', {
            nextToken: null
          }),
          store.dispatch('getInvoiceDocuments', {
            nextToken: null
          })
        ])

        dailyReports.value = reportResponse.items || []
        timeSheets.value = timeSheetResponse.items || []
        invoices.value = invoiceResponse.items || []
      } catch (error) {
        console.log(error)
      } finally {
        isLoading.value = false
      }
    }

    function canInvoiceTimeSheet(timeSheet) {
      return timeSheet.reportType !== 'special' &&
        dailyReportItems(timeSheet).length > 0 &&
        !hasReviseReport(timeSheet) &&
        !hasInvoicedReport(timeSheet)
    }

    function timeSheetStatus(timeSheet) {
      if (hasInvoicedReport(timeSheet)) {
        return {
          label: 'abgerechnet',
          badgeClass: 'bg-orange-100 text-orange-700'
        }
      }
      if (hasReviseReport(timeSheet)) {
        return {
          label: 'in Prüfung',
          badgeClass: 'bg-sky-100 text-sky-700'
        }
      }
      if (dailyReportItems(timeSheet).length === 0) {
        return {
          label: 'Doku fehlt',
          badgeClass: 'bg-orange-100 text-orange-700'
        }
      }

      return {
        label: 'bereit',
        badgeClass: 'bg-emerald-100 text-emerald-700'
      }
    }

    function invoiceStatus(invoice) {
      if (invoice.charged) {
        return {
          label: 'bezahlt',
          badgeClass: 'bg-orange-100 text-orange-700'
        }
      }
      if (hasReviseReport(invoice)) {
        return {
          label: 'Rückfrage',
          badgeClass: 'bg-amber-100 text-amber-700'
        }
      }

      return {
        label: invoice.internalNumber ? 'versandbereit' : 'GF-Prüfung',
        badgeClass: invoice.internalNumber ? 'bg-emerald-100 text-emerald-700' : 'bg-sky-100 text-sky-700'
      }
    }

    function dailyReportItems(document) {
      return document.dailyReport?.items || []
    }

    function hasReviseReport(document) {
      return dailyReportItems(document).some((report) => report.flag === 'revise')
    }

    function hasInvoicedReport(document) {
      return dailyReportItems(document).some((report) => report.charged)
    }

    function childName(document) {
      const name = [document.child?.name, document.child?.familyName].filter(Boolean).join(' ')
      return name || 'Nicht angegeben'
    }

    function guardianName(document) {
      const name = [document.guardian?.name, document.guardian?.familyName].filter(Boolean).join(' ')
      return name || 'Nicht angegeben'
    }

    function carrierName(document) {
      return document.carrier?.name || 'Nicht angegeben'
    }

    function documentMonth(document) {
      const items = dailyReportItems(document)
      const date = items.find((item) => item.documentDate)?.documentDate || document.documentDate || document.createdAt

      if (!date) {
        return document.invoiceMonth && document.invoiceYear ? `${document.invoiceMonth} ${document.invoiceYear}` : 'Keine Angabe'
      }

      return new Date(date).toLocaleString('de-DE', {
        month: 'long',
        year: 'numeric'
      })
    }

    function hoursWorked(reports) {
      const workedHours = reports.reduce((total, report) => {
        if (typeof report.hourFrom !== 'number' || typeof report.hourTo !== 'number') {
          return total
        }

        const minuteFrom = report.minuteFrom || 0
        const minuteTo = report.minuteTo || 0
        const timeFrom = report.hourFrom + minuteFrom / 60
        const timeTo = report.hourTo + minuteTo / 60
        return total + Math.max(timeTo - timeFrom, 0)
      }, 0)

      const hours = Math.floor(workedHours)
      const minutes = Math.round((workedHours % 1) * 60)
      return `${hours}h ${minutes}m`
    }

    function createDemoReport(options) {
      return {
        id: options.id,
        type: 'dailyReport',
        documentDate: new Date().toISOString(),
        flag: options.flag,
        charged: options.charged,
        hourFrom: options.hourFrom,
        minuteFrom: 0,
        hourTo: options.hourTo,
        minuteTo: 0,
        child: {
          id: `${options.id}-child`,
          name: options.childName,
          familyName: options.childFamilyName
        },
        guardian: {
          id: `${options.id}-guardian`,
          name: options.guardianName,
          familyName: options.guardianFamilyName
        }
      }
    }

    function createDemoTimeSheet(options) {
      const report = createDemoReport(options)
      report.charged = options.charged

      return {
        id: options.id,
        type: 'timeSheet',
        reportType: 'standard',
        documentDate: new Date().toISOString(),
        child: report.child,
        guardian: report.guardian,
        carrier: {
          id: `${options.id}-carrier`,
          name: options.carrierName
        },
        dailyReport: {
          items: [report]
        }
      }
    }

    function createDemoInvoice(options) {
      const report = createDemoReport(options)

      return {
        id: options.id,
        type: 'invoice',
        internalNumber: options.internalNumber,
        charged: options.charged,
        invoiceYear: new Date().getFullYear(),
        invoiceMonth: new Date().toLocaleString('de-DE', { month: 'long' }),
        createdAt: new Date().toISOString(),
        child: report.child,
        guardian: report.guardian,
        carrier: {
          id: `${options.id}-carrier`,
          name: options.carrierName
        },
        dailyReport: {
          items: [report]
        }
      }
    }

    return {
      metrics,
      billingRows,
      hasOnlyDemoData,
      isLoading,
      localAuthMode,
      workflow,
      quickLinks,
      navigate
    }
  }
}
</script>
