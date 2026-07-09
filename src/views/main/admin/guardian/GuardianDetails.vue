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
  <div class="flex min-h-screen w-full flex-col items-center bg-slate-50">
    <!-- Profil-Header -->
    <div class="w-full px-4 pt-5 sm:px-6 lg:px-8">
      <header class="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
        <button
          type="button"
          @click="goBack"
          title="Zurück zur Übersicht"
          class="shrink-0 rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
        >
          <ArrowLeftIcon class="h-5 w-5" aria-hidden="true" />
        </button>
        <InitialsAvatar :name="fullName" size-class="h-14 w-14 text-lg" />
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-2">
            <h1 class="font-display text-2xl font-black tracking-tight text-slate-900">{{ fullName }}</h1>
          </div>
          <div v-if="chips.length" class="mt-2 flex flex-wrap gap-2">
            <span
              v-for="chip in chips"
              :key="chip"
              class="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
            >{{ chip }}</span>
          </div>
        </div>
      </header>
    </div>
    <div class="w-full px-4 py-5 sm:px-6 lg:px-8">
      <h3 class="text-lg leading-6 font-semibold text-slate-900">Dokumente</h3>
    </div>
    <div v-if="isLoading" class="flex w-full h-full justify-center">
      <LoadingSpinner size="h-12 w-12" />
    </div>
    <div
      v-else
      class="flex w-full flex-col divide-y divide-gray-200 p-2 gap-2"
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
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'

// component imports
import InitialsAvatar from '@/components/UIComponents/InitialsAvatar.vue'
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
    ErrorWindow,
    InitialsAvatar,
    ArrowLeftIcon
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
    const router = useRouter()

    // Initialze Store
    const store = useStore()

    // --- Profil-Header (Anzeige) ---
    const fullName = computed(() => {
      const g = documents.value?.[0]?.guardian
      if (g) {
        return `${g.name || ''} ${g.familyName || ''}`.trim() || 'Betreuer'
      }
      return 'Betreuer'
    })
    const chips = computed(() => {
      const g = documents.value?.[0]?.guardian || {}
      const list = []
      if (g.email) list.push(g.email)
      if (g.phone) list.push(g.phone)
      if (documents.value.length) list.push(`${documents.value.length} Dokumente`)
      return list
    })
    function goBack() {
      router.push({ name: 'GuardianAdminOverview' })
    }

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
      fullName,
      chips,
      goBack,
      fetchGuardianDocuments
    }
  }
}
</script>