<template>
  <div class="mx-auto max-w-4xl px-4 py-4 sm:px-6">
    <section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:p-5">
      <p class="text-sm font-medium text-impuls-blue">Dokumentation</p>
      <h2 class="mt-1 font-display text-2xl font-bold tracking-tight text-slate-900">Was möchten Sie erfassen?</h2>
      <p class="mt-2 text-sm text-slate-600">
        Wählen Sie den passenden Eintrag. Die App führt Sie danach Schritt für Schritt durch die Eingabe.
      </p>
    </section>

    <section class="mt-4 grid gap-4 sm:grid-cols-2">
      <button
        v-for="option in options"
        :key="option.name"
        @click="optionTapped(option)"
        class="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-card transition hover:border-blue-200 hover:bg-blue-50"
      >
        <div :class="['flex h-12 w-12 items-center justify-center rounded-lg', option.bgClass]">
          <component
            :is="option.icon"
            class="h-6 w-6"
            aria-hidden="true"
          />
        </div>
        <h3 class="mt-4 font-display text-lg font-bold text-slate-900">{{ option.name }}</h3>
        <p class="mt-2 text-sm text-slate-600">{{ option.description }}</p>
        <p class="mt-4 text-sm font-semibold text-impuls-blue">Starten</p>
      </button>
    </section>

    <!-- Meine Dokumentationen -->
    <section class="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
      <div class="flex items-center justify-between gap-2 border-b border-slate-200 px-4 py-3 sm:px-5">
        <div>
          <h3 class="font-display text-lg font-bold text-slate-900">Meine Dokumentationen</h3>
          <p class="text-sm text-slate-500">Zuletzt erfasst – zum Bearbeiten antippen.</p>
        </div>
        <span
          v-if="!isLoading && sortedReports.length"
          class="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold tabular-nums text-impuls-blue"
        >{{ sortedReports.length }}</span>
      </div>

      <div v-if="isLoading" class="divide-y divide-slate-100">
        <div v-for="n in 3" :key="n" class="flex items-center gap-3 px-4 py-3.5 sm:px-5">
          <div class="h-9 w-9 flex-shrink-0 animate-pulse rounded-lg bg-slate-200"></div>
          <div class="flex-1 space-y-2"><div class="h-3.5 w-1/2 animate-pulse rounded bg-slate-200"></div><div class="h-3 w-2/3 animate-pulse rounded bg-slate-100"></div></div>
        </div>
      </div>

      <div v-else-if="sortedReports.length === 0" class="px-5 py-10 text-center">
        <p class="text-sm font-semibold text-slate-900">Noch keine Dokumentationen</p>
        <p class="mt-1 text-sm text-slate-500">Starten Sie oben mit „Dokumentation".</p>
      </div>

      <div v-else data-testid="my-reports" class="divide-y divide-slate-100">
        <button
          v-for="report in sortedReports"
          :key="report.id"
          type="button"
          @click="openReport(report)"
          class="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50 sm:px-5"
        >
          <InitialsAvatar :name="childName(report)" size-class="h-9 w-9 text-xs" />
          <span class="min-w-0 flex-1">
            <span class="block truncate font-display font-bold text-slate-900">{{ childName(report) }}</span>
            <span class="block truncate text-xs text-slate-500">{{ formatDate(report.documentDate) }} · {{ timeRange(report) }}</span>
          </span>
          <span :class="['shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold', isSpecial(report) ? 'bg-violet-100 text-violet-700' : 'bg-emerald-100 text-emerald-700']">
            {{ isSpecial(report) ? 'Sonderzeit' : 'Dokumentation' }}
          </span>
        </button>
      </div>
    </section>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { DocumentTextIcon, StarIcon } from '@heroicons/vue/24/outline'
import InitialsAvatar from '@/components/UIComponents/InitialsAvatar.vue'

const SPECIAL_ACTIVITIES = [
  'holiday',
  'vacation',
  'employeeSickness',
  'teamMeeting',
  'furtherEducation',
  'miscellaneous'
]

export default {
  components: {
    DocumentTextIcon,
    StarIcon,
    InitialsAvatar
  },
  setup() {
    const router = useRouter()
    const store = useStore()

    const options = [
      {
        name: 'Dokumentation',
        description: 'Für Schule, Hilfeplangespräch, Kennenlerngespräch, Hospitation, Ausflug oder Sonstiges.',
        route: 'ReportView',
        icon: DocumentTextIcon,
        bgClass: 'bg-amber-100 text-amber-700'
      },
      {
        name: 'Sonderzeiten',
        description: 'Für Feiertag, Urlaub, Krankheit, Supervision, Teamsitzung oder andere Sonderfälle.',
        route: 'SpecialReportView',
        icon: StarIcon,
        bgClass: 'bg-violet-100 text-violet-700'
      }
    ]

    const reports = ref([])
    const isLoading = ref(false)

    async function loadReports() {
      try {
        isLoading.value = true
        const result = await store.dispatch('getDailyReports')
        reports.value = Array.isArray(result) ? result : result?.items || []
      } catch (error) {
        console.log(error)
        reports.value = []
      } finally {
        isLoading.value = false
      }
    }

    onMounted(loadReports)

    const sortedReports = computed(() =>
      [...reports.value].sort(
        (a, b) => new Date(b.documentDate) - new Date(a.documentDate)
      )
    )

    function isSpecial(report) {
      return SPECIAL_ACTIVITIES.includes(report.reportActivity)
    }

    function childName(report) {
      const child = report.child
      if (!child?.name) return 'Ohne Klient'
      return `${child.name} ${child.familyName || ''}`.trim()
    }

    function pad(value) {
      return value < 10 ? `0${value}` : `${value}`
    }

    function timeRange(report) {
      if (report.hourFrom == null || report.hourTo == null) return '—'
      return `${report.hourFrom}:${pad(report.minuteFrom || 0)} – ${report.hourTo}:${pad(report.minuteTo || 0)} Uhr`
    }

    function formatDate(date) {
      if (!date) return 'Ohne Datum'
      return new Date(date).toLocaleDateString('de-DE', {
        weekday: 'short',
        day: 'numeric',
        month: 'long'
      })
    }

    function optionTapped(option) {
      router.push({ name: option.route })
    }

    function openReport(report) {
      router.push({
        name: isSpecial(report) ? 'EditSpecialReportView' : 'EditReportView',
        params: { id: report.id }
      })
    }

    return {
      options,
      reports,
      isLoading,
      sortedReports,
      isSpecial,
      childName,
      timeRange,
      formatDate,
      optionTapped,
      openReport
    }
  }
}
</script>
