<template>
  <div class="relative flex justify-center">
    <!-- loading spinner container -->
    <div
      v-if="isLoading"
      class="absolute top-0 flex w-full h-full justify-center items-center z-20 bg-gray-700/50"
    >
      <LoadingSpinner size="h-20 w-20" />
    </div>
    <!-- day picking -->
    <DatePicker
      class="w-full lg:w-1/3"
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
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
// calender import
import { DatePicker } from 'v-calendar'
// component imports
import LoadingSpinner from '@/components/UIComponents/Utilities/LoadingSpinner.vue'

export default {
  components: {
    DatePicker,
    LoadingSpinner
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
    const eventList = ref([])
    const isLoading = ref(false)

    // initialize store
    const store = useStore()

    async function getEventList() {
      try {
        // set loading state
        isLoading.value = true
        // create empty list for events
        var list = []
        for (const calendar of props.calendars) {
          const events = await getEventsByCalendar(calendar.id)
          for (const event of events) {
            // create event object
            const entry = {
              dot: {
                style: {
                  backgroundColor: calendar.color
                }
              },
              dates: [event.startDate],
              popover: {
                label: event.title,
                style: {
                  backgroundColor: calendar.color
                }
              }
            }
            // push to list
            list.push(entry)
          }
        }
        // return list of colored entries
        eventList.value = list
      } catch (error) {
        console.log(error)
        // fallback, show nothing
        eventList.value = []
      } finally {
        // reset loading state
        isLoading.value = false
      }
    }

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

    // get events by calendarID
    async function getEventsByCalendar(id) {
      try {
        // pull events via store
        const events = await store.dispatch('listEventsByCalendar', {
          id: id
        })
        // return event items
        return events
      } catch (error) {
        console.log(error)
        // fallback
        return []
      }
    }

    // watch for updates of available calendars
    watch(
      () => [props.calendars],
      async () => {
        await getEventList()
      },
      { deep: true }
    )

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
      eventList,
      isLoading
    }
  }
}
</script>