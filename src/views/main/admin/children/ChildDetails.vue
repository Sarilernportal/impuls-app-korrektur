<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
27.09.2022

Scope:
Children Details
-->

<template>
  <!-- Critical action modal for child delete operation -->
  <critical-action :open="archiveSelected" title="Klient archivieren"
    message="Möchten Sie den Klienten wirklich archivieren? Dieser Vorgang hat das Löschen aller Verknüpfungen zur Folge."
    buttonCancelTitle="Abbrechen" buttonConfirmTitle="Klient archivieren" @close="archiveSelected = false"
    @confirmed="confirmedArchive">
  </critical-action>
  <!-- Error modal -->
  <error-window v-if="customError.isPresent" :title="customError.title" :message="customError.message"
    :open="customError.isPresent" @close="customErrorConfirmed" />
  <!-- Success modal -->
  <success-window v-if="customSuccess.isPresent" :title="customSuccess.title" :message="customSuccess.message"
    :open="customSuccess.isPresent" @close="customSuccessConfirmed" />
  <div class="h-screen overflow-scroll-y flex">
    <!-- Content area -->
    <!-- Loading spinner -->
    <div v-if="isLoading" class="w-full flex justify-center items-center">
      <loading-spinner size="h-16 w-16" />
    </div>
    <!-- Main content area -->
    <div v-else class="flex-1 flex flex-col">
      <main class="flex-1 focus:outline-none">
        <div class="relative mx-auto max-w-full px-4 sm:px-6 lg:w-4/5 lg:px-8 xl:px-0">
          <div class="py-8">
            <div class="px-4 sm:px-6 md:px-0">
              <!-- Description list with inline editing -->
              <div class="divide-y divide-slate-200">
                <!-- Header section -->
                <div class="space-y-1">
                  <h3 class="text-lg leading-6 font-medium text-primaryText">
                    Profil
                  </h3>
                  <p class="max-w-2xl text-sm text-secondaryText">
                    Informationen über persönliche Daten des Klienten.
                  </p>
                </div>
                <!-- Data section -->
                <div class="mt-6">
                  <!-- Data section for users -->
                  <children-detail-data-info :child="child" :isLoading="propertyIsLoading"
                    @change-submit="changeSubmitted" />
                </div>
              </div>
              <!-- mother header -->
              <div class="space-y-1 mt-3 pt-3">
                <h3 class="text-lg leading-6 font-medium text-primaryText">Mutter</h3>
                <p class="max-w-2xl text-sm text-secondaryText">
                  Informationen über die Mutter des Klienten.
                </p>
              </div>
              <!-- mother data section -->
              <div class="mt-6">
                <ChildrenDetailContactInfo :child="child" contactType="mother" :isLoading="contactPropertyIsLoading"
                  @change-submit="contactChangeSubmitted" />
              </div>
              <!-- father header -->
              <div class="space-y-1 mt-3 pt-3">
                <h3 class="text-lg leading-6 font-medium text-primaryText">Vater</h3>
                <p class="max-w-2xl text-sm text-secondaryText">
                  Informationen über den Vater des Klienten.
                </p>
              </div>
              <!-- father data section -->
              <div class="mt-6">
                <ChildrenDetailContactInfo :child="child" contactType="father" :isLoading="contactPropertyIsLoading"
                  @change-submit="contactChangeSubmitted" />
              </div>
              <!-- school contact header -->
              <div class="space-y-1 mt-3 pt-3">
                <h3 class="text-lg leading-6 font-medium text-primaryText">
                  Schulkontakt
                </h3>
                <p class="max-w-2xl text-sm text-secondaryText">
                  Informationen über den Schulkontakt des Klienten.
                </p>
              </div>
              <!-- school contact data section -->
              <div class="mt-6">
                <ChildrenDetailContactInfo :child="child" contactType="schoolContact"
                  :isLoading="contactPropertyIsLoading" @change-submit="contactChangeSubmitted" />
              </div>
              <!-- connections to guardians and carriercontacts -->
              <div class="mt-6" v-if="child.archiveStatus === 'unarchived' || !child.archiveStatus">
                <ChildrenDetailConnectionsInfo :child="child" :isLoading="propertyIsLoading"
                  @connection-selected="changeSubmitted" @guardian-connection-selected="guardianSelected"
                  @delete-care-asignment="DeleteCareAssignment" />
              </div>
              <!-- Account Information section -->
              <div class="mt-8 divide-y divide-slate-200">
                <children-detail-account-info :child="child" :archiveIsLoading="archiveIsLoading"
                  :userStateIsLoading="userStateIsLoading" @archive-child-tapped="archiveChildTapped" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
