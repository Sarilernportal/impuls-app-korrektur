<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
14.04.2023

Scope:
CalendarList Header
-->

<template>
  <div class="w-full h-14 flex items-center">
    <!-- List Header -->
    <div class="relative w-full h-full flex justify-center items-center">
      <!-- List title -->
      <h3 class="text-center font-semibold text-primaryText text-xl">Kalender</h3>
      <!-- List add user Button -->
      <button
        type="button"
        @click="newCalendarButtonTapped"
        class="absolute right-2 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <!-- Plus icon -->
        <PlusIcon
          class="lg:-ml-1 lg:mr-2 h-5 w-5"
          aria-hidden="true"
        />
        <!-- Add User text, hidden in mobile view -->
        <p class="hidden lg:block">Neue Kalendergruppe</p>
      </button>
    </div>
  </div>
</template>

<script>
// Vue imports
import { useRouter } from 'vue-router'
// heroicons imports
import { PlusIcon } from '@heroicons/vue/24/solid'

export default {
  name: 'CalendarOverviewListHeader',
  components: {
    PlusIcon
  },
  setup() {
    const router = useRouter()

    function newCalendarButtonTapped() {
      // function for redirecting user to add user page
      router.push({
        name: 'NewCalendar'
      })
    }

    return { newCalendarButtonTapped }
  }
}
</script>
