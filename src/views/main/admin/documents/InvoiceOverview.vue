<template>
  <div class="min-h-full bg-slate-50 px-4 py-5 sm:px-6 lg:px-8">
    <div class="flex w-full flex-col gap-5">
      <section class="rounded-xl bg-gradient-to-br from-impuls-blue via-brand-700 to-brand-900 p-5 text-white shadow-soft sm:px-6 sm:py-7">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-sm font-medium text-blue-100">GF und Verwaltung</p>
            <h1 class="mt-1 text-2xl font-bold sm:text-3xl">Rechnungszentrale</h1>
            <p class="mt-2 max-w-3xl text-sm text-blue-100">
              Echte Rechnungen aus Nachweisen prüfen, offene Läufe sehen und Versand oder Freigabe vorbereiten.
            </p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              class="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-impuls-blue hover:bg-blue-50"
              @click="navigate('Timesheets')"
            >
              Aus Nachweisen erstellen
            </button>
            <button
              class="rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/25"
              @click="navigate('BillingCenter')"
            >
              Abrechnung öffnen
            </button>
          </div>
        </div>
      </section>

      <section
        v-if="localAuthMode && documents.length === 0"
        class="rounded-lg border border-sky-200 bg-sky-50 p-4 text-sm text-sky-800"
      >
        Lokale Vorschau: Es werden Demo-Rechnungen angezeigt. Produktiv lädt diese Seite echte Rechnungen aus AWS.
      </section>

      <section class="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <button
          v-for="metric in metrics"
          :key="metric.title"
          :class="[
            'group rounded-xl border bg-white p-4 text-left shadow-card transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-card-hover',
            activeFilter === metric.filter ? 'border-blue-300 ring-2 ring-blue-100' : 'border-slate-200'
          ]"
          @click="activeFilter = metric.filter"
        >
          <div class="flex items-center justify-between">
            <span :class="['flex h-10 w-10 items-center justify-center rounded-xl', metric.badgeClass]"><component :is="metric.icon" class="h-5 w-5" aria-hidden="true" /></span>
            <span :class="['rounded-full px-2 py-0.5 text-xs font-semibold', metric.badgeClass]">
              {{ metric.badge }}
            </span>
          </div>
          <p class="mt-4 text-3xl font-bold tracking-tight text-slate-900 tabular-nums">{{ metric.value }}</p>
          <p class="mt-1 text-sm font-medium text-slate-600">{{ metric.title }}</p>
        </button>
      </section>

      <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div class="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div class="flex items-center gap-2">
            <DocumentChildSelection
              class="w-full"
              :enableAddButton="true"
              :selectedCarrier="child"
              @child-selected="childSelected"
            />
            <button
              v-if="child"
              class="rounded-lg bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
              @click.prevent="clearChild"
            >
              <ArrowLeftIcon class="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div class="flex items-center gap-2">
            <DocumentGuardianSelection
              class="w-full"
              :enableAddButton="true"
              :selectedCarrier="guardian"
              @guardian-selected="guardianSelected"
            />
            <button
              v-if="guardian"
              class="rounded-lg bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
              @click.prevent="clearGuardian"
            >
              <ArrowLeftIcon class="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div class="flex items-center gap-2">
            <DocumentCarrierSelection
              class="w-full"
              :enableAddButton="true"
              :selectedCarrier="carrier"
              @carrier-selected="carrierSelected"
            />
            <button
              v-if="carrier"
              class="rounded-lg bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
              @click.prevent="clearCarrier"
            >
              <ArrowLeftIcon class="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <DocumentTimespanFilter @time-filter="setDateFilter" />
          <label class="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            <MagnifyingGlassIcon
              class="h-5 w-5 text-slate-400"
              aria-hidden="true"
            />
            <input
              v-model="invoiceNumberFilter"
              type="search"
              class="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              placeholder="Rechnungsnummer suchen"
              @input="invoiceNumberChanged"
            />
          </label>
        </div>
      </section>

      <div class="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.55fr)]">
        <section class="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div class="border-b border-slate-200 px-5 py-4">
            <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 class="text-lg font-semibold text-slate-900">Rechnungslauf</h2>
                <p class="text-sm text-slate-500">Status, Leistung und Nachweisbezug stehen im Vordergrund.</p>
              </div>
              <label class="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <MagnifyingGlassIcon
                  class="h-5 w-5 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  v-model="searchValue"
                  type="search"
                  class="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  placeholder="Klient, Träger oder Status suchen"
                />
              </label>
            </div>
          </div>

          <div
            v-if="isLoading"
            class="px-5 py-10 text-center text-sm font-semibold text-slate-500"
          >
            Rechnungen werden geladen...
          </div>

          <div
            v-else-if="filteredRows.length === 0"
            class="px-5 py-10 text-center"
          >
            <p class="text-sm font-semibold text-slate-900">Keine Rechnungen gefunden</p>
            <p class="mt-1 text-sm text-slate-500">Passe Suche, Rechnungsnummer oder Zeitraumfilter an.</p>
          </div>

          <div
            v-else
            class="divide-y divide-slate-100"
          >
            <article
              v-for="(invoice, index) in filteredRows"
              :key="invoice.id"
              class="grid gap-4 px-5 py-4 2xl:grid-cols-[minmax(0,1fr)_130px_130px_170px]"
            >
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <h3 class="font-semibold text-slate-900">{{ invoiceNumber(invoice) }}</h3>
                  <span :class="['rounded-full px-2.5 py-1 text-xs font-semibold', statusInfo(invoice).badgeClass]">
                    {{ statusInfo(invoice).label }}
                  </span>
                </div>
                <p class="mt-1 text-sm text-slate-600">{{ childName(invoice) }} · {{ carrierName(invoice) }}</p>
              </div>
              <div>
                <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Leistung</p>
                <p class="mt-1 text-sm font-semibold text-slate-800">{{ hoursWorked(invoice) }}</p>
              </div>
              <div>
                <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Zeitraum</p>
                <p class="mt-1 text-sm font-semibold text-slate-800">{{ invoicePeriod(invoice) }}</p>
              </div>
              <div class="flex items-center justify-between gap-2 lg:justify-end">
                <button
                  class="rounded-lg px-3 py-2 text-sm font-semibold text-impuls-blue hover:bg-blue-50"
                  @click="openTimesheets(invoice)"
                >
                  Nachweis
                </button>
                <button
                  class="rounded-lg bg-impuls-blue px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  @click="openInvoice(invoice, index)"
                >
                  Öffnen
                </button>
              </div>
            </article>
          </div>

          <div
            v-if="!isLoading"
            class="border-t border-slate-200 px-5 py-4"
          >
            <pagination-bar
              :page="currentPage"
              :nextPageAvailable="nextToken[currentPage + 1] !== null"
              @to-next="nextPageTapped"
              @to-previous="previousPageTapped"
            />
          </div>
        </section>

        <aside class="grid gap-5">
          <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 class="text-lg font-semibold text-slate-900">GF-Ansicht</h2>
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
            <h2 class="text-lg font-semibold text-slate-900">Leistung im Blick</h2>
            <div class="mt-4 rounded-lg bg-slate-50 p-4">
              <p class="text-3xl font-bold text-slate-900">{{ totalHours }}</p>
              <p class="mt-1 text-sm text-slate-600">Aus den aktuell geladenen Rechnungen berechnet.</p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { isLocalAuthMode } from '@/services/authService.js'
