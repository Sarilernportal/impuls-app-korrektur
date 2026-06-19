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
        <h1 class="mt-1 text-2xl font-bold sm:text-3xl">Trägerkontakt hinzufügen</h1>
        <p class="mt-2 max-w-3xl text-sm text-blue-50">
          Ansprechpartner einem Träger zuordnen, damit Rückfragen, Freigaben und Abrechnung schneller geklärt werden.
        </p>
      </section>

      <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div class="border-b border-slate-100 pb-4">
          <h2 class="text-lg font-semibold text-slate-900">Kontakt anlegen</h2>
          <p class="mt-1 text-sm text-slate-500">Name, Kontaktweg und Trägerbezug übersichtlich erfassen.</p>
        </div>
        <new-carrier-contact-form
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
import NewCarrierContactForm from '@/components/Main/Admin/CarrierContact/NewCarrierContactForm.vue'
import SuccessWindow from '@/components/UIComponents/Modals/SuccessWindow.vue'
import ErrorWindow from '@/components/UIComponents/Modals/ErrorWindow.vue'
// Utility imports
import { createErrorMessage } from '@/utilities/auth/errorCreator.js'

export default {
  name: 'NewUser',
  props: ['type'],
  components: {
    NewCarrierContactForm,
    SuccessWindow,
    ErrorWindow
  },
  setup(props) {
    // Initialize refs
    const isLoading = ref(false)
    const createSuccess = ref(false)
    const createError = ref(false)
    const errorTitle = ref('')
    // Initialize the store
    const store = useStore()
    // Initialize the router
    const router = useRouter()

    // Custom message to get friendly error messagess
    const customError = computed(() => {
      const errorObject = {
        title: 'Fehlgeschlagen',
        message: `Das Erstellen des Trägerkontakts ist fehlgeschlagen. ${errorTitle.value} `
      }
      return errorObject
    })

    // Custom message to get friendly success messages
    const customSuccess = computed(() => {
      const successObject = {
        title: 'Erfolgreich angelegt',
        message: `Trägerkontakt erfolgreich angelegt.`
      }
      return successObject
    })

    // Method to handle the form submit
    function formSubmitted(userInputs) {
      console.log(userInputs)
      // set up ignore list for validation
      const ignoreList = ['phone', 'email', 'carrier']
      // Create a new object to submit the inputs
      let mappedInputs = {}
      for (const [key, value] of Object.entries(userInputs)) {
        if (!ignoreList.includes(key)) {
          mappedInputs[key] = value.value
        } else {
          // check if not required value is valid
          if (value.isValid) {
            mappedInputs[key] = value.value
          } else {
            mappedInputs[key] = null
          }
        }
      }
      addCarrierContact(mappedInputs)
    }

    // Add the user to the backend
    async function addCarrierContact(userInputs) {
      isLoading.value = true
      try {
        await store.dispatch('addCarrierContact', userInputs)
        createSuccess.value = true
      } catch (err) {
        const errorLog = err.response.data.message
        errorTitle.value = createErrorMessage(errorLog)
        console.log(err.response.data.message)
        createError.value = true
      } finally {
        isLoading.value = false
      }
    }

    // Confirmed the success alert -> Return to the overview
    function confirmedSuccess() {
      createSuccess.value = false
      router.push({ name: 'CarrierContactOverview' })
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
