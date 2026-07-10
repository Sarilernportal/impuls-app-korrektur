<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
19.09.2022

Scope:
Editable User Info Phone Row
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
        <phone-textfield
          class="-mt-2.5 flex-grow"
          ref="phoneTextfield"
          elementID="phone"
          name="phone"
          enterButtonEvent="emitEvent"
          :value="value"
          :placeholder="value"
          @input-value="setPhone"
          @is-valid="setPhoneValidation"
          @enter-tapped="phoneTextfieldEnterTapped"
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
import PhoneTextfield from '@/components/UIComponents/Inputs/PhoneTextfield.vue'
import { PencilSquareIcon, CheckIcon, XMarkIcon } from '@heroicons/vue/20/solid'

export default {
  name: 'EditableUserInfoPhoneRow',
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
      type: String,
      required: true,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
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
    }
  },
  components: {
    LoadingSpinner,
    PhoneTextfield,
    PencilSquareIcon,
    CheckIcon,
    XMarkIcon
  },
  setup(props, ctx) {
    // Initialize refs
    const phoneTextfield = ref(null)
    const editModeActive = ref(false)
    const inputText = ref('')
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

    // Set the input
    function setPhone(phone) {
      inputText.value = phone
    }

    // Set the input validation
    function setPhoneValidation(isValid) {
      inputIsValid.value = isValid
    }

    // Enter was tapped on the phone textfield
    function phoneTextfieldEnterTapped() {
      if (inputIsValid.value) {
        submitChange()
      }
    }

    // Submit the change with the given property key
    function submitChange() {
      ctx.emit('change-submit', {
        [props.propertyKey]: inputText.value
      })
    }

    // Return the setup object
    return {
      phoneTextfield,
      editModeActive,
      inputText,
      inputIsValid,
      setPhone,
      setPhoneValidation,
      phoneTextfieldEnterTapped,
      submitChange
    }
  }
}
</script>
