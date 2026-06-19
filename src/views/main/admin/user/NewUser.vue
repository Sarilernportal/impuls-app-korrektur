<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
19.09.2022

Scope:
Add new user
-->

<template>
  <!-- Main container -->
  <div class="w-full h-full">
    <div>
      <!-- Success modal -->
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
    <div class="min-h-full bg-slate-50 px-4 pb-24 pt-5 sm:px-6 lg:px-8">
      <div class="flex w-full flex-col gap-5">
        <section class="rounded-xl bg-gradient-to-br from-impuls-blue via-brand-700 to-brand-900 p-5 text-white shadow-soft sm:px-6 sm:py-7">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p class="text-sm font-medium text-blue-100">Verwaltung</p>
              <h1 class="mt-1 text-2xl font-bold sm:text-3xl">{{ typeTitle }} hinzufügen</h1>
              <p class="mt-2 max-w-3xl text-sm text-blue-100">
                Zugangsdaten und Rolle sauber erfassen, damit der neue Zugang direkt korrekt zugeordnet ist.
              </p>
            </div>
            <div class="rounded-lg bg-white/15 px-4 py-3 text-sm font-semibold text-white">
              {{ type === 'admin' ? 'Admin-Zugang' : 'Mitarbeiter-Zugang' }}
            </div>
          </div>
        </section>

        <div class="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]">
          <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div class="mb-5 flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 class="text-lg font-semibold text-slate-900">Stammdaten</h2>
                <p class="mt-1 text-sm text-slate-500">Name, Kontakt und Berechtigung für den neuen Zugang.</p>
              </div>
              <UserPlusIcon class="h-8 w-8 text-impuls-blue" aria-hidden="true" />
            </div>
            <new-user-form
              :isLoading="isLoading"
              :isAdmin="type === 'admin'"
              @submit-inputs="formSubmitted"
            />
          </section>

          <aside class="grid content-start gap-5">
            <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 class="text-lg font-semibold text-slate-900">Prüfung</h2>
              <div class="mt-4 grid gap-3">
                <div
                  v-for="item in checklist"
                  :key="item.title"
                  class="flex gap-3 rounded-lg bg-slate-50 p-3"
                >
                  <span class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                    <component :is="item.icon" class="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p class="font-semibold text-slate-900">{{ item.title }}</p>
                    <p class="text-sm text-slate-600">{{ item.description }}</p>
                  </div>
                </div>
              </div>
            </section>

            <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 class="text-lg font-semibold text-slate-900">Nach dem Anlegen</h2>
              <p class="mt-2 text-sm text-slate-600">
                Der Zugang erscheint anschließend in der Übersicht. Klienten und Zuständigkeiten können danach in den Details ergänzt werden.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Vue imports
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
// Component imports
import NewUserForm from '@/components/Main/Admin/User/NewUserForm.vue'
import SuccessWindow from '@/components/UIComponents/Modals/SuccessWindow.vue'
import ErrorWindow from '@/components/UIComponents/Modals/ErrorWindow.vue'
import { AtSymbolIcon, ShieldCheckIcon, UserPlusIcon } from '@heroicons/vue/24/outline'
// Utility imports
import { createErrorMessage } from '@/utilities/auth/errorCreator.js'

// Define allowed types, which the admin can create
const allowedTypes = ['admin', 'guardian']

export default {
  name: 'NewUser',
  props: ['type'],
  components: {
    AtSymbolIcon,
    NewUserForm,
    ShieldCheckIcon,
    SuccessWindow,
    ErrorWindow,
    UserPlusIcon
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
    // Set the title of the specific type
    const typeTitle = computed(() => {
      if (props.type === 'admin') {
        return 'Admin'
      } else if (props.type === 'guardian') {
        return 'Betreuer'
      } else {
        return 'Nicht angegeben'
      }
    })

    const checklist = computed(() => [
      {
        title: 'Kontakt prüfen',
        description: 'E-Mail ist Pflicht und wird für den Zugang verwendet.',
        icon: AtSymbolIcon
      },
      {
        title: 'Rolle setzen',
        description: props.type === 'admin' ? 'Admin erhält Verwaltungsrechte.' : 'Fachkraftstatus wird am Profil gespeichert.',
        icon: ShieldCheckIcon
      }
    ])

    // Custom message to get friendly error messagess
    const customError = computed(() => {
      const errorObject = {
        title: 'Fehlgeschlagen',
        message: `Das Erstellen des ${typeTitle.value} ist fehlgeschlagen. ${errorTitle.value} `
      }
      return errorObject
    })

    // Custom message to get friendly success messages
    const customSuccess = computed(() => {
      const successObject = {
        title: 'Erfolgreich angelegt',
        message: `${typeTitle.value} erfolgreich angelegt. Der neue Nutzer wird nun mit seinen Zugangsdaten per SMS oder E-Mail informiert.`
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
      addUser(mappedInputs)
    }

    // Add the user to the backend
    async function addUser(userInputs) {
      isLoading.value = true
      try {
        const attributes = userInputs
        await store.dispatch('addUser', { attributes, groupname: props.type })
        createSuccess.value = true
      } catch (err) {
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
      router.push({
        name: props.type === 'guardian' ? 'GuardianAdminOverview' : 'UserOverview'
      })
    }

    // Return the setup object
    return {
      isLoading,
      createSuccess,
      createError,
      customSuccess,
      customError,
      typeTitle,
      checklist,
      formSubmitted,
      confirmedSuccess
    }
  },
  // Check if the route contains the allowed types, which the admin can create, if not go back to User Overview
  beforeRouteEnter(to, _, next) {
    if (allowedTypes.includes(to.params.type)) {
      next()
    } else {
      next({ name: 'UserOverview' })
    }
  }
}
</script>
