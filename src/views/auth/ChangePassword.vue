<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
14.09.2022

Scope:
Change Password Page
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
      <!-- Success modal -->
      <success-window
        v-if="changeSuccess"
        title="Aktualisieren erfolgreich"
        message="Wir haben Ihr Passwort erfolgreich aktualisiert."
        :open="changeSuccess"
        @close="ChangeMessageClosed"
      />
    </div>
    <form
      class="mt-6"
      @submit.prevent="submitForm"
    >
      <!-- header -->
      <h3 class="font-medium text-center text-white">
        Bitte geben Sie Ihr altes Passwort ein und bestätigen Sie Ihr neues
        Passwort.
      </h3>
      <div class="rounded-md shadow-sm">
        <!-- E-Mail Label and Textfield-->
        <!-- old Password and Textfield -->
        <div class="mt-3">
          <input-label
            elementID="old-password"
            labelText="Altes Passwort"
            :useLightText="true"
          />
          <password-textfield
            ref="oldPasswordTextfield"
            elementID="old-password"
            name="old-password"
            enterButtonEvent="focusNext"
            @input-value="setOldPassword"
            @is-valid="setOldPasswordValidation"
          />
        </div>
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
            @enter-tapped="submitForm"
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
import SuccessWindow from '@/components/UIComponents/Modals/SuccessWindow.vue'
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
  name: 'ChangePassword',
  components: {
    ErrorWindow,
    SuccessWindow,
    InputLabel,
    PasswordTextfield,
    ConfirmButton,
    BackButton
  },
  setup() {
    // Initialize refs
    const isLoading = ref(false)
    const changeSuccess = ref(false)
    //Initialize input Refs
    const oldPasswordTextfield = ref(null)
    const newPasswordTextfield = ref(null)
    const newPasswordRepeatTextfield = ref(null)
    // Initialize reactives
    const userInput = reactive({
      oldPassword: {
        isValid: false,
        value: ''
      },
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

    // old password setters
    function setOldPassword(password) {
      userInput.oldPassword.value = password
    }
    function setOldPasswordValidation(isValid) {
      userInput.oldPassword.isValid = isValid
    }

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
        // password
        const oldPassword = userInput.oldPassword.value
        // new password
        const newPassword = userInput.newPassword.value
        // Fire the method to the backend via store
        await store.dispatch('changePassword', {
          user: user,
          oldPassword: oldPassword,
          newPassword: newPassword
        })
        isLoading.value = false
        changeSuccess.value = true
      } catch (err) {
        // Log the error
        console.log(err)
        isLoading.value = false
        changeError.title = createErrorTitle(err)
        changeError.message = createErrorMessage(err)
        changeError.hasError = true
      }
    }

    // Gets called, when the change password success modal is closed
    function ChangeMessageClosed() {
      // Push the user to the home page
      router.push({ name: 'Home' })
      changeSuccess.value = false
    }

    // Check if all inputs are valid
    const allInputsValidated = computed(() => {
      const allValid =
        userInput.oldPassword.isValid &&
        userInput.newPassword.isValid &&
        userInput.newPasswordRepeat.isValid &&
        userInput.newPassword.value === userInput.newPasswordRepeat.value
      return allValid
    })

    // Return the setup object
    return {
      oldPasswordTextfield,
      newPasswordTextfield,
      newPasswordRepeatTextfield,
      isLoading,
      userInput,
      changeSuccess,
      changeError,
      allInputsValidated,
      setOldPassword,
      setOldPasswordValidation,
      setNewPassword,
      setNewPasswordValidation,
      setNewPasswordRepeat,
      setNewPasswordRepeatValidation,
      submitForm,
      ChangeMessageClosed
    }
  }
}
</script>
