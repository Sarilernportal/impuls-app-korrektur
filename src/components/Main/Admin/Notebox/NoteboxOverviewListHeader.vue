<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
19.01.2023

Scope:
Notebox Overview List Header
-->

<template>
  <div class="w-full h-14 flex items-center mb-4">
    <!-- List Header -->
    <div class="relative w-full h-full flex justify-center items-center">
      <!-- List title -->
      <h3 class="text-center font-semibold text-primaryText text-xl">Notebox</h3>
      <!-- List upload Button -->
      <button
        type="button"
        @click="newUuploadButtonTapped"
        class="absolute right-2 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <!-- Plus icon -->
        <PlusIcon
          class="lg:-ml-1 lg:mr-2 h-5 w-5"
          aria-hidden="true"
        />
        <!-- upload text, hidden in mobile view -->
        <p class="hidden lg:block">Erstellen</p>
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
  name: 'GuardianAdminOverviewListHeader',
  components: {
    PlusIcon
  },
  setup() {
    const router = useRouter()

    function newUuploadButtonTapped() {
      // function for redirecting user to add user page
      router.push({
        name: 'NoteboxCreateNote'
      })
    }

    return { newUuploadButtonTapped }
  }
}
</script>
