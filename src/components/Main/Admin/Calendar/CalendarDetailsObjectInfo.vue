<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
19.09.2022

Scope:
User Detail Account Info View
-->

<template>
  <div>
    <!-- Header section -->
    <div class="space-y-1">
      <h3 class="font-display text-lg font-bold text-slate-900">Objekt</h3>
      <p class="max-w-2xl text-sm text-secondaryText">
        Informationen über den Kalender.
      </p>
    </div>
    <!-- Data Section -->
    <div class="mt-6">
      <dl class="divide-y divide-slate-200">
        <!-- Created Date Property -->
        <user-info-row
          title="Erstellt am"
          :value="createdDate"
        />
        <!-- Last Modified Date Property -->
        <user-info-row
          title="Zuletzt aktualisiert"
          :value="lastModifiedDate"
        />
        <!-- Delete Button -->
        <!-- <delete-button
          @button-tapped="deleteCalendarTapped"
          title="Kalender löschen"
          :isLoading="deleteIsLoading"
          :enabled="true"
        /> -->
      </dl>
    </div>
  </div>
</template>

<script>
// Vue imports
import { computed } from 'vue'
import { useStore } from 'vuex'
// Component imports
import UserInfoRow from '@/components/Main/Admin/User/UserInfoRow.vue'
import DeleteButton from '@/components/UIComponents/Buttons/DeleteButton.vue'

export default {
  name: 'UserDetailAccountInfo',
  props: {
    calendar: {
      type: Object,
      required: true
    },
    deleteIsLoading: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  components: {
    UserInfoRow,
    DeleteButton
  },
  setup(props, ctx) {
    const store = useStore()
    // Get the created date for the selected calendar
    const createdDate = computed(() => {
      try {
        if (props.calendar.createdAt) {
          // Get the raw date
          const rawDate = +new Date(props.calendar.createdAt)
          // Get the offset from the browser time zone
          const offset = new Date(+rawDate).getTimezoneOffset() * 60 * 1000
          // Create a new date with the offset
          const timeStamp = new Date(+rawDate - offset).toISOString()
          // Convert the timeStamp to an friendly readable timestamp
          const convertedArray = timeStamp.split('T')
          const date = convertedArray[0].replaceAll('-', '.')
          const dateSorted = date.split('.').reverse().join('.')
          const time = convertedArray[1].split('.')[0]
          const convertedTimestamp = dateSorted + ', ' + time
          return convertedTimestamp
        } else {
          // fallback
          return 'Nicht angegeben'
        }
      } catch (error) {
        console.log(error)
        // fallback
        return 'Nicht angegeben'
      }
    })

    // Get the last modified date for the selected calendar
    const lastModifiedDate = computed(() => {
      try {
        if (props.calendar.updatedAt) {
          // Get the raw date
          const rawDate = +new Date(props.calendar.updatedAt)
          // Get the offset from the browser time zone
          const offset = new Date(+rawDate).getTimezoneOffset() * 60 * 1000
          // Create a new date with the offset
          const timeStamp = new Date(+rawDate - offset).toISOString()
          // Convert the timestamp to an friendly readable timestamp
          const convertedArray = timeStamp.split('T')
          const date = convertedArray[0].replaceAll('-', '.')
          const dateSorted = date.split('.').reverse().join('.')
          const time = convertedArray[1].split('.')[0]
          const convertedTimestamp = dateSorted + ', ' + time
          return convertedTimestamp
        } else {
          // fallback
          return 'Nicht angegeben'
        }
      } catch (error) {
        console.log(error)
        return 'Nicht angegeben'
      }
    })

    // Called when the user wants to delete the selected calendar
    function deleteCalendarTapped() {
      ctx.emit('delete-calendar-tapped')
    }

    // Return the setup object
    return {
      createdDate,
      lastModifiedDate,
      deleteCalendarTapped
    }
  }
}
</script>
