<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus
22.06.2024
Scope:
Special Report View
-->

<template>
  <div class="mx-auto max-w-3xl px-4 py-4 sm:px-6">
    <div>
      <!-- Error modal -->
      <error-window
        v-if="reportSuccess === 'error'"
        title="Fehler"
        message="Ihr Sonderzeitenbericht konnte nicht erstellt werden. Bitte stellen Sie sicher, dass Sie alle Pflichtfelder ausgefüllt haben und über eine stabile Internetverbindung verfügen."
        :open="reportSuccess === 'error'"
        @close="reportSuccess = 'none'"
      />
      <!-- Success modal -->
      <success-window
        v-if="reportSuccess === 'success'"
        title="Sonderzeitenbericht erstellt"
        message="Ihr Sonderzeitenbericht wurde erfolgreich erstellt."
        :open="reportSuccess === 'success'"
        @close="goToHome"
      />
    </div>
    <!-- Form wrapper -->
    <form :class="[
      isLoading ? 'hidden' : 'block',
      'space-y-8 divide-y divide-slate-200'
    ]">
      <div class="space-y-8 divide-y divide-slate-200 sm:space-y-5">
        <div class="space-y-6 sm:space-y-5">
          <!-- Header -->
          <div>
            <h3 class="text-lg font-medium leading-6 text-primaryText">
              Sonderzeitenbericht erstellen
            </h3>
            <p class="mt-1 max-w-2xl text-sm text-secondaryText">
              Erstellen Sie einen Sonderzeitenbericht für die ausgeführte Aktivität.
            </p>
          </div>

          <div>
            <!-- report activity selection -->
            <div class="py-2">
              <div
                class="text-base font-medium text-primaryText sm:text-sm"
                id="reportActivity"
              >
                Tätigkeit auswählen
              </div>
              <p class="text-sm text-secondaryText">
                Wählen Sie die zutreffende Tätigkeit aus. Eine Tätigkeiten deaktivieren die Zeitauswahl.
              </p>
              <SimpleDropdown
                class="w-full mt-1"
                :displayTitle="false"
                title="Tätigkeit auswählen"
                :properties="[
                  'Feiertag',
                  'Urlaub',
                  'Krankmeldung',
                  'Sonstiges',
                  'Supervision',
                  'Teamsitzung'
                ]"
                defaultSelected="Teamsitzung"
                @selection="reportActivitySelected"
              />
            </div>
            <!-- calendar | date + time selection -->
            <div class="flex flex-col gap-2 sm:border-t sm:border-slate-200">
              <p class="text-base font-medium text-primaryText sm:text-sm">
                Zeitraum auswählen*
              </p>
              <p class="text-sm text-secondaryText">
                Wählen Sie den betroffenen Tag, sowie Start- und Endzeitpunkt aus.
              </p>
              <Calendar
                class="self-center"
                :showTimeSelection="allowTimeSelection"
                :minimumDateRange="minimumDateRange"
                :maximumDateRange="maximumDateRange"
                :calendarShowRange="calendarShowRange"
                @date-selected="DateSelected"
                @time-selected="TimeSelected"
              />
            </div>
            <!-- Daily report input -->
            <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-slate-200 pt-2 sm:pt-5">
              <label
                for="report"
                class="block text-sm font-medium text-primaryText sm:mt-px sm:pt-2"
              >Begründung*</label>
              <div class="mt-1 sm:col-span-2 sm:mt-0">
                <textarea
                  @input="reportFilled"
                  id="report"
                  name="report"
                  rows="3"
                  class="block w-full max-w-lg rounded-lg border-slate-300 shadow-sm focus:border-impuls-blue focus:ring-brand-100 sm:text-sm"
                />
                <p class="mt-2 text-sm text-secondaryText">Mehrere Sätze möglich.</p>
              </div>
            </div>
            <!-- Signature field for the school guardian -->
            <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-slate-200 sm:pt-5">
              <div class="col-span-1 sm:col-span-2 md:col-span-1">
                <SignatureField
                  ref="signatureField"
                  @get-image="signatureProvided"
                  class="mt-2"
                />
              </div>
              <p class="mt-2 text-sm text-secondaryText">
                Rechtsverbindliche elektronische Unterschrift.
              </p>
              <!-- truthfull button -->
              <div class="flex my-2 text-primaryText gap-2 items-center">
                <input
                  @click="thruthfullButtonTapped"
                  class="w-4 h-4 text-impuls-blue bg-white border-gray-300 rounded focus:ring-brand-200 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2"
                  type="checkbox"
                  id="truthfull"
                  value="truthfull"
                />
                <label for="truthfull">Ich versichere, dass die vorstehenden Angaben vollständig und
                  wahrheitsgemäß sind.</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
    <!-- Submit button section -->
    <div
      v-if="errorState === 'none'"
      :class="[isLoading ? 'hidden' : 'block', 'p-4']"
    >
      <!-- error message if not all required fields were filled -->
      <div
        v-if="!inputValid"
        class="flex items-center justify-center w-full h-full bg-red-50 border border-red-200 rounded-xl p-2"
      >
        <p class="text-center text-red-600 text-sm font-medium">
          Es wurden nicht alle Pflichtfelder ausgefüllt!
        </p>
      </div>
      <!-- submit button -->
      <StandardButton
        v-else
        @button-tapped="confirmButtonTapped"
        title="Bestätigen"
        :enabled="inputValid"
        :isLoading="isLoading"
      />
    </div>
    <!-- required fields reminder -->
    <div
      v-if="!isLoading && errorState === 'none'"
      class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-slate-200 sm:pt-5"
    >
      <p class="text-base font-medium text-secondaryText sm:text-sm">*Pflichtfeld</p>
    </div>
    <!-- loading spinenr -->
    <div
      v-if="isLoading"
      class="w-full flex justify-center"
    >
      <LoadingSpinner size="h-12 w-12" />
    </div>
  </div>
