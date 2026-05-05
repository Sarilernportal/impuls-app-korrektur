<template>
  <div class="w-full h-full flex flex-col">
    <div class="px-4 py-2">
      <!-- Title  -->
      <h3 class="text-lg font-medium leading-6 text-primaryText">
        Übersicht markierter Berichte
      </h3>
      <!-- description -->
      <p class="mt-1 max-w-2xl text-sm text-secondaryText">
        Die folgenden Gruppierungen beinhalten Dokumentationen, welche
        überarbeitet werden müssen.
      </p>
    </div>
    <!-- loading spinner -->
    <div
      v-if="isLoading"
      class="flex w-full justify-center p-2"
    >
      <LoadingSpinner size="h-12 w-12" />
    </div>
    <!-- grouped reports -->
    <div
      v-if="Object.keys(reportList).length > 0 && !isLoading"
      class="flex flex-col gap-2 px-4 py-2"
    >
      <!-- report group by timesheet -->
      <div
        class="bg-white border border-tertiaryText p-2 rounded-md"
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
      class="px-4 py-2"
    >
      <div class="bg-green-300 rounded-lg p-2">
        <p class="text-center font-semibold text-green-700">
          Sie haben alle Dokumentationen überarbeitet.
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

export default {
  components: {
    GuardianFlaggedOverviewItem,
    LoadingSpinner
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