<!--
Project:
Impuls Child care
Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
16.11.2022
Scope:
Calendar
-->

<template>
  <div class="w-full flex flex-col items-center gap-2">
    <!-- day picking -->
    <DatePicker
      v-if="showDaySelection"
      :is-dark="false"
      :modelValue="date"
      v-model="date"
      :model-config="modelConfig"
      mode="date"
      timezone="Europe/Amsterdam"
    />
    <!-- time picking -->
    <DatePicker
      v-if="showTimeSelection"
      :is-dark="false"
      v-model="range"
      :model-config="range"
      mode="time"
      timezone="Europe/Amsterdam"
      :minute-increment="15"
      is24hr
      is-range
    />
  </div>
</template>

<script>
// vue imports
import { ref, watch } from 'vue'
// calender import
import { DatePicker } from 'v-calendar'
import '@/utilities/others/style.css'

export default {
  components: {
    DatePicker
  },
  props: {
    defaultValues: {
      type: Object,
      requied: false,
      default: null
    },
    showDaySelection: {
      type: Boolean,
      required: false,
      default: true
    },
    showTimeSelection: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  emits: ['date-selected', 'time-selected'],
  setup(props, { emit }) {
    // initialize refs
    const date = ref(null)
    const modelConfig = ref({
      timeAdjust: '12:00:00',
      type: 'string'
    })
    const range = ref({})
    const dateValidationStatus = ref(false)

    async function setRange() {
      if (date.value !== '') {
        // get new range values when user clicks on a day, required for time picking, set default end to 15 minutes higher
        range.value = {
          start: date.value,
          end: new Date(new Date(date.value).setMinutes(15)).toISOString()
        }
        emit('date-selected', date.value)
      }
    }

    function calcTimeIntoDate() {
      // get timezone offset
      const tzoffset = new Date().getTimezoneOffset() * 60000
      // set hours for date, including timezone offset
      var shiftedDate = new Date(new Date(date.value) - tzoffset).setHours(
        new Date(range.value.start).getHours()
      )
      // set minutes for date, including timezone offset
      shiftedDate = new Date(new Date(shiftedDate) - tzoffset).setMinutes(
        new Date(range.value.start).getMinutes()
      )
      // get date as iso string
      shiftedDate = new Date(shiftedDate).toISOString()
      // emit date date
      emit('date-selected', shiftedDate)
    }

    function getTimeValues() {
      // get hour and minute values for start and end from user selection
      const timeSelection = {
        hourFrom: new Date(range.value.start).getHours(),
        hourTo: new Date(range.value.end).getHours(),
        minuteFrom: new Date(range.value.start).getMinutes(),
        minuteTo: new Date(range.value.end).getMinutes()
      }
      // emit time value
      emit('time-selected', timeSelection)
      // adjust time for selected day
      calcTimeIntoDate()
    }

    // watch for updates of user date input
    watch(
      () => [date.value],
      () => {
        // get new day from user input
        setRange()
      },
      { deep: true }
    )

    watch(
      () => [range.value],
      () => {
        // get new time values from user inpute
        getTimeValues()
      },
      { deep: true }
    )

    return {
      date,
      range,
      modelConfig,
      dateValidationStatus
    }
  }
}
</script>