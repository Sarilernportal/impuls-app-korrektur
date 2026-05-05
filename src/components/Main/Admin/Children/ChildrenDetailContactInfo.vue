<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
28.02.2023

Scope:
Parent Info View
-->
<template>
  <div>
    <dl class="divide-y divide-gray-800">
      <!-- Name property -->
      <editable-user-info-text-row
        title="Vorname"
        propertyKey="name"
        :isLoading="parentNameIsLoading"
        :value="name"
        buttonTitle="Updaten"
        placeholder="Nicht angegeben"
        @change-submit="changeSubmitted"
      />
      <!-- Familyname property -->
      <editable-user-info-text-row
        title="Nachname"
        propertyKey="familyName"
        :isLoading="parentFamilyNameIsLoading"
        :value="familyName"
        buttonTitle="Updaten"
        placeholder="Nicht angegeben"
        @change-submit="changeSubmitted"
      />

      <dropdown-user-info-row
        v-if="contactType ==='schoolContact'"
        title="Geschlecht" 
        :possibilities="genderOptions"
        @change-property="genderChanged"
        :isLoading="genderIsLoading" />

      <!-- Phone Number property -->
      <editable-user-info-phone-row
        title="Telefonnummer"
        propertyKey="phone"
        :isLoading="parentPhoneIsLoading"
        :value="phoneNumber"
        buttonTitle="Updaten"
        placeholder="Nicht angegeben"
        @change-submit="changeSubmitted"
      />
      <!-- Email property -->
      <editable-user-info-email-row
        title="Email"
        propertyKey="email"
        :isLoading="parentEmailIsLoading"
        :value="email"
        placeholder="Nicht angegeben"
        buttonTitle="Updaten"
        @change-submit="changeSubmitted"
      />

      <switchable-info
        title="Primäre Ansprechperson"
        propertyKey="primaryContact"
        :isActive="primaryContact"
        :value="primaryContact ? 'Ja' : 'nein'"
        @button-toggled="changeSubmitted"
        :isLoading="parentPrimaryContactIsLoading"
        v-if="contactType ==='mother' || contactType ==='father'"
      />
      
      <editable-user-info-text-row
        title="Funktion"
        propertyKey="function"
        :isLoading="parentFunctionIsLoading"
        :value="contactFunction"
        buttonTitle="Updaten"
        @change-submit="changeSubmitted"
        placeholder="Nicht angegeben"
        v-if="contactType ==='schoolContact'"
      />
    </dl>
  </div>
</template>
  
  <script>
// Vue imports
import { computed } from 'vue'
// Component imports
import EditableUserInfoTextRow from '@/components/Main/Admin/User/EditableUserInfoTextRow.vue'
import EditableUserInfoEmailRow from '@/components/Main/Admin/User/EditableUserInfoEmailRow.vue'
import EditableUserInfoPhoneRow from '@/components/Main/Admin/User/EditableUserInfoPhoneRow.vue'
import SwitchableInfo from '@/components/UIComponents/Selections/SwitchableInfo.vue'
import DropdownUserInfoRow from '@/components/Main/Admin/User/DropdownUserInfoRow.vue'

