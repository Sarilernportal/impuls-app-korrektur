<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
14.09.2022

Scope:
Password Forgot Confirm View
-->

<template>
  <div>
    <div>
      <!-- Error modal -->
      <error-window
        v-if="resetError.hasError"
        :title="resetError.title"
        :message="resetError.message"
        :open="resetError.hasError"
        @close="confirmedError"
      />
      <!-- Success modal -->
      <success-window
        v-if="resetSuccess"
        title="Passwort zurückgesetzt"
        message="Sie haben erfolgreich Ihr Passwort zurückgesetzt und können sich nun einloggen."
        :open="resetSuccess"
        @close="confirmedSuccess"
      />
    </div>
    <!-- Form for the password forgot data -->
    <form @submit.prevent="submitForm">
      <!-- Header -->
      <h3 class="font-medium text-center text-white">
        Bitte geben Sie Ihre Email, Ihren zugesendeten Code und ein neues Passwort ein.
      </h3>
      <!-- email label and textfield -->
      <input-label
        class="mt-4"
        elementID="email"
        labelText="Email"
        :useLightText="true"
      />
      <email-textfield
        elementID="email"
        name="email"
        placeholder="benutzername@beispiel.com"
        :prefilled="userInput.email.value"
        @input-value="setEmail"
        @is-valid="setEmailValidation"
      />
      <!-- Code Label and Textfield -->
      <input-label
        class="mt-4"
        elementID="code"
        labelText="Code"
        :useLightText="true"
      />
      <number-textfield
        elementID="code"
        name="code"
        placeholder="Bestätigungscode"
        @input-value="setCode"
        @is-valid="setCodeValidation"
      />
      <!-- Password Label and Textfield -->
      <input-label
        class="mt-4"
        elementID="password"
        labelText="Passwort"
        :useLightText="true"
      />
      <password-textfield
        elementID="password"
        name="password"
        placeholder="Neues Passwort"
        enterButtonEvent="focusNext"
        @input-value="setPassword"
        @is-valid="setPasswordValidation"
      />
      <!-- Password Confirm Label and Textfield -->
      <input-label
        class="mt-4"
        elementID="passwordconfirm"
        labelText="Passwort bestätigen"
        :useLightText="true"
      />
      <password-textfield
        elementID="passwordconfirm"
        name="passwordconfirm"
        placeholder="Neues Passwort"
        enterButtonEvent="emitEvent"
        @enter-tapped="submitForm"
        @input-value="setPasswordConfirm"
        @is-valid="setPasswordConfirmValidation"
      />
      <!-- Action Area -->
      <div class="mt-6 flex justify-center items-center space-x-4">
        <!-- Back Button -->
        <div>
          <back-button backTo="PasswordForgot" />
        </div>
        <!-- Confirmation Button -->
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
import { ref, reactive, computed, onBeforeMount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
// Component imports
import ErrorWindow from '@/components/UIComponents/Modals/ErrorWindow.vue'
import SuccessWindow from '@/components/UIComponents/Modals/SuccessWindow.vue'
import InputLabel from '@/components/UIComponents/Labels/InputLabel.vue'
import EmailTextfield from '@/components/UIComponents/Inputs/EmailTextfield.vue'
import PasswordTextfield from '@/components/UIComponents/Inputs/PasswordTextfield.vue'
import NumberTextfield from '@/components/UIComponents/Inputs/NumberTextfield.vue'
import ConfirmButton from '@/components/UIComponents/Buttons/ConfirmButton.vue'
import BackButton from '@/components/UIComponents/Buttons/BackButton.vue'
// Utitlity imports
import {
  createErrorTitle,
  createErrorMessage
} from '@/utilities/auth/errorCreator.js'
export default {
  name: 'PasswordForgotConfirm',
  props: ['id'],
  components: {
    SuccessWindow,
    ErrorWindow,
    InputLabel,
    EmailTextfield,
    PasswordTextfield,
    NumberTextfield,
    ConfirmButton,
    BackButton
  },
  setup(props) {
    // Ref initialization
    const isValid = ref(false)
    const isLoading = ref(false)
    const resetSuccess = ref(false)
    // Reactive initialization
    const userInput = reactive({
      email: {
        value: '',
        isValid: false
      },
      code: {
        value: '',
        isValid: false
      },
      password: {
        value: '',
        isValid: false
      },
      passwordConfirm: {
        value: '',
        isValid: false
      }
    })
    const resetError = reactive({
      hasError: false,
      title: '',
      message: '',
      resetPossible: false
    })

    // Router and Store
    const route = useRoute()
    const router = useRouter()
    const store = useStore()

    // Gets called, when the user confirmed an error modal
    function confirmedError() {
      if (resetError.resetPossible) {
        resetError.hasError = false
      } else {
        router.push({ name: 'Login' })
      }
    }

    // Set the input email
    function setEmail(email) {
      userInput.email.value = email
    }
    // Set the input email validation
    function setEmailValidation(isValid) {
      userInput.email.isValid = isValid
    }
    // Set the input code
    function setCode(code) {
      userInput.code.value = code
    }
    // Set the input code validation
    function setCodeValidation(isValid) {
      userInput.code.isValid = isValid
    }
    // Set the input password
    function setPassword(password) {
      userInput.password.value = password
    }
    // Set the input password validaton
    function setPasswordValidation(isValid) {
      userInput.password.isValid = isValid
    }
    // Set the input password confirm
    function setPasswordConfirm(password) {
      userInput.passwordConfirm.value = password
    }
    // Set the input password confirm validation
    function setPasswordConfirmValidation(isValid) {
      userInput.passwordConfirm.isValid = isValid
    }

    // Check if all inputs are validated
    const allInputsValidated = computed(() => {
      if (
        userInput.code.isValid &&
        userInput.email.isValid &&
        userInput.password.isValid &&
        userInput.passwordConfirm.isValid &&
        userInput.password.value === userInput.passwordConfirm.value
      ) {
        return true
      }
      return false
    })

    // Submit the form
    function submitForm() {
      // First check if all inputs are validated
      if (allInputsValidated.value) {
        forgotPasswordConfirm()
      }
    }

    // Confirm the password forgot
    async function forgotPasswordConfirm() {
      try {
        isLoading.value = true
        // Send the request to the backend via store
        await store.dispatch('forgotPasswordConfirm', {
          code: userInput.code.value.toString(),
          username: userInput.email.value,
          password: userInput.password.value
        })
        resetSuccess.value = true
      } catch (err) {
        // Log the error
        console.log(err)
        resetError.hasError = true
        resetError.title = createErrorTitle(err)
        resetError.message = createErrorMessage(err)
        resetError.resetPossible = false
      } finally {
        isLoading.value = false
      }
    }

    // Gets called, when the user confirmed the success modal
    function confirmedSuccess() {
      // Bring him back to the login
      router.push({ name: 'Login' })
    }

    // check if query parameters contain an email
    function checkForPrefilledEmail() {
      try {
        if (route.query.email) {
          setEmail(route.query.email)
          setEmailValidation(true)
        }
      } catch (error) {
        console.log(error)
      }
    }

    onBeforeMount(() => {
      checkForPrefilledEmail()
    })

    // Return the setup object
    return {
      userInput,
      isValid,
      isLoading,
      resetSuccess,
      resetError,
      allInputsValidated,
      setEmail,
      setEmailValidation,
      setCode,
      setCodeValidation,
      setPassword,
      setPasswordValidation,
      setPasswordConfirm,
      setPasswordConfirmValidation,
      submitForm,
      confirmedSuccess,
      confirmedError
    }
  },
}
</script>
