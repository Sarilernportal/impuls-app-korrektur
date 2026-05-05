<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
19.09.2022

Scope:
User Detail Data Info View
-->
<template>
  <div>
    <dl class="divide-y divide-gray-800">
      <!-- Name property -->
      <editable-user-info-text-row
        title="Name"
        propertyKey="name"
        :isLoading="nameIsLoading"
        :value="name"
        placeholder="Nicht angegeben"
        buttonTitle="Updaten"
        @change-submit="changeSubmitted"
      />
      <!-- Short-Name property -->
      <editable-user-info-text-row
        title="Abkürzung"
        propertyKey="shortName"
        :isLoading="shortNameIsLoading"
        :value="shortName"
        placeholder="Nicht angegeben"
        buttonTitle="Updaten"
        @change-submit="changeSubmitted"
      />
      <!-- Phone Number property -->
      <editable-user-info-phone-row
        title="Telefonnummer"
        propertyKey="phone"
        :isLoading="phoneNumberIsLoading"
        :value="phoneNumber"
        buttonTitle="Updaten"
        placeholder="Nicht angegeben"
        @change-submit="changeSubmitted"
      />
      <!-- Email property -->
      <editable-user-info-email-row
        title="Email"
        propertyKey="email"
        :isLoading="emailIsLoading"
        :value="email"
        buttonTitle="Updaten"
        placeholder="Nicht angegeben"
        @change-submit="changeSubmitted"
      />
      <!-- street property -->
      <editable-user-info-text-row
        title="Straße"
        propertyKey="street"
        :isLoading="streetIsLoading"
        :value="street"
        buttonTitle="Updaten"
        placeholder="Nicht angegeben"
        @change-submit="changeSubmitted"
      />
      <!-- house number property -->
      <editable-user-info-text-row
        title="Hausnummer"
        propertyKey="houseNumber"
        :isLoading="houseNumberIsLoading"
        :value="houseNumber"
        buttonTitle="Updaten"
        placeholder="Nicht angegeben"
        @change-submit="changeSubmitted"
      />
      <!-- address extra property -->
      <editable-user-info-text-row
        title="Adresszusatz"
        propertyKey="addressExtra"
        :isLoading="addressExtraIsLoading"
        :value="addressExtra"
        buttonTitle="Updaten"
        placeholder="Nicht angegeben"
        @change-submit="changeSubmitted"
      />
      <!-- postal code property -->
      <editable-user-info-text-row
        title="PLZ"
        propertyKey="postalCode"
        :isLoading="postalCodeIsLoading"
        :value="postalCode"
        buttonTitle="Updaten"
        placeholder="Nicht angegeben"
        @change-submit="changeSubmitted"
      />
      <!-- city property -->
      <editable-user-info-text-row
        title="Stadt"
        propertyKey="city"
        :isLoading="cityIsLoading"
        :value="city"
        buttonTitle="Updaten"
        placeholder="Nicht angegeben"
        @change-submit="changeSubmitted"
      />
      <!-- po box property -->
      <editable-user-info-text-row
        title="Postfach"
        propertyKey="poBox"
        :isLoading="poBoxIsLoading"
        :value="poBox"
        buttonTitle="Updaten"
        placeholder="Nicht angegeben"
        @change-submit="changeSubmitted"
      />
      <!-- Enable/Disbale carrier auto invoice mail setting-->
      <switchable-info
        title="Automatische Rechnung"
        propertyKey="allowAutoInvoice"
        :isActive="allowAutoInvoice"
        :value="allowAutoInvoice ? 'Zugelassen' : 'Verweigert'"
        @button-toggled="changeSubmitted"
        :isLoading="allowAutoInvoiceIsLoading"
      />
    </dl>
  </div>
</template>

<script>
// Vue imports
import { computed } from 'vue'
// Component imports
import UserInfoRow from '@/components/Main/Admin/User/UserInfoRow.vue'
import EditableUserInfoTextRow from '@/components/Main/Admin/User/EditableUserInfoTextRow.vue'
import EditableUserInfoEmailRow from '@/components/Main/Admin/User/EditableUserInfoEmailRow.vue'
import EditableUserInfoPhoneRow from '@/components/Main/Admin/User/EditableUserInfoPhoneRow.vue'
import SwitchableInfo from '@/components/UIComponents/Selections/SwitchableInfo.vue'