export default {
  name: 'ChildrenDetailParentInfo',
  emits: ['change-submit'],
  props: {
    child: {
      type: Object,
      required: true
    },
    contactType: {
      type: String,
      required: true
    },
    isLoading: {
      type: Object,
      required: true
    }
  },
  components: {
    EditableUserInfoTextRow,
    EditableUserInfoEmailRow,
    EditableUserInfoPhoneRow,
    SwitchableInfo,
    DropdownUserInfoRow
  },
  setup(props, ctx) {
    const contact = computed(() => {
      return props.child[props.contactType] || {}
    })

    // Get the name for the selected parent
    const name = computed(() => {
      try {
        return contact.value.name
          ? contact.value.name
          : ''
      } catch (error) {
        return ''
      }
    })

    // Get the family name for the selected parent
    const familyName = computed(() => {
      try {
        return contact.value.familyName
          ? contact.value.familyName
          : ''
      } catch (error) {
        return ''
      }
    })

    const genderOptions = computed(() => {
      const options = [
        {
          name: 'Männlich',
          title: 'Männlich',
          description: '',
          value: 'Male'
        },
        {
          name: 'Weiblich',
          title: 'Weiblich',
          description: '',
          value: 'Female'
        }
      ]
      // Loop through the groups and check which group the user has to flag it
      options.forEach((possibleGroup) => {
        possibleGroup.current = contact.value.gender === possibleGroup.value
      })
      return options
    })

    // Get the phone number for the selected parent
    const phoneNumber = computed(() => {
      try {
        return contact.value.phone
          ? contact.value.phone
          : ''
      } catch (error) {
        return ''
      }
    })

    // Get the email for the selected parent
    const email = computed(() => {
      try {
        return contact.value.email
          ? contact.value.email
          : ''
      } catch (error) {
        return ''
      }
    })

    const primaryContact = computed(() => {
      try {
        return contact.value.primaryContact
          ? contact.value.primaryContact
          : false
      } catch (error) {
        return false
      }
    })

    const contactFunction = computed(() => {
      try {
        return contact.value.function
          ? contact.value.function
          : ''
      } catch (error) {
        return ''
      }
    })

    // Get the loading status for the name attribute
    const parentNameIsLoading = computed(() => {
      if (
        props.isLoading.property === 'name' &&
        props.isLoading.isLoading &&
        props.isLoading.contactType === props.contactType
      ) {
        return true
      }
      return false
    })

    // Get the loading status for the family name attribute
    const parentFamilyNameIsLoading = computed(() => {
      if (
        props.isLoading.property === 'familyName' &&
        props.isLoading.isLoading &&
        props.isLoading.contactType === props.contactType
      ) {
        return true
      }
      return false
    })

    const genderIsLoading = computed(() => {
      if (
        props.isLoading.property === 'gender' &&
        props.isLoading.isLoading &&
        props.isLoading.contactType === props.contactType
      ) {
        return true
      }
      return false
    })

    // Get the loading status for the phone number attribute
    const parentPhoneIsLoading = computed(() => {
      if (
        props.isLoading.property === 'phone' &&
        props.isLoading.isLoading &&
        props.isLoading.contactType === props.contactType
      ) {
        return true
      }
      return false
    })

    // Get the loading status for the email attribute
    const parentEmailIsLoading = computed(() => {
      if (
        props.isLoading.property === 'email' &&
        props.isLoading.isLoading &&
        props.isLoading.contactType === props.contactType
      ) {
        return true
      }
      return false
    })

    const parentPrimaryContactIsLoading = computed(() => {
      if (
        props.isLoading.property === 'primaryContact' &&
        props.isLoading.isLoading &&
        props.isLoading.contactType === props.contactType
      ) {
        return true
      }
      return false
    })

    const parentFunctionIsLoading = computed(() => {
      if (
        props.isLoading.property === 'function' &&
        props.isLoading.isLoading &&
        props.isLoading.contactType === props.contactType
      ) {
        return true
      }
      return false
    })

    function genderChanged(changeObject) {
      const gender = { 
        gender: changeObject === 'Männlich' ? 'Male' : 'Female',
        contactType: props.contactType,
      }
      ctx.emit('change-submit', gender)
    }
  
    // Gets called, whenever an child parent attribute is changed by the admin
    function changeSubmitted(changeObject) {
      changeObject.contactType = props.contactType
      ctx.emit('change-submit', changeObject)
    }

    // Return the setup object
    return {
      name,
      parentNameIsLoading,
      phoneNumber,
      genderOptions,
      parentPhoneIsLoading,
      familyName,
      parentFamilyNameIsLoading,
      email,
      primaryContact,
      contactFunction,
      genderIsLoading,
      parentFunctionIsLoading,
      parentEmailIsLoading,
      parentPrimaryContactIsLoading,
      changeSubmitted,
      genderChanged
    }
  }
}
</script>
  
