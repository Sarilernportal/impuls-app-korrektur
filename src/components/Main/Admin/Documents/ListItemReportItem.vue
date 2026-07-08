<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
23.11.2022
Scope:
Admin Report List Item
-->

<template>
  <div class="block w-full bg-gray-100 rounded-xl hover:bg-gray-50">
    <!-- Button wraps the hole element due to the list entry should be tapped -->
    <button @click="entryTapped(report.key, report.owner)">
      <div class="px-4 py-4 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="ml-2 flex flex-wrap gap-2">
            <!-- show that a report was created by a substitude -->
            <div
              v-if="displaySubstitute"
              title="Dokumentation wurde in Vertretung erstellt"
              class="flex flex-wrap justify-center rounded-full gap-1 px-2 text-xs font-semibold leading-5 bg-impuls-blue text-gray-100"
            >
              <p>Vertretung</p>
            </div>
            <!-- special report type -->
            <div
              v-if="report.reportType === 'special'"
              title="Dokumentation für internes Ereignis"
              class="flex flex-wrap justify-center rounded-full gap-1 px-2 text-xs font-semibold leading-5 bg-impuls-blue text-gray-100"
            >
              <p>{{ activityName }}</p>
            </div>
            <!-- Total worked hours   -->
            <div
              class="flex flex-wrap justify-center rounded-full gap-1 px-2 text-xs font-semibold leading-5 bg-indigo-400 text-gray-100"
            >
              <p>Gesamtzeit:</p>
              <p>{{ hoursWorked }}</p>
            </div>
            <!-- start and end time -->
            <div
              v-if="report.reportType !== 'special'"
              class="flex flex-wrap justify-center rounded-full gap-1 px-2 text-xs font-semibold leading-5 bg-indigo-400 text-gray-100"
            >
              <p>Arbeitszeit:</p>
              <p>{{ workedTimeSpan }}</p>
            </div>
            <!-- display sickness and sickOnTime text -->
            <div
              v-if="displaySick"
              class="flex flex-wrap justify-center rounded-full gap-1 px-2 text-xs font-semibold leading-5 bg-indigo-400 text-gray-100"
            >
              <p>{{ displaySick }}</p>
            </div>
          </div>
        </div>
        <div class="mt-2 sm:flex sm:justify-between">
          <!-- Created at data -->
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
        </div>
      </div>
    </button>
    <!-- flag section -->
    <div class="w-full px-4 pb-2">
      <ReportFlagSection :report="report" />
    </div>
  </div>
</template>
    
<script>
// Vue imports
import { computed } from 'vue'
import { useStore } from 'vuex'

// Icon imports
import { CalendarIcon, UserIcon, MapPinIcon } from '@heroicons/vue/20/solid'

// component imports
import ReportFlagSection from '@/components/Main/Admin/Documents/ReportFlagSection.vue'

export default {
  props: {
    report: {
      type: Object,
      required: true
    }
  },
  components: {
    CalendarIcon,
    UserIcon,
    MapPinIcon,
    ReportFlagSection
  },
  setup(props) {
    // Store initialization
    const store = useStore()

    // Get the created at date from the data
    const createdAt = computed(() => {
      // Check if the created at object is in the data object
      if (props.report.documentDate) {
        // Get the day name to a locale string
        const dayName = new Date(props.report.documentDate).toLocaleDateString(
          'de-DE'
        )
        // Convert the timestamp to a more readable date
        const convertedTimeStamp = props.report.documentDate
          .split('T')[1]
          .split('.')[0]
        // Create the date string
        const friendlyDate = `${dayName}, ${convertedTimeStamp}`
        return friendlyDate
      }
      // Fallback
      return 'Keine Angabe'
    })

    const hoursWorked = computed(() => {
      // create blacklist for reports where no time should be calculated
      const blacklist = [
        'holiday',
        'vacation',
        'employeeSickness',
        'other'
      ]
      if (blacklist.includes(props.report.reportActivity)) {
        return '0h 0m'
      }
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

    // create timespan string for entered hours
    const workedTimeSpan = computed(() => {
      try {
        // get start time
        const timeFrom = `${props.report.hourFrom}:${props.report.minuteFrom < 10 ? '0' + props.report.minuteFrom : props.report.minuteFrom}`
        // get end time
        const timeTo = `${props.report.hourTo}:${props.report.minuteTo < 10 ? '0' + props.report.minuteTo : props.report.minuteTo}`
        // combine to readable string
        return `${timeFrom} - ${timeTo}`
      } catch (error) {
        console.log(error)
        return 'N/A'
      }
    })

    const activityName = computed(() => {
      try {
        // create dictionary for value translation
        const reportActivitytermsRev = {
          school: 'Schule',
          helpPlanDiscussion: 'Hilfeplangespräch',
          getToKnowInterview: 'Kennenlerngespräch',
          hospitation: 'Hospitation',
          excursion: 'Ausflug',
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

    // calculate sick status and if it was on time or too late
    const displaySick = computed(() => {
      try {
        if (props.report.sick) {
          return props.report.sickOnTime === true || props.report.sickOnTime === null ? 'Krankmeldung: Rechtzeitig' : 'Krankmeldung: Verspätet'
        }
        return null
      } catch (error) {
        console.log(error)
        return null
      }
    })

    // display the info that the report was created by a subsitute
    const displaySubstitute = computed(() => {
      try {
        return props.report.substitute
      } catch (error) {
        console.log(error)
        // fallback
        return false
      }
    })

    // Callback when the user tabs the document element
    async function entryTapped(key, owner) {
      // Fetch the pdf from the storage on the backend
      try {
        // get document from API
        const resp = await store.dispatch('downloadSingleDocument', {
          key: key,
          userPath: owner
        })
        // open document in new tab
        window.open(resp, '_blank')
      } catch (err) {
        console.log('Error', err)
      }
    }

    // Return the setup object
    return {
      createdAt,
      hoursWorked,
      workedTimeSpan,
      activityName,
      displaySick,
      displaySubstitute,
      entryTapped
    }
  }
}
</script>