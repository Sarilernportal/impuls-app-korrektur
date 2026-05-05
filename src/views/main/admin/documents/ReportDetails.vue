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
  <div class="flex flex-col w-full h-full items-center px-4 py-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="flex items-center justify-between w-full">
      <button 
        class="bg-indigo-600 rounded-full text-white p-1"
        @click="goToPrevious"
      >
        <ArrowLeftIcon class="h-6 w-6" />
      </button>
      <h2 class="text-lg font-medium leading-6 text-primaryText">
        Dokumentation Details
      </h2>
      <button 
        class="bg-indigo-600 rounded-full text-white p-1"
        @click="goToNext"
      >
        <ArrowRightIcon class="h-6 w-6" />
      </button>
    </div>
    <!-- Main content container -->
    <div class="flex grow w-full h-full mt-4 sm:flex">
      <!-- PDF viewer -->
      <div class="mb-4 w-full h-full sm:mb-0 sm:mr-4">
        <div v-if="document.retrospectively">
          <p class="mt-4 font-semibold text-gray-500 text-center">
            Die Dokumentation wurde durch einen Administrator erstellt und hat noch keine PDF hinterlegt.
          </p>
        </div>
        <iframe
          v-else
          :src="pdf"
          class="w-full h-full"
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
import _ from 'lodash'

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
        if (!response.retrospectively) {
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
    return { document, pdf, id, goToNext, goToPrevious }
  }
}
</script>