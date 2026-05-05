<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
26.09.2022

Scope:
New carrier form
-->

<template>
  <!-- Main Container -->
  <div class="w-full flex items-center justify-center">
    <!-- Form Container -->
    <form
      class="mt-5 flex w-full flex-col items-center justify-center gap-5 px-0 sm:px-4"
      @submit.prevent="submitForm"
    >
      <!-- carrier info container -->
      <div class="flex w-full">
        <div class="space-y-1">
          <h3 class="text-lg leading-6 font-medium text-primaryText">
            Informationen
          </h3>
          <p class="max-w-2xl text-sm text-secondaryText">
            Daten der Trägerinstitution.
          </p>
        </div>
      </div>
      <!-- First input row container
        contains:
          Name Label + Textfield
          Phone Label + Textfield
       -->
      <div class="flex flex-col md:flex-row w-full justify-between gap-4 md:gap-6">
        <!-- name Label + Textfield -->
        <div class="w-full md:w-1/2">
          <input-label
            elementID="name"
            labelText="Name*"
          />
          <text-textfield
            elementID="name"
            name="name"
            placeholder="Träger"
            @input-value="setName"
            @is-valid="setNameValidation"
          />
        </div>
        <!-- street Label + Textfield -->
        <div class="w-full md:w-1/2">
          <input-label
            elementID="street"
            labelText="Straße*"
          />
          <text-textfield
            elementID="street"
            name="street"
            placeholder="Straße"
            @input-value="setStreet"
            @is-valid="setStreetValidation"
          />
        </div>
      </div>
      <!-- Second input row container -->
      <div class="flex flex-col md:flex-row w-full justify-between gap-4 md:gap-6">
        <!-- addressExtra Label + Textfield -->
        <div class="w-full md:w-1/2 pr-0">
          <input-label
            elementID="addressExtra"
            labelText="Adresszusatz"
          />
          <text-textfield
            elementID="addressExtra"
            name="addressExtra"
            placeholder="1A"
            @input-value="setAddressExtra"
            @is-valid="setAddressExtraValidation"
          />
        </div>
        <!-- housenumber Label + Textfield -->
        <div class="w-full md:w-1/2">
          <input-label
            elementID="housenumber"
            labelText="Hausnumer*"
          />
          <text-textfield
            elementID="housenumber"
            name="housenumber"
            placeholder="1A"
            @input-value="setHousenumber"
            @is-valid="setHousenumberValidation"
          />
        </div>
      </div>
      <!-- Third input row container -->
      <div class="flex flex-col md:flex-row w-full justify-between gap-4 md:gap-6">
        <!-- postalcode Label + Textfield -->
        <div class="w-full md:w-1/2">
          <input-label
            elementID="postalcode"
            labelText="PLZ*"
          />
          <number-textfield
            elementID="postalcode"
            name="postalcode"
            placeholder="12345"
            @input-value="setPostalcode"
            @is-valid="setPostalcodeValidation"
          />
        </div>
        <!-- city Label + Textfield -->
        <div class="w-full md:w-1/2">
          <input-label
            elementID="city"
            labelText="Stadt*"
          />
          <text-textfield
            elementID="city"
            name="city"
            placeholder="Groß-Gerau"
            @input-value="setCity"
            @is-valid="setCityValidation"
          />
        </div>
      </div>
  
      <div class="flex flex-col md:flex-row w-full justify-between gap-4 md:gap-6">
        <div class="w-full md:w-1/2">
          <input-label
            elementID="poBox"
            labelText="Postfach"
          />
          <number-textfield
            elementID="poBox"
            name="poBox"
            placeholder="12345"
            @input-value="setPoBox"
          />
        </div>
      </div>
      <!-- Fourth input row container -->
      <div class="flex flex-col md:flex-row w-full justify-between gap-4 md:gap-6">
        <!-- Phone Label + Textfield -->
        <div class="w-full md:w-1/2">
          <input-label
            elementID="phone"
            labelText="Telefonnummer"
          />
          <phone-textfield
            elementID="phone"
            name="phone"
            placeholder="176123456789"
            @input-value="setPhone"
            @is-valid="setPhoneValidation"
          />
        </div>
        <!-- Email Label + Textfield -->
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
      <!-- carrier billing info container -->
      <div class="flex w-full">
        <div class="space-y-1">
          <h3 class="text-lg leading-6 font-medium text-primaryText">
            Rechnungsadresse
          </h3>
          <p class="max-w-2xl text-sm text-secondaryText">
            Rechnungsadresse der Trägerinstitution.
          </p>
        </div>
      </div>
      <div class="flex flex-col md:flex-row w-full justify-between gap-4 md:gap-6">
        <!-- Billing street Label + Textfield -->
        <div class="w-full md:w-1/2">
          <input-label
            elementID="billingName"
            labelText="Name"
          />
          <text-textfield
            elementID="billingName"
            name="billingName"
            placeholder="Alternativer Name"
            @input-value="setBillingName"
          />
        </div>
      </div>
      <!-- First input row container -->
      <div class="flex flex-col md:flex-row w-full justify-between gap-4 md:gap-6">
        <!-- Billing street Label + Textfield -->
        <div class="w-full md:w-1/2">
          <input-label
            elementID="billingStreet"
            labelText="Straße"
          />
          <text-textfield
            elementID="billingStreet"
            name="billingStreet"
            placeholder="Straße"
            @input-value="setBillingStreet"
          />
        </div>
        <!-- Billing addressExtra Label + Textfield -->
        <div class="w-full md:w-1/2 pr-0">
          <input-label
            elementID="billingAddressExtra"
            labelText="Adresszusatz"
          />
          <text-textfield
            elementID="billingAddressExtra"
            name="billingAddressExtra"
            placeholder="1A"
            @input-value="setBillingAddressExtra"
          />
        </div>
      </div>
      <!-- Second input row container -->
      <div class="flex flex-col md:flex-row w-full justify-between gap-4 md:gap-6">
        <!-- Billing housenumber Label + Textfield -->
        <div class="w-full md:w-1/2">
          <input-label
            elementID="billingHousenumber"
            labelText="Hausnumer"
          />
          <text-textfield
            elementID="billingHousenumber"
            name="billingHousenumber"
            placeholder="1A"
            @input-value="setBillingHousenumber"
          />
        </div>
        <!-- Billing postalcode Label + Textfield -->
        <div class="w-full md:w-1/2">
          <input-label
            elementID="billingPostalcode"
            labelText="PLZ"
          />
          <number-textfield
            elementID="billingPostalcode"
            name="billingPostalcode"
            placeholder="12345"
            @input-value="setBillingPostalcode"
          />
        </div>
      </div>
      <!-- Third input row container -->
      <div class="flex flex-col md:flex-row w-full justify-between gap-4 md:gap-6">
        <!-- Billing city Label + Textfield -->
        <div class="w-full md:w-1/2 pr-0 md:pr-4">
          <input-label
            elementID="billingCity"
            labelText="Stadt"
          />
          <text-textfield
            elementID="billingCity"
            name="billingCity"
            placeholder="Groß-Gerau"
            @input-value="setBillingCity"
          />
        </div>

        <div class="w-full md:w-1/2 pr-0 md:pr-4">
          <input-label
            elementID="billingPoBox"
            labelText="Postfach"
          />
          <text-textfield
            elementID="billingPoBox"
            name="billingPoBox"
            placeholder="12345"
            @input-value="setBillingPoBox"
          />
        </div>
      </div>
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
import { ref, reactive, watch } from 'vue'
// Component imports
import InputLabel from '@/components/UIComponents/Labels/InputLabel.vue'
import TextTextfield from '@/components/UIComponents/Inputs/TextTextfield.vue'
import PhoneTextfield from '@/components/UIComponents/Inputs/PhoneTextfield.vue'
import NumberTextfield from '@/components/UIComponents/Inputs/NumberTextfield.vue'
import EmailTextfield from '@/components/UIComponents/Inputs/EmailTextfield.vue'
import StandardButton from '@/components/UIComponents/Buttons/StandardButton.vue'

