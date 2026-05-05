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
      <!-- First input row container
        contains:
          Name Label + Textfield
          FamilyName Label + Textfield
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
            placeholder="Max"
            @input-value="setName"
            @is-valid="setNameValidation"
          />
        </div>
        <!-- familyname Label + Textfield -->
        <div class="w-full md:w-1/2">
          <input-label
            elementID="familyName"
            labelText="Nachname*"
          />
          <text-textfield
            elementID="familyName"
            name="familyName"
            placeholder="Mustermann"
            @input-value="setFamilyName"
            @is-valid="setFamilyNameValidation"
          />
        </div>
      </div>
      <div class="flex flex-col md:flex-row w-full justify-between gap-4 md:gap-6">
        <!-- birthday Label -->
        <div class="w-full md:w-1/2">
          <input-label
            elementID="dateOfBirth"
            labelText="Geburtsdatum*"
          />
          <text-textfield
            elementID="dateOfBirth"
            name="dateOfBirth"
            placeholder="01.01.2020"
            @input-value="setDateOfBirth"
            @is-valid="setDateOfBirthValidation"
          />
        </div>
        <!-- school Label -->
        <div class="w-full md:w-1/2">
          <input-label
            elementID="school"
            labelText="Schule*"
          />
          <text-textfield
            elementID="school"
            name="school"
            placeholder="Musterschule"
            @input-value="setSchool"
            @is-valid="setSchoolValidation"
          />
        </div>
      </div>
      <div class="flex flex-col md:flex-row w-full justify-between gap-4 md:gap-6">
        <!-- date of registration Label -->
        <div class="w-full md:w-1/2 pr-0">
          <input-label
            elementID="dateOfRegistration"
            labelText="Beginn der Hilfe*"
          />
          <text-textfield
            elementID="dateOfRegistration"
            name="dateOfRegistration"
            placeholder="01.01.2020"
            @input-value="setDateOfRegistration"
            @is-valid="setDateOfRegistrationValidation"
          />
        </div>
        <!-- weekly hours -->
        <div class="w-full md:w-1/2 pr-0">
          <input-label
            elementID="weeklyHours"
            labelText="Wochenstunden*"
          />
          <float-textfield
            elementID="weeklyHours"
            name="weeklyHours"
            placeholder="5"
            @input-value="setWeeklyHours"
            @is-valid="setWeeklyHoursValidation"
          />
          <!-- data complete switch -->
          <switchable-info
            title="Stundenberechnung:"
            propertyKey="weeklyHoursByPlan"
            :isActive="childInput.weeklyHoursByPlan.value"
            :value="childInput.weeklyHoursByPlan.value ? 'Gemäß Stundenplan' : 'Nach Wochenstunden'"
            @button-toggled="setWeeklyHoursByPlan"
            :isLoading="false"
          />
        </div>
      </div>
      <div class="flex flex-col md:flex-row w-full justify-between gap-4 md:gap-6">
        <!-- record number Label -->
        <div class="w-full md:w-1/2 pr-0 md:pr-4">
          <input-label
            elementID="recordNumber"
            labelText="Aktenzeichen"
          />
          <text-textfield
            elementID="recordNumber"
            name="recordNumber"
            placeholder="ABC123456789"
            @input-value="setRecordNumber"
          />
        </div>
        <!-- data completion -->
        <div class="w-full md:w-1/2">
          <input-label
            elementID="dataComplete"
            labelText="Datenvollständigkeit"
          />
          <!-- data complete switch -->
          <switchable-info
            title="Daten vollständig:"
            propertyKey="dataComplete"
            :isActive="childInput.dataComplete.value"
            :value="childInput.dataComplete.value ? 'Vollständig' : 'Unvollständig'"
            @button-toggled="setDataComplete"
            :isLoading="false"
          />
        </div>
      </div>
      <!-- mother section -->
      <div class="flex w-full">
        <div class="space-y-1">
          <h3 class="text-lg leading-6 font-medium text-primaryText">Mutter</h3>
          <p class="max-w-2xl text-sm text-secondaryText">
            Informationen über die Mutter des Klienten.
          </p>
        </div>
      </div>
      <div class="flex flex-col md:flex-row w-full justify-between gap-4 md:gap-6">
        <!-- mother name Label + Textfield -->
        <div class="w-full md:w-1/2">
          <input-label
            elementID="motherName"
            labelText="Name"
          />
          <text-textfield
            elementID="motherName"
            name="motherName"
            placeholder="Erika"
            @input-value="setMotherName"
            @is-valid="setMotherNameValidation"
          />
        </div>
        <!-- mother familyname Label + Textfield -->
        <div class="w-full md:w-1/2">
          <input-label
            elementID="motherFamilyName"
            labelText="Nachname"
          />
          <text-textfield
            elementID="motherFamilyName"
            name="motherFamilyName"
            placeholder="Musterfrau"
            @input-value="setMotherFamilyName"
            @is-valid="setMotherFamilyNameValidation"
          />
        </div>
      </div>
      <div class="flex flex-col md:flex-row w-full justify-between gap-4 md:gap-6">
        <!-- mother phone -->
        <div class="w-full md:w-1/2">
          <input-label
            elementID="motherPhone"
            labelText="Telefon"
          />
          <phone-textfield
            elementID="motherPhone"
            name="motherPhone"
            placeholder="176123456789"
            @input-value="setMotherPhone"
            @is-valid="setMotherPhoneValidation"
          />
        </div>
        <!-- mother email -->
        <div class="w-full md:w-1/2">
          <input-label
            elementID="motherEmail"
            labelText="E-Mail"
          />
          <email-textfield
            elementID="motherEmail"
            name="motherEmail"
            placeholder="erika@musterfrau.de"
            @input-value="setMotherEmail"
            @is-valid="setMotherEmailValidation"
          />
        </div>
      </div>
      <!-- father section -->
      <div class="flex w-full">
        <div class="space-y-1">
          <h3 class="text-lg leading-6 font-medium text-primaryText">Vater</h3>
          <p class="max-w-2xl text-sm text-secondaryText">
            Informationen über den Vater des Klienten.
          </p>
        </div>
      </div>
      <div class="flex flex-col md:flex-row w-full justify-between gap-4 md:gap-6">
        <!-- father name Label + Textfield -->
        <div class="w-full md:w-1/2">
          <input-label
            elementID="fatherName"
            labelText="Name"
          />
          <text-textfield
            elementID="fatherName"
            name="fatherName"
            placeholder="Max"
            @input-value="setFatherName"
            @is-valid="setFatherNameValidation"
          />
        </div>
        <!-- father familyname Label + Textfield -->
        <div class="w-full md:w-1/2">
          <input-label
            elementID="fatherFamilyName"
            labelText="Nachname"
          />
          <text-textfield
            elementID="fatherFamilyName"
            name="fatherFamilyName"
            placeholder="Mustermann"
            @input-value="setFatherFamilyName"
            @is-valid="setFatherFamilyNameValidation"
          />
        </div>
      </div>
      <div class="flex flex-col md:flex-row w-full justify-between gap-4 md:gap-6">
        <!-- father  phone -->
        <div class="w-full md:w-1/2">
          <input-label
            elementID="fatherPhone"
            labelText="Telefon"
          />
          <phone-textfield
            elementID="fatherPhone"
            name="fatherPhone"
            placeholder="176123456789"
            @input-value="setFatherPhone"
            @is-valid="setFatherPhoneValidation"
          />
        </div>
        <!-- father  email -->
        <div class="w-full md:w-1/2">
          <input-label
            elementID="fatherEmail"
            labelText="E-Mail"
          />
          <email-textfield
            elementID="fatherEmail"
            name="fatherEmail"
            placeholder="max@mustermann.de"
            @input-value="setFatherEmail"
            @is-valid="setFatherEmailValidation"
          />
        </div>
      </div>
      <!-- school contact -->
      <div class="flex w-full">
        <div class="space-y-1">
          <h3 class="text-lg leading-6 font-medium text-primaryText">Schulkontakt</h3>
          <p class="max-w-2xl text-sm text-secondaryText">
            Informationen über den Schulkotakt des Klienten.
          </p>
        </div>
      </div>
      <div class="flex flex-col md:flex-row w-full justify-between gap-4 md:gap-6">
        <!-- school contact name Label + Textfield -->
        <div class="w-full md:w-1/2">
          <input-label
            elementID="schoolContactName"
            labelText="Name"
          />
          <text-textfield
            elementID="schoolContactName"
            name="schoolContactName"
            placeholder="Max"
            @input-value="setSchoolContactName"
            @is-valid="setSchoolContactNameValidation"
          />
        </div>
        <!-- school contact familyname Label + Textfield -->
        <div class="w-full md:w-1/2">
          <input-label
            elementID="schoolContactFamilyName"
            labelText="Nachname"
          />
          <text-textfield
            elementID="schoolContactFamilyName"
            name="schoolContactFamilyName"
            placeholder="Mustermann"
            @input-value="setSchoolContactFamilyName"
            @is-valid="setSchoolContactFamilyNameValidation"
          />
        </div>
      </div>
      <div class="flex flex-col md:flex-row w-full justify-between gap-4 md:gap-6">
        <!-- school contact  phone -->
        <div class="w-full md:w-1/2">
          <input-label
            elementID="schoolContactPhone"
            labelText="Telefon"
          />
          <phone-textfield
            elementID="schoolContactPhone"
            name="schoolContactPhone"
            placeholder="176123456789"
            @input-value="setSchoolContactPhone"
            @is-valid="setSchoolContactPhoneValidation"
          />
        </div>
        <!-- school contact  email -->
        <div class="w-full md:w-1/2">
          <input-label
            elementID="schoolContactEmail"
            labelText="E-Mail"
          />
          <email-textfield
            elementID="schoolContactEmail"
            name="schoolContactEmail"
            placeholder="max@mustermann.de"
            @input-value="setSchoolContactEmail"
            @is-valid="setSchoolContactEmailValidation"
          />
        </div>
      </div>
      <!-- carrierContact selection -->
      <CarrierContactSelection @carrier-contact-selected="setCarrierContact" />
      <!-- information text -->
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
      <!-- guardian information -->
      <div>
        <p class="pb-4 text-xs text-secondaryText">
          Betreuer können im Anschluss an die Erstellung in der Detailansicht zugewiesen werden.
        </p>
      </div>
    </form>
  </div>
