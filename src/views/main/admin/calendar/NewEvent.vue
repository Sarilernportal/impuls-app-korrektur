<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
21.04.2023

Scope:
New Event
-->

<template>
  <div>
    <!-- Error modal -->
    <error-window
      v-if="createSuccess === 'error'"
      :title="'Event konnte nicht erstellt werden'"
      :message="'Während der Erstellung des Events ist ein Fehler aufgetreten.'"
      :open="createSuccess === 'error'"
      @close="closeErrorModal"
    />
    <!-- Success modal -->
    <success-window
      v-if="createSuccess === 'success'"
      title="Event erstellt"
      message="Das Event wurde erfolgreich erstellt."
      :open="createSuccess === 'success'"
      @close="closeSuccessModal"
    />
  </div>
  <div class="min-h-full bg-slate-50 px-4 pb-24 pt-5 sm:px-6 lg:px-8">
    <div class="mx-auto flex max-w-5xl flex-col gap-5">
      <section class="rounded-lg bg-impuls-blue p-4 text-white sm:p-5 shadow-sm">
        <p class="text-sm font-semibold text-blue-100">Kalender</p>
        <h1 class="mt-1 text-2xl font-bold sm:text-3xl">Termin erstellen</h1>
        <p class="mt-2 max-w-2xl text-sm text-blue-50">
          Termin, Kalendergruppe und Zeitraum in einem klaren Ablauf erfassen.
        </p>
      </section>

      <form
        @submit.prevent="confirmButtonTapped"
        class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div class="border-b border-slate-100 pb-4">
          <h2 class="text-lg font-semibold text-slate-900">Termindaten</h2>
          <p class="mt-1 text-sm text-slate-500">Pflichtdaten ausfüllen, Kalender wählen und Datum festlegen.</p>
        </div>

        <div class="mt-5 grid gap-5 lg:grid-cols-2">
          <div class="grid gap-5">
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
                placeholder="Eventbeschreibung"
                enterButtonEvent="emitEvent"
                @input-value="setDescription"
                @is-valid="setDescriptionValidation"
              />
            </div>
            <div>
              <input-label
                elementID="link"
                labelText="Verlinkung"
              />
              <TextTextfield
                elementID="link"
                name="link"
                placeholder="URL"
                enterButtonEvent="emitEvent"
                @input-value="setLink"
                @is-valid="setLinkValidation"
              />
            </div>
            <div class="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <input-label
                elementID="calendar"
                labelText="Kalender auswählen*"
              />
              <div class="mt-3">
                <CalendarSelection
                  :enableAddButton="true"
                  @calendar-selected="CalendarSelected"
                />
              </div>
              <div
                v-if="selectedCalendar"
                class="mt-3 flex items-center gap-2 rounded-lg bg-white p-2 text-sm text-slate-700"
              >
                <span
                  class="h-5 w-5 rounded-full"
                  :style="{ backgroundColor: selectedCalendar.color }"
                ></span>
                <span class="font-medium">{{ selectedCalendar.title }}</span>
              </div>
            </div>
          </div>

          <div class="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <input-label
              elementID="date"
              labelText="Datum*"
            />
            <div class="mt-3 flex justify-center">
              <CalendarUnlimited
                @date-selected="DateSelected"
                @time-selected="TimeSelected"
              />
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
import CalendarUnlimited from '@/components/UIComponents/Inputs/CalendarUnlimited.vue'
import CalendarSelection from '@/components/Main/Admin/Calendar/CalendarSelection.vue'

export default {
  name: 'NewCalendar',
  components: {
    TextLargeTextfield,
    TextTextfield,
    InputLabel,
    StandardButton,
    ErrorWindow,
    SuccessWindow,
    CalendarUnlimited,
    CalendarSelection
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
    const link = ref(null)
    const linkValidation = ref(false)
    const isLoading = ref(false)
    const createSuccess = ref('none')
    const date = ref(null)
    const selectedCalendar = ref(null)
    const duration = ref(0)
    const durationMax = ref(12)

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
    function setLink(val) {
      link.value = val
    }
    function setLinkValidation(val) {
      linkValidation.value = val
    }

    // calendar selection
    function CalendarSelected(calendar) {
      selectedCalendar.value = calendar
    }

    // Callback when user selects time
    function TimeSelected(event) {
      // calculate duration of event
      const durationCalc =
        event.hourTo +
        event.minuteTo / 60 -
        (event.hourFrom + event.minuteFrom / 60)
      // save duration in ref
      duration.value = durationCalc
    }

    // Callback when the user select a day
    function DateSelected(event) {
      date.value = event
    }

    // create calendar
    async function confirmButtonTapped() {
      try {
        if (inputsValid.value) {
          // set loading state
          isLoading.value = true

          // create params object
          const eventParams = {
            title: title.value,
            description: description.value,
            link: link.value,
            calendarEventsId: selectedCalendar.value.id,
            startDate: date.value,
            durationInHours: duration.value,
            active: 'active'
          }

          // create calendar
          const resp = await store.dispatch('createEvent', eventParams)

          // set success state
          createSuccess.value = 'success'
        }
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
          date.value !== null &&
          selectedCalendar.value !== null &&
          !isLoading.value
        )
      } catch (error) {
        console.log(error)
      }
    })

    // Return the setup object
    return {
      isLoading,
      inputsValid,
      createSuccess,
      date,
      selectedCalendar,
      durationMax,
      setTitle,
      setTitleValidation,
      setDescription,
      setDescriptionValidation,
      setLink,
      setLinkValidation,
      CalendarSelected,
      confirmButtonTapped,
      closeErrorModal,
      closeSuccessModal,
      TimeSelected,
      DateSelected
    }
  }
}
</script>