// Vue imports
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
// Component imports
import ChildrenDetailDataInfo from '@/components/Main/Admin/Children/ChildrenDetailDataInfo.vue'
import ChildrenDetailAccountInfo from '@/components/Main/Admin/Children/ChildrenDetailAccountInfo.vue'
import ChildrenDetailConnectionsInfo from '@/components/Main/Admin/Children/ChildrenDetailConnectionsInfo.vue'
import ChildrenDetailContactInfo from '@/components/Main/Admin/Children/ChildrenDetailContactInfo.vue'
import CriticalAction from '@/components/UIComponents/Modals/CriticalAction.vue'
import ErrorWindow from '@/components/UIComponents/Modals/ErrorWindow.vue'
import SuccessWindow from '@/components/UIComponents/Modals/SuccessWindow.vue'
import LoadingSpinner from '@/components/UIComponents/Utilities/LoadingSpinner.vue'
// Utility imports
import {
  createErrorMessage,
  createErrorTitle
} from '@/utilities/auth/errorCreator.js'

export default {
  components: {
    ChildrenDetailDataInfo,
    ChildrenDetailAccountInfo,
    ChildrenDetailConnectionsInfo,
    ChildrenDetailContactInfo,
    CriticalAction,
    LoadingSpinner,
    SuccessWindow,
    ErrorWindow
  },
  props: ['id'],
  setup() {
    // Initialize Refs
    const child = ref(null)
    const isLoading = ref(true)
    const userStateIsLoading = ref(false)
    const archiveIsLoading = ref(false)
    const archiveSelected = ref(false)
    // Initialize Reactives
    const customError = reactive({
      isPresent: false,
      title: '',
      message: ''
    })
    const customSuccess = reactive({
      isPresent: false,
      title: '',
      message: ''
    })
    const propertyIsLoading = reactive({
      property: '',
      isLoading: false
    })
    const contactPropertyIsLoading = reactive({
      property: '',
      contactType: '',
      isLoading: false
    })
    // Initialize Route & Router
    const route = useRoute()
    const router = useRouter()
    // Initialze Store
    const store = useStore()

    // Mounted Hook
    onMounted(() => {
      // Get the id from the route
      const id = route.params.id
      // Fetch the child details from AppSync
      fetchChildDetails(id)
    })

    // Fetch the child details from AppSync
    async function fetchChildDetails(id) {
      try {
        isLoading.value = true
        // The sub for the child is the id
        const sub = id
        child.value = await store.dispatch('fetchChildDetails', { sub })
      } catch (err) {
        // Log the error
        console.log(err)
        const errorLog = err.response.data.message
        customError.isPresent = true
        customError.title = createErrorTitle(errorLog)
        customError.message = createErrorMessage(errorLog)
      } finally {
        isLoading.value = false
      }
    }

    // Admin tapped the delete child button
    function archiveChildTapped() {
      // Set the selected value to true to trigger the modal
      archiveSelected.value = true
    }

    // This method gets called, when the admin confirmed the deletion of the selected child
    async function confirmedArchive() {
      archiveSelected.value = false
      archiveIsLoading.value = true
      try {
        await store.dispatch('adminArchiveClient', { id: child.value.id })
        archiveIsLoading.value = false
        // Show success window when user was successfully removed
        customSuccess.isPresent = true
        customSuccess.title = 'Erfolgreich archiviert'
        customSuccess.message = 'Sie haben den Klienten erfolgreich archiviert!'
      } catch (err) {
        console.log(err)
        // Show error window when user couldn't be removed
        customError.isPresent = true
        customError.title = createErrorTitle(err)
        customError.message = createErrorMessage(err)
        archiveIsLoading.value = false
        archiveSelected.value = false
      }
    }

    // Admin confirmed a success modal
    function customSuccessConfirmed() {
      router.push({ name: 'ChildrenOverview' })
    }

    // Admin confirmed a error modal
    function customErrorConfirmed() {
      router.push({ name: 'ChildrenOverview' })
    }

    // Gets called when a guardian was selected and a new careAssignment needs to be created
    async function guardianSelected(guardian) {
      try {
        // check if guardian is already in careassignments --> no double linking
        const careIndex = child.value.careAssignments.items.findIndex((assignement) => assignement.guardian.id === guardian.guardianId)
        // only create new care assignment if not found in list
        if (careIndex < 0) {
          // create care assignment via store
          const careResponse = await store.dispatch('createCareAssignment',
            {
              childID: child.value.id,
              guardianID: guardian.guardianId
            }
          )
          child.value.careAssignments.items.push(careResponse.data.createCareAssignment)
        }
      } catch (error) {
        console.log(error)
      }
    }

    // function to delete the selected care assignment
    async function DeleteCareAssignment(val) {
      try {
        // delete care assignment via store
        const careResponse = await store.dispatch('deleteCareAssignment', { id: val.id })
        // if successfull, delete from child object
        const careIndex = child.value.careAssignments.items.findIndex(
          (careAssignment) => careAssignment.id === val.id
        )
        // delete from array
        child.value.careAssignments.items.splice(careIndex, 1)
      } catch (error) {
        console.log(error)
      }
    }

    // Gets called, whenever an child attribute is changed by the admin
    function changeSubmitted(changeObject) {
      updateChild(changeObject)
    }

    // Update the child attributes
    async function updateChild(changeObject) {
      // Set the target object to flag his loading
      propertyIsLoading.property = Object.keys(changeObject)[0]
      propertyIsLoading.isLoading = true
      try {
        // Update the child
        await store.dispatch('updateChild', {
          child: child.value,
          changeObject
        })
        // Check which object we are targeting, check also custom attributes
        updateUIValues(changeObject)
      } catch (err) {
        // Log the error
        console.log(err.errors)
      } finally {
        child.value[Object.keys(changeObject)[0]] = changeObject[Object.keys(changeObject)[0]]
        // Reset the target object loading flag
        propertyIsLoading.property = ''
        propertyIsLoading.isLoading = false
      }
    }

    // Function to update the local label values after updating the backend values
    function updateUIValues(changeObject) {
      const changeKey = Object.keys(changeObject)[0]
      const changeValue = changeObject[changeKey]

      // check if value is carrier
      // --> use carrier data to update object
      if (changeKey === 'carrierChildrenId') {
        child.value.carrier = changeObject.data
      } else {
        child.value[changeKey] = changeValue
      }
    }

    // Function to update the local partent label values after updating the backend values
    function updateContactUIValues(changeObject, contactType) {
      const changeKey = Object.keys(changeObject[contactType])[0]
      const changeValue = changeObject[contactType][changeKey]

      // update ref value for contact
      if (child.value[contactType]) {
        child.value[contactType][changeKey] = changeValue
      } else {
        child.value[contactType] = { [changeKey]: changeValue }
      }
    }

    async function contactChangeSubmitted(event) {
      await updateChildContact(event)
    }

    // Update a contact
    async function updateChildContact(changeObject) {
      // get update key and value
      const changeKey = Object.keys(changeObject)[0]
      const changeValue = changeObject[changeKey]

      // get contact type
      const contactType = changeObject.contactType

      // Set the target object to flag his loading
      contactPropertyIsLoading.property = changeKey
      contactPropertyIsLoading.isLoading = true
      contactPropertyIsLoading.contactType = contactType

      // create updateObject
      // check if mother/father already exists, if not use emtpy object for update (would return null error value otherwise)
      if (child.value[contactType]) {
        var contactUpdateObject = { [contactType]: child.value[contactType] }
      } else {
        var contactUpdateObject = { [contactType]: {} }
      }

      // write new value into update object
      contactUpdateObject[contactType][changeKey] = changeValue

      try {
        // Update the child contact
        await store.dispatch('updateChild', {
          child: child.value,
          changeObject: contactUpdateObject
        })
        // update contact UI values
        updateContactUIValues(contactUpdateObject, contactType)
      } catch (err) {
        // Log the error
        console.log(err)
      } finally {
        // Reset the target object loading flag
        contactPropertyIsLoading.property = ''
        contactPropertyIsLoading.isLoading = false
        contactPropertyIsLoading.contactType = ''
      }
    }

    // Return the setup object
    return {
      isLoading,
      userStateIsLoading,
      archiveIsLoading,
      propertyIsLoading,
      contactPropertyIsLoading,
      child,
      archiveSelected,
      customError,
      customSuccess,
      DeleteCareAssignment,
      customSuccessConfirmed,
      customErrorConfirmed,
      archiveChildTapped,
      confirmedArchive,
      changeSubmitted,
      guardianSelected,
      contactChangeSubmitted
    }
  }
}
</script>
