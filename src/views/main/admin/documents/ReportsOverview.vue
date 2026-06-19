<template>
  <div class="min-h-full bg-slate-50 px-4 py-5 sm:px-6 lg:px-8">
    <div class="flex w-full flex-col gap-5">
      <section class="rounded-xl bg-gradient-to-br from-impuls-blue via-brand-700 to-brand-900 p-5 text-white shadow-soft sm:px-6 sm:py-7">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-sm font-medium text-blue-100">Päd. Leitung</p>
            <h1 class="mt-1 text-2xl font-bold sm:text-3xl">Dokumentationszentrale</h1>
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
                <h2 class="text-lg font-semibold text-slate-900">Dokus im Prüfprozess</h2>
                <p class="text-sm text-slate-500">Pädagogisch relevant, aber auf Abrechnung vorbereitet.</p>
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
                  placeholder="Klient, Mitarbeiter oder Status suchen"
                />
              </label>
            </div>
          </div>

          <div
            v-if="isLoading"
            class="px-5 py-10 text-center text-sm font-semibold text-slate-500"
          >
            Dokumentationen werden geladen...
          </div>

          <div
            v-else-if="filteredReports.length === 0"
            class="px-5 py-10 text-center"
          >
            <p class="text-sm font-semibold text-slate-900">Keine Dokumentationen gefunden</p>
            <p class="mt-1 text-sm text-slate-500">Passe Suche, Status oder Zeitraumfilter an.</p>
          </div>

          <div
            v-else
            class="divide-y divide-slate-100"
          >
            <article
              v-for="(report, index) in filteredReports"
              :key="report.id"
              class="grid gap-4 px-5 py-4 2xl:grid-cols-[minmax(0,1fr)_130px_150px_170px]"
            >
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <h3 class="font-semibold text-slate-900">{{ childName(report) }}</h3>
                  <span :class="['rounded-full px-2.5 py-1 text-xs font-semibold', statusInfo(report).badgeClass]">
                    {{ statusInfo(report).label }}
                  </span>
                </div>
                <p class="mt-1 text-sm text-slate-600">{{ guardianName(report) }} · {{ activityLabel(report) }}</p>
              </div>
              <div>
                <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Datum</p>
                <p class="mt-1 text-sm font-semibold text-slate-800">{{ reportDate(report) }}</p>
              </div>
              <div>
                <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Zeit</p>
                <p class="mt-1 text-sm font-semibold text-slate-800">{{ hoursWorked(report) }}</p>
              </div>
              <div class="flex items-center justify-between gap-2 lg:justify-end">
                <button
                  class="rounded-lg px-3 py-2 text-sm font-semibold text-impuls-blue hover:bg-blue-50"
                  @click="openTimesheets(report)"
                >
                  Nachweis
                </button>
                <button
                  class="rounded-lg bg-impuls-blue px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  @click="openReport(report, index)"
                >
                  Prüfen
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
            <h2 class="text-lg font-semibold text-slate-900">Prüffokus</h2>
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
                <ArrowRightIcon class="h-4 w-4 text-slate-400" aria-hidden="true" />
              </button>
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
import DocumentChildSelection from '@/components/Main/Admin/Documents/DocumentChildSelection.vue'
import DocumentGuardianSelection from '@/components/Main/Admin/Documents/DocumentGuardianSelection.vue'
import DocumentTimespanFilter from '@/components/Main/Admin/Documents/DocumentTimespanFilter.vue'
import PaginationBar from '@/components/Navigation/PaginationBar.vue'
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
    CheckCircleIcon,
    ClockIcon,
    DocumentCheckIcon,
    DocumentTextIcon,
    DocumentGuardianSelection,
    DocumentChildSelection,
    DocumentTimespanFilter,
    ExclamationTriangleIcon,
    MagnifyingGlassIcon,
    PaginationBar
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

    const workflow = [
      {
        title: 'Inhalt prüfen',
        description: 'Päd. Leitung sieht, welche Dokus fachlich noch Rückfragen brauchen.',
        icon: DocumentTextIcon,
        bgClass: 'bg-blue-100 text-blue-700'
      },
      {
        title: 'Abrechnung sichern',
        description: 'Verwaltung erkennt, ob die Doku zum Nachweis passt.',
        icon: DocumentCheckIcon,
        bgClass: 'bg-emerald-100 text-emerald-700'
      },
      {
        title: 'Rückgabe sichtbar',
        description: 'Offene Rückfragen werden nicht in alten Listen versteckt.',
        icon: ExclamationTriangleIcon,
        bgClass: 'bg-amber-100 text-amber-700'
      }
    ]

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
      if (report.id?.startsWith('demo-')) {
        return
      }

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
        reportActivity: 'support',
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
      openTimesheets,
      previousPageTapped,
      quickLinks,
      reportDate,
      reports,
      searchValue,
      setDateFilter,
      statusInfo,
      activityLabel,
      workflow
    }
  }
}
</script>
