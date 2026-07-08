<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
26.09.2022

Scope:
New carrier contact form
-->

<template>
  <!-- Main Container -->
  <div class="w-full flex items-center justify-center">
    <!-- Form Container -->
    <form
      class="mt-5 flex w-full flex-col items-center justify-center gap-5 px-0 sm:px-4"
      @submit.prevent="submitForm"
    >
      <!-- contact person container -->
      <div class="flex w-full">
        <div class="space-y-1">
          <h3 class="text-lg leading-6 font-medium text-primaryText">
            Kontaktperson
          </h3>
          <p class="max-w-2xl text-sm text-secondaryText">
            Informationen über die Kontaktperson einer Kostenträger.
          </p>
        </div>
      </div>
      <!-- first row -->
      <div class="flex flex-col md:flex-row w-full justify-between gap-4 md:gap-6">
        <!-- contact name -->
        <div class="w-full md:w-1/2">
          <input-label
            elementID="name"
            labelText="Name*"
          />
          <text-textfield
            elementID="name"
            name="name"
            placeholder="Max"
            @input-value="setName"
            @is-valid="setNameValidation"
          />
        </div>
        <!-- contact family name -->
        <div class="w-full md:w-1/2">
          <input-label
            elementID="familyName"
            labelText="Nachname*"
          />
          <text-textfield
            elementID="postalcode"
            name="familyName"
            placeholder="Mustermann"
            @input-value="setFamilyName"
            @is-valid="setFamilyNameValidation"
          />
        </div>
      </div>
      <!-- second row -->
      <div class="flex flex-col md:flex-row w-full justify-between gap-4 md:gap-6">
        <!-- contact phone -->
        <div class="w-full md:w-1/2">
          <input-label
            elementID="phone"
            labelText="Telefon"
          />
          <phone-textfield
            elementID="phone"
            name="phone"
            placeholder="176123456789"
            @input-value="setPhone"
            @is-valid="setPhoneValidation"
          />
        </div>
        <!-- contact email -->
        <div class="w-full md:w-1/2">
          <input-label
            elementID="email"
            labelText="E-Mail"
          />
          <email-textfield
            elementID="email"
            name="email"
            placeholder="max@mustermann.de"
            @input-value="setEmail"
            @is-valid="setEmailValidation"
          />
        </div>
      </div>
      <!-- carrier selection -->
      <CarrierSelection
        v-if="!carrierIsLoading"
        @carrier-selected="setCarrier"
        :preSelected="carrierContactInput.carrier.value"
      />
      <LoadingSpinner
        v-else
        size="h-10 w-10"
      />
      <!-- information and create button -->
      <div class="w-full">
        <span class="text-left text-secondaryText text-sm font-medium">
          *Pflichtangabe
        </span>
      </div>
      <!-- Submit Button -->
      <standard-button
        title="Hinzufügen"
        :isLoading="isLoading"
        :enabled="allInputsValidated"
      />
    </form>
  </div>
</template>

<script>
// Vue imports
import { ref, reactive, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
// Component imports
import InputLabel from '@/components/UIComponents/Labels/InputLabel.vue'
import TextTextfield from '@/components/UIComponents/Inputs/TextTextfield.vue'
import PhoneTextfield from '@/components/UIComponents/Inputs/PhoneTextfield.vue'
import NumberTextfield from '@/components/UIComponents/Inputs/NumberTextfield.vue'
import EmailTextfield from '@/components/UIComponents/Inputs/EmailTextfield.vue'
import StandardButton from '@/components/UIComponents/Buttons/StandardButton.vue'
import CarrierSelection from '@/components/Main/Admin/CarrierContact/CarrierSelection.vue'
import LoadingSpinner from '@/components/UIComponents/Utilities/LoadingSpinner.vue'

export default {
  name: 'NewUserForm',
  components: {
    InputLabel,
    TextTextfield,
    PhoneTextfield,
    NumberTextfield,
    EmailTextfield,
    StandardButton,
    CarrierSelection,
    LoadingSpinner
  },
  props: {
    isLoading: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  setup(_, context) {
    // initialize refs
    const allInputsValidated = ref(false)
    const carrierIsLoading = ref(false)
    // Inputs
    const carrierContactInput = reactive({
      name: {
        value: '',
        isValid: false
      },
      familyName: {
        value: '',
        isValid: false
      },
      phone: {
        value: '',
        isValid: false
      },
      email: {
        value: '',
        isValid: false
      },
      carrier: {
        value: null,
        isValid: false
      }
    })

    // Initialize the store
    const store = useStore()

    // initialize route
    const route = useRoute()

    // Declaration of functions to set user inputs
    // name
    function setName(name) {
      carrierContactInput.name.value = name
    }
    function setNameValidation(isValid) {
      carrierContactInput.name.isValid = isValid
    }
    // family name
    function setFamilyName(familyname) {
      carrierContactInput.familyName.value = familyname
    }
    function setFamilyNameValidation(isValid) {
      carrierContactInput.familyName.isValid = isValid
    }
    // phone
    function setPhone(phone) {
      carrierContactInput.phone.value = phone
    }
    function setPhoneValidation(isValid) {
      carrierContactInput.phone.isValid = isValid
    }
    // email
    function setEmail(email) {
      carrierContactInput.email.value = email
    }
    function setEmailValidation(isValid) {
      carrierContactInput.email.isValid = isValid
    }
    // carrier
    function setCarrier(carrier) {
      carrierContactInput.carrier.value = carrier
      setCarrierValidation()
    }
    function setCarrierValidation() {
      carrierContactInput.carrier.isValid = true
    }

    // Check if the inputs are validated
    function validateInputs() {
      var valid = true
      const ignoreList = ['phone', 'email', 'carrier']

      for (const entry of Object.keys(carrierContactInput)) {
        // check if vaidation is false if key is no in ignore list
        if (
          !carrierContactInput[entry].isValid &&
          ignoreList.indexOf(entry) < 0
        ) {
          valid = false
        }
      }
      allInputsValidated.value = valid
    }

    // load initial carrier if id is provided in route query
    async function setInitialCarrier() {
      try {
        // set loading state
        carrierIsLoading.value = true
        // get carrier id from route
        const carrierID = route.query.carrierID
        if (carrierID) {
          const resp = await store.dispatch('fetchCarrierDetails', { sub: carrierID })
          setCarrier(resp)
        }
      } catch (error) {
        console.log(error)
      } finally {
        // reset loading state
        carrierIsLoading.value = false
      }
    }

    // Submit the form
    function submitForm() {
      context.emit('submit-inputs', carrierContactInput)
    }

    // watch for updates of user location checklist object
    watch(
      () => [carrierContactInput],
      () => {
        validateInputs()
      },
      { deep: true }
    )

    // check for carrier id on load
    onMounted(async () => {
      await setInitialCarrier()
    })

    return {
      carrierContactInput,
      allInputsValidated,
      carrierIsLoading,
      setName,
      setNameValidation,
      setPhone,
      setPhoneValidation,
      setEmail,
      setEmailValidation,
      setFamilyName,
      setFamilyNameValidation,
      submitForm,
      setCarrier
    }
  }
}
</script>
