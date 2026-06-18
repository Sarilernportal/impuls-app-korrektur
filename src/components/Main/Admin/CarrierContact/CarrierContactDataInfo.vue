<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
07.12.2022

Scope:
Carrier Contact Data Info View
-->
<template>
  <div>
    <dl class="divide-y divide-slate-200">
      <!-- Name property -->
      <editable-user-info-text-row
        title="Name"
        propertyKey="name"
        :isLoading="contactNameIsLoading"
        :value="name"
        buttonTitle="Updaten"
        @change-submit="changeSubmitted"
      />
      <!-- Familyname property -->
      <editable-user-info-text-row
        title="Nachname"
        propertyKey="familyName"
        :isLoading="contactFamilyNameIsLoading"
        :value="familyName"
        buttonTitle="Updaten"
        @change-submit="changeSubmitted"
      />
      <!-- Phone Number property -->
      <editable-user-info-phone-row
        title="Telefonnummer"
        propertyKey="phone"
        :isLoading="contactPhoneIsLoading"
        :value="phoneNumber"
        buttonTitle="Updaten"
        @change-submit="changeSubmitted"
      />
      <!-- Email property -->
      <editable-user-info-email-row
        title="Email"
        propertyKey="email"
        :isLoading="contactEmailIsLoading"
        :value="email"
        buttonTitle="Updaten"
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

export default {
  name: 'UserDetailDataInfo',
  emits: ['change-submit'],
  props: {
    carrierContact: {
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
    EditableUserInfoPhoneRow
  },
  setup(props, ctx) {
    // Get the name for the selected carrier contact
    const name = computed(() => {
      try {
        // Find the name attribute
        const nameAttribute = props.carrierContact.name
        // If not catch it with an default value
        return nameAttribute ? nameAttribute : 'Nicht angegeben'
      } catch (error) {
        return 'Nicht angegeben'
      }
    })

    // Get the family name for the selected carrier contact
    const familyName = computed(() => {
      try {
        // Find the family name attribute
        const FamilyNameAttribute = props.carrierContact.familyName

        // If not catch it with an default value
        return FamilyNameAttribute ? FamilyNameAttribute : 'Nicht angegeben'
      } catch (error) {
        return 'Nicht angegeben'
      }
    })

    // Get the phone number for the selected carrier contact
    const phoneNumber = computed(() => {
      try {
        // Find the phone number attribute
        const phoneAttribute = props.carrierContact.phone

        // If not catch it with an default value
        return phoneAttribute ? phoneAttribute : 'Nicht angegeben'
      } catch (error) {
        return 'Nicht angegeben'
      }
    })

    // Get the email for the selected carrier contact
    const email = computed(() => {
      try {
        // Find the email number attribute
        const emailAttribute = props.carrierContact.email

        // If not catch it with an default value
        return emailAttribute ? emailAttribute : 'Nicht angegeben'
      } catch (error) {
        return 'Nicht angegeben'
      }
    })

    // Get the loading status for the name attribute
    const contactNameIsLoading = computed(() => {
      if (props.isLoading.property === 'name' && props.isLoading.isLoading) {
        return true
      }
      return false
    })

    // Get the loading status for the family name attribute
    const contactFamilyNameIsLoading = computed(() => {
      if (
        props.isLoading.property === 'familyName' &&
        props.isLoading.isLoading
      ) {
        return true
      }
      return false
    })

    // Get the loading status for the phone number attribute
    const contactPhoneIsLoading = computed(() => {
      if (props.isLoading.property === 'phone' && props.isLoading.isLoading) {
        return true
      }
      return false
    })

    // Get the loading status for the email attribute
    const contactEmailIsLoading = computed(() => {
      if (props.isLoading.property === 'email' && props.isLoading.isLoading) {
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
      contactNameIsLoading,
      phoneNumber,
      contactPhoneIsLoading,
      familyName,
      contactFamilyNameIsLoading,
      email,
      contactEmailIsLoading,
      changeSubmitted
    }
  }
}
</script>
