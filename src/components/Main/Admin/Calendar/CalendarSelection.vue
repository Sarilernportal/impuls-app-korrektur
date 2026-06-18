<template>
  <div class="w-full">
    <!-- calendars -->
    <CalendarSelectionModal
      :open="calendarsOpen"
      :calendar="calendars"
      :showLoadMore="calendarLoadMoreAvailable"
      @calendar-selected="calendarSelected"
      @close-modal="calendarsOpen = false"
      @load-more="fetchCalendars(false)"
      @query-set="setSearchValue"
    />
    <!-- selection -->
    <div class="w-full flex gap-8">
      <!-- add button-->
      <div class="w-full text-white flex justify-center">
        <div
          @click="openCalendars"
          :class="[
            enableAddButton
              ? 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
              : 'bg-gray-600 hover:bg-gray-700 cursor-not-allowed',
            'w-1/2 text-sm text-center flex justify-center font-medium text-white rounded-xl  py-2 px-4'
          ]"
        >
          <div class="self-center">Kalender verknüpfen</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// vue imports
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

// component imports
import CalendarSelectionModal from '@/components/UIComponents/Modals/CalendarSelectionModal.vue'

export default {
  components: {
    CalendarSelectionModal
  },
  props: {
    enableAddButton: {
      type: Boolean,
      required: true
    }
  },
  emits: ['calendar-selected'],
  setup(props, { emit }) {
    // initialize refs
    const calendarNextToken = ref(null)
    const calendars = ref([])
    const calendarsOpen = ref(false)
    const searchValue = ref('')

    // Initialize the store
    const store = useStore()

    // get list of calendars
    async function openCalendars() {
      if (props.enableAddButton) {
        try {
          if (calendars.value.length === 0) {
            await fetchCalendars(true)
          }
          calendarsOpen.value = true
        } catch (error) {
          console.log(error)
        }
      }
    }

    // fetch calendars from API
    async function fetchCalendars(initial) {
      try {
        const calendarResponse = await store.dispatch('listCalendars', {
          nextToken: calendarNextToken.value,
          filter: searchValue.value
        })
        // if it's the first request, overwrite the calendar object, else add to object array
        if (initial) {
          var tempCalendars = []
          for (const calendar of calendarResponse.items) {
            tempCalendars.push(calendar)
          }
          calendars.value = tempCalendars
        } else {
          for (const calendar of calendarResponse.items) {
            calendars.value.push(calendar)
          }
        }

        calendarNextToken.value = calendarResponse.nextToken
        // due to how the pagination works in AppSync, sometimes empty pages are returned if no filtered Object was found
        // if that happens, we pull again, unless the nextToken is null, indicating no more pullable objects
        if (
          calendarResponse.items.length <= 0 &&
          calendarNextToken.value !== null
        ) {
          fetchCalendars()
        }
      } catch (error) {
        console.log(error)
      }
    }

    async function setSearchValue(value) {
      // set search value for ListItem
      searchValue.value = value
      calendarNextToken.value = null
      calendars.value = []
      await fetchCalendars(true)
    }

    // set selected calendar
    function calendarSelected(selection) {
      emit('calendar-selected', selection)
      calendarsOpen.value = false
    }

    // check if more calendars can be loaded from API
    const calendarLoadMoreAvailable = computed(() => {
      if (calendarNextToken.value === null && calendars.value.length > 0) {
        return false
      }
      return true
    })

    return {
      calendars,
      calendarsOpen,
      calendarLoadMoreAvailable,
      openCalendars,
      calendarSelected,
      fetchCalendars,
      setSearchValue
    }
  }
}
</script>