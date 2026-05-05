<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
14.09.2022

Scope:
New Password Page
-->

<template>
  <div>
    <div>
      <!-- Error modal -->
      <error-window
        v-if="changeError.hasError"
        :title="changeError.title"
        :message="changeError.message"
        :open="changeError.hasError"
        @close="changeError.hasError = false"
      />
    </div>
    <form
      class="mt-6"
      @submit.prevent="submitForm"
    >
      <!-- header -->
      <h3 class="font-medium text-center text-white">
        Bitte geben Sie Ihr neues Passwort ein.
      </h3>
      <div class="rounded-md shadow-sm">
        <!-- new Password and Textfield -->
        <div class="mt-3">
          <input-label
            elementID="new-password"
            labelText="Neues Passwort"
            :useLightText="true"
          />
          <password-textfield
            ref="newPasswordTextfield"
            elementID="new-password"
            name="new-password"
            enterButtonEvent="focusNext"
            @input-value="setNewPassword"
            @is-valid="setNewPasswordValidation"
          />
        </div>
        <!-- new Password repeat and Textfield -->
        <div class="mt-3">
          <input-label
            elementID="new-password-repeat"
            labelText="Neues Passwort wiederholen"
            :useLightText="true"
          />
          <password-textfield
            ref="newPasswordRepeatTextfield"
            elementID="new-password-repeat"
            name="new-password-repeat"
            enterButtonEvent="emitEvent"
            @input-value="setNewPasswordRepeat"
            @is-valid="setNewPasswordRepeatValidation"
          />
        </div>
      </div>
      <!-- Action Area -->
      <div class="mt-6 flex justify-center items-center space-x-4">
        <!-- Back button -->
        <div>
          <back-button backTo="Home" />
        </div>
        <!-- Confirm button -->
        <confirm-button
          class="relative flex flex-grow justify-center"
          title="Bestätigen"
          :isLoading="isLoading"
          :enabled="allInputsValidated"
        />
      </div>
    </form>
  </div>
</template>

<script>
// Vue imports
import { ref, reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
// Component imports
import ErrorWindow from '@/components/UIComponents/Modals/ErrorWindow.vue'
import InputLabel from '@/components/UIComponents/Labels/InputLabel.vue'
import PasswordTextfield from '@/components/UIComponents/Inputs/PasswordTextfield.vue'
import ConfirmButton from '@/components/UIComponents/Buttons/ConfirmButton.vue'
import BackButton from '@/components/UIComponents/Buttons/BackButton.vue'
// Utility imports
import {
  createErrorTitle,
  createErrorMessage
} from '@/utilities/auth/errorCreator.js'
export default {
  name: 'NewPassword',
  components: {
    ErrorWindow,
    InputLabel,
    PasswordTextfield,
    ConfirmButton,
    BackButton
  },
  setup() {
    // Initialize refs
    const isLoading = ref(false)
    //Initialize input Refs
    const newPasswordTextfield = ref(null)
    const newPasswordRepeatTextfield = ref(null)
    // Initialize reactives
    const userInput = reactive({
      newPassword: {
        isValid: false,
        value: ''
      },
      newPasswordRepeat: {
        isValid: false,
        value: ''
      }
    })
    const changeError = reactive({
      hasError: false,
      title: '',
      message: ''
    })
    // Initialize store
    const store = useStore()
    // Initialize router
    const router = useRouter()

    // new password setters
    function setNewPassword(password) {
      userInput.newPassword.value = password
    }
    function setNewPasswordValidation(isValid) {
      userInput.newPassword.isValid = isValid
    }

    // new password repeat setters
    function setNewPasswordRepeat(password) {
      userInput.newPasswordRepeat.value = password
    }
    function setNewPasswordRepeatValidation(isValid) {
      userInput.newPasswordRepeat.isValid = isValid
    }

    // Submit the form
    function submitForm() {
      // First check all inputs
      if (allInputsValidated.value) {
        changePassword()
      }
    }

    // Change Password method
    async function changePassword() {
      try {
        isLoading.value = true
        // Email is username
        const user = store.getters.user
        // new password
        const newPassword = userInput.newPassword.value
        // Fire the method to the backend via store
        await store.dispatch('completeNewPassword', {
          user: user,
          newPassword: newPassword
        })
        isLoading.value = false
      } catch (err) {
        // Log the error
        console.log(err)
        isLoading.value = false
        changeError.title = createErrorTitle(err)
        changeError.message = createErrorMessage(err)
        changeError.hasError = true
      }
    }

    // Check if all inputs are valid
    const allInputsValidated = computed(() => {
      const allValid =
        userInput.newPassword.isValid &&
        userInput.newPasswordRepeat.isValid &&
        userInput.newPassword.value === userInput.newPasswordRepeat.value
      return allValid
    })

    // Return the setup object
    return {
      newPasswordTextfield,
      newPasswordRepeatTextfield,
      isLoading,
      userInput,
      changeError,
      allInputsValidated,
      setNewPassword,
      setNewPasswordValidation,
      setNewPasswordRepeat,
      setNewPasswordRepeatValidation,
      submitForm
    }
  }
}
</script>
