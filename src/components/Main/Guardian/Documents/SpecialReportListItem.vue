<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus
08.11.2022
Scope:
Guardian Report List Item
-->

<template>
  <!-- Button wraps the hole element due to the list entry should be tapped -->
  <div
    :class="['flex w-full rounded-xl', report.retrospectively ? 'bg-red-50 hover:bg-red-100' : 'bg-white border border-slate-200 hover:bg-gray-50']"
  >
    <div
      v-if="showSelectionInput"
      class="flex p-2 text-white gap-2 items-center"
    >
      <input
        @click="specialReportSelected"
        class="w-5 h-5 text-blue-600 bg-gray-300 border-gray-400 rounded focus:ring-blue-500 focus:ring-2"
        type="checkbox"
        id="specialReportSelected"
        value="specialReportSelected"
      />
    </div>
    <button
      @click="entryTapped(report.key)"
      class="w-full px-4 py-4 sm:px-6"
    >
      <div class="flex items-center justify-between">
        <div class="flex flex-wrap gap-2">
          <!-- activity name -->
          <div class="flex flex-wrap justify-center rounded-full gap-1 px-2 text-xs font-semibold leading-5 bg-emerald-100 text-emerald-700">
            <p>{{ activityName }}</p>
          </div>
          <!-- total hours -->
          <div
            v-if="displayActivityTimes"
            class="flex flex-wrap justify-center rounded-full gap-1 px-2 text-xs font-semibold leading-5 bg-emerald-100 text-emerald-700"
          >
            <p>Gesamtzeit:</p>
            <p>{{ hoursWorked }}</p>
          </div>
        </div>
      </div>
      <div class="mt-2 sm:flex sm:justify-between">
        <!-- Created at date -->
        <div class="mt-2 flex items-center text-sm text-gray-700 sm:mt-0">
          <CalendarIcon
            class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-600"
            aria-hidden="true"
          />
          <p>
            Erstellt am
            {{ createdAt }}
          </p>
        </div>
        <!-- Created for Time -->
        <div
          v-if="displayActivityTimes"
          class="mt-2 flex items-center text-sm text-gray-700 sm:mt-0"
        >
          <ClockIcon
            class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-600"
            aria-hidden="true"
          />
          <p>
            Zeitraum:
            {{ createdTime }}
          </p>
        </div>
      </div>
    </button>
    <div class="flex flex-col pr-2 self-center">
      <button
        @click="deleteClicked"
        type="button"
        :class="['inline-flex h-10 w-10 items-center justify-center rounded-full', report.retrospectively ? 'text-red-600 hover:text-red-700' : 'text-red-400 hover:text-red-500']"
      >
        <XMarkIcon
          class="h-8 w-8"
          aria-hidden="true"
        />
      </button>
      <button
        @click="editClicked"
        type="button"
        :class="['inline-flex h-10 w-10 items-center justify-center rounded-full', report.retrospectively ? 'text-gray-600 hover:text-gray-700' : 'text-gray-400 hover:text-gray-500']"
      >
        <Cog6ToothIcon
          class="h-8 w-8"
          aria-hidden="true"
        />
      </button>
    </div>
  </div>
</template>
  
<script>
// Vue imports
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

// Icon imports
import {
  CalendarIcon,
  UserIcon,
  MapPinIcon,
  XMarkIcon
} from '@heroicons/vue/20/solid'
import { ClockIcon, Cog6ToothIcon } from '@heroicons/vue/24/outline'

