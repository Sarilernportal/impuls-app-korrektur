<template>
  <!-- main container -->
  <div class="w-full md:w-3/4 flex gap-2 bg-white border border-gray-600 p-2 rounded-lg">
    <!-- info section -->
    <div class="w-full">
      <!-- event title -->
      <div class="flex flex-col mb-2">
        <p class="w-full font-semibold text-primaryText">Titel</p>
        <p class="w-full text-secondaryText">
          {{ event.title }}
        </p>
      </div>
      <!-- event description -->
      <div class="flex flex-col mb-2">
        <p class="w-full font-semibold text-primaryText">Beschreibung</p>
        <p class="w-full text-secondaryText">
          {{ event.description }}
        </p>
      </div>
      <!-- event link -->
      <div
        v-if="event.link !== '' && event.link"
        class="flex flex-col mb-2"
      >
        <p class="w-full font-semibold text-primaryText">Link</p>
        <p class="w-full text-blue-500 break-words">
          <a
            :href="event.link"
            target="_blank"
            rel="noopener noreferrer"
          >{{ event.link }}</a>
        </p>
      </div>
      <!-- event date -->
      <div class="flex flex-col mb-2">
        <p class="w-full font-semibold text-primaryText">Datum</p>
        <p class="w-full text-secondaryText">
          {{ eventDate }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
// vue imports
import { computed } from 'vue'
import { useStore } from 'vuex'

// component imports
import CalendarDetailsParticipationTile from '@/components/Main/Admin/Calendar/CalendarDetailsParticipationTile.vue'

export default {
  components: {
    CalendarDetailsParticipationTile
  },
  props: {
    event: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    // initialize soter
    const store = useStore()

    // Get the date of event
    const eventDate = computed(() => {
      try {
        // Get the day name to a locale string
        const dayName = new Date(props.event.startDate).toLocaleDateString(
          'de-DE'
        )
        // Convert the timestamp to a more readable date
        const convertedStartTimeStamp = props.event.startDate
          .split('T')[1]
          .split('.')[0]

        // Create start hour and minutes with the offset
        const offset = new Date(props.event.startDate).getTimezoneOffset() / 60
        const startHour = new Date(props.event.startDate).getHours() + offset
        const startMinutes = new Date(props.event.startDate).getMinutes()

        // get duration values from event
        const durationHours = Math.floor(props.event.durationInHours)
        const durationMinutes = (props.event.durationInHours % 1) * 60

        // create end hours and minutes
        const endHours = startHour + durationHours
        const endMinutes = startMinutes + durationMinutes

        // Create the date string
        const friendlyDate = `${dayName}, ${convertedStartTimeStamp} - ${endHours}:${endMinutes < 10 ? '0' + endMinutes : endMinutes
          }:00`
        return friendlyDate
      } catch (error) {
        console.log(error)
        // Fallback
        return 'Keine Angabe'
      }
    })

    return {
      eventDate
    }
  }
}
</script>
