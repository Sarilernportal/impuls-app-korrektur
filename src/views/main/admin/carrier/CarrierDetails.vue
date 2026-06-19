<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
19.09.2022

Scope:
Carrier Details
-->

<template>
  <!-- Critical action modal for carrier delete operation -->
  <critical-action
    :open="deleteSelected"
    title="Träger löschen"
    message="Möchten Sie den Träger wirklich löschen? Dieser Vorgang ist nicht mehr umzukehren."
    buttonCancelTitle="Abbrechen"
    buttonConfirmTitle="Träger löschen"
    @close="deleteSelected = false"
    @confirmed="confirmedDelete"
  >
  </critical-action>
  <!-- Error modal -->
  <error-window
    v-if="customError.isPresent"
    :title="customError.title"
    :message="customError.message"
    :open="customError.isPresent"
    @close="customErrorConfirmed"
  />
  <!-- Success modal -->
  <success-window
    v-if="customSuccess.isPresent"
    :title="customSuccess.title"
    :message="customSuccess.message"
    :open="customSuccess.isPresent"
    @close="customSuccessConfirmed"
  />
  <div class="min-h-screen overflow-y-auto bg-slate-50 flex">
    <!-- Content area -->
    <!-- Loading spinner -->
    <div
      v-if="isLoading"
      class="w-full flex justify-center items-center"
    >
      <loading-spinner size="h-16 w-16" />
    </div>
    <!-- Main content area -->
    <div
      v-else
      class="flex-1 flex flex-col"
    >
      <main class="flex-1 focus:outline-none">
        <div class="relative mx-auto max-w-full px-4 sm:px-6 lg:px-8 xl:px-0">
          <div class="py-8">
            <div class="px-4 sm:px-6 md:px-0 space-y-6">
              <!-- Description list with inline editing -->
              <div class="rounded-xl border border-slate-200 bg-white shadow-card p-6 divide-y divide-slate-200">
                <!-- Header section -->
                <div class="space-y-1">
                  <h3 class="text-lg leading-6 font-semibold text-slate-900">
                    Profil
                  </h3>
                  <p class="max-w-2xl text-sm text-secondaryText">
                    Informationen über persönliche Daten des Trägers.
                  </p>
                </div>
                <!-- carrier Data section -->
                <div class="mt-6">
                  <carrier-detail-data-info
                    :carrier="carrier"
                    :isLoading="propertyIsLoading"
                    @change-submit="changeSubmitted"
                  />
                </div>
                <!-- Billing Header section -->
                <div class="space-y-1 mt-6 pt-6">
                  <h3 class="text-lg leading-6 font-semibold text-slate-900">
                    Rechnungsadresse
                  </h3>
                  <p class="max-w-2xl text-sm text-secondaryText">
                    Informationen über die Rechnungsadresse des Trägers.
                  </p>
                </div>
                <!-- carrier billing information section -->
                <div class="mt-6">
                  <CarrierBillingInfo
                    :carrier="carrier"
                    :isLoading="propertyIsLoading"
                    @change-submit="changeSubmitted"
                  />
                </div>
                <!-- carrier contacts -->
                <div class="mt-6 pt-6">
                  <CarrierDetailContactList
                    @contact-selected="addContact"
                    @remove-contact="removeContact"
                    :carrier="carrier"
                  />
                </div>
              </div>
              <!-- Account Information section -->
              <div class="rounded-xl border border-slate-200 bg-white shadow-card p-6 divide-y divide-slate-200">
                <carrier-detail-account-info
                  :carrier="carrier"
                  :deleteIsLoading="deleteIsLoading"
                  :userStateIsLoading="userStateIsLoading"
                  @delete-carrier-tapped="deleteCarrierTapped"
                />
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
import CarrierDetailDataInfo from '@/components/Main/Admin/Carrier/CarrierDetailDataInfo.vue'
import CarrierBillingInfo from '@/components/Main/Admin/Carrier/CarrierBillingInfo.vue'
import CarrierDetailAccountInfo from '@/components/Main/Admin/Carrier/CarrierDetailAccountInfo.vue'
import CarrierDetailContactList from '@/components/Main/Admin/Carrier/CarrierDetailContactList.vue'
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
    CarrierDetailDataInfo,
    CarrierBillingInfo,
    CarrierDetailAccountInfo,
    CarrierDetailContactList,
    CriticalAction,
    LoadingSpinner,
    SuccessWindow,
    ErrorWindow
  },
  props: ['id'],
  setup() {
    // Initialize Refs
    const carrier = ref(null)
    const isLoading = ref(true)
    const userStateIsLoading = ref(false)
    const groupIsLoading = ref(false)
    const deleteIsLoading = ref(false)
    const deleteSelected = ref(false)
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
    // Initialize Route & Router
    const route = useRoute()
    const router = useRouter()
    // Initialze Store
    const store = useStore()

    // Mounted Hook
    onMounted(() => {
      // Get the id from the route
      const id = route.params.id
      // Fetch the carrier details from AppSync
      fetchCarrierDetails(id)
    })

    // Fetch the carrier details from AppSync
    async function fetchCarrierDetails(id) {
      try {
        isLoading.value = true
        // The sub for the carrier is the id
        const sub = id
        carrier.value = await store.dispatch('fetchCarrierDetails', { sub })
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

    // Admin tapped the delete carrier button
    function deleteCarrierTapped() {
      // Set the selected value to true to trigger the modal
      deleteSelected.value = true
    }

    // This method gets called, when the admin confirmed the deletion of the selected carrier
    async function confirmedDelete() {
      deleteSelected.value = false
      deleteIsLoading.value = true
      try {
        await store.dispatch('deleteCarrier', { carrier: carrier.value })
        deleteIsLoading.value = false
        // Show success window when user was successfully removed
        customSuccess.isPresent = true
        customSuccess.title = 'Erfolgreich gelöscht'
        customSuccess.message = 'Sie haben den Träger erfolgreich gelöscht!'
      } catch (err) {
        console.log(err)
        // Show error window when user couldn't be removed
        customError.isPresent = true
        customError.title = createErrorTitle(err)
        customError.message = createErrorMessage(err)
        deleteIsLoading.value = false
        deleteSelected.value = false
      }
    }

    // Admin confirmed a success modal
    function customSuccessConfirmed() {
      router.push({ name: 'CarrierOverview' })
    }

    // Admin confirmed a error modal
    function customErrorConfirmed() {
      router.push({ name: 'CarrierOverview' })
    }

    // Gets called, whenever an carrier attribute is changed by the admin
    function changeSubmitted(changeObject) {
      updateCarrier(changeObject)
    }

    // Update the carrier attributes
    async function updateCarrier(changeObject) {
      // Set the target object to flag his loading
      propertyIsLoading.property = Object.keys(changeObject)[0]
      propertyIsLoading.isLoading = true
      try {
        // Update the carrier
        await store.dispatch('updateCarrier', {
          carrier: carrier.value,
          changeObject
        })
        // Check which object we are targeting, check also custom attributes
        updateUIValues(changeObject)
      } catch (err) {
        // Log the error
        console.log(err)
      } finally {
        // Reset the target object loading flag
        propertyIsLoading.property = ''
        propertyIsLoading.isLoading = false
      }
    }

    // Function to update the local label values after updating the backend values
    function updateUIValues(changeObject) {
      const changeKey = Object.keys(changeObject)[0]
      const changeValue = changeObject[changeKey]

      carrier.value[changeKey] = changeValue
    }

    async function addContact(contact) {
      // check if contact is already connected to carrier
      const contactIndex = carrier.value.carrierContacts.items.findIndex(
        (contactAttr) => {
          return contactAttr.id === contact.id
        }
      )

      // only add contact if it isnt already connected
      if (contactIndex < 0) {
        try {
          // Update the contact
          await store.dispatch('updateCarrierContact', {
            carrierContact: contact,
            changeObject: {
              carrierCarrierContactsId: carrier.value.id
            }
          })
        } catch (err) {
          // Log the error
          console.log(err.response.data.message)
        } finally {
          // add contact to carrier contact items array
          carrier.value.carrierContacts.items.push(contact)
        }
      }
    }

    async function removeContact(contact) {
      try {
        // Update the contact
        await store.dispatch('updateCarrierContact', {
          carrierContact: contact,
          changeObject: { carrierCarrierContactsId: null }
        })
      } catch (err) {
        console.log(err)
      } finally {
        // get index of deleted object in carrier object
        const contactIndex = carrier.value.carrierContacts.items.findIndex(
          (contactAttr) => {
            return contactAttr.id === contact.id
          }
        )
        // delete contact from carrier object
        delete carrier.value.carrierContacts.items.splice(contactIndex, 1)
      }
    }

    // Return the setup object
    return {
      isLoading,
      userStateIsLoading,
      groupIsLoading,
      deleteIsLoading,
      propertyIsLoading,
      carrier,
      deleteSelected,
      customError,
      customSuccess,
      customSuccessConfirmed,
      customErrorConfirmed,
      deleteCarrierTapped,
      confirmedDelete,
      changeSubmitted,
      addContact,
      removeContact
    }
  }
}
</script>
