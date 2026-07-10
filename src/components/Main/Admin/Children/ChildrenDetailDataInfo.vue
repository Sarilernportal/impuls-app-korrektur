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
    <dl class="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
      <!-- data complete switch -->
      <switchable-info
        title="Daten vollständig"
        propertyKey="dataComplete"
        :isActive="dataComplete"
        :value="dataComplete ? 'Vollständig' : 'Unvollständig'"
        @button-toggled="changeSubmitted"
        :isLoading="dataCompleteIsLoading"
      />
      <!-- Name property -->
      <editable-user-info-text-row
        title="Vorname"
        propertyKey="name"
        :isLoading="nameIsLoading"
        :value="name"
        buttonTitle="Updaten"
        placeholder="Nicht angegeben"
        @change-submit="changeSubmitted"
      />
      <!-- Family name property -->
      <editable-user-info-text-row
        title="Nachname"
        propertyKey="familyName"
        :isLoading="familyNameIsLoading"
        :value="familyName"
        buttonTitle="Updaten"
        placeholder="Nicht angegeben"
        @change-submit="changeSubmitted"
      />
      <!-- record number -->
      <editable-user-info-text-row
        title="Aktenzeichen"
        propertyKey="recordNumber"
        :isLoading="recordNumberIsLoading"
        :value="recordNumber"
        buttonTitle="Updaten"
        placeholder="Nicht angegeben"
        @change-submit="changeSubmitted"
      />
      <!-- dateOfBirth property -->
      <editable-user-info-text-row
        title="Geburtsdatum"
        propertyKey="dateOfBirth"
        :isLoading="dateOfBirthIsLoading"
        :value="dateOfBirth"
        buttonTitle="Updaten"
        placeholder="Nicht angegeben"
        @change-submit="changeSubmitted"
      />
      <!-- dateOfRegistration property -->
      <editable-user-info-text-row
        title="Beginn der Hilfe"
        propertyKey="dateOfRegistration"
        :isLoading="dateOfRegistrationIsLoading"
        :value="dateOfRegistration"
        buttonTitle="Updaten"
        placeholder="Nicht angegeben"
        @change-submit="changeSubmitted"
      />
      <!-- school property -->
      <editable-user-info-text-row
        title="Schule"
        propertyKey="school"
        :isLoading="schoolIsLoading"
        :value="school"
        buttonTitle="Updaten"
        placeholder="Nicht angegeben"
        @change-submit="changeSubmitted"
      />

      <editable-user-info-text-row
        title="Ort der Schule"
        propertyKey="schoolLocation"
        :isLoading="schoolLocationIsLoading"
        :value="schoolLocation"
        buttonTitle="Updaten"
        placeholder="Nicht angegeben"
        @change-submit="changeSubmitted"
      />
    
      <!-- weekly hours -->
      <editable-user-info-float-row
        title="Wochenstunden"
        propertyKey="weeklyHours"
        :isLoading="weeklyHoursIsLoading"
        :value="weeklyHours"
        buttonTitle="Updaten"
        placeholder="Noch nicht bekannt"
        @change-submit="changeSubmitted"
      />
      <!-- hours by plan switch -->
      <switchable-info
        title="Stundenberechnung"
        propertyKey="weeklyHoursByPlan"
        :isActive="weeklyHoursByPlan"
        :value="weeklyHoursByPlan ? 'Gemäß Stundenplan' : 'Nach Wochenstunden'"
        @button-toggled="changeSubmitted"
        :isLoading="weeklyHoursByPlanIsLoading"
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
import EditableUserInfoFloatRow from '@/components/Main/Admin/User/EditableUserInfoFloatRow.vue'
import SwitchableInfo from '@/components/UIComponents/Selections/SwitchableInfo.vue'

