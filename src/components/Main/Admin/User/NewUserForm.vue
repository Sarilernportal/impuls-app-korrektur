<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
19.09.2022

Scope:
New user form
-->

<template>
  <!-- Main Container -->
  <div class="w-full">
    <!-- Form Container -->
    <form
      class="grid w-full gap-5"
      @submit.prevent="submitForm"
    >
      <div class="grid gap-4 md:grid-cols-2">
        <div>
          <input-label
            elementID="name"
            labelText="Name*"
          />
          <text-textfield
            ref="nameTextfield"
            elementID="name"
            name="name"
            placeholder="Max"
            @input-value="setName"
            @is-valid="setNameValidation"
          />
        </div>
        <div>
          <input-label
            elementID="familyName"
            labelText="Nachname*"
          />
          <text-textfield
            ref="familyNameTextfield"
            elementID="familyName"
            name="familyName"
            placeholder="Mustermann"
            @input-value="setFamilyName"
            @is-valid="setFamilyNameValidation"
          />
        </div>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <div>
          <input-label
            elementID="email"
            labelText="E-Mail-Adresse*"
          />
          <email-textfield
            ref="emailTextfield"
            elementID="email"
            name="email"
            placeholder="benutzername@beispiel.com"
            @input-value="setEmail"
            @is-valid="setEmailValidation"
          />
        </div>
        <div>
          <input-label
            elementID="phone"
            labelText="Telefonnummer"
          />
          <phone-textfield
            ref="phoneTextfield"
            elementID="phone"
            name="phone"
            placeholder="176123456789"
            @input-value="setPhone"
            @is-valid="setPhoneValidation"
          />
        </div>
      </div>

      <div
        v-if="!isAdmin"
        class="grid gap-4 md:grid-cols-2"
      >
        <div>
          <input-label
            elementID="professional"
            labelText="Fachkraftstatus"
          />
          <SimpleDropdown
            class="w-full mt-1"
            title="Fachkraftstatus"
            :displayTitle="false"
            :properties="['Fachkraft', 'Nicht-Fachkraft']"
            defaultSelected="Fachkraft"
            @selection="setProfessional"
          />
        </div>
        <div class="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <p class="text-sm font-semibold text-slate-900">Zugangsart</p>
          <p class="mt-1 text-sm text-slate-600">Mitarbeiter erhalten Zugriff auf Doku, Nachweise und eigene Termine.</p>
        </div>
      </div>

      <div class="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <span class="text-sm font-medium text-slate-500">
          * Pflichtangabe
        </span>
        <div class="w-full sm:w-48">
          <standard-button
            title="Hinzufügen"
            :isLoading="isLoading"
            :enabled="allInputsValidated"
          />
        </div>
      </div>
    </form>
  </div>
</template>

<script>
// Vue imports
import { ref, reactive, computed } from 'vue'
// Component imports
import InputLabel from '@/components/UIComponents/Labels/InputLabel.vue'
import TextTextfield from '@/components/UIComponents/Inputs/TextTextfield.vue'
import PhoneTextfield from '@/components/UIComponents/Inputs/PhoneTextfield.vue'
import EmailTextfield from '@/components/UIComponents/Inputs/EmailTextfield.vue'
import StandardButton from '@/components/UIComponents/Buttons/StandardButton.vue'
import SimpleDropdown from '@/components/UIComponents/Dropdowns/SimpleDropdown.vue'

export default {
  name: 'NewUserForm',
  components: {
    InputLabel,
    TextTextfield,
    PhoneTextfield,
    EmailTextfield,
    StandardButton,
    SimpleDropdown
  },
  props: {
    isLoading: {
      type: Boolean,
      required: true,
      default: false
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  setup(props, context) {
    // Input Elements
    const nameTextfield = ref(null)
    const familyNameTextfield = ref(null)
    const emailTextfield = ref(null)
    const phoneTextfield = ref(null)

    // Inputs
    const userInput = reactive({
      name: {
        value: '',
        isValid: false
      },
      familyName: {
        value: '',
        isValid: false
      },
      email: {
        value: '',
        isValid: false
      },
      phone: {
        value: '',
        isValid: false
      },
      professional: {
        value: 'Fachkraft',
        isValid: true
      }
    })

    // Declaration of functions to set user inputs
    function setName(name) {
      userInput.name.value = name
    }
    function setNameValidation(isValid) {
      userInput.name.isValid = isValid
    }
    function setFamilyName(familyName) {
      userInput.familyName.value = familyName
    }
    function setFamilyNameValidation(isValid) {
      userInput.familyName.isValid = isValid
    }
    function setPhone(phone) {
      userInput.phone.value = phone
    }
    function setPhoneValidation(isValid) {
      userInput.phone.isValid = isValid
    }
    function setEmail(email) {
      userInput.email.value = email
    }
    function setEmailValidation(isValid) {
      userInput.email.isValid = isValid
    }
    function setProfessional(state) {
      userInput.professional.value = state
    }

    // Check if the inputs are validated
    const allInputsValidated = computed(() => {
      // First check if name and family name are valid
      if (userInput.name.isValid && userInput.familyName.isValid) {
        // Second check if email and phone is valid, both valid is possible
        if (userInput.email.isValid) {
          return true
          // Third check if either email or phone is valid,
          // then check if the other value is on 'pending' state, so its empty
          // This is possible, because only one is required for authentication
        } else if (
          userInput.email.isValid &&
          emailTextfield.value.validationStatus === 'pending'
        ) {
          return true
        }
        //Otherwise inputs are not valid
        return false
      }
      return false
    })

    // Submit the form
    function submitForm() {
      context.emit('submit-inputs', userInput)
    }

    return {
      nameTextfield,
      familyNameTextfield,
      emailTextfield,
      phoneTextfield,
      setName,
      setNameValidation,
      setFamilyName,
      setFamilyNameValidation,
      setPhone,
      setPhoneValidation,
      setEmail,
      setEmailValidation,
      setProfessional,
      allInputsValidated,
      submitForm
    }
  }
}
</script>
