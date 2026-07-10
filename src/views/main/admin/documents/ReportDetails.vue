<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus
07.11.2022

Scope:
Report Details
-->

<template>
  <div class="flex h-full w-full flex-col items-center bg-app-bg px-4 py-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="flex w-full items-center justify-between">
      <button
        class="rounded-lg bg-impuls-blue p-2 text-white transition hover:bg-brand-700"
        @click="goToPrevious"
      >
        <ArrowLeftIcon class="h-6 w-6" />
      </button>
      <h2 class="font-display text-lg font-bold text-slate-900">
        Dokumentation Details
      </h2>
      <button
        class="rounded-lg bg-impuls-blue p-2 text-white transition hover:bg-brand-700"
        @click="goToNext"
      >
        <ArrowRightIcon class="h-6 w-6" />
      </button>
    </div>
    <!-- Main content container -->
    <div class="mt-4 flex h-full w-full grow">
      <!-- PDF viewer -->
      <div class="mb-4 h-full w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card sm:mb-0">
        <div v-if="document.retrospectively">
          <p class="mt-4 text-center font-semibold text-slate-500">
            Die Dokumentation wurde durch einen Administrator erstellt und hat noch keine PDF hinterlegt.
          </p>
        </div>
        <iframe
          v-else
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
import { buildReportHtml } from '@/utilities/documents/reportPrint.js'

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
    // Ref initialization
    const pdf = ref(null)
    const document = ref({})
    const route = useRoute()

    const reportsIds = computed(() => { 
      const reportsData = props.reportsIds ?? route.query.reportsIds
      try {
        return typeof reportsData === 'string' ? JSON.parse(reportsData) : reportsData
      } catch {
        return []
      }
    })
    const currentIndex = ref(props.currentIndex ?? Number(route.query.currentIndex))
    const id = ref(props.id)

    // Store initialization
    const store = useStore()

    // Watch for changes in id
    watch(id, async (newId) => {
      await getReport(newId)
    })

    // Mounted hook to perform action on mounting the component
    onMounted(async () => {
      await getReport(id.value)
    })

    // Get the report from the database
    async function getReport(id) {
      try {
        // Get the response from the database within the report object
        const response = await store.dispatch('getSingleDailyReport', { id })
        // Fetch the pdf
        document.value = response
        if (isLocalAuthMode) {
          // Demo: PDF clientseitig aus dem Report erzeugen und in den iframe laden
          const blob = new Blob([buildReportHtml(response)], { type: 'text/html' })
          if (pdf.value) URL.revokeObjectURL(pdf.value)
          pdf.value = URL.createObjectURL(blob)
        } else if (!response.retrospectively) {
          await getPDF(response.key)
        }
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

    // Go to previous report
    function goToPrevious() {
      if (currentIndex.value > 0) {
        id.value = reportsIds.value[currentIndex.value - 1]
        currentIndex.value = currentIndex.value - 1
      }
    }

    // Go to next report
    function goToNext() {
      if (currentIndex.value < reportsIds.value.length - 1) {
        id.value = reportsIds.value[currentIndex.value + 1]
        currentIndex.value = currentIndex.value + 1
      }
    }

    // Return the setup object
    return { document, pdf, goToNext, goToPrevious }
  }
}
</script>