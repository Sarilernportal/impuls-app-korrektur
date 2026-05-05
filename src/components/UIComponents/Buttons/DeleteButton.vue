<template>
  <loading-spinner-white
    v-if="isLoading"
    size="h-6 w-6"
  />
  <button
    v-else
    :disabled="!enabled"
    type="button"
    class="
      w-auto
      inline-flex
      justify-center
      rounded-md
      border border-transparent
      shadow-sm
      px-4
      py-2
      bg-red-600
      text-base
      font-medium
      text-white
      hover:bg-red-700
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
      disabled:opacity-30 disabled:cursor-not-allowed
      sm:text-sm
    "
    @click="buttonTapped"
  >
    {{ title }}
  </button>
</template>

<script>
// Component imports
import LoadingSpinnerWhite from '@/components/UIComponents/Utilities/LoadingSpinnerWhite.vue'

export default {
  name: 'DeleteButton',
  emits: ['button-tapped'],
  props: {
    title: {
      type: String,
      required: true,
      default: ''
    },
    isLoading: {
      type: Boolean,
      required: true,
      default: false
    },
    enabled: {
      type: Boolean,
      required: true,
      default: true
    }
  },
  components: {
    LoadingSpinnerWhite
  },
  setup(_, context) {
    function buttonTapped() {
      context.emit('button-tapped')
    }

    return {
      buttonTapped
    }
  }
}
</script>