export default {
  props: {
    report: {
      type: Object,
      required: true
    },
    showSelectionInput: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  components: {
    CalendarIcon,
    ClockIcon,
    UserIcon,
    MapPinIcon,
    Cog6ToothIcon,
    XMarkIcon
  },
  emits: ['delete-report', 'special-report-selected'],
  setup(props, { emit }) {
    // Store initialization
    const store = useStore()

    // router initialization
    const router = useRouter()

    // initialize route
    const route = useRoute()

    // Get the created at date from the data
    const createdAt = computed(() => {
      // Check if the created at object is in the data object
      if (props.report.documentDate) {
        // Get the day name to a locale string
        const dayName = new Date(props.report.documentDate).toLocaleDateString(
          'de-DE'
        )
        return dayName
      }
      // Fallback
      return 'Keine Angabe'
    })

    // Get the created time from start to end
    const createdTime = computed(() => {
      try {
        // calculate time in full hours and minutes
        const hourFrom = props.report.hourFrom
        const minuteFrom = props.report.minuteFrom
        const hourTo = props.report.hourTo
        const minuteTo = props.report.minuteTo

        // Create the date string
        const friendlyDate = `${hourFrom}:${minuteFrom < 10 ? '0' + minuteFrom : minuteFrom
          } - ${hourTo}:${minuteTo < 10 ? '0' + minuteTo : minuteTo}`
        return friendlyDate
      } catch (error) {
        console.log(error)
        // Fallback
        return 'Nicht angegeben'
      }
    })

    const hoursWorked = computed(() => {
      // calculate time in full hours and minutes
      const timeFrom = props.report.hourFrom + props.report.minuteFrom / 60
      const timeTo = props.report.hourTo + props.report.minuteTo / 60
      const workedHours = timeTo - timeFrom
      const workedMinutes =
        (workedHours % 1) * 60 === 0
          ? 0
          : Math.floor(new Number((workedHours % 1) * 60).toPrecision(2))

      // create time string
      const workedHoursString = `${Math.floor(workedHours)}h ${workedMinutes}m`
      return workedHoursString
    })

    const activityName = computed(() => {
      try {
        // create dictionary for value translation
        const reportActivitytermsRev = {
          school: 'Schule',
          helpPlanDiscussion: 'Hilfeplangespräch',
          getToKnowInterview: 'Kennenlerngespräch',
          hospitation: 'Hospitation',
          excursion: 'Ausflug / Klassenfahrt',
          holiday: 'Feiertag',
          vacation: 'Urlaub',
          employeeSickness: 'Krankmeldung',
          other: 'Sonstiges',
          supervision: 'Supervision',
          teamMeeting: 'Teamsitzung'
        }

        return reportActivitytermsRev[props.report.reportActivity]
      } catch (error) {
        console.log(error)
        // fallback
        return 'N/A'
      }
    })

    const displayActivityTimes = computed(() => {
      try {
        // create blacklist for report activities that result in time show status
        const blacklist = [
          'holiday',
          'vacation',
          'employeeSickness',
          'other'
        ];
        // depending on blacklist return status
        return !blacklist.includes(props.report.reportActivity)
      } catch (error) {
        console.log(error)
        // fallback
        return false
      }
    })

    // Callback when the user tabs the document element
    async function entryTapped(key) {
      // Fetch the pdf from the storage on the backend
      try {
        if (!props.report.retrospectively) {
          // get document from API
          const resp = await store.dispatch('downloadDocument', {
            key: key,
            user: store.getters.user.username
          })

          // create invisible href
          var link = document.createElement('a')
          // set attributes to href --> link  + file name
          link.href = resp
          link.download = key
          // let JS click the download
          link.click()
        }
      } catch (err) {
        console.log('Error', err)
      }
    }

    function deleteClicked() {
      emit('delete-report', props.report)
    }

    function editClicked() {
      // create params object for push
      var pushParams = {
        name: 'EditSpecialReportView',
        params: { id: props.report.id },
        query: { from: route.name }
      }

      // if current route is GuardianFlaggedDetails --> set flagId query for returning later to that view
      if (route.name === 'GuardianFlaggedDetails') {
        pushParams.query.flagId = route.params.id
      }
      router.push(pushParams)
    }

    // Callback when the user selected the report --> checkbox
    function specialReportSelected(val) {
      // emit item and selection value
      emit('special-report-selected', { report: props.report, value: val.target.checked })
    }

    // Return the setup object
    return {
      createdAt,
      createdTime,
      hoursWorked,
      activityName,
      displayActivityTimes,
      entryTapped,
      editClicked,
      deleteClicked,
      specialReportSelected
    }
  }
}
</script>