import DocumentCarrierSelection from '@/components/Main/Admin/Documents/DocumentCarrierSelection.vue'
import DocumentChildSelection from '@/components/Main/Admin/Documents/DocumentChildSelection.vue'
import DocumentGuardianSelection from '@/components/Main/Admin/Documents/DocumentGuardianSelection.vue'
import DocumentTimespanFilter from '@/components/Main/Admin/Documents/DocumentTimespanFilter.vue'
import PaginationBar from '@/components/Navigation/PaginationBar.vue'
import {
  ArrowLeftIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentCheckIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  PaperAirplaneIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'InvoiceOverview',
  components: {
    ArrowLeftIcon,
    BanknotesIcon,
    CheckCircleIcon,
    ClockIcon,
    DocumentCarrierSelection,
    DocumentCheckIcon,
    DocumentChildSelection,
    DocumentGuardianSelection,
    DocumentTimespanFilter,
    ExclamationTriangleIcon,
    MagnifyingGlassIcon,
    PaginationBar,
    PaperAirplaneIcon
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const activeFilter = ref('all')
    const carrier = ref(null)
    const child = ref(null)
    const currentPage = ref(0)
    const documents = ref([])
    const endDateFilter = ref(null)
    const guardian = ref(null)
    const invoiceNumberFilter = ref('')
    const isLoading = ref(false)
    const localAuthMode = isLocalAuthMode
    const nextToken = ref({ 0: null })
    const searchValue = ref('')
    const startDateFilter = ref(null)

    const demoInvoices = [
      createDemoInvoice({
        id: 'demo-invoice-1',
        internalNumber: 'RE-2026-0501',
        childName: 'Lina',
        childFamilyName: 'Beispiel',
        guardianName: 'Mira',
        guardianFamilyName: 'Demir',
        carrierName: 'Impuls Demo Träger',
        charged: false,
        flag: null,
        hourFrom: 9,
        hourTo: 12
      }),
      createDemoInvoice({
        id: 'demo-invoice-2',
        internalNumber: 'RE-2026-0502',
        childName: 'Max',
        childFamilyName: 'Muster',
        guardianName: 'Jonas',
        guardianFamilyName: 'Keller',
        carrierName: 'Jugendamt Mitte',
        charged: true,
        flag: null,
        hourFrom: 10,
        hourTo: 12
      })
    ]

    onMounted(getFiltersFromURL)

    const sourceInvoices = computed(() => {
      if (localAuthMode && documents.value.length === 0) {
        return demoInvoices
      }

      return documents.value
    })

    const filteredRows = computed(() => {
      const search = searchValue.value.toLowerCase().trim()
      return sourceInvoices.value.filter((invoice) => {
        const status = statusInfo(invoice)
        const matchesFilter = activeFilter.value === 'all' || status.filter === activeFilter.value
        const matchesSearch = !search || [
          invoiceNumber(invoice),
          childName(invoice),
          guardianName(invoice),
          carrierName(invoice),
          status.label
        ].some((value) => value.toLowerCase().includes(search))

        return matchesFilter && matchesSearch
      })
    })

    const metrics = computed(() => {
      const all = sourceInvoices.value
      const ready = all.filter((invoice) => statusInfo(invoice).filter === 'ready')
      const review = all.filter((invoice) => statusInfo(invoice).filter === 'review')
      const question = all.filter((invoice) => statusInfo(invoice).filter === 'question')
      const paid = all.filter((invoice) => statusInfo(invoice).filter === 'paid')

      return [
        {
          title: 'Rechnungen',
          value: all.length,
          badge: 'alle',
          filter: 'all',
          icon: BanknotesIcon,
          iconClass: 'text-blue-500',
          badgeClass: 'bg-blue-100 text-blue-700'
        },
        {
          title: 'Versandbereit',
          value: ready.length,
          badge: 'senden',
          filter: 'ready',
          icon: PaperAirplaneIcon,
          iconClass: 'text-emerald-500',
          badgeClass: 'bg-emerald-100 text-emerald-700'
        },
        {
          title: 'GF-Prüfung',
          value: review.length,
          badge: 'prüfen',
          filter: 'review',
          icon: ClockIcon,
          iconClass: 'text-sky-500',
          badgeClass: 'bg-sky-100 text-sky-700'
        },
        {
          title: 'Rückfrage',
          value: question.length,
          badge: 'offen',
          filter: 'question',
          icon: ExclamationTriangleIcon,
          iconClass: 'text-amber-500',
          badgeClass: 'bg-amber-100 text-amber-700'
        },
        {
          title: 'Bezahlt',
          value: paid.length,
          badge: 'ok',
          filter: 'paid',
          icon: CheckCircleIcon,
          iconClass: 'text-orange-500',
          badgeClass: 'bg-orange-100 text-orange-700'
        }
      ]
    })

    const totalHours = computed(() => formatHours(sourceInvoices.value.reduce((total, invoice) => total + invoiceHours(invoice), 0)))

    const workflow = [
      {
        title: 'Leistung sehen',
        description: 'GF sieht sofort geladene Rechnungsläufe und Leistungsumfang.',
        icon: BanknotesIcon,
        bgClass: 'bg-blue-100 text-blue-700'
      },
      {
        title: 'Nachweis klären',
        description: 'Jede Rechnung bleibt mit den Nachweisen und Dokus verbunden.',
        icon: DocumentCheckIcon,
        bgClass: 'bg-emerald-100 text-emerald-700'
      },
      {
        title: 'Versand freigeben',
        description: 'Verwaltung erkennt, was raus kann und was hängen bleibt.',
        icon: PaperAirplaneIcon,
        bgClass: 'bg-sky-100 text-sky-700'
      }
    ]

    async function getFiltersFromURL() {
      try {
        isLoading.value = true
        const queryParams = route.query

        if (queryParams.invoiceNumber) {
          invoiceNumberFilter.value = queryParams.invoiceNumber
        }
        if (queryParams.startDate) {
          startDateFilter.value = queryParams.startDate
        }
        if (queryParams.endDate) {
          endDateFilter.value = queryParams.endDate
        }
        if (queryParams.clientID) {
          child.value = await store.dispatch('fetchChildDetails', {
            sub: queryParams.clientID
          })
        }
        if (queryParams.guardianID) {
          guardian.value = await store.dispatch('fetchGuardianDetails', {
            sub: queryParams.guardianID
          })
        }
        if (queryParams.carrierID) {
          carrier.value = await store.dispatch('fetchCarrierDetails', {
            sub: queryParams.carrierID
          })
        }

        setQueryParams()
        await getInvoices(true)
      } catch (error) {
        console.log(error)
      } finally {
        isLoading.value = false
      }
    }

    function setQueryParams() {
      const queryObject = {}

      if (child.value) {
        queryObject.clientID = child.value.id
      }
      if (guardian.value) {
        queryObject.guardianID = guardian.value.id
      }
      if (carrier.value) {
        queryObject.carrierID = carrier.value.id
      }
      if (invoiceNumberFilter.value) {
        queryObject.invoiceNumber = invoiceNumberFilter.value
      }
      if (startDateFilter.value) {
        queryObject.startDate = startDateFilter.value
      }
      if (endDateFilter.value) {
        queryObject.endDate = endDateFilter.value
      }

      router.replace({ path: route.path, query: queryObject })
    }

    async function getInvoices(next) {
      try {
        isLoading.value = true
        const params = {
          startDate: startDateFilter.value,
          endDate: endDateFilter.value,
          nextToken: nextToken.value[currentPage.value]
        }

        if (child.value) {
          params.childID = child.value.id
        }
        if (guardian.value) {
          params.guardianID = guardian.value.id
        }
        if (carrier.value) {
          params.carrierID = carrier.value.id
        }
        if (invoiceNumberFilter.value) {
          params.internalNumber = invoiceNumberFilter.value
        }

        const resp = await store.dispatch('getInvoiceDocuments', params)
        documents.value = resp.items || []

        if (next && !(currentPage.value + 1 in nextToken.value)) {
          nextToken.value[currentPage.value + 1] = resp.nextToken
        }
      } catch (error) {
        console.log(error)
      } finally {
        isLoading.value = false
      }
    }

    async function nextPageTapped() {
      currentPage.value += 1
      await getInvoices(true)
    }

    async function previousPageTapped() {
      if (currentPage.value >= 1) {
        currentPage.value -= 1
        await getInvoices(false)
      }
    }

    function resetPagination() {
      currentPage.value = 0
      nextToken.value = { 0: null }
    }

    async function refetchWithReset() {
      resetPagination()
      setQueryParams()
      await getInvoices(true)
    }

    async function clearChild() {
      child.value = null
      await refetchWithReset()
    }

    async function clearGuardian() {
      guardian.value = null
      await refetchWithReset()
    }

    async function clearCarrier() {
      carrier.value = null
      await refetchWithReset()
    }

    async function childSelected(value) {
      child.value = value
      await refetchWithReset()
    }

    async function guardianSelected(value) {
      guardian.value = value
      await refetchWithReset()
    }

    async function carrierSelected(value) {
      carrier.value = value
      await refetchWithReset()
    }

    async function setDateFilter(event) {
      startDateFilter.value = event.start
      endDateFilter.value = event.end
      await refetchWithReset()
    }

    async function invoiceNumberChanged() {
      await refetchWithReset()
    }

    function navigate(routeName) {
      router.push({ name: routeName })
    }

    function openInvoice(invoice, index) {
      if (invoice.id?.startsWith('demo-')) {
        return
      }

      router.push({
        name: 'InvoiceDetails',
        params: { id: invoice.id },
        query: {
          currentIndex: index,
          invoicesIds: JSON.stringify(filteredRows.value.map((item) => item.id))
        }
      })
    }

    function openTimesheets(invoice) {
      const query = {}

      if (invoice.child?.id) {
        query.clientID = invoice.child.id
      }
      if (invoice.guardian?.id) {
        query.guardianID = invoice.guardian.id
      }

      router.push({
        name: 'Timesheets',
        query
      })
    }

    function statusInfo(invoice) {
      if (invoice.charged) {
        return {
          label: 'bezahlt',
          filter: 'paid',
          badgeClass: 'bg-orange-100 text-orange-700'
        }
      }
      if (flaggedReports(invoice) > 0) {
        return {
          label: 'Rückfrage',
          filter: 'question',
          badgeClass: 'bg-amber-100 text-amber-700'
        }
      }

      return {
        label: invoice.internalNumber ? 'versandbereit' : 'GF-Prüfung',
        filter: invoice.internalNumber ? 'ready' : 'review',
        badgeClass: invoice.internalNumber ? 'bg-emerald-100 text-emerald-700' : 'bg-sky-100 text-sky-700'
      }
    }

    function invoiceNumber(invoice) {
      return invoice.internalNumber || 'Rechnungsnummer offen'
    }

    function childName(invoice) {
      const name = [invoice.child?.name, invoice.child?.familyName].filter(Boolean).join(' ')
      return name || 'Nicht angegeben'
    }

    function guardianName(invoice) {
      const name = [invoice.guardian?.name, invoice.guardian?.familyName].filter(Boolean).join(' ')
      return name || 'Nicht angegeben'
    }

    function carrierName(invoice) {
      return invoice.carrier?.name || 'Nicht angegeben'
    }

    function reports(invoice) {
      return invoice.dailyReport?.items || []
    }

    function flaggedReports(invoice) {
      return reports(invoice).filter((report) => report.flag === 'revise').length
    }

    function invoiceHours(invoice) {
      return reports(invoice).reduce((total, report) => {
        if (typeof report.hourFrom !== 'number' || typeof report.hourTo !== 'number') {
          return total
        }

        const minuteFrom = report.minuteFrom || 0
        const minuteTo = report.minuteTo || 0
        const timeFrom = report.hourFrom + minuteFrom / 60
        const timeTo = report.hourTo + minuteTo / 60
        return total + Math.max(timeTo - timeFrom, 0)
      }, 0)
    }

    function hoursWorked(invoice) {
      return formatHours(invoiceHours(invoice))
    }

    function formatHours(decimalHours) {
      const hours = Math.floor(decimalHours)
      const minutes = Math.round((decimalHours % 1) * 60)
      return `${hours}h ${minutes}m`
    }

    function invoicePeriod(invoice) {
      const dates = reports(invoice)
        .map((report) => report.documentDate)
        .filter(Boolean)
        .map((date) => new Date(date))

      if (dates.length === 0) {
        return invoice.invoiceMonth && invoice.invoiceYear ? `${invoice.invoiceMonth} ${invoice.invoiceYear}` : 'Keine Angabe'
      }

      const start = new Date(Math.min(...dates)).toLocaleDateString('de-DE')
      const end = new Date(Math.max(...dates)).toLocaleDateString('de-DE')
      return start === end ? start : `${start} - ${end}`
    }

    function createDemoInvoice(options) {
      return {
        id: options.id,
        type: 'invoice',
        internalNumber: options.internalNumber,
        charged: options.charged,
        invoiceYear: new Date().getFullYear(),
        invoiceMonth: new Date().toLocaleString('de-DE', { month: 'long' }),
        createdAt: new Date().toISOString(),
        child: {
          id: `${options.id}-child`,
          name: options.childName,
          familyName: options.childFamilyName
        },
        guardian: {
          id: `${options.id}-guardian`,
          name: options.guardianName,
          familyName: options.guardianFamilyName
        },
        carrier: {
          id: `${options.id}-carrier`,
          name: options.carrierName
        },
        dailyReport: {
          items: [
            {
              id: `${options.id}-report`,
              documentDate: new Date().toISOString(),
              hourFrom: options.hourFrom,
              minuteFrom: 0,
              hourTo: options.hourTo,
              minuteTo: 0,
              flag: options.flag
            }
          ]
        }
      }
    }

    return {
      activeFilter,
      carrier,
      carrierName,
      carrierSelected,
      child,
      childName,
      childSelected,
      clearCarrier,
      clearChild,
      clearGuardian,
      currentPage,
      documents,
      filteredRows,
      guardian,
      guardianName,
      guardianSelected,
      hoursWorked,
      invoiceNumber,
      invoiceNumberChanged,
      invoiceNumberFilter,
      invoicePeriod,
      isLoading,
      localAuthMode,
      metrics,
      navigate,
      nextPageTapped,
      nextToken,
      openInvoice,
      openTimesheets,
      previousPageTapped,
      searchValue,
      setDateFilter,
      statusInfo,
      totalHours,
      workflow
    }
  }
}
</script>
