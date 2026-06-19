<template>
  <div class="mx-auto flex max-w-4xl flex-col px-4 py-4 sm:px-6">
    <section class="rounded-xl border border-slate-200 bg-white p-4 shadow-card sm:p-5">
      <p class="text-sm font-medium text-impuls-blue">Rückläufer</p>
      <h2 class="mt-1 text-2xl font-bold text-slate-900">Markierte Dokumentationen</h2>
      <p class="mt-2 text-sm text-slate-600">
        Die folgenden Einträge wurden zur Überarbeitung zurückgegeben. Bitte korrigieren Sie sie, damit die Abrechnung weiterlaufen kann.
      </p>
    </section>

    <!-- loading spinner -->
    <div
      v-if="isLoading"
      class="flex w-full justify-center p-6"
    >
      <LoadingSpinner size="h-12 w-12" />
    </div>

    <!-- grouped reports -->
    <div
      v-if="Object.keys(reportList).length > 0 && !isLoading"
      class="mt-4 flex flex-col gap-3"
    >
      <!-- report group by timesheet -->
      <div
        class="rounded-xl border border-slate-200 bg-white p-3 shadow-card sm:p-4"
        v-for="timesheet in reportList"
        :key="timesheet.id"
      >
        <GuardianFlaggedOverviewItem
          :reports="timesheet.dailyReport.items"
          :reportType="timesheet.reportType"
          :timesheetId="timesheet.id"
        />
      </div>
    </div>

    <div
      v-if="Object.keys(reportList).length <= 0 && !isLoading"
      class="mt-4"
    >
      <div class="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <CheckCircleIcon class="h-6 w-6 flex-shrink-0 text-emerald-600" aria-hidden="true" />
        <p class="text-sm font-semibold text-emerald-800">
          Alles erledigt – Sie haben alle Dokumentationen überarbeitet.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
// vue imports
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'

// component imports
import GuardianFlaggedOverviewItem from '@/components/Main/Guardian/Flagged/GuardianFlaggedOverviewItem.vue'
import LoadingSpinner from '@/components/UIComponents/Utilities/LoadingSpinner.vue'
import { CheckCircleIcon } from '@heroicons/vue/24/outline'

export default {
  components: {
    GuardianFlaggedOverviewItem,
    LoadingSpinner,
    CheckCircleIcon
  },
  setup() {
    // initialize refs
    const reportList = ref({})
    const isLoading = ref(false)

    // Initialize Store
    const store = useStore()

    // get flagged reports from API
    async function getFlaggedreports() {
      try {
        // set loading state
        isLoading.value = true

        const response = await store.dispatch('getFlaggedReportsByGuardian')
        // get reports grouped by timesheet
        reportList.value = response
      } catch (error) {
        console.log(error)
      } finally {
        isLoading.value = false
      }
    }

    // get flagged reports on mount
    onMounted(async () => {
      await getFlaggedreports()
    })

    return {
      reportList,
      isLoading
    }
  }
}
</script>