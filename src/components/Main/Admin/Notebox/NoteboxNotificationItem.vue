<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus
26.05.2023
Scope:
Notebox Notification Item
-->
<template>
  <div class="absolute bottom-0 right-0 p-5 pb-10">
    <div
      class="flex flex-col md:flex-row bg-white p-4 rounded-lg items-center gap-2 border border-slate-200 animate-pulse"
    >
      <div class="flex gap-2">
        <!-- close button -->
        <button @click="closeClicked">
          <XMarkIcon class="h-5 w-5 text-gray-600 hover:text-gray-400" />
        </button>
        <!-- info text -->
        <p class="text-sm md:text-base">Sie haben noch ungelesene Notizen</p>
      </div>
      <!-- notebox redirect -->
      <router-link
        :to="{ name: 'NoteboxOverview' }"
        class="w-full md:w-auto inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <p class="w-full text-center">Jetzt ansehen</p>
      </router-link>
    </div>
  </div>
</template>

<script>
//Icon imports
import {
  XMarkIcon
} from '@heroicons/vue/24/outline'

export default {
  components: {
    XMarkIcon
  },
  emits: ['close-clicked'],
  setup(_, { emit }) {
    // function for emitting close clicked event
    function closeClicked() {
      emit('close-clicked')
    }

    return {
      closeClicked
    }
  }
}
</script>