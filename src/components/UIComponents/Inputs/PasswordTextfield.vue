<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
13.09.2022

Scope:
Password Textfield Component
-->

<template>
  <div>
    <slot name="input">
      <input
        v-model.trim="input"
        :id="elementID"
        :name="name"
        type="password"
        autocomplete
        :class="{
          'border-red-600': validationStatus === 'failed',
          'border-green-500': validationStatus === 'passed',
          'border-gray-300': validationStatus === 'pending'
        }"
        class="mt-1 appearance-none relative block w-full px-2 py-2 border-2 placeholder-gray-500 text-gray-900 rounded-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
        placeholder="Passwort"
        @input="validatePassword"
        @blur="validatePassword"
        @keydown.enter="enterTapped"
      />
    </slot>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { passwordValidation } from '@/utilities/others/inputValidations.js'

export default {
  name: 'PasswordTextfield',
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
    enterButtonEvent: {
      type: String,
      required: false,
      default: 'focusNext'
    }
  },
  setup(props, { emit }) {
    const input = ref('')
    const validationStatus = ref('pending')
    const isValid = ref(false)

    watch(input, (value) => {
      emit('input-value', value)
    })

    watch(isValid, (value) => {
      emit('is-valid', value)
    })

    function validatePassword() {
      if (passwordValidation(input.value)) {
        isValid.value = true
        validationStatus.value = 'passed'
      } else {
        isValid.value = false
        validationStatus.value = 'failed'
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

    function clear() {
      input.value = ''
      validationStatus.value = 'pending'
      isValid.value = false
    }

    return {
      input,
      validationStatus,
      isValid,
      validatePassword,
      clear,
      enterTapped
    }
  }
}
</script>
