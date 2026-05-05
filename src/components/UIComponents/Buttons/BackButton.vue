<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
13.09.2022

Scope:
Back Button Component
-->

<template>
  <div>
    <slot name="action">
      <button
        type="button"
        class="
          flex-none
          inline-flex
          items-center
          p-1
          border border-transparent
          rounded-full
          shadow-sm
          text-white
          bg-indigo-600
          hover:bg-indigo-700
          focus:outline-none
          focus:ring-2
          focus:ring-offset-2
          focus:ring-indigo-500
        "
        @click="backButtonTapped"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </slot>
  </div>
</template>

<script>
// Vue imports
import { useRouter } from "vue-router";

export default {
  name: "BackButton",
  props: {
    backTo: {
      type: String,
      required: false,
    },
  },
  setup(props) {
    const router = useRouter();
    function backButtonTapped() {
      if (props.backTo) {
        router.push({ name: props.backTo });
      } else {
        router.back();
      }
    }
    return { backButtonTapped };
  },
};
</script>
