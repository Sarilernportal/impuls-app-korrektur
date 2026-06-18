<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, DUstin Noack
23.11.2022
Scope:
Guardian Timesheet List Item
-->

<template>
  <div class="bg-white border border-slate-200 rounded-xl ">
    <div class="flex">
      <!-- Button wraps the hole element due to the list entry should be tapped -->
      <button
        @click="entryTapped(report.key)"
        class="block w-full"
      >
        <div class="px-4 py-4 sm:px-6">
          <div class="flex items-center justify-between">
            <div class="ml-2 flex flex-wrap gap-2">
              <!-- special report flag -->
              <div
                v-if="report.reportType === 'special'"
                class="flex flex-wrap justify-center rounded-full gap-1 px-2 text-xs font-semibold leading-5 bg-impuls-blue text-gray-100"
              >
                <p>Sonderzeiten</p>
              </div>
              <!-- total worked hours of all reports combined -->
              <div
                class="flex flex-wrap justify-center rounded-full gap-1 px-2 text-xs font-semibold leading-5 bg-emerald-100 text-emerald-700"
              >
                <p>Gesamtzeit:</p>
                <p>{{ hoursWorked }}</p>
              </div>
              <!-- connected child -->
              <div
                v-if="report.reportType !== 'special'"
                class="flex flex-wrap justify-center rounded-full gap-1 px-2 text-xs font-semibold leading-5 bg-emerald-100 text-emerald-700"
              >
                <p>{{ childName }}</p>
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
            <!-- timeframe -->
            <div class="mt-2 flex items-center text-sm text-gray-700 sm:mt-0">
              <CalendarIcon
                class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-600"
                aria-hidden="true"
              />
              <p>
                Zeitraum:
                {{ startDate + ' - ' + endDate }}
              </p>
            </div>
          </div>
        </div>
      </button>
      <!-- open report button -->
      <div
        class="w-12 self-center text-gray-500"
        @click="open = !open"
      >
        <ChevronRightIcon :class="[open ? 'rotate-90' : 'rotate-0', 'transition-all']" />
      </div>
    </div>
    <!-- report documents -->
    <div
      v-if="open"
      class="flex flex-col gap-2 px-4 pb-4"
    >
      <TimeSheetListItemReportItem
        v-for="report in reports"
        :key="report.id"
        :report="report"
      />
    </div>
  </div>
</template>
  
<script>
// Vue imports
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

// component imports
import TimeSheetListItemReportItem from '@/components/Main/Guardian/Documents/TimeSheetListItemReportItem.vue'

// Icon imports
import { CalendarIcon, ChevronRightIcon } from '@heroicons/vue/20/solid'

export default {
  props: {
    report: {
      type: Object,
      required: true
    }
  },
  components: {
    CalendarIcon,
    ChevronRightIcon,
    TimeSheetListItemReportItem
  },
  setup(props) {
    // initialize refs
    const open = ref(false)

    // Store initialization
    const store = useStore()

    // Get the created at date from the data
    const createdAt = computed(() => {
      // Check if the created at object is in the data object
      if (props.report.createdAt) {
        // Get the raw date
        const rawDate = +new Date(props.report.createdAt)
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
      // Fallback
      return 'Keine Angabe'
    })

    const hoursWorked = computed(() => {
      try {
        // set up worked hours variable
        var workedHours = 0
        // create blacklist for reports where no time should be calculated
        const blacklist = [
          'holiday',
          'vacation',
          'employeeSickness',
          'other'
        ]
        // check if all time values are provided
        for (const document of props.report.dailyReport.items) {
          if (!(blacklist.includes(document.reportActivity))) {
            // calculate time in full hours and minutes
            const timeFrom = document.hourFrom + document.minuteFrom / 60
            const timeTo = document.hourTo + document.minuteTo / 60
            workedHours = workedHours + (timeTo - timeFrom)
          }
        }

        // create time string
        const workedHoursString = `${Math.floor(workedHours)}h ${(workedHours % 1) * 60 === 0
          ? 0
          : Math.floor(new Number((workedHours % 1) * 60).toPrecision(2))
          }m`
        return workedHoursString
      } catch (error) {
        console.log(error)
        // fallback
        return 'N/A'
      }

    })

    // get child name
    const childName = computed(() => {
      try {
        const childName = props.report.child.name
        const childFamilyName = props.report.child.familyName
        return childName && childFamilyName
          ? `${childName} ${childFamilyName}`
          : 'Nicht angegeben'
      } catch (error) {
        console.log(error)
        // fallback
        return 'Nicht angegeben'
      }
    })

    // get earliest date of used reports
    const startDate = computed(() => {
      var startDateList = []
      for (const document of props.report.dailyReport.items) {
        startDateList.push(new Date(document.documentDate))
      }
      return new Date(Math.min.apply(null, startDateList)).toLocaleDateString(
        'de-DE'
      )
    })

    // get latest date of used reports
    const endDate = computed(() => {
      var startDateList = []
      for (const document of props.report.dailyReport.items) {
        startDateList.push(new Date(document.documentDate))
      }
      return new Date(Math.max.apply(null, startDateList)).toLocaleDateString(
        'de-DE'
      )
    })

    // get reports from timesheet data string
    const reports = computed(() => {
      return [...props.report.dailyReport.items].sort((a, b) =>
        new Date(a.documentDate) < new Date(b.documentDate)
          ? 1
          : new Date(b.documentDate) < new Date(a.documentDate)
            ? -1
            : 0
      )
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
      open,
      createdAt,
      hoursWorked,
      childName,
      startDate,
      endDate,
      reports,
      entryTapped
    }
  }
}
</script>