export default {
  name: 'NewUserForm',
  components: {
    InputLabel,
    TextTextfield,
    PhoneTextfield,
    NumberTextfield,
    EmailTextfield,
    StandardButton
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
    // Inputs
    const carrierInput = reactive({
      name: {
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
      street: {
        value: '',
        isValid: false
      },
      houseNumber: {
        value: '',
        isValid: false
      },
      addressExtra: {
        value: '',
        isValid: false
      },
      postalCode: {
        value: '',
        isValid: false
      },
      city: {
        value: '',
        isValid: false
      },
      poBox: {
        value: '',
        isValid: true
      },
      billingName: {
        value: '',
        isValid: true
      },
      billingStreet: {
        value: null,
        isValid: true
      },
      billingHouseNumber: {
        value: null,
        isValid: true
      },
      billingAddressExtra: {
        value: null,
        isValid: true
      },
      billingPostalCode: {
        value: null,
        isValid: true
      },
      billingCity: {
        value: null,
        isValid: true
      },
      billingPoBox: {
        value: null,
        isValid: true
      }
    })

    // Declaration of functions to set user inputs
    // name
    function setName(name) {
      carrierInput.name.value = name
    }
    function setNameValidation(isValid) {
      carrierInput.name.isValid = isValid
    }
    // phone
    function setPhone(phone) {
      carrierInput.phone.value = phone
    }
    function setPhoneValidation(isValid) {
      carrierInput.phone.isValid = isValid
    }
    // email
    function setEmail(email) {
      carrierInput.email.value = email
    }
    function setEmailValidation(isValid) {
      carrierInput.email.isValid = email
    }
    // street
    function setStreet(street) {
      carrierInput.street.value = street
    }
    function setStreetValidation(isValid) {
      carrierInput.street.isValid = isValid
    }
    // housenumber
    function setHousenumber(number) {
      carrierInput.houseNumber.value = number
    }
    function setHousenumberValidation(isValid) {
      carrierInput.houseNumber.isValid = isValid
    }
    // address extra
    function setAddressExtra(address) {
      carrierInput.addressExtra.value = address
    }
    function setAddressExtraValidation(isValid) {
      carrierInput.addressExtra.isValid = isValid
    }
    // postal code
    function setPostalcode(postalc) {
      carrierInput.postalCode.value = postalc
    }
    function setPostalcodeValidation(isValid) {
      carrierInput.postalCode.isValid = isValid
    }
    // city
    function setCity(city) {
      carrierInput.city.value = city
    }
    function setCityValidation(isValid) {
      carrierInput.city.isValid = isValid
    }

    function setPoBox(poBox) {
      carrierInput.poBox.value = poBox
    }

    // billing info setters
    // billing name
    function setBillingName(name) {
      carrierInput.billingName.value = name
    }
    // billing street
    function setBillingStreet(street) {
      carrierInput.billingStreet.value = street
    }
    // billing housenumber
    function setBillingHousenumber(number) {
      carrierInput.billingHouseNumber.value = number
    }
    // billing address extra
    function setBillingAddressExtra(address) {
      carrierInput.billingAddressExtra.value = address
    }
    // billing postal code
    function setBillingPostalcode(postalc) {
      carrierInput.billingPostalCode.value = postalc
    }
    // billing city
    function setBillingCity(city) {
      carrierInput.billingCity.value = city
    }

    // billing po box
    function setBillingPoBox(poBox) {
      carrierInput.billingPoBox.value = poBox
    }

    // Check if the inputs are validated
    function validateInputs() {
      var valid = true
      const ignoreList = ['phone', 'email', 'addressExtra']

      for (const entry of Object.keys(carrierInput)) {
        // check if vaidation is false if key is no in ignore list
        if (!carrierInput[entry].isValid && ignoreList.indexOf(entry) < 0) {
          valid = false
        }
      }
      allInputsValidated.value = valid
    }

    // Submit the form
    function submitForm() {
      context.emit('submit-inputs', carrierInput)
    }

    // watch for updates of user location checklist object
    watch(
      () => [carrierInput],
      () => {
        validateInputs()
      },
      { deep: true }
    )

    return {
      allInputsValidated,
      setName,
      setNameValidation,
      setPhone,
      setPhoneValidation,
      setEmail,
      setEmailValidation,
      setStreet,
      setStreetValidation,
      setHousenumber,
      setHousenumberValidation,
      setAddressExtra,
      setAddressExtraValidation,
      setPostalcode,
      setPostalcodeValidation,
      setPhoneValidation,
      setCity,
      setPoBox,
      setCityValidation,
      setBillingName,
      setBillingStreet,
      setBillingHousenumber,
      setBillingAddressExtra,
      setBillingPostalcode,
      setBillingCity,
      setBillingPoBox,
      submitForm
    }
  }
}
</script>
