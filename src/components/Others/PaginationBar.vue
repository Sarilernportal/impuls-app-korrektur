<template>
  <!-- Nav container -->
  <nav class="border-t border-tertiaryText px-6 flex items-center justify-between">
    <!-- Previous button -->
    <div
      v-if="page != 0"
      class="-mt-px w-0 flex-1 flex"
    >
      <button
        @click="toPreviousTapped"
        class="border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-sm font-medium text-primaryText hover:text-gray-700 hover:border-gray-300"
      >
        <ArrowLongLeftIcon
          class="mr-3 h-5 w-5 text-gray-400"
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
        class="border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm font-medium text-primaryText hover:text-gray-700 hover:border-gray-300"
      >
        Nächste
        <ArrowLongRightIcon
          class="ml-3 h-5 w-5 text-gray-400"
          aria-hidden="true"
        />
      </button>
    </div>
  </nav>
</template>

<script>
// Component imports
import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/vue/24/solid'

export default {
  components: {
    ArrowLongLeftIcon,
    ArrowLongRightIcon
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