</template>

<script>
// Vue imports
import { ref, reactive, watch } from 'vue'
import { useStore } from 'vuex'

// Component imports
import InputLabel from '@/components/UIComponents/Labels/InputLabel.vue'
import TextTextfield from '@/components/UIComponents/Inputs/TextTextfield.vue'
import PhoneTextfield from '@/components/UIComponents/Inputs/PhoneTextfield.vue'
import EmailTextfield from '@/components/UIComponents/Inputs/EmailTextfield.vue'
import FloatTextfield from '@/components/UIComponents/Inputs/FloatTextfield.vue'
import StandardButton from '@/components/UIComponents/Buttons/StandardButton.vue'
import UserSelectionModal from '@/components/UIComponents/Modals/UserSelectionModal.vue'
import CarrierContactSelection from '@/components/Main/Admin/Children/CarrierContactSelection.vue'
import SwitchableInfo from '@/components/UIComponents/Selections/SwitchableInfo.vue'

export default {
  name: 'NewUserForm',
  components: {
    InputLabel,
    TextTextfield,
    PhoneTextfield,
    EmailTextfield,
    FloatTextfield,
    StandardButton,
    UserSelectionModal,
    CarrierContactSelection,
    SwitchableInfo
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
    const childInput = reactive({
      name: {
        value: '',
        isValid: false
      },
      familyName: {
        value: '',
        isValid: false
      },
      dataComplete: {
        value: false,
        isValid: true
      },
      carrierContact: {
        value: null,
        isValid: false
      },
      dateOfBirth: {
        value: null,
        isValid: false
      },
      school: {
        value: null,
        isValid: false
      },
      dateOfRegistration: {
        value: null,
        isValid: false
      },
      weeklyHours: {
        value: null,
        isValid: false
      },
      weeklyHoursByPlan: {
        value: false,
        isValid: true
      },
      recordNumber: {
        value: null,
        isValid: true
      },
      motherName: {
        value: null,
        isValid: false
      },
      motherFamilyName: {
        value: null,
        isValid: false
      },
      motherPhone: {
        value: null,
        isValid: false
      },
      motherEmail: {
        value: null,
        isValid: false
      },
      fatherName: {
        value: null,
        isValid: false
      },
      fatherFamilyName: {
        value: null,
        isValid: false
      },
      fatherPhone: {
        value: null,
        isValid: false
      },
      fatherEmail: {
        value: null,
        isValid: false
      },
      schoolContactName: {
        value: null,
        isValid: false
      },
      schoolContactFamilyName: {
        value: null,
        isValid: false
      },
      schoolContactPhone: {
        value: null,
        isValid: false
      },
      schoolContactEmail: {
        value: null,
        isValid: false
      }
    })

    // Initialize the store
    const store = useStore()

    // Declaration of functions to set user inputs
    // name
    function setName(name) {
      childInput.name.value = name
    }
    function setNameValidation(isValid) {
      childInput.name.isValid = isValid
    }
    // familyName
    function setFamilyName(name) {
      childInput.familyName.value = name
    }
    function setFamilyNameValidation(isValid) {
      childInput.familyName.isValid = isValid
    }
    // data completion
    function setDataComplete(val) {
      childInput.dataComplete.value = val.dataComplete
    }
    // birthday
    function setDateOfBirth(dob) {
      childInput.dateOfBirth.value = dob
    }
    function setDateOfBirthValidation(isValid) {
      childInput.dateOfBirth.isValid = isValid
    }
    // school
    function setSchool(name) {
      childInput.school.value = name
    }
    function setSchoolValidation(isValid) {
      childInput.school.isValid = isValid
    }
    // date of registration
    function setDateOfRegistration(dob) {
      childInput.dateOfRegistration.value = dob
    }
    function setDateOfRegistrationValidation(isValid) {
      childInput.dateOfRegistration.isValid = isValid
    }
    // weekly hours
    function setWeeklyHours(dob) {
      childInput.weeklyHours.value = dob
    }
    function setWeeklyHoursValidation(isValid) {
      childInput.weeklyHours.isValid = isValid
    }
    // weekly hours by plan
    function setWeeklyHoursByPlan(val) {
      childInput.weeklyHoursByPlan.value = val.weeklyHoursByPlan
    }
    // internal record number
    function setRecordNumber(recordNumber) {
      childInput.recordNumber.value = recordNumber
      childInput.recordNumber.isValid = true
    }
    function setWeeklyHoursValidation(isValid) {
      childInput.weeklyHours.isValid = isValid
    }
    // carrierContact
    function setCarrierContact(carrierContact) {
      childInput.carrierContact.value = carrierContact
      setCarrierContactValidation()
    }
    function setCarrierContactValidation() {
      childInput.carrierContact.isValid = true
    }

    // setters for mother
    // name
    function setMotherName(name) {
      childInput.motherName.value = name
    }
    function setMotherNameValidation(isValid) {
      childInput.motherName.isValid = isValid
    }
    // family name
    function setMotherFamilyName(familyname) {
      childInput.motherFamilyName.value = familyname
    }
    function setMotherFamilyNameValidation(isValid) {
      childInput.motherFamilyName.isValid = isValid
    }
    // phone
    function setMotherPhone(phone) {
      childInput.motherPhone.value = phone
    }
    function setMotherPhoneValidation(isValid) {
      childInput.motherPhone.isValid = isValid
    }
    // email
    function setMotherEmail(mail) {
      childInput.motherEmail.value = mail
    }
    function setMotherEmailValidation(isValid) {
      childInput.motherEmail.isValid = isValid
    }

    // setters for father
    // name
    function setFatherName(name) {
      childInput.fatherName.value = name
    }
    function setFatherNameValidation(isValid) {
      childInput.fatherName.isValid = isValid
    }
    // family name
    function setFatherFamilyName(familyname) {
      childInput.fatherFamilyName.value = familyname
    }
    function setFatherFamilyNameValidation(isValid) {
      childInput.fatherFamilyName.isValid = isValid
    }
    // phone
    function setFatherPhone(phone) {
      childInput.fatherPhone.value = phone
    }
    function setFatherPhoneValidation(isValid) {
      childInput.fatherPhone.isValid = isValid
    }
    // email
    function setFatherEmail(mail) {
      childInput.fatherEmail.value = mail
    }
    function setFatherEmailValidation(isValid) {
      childInput.fatherEmail.isValid = isValid
    }

    // setters for school contact
    // name
    function setSchoolContactName(name) {
      childInput.schoolContactName.value = name
    }
    function setSchoolContactNameValidation(isValid) {
      childInput.schoolContactName.isValid = isValid
    }
    // family name
    function setSchoolContactFamilyName(familyname) {
      childInput.schoolContactFamilyName.value = familyname
    }
    function setSchoolContactFamilyNameValidation(isValid) {
      childInput.schoolContactFamilyName.isValid = isValid
    }
    // phone
    function setSchoolContactPhone(phone) {
      childInput.schoolContactPhone.value = phone
    }
    function setSchoolContactPhoneValidation(isValid) {
      childInput.schoolContactPhone.isValid = isValid
    }
    // email
    function setSchoolContactEmail(mail) {
      childInput.schoolContactEmail.value = mail
    }
    function setSchoolContactEmailValidation(isValid) {
      childInput.schoolContactEmail.isValid = isValid
    }

    // Check if the inputs are validated
    function validateInputs() {
      var valid = true
      const ignoreList = [
        'guardian',
        'carrierContact',
        'recordNumber',
        'fatherName',
        'fatherFamilyName',
        'fatherPhone',
        'fatherEmail',
        'motherName',
        'motherFamilyName',
        'motherPhone',
        'motherEmail',
        'schoolContactName',
        'schoolContactFamilyName',
        'schoolContactPhone',
        'schoolContactEmail',
        'weeklyHours',
        'weeklyHoursByPlan'
      ]

      for (const entry of Object.keys(childInput)) {
        // check if vaidation is false if key is no in ignore list
        if (!childInput[entry].isValid && ignoreList.indexOf(entry) < 0) {
          valid = false
        }
      }
      // check weeklyHours and weeklyHoursByPlan --> if weeklyHoursByPlan is true, no weeklyHOurs are requried --> otherwise they have to be specified
      if (!childInput.weeklyHoursByPlan.value && !childInput.weeklyHours.isValid) {
        valid = false
      }
      allInputsValidated.value = valid
    }

    // Submit the form
    function submitForm() {
      context.emit('submit-inputs', childInput)
    }

    // watch for updates of user location checklist object
    watch(
      () => [childInput],
      () => {
        validateInputs()
      },
      { deep: true }
    )

    return {
      childInput,
      allInputsValidated,
      setName,
      setNameValidation,
      setFamilyName,
      setFamilyNameValidation,
      setDataComplete,
      setDateOfBirth,
      setDateOfBirthValidation,
      setSchool,
      setSchoolValidation,
      setDateOfRegistration,
      setDateOfRegistrationValidation,
      setWeeklyHours,
      setWeeklyHoursValidation,
      setWeeklyHoursByPlan,
      setRecordNumber,
      setCarrierContact,
      setMotherName,
      setMotherNameValidation,
      setMotherFamilyName,
      setMotherFamilyNameValidation,
      setMotherPhone,
      setMotherPhoneValidation,
      setMotherEmail,
      setMotherEmailValidation,
      setFatherName,
      setFatherNameValidation,
      setFatherFamilyName,
      setFatherFamilyNameValidation,
      setFatherPhone,
      setFatherPhoneValidation,
      setFatherEmail,
      setFatherEmailValidation,
      setSchoolContactName,
      setSchoolContactNameValidation,
      setSchoolContactFamilyName,
      setSchoolContactFamilyNameValidation,
      setSchoolContactEmail,
      setSchoolContactEmailValidation,
      setSchoolContactPhone,
      setSchoolContactPhoneValidation,
      submitForm
    }
  }
}
</script>
