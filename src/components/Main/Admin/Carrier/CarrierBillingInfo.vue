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
    <dl class="divide-y divide-slate-200">
      <!-- Enable/Disbale carrier auto invoice mail setting-->
      <switchable-info
        title="Abweichende Rechnungsadresse verwenden"
        propertyKey="useBillingAddress"
        :isActive="useBillingAddress"
        :value="useBillingAddress ? 'Ja' : 'Nein'"
        @button-toggled="changeSubmitted"
        :isLoading="useBillingAddressIsLoading"
      />
      <!-- street property -->
      <editable-user-info-text-row
        title="Alternativer Name"
        propertyKey="billingName"
        :isLoading="billingNameIsLoading"
        :value="billingName"
        buttonTitle="Updaten"
        placeholder="Nicht angegeben"
        @change-submit="changeSubmitted"
      />
      <!-- street property -->
      <editable-user-info-text-row
        title="Straße"
        propertyKey="billingStreet"
        :isLoading="billingStreetIsLoading"
        :value="billingStreet"
        buttonTitle="Updaten"
        placeholder="Nicht angegeben"
        @change-submit="changeSubmitted"
      />
      <!-- house number property -->
      <editable-user-info-text-row
        title="Hausnummer"
        propertyKey="billingHouseNumber"
        :isLoading="billingHouseNumberIsLoading"
        :value="billingHouseNumber"
        buttonTitle="Updaten"
        placeholder="Nicht angegeben"
        @change-submit="changeSubmitted"
      />
      <!-- address extra property -->
      <editable-user-info-text-row
        title="Adresszusatz"
        propertyKey="billingAddressExtra"
        :isLoading="billingAddressExtraIsLoading"
        :value="billingAddressExtra"
        buttonTitle="Updaten"
        placeholder="Nicht angegeben"
        @change-submit="changeSubmitted"
      />
      <!-- postal code property -->
      <editable-user-info-text-row
        title="PLZ"
        propertyKey="billingPostalCode"
        :isLoading="billingPostalCodeIsLoading"
        :value="billingPostalCode"
        buttonTitle="Updaten"
        placeholder="Nicht angegeben"
        @change-submit="changeSubmitted"
      />
      <!-- city property -->
      <editable-user-info-text-row
        title="Stadt"
        propertyKey="billingCity"
        :isLoading="billingCityIsLoading"
        :value="billingCity"
        buttonTitle="Updaten"
        placeholder="Nicht angegeben"
        @change-submit="changeSubmitted"
      />

      <!-- po box property -->
      <editable-user-info-text-row
        title="Postfach"
        propertyKey="billingPoBox"
        :isLoading="billingPoBoxIsLoading"
        :value="billingPoBox"
        buttonTitle="Updaten"
        placeholder="Nicht angegeben"
        @change-submit="changeSubmitted"
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
    // Get the street for the selected carrier
    const billingName = computed(() => {
      // Find the phone number attribute
      const nameAttribute = props.carrier.billingName

      // If the street is set, grab the value to return it
      // If not catch it with an default value
      return nameAttribute ? nameAttribute : ''
    })
    // Get the street for the selected carrier
    const billingStreet = computed(() => {
      // Find the phone number attribute
      const streetAttribute = props.carrier.billingStreet

      // If the street is set, grab the value to return it
      // If not catch it with an default value
      return streetAttribute ? streetAttribute : ''
    })

    // Get the houseNumber for the selected carrier
    const billingHouseNumber = computed(() => {
      // Find the phone number attribute
      const houseNumberAttribute = props.carrier.billingHouseNumber

      // If the houseNumber is set, grab the value to return it
      // If not catch it with an default value
      return houseNumberAttribute ? houseNumberAttribute : ''
    })

    // Get the addressExtra for the selected carrier
    const billingAddressExtra = computed(() => {
      // Find the phone number attribute
      const addressExtraAttribute = props.carrier.billingAddressExtra

      // If the addressExtra is set, grab the value to return it
      // If not catch it with an default value
      return addressExtraAttribute ? addressExtraAttribute : ''
    })

    // Get the postalCode for the selected carrier
    const billingPostalCode = computed(() => {
      // Find the phone number attribute
      const postalCodeAttribute = props.carrier.billingPostalCode

      // If the postalCode is set, grab the value to return it
      // If not catch it with an default value
      return postalCodeAttribute ? postalCodeAttribute : ''
    })

    // Get the city for the selected carrier
    const billingCity = computed(() => {
      // Find the phone number attribute
      const cityAttribute = props.carrier.billingCity

      // If the city is set, grab the value to return it
      // If not catch it with an default value
      return cityAttribute ? cityAttribute : ''
    })

    // Get the city for the selected carrier
    const billingPoBox = computed(() => {
      const poBoxAttribute = props.carrier.billingPoBox
      return poBoxAttribute ? poBoxAttribute : ''
    })

    // Get the useBillingAddress for the selected carrier
    const useBillingAddress = computed(() => {
      // Find the useBillingAddress attribute
      const useBillingAddressAttribute = props.carrier.useBillingAddress

      // check if provided, if not return false
      if (useBillingAddressAttribute === null) {
        return false
      }

      // If not catch it with an default value
      return useBillingAddressAttribute
    })

    
    // Get the loading status for the street attribute
    const billingNameIsLoading = computed(() => {
      if (props.isLoading.property === 'billingName' && props.isLoading.isLoading) {
        return true
      }
      return false
    })

    // Get the loading status for the street attribute
    const billingStreetIsLoading = computed(() => {
      if (props.isLoading.property === 'billingStreet' && props.isLoading.isLoading) {
        return true
      }
      return false
    })

    // Get the loading status for the houseNumber attribute
    const billingHouseNumberIsLoading = computed(() => {
      if (
        props.isLoading.property === 'billingHouseNumber' &&
        props.isLoading.isLoading
      ) {
        return true
      }
      return false
    })

    // Get the loading status for the addressExtra attribute
    const billingAddressExtraIsLoading = computed(() => {
      if (
        props.isLoading.property === 'billingAddressExtra' &&
        props.isLoading.isLoading
      ) {
        return true
      }
      return false
    })

    // Get the loading status for the postalCode attribute
    const billingPostalCodeIsLoading = computed(() => {
      if (
        props.isLoading.property === 'billingPostalCode' &&
        props.isLoading.isLoading
      ) {
        return true
      }
      return false
    })

    // Get the loading status for the city attribute
    const billingCityIsLoading = computed(() => {
      if (props.isLoading.property === 'billingCity' && props.isLoading.isLoading) {
        return true
      }
      return false
    })

    const billingPoBoxIsLoading = computed(() => {
      if (props.isLoading.property === 'billingPoBox' && props.isLoading.isLoading) {
        return true
      }
      return false
    })

    // Get the loading status für useBillingAddress attribute
    const useBillingAddressIsLoading = computed(() => {
      if (props.isLoading.property === 'useBillingAddress' && props.isLoading.isLoading) {
        return true
      }
      return false
    })

    // Gets called, whenever an carrier attribute is changed by the admin
    function changeSubmitted(changeObject) {
      console.log(changeObject)
      ctx.emit('change-submit', changeObject)
    }

    // Return the setup object
    return {
      billingName,
      billingNameIsLoading,
      billingStreet,
      billingStreetIsLoading,
      billingHouseNumber,
      billingHouseNumberIsLoading,
      billingAddressExtra,
      billingAddressExtraIsLoading,
      billingPostalCode,
      billingPostalCodeIsLoading,
      billingCity,
      billingCityIsLoading,
      billingPoBox,
      billingPoBoxIsLoading,
      useBillingAddress,
      useBillingAddressIsLoading,
      changeSubmitted
    }
  }
}
</script>
