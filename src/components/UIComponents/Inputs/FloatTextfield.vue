<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
12.04.2023

Scope:
Float Textfield Component
-->

<template>
  <div>
    <slot name="input">
      <input
        v-model.trim="input"
        :id="elementID"
        :name="name"
        type="number"
        :class="{
          'border-red-500 bg-red-50/50 focus:border-red-500 focus:ring-red-100': validationStatus === 'failed',
          'border-green-500 bg-green-50/40 focus:border-green-500 focus:ring-green-100': validationStatus === 'passed',
          'border-slate-300 bg-white focus:border-impuls-blue focus:ring-blue-100': validationStatus === 'pending'
        }"
        class="mt-1 relative block w-full rounded-lg border px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition focus:outline-none focus:ring-2 focus:z-10"
        :placeholder="placeholder"
        @input="validateNumber"
        @blur="validateNumber"
        @keydown.enter="focusNext"
      />
    </slot>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { floatOrIntegerValidation } from '@/utilities/others/inputValidations.js'

export default {
  name: 'NumberTextfield',
  emits: ['input-value', 'is-valid'],
  props: {
    value: {
      type: String,
      default: '',
    },
    elementID: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      required: true,
      default: 'Placeholder'
    }
  },
  setup(props, { emit }) {
    const input = ref(props.value)
    const validationStatus = ref('pending')
    const isValid = ref(false)

    function validateNumber() {
      if (floatOrIntegerValidation(input.value)) {
        isValid.value = true
        validationStatus.value = 'passed'
      } else {
        isValid.value = false
        validationStatus.value = 'failed'
      }
    }

    function focusNext(e) {
      const inputs = Array.from(
        e.target.form.querySelectorAll(
          'input[type="text"], input[type="email"], input[type="phone"], input[type="password"]'
        )
      )
      const index = inputs.indexOf(e.target)

      if (index < inputs.length) {
        inputs[index + 1].focus()
      }
    }

    function clear() {
      input.value = ''
      validationStatus.value = 'pending'
      isValid.value = false
    }

    watch(input, (value) => {
      emit('input-value', value)
    })

    watch(isValid, (value) => {
      emit('is-valid', value)
    })

    return {
      input,
      validationStatus,
      isValid,
      validateNumber,
      focusNext,
      clear
    }
  }
}
</script>
