<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
17.03.2023
Scope:
Report List Item Flag Update
-->

<template>
  <!-- flag section -->
  <div class="flex gap-2 mt-2 items-center">
    <!-- loading status -->
    <LoadingSpinnerIndigo
      v-if="reportFlagIsLoading"
      size="h-6 w-6"
    />
    <!-- success status -->
    <div
      title="Markierung erfolgreich"
      v-if="reportFlagSuccessStatus === 'success' && !reportFlagIsLoading"
      class="rounded-full bg-green-300 p-1"
    >
      <CheckIcon class="h-5 w-5 text-green-600" />
    </div>
    <!-- error status -->
    <div
      title="Markierung konnte nicht abgeschlossen werden"
      v-if="reportFlagSuccessStatus === 'error' && !reportFlagIsLoading"
      class="rounded-full bg-red-300 p-1"
    >
      <XMarkIcon class="h-5 w-5 text-red-600" />
    </div>
    <!-- text input -->
    <TextLargeTextfield
      class="w-full"
      elementID="reportFlagText"
      name="reportFlagText"
      placeholder="Begründung der Markierung"
      enterButtonEvent="none"
      :prefilled="reportFlagText"
      @input-value="setReportFlagText"
      @is-valid="setReportFlagTextValidation"
    />
    <!-- button section -->
    <div class="flex gap-2">
      <!-- save button -->
      <button
        @click="flagDailyReport"
        title="Markierung speichern"
      >
        <ExclamationTriangleIcon :class="[
          reportFlagTextSaved === 'none'
            ? 'text-gray-600 hover:text-gray-400'
            : reportFlagTextSaved === 'unsaved'
              ? 'text-red-600 hover:text-red-400'
              : reportFlagTextSaved === 'saved'
                ? 'text-green-600 hover:text-green-400'
                : 'text-gray-600 hover:text-gray-400',
          !reportFlagTextValidation ||
            reportFlagTextSaved === 'saved' ||
            reportFlagTextSaved === 'none'
            ? 'cursor-not-allowed'
            : '',
          'h-6 w-6'
        ]" />
      </button>
      <!-- allow day selection button -->
      <button
        @click="setReportFlagDaySelectionAllowed"
        title="Tagesauswahl freischalten"
      >
        <CalendarDaysIcon :class="[
          reportFlagDaySelectionAllowed
            ? 'text-green-600 hover:text-green-400'
            : 'text-gray-600 hover:text-gray-400',
          'h-6 w-6'
        ]" />
      </button>
    </div>
  </div>
</template>

<script>
// vue imports
import { onBeforeMount, ref } from 'vue'
import { useStore } from 'vuex'

// component imports
import TextLargeTextfield from '@/components/UIComponents/Inputs/TextLargeTextfield.vue'
import LoadingSpinnerIndigo from '@/components/UIComponents/Utilities/LoadingSpinnerIndigo.vue'

// Icon imports
import { XMarkIcon, CheckIcon } from '@heroicons/vue/20/solid'
import {
  ExclamationTriangleIcon,
  CalendarDaysIcon
} from '@heroicons/vue/24/outline'

export default {
  props: {
    report: {
      type: Object,
      required: true
    }
  },
  components: {
    TextLargeTextfield,
    ExclamationTriangleIcon,
    XMarkIcon,
    CheckIcon,
    CalendarDaysIcon,
    LoadingSpinnerIndigo
  },
  setup(props) {
    // initialize refs
    const reportFlagText = ref(null)
    const reportFlagTextSaved = ref('none')
    const reportFlagTextValidation = ref(false)
    const reportFlagDaySelectionAllowed = ref(false)
    const reportFlagIsLoading = ref(false)
    const reportFlagSuccessStatus = ref('none')

    // Store initialization
    const store = useStore()

    // setter function for report flag text
    function setReportFlagText(val) {
      reportFlagText.value = val
      reportFlagTextSaved.value = 'unsaved'
    }

    // setter function for report flag text validation
    function setReportFlagTextValidation(val) {
      reportFlagTextValidation.value = val
    }

    // setter function for allowing free day selection
    function setReportFlagDaySelectionAllowed() {
      reportFlagDaySelectionAllowed.value = !reportFlagDaySelectionAllowed.value
      reportFlagTextSaved.value = 'unsaved'
      // check for text validation, required for prefill
      if (reportFlagText.value && reportFlagText.value !== null) {
        reportFlagTextValidation.value = true
      }
    }

    // update dailyreport via AppSync
    async function flagDailyReport() {
      try {
        // set loading status
        reportFlagIsLoading.value = true

        // check if changes were made and text is validated
        if (
          reportFlagTextValidation.value &&
          reportFlagTextSaved.value === 'unsaved'
        ) {
          // create update object
          const updateObject = {
            id: props.report.id,
            flagText: reportFlagText.value,
            flagDaySelection: reportFlagDaySelectionAllowed.value,
            timeSheetId: props.report.timeSheetsDailyReportId
          }

          // call API via store
          const reportUpdateResponse = await store.dispatch(
            'flagDailyReport',
            updateObject
          )
          // set saved status to saved if successfull
          reportFlagTextSaved.value = 'saved'
          // set success state to success
          reportFlagSuccessStatus.value = 'success'
        }
      } catch (error) {
        console.log(error)
        // set saved status to unsaved in case of error
        reportFlagTextSaved.value = 'unsaved'
        // set success state to error
        reportFlagSuccessStatus.value = 'error'
      } finally {
        reportFlagIsLoading.value = false
      }
    }

    // prefill values if report was flagged before
    function prefillValues() {
      // check if flag text is already provided
      if (props.report.flagText) {
        reportFlagText.value = props.report.flagText
      }
      // check if flag daily selection is already provided
      if (props.report.flagDaySelection) {
        reportFlagDaySelectionAllowed.value = true
      }
    }

    onBeforeMount(() => {
      prefillValues()
    })

    return {
      reportFlagText,
      reportFlagTextSaved,
      reportFlagTextValidation,
      reportFlagDaySelectionAllowed,
      reportFlagIsLoading,
      reportFlagSuccessStatus,
      setReportFlagText,
      setReportFlagTextValidation,
      setReportFlagDaySelectionAllowed,
      flagDailyReport
    }
  }
}
</script>