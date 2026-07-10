<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
13.09.2022

Scope:
Input Label Component
-->

<template>
  <div>
    <slot name="label">
      <label
        :for="elementID"
        :class="['block text-sm font-medium', useLightText ? 'text-slate-100' : 'text-primaryText']"
      >
        {{ labelText }}
      </label>
    </slot>
  </div>
</template>

<script>
export default {
  name: "InputLabel",
  props: {
    labelText: {
      type: String,
      required: true,
      default: "Placeholder",
    },
    elementID: {
      type: String,
      required: true,
    },
    useLightText: {
      type: Boolean,
      required: false,
      default: false
    }
  },
};
</script>
