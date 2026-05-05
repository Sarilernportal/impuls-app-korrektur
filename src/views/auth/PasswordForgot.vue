<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
14.09.2022

Scope:
Password Forgot View
-->

<template>
  <div>
    <div>
      <!-- Error modal -->
      <error-window
        v-if="forgetError.hasError"
        :title="forgetError.title"
        :message="forgetError.message"
        :open="forgetError.hasError"
        @close="forgetError.hasError = false"
      />
      <!-- Success modal -->
      <success-window
        v-if="forgetSuccess"
        title="Zurücksetzen erfolgreich"
        message="Wir haben Ihnen an Ihre E-Mail-Adresse / Telefonnummer einen Code zum Zurücksetzen Ihres Passworts gesendet."
        :open="forgetSuccess"
        @close="forgetMessageClosed"
      />
    </div>
    <form
      class="mt-6"
      @submit.prevent="submitForm"
    >
      <div class="rounded-md shadow-sm">
        <!-- E-Mail Label and Textfield-->
        <div>
          <input-label
            elementID="email"
            labelText="E-Mail-Adresse"
            :useLightText="true"
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
      <!-- Code already requested button -->
      <div class="flex items-center mt-2">
        <button
          type="button"
          class="font-medium text-white hover:text-gray-300 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-primary-500"
          @click="codeAlreadyRequestedTapped"
        >
          Ich habe bereits einen Code!
        </button>
      </div>
      <!-- Action Area -->
      <div class="mt-6 flex justify-center items-center space-x-4">
        <!-- Back button -->
        <div>
          <back-button backTo="Login" />
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
import { ref, reactive, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
// Component imports
import ErrorWindow from "@/components/UIComponents/Modals/ErrorWindow.vue";
import SuccessWindow from "@/components/UIComponents/Modals/SuccessWindow.vue";
import InputLabel from "@/components/UIComponents/Labels/InputLabel.vue";
import EmailTextfield from "@/components/UIComponents/Inputs/EmailTextfield.vue";
import ConfirmButton from "@/components/UIComponents/Buttons/ConfirmButton.vue";
import BackButton from "@/components/UIComponents/Buttons/BackButton.vue";
// Utility imports
import {
  createErrorTitle,
  createErrorMessage,
} from "@/utilities/auth/errorCreator.js";
export default {
  name: "PasswordForgot",
  components: {
    ErrorWindow,
    SuccessWindow,
    InputLabel,
    EmailTextfield,
    ConfirmButton,
    BackButton,
  },
  setup() {
    // Initialize refs
    const isLoading = ref(false);
    const forgetSuccess = ref(false);
    //Initialize input Refs
    const emailTextfield = ref(null);
    // Initialize reactives
    const userInput = reactive({
      email: {
        isValid: false,
        value: "",
      },
    });
    const forgetError = reactive({
      hasError: false,
      title: "",
      message: "",
    });
    // Initialize store
    const store = useStore();
    // Initialize router
    const router = useRouter();

    function setEmail(email) {
      userInput.email.value = email;
    }
    function setEmailValidation(isValid) {
      userInput.email.isValid = isValid;
    }

    // Submit the form
    function submitForm() {
      // First check all inputs
      if (allInputsValidated.value) {
        forgotPassword();
      }
    }

    // Forgot Password method
    async function forgotPassword() {
      try {
        isLoading.value = true;
        // Email is username
        let username = userInput.email.value;
        // Fire the method to the backend via store
        await store.dispatch("forgotPassword", {
          username: username,
        });
        isLoading.value = false;
        forgetSuccess.value = true;
      } catch (err) {
        // Log the error
        console.log(err);
        isLoading.value = false;
        forgetError.title = createErrorTitle(err);
        forgetError.message = createErrorMessage(err);
        forgetError.hasError = true;
      }
    }

    // Gets called, when the forgot password success modal is closed
    function forgetMessageClosed() {
      let username = userInput.email.value;
      // Push the user to the confirmation page with his username as email
      router.push({ name: "PasswordForgotConfirm", query: { email: username } });
      forgetSuccess.value = false;
    }

    // get called when the user already has a code and wants to be redirected to the set password page
    function codeAlreadyRequestedTapped() {
      router.push({ name: "PasswordForgotConfirm" });
    }

    // Check if all inputs are valid
    const allInputsValidated = computed(() => {
      return userInput.email.isValid;
    });

    // Return the setup object
    return {
      emailTextfield,
      isLoading,
      userInput,
      forgetSuccess,
      forgetError,
      allInputsValidated,
      setEmail,
      setEmailValidation,
      submitForm,
      forgetMessageClosed,
      codeAlreadyRequestedTapped,
    };
  },
};
</script>
