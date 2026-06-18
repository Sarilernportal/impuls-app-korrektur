<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
23.11.2022
Scope:
Guardian Report List Item
-->

<template>
  <!-- Button wraps the hole element due to the list entry should be tapped -->
  <button
    @click="entryTapped(report.key)"
    class="block w-full bg-gray-100 rounded-xl hover:bg-gray-50"
  >
    <div class="px-4 py-4 sm:px-6">
      <div class="flex items-center justify-between">
        <div class="ml-2 flex flex-wrap gap-2">
          <!-- Total worked hours  -->
          <div class="flex flex-wrap justify-center rounded-full gap-1 px-2 text-xs font-semibold leading-5 bg-emerald-100 text-emerald-700">
            <p>Gesamtzeit:</p>
            <p>{{ hoursWorked }}</p>
          </div>
          <!-- sick indicator -->
          <div
            v-if="displaySick"
            class="flex flex-wrap justify-center rounded-full gap-1 px-2 text-xs font-semibold leading-5 bg-indigo-500 text-indigo-100"
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
</template>
    
<script>
// Vue imports
import { computed } from 'vue'
import { useStore } from 'vuex'

// Icon imports
import { CalendarIcon, UserIcon, MapPinIcon } from '@heroicons/vue/20/solid'

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
    MapPinIcon
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

    // Callback when the user tabs the document element
    async function entryTapped(key) {
      // Fetch the pdf from the storage on the backend
      try {
        // get document from API
        const resp = await store.dispatch('downloadDocument', {
          key: key
        })
        // create invisible href
        var link = document.createElement('a')
        // set attributes to href --> link  + file name
        link.href = resp
        link.download = key
        // let JS click the download
        link.click()
      } catch (err) {
        console.log('Error', err)
      }
    }

    // Return the setup object
    return {
      createdAt,
      hoursWorked,
      displaySick,
      entryTapped
    }
  }
}
</script>