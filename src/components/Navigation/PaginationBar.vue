<!--
Project:
ExistenZuendung
Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
06.08.2022
Scope:
Pagination Bar
-->

<template>
  <!-- Nav container -->
  <nav class="border-t border-gray-200 px-6 flex items-center justify-between">
    <!-- Previous button -->
    <div
      v-if="page != 0"
      class="-mt-px w-0 flex-1 flex"
    >
      <button
        @click="toPreviousTapped"
        class="border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-md font-medium text-primaryText hover:text-secondaryText hover:border-gray-300"
      >
        <ArrowSmallLeftIcon
          class="mr-3 h-5 w-5 text-secondaryText"
          aria-hidden="true"
        />
        Vorherige
      </button>
    </div>
    <!-- Next button  -->
    <div
      v-if="nextPageAvailable"
      class="-mt-px w-0 flex-1 flex justify-end"
    >
      <button
        @click="toNextTapped"
        class="border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-md font-medium text-primaryText hover:text-secondaryText hover:border-gray-300"
      >
        Nächste
        <ArrowSmallRightIcon
          class="ml-3 h-5 w-5 text-secondaryText"
          aria-hidden="true"
        />
      </button>
    </div>
  </nav>
</template>

<script>
// Component imports
import {
  ArrowSmallLeftIcon,
  ArrowSmallRightIcon
} from '@heroicons/vue/24/solid'

export default {
  components: {
    ArrowSmallLeftIcon,
    ArrowSmallRightIcon
  },
  props: {
    nextPageAvailable: {
      type: Boolean,
      required: false,
      default: false
    },
    page: {
      type: Number,
      required: false,
      default: 1
    }
  },
  emits: ['to-next', 'to-previous'],
  setup(_, { emit }) {
    // Callback when the user wants to switch to the next site
    function toNextTapped() {
      emit('to-next')
    }

    // Callback when the user wants to switch to the previous site
    function toPreviousTapped() {
      emit('to-previous')
    }

    // Return the setup object
    return {
      toNextTapped,
      toPreviousTapped
    }
  }
}
</script>