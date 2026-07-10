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
  <div class="group py-1.5">
    <!-- Title -->
    <dt class="text-xs font-medium text-slate-500">{{ title }}</dt>
    <!-- Value and Editing Section -->
    <dd class="flex items-center justify-between gap-3 text-sm sm:col-span-2">
      <!-- Read mode -->
      <template v-if="!editModeActive">
        <span :class="['min-w-0 flex-grow break-words', value ? 'font-medium text-slate-900' : 'text-slate-400']">{{ value || placeholder }}</span>
        <button
          type="button"
          @click="editModeActive = true"
          :title="buttonTitle || 'Bearbeiten'"
          class="shrink-0 rounded-lg p-1.5 text-slate-300 transition hover:bg-slate-100 hover:text-slate-600 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-brand-100 group-hover:text-slate-400"
        >
          <PencilSquareIcon class="h-4 w-4" aria-hidden="true" />
        </button>
      </template>
      <!-- Edit mode -->
      <template v-else>
        <float-textfield
          class="-mt-2.5 flex-grow"
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
        <div class="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            @click="editModeActive = false"
            title="Abbrechen"
            class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
            <XMarkIcon class="h-5 w-5" aria-hidden="true" />
          </button>
          <loading-spinner v-if="isLoading" size="h-5 w-5" />
          <button
            v-else
            type="button"
            :disabled="!inputIsValid"
            @click="submitChange"
            title="Speichern"
            class="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CheckIcon class="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </template>
    </dd>
  </div>
</template>

<script>
// Vue imports
import { ref, watch } from 'vue'
// Component imports
import LoadingSpinner from '@/components/UIComponents/Utilities/LoadingSpinner.vue'
import FloatTextfield from '@/components/UIComponents/Inputs/FloatTextfield.vue'
import { PencilSquareIcon, CheckIcon, XMarkIcon } from '@heroicons/vue/20/solid'

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
    FloatTextfield,
    PencilSquareIcon,
    CheckIcon,
    XMarkIcon
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
