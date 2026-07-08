<template>
  <div class="min-h-full bg-app-bg px-4 py-5 sm:px-6 lg:px-8">
    <div class="flex w-full flex-col gap-5">
      <!-- Kopf -->
      <section class="rounded-xl bg-gradient-to-br from-impuls-blue via-brand-700 to-brand-900 p-5 text-white shadow-soft sm:px-6 sm:py-7">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-sm font-medium text-blue-100">Verwaltung · Schritt 1 von 2 im Abrechnungslauf</p>
            <h1 class="mt-1 font-display text-2xl font-black tracking-tight sm:text-3xl">Nachweise</h1>
            <p class="mt-2 max-w-3xl text-sm text-blue-100">
              Leistungsnachweise prüfen, mit der Doku abgleichen und freigeben. Keine Rechnung hier.
            </p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              data-testid="release-all-btn"
              class="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-impuls-blue hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="releasableCount === 0"
              @click="releaseAll"
            >
              <CheckCircleIcon class="h-4 w-4" aria-hidden="true" />
              Geprüfte freigeben<span v-if="releasableCount"> ({{ releasableCount }})</span>
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

      <!-- Filter-/Statuskarten -->
      <section class="flex flex-wrap gap-2">
        <button
          v-for="card in statusCards"
          :key="card.status"
          :data-testid="'review-filter-' + card.status"
          @click="setFilter(card.status)"
          :class="[
            'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition',
            activeFilter === card.status
              ? 'border-impuls-blue bg-blue-50 text-impuls-blue'
              : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200'
          ]"
        >
          {{ card.label }}
          <span :class="['rounded-full px-2 py-0.5 text-xs font-bold tabular-nums', card.cardClass]">{{ card.count }}</span>
        </button>
      </section>

      <!-- Filter (Klient/Betreuer/Zeitraum) -->
      <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div class="grid gap-4 xl:grid-cols-3">
          <div class="flex items-center gap-2">
            <DocumentChildSelection class="w-full" :enableAddButton="true" :selectedChild="child" @child-selected="childSelected" />
            <button v-if="child" class="rounded-lg bg-slate-100 p-2 text-slate-600 hover:bg-slate-200" @click.prevent="clearChild">
              <XMarkIcon class="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div class="flex items-center gap-2">
            <DocumentGuardianSelection class="w-full" :enableAddButton="true" :selectedGuardian="guardian" @guardian-selected="guardianSelected" />
            <button v-if="guardian" class="rounded-lg bg-slate-100 p-2 text-slate-600 hover:bg-slate-200" @click.prevent="clearGuardian">
              <XMarkIcon class="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <DocumentTimespanFilter @time-filter="setDateFilter" />
        </div>
      </section>

      <!-- Prüf-Tabelle -->
      <section class="rounded-2xl border border-slate-200 bg-white shadow-card">
        <div class="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 class="font-display text-lg font-bold text-slate-900">Nachweise prüfen</h2>
            <p class="text-sm text-slate-500">Unterschriften und Doku-Abgleich prüfen, dann freigeben oder Rückfrage stellen.</p>
          </div>
          <div class="flex items-center gap-2">
            <button v-if="activeFilter" class="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100" @click="setFilter(null)">
              Filter zurücksetzen
            </button>
            <label class="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <MagnifyingGlassIcon class="h-5 w-5 text-slate-400" aria-hidden="true" />
              <input v-model="searchValue" type="search" class="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                placeholder="Klient, Mitarbeiter oder Kostenträger suchen" />
            </label>
          </div>
        </div>

        <div v-if="isLoading" class="px-5 py-10 text-center text-sm font-semibold text-slate-500">Nachweise werden geladen...</div>

        <div v-else-if="filteredTimeSheets.length === 0" class="px-5 py-10 text-center">
          <p class="text-sm font-semibold text-slate-900">Keine Nachweise gefunden</p>
          <p class="mt-1 text-sm text-slate-500">Passe Suche, Status oder Zeitraumfilter an.</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table data-testid="review-table" class="w-full min-w-[920px] border-collapse text-sm">
            <thead>
              <tr class="border-b border-slate-200 text-left text-[11px] font-medium uppercase tracking-wide text-slate-400">
                <th class="px-5 py-3">Klient / Fachkraft</th>
                <th class="px-3 py-3">Zeitraum</th>
                <th class="px-3 py-3 text-right">Stunden</th>
                <th class="px-3 py-3">Unterschriften</th>
                <th class="px-3 py-3">Doku-Abgleich</th>
                <th class="px-3 py-3">Status / Aktion</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="timeSheet in filteredTimeSheets" :key="timeSheet.id" class="text-slate-700">
                <td class="px-5 py-4 align-top">
                  <p class="font-semibold text-slate-900">{{ childName(timeSheet) }}</p>
                  <p class="text-sm text-slate-600">{{ guardianName(timeSheet) }} · {{ carrierName(timeSheet) }}</p>
                </td>
                <td class="px-3 py-4 align-top">{{ timeSheetPeriod(timeSheet) }}</td>
                <td class="px-3 py-4 align-top text-right tabular-nums">{{ hoursWorked(timeSheet) }}</td>
                <td class="px-3 py-4 align-top">
                  <SignatureTrafficLight data-testid="review-signatures" :signatures="signaturesFor(timeSheet)" />
                </td>
                <td class="px-3 py-4 align-top">
                  <span :class="['inline-flex items-center gap-1 text-xs font-semibold', docMatchFor(timeSheet).ok ? 'text-emerald-700' : 'text-amber-700']">
                    <component :is="docMatchFor(timeSheet).ok ? CheckCircleIcon : ExclamationTriangleIcon" class="h-4 w-4" aria-hidden="true" />
                    {{ docMatchFor(timeSheet).label }}
                  </span>
                </td>
                <td class="px-3 py-4 align-top">
                  <div class="flex flex-wrap items-center gap-2">
                    <span :class="['inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold', metaFor(timeSheet).badgeClass]">
                      {{ metaFor(timeSheet).label }}
                    </span>
                    <button class="rounded-lg px-2.5 py-1 text-xs font-semibold text-impuls-blue hover:bg-blue-50" @click="openTimeSheet(timeSheet)">
                      Öffnen
                    </button>
                    <button
                      v-if="canReleaseRow(timeSheet)"
                      data-testid="release-btn"
                      class="inline-flex items-center gap-1 rounded-md border border-emerald-300 px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                      @click="release(timeSheet)"
                    >
                      <CheckIcon class="h-3.5 w-3.5" aria-hidden="true" /> Freigeben
                    </button>
                    <button
                      v-if="statusFor(timeSheet) !== 'freigegeben'"
                      class="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                      @click="query(timeSheet)"
                    >
                      <ChatBubbleLeftRightIcon class="h-3.5 w-3.5" aria-hidden="true" /> Rückfrage
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="!isLoading && filteredTimeSheets.length > 0" class="border-t border-slate-200 px-5 py-4">
          <pagination-bar
            :page="currentPage"
            :nextPageAvailable="nextToken[currentPage + 1] !== null"
            @to-next="nextPageTapped"
            @to-previous="previousPageTapped"
          />
        </div>

      </section>
    </div>

    <!-- Nachweis-Prüfansicht -->
    <time-sheet-review-dialog
      :open="reviewDialogOpen"
      :time-sheet="reviewTimeSheet"
      :status="reviewTimeSheet ? statusFor(reviewTimeSheet) : ''"
      :releasable="reviewTimeSheet ? canReleaseRow(reviewTimeSheet) : false"
      :show-details-link="reviewTimeSheet ? !reviewTimeSheet.id?.startsWith('demo-') : false"
      @close="reviewDialogOpen = false"
      @release="releaseFromDialog"
      @query="queryFromDialog"
      @open-details="openDetailsFromDialog"
    />

    <success-window
      v-if="successMessage"
      title="Freigabe"
      :message="successMessage"
      :open="!!successMessage"
      @close="successMessage = ''"
    />
  </div>
