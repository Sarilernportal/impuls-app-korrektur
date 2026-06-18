<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
23.11.2022
Scope:
Admin Timesheet List Item
-->

<template>
  <div class="relative bg-white border border-slate-200 rounded-xl overflow-clip">
    <!-- flagged reports indicator -->
    <div
      v-if="flaggedReportsNumber && flaggedReportsNumber > 0"
      class="absolute bg-red-500 h-20 w-20 -top-12 -left-12 rotate-45"
    ></div>
    <div class="flex">
      <!-- selection -->
      <div
        v-if="showSelectionInput && report.reportType === 'standard'"
        class="flex p-2 text-white gap-2 items-center"
      >
        <input
          @click="timeSheetSelected"
          :class="['w-5 h-5 text-blue-600 rounded focus:ring-blue-500 focus:ring-2',
            enableSelectionCheckbox ? 'bg-gray-300 border-gray-400' : 'bg-gray-100 border-gray-200'
          ]"
          type="checkbox"
          id="timeSheetSelected"
          value="timeSheetSelected"
          :enabled="enableSelectionCheckbox"
          :disabled="!enableSelectionCheckbox"
        />
      </div>
      <!-- Button wraps the hole element due to the list entry should be tapped -->
      <div class="block w-full">
        <div class="px-4 py-4 sm:px-6">
          <!-- document type -->
          <div class="flex mb-2 ml-2">
            <div
              v-if="showType"
              class="flex flex-wrap justify-center rounded-full gap-1 px-2 text-xs font-semibold leading-5 bg-blue-300"
            >
              Stundennachweis
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div class="ml-2 flex flex-wrap gap-2">
              <!-- show that a report is only internally relevant -->
              <div
                v-if="report.reportType === 'special'"
                title="Dokumentation für internes Ereignis"
                class="flex flex-wrap justify-center rounded-full gap-1 px-2 text-xs font-semibold leading-5 bg-impuls-blue text-gray-100"
              >
                <p>Sonderzeit</p>
              </div>
              <!-- total worked hours of all reports combined -->
              <div
                class="flex flex-wrap justify-center rounded-full gap-1 px-2 text-xs font-semibold leading-5 bg-indigo-400 text-gray-100"
              >
                <p>Gesamtzeit:</p>
                <p>{{ hoursWorked }}</p>
              </div>
              <!-- connected child -->
              <button
                v-if="report.reportType !== 'special'"
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
          <!-- revise date -->
          <div
            v-if="reviseDate"
            class="mt-2 sm:flex sm:justify-between"
          >
            <div class="mt-2 flex items-center text-sm text-gray-700 sm:mt-0">
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
      <!-- interaction buttons -->
      <div class="flex flex-col items-center">
        <!-- open file button -->
        <button
          class="w-12 h-1/2 self-center text-gray-500 hover:text-gray-600"
          @click="entryTapped()"
        >
          <DocumentIcon class="p-2" />
        </button>
        <!-- open report button -->
        <button
          class="relative w-12 h-1/2 self-center text-gray-500 hover:text-gray-600"
          @click="open = !open"
        >
          <ChevronRightIcon :class="[open ? 'rotate-90' : 'rotate-0', 'transition-all']" />
          <!-- count of flagged reports -->
          <div
            v-if="flaggedReportsNumber && flaggedReportsNumber > 0"
            class="absolute bg-red-500 right-1 top-1/4 md:top-0 rounded-full px-1 text-white text-xs"
          >
            {{ flaggedReportsNumber }}
          </div>
        </button>
      </div>
    </div>
    <!-- report documents -->
    <div
      v-if="open"
      class="flex flex-col gap-2 px-4 pb-4"
    >
      <ListItemReportItem
        v-for="report in sortedReports"
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
import { useRouter } from 'vue-router'

// component imports
import ListItemReportItem from '@/components/Main/Admin/Documents/ListItemReportItem.vue'

// Icon imports
import { CalendarIcon, ChevronRightIcon } from '@heroicons/vue/20/solid'
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
    },
    showType: {
      type: Boolean,
      required: false,
      default: false
    },
    showSelectionInput: {
      type: Boolean,
      required: false,
      default: false
    },
    selectedTimeSheets: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  components: {
    CalendarIcon,
    ChevronRightIcon,
    DocumentIcon,
    ListItemReportItem
  },
  emits: ['timeSheet-selected'],
  setup(props, { emit }) {
    // initialize refs
    const open = ref(false)

    // Store initialization
    const store = useStore()

    // initialize router
    const router = useRouter()

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

    // get guardian name
    const guardianName = computed(() => {
      const guardianName = props.report.guardian.name
      const guardianFamilyName = props.report.guardian.familyName
      return guardianName && guardianFamilyName
        ? `${guardianName} ${guardianFamilyName}`
        : 'Nicht angegeben'
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
      return props.report.dailyReport.items
    })

    // calculate number of flagged reports
    const flaggedReportsNumber = computed(() => {
      try {
        const documents = props.report.dailyReport.items
        var count = 0
        for (const document of documents) {
          if (document.flag === 'revise') {
            count += 1
          }
        }
        return count
      } catch (error) {
        return null
      }
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

    // get sorted list of linked documents
    const sortedReports = computed(() => {
      return [...props.report.dailyReport.items].sort((a, b) =>
        new Date(a.documentDate) < new Date(b.documentDate)
          ? 1
          : new Date(b.documentDate) < new Date(a.documentDate)
            ? -1
            : 0
      )
    })

    // compute status for enabling/disabling checkbox selection
    const enableSelectionCheckbox = computed(() => {
      try {
        // check if timeSheet is standard
        if (props.report.reportType === 'special') {
          return false
        }
        // check if all connected objects match the original timesheet connections
        for (const doc of props.selectedTimeSheets) {
          if (doc.carrier.id !== props.report.carrier.id || doc.child.id !== props.report.child.id) {
            return false
          }
        }
        // check if timeSheet only has dailyReports that were not used in an invoice yet
        for (const dailyReport of props.report.dailyReport.items) {
          if (dailyReport.invoicesDailyReportId !== null || dailyReport.flag === 'revise') {
            return false
          }
        }
        // check for connected dailyReports
        if (props.report.dailyReport.items.length <= 0) {
          return false
        }
        // return true if no earlier check failed
        return true
      } catch (error) {
        console.log(error)
        // fallback
        return false
      }
    })

    // Callback when the user selected the report --> checkbox
    function timeSheetSelected(val) {
      // emit item and selection value
      if (enableSelectionCheckbox.value) {
        emit('timeSheet-selected', { timeSheet: props.report, value: val.target.checked })
      }
    }

    // Callback when the user tabs the document element
    async function entryTapped() {
      try {
        router.push({
          name: 'TimeSheetDetails',
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
      open,
      createdAt,
      hoursWorked,
      childName,
      guardianName,
      startDate,
      endDate,
      reports,
      flaggedReportsNumber,
      reviseDate,
      sortedReports,
      enableSelectionCheckbox,
      timeSheetSelected,
      entryTapped,
      goToChild,
      goToGuardian
    }
  }
}
</script>