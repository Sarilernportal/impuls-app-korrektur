<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
13.09.2022

Scope:
Confirm Button Component
-->

<template>
  <div>
    <slot name="action">
      <button
        type="submit"
        :disabled="!enabled"
        class="
          group
          relative
          flex flex-grow
          justify-center
          py-2
          px-4
          border border-transparent
          text-sm
          font-medium
          text-white
          rounded-xl
          bg-indigo-600
          hover:bg-indigo-700
          focus:outline-none
          focus:ring-2
          focus:ring-offset-2
          focus:ring-indigo-500
          disabled:opacity-30 disabled:cursor-not-allowed
        "
      >
        <span class="absolute left-0 inset-y-0 flex items-center pl-3">
          <svg
            v-if="!isLoading"
            class="h-5 w-5 text-slate-100 group-hover:text-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clip-rule="evenodd"
            />
          </svg>
          <loading-spinner-white v-else />
        </span>
        {{ title }}
      </button>
    </slot>
  </div>
</template>

<script>
import LoadingSpinnerWhite from "@/components/UIComponents/Utilities/LoadingSpinnerWhite.vue";

export default {
  name: "ConfirmButton",
  components: {
    LoadingSpinnerWhite,
  },
  props: {
    enabled: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: true,
      default: "Placeholder",
    },
    isLoading: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
};
</script>