export default {
  name: 'ChildrenDetailDataInfo',
  emits: ['change-submit'],
  props: {
    child: {
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
    EditableUserInfoFloatRow,
    SwitchableInfo
  },
  setup(props, ctx) {
    // Get the name for the selected child
    const name = computed(() => {
      // Find the name attribute
      const nameAttribute = props.child.name

      // If the attribute is set, grab the value to return it, If not catch it with an default value
      return nameAttribute ? nameAttribute : ''
    })

    // Get the family name for the selected child
    const familyName = computed(() => {
      // Find the name attribute
      const familyNameAttribute = props.child.familyName

      // If the attribute is set, grab the value to return it, If not catch it with an default value
      return familyNameAttribute ? familyNameAttribute : ''
    })

    // Get the record number for the selected child
    const recordNumber = computed(() => {
      // Find the recordNumber attribute
      const recordNumberAttribute = props.child.recordNumber

      // If the attribute is set, grab the value to return it, If not catch it with an default value
      return recordNumberAttribute ? recordNumberAttribute : ''
    })

    // Get the dateOfBirth for the selected child
    const dateOfBirth = computed(() => {
      // Find the dateOfBirth attribute
      const dateOfBirthAttribute = props.child.dateOfBirth

      // If the attribute is set, grab the value to return it, If not catch it with an default value
      return dateOfBirthAttribute ? dateOfBirthAttribute : ''
    })

    // Get the dateOfRegistration for the selected child
    const dateOfRegistration = computed(() => {
      // Find the dateOfRegistration attribute
      const dateOfRegistrationAttribute = props.child.dateOfRegistration

      // If the attribute is set, grab the value to return it, If not catch it with an default value
      return dateOfRegistrationAttribute
        ? dateOfRegistrationAttribute
        : ''
    })

    // Get the school for the selected child
    const school = computed(() => {
      // Find the school attribute
      const schoolAttribute = props.child.school

      // If the attribute is set, grab the value to return it, If not catch it with an default value
      return schoolAttribute ? schoolAttribute : ''
    })

    const schoolLocation = computed(() => {
      const schoolAttribute = props.child.schoolLocation
      return schoolAttribute ? schoolAttribute : ''
    })

    // Get the weeklyHours for the selected child
    const weeklyHours = computed(() => {
      // Find the weeklyHours attribute
      const weeklyHoursAttribute = props.child.weeklyHours

      // If the attribute is set, grab the value to return it, If not catch it with an default value
      return weeklyHoursAttribute ? weeklyHoursAttribute : ''
    })

    // get data completion status --> we check if the boolean is either true or null, to include old data saves
    const dataComplete = computed(() => {
      try {
        return props.child.dataComplete === null || props.child.dataComplete
      } catch (error) {
        console.log(error)
        // fallback
        return false
      }
    })

    // get weeklyHoursByPlan status --> we check if the boolean is either true or null, to include old data saves
    const weeklyHoursByPlan = computed(() => {
      try {
        return props.child.weeklyHoursByPlan === true
      } catch (error) {
        console.log(error)
        // fallback
        return false
      }
    })

    // Get the loading status for the name attribute
    const nameIsLoading = computed(() => {
      return props.isLoading.property === 'name' && props.isLoading.isLoading
    })

    // Get the loading status for the familyName attribute
    const familyNameIsLoading = computed(() => {
      return (
        props.isLoading.property === 'familyName' && props.isLoading.isLoading
      )
    })

    // Get the loading status for the record number attribute
    const recordNumberIsLoading = computed(() => {
      return (
        props.isLoading.property === 'recordNumber' && props.isLoading.isLoading
      )
    })

    // Get the loading status for the dateOfBirth attribute
    const dateOfBirthIsLoading = computed(() => {
      return (
        props.isLoading.property === 'dateOfBirth' && props.isLoading.isLoading
      )
    })

    // Get the loading status for the dateOfRegistration attribute
    const dateOfRegistrationIsLoading = computed(() => {
      return (
        props.isLoading.property === 'dateOfRegistration' &&
        props.isLoading.isLoading
      )
    })

    // Get the loading status for the school attribute
    const schoolIsLoading = computed(() => {
      return props.isLoading.property === 'school' && props.isLoading.isLoading
    })

    const schoolLocationIsLoading = computed(() => {
      return props.isLoading.property === 'schoolLocation' && props.isLoading.isLoading
    })

    // Get the loading status for the school attribute
    const weeklyHoursIsLoading = computed(() => {
      return (
        props.isLoading.property === 'weeklyHours' && props.isLoading.isLoading
      )
    })

    // get the loading staus for dataComplete
    const dataCompleteIsLoading = computed(() => {
      return (
        props.isLoading.property === 'dataComplete' && props.isLoading.isLoading
      )
    })

    // get loading status for weeklyHoursByPlan
    const weeklyHoursByPlanIsLoading = computed(() => {
      return (
        props.isLoading.property === 'weeklyHoursByPlan' && props.isLoading.isLoading
      )
    })


    // Gets called, whenever an child attribute is changed by the admin
    function changeSubmitted(changeObject) {
      ctx.emit('change-submit', changeObject)
    }

    // Return the setup object
    return {
      name,
      nameIsLoading,
      familyName,
      familyNameIsLoading,
      recordNumber,
      recordNumberIsLoading,
      dateOfBirth,
      dateOfBirthIsLoading,
      dateOfRegistration,
      dateOfRegistrationIsLoading,
      school,
      schoolLocation,
      schoolIsLoading,
      weeklyHours,
      weeklyHoursIsLoading,
      schoolLocationIsLoading,
      dataComplete,
      dataCompleteIsLoading,
      weeklyHoursByPlan,
      weeklyHoursByPlanIsLoading,
      changeSubmitted
    }
  }
}
</script>
