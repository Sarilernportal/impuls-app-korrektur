<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus
08.11.2022
Scope:
Report List Item
-->

<template>
  <!-- Button wraps the hole element due to the list entry should be tapped -->
  <div class="block w-full bg-white border border-slate-200 rounded-xl">
    <div class="px-4 py-4 sm:px-6">
      <div class="flex items-center justify-between">
        <div class="ml-2 flex flex-shrink-0 space-x-2">
          <!-- Placeholder -->
          <p class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"></p>
          <!-- Placeholder -->
          <p class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"></p>
        </div>
      </div>
      <div class="flex items-center justify-between">
        <div class="ml-2 flex flex-wrap gap-2">
          <!-- show that a report is only internally relevant -->
          <div
            v-if="displaySpecialTimesInfo"
            title="Dokumentation für internes Ereignis"
            class="flex flex-wrap justify-center rounded-full gap-1 px-2 text-xs font-semibold leading-5 bg-impuls-blue text-gray-100"
          >
            <p>Sonderzeit</p>
          </div>
          <!-- show that a report was created by a substitude -->
          <div
            v-if="displaySubstitute"
            title="Dokumentation wurde in Vertretung erstellt"
            class="flex flex-wrap justify-center rounded-full gap-1 px-2 text-xs font-semibold leading-5 bg-impuls-blue text-gray-100"
          >
            <p>Vertretung</p>
          </div>
          <!-- total worked hours of all reports combined -->
          <div
            v-if="displayActivityTimes"
            class="flex flex-wrap justify-center rounded-full gap-1 px-2 text-xs font-semibold leading-5 bg-indigo-400 text-gray-100"
          >
            <p>Gesamtzeit:</p>
            <p>{{ hoursWorked }}</p>
          </div>
          <!-- start and end time -->
          <div
            v-if="displayActivityTimes"
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
          <!-- connected child -->
          <button
            v-if="!displaySpecialTimesInfo"
            class="flex flex-wrap justify-center rounded-full gap-1 px-2 text-xs font-semibold leading-5 text-gray-700 hover:text-gray-800 border-2 border-indigo-400 hover:border-indigo-600"
            @click="goToChild"
          >
            <p>{{ 'Klient: ' + childName }}</p>
          </button>
          <!-- connected guardian -->
          <button
            class="flex flex-wrap justify-center rounded-full gap-1 px-2 text-xs font-semibold leading-5 text-gray-700 hover:text-gray-800 border-2 border-indigo-400 hover:border-indigo-600"
            @click="goToGuardian"
          >
            <p>{{ 'Betreuer: ' + guardianName }}</p>
          </button>
        </div>
        <!-- open file button -->
        <div class="w-12">
          <button
            class="w-12 h-1/2 self-center text-gray-500 hover:text-gray-600"
            @click="entryTapped()"
          >
            <DocumentIcon class="p-2" />
          </button>
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
            Erstellt für den
            {{ createdAt }}
          </p>
        </div>
        <!-- revise date -->
        <div
          v-if="reviseDate"
          class="mt-2 flex items-center text-sm text-gray-700 sm:mt-0"
        >
          <CalendarIcon
            class="mr-1.5 h-5 w-5 flex-shrink-0 text-green-600"
            aria-hidden="true"
          />
          <p>
            Aktualisiert am:
            {{ reviseDate }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
// Vue imports
import { computed } from 'vue'
import { useRouter } from 'vue-router'

// Icon imports
import { CalendarIcon } from '@heroicons/vue/20/solid'
import { DocumentIcon } from '@heroicons/vue/24/outline'

export default {
  props: {
    report: {
      type: Object,
      required: true
    },
    reportsIds: {
      type: Array,
    },
    currentIndex: {
      type: Number,
    }
  },
  components: {
    CalendarIcon,
    DocumentIcon
  },
  setup(props) {
    // Initialize router
    const router = useRouter()

    // get child name
    const childName = computed(() => {
      try {
        const childName = props.report.child.name
        const childFamilyName = props.report.child.familyName
        return `${childName} ${childFamilyName}`
      } catch (error) {
        return 'Nicht angegeben'
      }
    })

    // get guardian name
    const guardianName = computed(() => {
      try {
        const guardianName = props.report.guardian.name
        const guardianFamilyName = props.report.guardian.familyName
        return `${guardianName} ${guardianFamilyName}`
      } catch (error) {
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

    // get reviseDate
    const reviseDate = computed(() => {
      try {
        if (props.report.reviseDate) {
          // Get the raw date
          const rawDate = +new Date(props.report.reviseDate)
          // Get the offset from the browser time zone
          const offset = new Date(+rawDate).getTimezoneOffset() * 60 * 1000
          // Create a new date with the offset
          const timeStamp = new Date(+rawDate - offset).toISOString()
          // Get the day name to a locale string
          const dayName = new Date(timeStamp).toLocaleDateString('de-DE')

          // Convert the timestamp to a more readable date
          const convertedTimeStamp = timeStamp.split('T')[1].split('.')[0]
          // Create the date string
          const friendlyDate = `${dayName}, ${convertedTimeStamp}`
          return friendlyDate
        }
        return null
      } catch (error) {
        return null
      }
    })

    const displaySpecialTimesInfo = computed(() => {
      try {
        // create blacklist for report activities that result in time show status
        const blacklist = [
          'holiday',
          'vacation',
          'employeeSickness',
          'other',
          'supervision',
          'teamMeeting'
        ];
        // depending on blacklist return status
        return blacklist.includes(props.report.reportActivity)
      } catch (error) {
        console.log(error)
        // fallback
        return false
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

    // calculate sick status and if it was on time or too late
    const displaySick = computed(() => {
      try {
        if (props.report.sick) {
          return props.report.sickOnTime === true || props.report.sickOnTime === null ? 'Krankmeldung: Rechtzeitig' : 'Krankmeldung: Verspätet'
        }
        return null
      } catch (error) {
        console.log(error)
      }
    })

    // Callback when the user hits the entry button
    async function entryTapped() {
      try {
        router.push({
          name: 'ReportDetails',
          params: { id: props.report.id },
          query: {
            currentIndex: props.currentIndex,
            reportsIds: JSON.stringify(props.reportsIds)
          },
          // state: {
          //   reports: props.reports
          // }
        })
      } catch (error) {
        console.log(error)
      }
    }

    // redirect user to child detail page
    function goToChild() {
      try {
        router.push({
          name: 'ChildDetails',
          params: { id: props.report.child.id }
        })
      } catch (error) {
        console.log(error)
      }
    }

    // redirect user to guardian detail page
    function goToGuardian() {
      try {
        router.push({
          name: 'UserDetails',
          params: { id: props.report.guardian.id }
        })
      } catch (error) {
        console.log(error)
      }
    }

    // Return the setup object
    return {
      childName,
      createdAt,
      guardianName,
      hoursWorked,
      workedTimeSpan,
      reviseDate,
      displaySpecialTimesInfo,
      displayActivityTimes,
      displaySick,
      displaySubstitute,
      entryTapped,
      goToChild,
      goToGuardian
    }
  }
}
</script>