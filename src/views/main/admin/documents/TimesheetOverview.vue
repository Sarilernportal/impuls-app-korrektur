<template>
  <div>
    <success-window
      v-if="invoiceSuccess === 'success'"
      title="Erstellung erfolgreich"
      message="Die Rechnung wurde erfolgreich erstellt."
      :open="invoiceSuccess === 'success'"
      @close="resetInvoiceSuccess"
    />
    <error-window
      v-if="invoiceSuccess === 'error'"
      title="Erstellung fehlgeschlagen"
      message="Die Rechnung konnte nicht erstellt werden. Bitte prüfen Sie die ausgewählten Nachweise."
      :open="invoiceSuccess === 'error'"
      @close="resetInvoiceSuccess"
    />
  </div>

  <div class="min-h-full bg-slate-50 px-4 py-5 sm:px-6 lg:px-8">
    <div class="flex w-full flex-col gap-5">
      <section class="rounded-xl bg-gradient-to-br from-impuls-blue via-brand-700 to-brand-900 p-5 text-white shadow-soft sm:px-6 sm:py-7">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-sm font-medium text-blue-100">Verwaltung</p>
            <h1 class="mt-1 text-2xl font-bold sm:text-3xl">Nachweiszentrale</h1>
            <p class="mt-2 max-w-3xl text-sm text-blue-100">
              Echte Nachweise prüfen, nach Klient/Mitarbeiter/Zeitraum filtern und daraus Rechnungen erstellen.
            </p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              class="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-impuls-blue hover:bg-blue-50"
              @click="openInvoiceModal"
            >
              Rechnung vorbereiten
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
        v-if="localAuthMode && timesheets.length === 0"
        class="rounded-lg border border-sky-200 bg-sky-50 p-4 text-sm text-sky-800"
      >
        Lokale Vorschau: Es werden Demo-Nachweise angezeigt. Produktiv lädt diese Seite echte Nachweise aus AWS.
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
              :selectedChild="child"
              @child-selected="childSelected"
            />
            <button
              v-if="child"
              class="rounded-lg bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
              @click.prevent="clearChild"
            >
              <XMarkIcon class="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div class="flex items-center gap-2">
            <DocumentGuardianSelection
              class="w-full"
              :enableAddButton="true"
              :selectedGuardian="guardian"
              @guardian-selected="guardianSelected"
            />
            <button
              v-if="guardian"
              class="rounded-lg bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
              @click.prevent="clearGuardian"
            >
              <XMarkIcon class="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <DocumentTimespanFilter @time-filter="setDateFilter" />
        </div>
      </section>

      <div class="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.55fr)]">
        <section class="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div class="border-b border-slate-200 px-5 py-4">
            <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 class="text-lg font-semibold text-slate-900">Nachweise abrechnen</h2>
                <p class="text-sm text-slate-500">Nur passende, nicht abgerechnete Standardnachweise können ausgewählt werden.</p>
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
                  placeholder="Klient, Mitarbeiter, Träger oder Status suchen"
                />
              </label>
            </div>
          </div>

          <div
            v-if="isLoading"
            class="px-5 py-10 text-center text-sm font-semibold text-slate-500"
          >
            Nachweise werden geladen...
          </div>

          <div
            v-else-if="filteredTimeSheets.length === 0"
            class="px-5 py-10 text-center"
          >
            <p class="text-sm font-semibold text-slate-900">Keine Nachweise gefunden</p>
            <p class="mt-1 text-sm text-slate-500">Passe Suche, Status oder Zeitraumfilter an.</p>
          </div>

          <div
            v-else
            class="divide-y divide-slate-100"
          >
            <article
              v-for="timeSheet in filteredTimeSheets"
              :key="timeSheet.id"
              class="grid gap-4 px-5 py-4 2xl:grid-cols-[32px_minmax(0,1fr)_125px_150px_160px]"
            >
              <div class="flex items-start pt-1">
                <input
                  v-if="createInvoiceModalOpen"
                  type="checkbox"
                  class="h-5 w-5 rounded border-slate-300 text-impuls-blue focus:ring-impuls-blue"
                  :checked="isSelected(timeSheet)"
                  :disabled="!canSelectTimeSheet(timeSheet)"
                  @change="toggleTimeSheet(timeSheet, $event.target.checked)"
                />
              </div>
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <h3 class="font-semibold text-slate-900">{{ childName(timeSheet) }}</h3>
                  <span :class="['rounded-full px-2.5 py-1 text-xs font-semibold', statusInfo(timeSheet).badgeClass]">
                    {{ statusInfo(timeSheet).label }}
                  </span>
                </div>
                <p class="mt-1 text-sm text-slate-600">{{ guardianName(timeSheet) }} · {{ carrierName(timeSheet) }}</p>
                <p class="mt-1 text-xs text-slate-500">Zeitraum: {{ timeSheetPeriod(timeSheet) }}</p>
              </div>
              <div>
                <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Stunden</p>
                <p class="mt-1 text-sm font-semibold text-slate-800">{{ hoursWorked(timeSheet) }}</p>
              </div>
              <div>
                <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Doku-Abgleich</p>
                <p class="mt-1 text-sm font-semibold text-slate-800">{{ documentationStatus(timeSheet) }}</p>
              </div>
              <div class="flex items-center justify-between gap-2 lg:justify-end">
                <button
                  class="rounded-lg px-3 py-2 text-sm font-semibold text-impuls-blue hover:bg-blue-50"
                  @click="openTimeSheet(timeSheet)"
                >
                  Öffnen
                </button>
                <button
                  class="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  @click="openReports(timeSheet)"
                >
                  Doku
                </button>
              </div>
            </article>
          </div>

          <div
            v-if="!isLoading && !createInvoiceModalOpen"
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
            <h2 class="text-lg font-semibold text-slate-900">Auswahl</h2>
            <div class="mt-4 rounded-lg bg-slate-50 p-4">
              <p class="text-3xl font-bold text-slate-900">{{ invoiceCreationTimeSheets.length }}</p>
              <p class="mt-1 text-sm text-slate-600">Nachweise für diese Rechnung ausgewählt.</p>
              <button
                class="mt-4 w-full rounded-lg bg-impuls-blue px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                :disabled="isLoading"
                @click="openInvoiceModal"
              >
                Nachweise auswählen
              </button>
              <button
                v-if="createInvoiceModalOpen"
                class="mt-2 w-full rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                @click="closeInvoiceCreationModalClicked"
              >
                Auswahl abbrechen
              </button>
            </div>
          </section>

          <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 class="text-lg font-semibold text-slate-900">Regeln</h2>
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

          <InvoiceCreationModal
            v-if="createInvoiceModalOpen"
            :isLoading="isLoading"
            :createEnabled="invoiceCreationEnabled"
            :selectedTimeSheets="invoiceCreationTimeSheets"
            @close-clicked="closeInvoiceCreationModalClicked"
            @create-tapped="createInvoice"
            @overwrite-hours="setOverwriteHours"
            @overwrite-hours-validation="setOverwriteHoursValidation"
            @overwrite-sick-hours="setOverwriteSickHours"
            @overwrite-sick-hours-validation="setOverwriteSickHoursValidation"
            @year-selected="invoiceYearSelected"
            @month-selected="invoiceMonthSelected"
          />
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
import DocumentChildSelection from '@/components/Main/Admin/Documents/DocumentChildSelection.vue'
import DocumentGuardianSelection from '@/components/Main/Admin/Documents/DocumentGuardianSelection.vue'
import DocumentTimespanFilter from '@/components/Main/Admin/Documents/DocumentTimespanFilter.vue'
import InvoiceCreationModal from '@/components/Main/Admin/Documents/InvoiceCreationModal.vue'
import PaginationBar from '@/components/Navigation/PaginationBar.vue'
import ErrorWindow from '@/components/UIComponents/Modals/ErrorWindow.vue'
import SuccessWindow from '@/components/UIComponents/Modals/SuccessWindow.vue'
import {
  XMarkIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentCheckIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'

const blacklistActivities = ['holiday', 'vacation', 'employeeSickness', 'other']

export default {
  name: 'TimesheetOverview',
  components: {
    XMarkIcon,
    BanknotesIcon,
    CheckCircleIcon,
    ClockIcon,
    DocumentCheckIcon,
    DocumentTextIcon,
    DocumentChildSelection,
    DocumentGuardianSelection,
    DocumentTimespanFilter,
    ErrorWindow,
    ExclamationTriangleIcon,
    InvoiceCreationModal,
    MagnifyingGlassIcon,
    PaginationBar,
    SuccessWindow
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const activeFilter = ref('all')
    const child = ref(null)
    const createInvoiceModalOpen = ref(false)
    const currentPage = ref(0)
    const endDateFilter = ref(null)
    const guardian = ref(null)
    const invoiceCreationTimeSheets = ref([])
    const invoiceMonth = ref(new Date().toLocaleString('de-DE', { month: 'long' }))
    const invoiceSuccess = ref('none')
    const invoiceYear = ref(new Date().getFullYear())
    const isLoading = ref(false)
    const localAuthMode = isLocalAuthMode
    const nextToken = ref({ 0: null })
    const overwriteHours = ref(0)
    const overwriteHoursValidation = ref(false)
    const overwriteSickHours = ref(0)
    const overwriteSickHoursValidation = ref(false)
    const searchValue = ref('')
    const startDateFilter = ref(null)
    const timesheets = ref([])

    const demoTimeSheets = [
      createDemoTimeSheet({
        id: 'demo-timesheet-1',
        childName: 'Lina',
        childFamilyName: 'Beispiel',
        guardianName: 'Mira',
        guardianFamilyName: 'Demir',
        carrierName: 'Impuls Demo Träger',
        reportDate: new Date().toISOString(),
        hourFrom: 9,
        hourTo: 12,
        flag: null,
        invoiced: false
      }),
      createDemoTimeSheet({
        id: 'demo-timesheet-2',
        childName: 'Max',
        childFamilyName: 'Muster',
        guardianName: 'Jonas',
        guardianFamilyName: 'Keller',
        carrierName: 'Jugendamt Mitte',
        reportDate: new Date().toISOString(),
        hourFrom: 10,
        hourTo: 12,
        flag: 'revise',
        invoiced: false
      })
    ]

    onMounted(getFiltersFromURL)

    const sourceTimeSheets = computed(() => {
      if (localAuthMode && timesheets.value.length === 0) {
        return demoTimeSheets
      }

      return timesheets.value
    })

    const filteredTimeSheets = computed(() => {
      const search = searchValue.value.toLowerCase().trim()
      return sourceTimeSheets.value.filter((timeSheet) => {
        const status = statusInfo(timeSheet)
        const matchesFilter = activeFilter.value === 'all' || status.filter === activeFilter.value
        const matchesSearch = !search || [
          childName(timeSheet),
          guardianName(timeSheet),
          carrierName(timeSheet),
          status.label,
          documentationStatus(timeSheet)
        ].some((value) => value.toLowerCase().includes(search))

        return matchesFilter && matchesSearch
      })
    })

    const metrics = computed(() => {
      const all = sourceTimeSheets.value
      const ready = all.filter(canSelectTimeSheet)
      const revise = all.filter((timeSheet) => hasReviseReport(timeSheet))
      const invoiced = all.filter((timeSheet) => hasInvoicedReport(timeSheet))
      const missingDocs = all.filter((timeSheet) => dailyReports(timeSheet).length === 0)

      return [
        {
          title: 'Nachweise gesamt',
          value: all.length,
          badge: 'alle',
          filter: 'all',
          icon: DocumentCheckIcon,
          iconClass: 'text-blue-500',
          badgeClass: 'bg-blue-100 text-blue-700'
        },
        {
          title: 'Bereit zur Rechnung',
          value: ready.length,
          badge: 'rechnen',
          filter: 'ready',
          icon: BanknotesIcon,
          iconClass: 'text-emerald-500',
          badgeClass: 'bg-emerald-100 text-emerald-700'
        },
        {
          title: 'Rückfrage',
          value: revise.length,
          badge: 'Päd.',
          filter: 'revise',
          icon: ExclamationTriangleIcon,
          iconClass: 'text-amber-500',
          badgeClass: 'bg-amber-100 text-amber-700'
        },
        {
          title: 'Doku fehlt',
          value: missingDocs.length,
          badge: 'prüfen',
          filter: 'missing',
          icon: DocumentTextIcon,
          iconClass: 'text-orange-500',
          badgeClass: 'bg-orange-100 text-orange-700'
        },
        {
          title: 'Abgerechnet',
          value: invoiced.length,
          badge: 'fertig',
          filter: 'invoiced',
          icon: CheckCircleIcon,
          iconClass: 'text-sky-500',
          badgeClass: 'bg-sky-100 text-sky-700'
        }
      ]
    })

    const invoiceCreationEnabled = computed(() => invoiceCreationTimeSheets.value.length > 0)

    const workflow = [
      {
        title: '1. Gleicher Klient und Träger',
        description: 'Eine Rechnung kann nur passende Nachweise bündeln.',
        icon: DocumentCheckIcon,
        bgClass: 'bg-blue-100 text-blue-700'
      },
      {
        title: '2. Keine Rückfrage',
        description: 'Nachweise mit Doku-Rückgabe oder bereits abgerechneten Dokus bleiben gesperrt.',
        icon: ExclamationTriangleIcon,
        bgClass: 'bg-amber-100 text-amber-700'
      },
      {
        title: '3. Rechnung erstellen',
        description: 'Die vorhandene AWS-Funktion erhält die echten Nachweisobjekte.',
        icon: BanknotesIcon,
        bgClass: 'bg-emerald-100 text-emerald-700'
      }
    ]

    async function getFiltersFromURL() {
      try {
        isLoading.value = true
        const queryParams = route.query

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

        setQueryParams()
        await getTimesheets(true)
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
      if (startDateFilter.value) {
        queryObject.startDate = startDateFilter.value
      }
      if (endDateFilter.value) {
        queryObject.endDate = endDateFilter.value
      }

      router.replace({ path: route.path, query: queryObject })
    }

    async function getTimesheets(next) {
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

        const resp = await store.dispatch('getTimeSheetDocuments', params)
        timesheets.value = resp.items || []

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
      await getTimesheets(true)
    }

    async function previousPageTapped() {
      if (currentPage.value >= 1) {
        currentPage.value -= 1
        await getTimesheets(false)
      }
    }

    function resetPagination() {
      currentPage.value = 0
      nextToken.value = { 0: null }
    }

    async function clearChild() {
      child.value = null
      await refetchWithReset()
    }

    async function clearGuardian() {
      guardian.value = null
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

    async function setDateFilter(event) {
      startDateFilter.value = event.start
      endDateFilter.value = event.end
      await refetchWithReset()
    }

    async function refetchWithReset() {
      resetPagination()
      resetInvoiceCreationData()
      setQueryParams()
      await getTimesheets(true)
    }

    function openInvoiceModal() {
      activeFilter.value = 'ready'
      createInvoiceModalOpen.value = true
    }

    function closeInvoiceCreationModalClicked() {
      invoiceCreationTimeSheets.value = []
      createInvoiceModalOpen.value = false
    }

    function toggleTimeSheet(timeSheet, selected) {
      if (selected && canSelectTimeSheet(timeSheet)) {
        invoiceCreationTimeSheets.value.push(timeSheet)
        return
      }

      invoiceCreationTimeSheets.value = invoiceCreationTimeSheets.value.filter((item) => item.id !== timeSheet.id)
    }

    function isSelected(timeSheet) {
      return invoiceCreationTimeSheets.value.some((item) => item.id === timeSheet.id)
    }

    async function createInvoice() {
      try {
        isLoading.value = true

        await store.dispatch('createInvoice', {
          timeSheets: invoiceCreationTimeSheets.value,
          overwriteHours: overwriteHours.value,
          overwriteHoursValidation: overwriteHoursValidation.value,
          overwriteSickHours: overwriteSickHours.value,
          overwriteSickHoursValidation: overwriteSickHoursValidation.value,
          invoiceYear: invoiceYear.value,
          invoiceMonth: invoiceMonth.value
        })

        invoiceSuccess.value = 'success'
        resetInvoiceCreationData()
        createInvoiceModalOpen.value = false
        resetPagination()
        setQueryParams()
        await getTimesheets(true)
      } catch (error) {
        console.log(error)
        invoiceSuccess.value = 'error'
      } finally {
        isLoading.value = false
      }
    }

    function resetInvoiceCreationData() {
      invoiceCreationTimeSheets.value = []
      overwriteHours.value = 0
      overwriteHoursValidation.value = false
      overwriteSickHours.value = 0
      overwriteSickHoursValidation.value = false
      invoiceYear.value = new Date().getFullYear()
      invoiceMonth.value = new Date().toLocaleString('de-DE', { month: 'long' })
    }

    function setOverwriteHours(value) {
      overwriteHours.value = value
    }

    function setOverwriteHoursValidation(value) {
      overwriteHoursValidation.value = value
    }

    function setOverwriteSickHours(value) {
      overwriteSickHours.value = value
    }

    function setOverwriteSickHoursValidation(value) {
      overwriteSickHoursValidation.value = value
    }

    function invoiceYearSelected(year) {
      invoiceYear.value = year
    }

    function invoiceMonthSelected(month) {
      invoiceMonth.value = month
    }

    function resetInvoiceSuccess() {
      invoiceSuccess.value = 'none'
    }

    function navigate(routeName) {
      router.push({ name: routeName })
    }

    function openTimeSheet(timeSheet) {
      if (timeSheet.id?.startsWith('demo-')) {
        return
      }

      router.push({
        name: 'TimeSheetDetails',
        params: { id: timeSheet.id },
        query: {
          currentIndex: filteredTimeSheets.value.findIndex((item) => item.id === timeSheet.id),
          reportsIds: JSON.stringify(filteredTimeSheets.value.map((item) => item.id))
        }
      })
    }

    function openReports(timeSheet) {
      const query = {}

      if (timeSheet.child?.id) {
        query.clientID = timeSheet.child.id
      }
      if (timeSheet.guardian?.id) {
        query.guardianID = timeSheet.guardian.id
      }

      router.push({
        name: 'Reports',
        query
      })
    }

    function canSelectTimeSheet(timeSheet) {
      try {
        if (timeSheet.reportType === 'special') {
          return false
        }
        if (dailyReports(timeSheet).length <= 0) {
          return false
        }
        if (hasReviseReport(timeSheet) || hasInvoicedReport(timeSheet)) {
          return false
        }

        if (invoiceCreationTimeSheets.value.length > 0) {
          const firstSelected = invoiceCreationTimeSheets.value[0]
          return firstSelected.carrier?.id === timeSheet.carrier?.id && firstSelected.child?.id === timeSheet.child?.id
        }

        return true
      } catch (error) {
        console.log(error)
        return false
      }
    }

    function statusInfo(timeSheet) {
      if (timeSheet.reportType === 'special') {
        return {
          label: 'Sonderzeit',
          filter: 'blocked',
          badgeClass: 'bg-slate-100 text-slate-700'
        }
      }
      if (dailyReports(timeSheet).length <= 0) {
        return {
          label: 'Doku fehlt',
          filter: 'missing',
          badgeClass: 'bg-orange-100 text-orange-700'
        }
      }
      if (hasReviseReport(timeSheet)) {
        return {
          label: 'Rückfrage',
          filter: 'revise',
          badgeClass: 'bg-amber-100 text-amber-700'
        }
      }
      if (hasInvoicedReport(timeSheet)) {
        return {
          label: 'abgerechnet',
          filter: 'invoiced',
          badgeClass: 'bg-sky-100 text-sky-700'
        }
      }

      return {
        label: 'bereit',
        filter: 'ready',
        badgeClass: 'bg-emerald-100 text-emerald-700'
      }
    }

    function dailyReports(timeSheet) {
      return timeSheet.dailyReport?.items || []
    }

    function hasReviseReport(timeSheet) {
      return dailyReports(timeSheet).some((report) => report.flag === 'revise')
    }

    function hasInvoicedReport(timeSheet) {
      return dailyReports(timeSheet).some((report) => report.invoicesDailyReportId !== null && report.invoicesDailyReportId !== undefined)
    }

    function childName(timeSheet) {
      return [timeSheet.child?.name, timeSheet.child?.familyName].filter(Boolean).join(' ') || 'Nicht angegeben'
    }

    function guardianName(timeSheet) {
      return [timeSheet.guardian?.name, timeSheet.guardian?.familyName].filter(Boolean).join(' ') || 'Nicht angegeben'
    }

    function carrierName(timeSheet) {
      return timeSheet.carrier?.name || timeSheet.carrier?.shortName || 'Nicht angegeben'
    }

    function documentationStatus(timeSheet) {
      const count = dailyReports(timeSheet).length

      if (count <= 0) {
        return 'keine Doku'
      }
      if (hasReviseReport(timeSheet)) {
        return 'Rückfrage'
      }
      if (hasInvoicedReport(timeSheet)) {
        return 'bereits genutzt'
      }

      return `${count} Doku${count === 1 ? '' : 's'}`
    }

    function hoursWorked(timeSheet) {
      const workedHours = dailyReports(timeSheet).reduce((total, report) => {
        if (blacklistActivities.includes(report.reportActivity)) {
          return total
        }

        const timeFrom = Number(report.hourFrom || 0) + Number(report.minuteFrom || 0) / 60
        const timeTo = Number(report.hourTo || 0) + Number(report.minuteTo || 0) / 60
        return total + Math.max(timeTo - timeFrom, 0)
      }, 0)

      const hours = Math.floor(workedHours)
      const minutes = Math.round((workedHours % 1) * 60)
      return `${hours}h ${minutes}m`
    }

    function timeSheetPeriod(timeSheet) {
      const dates = dailyReports(timeSheet)
        .map((report) => new Date(report.documentDate))
        .filter((date) => !Number.isNaN(date.getTime()))

      if (dates.length === 0) {
        return 'Keine Angabe'
      }

      const start = new Date(Math.min(...dates)).toLocaleDateString('de-DE')
      const end = new Date(Math.max(...dates)).toLocaleDateString('de-DE')
      return start === end ? start : `${start} - ${end}`
    }

    function createDemoTimeSheet({
      id,
      childName: demoChildName,
      childFamilyName,
      guardianName: demoGuardianName,
      guardianFamilyName,
      carrierName: demoCarrierName,
      reportDate,
      hourFrom,
      hourTo,
      flag,
      invoiced
    }) {
      return {
        id,
        reportType: 'standard',
        createdAt: reportDate,
        child: {
          id: `${id}-child`,
          name: demoChildName,
          familyName: childFamilyName
        },
        guardian: {
          id: `${id}-guardian`,
          name: demoGuardianName,
          familyName: guardianFamilyName
        },
        carrier: {
          id: `${id}-carrier`,
          name: demoCarrierName
        },
        dailyReport: {
          items: [
            {
              id: `${id}-report`,
              documentDate: reportDate,
              hourFrom,
              minuteFrom: 0,
              hourTo,
              minuteTo: 0,
              reportActivity: 'school',
              flag,
              invoicesDailyReportId: invoiced ? `${id}-invoice` : null
            }
          ]
        }
      }
    }

    return {
      activeFilter,
      canSelectTimeSheet,
      carrierName,
      child,
      childName,
      childSelected,
      clearChild,
      clearGuardian,
      closeInvoiceCreationModalClicked,
      createInvoice,
      createInvoiceModalOpen,
      currentPage,
      documentationStatus,
      filteredTimeSheets,
      guardian,
      guardianName,
      guardianSelected,
      hoursWorked,
      invoiceCreationEnabled,
      invoiceCreationTimeSheets,
      invoiceMonthSelected,
      invoiceSuccess,
      invoiceYearSelected,
      isLoading,
      isSelected,
      localAuthMode,
      metrics,
      navigate,
      nextPageTapped,
      nextToken,
      openInvoiceModal,
      openReports,
      openTimeSheet,
      previousPageTapped,
      resetInvoiceSuccess,
      searchValue,
      setDateFilter,
      setOverwriteHours,
      setOverwriteHoursValidation,
      setOverwriteSickHours,
      setOverwriteSickHoursValidation,
      statusInfo,
      timeSheetPeriod,
      timesheets,
      toggleTimeSheet,
      workflow
    }
  }
}
</script>
