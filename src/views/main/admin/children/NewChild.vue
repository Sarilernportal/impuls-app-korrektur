<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
26.09.2022

Scope:
Add new carrier
-->

<template>
  <div class="min-h-full bg-slate-50 px-4 pb-24 pt-5 sm:px-6 lg:px-8">
    <div>
      <success-window
        v-if="createSuccess"
        :title="customSuccess.title"
        :message="customSuccess.message"
        :open="createSuccess"
        @close="confirmedSuccess"
      />
      <!-- Error modal -->
      <error-window
        v-if="createError"
        :title="customError.title"
        :message="customError.message"
        :open="createError"
        @close="createError = false"
      />
    </div>

    <div class="flex w-full flex-col gap-5">
      <section class="rounded-xl bg-gradient-to-br from-impuls-blue via-brand-700 to-brand-900 p-5 text-white shadow-soft">
        <p class="text-sm font-semibold text-blue-100">Verwaltung</p>
        <h1 class="mt-1 font-display text-2xl font-black tracking-tight sm:text-3xl">Klient hinzufügen</h1>
        <p class="mt-2 max-w-3xl text-sm text-blue-50">
          Stammdaten, Sorgeberechtigte und Trägerzuordnung sauber erfassen, damit Doku, Nachweise und Abrechnung direkt greifen.
        </p>
      </section>

      <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <div class="border-b border-slate-100 pb-4">
          <h2 class="font-display text-lg font-bold text-slate-900">Fallakte anlegen</h2>
        </div>
        <new-child-wizard
          class="mt-5"
          :isLoading="isLoading"
          @submit-inputs="formSubmitted"
        />
      </section>
    </div>
  </div>
</template>

<script>
// Vue imports
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
// Component imports
import NewChildWizard from '@/components/Main/Admin/Children/NewChildWizard.vue'
import SuccessWindow from '@/components/UIComponents/Modals/SuccessWindow.vue'
import ErrorWindow from '@/components/UIComponents/Modals/ErrorWindow.vue'

// Utility imports
import { createErrorMessage } from '@/utilities/auth/errorCreator.js'

export default {
  name: 'NewChild',
  props: ['type'],
  components: {
    NewChildWizard,
    SuccessWindow,
    ErrorWindow
  },
  setup(props) {
    // Initialize refs
    const isLoading = ref(false)
    const createSuccess = ref(false)
    const createError = ref(false)
    const errorTitle = ref('')
    const createdChild = ref(null)

    // Initialize the store
    const store = useStore()

    // Initialize the router
    const router = useRouter()

    // Custom message to get friendly error messagess
    const customError = computed(() => {
      const errorObject = {
        title: 'Fehlgeschlagen',
        message: `Das Erstellen des Klienten ist fehlgeschlagen. ${errorTitle.value} `
      }
      return errorObject
    })

    // Custom message to get friendly success messages
    const customSuccess = computed(() => {
      const successObject = {
        title: 'Erfolgreich angelegt',
        message: `Klient erfolgreich angelegt.`
      }
      return successObject
    })

    // Method to handle the form submit
    function formSubmitted(userInputs) {
      // Create a new object to submit the inputs
      let mappedInputs = {}
      for (const [key, value] of Object.entries(userInputs)) {
        mappedInputs[key] = value.value
      }
      addChild(mappedInputs)
    }

    // Add the user to the backend
    async function addChild(userInputs) {
      isLoading.value = true
      try {
        // create child via store
        const childReponse = await store.dispatch('addChild', userInputs)
        console.log(childReponse)
        // set create success value
        createSuccess.value = true
        // save created child in ref --> required for redirect
        createdChild.value = childReponse.data.createChild
      } catch (err) {
        console.log(err)
        const errorLog = err?.response?.data?.message || err?.message || 'Unbekannter Fehler'
        errorTitle.value = createErrorMessage(errorLog)
        console.log(errorLog)
        createError.value = true
      } finally {
        isLoading.value = false
      }
    }

    // Confirmed the success alert -> Return to the overview
    function confirmedSuccess() {
      createSuccess.value = false
      // push to detail page of child
      if (createdChild.value?.id) {
        router.push({ name: 'ChildDetails', params: { id: createdChild.value.id } })
      } else {
        // fallback in case saving fails
        router.push({ name: 'ChildrenOverview' })
      }
    }

    // Return the setup object
    return {
      isLoading,
      createSuccess,
      createError,
      customSuccess,
      customError,
      formSubmitted,
      confirmedSuccess
    }
  }
}
</script>
