<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
21.09.2022

Scope:
Guardian Details
-->

<template>
  <!-- Error modal -->
  <error-window
    v-if="customError.isPresent"
    :title="customError.title"
    :message="customError.message"
    :open="customError.isPresent"
    @close="customErrorConfirmed"
  />
  <div class="flex flex-col w-full h-full items-center">
    <div class="w-full px-4 py-5 sm:px-6 lg:w-4/5 lg:px-8">
      <h3 class="text-lg leading-6 font-semibold text-slate-900">Dokumente</h3>
    </div>
    <div v-if="isLoading" class="flex w-full h-full justify-center">
      <LoadingSpinner size="h-12 w-12" />
    </div>
    <div
      v-else
      class="flex w-full flex-col lg:w-4/5 divide-y divide-gray-200 p-2 gap-2"
    >
      <div v-for="document in documents" :key="document.id" class="pt-2">
        <ReportListItem
          v-if="document.documentType == 'dailyReport'"
          :report="document"
        />
        <TimeSheetListItem
          v-if="document.documentType == 'timeSheet'"
          :report="document"
        />
      </div>
      <div v-if="nextToken !== null" class="flex w-full p-2 justify-center">
        <button
          class="py-2 px-4 border border-transparent text-sm font-medium text-white rounded-xl bg-indigo-600 hover:bg-indigo-700"
          @click="fetchGuardianDocuments"
        >
          Weitere Dokumente laden
        </button>
      </div>
    </div>
  </div>
</template>

<script>
// Vue imports
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

// component imports
import ReportListItem from '@/components/Main/Admin/Documents/ReportListItem.vue'
import TimeSheetListItem from '@/components/Main/Admin/Documents/TimeSheetListItem.vue'
import LoadingSpinner from '@/components/UIComponents/Utilities/LoadingSpinner.vue'
import ErrorWindow from '@/components/UIComponents/Modals/ErrorWindow.vue'

// Utility imports
import {
  createErrorMessage,
  createErrorTitle
} from '@/utilities/auth/errorCreator.js'

export default {
  name: 'Guardian Details',
  components: {
    ReportListItem,
    TimeSheetListItem,
    LoadingSpinner,
    ErrorWindow
  },
  setup() {
    // initialize refs
    const documents = ref([])
    const isLoading = ref(false)
    const nextToken = ref(null)

    // Initialize Reactives
    const customError = reactive({
      isPresent: false,
      title: '',
      message: ''
    })

    // Initialize Route & Router
    const route = useRoute()

    // Initialze Store
    const store = useStore()

    async function fetchGuardianDocuments() {
      try {
        isLoading.value = true
        // get guardian id
        const id = route.params.id
        // get documents
        const documentResponse = await store.dispatch(
          'getDocumentsByGuardianID',
          {
            guardianID: id,
            nextToken: nextToken.value
          }
        )

        // get data from response
        documents.value.push(...documentResponse.items)
        nextToken.value = documentResponse.nextToken
      } catch (err) {
        // Log the error
        console.log(err)
        const errorLog = err.response.data.message
        customError.isPresent = true
        customError.title = createErrorTitle(errorLog)
        customError.message = createErrorMessage(errorLog)
      } finally {
        isLoading.value = false
      }
    }

    onMounted(() => {
      fetchGuardianDocuments()
    })

    return {
      documents,
      isLoading,
      nextToken,
      customError,
      fetchGuardianDocuments
    }
  }
}
</script>