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
      <!-- Name property -->
      <editable-user-info-text-row title="Vorname" propertyKey="name" :isLoading="nameIsLoading"
      :value="name" buttonTitle="Updaten" @change-submit="changeSubmitted" placeholder="Nicht angegeben" />
      <!-- Family Name property -->
      <editable-user-info-text-row title="Nachname" propertyKey="familyName" :isLoading="familyNameIsLoading"
        :value="familyName" buttonTitle="Updaten" @change-submit="changeSubmitted" placeholder="Nicht angegeben" />

      <dropdown-user-info-row v-if="user.Group.GroupName == 'Guardian'" title="Geschlecht" :possibilities="genderOptions"
        @change-property="genderChanged" :isLoading="genderIsLoading" />

      <!-- E-Mail property -->
      <editable-user-info-email-row title="E-Mail-Adresse" propertyKey="email" :isLoading="emailIsLoading"
        :value="emailAddress" buttonTitle="Updaten" @change-submit="changeSubmitted" placeholder="Nicht angegeben" />
      <!-- Phone Number property -->
      <editable-user-info-phone-row title="Telefonnummer" propertyKey="phone" :isLoading="phoneNumberIsLoading"
        :value="phoneNumber" buttonTitle="Updaten" @change-submit="changeSubmitted" placeholder="Nicht angegeben" />
      <!-- professional status -->
      <dropdown-user-info-row v-if="user.Group.GroupName == 'Guardian'" title="Fachkraftstatus"
        :possibilities="possibilities" @change-property="professionChanged" :isLoading="professionIsLoading" />

      <editable-user-info-text-row title="Qualifikation" propertyKey="qualification" :isLoading="qualificationIsLoading"
        :value="qualification" buttonTitle="Updaten" @change-submit="qualificationChanged" placeholder="Nicht angegeben"/>
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
import DropdownUserInfoRow from '@/components/Main/Admin/User/DropdownUserInfoRow.vue'

export default {
  name: 'UserDetailDataInfo',
  emits: ['change-submit', 'change-profession'],
  props: {
    user: {
      type: Object,
      required: true
    },
    userObject: {
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
    DropdownUserInfoRow
  },
  setup(props, ctx) {
    const userAttributes = computed(() => {
      return props.user.UserAttributes || props.user.Attributes || []
    })

    function findAttributeValue(names) {
      const attribute = userAttributes.value.find((item) => {
        return names.includes(item.Name)
      })
      return attribute?.Value || ''
    }

    // Get the name for the selected user
    const name = computed(() => {
      return findAttributeValue(['given_name', 'name'])
    })

        // Get the loading status for the family name attribute
    const nameIsLoading = computed(() => {
      if (
        props.isLoading.property === 'name' &&
        props.isLoading.isLoading
      ) {
        return true
      }
      return false
    })

    // Get the family name for the selected user
    const familyName = computed(() => {
      return findAttributeValue(['family_name'])
    })

    // Get the loading status for the family name attribute
    const familyNameIsLoading = computed(() => {
      if (
        props.isLoading.property === 'familyName' &&
        props.isLoading.isLoading
      ) {
        return true
      }
      return false
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
        possibleGroup.current = props.userObject.gender === possibleGroup.value
      })
      return options
    })

    const genderIsLoading = computed(() => {
      if (
        props.isLoading.property === 'gender' &&
        props.isLoading.isLoading
      ) {
        return true
      }
      return false
    })

    // Get the email address for the selected user
    const emailAddress = computed(() => {
      return findAttributeValue(['email'])
    })

    // Get the loading status for the email attribute
    const emailIsLoading = computed(() => {
      if (props.isLoading.property === 'email' && props.isLoading.isLoading) {
        return true
      }
      return false
    })

    // Get the phone number for the selected user
    const phoneNumber = computed(() => {
      return findAttributeValue(['phone_number'])
    })

    // Get the loading status for the phone number attribute
    const phoneNumberIsLoading = computed(() => {
      if (props.isLoading.property === 'phone' && props.isLoading.isLoading) {
        return true
      }
      return false
    })

    // get possibilities for professional selection
    const possibilities = computed(() => {
      const possibleGroups = [
        {
          name: 'Fachkraft',
          title: 'Fachkraft',
          description: '',
          value: true
        },
        {
          name: 'Nicht-Fachkraft',
          title: 'Nicht-Fachkraft',
          description: '',
          value: false
        }
      ]
      // Loop through the groups and check which group the user has to flag it
      possibleGroups.forEach((possibleGroup) => {
        if (props.userObject.professional === possibleGroup.value) {
          possibleGroup.current = true
        } else {
          possibleGroup.current = false
        }
      })
      return possibleGroups
    })

    // get profession loading state
    const professionIsLoading = computed(() => {
      if (
        props.isLoading.property === 'professional' &&
        props.isLoading.isLoading
      ) {
        return true
      }
      return false
    })

    const qualification = computed(() => {
      const qualificationAttribute = props.userObject.qualification

      return qualificationAttribute || 'Nicht angegeben'
    })

    // Get the loading status for the family name attribute
    const qualificationIsLoading = computed(() => {
      if (
        props.isLoading.property === 'qualification' &&
        props.isLoading.isLoading
      ) {
        return true
      }
      return false
    })

    // Check if the user is admin
    const isAdmin = computed(() => {
      return props.user.Group.GroupName === 'Admin'
    })

    function genderChanged(changeObject) {
      const gender = { gender: changeObject === 'Männlich' ? 'Male' : 'Female' }
      ctx.emit('change-profession', gender)
    }

    // Gets called, whenever a user profession is changed
    function professionChanged(changeObject) {
      const profession = { professional: changeObject === 'Fachkraft' }
      ctx.emit('change-profession', profession)
    }

    function qualificationChanged(changeObject) {
      ctx.emit('change-profession', changeObject)
    }

    // Gets called, whenever an user attribute is changed by the admin
    function changeSubmitted(changeObject) {
      ctx.emit('change-submit', changeObject)
    }

    // Return the setup object
    return {
      name,
      familyName,
      familyNameIsLoading,
      genderOptions,
      genderIsLoading,
      emailAddress,
      emailIsLoading,
      phoneNumber,
      phoneNumberIsLoading,
      possibilities,
      professionIsLoading,
      qualification,
      qualificationIsLoading,
      isAdmin,
      professionChanged,
      changeSubmitted,
      genderChanged,
      qualificationChanged,
      nameIsLoading
    }
  }
}
</script>