</template>


<script>
// Vue imports
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

// Component imports
import SignatureField from '@/components/UIComponents/Inputs/SignatureField.vue'
import StandardButton from '@/components/UIComponents/Buttons/StandardButton.vue'
import SimpleDropdown from '@/components/UIComponents/Dropdowns/SimpleDropdown.vue'
import Calendar from '@/components/UIComponents/Inputs/Calendar.vue'
import ErrorWindow from '@/components/UIComponents/Modals/ErrorWindow.vue'
import SuccessWindow from '@/components/UIComponents/Modals/SuccessWindow.vue'
import LoadingSpinner from '@/components/UIComponents/Utilities/LoadingSpinner.vue'

export default {
  name: 'ReportView',
  components: {
    SignatureField,
    StandardButton,
    SimpleDropdown,
    Calendar,
    ErrorWindow,
    SuccessWindow,
    LoadingSpinner
  },
  setup() {
    const inputDataDefault = {
      schoolguardian: '',
      schoolguardianID: '',
      report: '',
      date: null,
      endDate: null,
      hourFrom: null,
      hourTo: null,
      minuteFrom: null,
      minuteTo: null,
      reportActivity: 'teamMeeting'
    }
    // Ref initialization
    const signatureField = ref()
    const inputData = ref(structuredClone(inputDataDefault))
    const signature = ref(null)
    const truthfull = ref(false)
    const isLoading = ref(false)
    const reportSuccess = ref('none')
    const errorState = ref('none')
    const allowTimeSelection = ref(true)
    const specialTimeSelected = ref(false)
    const minimumDateRange = ref(730)
    const maximumDateRange = ref(730)
    const calendarShowRange = ref(false)

    // Store initialization
    const store = useStore()

    // router initialization
    const router = useRouter()

    // Callback when the user select a day
    function DateSelected(event) {
      if (calendarShowRange.value) {
        inputData.value.date = event.start
        inputData.value.endDate = event.end
      } else {
        inputData.value.date = event
        inputData.value.endDate = null
      }
    }

    // Callback when the user selects a reportActivity
    function reportActivitySelected(event) {
      // create dictionary to translate from selection to enum value
      const reportActivityterms = {
        Feiertag: 'holiday',
        Urlaub: 'vacation',
        Krankmeldung: 'employeeSickness',
        Sonstiges: 'other',
        Supervision: 'supervision',
        Teamsitzung: 'teamMeeting'
      }
      inputData.value.reportActivity = reportActivityterms[event]
      // check for time enable/disable state
      checkTimeEnable()
    }

    // Callback when the user types in content for the report
    function reportFilled(event) {
      inputData.value.report = event.target.value
    }

    // Callback when the user types in content for the signature
    function signatureProvided(event) {
      signature.value = event
    }

    // Callback when user selects truthfull button
    function thruthfullButtonTapped(event) {
      truthfull.value = event.target.checked
    }

    // Callback when the user hits the confirm button
    async function confirmButtonTapped() {
      await submitReport()
    }

    // Callback when the user selects start and end time
    function TimeSelected(event) {
      for (const value in event) {
        inputData.value[value] = event[value]
      }
    }

    // check if time selection should be disabled
    function checkTimeEnable() {
      try {
        // create blacklist of activities where time should be disabled
        const blacklist = ['holiday', 'vacation', 'employeeSickness', 'other']

        // check if new activity is in blacklist 
        if (blacklist.includes(inputData.value.reportActivity)) {
          // disable time selection
          allowTimeSelection.value = false
          // set time to default values
          TimeSelected({ hourFrom: 12, hourTo: 12, minuteFrom: 0, minuteTo: 0 })
        } else {
          allowTimeSelection.value = true
        }

        // check if calendar should allow range selection
        const rangeList = ['employeeSickness', 'vacation']
        if (rangeList.includes(inputData.value.reportActivity)) {
          calendarShowRange.value = true
        } else {
          calendarShowRange.value = false
        }
      } catch (error) {
        console.log(error)
      }
    }

    // Method to submit the report
    async function submitReport() {
      if (inputValid.value) {
        try {
          // set loading state
          isLoading.value = true
          // Get the image from the signature field
          signature.value
          // Get the guardian object from the store
          inputData.value.guardian = store.getters.guardian
          // Create the report in the backend via store
          const resp = await store.dispatch('createSpecialReport', {
            data: inputData.value,
            signature: signature.value
          })
          // set success state
          reportSuccess.value = 'success'
        } catch (error) {
          console.log(error)
          // set success state
          reportSuccess.value = 'error'
          // reset signature state
          signature.value = null
        } finally {
          // set loading state
          isLoading.value = false
        }
      }
    }

    const inputValid = computed(() => {
      // check shared required values
      if (
        inputData.value.hourFrom === null ||
        !inputData.value.hourTo === null ||
        !inputData.value.minuteFrom === null ||
        !inputData.value.minuteTo === null ||
        !inputData.value.date ||
        !signature.value ||
        !truthfull.value
      ) {
        return false
      }

      // check if selected time is more than 0 hours and 0 minutes
      if (
        allowTimeSelection.value &&
        inputData.value.hourTo +
        inputData.value.minuteTo / 60 -
        (inputData.value.hourFrom + inputData.value.minuteFrom / 60) <=
        0
      ) {
        return false
      }

      // check that a report/reason was given
      if (inputData.value.report === null || inputData.value.report === '') {
        return false
      }

      // return true if values were provided
      return true
    })

    // redirect user to home view if he successfully created his report
    function goToHome() {
      router.push({ name: 'GuardianOverview' })
    }

    // Mounted hook to perform actions when the component is mounted
    onMounted(async () => {
      // set id fields
      inputData.value.schoolguardianID = store.getters.user.username
      // Set the name field for guardian
      inputData.value.schoolguardian =
        store.getters.user.attributes.name +
        ' ' +
        store.getters.user.attributes.family_name
    })


    // Return the setup object
    return {
      signatureField,
      inputValid,
      isLoading,
      reportSuccess,
      errorState,
      allowTimeSelection,
      specialTimeSelected,
      minimumDateRange,
      maximumDateRange,
      calendarShowRange,
      DateSelected,
      reportActivitySelected,
      reportFilled,
      signatureProvided,
      thruthfullButtonTapped,
      confirmButtonTapped,
      TimeSelected,
      goToHome
    }
  }
}
</script>