<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
20.04.2023

Scope:
New Calendar
-->

<template>
  <div>
    <!-- Error modal -->
    <error-window
      v-if="createSuccess === 'error'"
      :title="'Kalender konnte nicht erstellt werden'"
      :message="'Während der Erstellung des Kalenders ist ein Fehler aufgetreten.'"
      :open="createSuccess === 'error'"
      @close="closeErrorModal"
    />
    <!-- Success modal -->
    <success-window
      v-if="createSuccess === 'success'"
      title="Kalender erstellt"
      message="Der Kalender wurde erfolgreich erstellt."
      :open="createSuccess === 'success'"
      @close="closeSuccessModal"
    />
  </div>
  <div class="min-h-full bg-slate-200 px-4 pb-24 pt-5 sm:px-6 lg:px-8">
    <div class="flex w-full flex-col gap-5">
      <section class="rounded-xl bg-gradient-to-br from-impuls-blue via-brand-700 to-brand-900 p-5 text-white shadow-soft">
        <p class="text-sm font-semibold text-blue-100">Kalender</p>
        <h1 class="mt-1 font-display text-2xl font-black tracking-tight sm:text-3xl">Kalender erstellen</h1>
        <p class="mt-2 max-w-2xl text-sm text-blue-50">
          Eine Kalendergruppe für Betreuung, Teamtermine oder interne Planung anlegen.
        </p>
      </section>

      <form
        @submit.prevent="confirmButtonTapped"
        class="rounded-2xl border border-slate-200 bg-white p-5 shadow-card"
      >
        <div class="border-b border-slate-100 pb-4">
          <h2 class="font-display text-lg font-bold text-slate-900">Kalenderdaten</h2>
          <p class="mt-1 text-sm text-slate-500">Titel, Beschreibung und Farbe für die spätere Wiedererkennung.</p>
        </div>

        <div class="mt-5 grid gap-5">
          <div>
            <input-label
              elementID="title"
              labelText="Titel*"
            />
            <TextTextfield
              elementID="title"
              name="title"
              placeholder="Titel"
              enterButtonEvent="emitEvent"
              @input-value="setTitle"
              @is-valid="setTitleValidation"
            />
          </div>
          <div>
            <input-label
              elementID="description"
              labelText="Beschreibung*"
            />
            <TextLargeTextfield
              elementID="desciption"
              name="desciption"
              placeholder="Kalenderbeschreibung"
              enterButtonEvent="emitEvent"
              @input-value="setDescription"
              @is-valid="setDescriptionValidation"
            />
          </div>
          <div class="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <input-label
              elementID="color"
              labelText="Farbe auswählen*"
            />
            <div class="mt-2 flex items-center gap-3">
              <input
                class="h-11 w-14 cursor-pointer rounded-lg border border-slate-300 bg-white p-1"
                type="color"
                v-model="calendarColor"
              />
              <div>
                <p class="text-sm font-semibold uppercase tabular-nums text-slate-900">{{ calendarColor }}</p>
                <p class="text-sm text-slate-500">Diese Farbe erscheint später in der Kalenderliste.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <span class="text-sm font-medium text-slate-500">* Pflichtangabe</span>
          <div class="w-full sm:w-48">
            <StandardButton
              title="Erstellen"
              :enabled="inputsValid"
              :isLoading="isLoading"
            />
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
// vue imports
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

// component imports
import TextLargeTextfield from '@/components/UIComponents/Inputs/TextLargeTextfield.vue'
import TextTextfield from '@/components/UIComponents/Inputs/TextTextfield.vue'
import InputLabel from '@/components/UIComponents/Labels/InputLabel.vue'
import StandardButton from '@/components/UIComponents/Buttons/StandardButton.vue'
import ErrorWindow from '@/components/UIComponents/Modals/ErrorWindow.vue'
import SuccessWindow from '@/components/UIComponents/Modals/SuccessWindow.vue'

export default {
  name: 'NewCalendar',
  components: {
    TextLargeTextfield,
    TextTextfield,
    InputLabel,
    StandardButton,
    ErrorWindow,
    SuccessWindow
  },
  props: {
    userList: {
      type: Object,
      required: false
    }
  },
  setup() {
    // initialize refs
    const title = ref('')
    const titleValidation = ref(false)
    const description = ref('')
    const descriptionValidation = ref(false)
    const isLoading = ref(false)
    const createSuccess = ref('none')
    const calendarColor = ref('#ffffff')

    // initialize rotuer
    const router = useRouter()

    // initialize store
    const store = useStore()

    // setter methods
    function setTitle(val) {
      title.value = val
    }
    function setTitleValidation(val) {
      titleValidation.value = val
    }
    function setDescription(val) {
      description.value = val
    }
    function setDescriptionValidation(val) {
      descriptionValidation.value = val
    }

    // create calendar
    async function confirmButtonTapped() {
      console.log(inputsValid.value)
      try {
        // set loading state
        isLoading.value = true

        // create calendar
        const resp = await store.dispatch('createCalendar', {
          title: title.value,
          description: description.value,
          color: calendarColor.value
        })

        // set success state
        createSuccess.value = 'success'
      } catch (error) {
        console.log(error)
        // set error state
        createSuccess.value = 'error'
      } finally {
        // reset loading state
        isLoading.value = false
      }
    }

    function closeErrorModal() {
      // close modal
      createSuccess.value = 'none'
    }

    function closeSuccessModal() {
      // close modal
      createSuccess.value = 'none'

      // push to overview
      router.push({ name: 'CalendarOverview' })
    }

    // compute validation status
    const inputsValid = computed(() => {
      try {
        return (
          titleValidation.value &&
          descriptionValidation.value &&
          !isLoading.value
        )
      } catch (error) {
        console.log(error)
        return false
      }
    })

    // Return the setup object
    return {
      isLoading,
      inputsValid,
      createSuccess,
      calendarColor,
      setTitle,
      setTitleValidation,
      setDescription,
      setDescriptionValidation,
      confirmButtonTapped,
      closeErrorModal,
      closeSuccessModal
    }
  }
}
</script>
