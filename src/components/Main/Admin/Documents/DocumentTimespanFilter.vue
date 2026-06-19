<template>
  <Popover
    class="relative w-full"
    v-slot="{ open }"
  >
    <PopoverButton
      :class="[
        open ? 'border-impuls-blue/50 ring-2 ring-brand-100' : 'border-slate-300',
        'group flex w-full items-center gap-2.5 rounded-xl border bg-white px-3.5 py-2.5 text-left transition hover:border-impuls-blue/50 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-100'
      ]"
    >
      <CalendarDaysIcon class="h-5 w-5 flex-shrink-0 text-slate-400" aria-hidden="true" />
      <span class="min-w-0 flex-1">
        <span class="block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Zeitraum</span>
        <span class="block truncate text-sm font-semibold text-slate-400">Alle Zeiträume</span>
      </span>
      <ChevronUpDownIcon class="h-5 w-5 flex-shrink-0 text-slate-400 group-hover:text-slate-500" aria-hidden="true" />
    </PopoverButton>
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <PopoverPanel
        v-slot="{ close }"
        :visible="false"
        class="absolute left-1/2 bg-white shadow-lg rounded-lg z-10 mt-3 w-screen max-w-md -translate-x-1/2 transform px-2 sm:px-0 lg:max-w-3xl"
      >
        <div class="overflow-hidden">
          <div class="relative p-4">
            <!-- title -->
            <div>
              <h1 class="text-left text-gray-600 text-xl font-bold">
                Auswahl des Zeitraums
              </h1>
            </div>
            <!-- start date-->
            <div class="flex w-full flex-col sm:flex-row gap-2 mt-4">
              <SimpleDropdown
                class="w-full"
                title="Beginn Monat"
                :properties="months"
                defaultSelected="Januar"
                @selection="setStartMonth"
              />
              <SidewaySelection
                class="w-full"
                title="Beginn Jahr"
                :properties="years"
                defaultSelected="1"
                @selection="setStartYear"
              />
            </div>
            <!-- end date -->
            <div class="flex w-full flex-col sm:flex-row gap-2 mt-4">
              <SimpleDropdown
                class="w-full"
                title="Ende Monat"
                :properties="months"
                defaultSelected="Januar"
                @selection="setEndMonth"
              />
              <SidewaySelection
                class="w-full"
                title="End Jahr"
                :properties="years"
                defaultSelected="1"
                @selection="setEndYear"
              />
            </div>
          </div>
        </div>
        <div class="flex justify-center p-4">
          <standard-button
            class="w-full sm:w-1/2"
            @click="() => {
                applyFilter()
                close()
              }
              "
            title="Anwenden"
            :enabled="true"
          />
        </div>
      </PopoverPanel>
    </transition>
  </Popover>
</template>

<script>
// vue imports
import { computed, onMounted, ref } from 'vue'

// component imports
import SimpleDropdown from '@/components/UIComponents/Dropdowns/SimpleDropdown.vue'
import SidewaySelection from '@/components/UIComponents/Selections/SidewaySelection.vue'
import StandardButton from '@/components/UIComponents/Buttons/StandardButton.vue'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'
import { CalendarDaysIcon, ChevronUpDownIcon } from '@heroicons/vue/24/outline'
import {
  ArrowPathIcon,
  ChartBarIcon,
  CursorArrowRaysIcon,
  DocumentChartBarIcon,
  ShieldCheckIcon,
  Squares2X2Icon
} from '@heroicons/vue/24/outline'

export default {
  components: {
    SimpleDropdown,
    SidewaySelection,
    StandardButton,
    Popover,
    PopoverButton,
    PopoverPanel,
    ChevronDownIcon,
    CalendarDaysIcon,
    ChevronUpDownIcon,
    ArrowPathIcon,
    ChartBarIcon,
    CursorArrowRaysIcon,
    DocumentChartBarIcon,
    ShieldCheckIcon,
    Squares2X2Icon
  },
  emits: ['time-filter'],
  setup(_, { emit }) {
    // initialize refs
    const months = ref([
      'Januar',
      'Februar',
      'März',
      'April',
      'Mai',
      'Juni',
      'Juli',
      'August',
      'September',
      'Oktober',
      'November',
      'Dezember'
    ])
    const startMonth = ref('Januar')
    const startYear = ref(null)
    const endMonth = ref('Januar')
    const endYear = ref(null)

    // date setter functions
    function setStartMonth(val) {
      startMonth.value = val
    }

    function setStartYear(val) {
      startYear.value = val
    }

    function setEndMonth(val) {
      endMonth.value = val
    }

    function setEndYear(val) {
      endYear.value = val
    }

    // compute full start year value
    function getStartYearString() {
      // get index of month in array
      const monthIndex = months.value.indexOf(startMonth.value)
      // create iso year string
      const yearString = new Date(startYear.value, monthIndex, 1).toISOString()
      // emit iso string
      return yearString
    }

    // compute full end year value
    function getEndYearString() {
      // get index of month in array
      const monthIndex = months.value.indexOf(endMonth.value)
      // get final day of month
      const maxDay = new Date(endYear.value, monthIndex + 1, 0).getDate()
      // create iso date string
      const yearString = new Date(
        startYear.value,
        monthIndex,
        maxDay,
        23,
        59,
        39
      ).toISOString()
      // emit iso string
      return yearString
    }

    function applyFilter() {
      // get filter values
      const start = getStartYearString()
      const end = getEndYearString()

      // emit filter values
      emit('time-filter', {
        start: start,
        end: end
      })
    }

    // compute available years
    const years = computed(() => {
      // get current year + 1
      const max = new Date().getFullYear() + 1
      // start year 2022, as the app launched in that year
      const min = 2022
      // create array of available years
      var yearList = []
      for (var i = min; i <= max; i++) {
        yearList.push(i)
      }
      return yearList
    })

    return {
      months,
      years,
      setStartMonth,
      setStartYear,
      setEndMonth,
      setEndYear,
      applyFilter
    }
  }
}
</script>
