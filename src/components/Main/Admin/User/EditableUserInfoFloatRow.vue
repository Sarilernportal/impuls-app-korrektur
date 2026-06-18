<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
19.09.2022

Scope:
Editable User Float Row
-->

<template>
  <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
    <!-- Title -->
    <dt class="text-sm font-medium text-primaryText">{{ title }}</dt>
    <!-- Value and Editing Section -->
    <dd class="mt-1 flex text-sm text-primaryText sm:mt-0 sm:col-span-2">
      <!-- Value -->
      <span
        v-if="!editModeActive"
        class="flex-grow"
      >{{ value || placeholder }}</span>
      <!-- Text field for editing -->
      <float-textfield
        v-else
        class="flex-grow -mt-2.5"
        ref="numberTextfield"
        elementID="number"
        name="number"
        enterButtonEvent="emitEvent"
        @input-value="setNumber"
        @is-valid="setNumberValidation"
        @enter-tapped="numberfieldEnterTapped"
        :placeholder="value.toString()"
        :value="value.toString()"
      />
      <span class="ml-4 flex-shrink-0">
        <!-- Button to activate the editing mode -->
        <button
          v-if="!editModeActive"
          type="button"
          @click="editModeActive = true"
          class="bg-indigo-600 py-0.5 px-2 rounded-md font-medium text-gray-100 hover:text-gray-400 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-gray-800"
        >
          {{ buttonTitle }}
        </button>
        <!-- Buttons while editing is active -->
        <div
          v-else
          class="flex flex-row items-center space-x-2"
        >
          <!-- Return button -->
          <button
            type="button"
            @click="editModeActive = false"
            class="w-5 h-5 bg-indigo-600 font-medium text-gray-100 hover:text-gray-400 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-gray-800 rounded-full"
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
          <!-- Loading Spinner -->
          <div v-if="isLoading">
            <loading-spinner size="h-5 w-5" />
          </div>
          <!-- Confirm Button for the update -->
          <button
            v-else
            type="button"
            :disabled="!inputIsValid"
            @click="submitChange"
            class="bg-green-500 py-0.5 px-2 rounded-md font-medium text-white hover:text-gray-300 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Aktualisieren
          </button>
        </div>
      </span>
    </dd>
  </div>
</template>

<script>
// Vue imports
import { ref, watch } from 'vue'
// Component imports
import LoadingSpinner from '@/components/UIComponents/Utilities/LoadingSpinner.vue'
import FloatTextfield from '@/components/UIComponents/Inputs/FloatTextfield.vue'

export default {
  name: 'EditableUserInfoFloatRow',
  props: {
    title: {
      type: String,
      required: true,
      default: ''
    },
    propertyKey: {
      type: String,
      required: true,
      default: ''
    },
    value: {
      type: Number,
      required: true,
      default: 0
    },
    buttonTitle: {
      type: String,
      required: true,
      default: ''
    },
    isLoading: {
      type: Boolean,
      required: true,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  components: {
    LoadingSpinner,
    FloatTextfield
  },
  setup(props, ctx) {
    // Initialize refs
    const numberTextfield = ref(null)
    const editModeActive = ref(false)
    const inputNumber = ref('')
    const inputIsValid = ref(false)

    // Watch the loading prop
    watch(
      () => props.isLoading,
      (value, prevValue) => {
        // If the old value was true and the new false, we know, that the value was edited, so cancel editmode
        if (prevValue && !value) {
          editModeActive.value = false
        }
      }
    )

    // Set the input text
    function setNumber(text) {
      inputNumber.value = text
    }

    // Set the input validation
    function setNumberValidation(isValid) {
      inputIsValid.value = isValid
    }

    // Enter was tapped on the textfield
    function numberfieldEnterTapped() {
      if (inputIsValid.value) {
        submitChange()
      }
    }

    // Submit the change with the given property key
    function submitChange() {
      ctx.emit('change-submit', {
        [props.propertyKey]: inputNumber.value
      })
    }

    // Return the setup object
    return {
      numberTextfield,
      editModeActive,
      inputNumber,
      inputIsValid,
      setNumber,
      setNumberValidation,
      numberfieldEnterTapped,
      submitChange
    }
  }
}
</script>
