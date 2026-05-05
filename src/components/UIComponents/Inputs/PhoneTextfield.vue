<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
13.09.2022

Scope:
Phone Textfield Component
-->
<template>
  <div>
    <!-- Slot if we want to replace the content -->
    <slot name="input">
      <div class="mt-1 relative rounded-lg shadow-sm">
        <!-- Country flag for visualization of the phone textfield -->
        <div class="absolute inset-y-0 left-0 flex items-center rounded-l-lg border-r border-slate-200 bg-slate-50">
          <img class="h-7 w-9 object-cover rounded-l-lg" src="@/assets/icons/deutschland.png" />
          <h3
            class="flex h-full items-center py-0 pl-2 pr-2 text-left text-sm font-semibold text-slate-700"
          >
            +49
          </h3>
        </div>
        <!-- Input Textfield -->
        <input
          v-model.trim="input"
          :id="elementID"
          :name="name"
          type="phone"
          :class="{
            'border-red-500 bg-red-50/50 focus:border-red-500 focus:ring-red-100': validationStatus === 'failed',
            'border-green-500 bg-green-50/40 focus:border-green-500 focus:ring-green-100': validationStatus === 'passed',
            'border-slate-300 bg-white focus:border-impuls-blue focus:ring-blue-100': validationStatus === 'pending'
          }"
          class="block w-full rounded-lg border py-2.5 pl-24 pr-3 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition focus:outline-none focus:ring-2 focus:z-10"
          :placeholder="trimmedPlaceholder"
          @input="validatePhone"
          @blur="valdiatePhone"
          @keydown.enter="enterTapped"
        />
      </div>
    </slot>
  </div>
</template>

<script>
// Vue imports
import { ref, watch, computed } from 'vue'
// Utility imports
import { phoneValidation } from '@/utilities/others/inputValidations.js'

export default {
  name: 'PhoneTextfield',
  emits: ['input-value', 'is-valid', 'enter-tapped'],
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
    },
    enterButtonEvent: {
      type: String,
      required: false,
      default: 'focusNext'
    }
  },
  setup(props, { emit }) {
    // Initialze refs
    const input = ref(props.value)
    const validationStatus = ref('pending')
    const isValid = ref(false)

    // Watcher for the input value
    watch(input, (value) => {
      if (value === '') {
        isValid.value = false
        validationStatus.value = 'pending'
        emit('input-value', '')
        return
      }
      const numberWithPrefix = `+49${value.trim()}`
      emit('input-value', numberWithPrefix)
    })

    // Watcher for the phone number validation
    watch(isValid, (value) => {
      emit('is-valid', value)
    })

    // Check if the placeholder is with the prenumber, if yes replace it
    const trimmedPlaceholder = computed(() => {
      if (props.placeholder.startsWith('+49')) {
        const trimmed = props.placeholder.split('+49')[1]
        return trimmed
      }
      return props.placeholder
    })

    // Function to check the validation status
    function validatePhone() {
      if (input.value !== '') {
        if (phoneValidation(input.value)) {
          isValid.value = true
          validationStatus.value = 'passed'
        } else {
          isValid.value = false
          validationStatus.value = 'failed'
        }
      }
    }

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

    // Clear the textfield
    function clear() {
      input.value = ''
      validationStatus.value = 'pending'
      isValid.value = false
    }

    // Return the setup object
    return {
      input,
      trimmedPlaceholder,
      validationStatus,
      isValid,
      validatePhone,
      enterTapped,
      clear
    }
  }
}
</script>
