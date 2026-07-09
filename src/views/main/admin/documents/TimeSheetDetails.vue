<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus
28.02.2023

Scope:
TimeSheet Details
-->

<template>
  <div class="flex flex-col w-full h-full items-center px-4 py-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="flex items-center justify-between w-full">
      <button
        class="bg-impuls-blue hover:bg-brand-700 transition rounded-full text-white p-2 shadow-sm"
        @click="goToPrevious"
      >
        <ArrowLeftIcon class="h-6 w-6" />
      </button>
      <h2 class="font-display text-xl font-bold tracking-tight text-primaryText">
        Nachweis Details
      </h2>
      <button
        class="bg-impuls-blue hover:bg-brand-700 transition rounded-full text-white p-2 shadow-sm"
        @click="goToNext"
      >
        <ArrowRightIcon class="h-6 w-6" />
      </button>
    </div>
    <!-- Main content container -->
    <div class="flex grow w-full h-full mt-4 sm:flex">
      <!-- PDF viewer -->
      <div class="mb-4 w-full h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card sm:mb-0 sm:mr-4">
        <iframe
          :src="pdf"
          class="h-[78vh] min-h-[420px] w-full"
        ></iframe>
      </div>
    </div>
  </div>
</template>


<script>
// Vue imports
import { ref, onMounted, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/vue/24/outline'
import { isLocalAuthMode } from '@/services/authService.js'
import { buildTimesheetHtml } from '@/utilities/documents/timesheetPrint.js'

export default {
  components: {
    ArrowLeftIcon,
    ArrowRightIcon
  },
  props: {
    id: {
      type: String,
      required: true
    },
    reportsIds: {
      type: Array,
    },
    currentIndex: {
      type: Number,
      default: null
    }
  },
  setup(props) {
    const route = useRoute()
    // Access the state values if props are null
    const reportsIds = computed(() => { 
      const reportsData = props.reportsIds ?? route.query.reportsIds
      try {
        return typeof reportsData === 'string' ? JSON.parse(reportsData) : reportsData
      } catch {
        return []
      }
    })
    const currentIndex = ref(props.currentIndex ?? Number(route.query.currentIndex))
    
    // Ref initialization
    const pdf = ref(null)
    const document = ref({})
    const id = ref(props.id)

    // Store initialization
    const store = useStore()

    // Watch for changes in id
    watch(id, async (newId) => {
      await getTimeSheet(newId)
    })

    // Mounted hook to perform action on mounting the component
    onMounted(async () => {
      await getTimeSheet(id.value)
    })

    // Get the timesheet from the database
    async function getTimeSheet(id) {
      try {
        // Get the response from the database within the timesheet object
        const response = await store.dispatch('getSingleTimeSheet', { id })
        // Fetch the pdf
        document.value = response
        if (isLocalAuthMode) {
          // Demo: Stundennachweis-PDF clientseitig bauen und in den iframe laden
          const html = buildTimesheetHtml({
            preview: false,
            child: {
              data: {
                name: response.child?.name || '',
                familyName: response.child?.familyName || '',
                weeklyHours: response.weeklyHours || response.child?.weeklyHours || 0,
                weeklyHoursByPlan: false
              },
              guardian: {
                name: response.guardian?.name || '',
                familyName: response.guardian?.familyName || ''
              },
              dateOfRegistration: response.dateOfRegistration || ''
            },
            month: response.month || '',
            documentYear: response.year || '',
            documents: (response.dailyReport?.items || []).map((report) => ({
              documentDate: report.documentDate,
              hourFrom: report.hourFrom,
              minuteFrom: report.minuteFrom,
              hourTo: report.hourTo,
              minuteTo: report.minuteTo,
              sick: report.sick,
              sickOnTime: report.sickOnTime,
              reportActivity: report.reportActivity
            })),
            signatureImage: null
          })
          const blob = new Blob([html], { type: 'text/html' })
          if (pdf.value) URL.revokeObjectURL(pdf.value)
          pdf.value = URL.createObjectURL(blob)
          return
        }
        await getPDF(response.key)
      } catch (err) {
        console.log('Err'.err)
      } finally {
      }
    }

    // Fetch the pdf from the storage on the backend
    async function getPDF(key) {
      try {
        // get document from API
        const resp = await store.dispatch('downloadSingleDocument', {
          key: key,
          userPath: document.value.guardian.id
        })
        // Get the object url to push it to the pdf iframe
        pdf.value = resp
      } catch (err) {
        console.log('Error', err)
      }
    }

    // Go to previous timesheet
    function goToPrevious() {
      if (currentIndex.value > 0) {
        id.value = reportsIds.value[currentIndex.value - 1]
        currentIndex.value = currentIndex.value - 1
      }
    }

    // Go to next timesheet
    function goToNext() {
      if (currentIndex.value < reportsIds.value.length - 1) {
        id.value = reportsIds.value[currentIndex.value + 1]
        currentIndex.value = currentIndex.value + 1
      }
    }

    // Return the setup object
    return { document, pdf, goToPrevious, goToNext }
  }
}
</script>