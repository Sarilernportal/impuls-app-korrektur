<template>
  <div class="w-full lg:w-1/3 flex justify-center">
    <!-- day picking -->
    <DatePicker
      :is-dark="false"
      :modelValue="new Date()"
      v-model="date"
      :model-config="modelConfig"
      mode="date"
      timezone="Europe/Amsterdam"
      :attributes="eventList"
    />
  </div>
</template>

<script>
// vue imports
import { computed, ref, watch } from 'vue'
// calender import
import { DatePicker } from 'v-calendar'

export default {
  components: {
    DatePicker
  },
  props: {
    calendars: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  emits: ['date-selected'],
  setup(props, { emit }) {
    // initialize refs
    const date = ref(null)
    const modelConfig = ref({
      timeAdjust: '12:00:00',
      type: 'string'
    })

    const eventList = computed(() => {
      try {
        var list = []

        for (const event of props.calendars) {
          // create event object
          const entry = {
            dot: {
              style: {
                backgroundColor: 'yellow'
              }
            },
            dates: [event.startDate]
          }
          // push to list
          list.push(entry)
        }

        // return list of colored entries
        return list
      } catch (error) {
        console.log(error)
        // fallback, show nothing
        return []
      }
    })

    function emitDate() {
      try {
        // get timezone offset
        const offset = new Date(date.value).getTimezoneOffset() * 60 * 1000
        // Create a new date with the offset
        const timeStamp = new Date(
          new Date(date.value).valueOf() - offset
        ).toISOString()
        // emit adjusted date
        emit('date-selected', date.value)
      } catch (error) {
        console.log(error)
      }
    }

    // watch for updates of user input
    watch(
      () => [date.value],
      () => {
        emitDate()
      },
      { deep: true }
    )

    return {
      date,
      modelConfig,
      eventList
    }
  }
}
</script>