<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
13.09.2022

Scope:
Text Textfield Component
-->

<template>
  <div>
    <!-- Slot if we want to replace the content -->
    <slot name="input">
      <!-- Input Textfield -->
      <textarea
        :rows="textRows"
        v-model.trim="input"
        :id="elementID"
        :name="name"
        type="text"
        :class="{
          'border-red-500 bg-red-50/50 focus:border-red-500 focus:ring-red-100': validationStatus === 'failed',
          'border-green-500 bg-green-50/40 focus:border-green-500 focus:ring-green-100': validationStatus === 'passed',
          'border-slate-300 bg-white focus:border-impuls-blue focus:ring-blue-100': validationStatus === 'pending'
        }"
        class="mt-1 relative block min-h-[7rem] w-full rounded-lg border px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition focus:outline-none focus:ring-2 focus:z-10"
        :placeholder="placeholder"
        @input="validateText"
        @blur="validateText"
        @keydown.enter="enterTapped"
      />
    </slot>
  </div>
</template>

<script>
// Vue imports
import { onMounted, ref, watch } from 'vue'
// Utility imports
import { emptyValidation } from '@/utilities/others/inputValidations.js'

export default {
  name: 'TextLargeTextfield',
  emits: ['input-value', 'is-valid', 'enter-tapped'],
  props: {
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
    },
    enterButtonEvent: {
      type: String,
      required: false,
      default: 'focusNext'
    },
    prefilled: {
      type: String,
      required: false,
      default: null
    }
  },
  setup(props, { emit }) {
    // Initialize Refs
    const input = ref('')
    const validationStatus = ref('pending')
    const isValid = ref(false)
    const textRows = ref(1)

    // Watcher for the input value
    watch(input, (value) => {
      emit('input-value', value)
      getRowCount()
    })

    // Watcher for the input validation
    watch(isValid, (value) => {
      emit('is-valid', value)
    })

    // Gets called, when the user hits the enter button while typing
    function enterTapped(e) {
      // Check based on users decision how to handle an enter button hit
      if (props.enterButtonEvent === 'focusNext') {
        focusNext(e)
      } else if (props.enterButtonEvent === 'emitEvent') {
        emit('enter-tapped', e)
      }
    }

    // Focus the next element in the form to e.g. skip between textfields
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

    // Validate the input text
    function validateText() {
      if (emptyValidation(input.value)) {
        isValid.value = true
        validationStatus.value = 'passed'
      } else {
        isValid.value = false
        validationStatus.value = 'failed'
      }
    }

    function getRowCount() {
      const rowCount = input.value.split(/\r\n|\r|\n/).length
      if (rowCount < 2) {
        textRows.value = 1
      } else {
        textRows.value = rowCount
      }
    }

    // Clear the textfield
    function clear() {
      input.value = ''
      validationStatus.value = 'pending'
      isValid.value = false
    }

    // prefill textfield if provided
    onMounted(() => {
      if (props.prefilled) {
        input.value = props.prefilled
      }
    })

    // Return the setup object
    return {
      input,
      validationStatus,
      isValid,
      textRows,
      enterTapped,
      validateText,
      clear
    }
  }
}
</script>
