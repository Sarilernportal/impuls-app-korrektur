<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
13.09.2022

Scope:
Login Page
-->

<template>
  <div>
    <div>
      <!-- Error Window, if the user makes an invalid request at login -->
      <error-window
        v-if="loginError.hasError"
        :title="loginError.title"
        :message="loginError.message"
        :open="loginError.hasError"
        @close="errorWindowClosed"
      />
    </div>
    <!-- Submit form for login -->
    <form
      class="space-y-6"
      @submit.prevent="submitForm"
    >
      <div
        v-if="localAuthMode"
        class="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800"
      >
        Lokaler Testmodus aktiv. Sie können die App ohne AWS-Backend als Demo öffnen.
      </div>
      <div class="space-y-5">
        <div>
          <!-- E-Mail Label and Textfield-->
          <div>
            <input-label
              elementID="email"
              labelText="E-Mail-Adresse"
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
        </div>
        <!-- Password Label and Textfield-->
        <div>
          <input-label
            elementID="password"
            labelText="Passwort"
          />
          <password-textfield
            ref="passwordTextfield"
            elementID="password"
            name="password"
            enterButtonEvent="emitEvent"
            @input-value="setPassword"
            @is-valid="setPasswordValidation"
          />
        </div>
      </div>
      <!-- Password Forgot button -->
      <div class="flex items-center">
        <button
          type="button"
          class="text-sm font-semibold text-impuls-blue transition hover:text-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 rounded"
          @click="passwordForgetTapped"
        >
          Passwort vergessen?
        </button>
      </div>
      <!-- Confirmation Button to send the form inputs-->
      <div>
        <confirm-button
          class="relative flex flex-grow justify-center"
          title="Login"
          :isLoading="isLoading"
          :enabled="allInputsValidated"
        />
      </div>
      <div v-if="localAuthMode">
        <button
          type="button"
          class="relative flex w-full justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          @click="demoLoginTapped"
        >
          Demo-App öffnen
        </button>
      </div>
    </form>
  </div>
</template>

<script>
// Vue imports
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
// Component imports
import ErrorWindow from '@/components/UIComponents/Modals/ErrorWindow.vue'
import IconTabSelector from '@/components/UIComponents/Tabs/IconTabSelector.vue'
import InputLabel from '@/components/UIComponents/Labels/InputLabel.vue'
import EmailTextfield from '@/components/UIComponents/Inputs/EmailTextfield.vue'
import PasswordTextfield from '@/components/UIComponents/Inputs/PasswordTextfield.vue'
import ConfirmButton from '@/components/UIComponents/Buttons/ConfirmButton.vue'
// Utility imports
import {
  createErrorTitle,
  createErrorMessage
} from '@/utilities/auth/errorCreator.js'
import { isLocalAuthMode } from '@/services/authService.js'

export default {
  components: {
    ErrorWindow,
    IconTabSelector,
    InputLabel,
    EmailTextfield,
    PasswordTextfield,
    ConfirmButton
  },
  setup() {
    // Initialize refs
    const isLoading = ref(false)
    const localAuthMode = ref(isLocalAuthMode)
    // Initialize input refs
    const emailTextfield = ref(null)
    const passwordTextfield = ref(null)
    // Initialize reactives
    const userInput = reactive({
      email: {
        value: '',
        isValid: false
      },
      password: {
        value: '',
        isValid: false
      }
    })
    const loginError = reactive({
      hasError: false,
      title: null,
      message: null
    })

    // Router
    const router = useRouter()

    //Store
    const store = useStore()

    // Declaration of functions to set user inputs
    function setEmail(email) {
      userInput.email.value = email
    }
    function setEmailValidation(isValid) {
      userInput.email.isValid = isValid
    }
    function setPassword(password) {
      userInput.password.value = password
    }
    function setPasswordValidation(isValid) {
      userInput.password.isValid = isValid
    }

    function passwordForgetTapped() {
      router.push({ name: 'PasswordForgot' })
    }

    function passwordResetRequired() {
      router.push({
        name: 'PasswordForgotConfirm',
        params: {
          id: userInput.email.value
        }
      })
    }

    // Declaration of other helper functions
    function submitForm() {
      signIn()
    }
    function demoLoginTapped() {
      signIn({
        email: 'demo@impuls.local',
        password: 'demo'
      })
    }
    function clearTextFields() {
      emailTextfield.value.clear()
      passwordTextfield.value.clear()
    }
    function errorWindowClosed() {
      loginError.hasError = false
      clearTextFields()
    }

    // Async sign in request to the store and backend
    async function signIn(demoCredentials = null) {
      if (allInputsValidated.value || demoCredentials) {
        isLoading.value = true
        try {
          const credentials = demoCredentials || {
            email: userInput.email.value,
            password: userInput.password.value
          }
          // Check based on the inputs which username the user has
          await store.dispatch('signIn', credentials)
          isLoading.value = false
          const user = store.getters.user
          if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
            router.push({ name: 'NewPassword' })
            return
          }

          if (store.getters.userIsGuardian) {
            router.push({ name: 'GuardianOverview' })
          } else {
            router.push({ name: 'GuardianAdminOverview' })
          }
        } catch (err) {
          console.log(err)
          if (err.name === 'PasswordResetRequiredException') {
            passwordResetRequired()
          }
          loginError.hasError = true
          loginError.title = createErrorTitle(err)
          loginError.message = createErrorMessage(err)
          isLoading.value = false
        }
      }
    }

    // Computed properties
    const allInputsValidated = computed(() => {
      if (userInput.email.isValid && userInput.password.isValid) {
        return true
      }
      return false
    })

    // Return the properties
    return {
      isLoading,
      localAuthMode,
      userInput,
      loginError,
      emailTextfield,
      passwordTextfield,
      setEmail,
      setEmailValidation,
      setPassword,
      setPasswordValidation,
      passwordForgetTapped,
      submitForm,
      demoLoginTapped,
      clearTextFields,
      errorWindowClosed,
      allInputsValidated
    }
  }
}
</script>
