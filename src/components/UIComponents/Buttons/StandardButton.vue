<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
13.09.2022

Scope:
Standard Button Component
-->

<template>
  <div>
    <slot name="action">
      <button
        @click="buttonTapped"
        type="submit"
        :disabled="!enabled"
        class="w-full group flex flex-grow justify-center py-2 px-4 border border-transparent text-sm font-medium text-white rounded-xl bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <span
          v-if="isLoading"
          class="flex items-center mr-3"
        >
          <loading-spinner-white />
        </span>
        <p v-else>
          {{ title }}
        </p>
      </button>
    </slot>
  </div>
</template>

<script>
import LoadingSpinnerWhite from '@/components/UIComponents/Utilities/LoadingSpinnerWhite.vue'

export default {
  name: 'StandardButton',
  components: {
    LoadingSpinnerWhite
  },
  emits: ['button-tapped'],
  props: {
    enabled: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true,
      default: 'Placeholder'
    },
    isLoading: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup(_, { emit }) {
    function buttonTapped() {
      emit('button-tapped')
    }

    return { buttonTapped }
  }
}
</script>
