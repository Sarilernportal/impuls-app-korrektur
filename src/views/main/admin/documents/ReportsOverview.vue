<template>
  <div class="min-h-full bg-app-bg px-4 py-5 sm:px-6 lg:px-8">
    <div class="flex w-full flex-col gap-5">
      <section class="rounded-xl bg-gradient-to-br from-impuls-blue via-brand-700 to-brand-900 p-5 text-white shadow-soft sm:px-6 sm:py-7">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-sm font-medium text-blue-100">Päd. Leitung</p>
            <h1 class="mt-1 font-display text-2xl font-black tracking-tight sm:text-3xl">Dokumentationen</h1>
            <p class="mt-2 max-w-3xl text-sm text-blue-100">
              Echte Dokus nach Klient, Mitarbeiter, Zeitraum und Prüfstatus ansehen, bevor die Abrechnung weiterläuft.
            </p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              class="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-impuls-blue hover:bg-blue-50"
              @click="navigate('ReportCreateEmpty')"
            >
              Doku nachtragen
            </button>
          </div>
        </div>
      </section>

      <section
        v-if="localAuthMode && reports.length === 0"
        class="rounded-lg border border-sky-200 bg-sky-50 p-4 text-sm text-sky-800"
      >
        Lokale Vorschau: Es werden Demo-Dokus angezeigt. Produktiv lädt diese Seite echte Dokumentationen aus AWS.
      </section>

      <section class="flex flex-wrap gap-2">
        <button
          v-for="metric in metrics"
          :key="metric.title"
          :class="[
            'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition',
            activeFilter === metric.filter
              ? 'border-impuls-blue bg-blue-50 text-impuls-blue'
              : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200'
          ]"
          @click="activeFilter = metric.filter"
        >
          {{ metric.title }}
          <span :class="['rounded-full px-2 py-0.5 text-xs font-bold tabular-nums', metric.badgeClass]">{{ metric.value }}</span>
        </button>
      </section>

      <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
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

      <!-- Master-Detail: Dokuliste links, Detail rechts (DESIGN.md) -->
      <div class="grid gap-4 lg:grid-cols-[minmax(320px,400px)_1fr] lg:items-start">
        <!-- Liste -->
        <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
          <div class="border-b border-slate-200 p-3">
            <label class="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <MagnifyingGlassIcon class="h-5 w-5 text-slate-400" aria-hidden="true" />
              <input
                v-model="searchValue"
                type="search"
                class="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                placeholder="Klient, Mitarbeiter oder Status suchen"
              />
            </label>
          </div>

          <div v-if="isLoading" class="px-5 py-10 text-center text-sm font-semibold text-slate-500">
            Dokumentationen werden geladen...
          </div>
          <div v-else-if="filteredReports.length === 0" class="px-5 py-10 text-center">
            <p class="text-sm font-semibold text-slate-900">Keine Dokumentationen gefunden</p>
            <p class="mt-1 text-sm text-slate-500">Passe Suche, Status oder Zeitraumfilter an.</p>
          </div>

          <div v-else data-testid="report-list" class="max-h-[72vh] overflow-auto">
            <button
              v-for="report in filteredReports"
              :key="report.id"
              type="button"
              @click="selectReport(report)"
              :class="['flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 text-left transition', selectedReport && selectedReport.id === report.id ? 'bg-blue-50' : 'hover:bg-slate-50']"
            >
              <InitialsAvatar :name="childName(report)" size-class="h-9 w-9 text-xs" />
              <span class="min-w-0 flex-1">
                <span :class="['block truncate font-display font-bold', selectedReport && selectedReport.id === report.id ? 'text-impuls-blue' : 'text-slate-900']">{{ childName(report) }}</span>
                <span class="block truncate text-xs text-slate-500">{{ guardianName(report) }} · {{ reportDate(report) }}</span>
              </span>
              <span :class="['shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold', statusInfo(report).badgeClass]">{{ statusInfo(report).label }}</span>
            </button>
          </div>

          <div v-if="!isLoading" class="border-t border-slate-200 px-5 py-4">
            <pagination-bar
              :page="currentPage"
              :nextPageAvailable="nextToken[currentPage + 1] !== null"
              @to-next="nextPageTapped"
              @to-previous="previousPageTapped"
            />
          </div>
        </div>

        <!-- Detail -->
        <div v-if="selectedReport" data-testid="report-detail" class="rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <h2 class="font-display text-xl font-black tracking-tight text-slate-900">{{ childName(selectedReport) }}</h2>
              <p class="mt-0.5 text-sm text-slate-500">{{ guardianName(selectedReport) }} · {{ activityLabel(selectedReport) }}</p>
            </div>
            <span :class="['shrink-0 rounded-lg px-3 py-1 text-xs font-semibold', statusInfo(selectedReport).badgeClass]">{{ statusInfo(selectedReport).label }}</span>
          </div>

          <div class="mt-5 grid gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 sm:grid-cols-2">
            <div class="bg-white px-4 py-4">
              <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Datum</p>
              <p class="mt-1 text-sm font-semibold tabular-nums text-slate-800">{{ reportDate(selectedReport) }}</p>
            </div>
            <div class="bg-white px-4 py-4">
              <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Zeit</p>
              <p class="mt-1 text-sm font-semibold tabular-nums text-slate-800">{{ hoursWorked(selectedReport) }}</p>
            </div>
            <div class="bg-white px-4 py-4">
              <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Mitarbeiter</p>
              <p class="mt-1 break-words text-sm font-semibold text-slate-800">{{ guardianName(selectedReport) }}</p>
            </div>
            <div class="bg-white px-4 py-4">
              <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Leistung</p>
              <p class="mt-1 break-words text-sm font-semibold text-slate-800">{{ activityLabel(selectedReport) }}</p>
            </div>
          </div>

          <div class="mt-5 flex flex-wrap gap-2">
            <button class="rounded-lg bg-impuls-blue px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700" @click="openReport(selectedReport, selectedReportIndex)">Doku prüfen</button>
            <button
              data-testid="report-pdf-btn"
              class="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              @click="printReport(selectedReport)"
            >
              Als PDF
            </button>
            <button class="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" @click="openTimesheets(selectedReport)">Nachweis</button>
          </div>

          <div class="mt-6 border-t border-slate-100 pt-4">
            <p class="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Schnellzugriff</p>
            <div class="grid gap-2 sm:grid-cols-2">
              <button
                v-for="link in quickLinks"
                :key="link.title"
                class="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5 text-left hover:border-blue-200 hover:bg-blue-50"
                @click="navigate(link.route)"
              >
                <span class="block truncate text-sm font-semibold text-slate-900">{{ link.title }}</span>
                <ArrowRightIcon class="h-4 w-4 flex-shrink-0 text-slate-400" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
        <div v-else class="hidden rounded-2xl border border-dashed border-slate-200 lg:block"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { isLocalAuthMode } from '@/services/authService.js'