export default {
  name: 'UserDetailDataInfo',
  emits: ['change-submit'],
  props: {
    carrier: {
      type: Object,
      required: true
    },
    isLoading: {
      type: Object,
      required: true
    }
  },
  components: {
    UserInfoRow,
    EditableUserInfoTextRow,
    EditableUserInfoEmailRow,
    EditableUserInfoPhoneRow,
    SwitchableInfo
  },
  setup(props, ctx) {
    // Get the name for the selected carrier
    const name = computed(() => {
      // Find the name attribute
      const nameAttribute = props.carrier.name

      // If the attribute is set, grab the value to return it
      if (nameAttribute) {
        const name = nameAttribute
        return name
      }
      // If not catch it with an default value
      return ''
    })

    // Get the short name for the selected carrier
    const shortName = computed(() => {
      try {
        return props.carrier.shortName ? props.carrier.shortName : ''
      } catch (error) {
        console.log(error)
        // fallback
        return ''
      }
    })

    // Get the phone number for the selected carrier
    const phoneNumber = computed(() => {
      // Find the phone number attribute
      const phoneAttribute = props.carrier.phone

      // If the phone number is set, grab the value to return it
      // If not catch it with an default value
      return phoneAttribute ? phoneAttribute : ''
    })

    // Get the phone number for the selected carrier
    const email = computed(() => {
      // Find the phone number attribute
      const emailAttribute = props.carrier.email

      // If the phone number is set, grab the value to return it
      // If not catch it with an default value
      return emailAttribute ? emailAttribute : ''
    })

    // Get the street for the selected carrier
    const street = computed(() => {
      // Find the phone number attribute
      const streetAttribute = props.carrier.street

      // If the street is set, grab the value to return it
      // If not catch it with an default value
      return streetAttribute ? streetAttribute : ''
    })

    // Get the houseNumber for the selected carrier
    const houseNumber = computed(() => {
      // Find the phone number attribute
      const houseNumberAttribute = props.carrier.houseNumber

      // If the houseNumber is set, grab the value to return it
      // If not catch it with an default value
      return houseNumberAttribute ? houseNumberAttribute : ''
    })

    // Get the addressExtra for the selected carrier
    const addressExtra = computed(() => {
      // Find the phone number attribute
      const addressExtraAttribute = props.carrier.addressExtra

      // If the addressExtra is set, grab the value to return it
      // If not catch it with an default value
      return addressExtraAttribute ? addressExtraAttribute : ''
    })

    // Get the postalCode for the selected carrier
    const postalCode = computed(() => {
      // Find the phone number attribute
      const postalCodeAttribute = props.carrier.postalCode

      // If the postalCode is set, grab the value to return it
      // If not catch it with an default value
      return postalCodeAttribute ? postalCodeAttribute : ''
    })

    // Get the city for the selected carrier
    const city = computed(() => {
      // Find the phone number attribute
      const cityAttribute = props.carrier.city

      // If the city is set, grab the value to return it
      // If not catch it with an default value
      return cityAttribute ? cityAttribute : ''
    })

    // Get the city for the selected carrier
    const poBox = computed(() => {
      // Find the phone number attribute
      const poBoxAttribute = props.carrier.poBox

      // If the city is set, grab the value to return it
      // If not catch it with an default value
      return poBoxAttribute ? poBoxAttribute : ''
    })

    // Get the allowAutoInvoice for the selected carrier
    const allowAutoInvoice = computed(() => {
      // Find the allowAutoInvoice attribute
      const allowAutoInvoiceAttribute = props.carrier.allowAutoInvoice

      // check if provided, if not return false
      if (allowAutoInvoiceAttribute === null) {
        return false
      }

      // If not catch it with an default value
      return allowAutoInvoiceAttribute
    })

    // Get the loading status for the phone number attribute
    const phoneNumberIsLoading = computed(() => {
      if (props.isLoading.property === 'phone' && props.isLoading.isLoading) {
        return true
      }
      return false
    })

    // Get the loading status for the phone number attribute
    const emailIsLoading = computed(() => {
      if (props.isLoading.property === 'email' && props.isLoading.isLoading) {
        return true
      }
      return false
    })

    // Get the loading status for the name attribute
    const nameIsLoading = computed(() => {
      if (props.isLoading.property === 'name' && props.isLoading.isLoading) {
        return true
      }
      return false
    })

    // Get the loading status for the short name attribute
    const shortNameIsLoading = computed(() => {
      if (props.isLoading.property === 'shortName' && props.isLoading.isLoading) {
        return true
      }
      return false
    })

    // Get the loading status for the street attribute
    const streetIsLoading = computed(() => {
      if (props.isLoading.property === 'street' && props.isLoading.isLoading) {
        return true
      }
      return false
    })

    // Get the loading status for the houseNumber attribute
    const houseNumberIsLoading = computed(() => {
      if (
        props.isLoading.property === 'houseNumber' &&
        props.isLoading.isLoading
      ) {
        return true
      }
      return false
    })

    // Get the loading status for the addressExtra attribute
    const addressExtraIsLoading = computed(() => {
      if (
        props.isLoading.property === 'addressExtra' &&
        props.isLoading.isLoading
      ) {
        return true
      }
      return false
    })

    // Get the loading status for the postalCode attribute
    const postalCodeIsLoading = computed(() => {
      if (
        props.isLoading.property === 'postalCode' &&
        props.isLoading.isLoading
      ) {
        return true
      }
      return false
    })

    // Get the loading status for the city attribute
    const cityIsLoading = computed(() => {
      if (props.isLoading.property === 'city' && props.isLoading.isLoading) {
        return true
      }
      return false
    })

    // Get the loading status for the city attribute
    const poBoxIsLoading = computed(() => {
      if (props.isLoading.property === 'poBox' && props.isLoading.isLoading) {
        return true
      }
      return false
    })

    // Get the loading status for the allowAutoInvoice attribute
    const allowAutoInvoiceIsLoading = computed(() => {
      if (props.isLoading.property === 'allowAutoInvoice' && props.isLoading.isLoading) {
        return true
      }
      return false
    })

    // Gets called, whenever an carrier attribute is changed by the admin
    function changeSubmitted(changeObject) {
      ctx.emit('change-submit', changeObject)
    }

    // Return the setup object
    return {
      name,
      nameIsLoading,
      shortName,
      shortNameIsLoading,
      phoneNumber,
      phoneNumberIsLoading,
      email,
      emailIsLoading,
      street,
      streetIsLoading,
      houseNumber,
      houseNumberIsLoading,
      addressExtra,
      addressExtraIsLoading,
      postalCode,
      postalCodeIsLoading,
      city,
      cityIsLoading,
      poBox,
      poBoxIsLoading,
      allowAutoInvoice,
      allowAutoInvoiceIsLoading,
      changeSubmitted
    }
  }
}
</script>
