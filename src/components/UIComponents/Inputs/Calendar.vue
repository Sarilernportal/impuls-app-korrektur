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
      :min-date="minimumDate"
      :max-date="maximumDate"
      v-model="date"
      :model-config="modelConfig"
      mode="range"
      timezone="Europe/Amsterdam"
      :is-range="calendarShowRange"
    />
    <!-- time picking -->
    <DatePicker
      v-if="showTimeSelection"
      :is-dark="false"
      v-model="range"
      :model-config="range"
      mode="time"
      timezone="Europe/Amsterdam"
      :minute-increment="5"
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
    },
    minimumDateRange: {
      type: Number,
      required: false,
      default: 3
    },
    maximumDateRange: {
      type: Number,
      required: false,
      default: 0
    },
    calendarShowRange: {
      type: Boolean,
      required: false,
      default: false
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
    // calculate minium date --> 3 days before today
    const minimumDate = ref(new Date().setDate(new Date().getDate() - props.minimumDateRange))
    const maximumDate = ref(new Date().setDate(new Date().getDate() + props.maximumDateRange))

    async function setRange() {
      if (props.calendarShowRange) {
        if (date.value.start !== '') {
          // get new range values when user clicks on a day, required for time picking, set default end to 15 minutes higher
          range.value = {
            start: date.value.start,
            end: new Date(new Date(date.value.start).setMinutes(15)).toISOString()
          }
          emit('date-selected', date.value)
        }
      } else {
        if (date.value !== '') {
          // get new range values when user clicks on a day, required for time picking, set default end to 15 minutes higher
          range.value = {
            start: date.value,
            end: new Date(new Date(date.value).setMinutes(15)).toISOString()
          }
          emit('date-selected', date.value)
        }
      }
    }

    function calcTimeIntoDate() {
      // get timezone offset
      const tzoffset = new Date().getTimezoneOffset() * 60000
      // set hours for date, including timezone offset
      var shiftedDate = new Date(new Date(props.calendarShowRange ? date.value.start : date.value) - tzoffset).setHours(
        new Date(range.value.start).getHours()
      )
      // set hours for endDate
      var shiftedEndDate = new Date(new Date(props.calendarShowRange ? date.value.end : date.value) - tzoffset).setHours(
        new Date(range.value.end).getHours()
      )
      // set minutes for date, including timezone offset
      shiftedDate = new Date(new Date(shiftedDate) - tzoffset).setMinutes(
        new Date(range.value.start).getMinutes()
      )
      shiftedEndDate = new Date(new Date(shiftedEndDate) - tzoffset).setMinutes(
        new Date(range.value.end).getMinutes()
      )
      // get date as iso string
      shiftedDate = new Date(shiftedDate).toISOString()
      shiftedEndDate = new Date(shiftedEndDate).toISOString()
      // emit date date
      emit('date-selected', props.calendarShowRange ? { start: shiftedDate, end: shiftedEndDate } : shiftedDate)
    }

    function getTimeValues() {
      // get hour and minute values for start and end from user selection
      if ('start' in range.value && 'end' in range.value) {
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
    }

    async function calcDefaultValues() {
      // set date
      if (props.calendarShowRange) {
        date.value = { start: props.defaultValues.date, end: props.defaultValues.endDate }
      } else {
        date.value = props.defaultValues.date
      }
      await setRange()

      // set time
      range.value = {
        start: new Date(
          new Date(props.calendarShowRange ? date.value.start : date.value).setHours(
            props.defaultValues.hourFrom,
            props.defaultValues.minuteFrom
          )
        ).toISOString(),
        end: new Date(
          new Date(props.calendarShowRange ? date.value.start : date.value).setHours(
            props.defaultValues.hourTo,
            props.defaultValues.minuteTo
          )
        ).toISOString()
      }

      // set max/min date
      minimumDate.value = props.minimumDateRange > 6 ? new Date(props.calendarShowRange ? date.value.start : date.value).setDate(
        new Date(props.calendarShowRange ? date.value.start : date.value).getDate() - props.minimumDateRange
      ) : new Date(props.calendarShowRange ? date.value.start : date.value).setDate(
        new Date(props.calendarShowRange ? date.value.start : date.value).getDate() - 7
      )
      maximumDate.value = props.maximumDateRange > 6 ? new Date(props.calendarShowRange ? date.value.start : date.value).setDate(
        new Date(props.calendarShowRange ? date.value.start : date.value).getDate() + props.maximumDateRange
      ) : new Date(props.calendarShowRange ? date.value.start : date.value).setDate(
        new Date(props.calendarShowRange ? date.value.start : date.value).getDate() + 7
      )
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

    // watch for updates of user input
    watch(
      () => [props.defaultValues],
      () => {
        calcDefaultValues()
      },
      { deep: true }
    )


    // watch for updates of showTimeSelection --> we have to emit the selected time again,
    // if it's enabled again to ensure the correct saved time is emited to parent component
    watch(
      () => [props.showTimeSelection],
      () => {
        if (props.showTimeSelection) {
          getTimeValues()
        }
      },
      { deep: true }
    )

    // watch for updates on minimum days
    watch(
      () => [props.minimumDateRange],
      () => {
        minimumDate.value = new Date().setDate(new Date().getDate() - props.minimumDateRange)
      },
      { deep: true }
    )

    // watch for updates on minimum days
    watch(
      () => [props.maximumDateRange],
      () => {
        maximumDate.value = new Date().setDate(new Date().getDate() + props.maximumDateRange)
      },
      { deep: true }
    )

    return {
      date,
      range,
      modelConfig,
      dateValidationStatus,
      minimumDate,
      maximumDate
    }
  }
}
</script>