import { openReportPdf } from '@/utilities/documents/reportPrint.js'
import DocumentChildSelection from '@/components/Main/Admin/Documents/DocumentChildSelection.vue'
import DocumentGuardianSelection from '@/components/Main/Admin/Documents/DocumentGuardianSelection.vue'
import DocumentTimespanFilter from '@/components/Main/Admin/Documents/DocumentTimespanFilter.vue'
import PaginationBar from '@/components/Navigation/PaginationBar.vue'
import InitialsAvatar from '@/components/UIComponents/InitialsAvatar.vue'
import {
  XMarkIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentCheckIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'ReportsOverview',
  components: {
    XMarkIcon,
    ArrowRightIcon,
    DocumentGuardianSelection,
    DocumentChildSelection,
    DocumentTimespanFilter,
    MagnifyingGlassIcon,
    PaginationBar,
    InitialsAvatar
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const activeFilter = ref('all')
    const child = ref(null)
    const currentPage = ref(0)
    const endDateFilter = ref(null)
    const guardian = ref(null)
    const isLoading = ref(false)
    const localAuthMode = isLocalAuthMode
    const nextToken = ref({ 0: null })
    const reports = ref([])
    const searchValue = ref('')
    const startDateFilter = ref(null)

    const demoReports = [
      createDemoReport({
        id: 'demo-report-1',
        childName: 'Lina',
        childFamilyName: 'Beispiel',
        guardianName: 'Mira',
        guardianFamilyName: 'Demir',
        flag: null,
        charged: false,
        hourFrom: 9,
        hourTo: 12
      }),
      createDemoReport({
        id: 'demo-report-2',
        childName: 'Max',
        childFamilyName: 'Muster',
        guardianName: 'Jonas',
        guardianFamilyName: 'Keller',
        flag: 'revise',
        charged: false,
        hourFrom: 10,
        hourTo: 12
      })
    ]

    onMounted(getFiltersFromURL)

    const sourceReports = computed(() => {
      if (localAuthMode && reports.value.length === 0) {
        return demoReports
      }

      return reports.value
    })

    const filteredReports = computed(() => {
      const search = searchValue.value.toLowerCase().trim()
      return sourceReports.value.filter((report) => {
        const status = statusInfo(report)
        const matchesFilter =
          activeFilter.value === 'all' ||
          status.filter === activeFilter.value ||
          (activeFilter.value === 'open' && !report.charged)
        const matchesSearch = !search || [
          childName(report),
          guardianName(report),
          activityLabel(report),
          status.label
        ].some((value) => value.toLowerCase().includes(search))

        return matchesFilter && matchesSearch
      })
    })

    // Master-Detail: ausgewählte Doku (fällt auf die erste der Liste zurück)
    const selectedReportId = ref(null)
    const selectedReport = computed(() => {
      const list = filteredReports.value
      if (list.length === 0) return null
      return list.find((report) => report.id === selectedReportId.value) || list[0]
    })
    const selectedReportIndex = computed(() => {
      if (!selectedReport.value) return 0
      return filteredReports.value.findIndex((report) => report.id === selectedReport.value.id)
    })
    function selectReport(report) {
      selectedReportId.value = report.id
    }

    const metrics = computed(() => {
      const all = sourceReports.value
      const ready = all.filter((report) => statusInfo(report).filter === 'ready')
      const review = all.filter((report) => statusInfo(report).filter === 'review')
      const open = all.filter((report) => !report.charged)
      const billed = all.filter((report) => statusInfo(report).filter === 'billed')

      return [
        {
          title: 'Dokus gesamt',
          value: all.length,
          badge: 'alle',
          filter: 'all',
          icon: DocumentTextIcon,
          iconClass: 'text-blue-500',
          badgeClass: 'bg-blue-100 text-blue-700'
        },
        {
          title: 'Für Rechnung',
          value: ready.length,
          badge: 'bereit',
          filter: 'ready',
          icon: DocumentCheckIcon,
          iconClass: 'text-emerald-500',
          badgeClass: 'bg-emerald-100 text-emerald-700'
        },
        {
          title: 'Päd. Prüfung',
          value: open.length,
          badge: 'lesen',
          filter: 'open',
          icon: ClockIcon,
          iconClass: 'text-sky-500',
          badgeClass: 'bg-sky-100 text-sky-700'
        },
        {
          title: 'Rückfrage',
          value: review.length,
          badge: 'offen',
          filter: 'review',
          icon: ExclamationTriangleIcon,
          iconClass: 'text-amber-500',
          badgeClass: 'bg-amber-100 text-amber-700'
        },
        {
          title: 'Abgerechnet',
          value: billed.length,
          badge: 'ok',
          filter: 'billed',
          icon: CheckCircleIcon,
          iconClass: 'text-orange-500',
          badgeClass: 'bg-orange-100 text-orange-700'
        }
      ]
    })

    const quickLinks = [
      {
        title: 'Nachweise',
        description: 'Stunden passend zur Doku prüfen',
        route: 'Timesheets'
      },
      {
        title: 'Klienten',
        description: 'Stammdaten und Zuordnung ansehen',
        route: 'ChildrenOverview'
      },
      {
        title: 'Mitarbeiter',
        description: 'Doku nach Betreuung filtern',
        route: 'GuardianAdminOverview'
      },
      {
        title: 'Abrechnung',
        description: 'Dokus in Rechnungskontext sehen',
        route: 'BillingCenter'
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
        await getReports(true)
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

    async function getReports(next) {
      try {
        isLoading.value = true
        const params = {
          type: 'dailyReport',
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

        const resp = await store.dispatch('getDailyReportDocuments', params)
        reports.value = resp.items || []

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
      await getReports(true)
    }

    async function previousPageTapped() {
      if (currentPage.value >= 1) {
        currentPage.value -= 1
        await getReports(false)
      }
    }

    function resetPagination() {
      currentPage.value = 0
      nextToken.value = { 0: null }
    }

    async function refetchWithReset() {
      resetPagination()
      setQueryParams()
      await getReports(true)
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

    function navigate(routeName) {
      router.push({ name: routeName })
    }

    function openReport(report, index) {
      router.push({
        name: 'ReportDetails',
        params: { id: report.id },
        query: {
          currentIndex: index,
          reportsIds: JSON.stringify(filteredReports.value.map((item) => item.id))
        }
      })
    }

    function openTimesheets(report) {
      const query = {}

      if (report.child?.id) {
        query.clientID = report.child.id
      }
      if (report.guardian?.id) {
        query.guardianID = report.guardian.id
      }

      router.push({
        name: 'Timesheets',
        query
      })
    }

    function statusInfo(report) {
      if (report.charged) {
        return {
          label: 'abgerechnet',
          filter: 'billed',
          badgeClass: 'bg-orange-100 text-orange-700'
        }
      }
      if (report.flag === 'revise') {
        return {
          label: 'Rückfrage',
          filter: 'review',
          badgeClass: 'bg-amber-100 text-amber-700'
        }
      }

      return {
        label: 'für Rechnung',
        filter: 'ready',
        badgeClass: 'bg-emerald-100 text-emerald-700'
      }
    }

    function childName(report) {
      if (report.reportActivity && internalActivities().includes(report.reportActivity)) {
        return 'Interne Sonderzeit'
      }

      const name = [report.child?.name, report.child?.familyName].filter(Boolean).join(' ')
      return name || 'Nicht angegeben'
    }

    function guardianName(report) {
      const name = [report.guardian?.name, report.guardian?.familyName].filter(Boolean).join(' ')
      return name || 'Nicht angegeben'
    }

    function activityLabel(report) {
      const labels = {
        school: 'Schule',
        escort: 'Begleitung',
        support: 'Unterstützung',
        holiday: 'Feiertag',
        vacation: 'Urlaub',
        employeeSickness: 'Krankheit Mitarbeiter',
        other: 'Sonstiges',
        supervision: 'Supervision',
        teamMeeting: 'Teamsitzung'
      }

      return labels[report.reportActivity] || 'Tagesdoku'
    }

    // Tages-Doku als PDF (Drucken → „Als PDF speichern") – nutzt das geladene
    // Objekt und funktioniert damit im Demo UND live.
    function printReport(report) {
      if (!report) return
      openReportPdf(report)
    }

    function reportDate(report) {
      if (!report.documentDate) {
        return 'Keine Angabe'
      }

      return new Date(report.documentDate).toLocaleDateString('de-DE')
    }

    function hoursWorked(report) {
      if (internalActivities().includes(report.reportActivity)) {
        return 'Sonderzeit'
      }
      if (typeof report.hourFrom !== 'number' || typeof report.hourTo !== 'number') {
        return 'Keine Angabe'
      }

      const minuteFrom = report.minuteFrom || 0
      const minuteTo = report.minuteTo || 0
      const timeFrom = report.hourFrom + minuteFrom / 60
      const timeTo = report.hourTo + minuteTo / 60
      const workedHours = Math.max(timeTo - timeFrom, 0)
      const hours = Math.floor(workedHours)
      const minutes = Math.round((workedHours % 1) * 60)
      return `${hours}h ${minutes}m`
    }

    function internalActivities() {
      return ['holiday', 'vacation', 'employeeSickness', 'other', 'supervision', 'teamMeeting']
    }

    function createDemoReport(options) {
      return {
        id: options.id,
        type: 'dailyReport',
        reportActivity: 'school',
        documentDate: new Date().toISOString(),
        flag: options.flag,
        charged: options.charged,
        hourFrom: options.hourFrom,
        minuteFrom: 0,
        hourTo: options.hourTo,
        minuteTo: 0,
        // Inhalte für die PDF-Ausgabe (Druckvorlage der Tages-Doku)
        mood: 'happy',
        school: 'Grundschule Groß-Gerau · Klasse 3b',
        report: 'Ruhiger Schultag. Im Unterricht gut mitgearbeitet, in der Pause Konflikt mit Mitschüler selbstständig gelöst.',
        exchange: 'Kurze Abstimmung mit der Klassenlehrerin: Sitzplatz bleibt vorne, Lob für die Mitarbeit.',
        parentreport: 'Mutter berichtet von einem entspannten Nachmittag, Hausaufgaben ohne Unterstützung erledigt.',
        homework: { german: 'Leseübung S. 42', maths: 'AB Einmaleins', english: '–' },
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

    return {
      activeFilter,
      child,
      childName,
      childSelected,
      clearChild,
      clearGuardian,
      currentPage,
      filteredReports,
      guardian,
      guardianName,
      guardianSelected,
      hoursWorked,
      isLoading,
      localAuthMode,
      metrics,
      navigate,
      nextPageTapped,
      nextToken,
      openReport,
      printReport,
      openTimesheets,
      previousPageTapped,
      quickLinks,
      reportDate,
      reports,
      searchValue,
      setDateFilter,
      statusInfo,
      activityLabel,
      selectedReport,
      selectedReportIndex,
      selectReport
    }
  }
}
</script>
