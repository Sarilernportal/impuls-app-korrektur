<template>
  <!-- report group by invoice -->
  <div class="flex bg-white p-1 rounded-md">
    <!-- information -->
    <div class="w-full">
      <div class="flex gap-2">
        <!-- special report flag -->
        <div
          :class="['flex flex-wrap justify-center rounded-full gap-1 px-2 text-xs font-semibold leading-5', reportType === 'special' ? 'bg-impuls-blue text-slate-100' : 'bg-emerald-100 text-emerald-700']"
        >
          <p>{{ reportType === 'special' ? 'Sonderzeiten' : 'Dokumentation' }}</p>
        </div>
        <!-- report count -->
        <p
          class="flex flex-wrap rounded-full gap-1 px-2 text-xs font-semibold leading-5 text-slate-700 hover:text-slate-800 border-2 border-indigo-400 hover:border-indigo-600">
          {{ 'Anzahl: ' + reports.length }}
        </p>
      </div>
      <!-- timeframe -->
      <div class="mt-2 flex items-center text-sm text-slate-700 sm:mt-0">
        <CalendarIcon
          class="mr-1.5 h-5 w-5 flex-shrink-0 text-slate-600"
          aria-hidden="true"
        />
        <p>
          Zeitraum:
          {{ startDate + ' - ' + endDate }}
        </p>
      </div>
    </div>
    <!-- chevron button -->
    <button @click="goToFlaggedDetails">
      <ChevronRightIcon class="h-8 w-8 text-slate-400" />
    </button>
  </div>
</template>

<script>
// vue imports
import { computed } from 'vue'
import { useRouter } from 'vue-router'

// Icon imports
import { CalendarIcon } from '@heroicons/vue/20/solid'
import { ChevronRightIcon } from '@heroicons/vue/24/outline'

export default {
  components: {
    CalendarIcon,
    ChevronRightIcon
  },
  props: {
    reports: {
      type: Array,
      required: true
    },
    reportType: {
      type: String,
      required: true
    },
    timesheetId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    // initialize router
    const router = useRouter()

    // get earliest date of used reports
    const startDate = computed(() => {
      try {
        const documents = props.reports
        var startDateList = []
        for (const document of documents) {
          startDateList.push(new Date(document.documentDate))
        }
        return new Date(Math.min.apply(null, startDateList)).toLocaleDateString(
          'de-DE'
        )
      } catch (error) {
        return 'N/A'
      }
    })

    // get latest date of used reports
    const endDate = computed(() => {
      try {
        const documents = props.reports
        var startDateList = []
        for (const document of documents) {
          startDateList.push(new Date(document.documentDate))
        }
        return new Date(Math.max.apply(null, startDateList)).toLocaleDateString(
          'de-DE'
        )
      } catch (error) {
        return 'N/A'
      }
    })

    function goToFlaggedDetails() {
      router.push({
        name: 'GuardianFlaggedDetails',
        params: { id: props.timesheetId }
      })
    }

    return {
      startDate,
      endDate,
      goToFlaggedDetails
    }
  }
}
</script>