</template>

<script>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { isLocalAuthMode } from '@/services/authService.js'
import DocumentChildSelection from '@/components/Main/Admin/Documents/DocumentChildSelection.vue'
import DocumentGuardianSelection from '@/components/Main/Admin/Documents/DocumentGuardianSelection.vue'
import DocumentTimespanFilter from '@/components/Main/Admin/Documents/DocumentTimespanFilter.vue'
import PaginationBar from '@/components/Navigation/PaginationBar.vue'
import SuccessWindow from '@/components/UIComponents/Modals/SuccessWindow.vue'
import SignatureTrafficLight from '@/components/Main/Admin/Billing/SignatureTrafficLight.vue'
import TimeSheetReviewDialog from '@/components/Main/Admin/Documents/TimeSheetReviewDialog.vue'
import {
  XMarkIcon,
  CheckCircleIcon,
  CheckIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'
import {
  REVIEW_STATUS,
  REVIEW_CARD_ORDER,
  reviewMeta,
  reviewStatus,
  canRelease,
  docMatch,
  reviewSignatures
} from '@/utilities/billing/review.js'

const blacklistActivities = ['holiday', 'vacation', 'employeeSickness', 'other']

export default {
  name: 'TimesheetOverview',
  components: {
    XMarkIcon,
    CheckCircleIcon,
    CheckIcon,
    ChatBubbleLeftRightIcon,
    ExclamationTriangleIcon,
    MagnifyingGlassIcon,
    DocumentChildSelection,
    DocumentGuardianSelection,
    DocumentTimespanFilter,
    PaginationBar,
    SuccessWindow,
    SignatureTrafficLight,
    TimeSheetReviewDialog
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const activeFilter = ref(null)
    const child = ref(null)
    const guardian = ref(null)
    const currentPage = ref(0)
    const endDateFilter = ref(null)
    const startDateFilter = ref(null)
    const isLoading = ref(false)
    const localAuthMode = isLocalAuthMode
    const nextToken = ref({ 0: null })
    const searchValue = ref('')
    const timesheets = ref([])
    const successMessage = ref('')

    // Nachweis-Prüfansicht (funktioniert auch im Demo – kein Route-Wechsel nötig)
    const reviewDialogOpen = ref(false)
    const reviewTimeSheet = ref(null)

    function releaseFromDialog() {
      if (reviewTimeSheet.value) release(reviewTimeSheet.value)
      reviewDialogOpen.value = false
    }
    function queryFromDialog() {
      if (reviewTimeSheet.value) query(reviewTimeSheet.value)
      reviewDialogOpen.value = false
    }
    function openDetailsFromDialog() {
      reviewDialogOpen.value = false
      if (reviewTimeSheet.value) openTimeSheetDetails(reviewTimeSheet.value)
    }

    // Freigabe-/Rückfrage-Overrides (frontend-first, bis reviewStatus persistiert)
    const releasedIds = reactive({})
    const queriedIds = reactive({})

    const demoTimeSheets = [
      createDemoTimeSheet({
        id: 'demo-timesheet-1', childName: 'Lina', childFamilyName: 'Beispiel',
        guardianName: 'Mira', guardianFamilyName: 'Demir', carrierName: 'JA Groß-Gerau',
        reportDate: new Date().toISOString(), hourFrom: 9, hourTo: 12, flag: null,
        signatures: { parent: true, school: true, professional: true }
      }),
      createDemoTimeSheet({
        id: 'demo-timesheet-2', childName: 'Max', childFamilyName: 'Muster',
        guardianName: 'Jonas', guardianFamilyName: 'Keller', carrierName: 'JA Mitte',
        reportDate: new Date().toISOString(), hourFrom: 10, hourTo: 12, flag: 'revise',
        signatures: { parent: true, school: false, professional: true }
      }),
      createDemoTimeSheet({
        id: 'demo-timesheet-3', childName: 'Sara', childFamilyName: 'Yıldız',
        guardianName: 'Anna', guardianFamilyName: 'Koch', carrierName: 'JA Mitte',
        reportDate: new Date().toISOString(), hourFrom: 8, hourTo: 11, flag: null,
        signatures: { parent: true, school: false, professional: true }
      })
    ]

    onMounted(getFiltersFromURL)

    const sourceTimeSheets = computed(() =>
      localAuthMode && timesheets.value.length === 0 ? demoTimeSheets : timesheets.value
    )

    function overridesFor(timeSheet) {
      return { released: !!releasedIds[timeSheet.id], queried: !!queriedIds[timeSheet.id] }
    }
    function statusFor(timeSheet) {
      return reviewStatus(timeSheet, overridesFor(timeSheet))
    }
    function metaFor(timeSheet) {
      return reviewMeta(statusFor(timeSheet))
    }
    function signaturesFor(timeSheet) {
      return reviewSignatures(timeSheet)
    }
    function docMatchFor(timeSheet) {
      return docMatch(timeSheet)
    }
    function canReleaseRow(timeSheet) {
      return canRelease(timeSheet, overridesFor(timeSheet)) && !queriedIds[timeSheet.id]
    }

    const filteredTimeSheets = computed(() => {
      const search = searchValue.value.toLowerCase().trim()
      return sourceTimeSheets.value.filter((timeSheet) => {
        const status = statusFor(timeSheet)
        const matchesFilter = !activeFilter.value || status === activeFilter.value
        const matchesSearch = !search || [childName(timeSheet), guardianName(timeSheet), carrierName(timeSheet), reviewMeta(status).label]
          .some((value) => value.toLowerCase().includes(search))
        return matchesFilter && matchesSearch
      })
    })

    const statusCards = computed(() =>
      REVIEW_CARD_ORDER.map((status) => ({
        status,
        ...reviewMeta(status),
        count: sourceTimeSheets.value.filter((ts) => statusFor(ts) === status).length
      }))
    )

    const releasableCount = computed(() => sourceTimeSheets.value.filter(canReleaseRow).length)

    function setFilter(status) {
      activeFilter.value = activeFilter.value === status ? null : status
    }

    function release(timeSheet) {
      if (!canReleaseRow(timeSheet)) return
      releasedIds[timeSheet.id] = true
      delete queriedIds[timeSheet.id]
      successMessage.value = `Nachweis von ${childName(timeSheet)} freigegeben. Er erscheint nun in der Abrechnungszentrale.`
    }
    function releaseAll() {
      const releasable = sourceTimeSheets.value.filter(canReleaseRow)
      releasable.forEach((ts) => { releasedIds[ts.id] = true; delete queriedIds[ts.id] })
      if (releasable.length) {
        successMessage.value = `${releasable.length} Nachweis(e) freigegeben. Sie erscheinen nun in der Abrechnungszentrale.`
      }
    }
    function query(timeSheet) {
      queriedIds[timeSheet.id] = true
      delete releasedIds[timeSheet.id]
    }

    // ── Datenfluss (unverändert übernommen) ──
    async function getFiltersFromURL() {
      try {
        isLoading.value = true
        const queryParams = route.query
        if (queryParams.startDate) startDateFilter.value = queryParams.startDate
        if (queryParams.endDate) endDateFilter.value = queryParams.endDate
        if (queryParams.clientID) child.value = await store.dispatch('fetchChildDetails', { sub: queryParams.clientID })
        if (queryParams.guardianID) guardian.value = await store.dispatch('fetchGuardianDetails', { sub: queryParams.guardianID })
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
      if (child.value) queryObject.clientID = child.value.id
      if (guardian.value) queryObject.guardianID = guardian.value.id
      if (startDateFilter.value) queryObject.startDate = startDateFilter.value
      if (endDateFilter.value) queryObject.endDate = endDateFilter.value
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
        if (child.value) params.childID = child.value.id
        if (guardian.value) params.guardianID = guardian.value.id
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
    async function clearChild() { child.value = null; await refetchWithReset() }
    async function clearGuardian() { guardian.value = null; await refetchWithReset() }
    async function childSelected(value) { child.value = value; await refetchWithReset() }
    async function guardianSelected(value) { guardian.value = value; await refetchWithReset() }
    async function setDateFilter(event) {
      startDateFilter.value = event.start
      endDateFilter.value = event.end
      await refetchWithReset()
    }
    async function refetchWithReset() {
      resetPagination()
      setQueryParams()
      await getTimesheets(true)
    }

    function openTimeSheet(timeSheet) {
      reviewTimeSheet.value = timeSheet
      reviewDialogOpen.value = true
    }

    function openTimeSheetDetails(timeSheet) {
      if (timeSheet.id?.startsWith('demo-')) return
      router.push({
        name: 'TimeSheetDetails',
        params: { id: timeSheet.id },
        query: {
          currentIndex: filteredTimeSheets.value.findIndex((item) => item.id === timeSheet.id),
          reportsIds: JSON.stringify(filteredTimeSheets.value.map((item) => item.id))
        }
      })
    }

    // ── Anzeige-Helfer ──
    function dailyReports(timeSheet) {
      return timeSheet.dailyReport?.items || []
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
    function hoursWorked(timeSheet) {
      const workedHours = dailyReports(timeSheet).reduce((total, report) => {
        if (blacklistActivities.includes(report.reportActivity)) return total
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
      if (dates.length === 0) return 'Keine Angabe'
      const start = new Date(Math.min(...dates)).toLocaleDateString('de-DE')
      const end = new Date(Math.max(...dates)).toLocaleDateString('de-DE')
      return start === end ? start : `${start} - ${end}`
    }

    function createDemoTimeSheet(o) {
      return {
        id: o.id,
        reportType: 'standard',
        createdAt: o.reportDate,
        signatures: o.signatures,
        key: o.signatures?.professional ? 'sig-key' : undefined,
        child: { id: `${o.id}-child`, name: o.childName, familyName: o.childFamilyName },
        guardian: { id: `${o.id}-guardian`, name: o.guardianName, familyName: o.guardianFamilyName },
        carrier: { id: `${o.id}-carrier`, name: o.carrierName },
        dailyReport: {
          items: [{
            id: `${o.id}-report`, documentDate: o.reportDate,
            hourFrom: o.hourFrom, minuteFrom: 0, hourTo: o.hourTo, minuteTo: 0,
            reportActivity: 'school', flag: o.flag
          }]
        }
      }
    }

    return {
      activeFilter, child, guardian, currentPage, isLoading, localAuthMode, nextToken,
      searchValue, timesheets, successMessage,
      statusCards, releasableCount, filteredTimeSheets,
      REVIEW_STATUS, CheckCircleIcon, ExclamationTriangleIcon,
      setFilter, statusFor, metaFor, signaturesFor, docMatchFor, canReleaseRow,
      release, releaseAll, query,
      reviewDialogOpen, reviewTimeSheet, releaseFromDialog, queryFromDialog, openDetailsFromDialog,
      childName, guardianName, carrierName, hoursWorked, timeSheetPeriod,
      childSelected, guardianSelected, clearChild, clearGuardian, setDateFilter,
      nextPageTapped, previousPageTapped, openTimeSheet
    }
  }
}
</script>
