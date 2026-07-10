<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
19.09.2022

Scope:
Carrier Contact Details
-->

<template>
  <!-- Critical action modal for carrier delete operation -->
  <critical-action
    :open="deleteSelected"
    title="ASD-Fachkraft löschen"
    message="Möchten Sie die ASD-Fachkraft wirklich löschen? Dieser Vorgang ist nicht mehr umzukehren."
    buttonCancelTitle="Abbrechen"
    buttonConfirmTitle="ASD-Fachkraft löschen"
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
  <div class="min-h-screen overflow-y-auto bg-app-bg flex">
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
        <div class="relative mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
          <!-- Profil-Header -->
          <header class="mb-6 flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
            <button
              type="button"
              @click="goBack"
              title="Zurück zur Übersicht"
              class="shrink-0 rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
            >
              <ArrowLeftIcon class="h-5 w-5" aria-hidden="true" />
            </button>
            <InitialsAvatar :name="fullName" size-class="h-14 w-14 text-lg" />
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <h1 class="font-display text-2xl font-black tracking-tight text-slate-900">{{ fullName }}</h1>
              </div>
              <div v-if="chips.length" class="mt-2 flex flex-wrap gap-2">
                <span
                  v-for="chip in chips"
                  :key="chip"
                  class="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                >{{ chip }}</span>
              </div>
            </div>
          </header>
          <div class="space-y-6">
            <!-- Profil & Kostenträger-Zuordnung (nebeneinander) -->
            <div class="grid gap-5 lg:grid-cols-2">
              <!-- Profil -->
              <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
                <h3 class="font-display text-lg font-bold text-slate-900">Profil</h3>
                <p class="mt-1 text-sm text-slate-500">Persönliche Daten der ASD-Fachkraft (Jugendamt).</p>
                <div class="mt-3">
                  <carrier-contact-data-info
                    :carrierContact="carrierContact"
                    :isLoading="propertyIsLoading"
                    @change-submit="changeSubmitted"
                  />
                </div>
              </section>

              <!-- Kostenträger-Zuordnung -->
              <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
                <h3 class="font-display text-lg font-bold text-slate-900">Kostenträger</h3>
                <p class="mt-1 text-sm text-slate-500">Zugeordneter Kostenträger dieses Kontaktes.</p>
                <div class="mt-3">
                  <CarrierSelection
                    :preSelected="carrierContact.carrier"
                    @carrier-selected="setCarrier"
                    @carrier-removed="removeCarrier"
                  />
                </div>
              </section>
            </div>

            <!-- Verknüpfte Klienten (volle Breite) -->
            <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
              <CarrierContactDetailChildrenList
                @child-selected="addChild"
                @remove-child="removeChild"
                :carrierContact="carrierContact"
              />
            </section>

            <!-- Konto (volle Breite) -->
            <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
              <carrier-contact-detail-account-info
                :carrier="carrierContact"
                :deleteIsLoading="deleteIsLoading"
                :userStateIsLoading="userStateIsLoading"
                @delete-carrier-contact-tapped="deleteCarrierContactTapped"
              />
            </section>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
// Vue imports
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
// Component imports
import InitialsAvatar from '@/components/UIComponents/InitialsAvatar.vue'
import CarrierContactDataInfo from '@/components/Main/Admin/CarrierContact/CarrierContactDataInfo.vue'
import CarrierContactDetailChildrenList from '@/components/Main/Admin/CarrierContact/CarrierContactDetailChildrenList.vue'
import CarrierContactDetailAccountInfo from '@/components/Main/Admin/CarrierContact/CarrierContactDetailAccountInfo.vue'
import CriticalAction from '@/components/UIComponents/Modals/CriticalAction.vue'
import ErrorWindow from '@/components/UIComponents/Modals/ErrorWindow.vue'
import SuccessWindow from '@/components/UIComponents/Modals/SuccessWindow.vue'
import LoadingSpinner from '@/components/UIComponents/Utilities/LoadingSpinner.vue'
import CarrierSelection from '@/components/Main/Admin/CarrierContact/CarrierSelection.vue'
// Utility imports
import {
  createErrorMessage,
  createErrorTitle
} from '@/utilities/auth/errorCreator.js'

export default {
  components: {
    CarrierContactDataInfo,
    CarrierContactDetailAccountInfo,
    CarrierContactDetailChildrenList,
    CriticalAction,
    LoadingSpinner,
    SuccessWindow,
    ErrorWindow,
    CarrierSelection,
    InitialsAvatar,
    ArrowLeftIcon
  },
  props: ['id'],
  setup() {
    // Initialize Refs
    const carrierContact = ref(null)
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

    // --- Profil-Header (Anzeige) ---
    const fullName = computed(() => {
      const c = carrierContact.value
      if (!c) return ''
      return `${c.name || ''} ${c.familyName || ''}`.trim() || 'ASD-Fachkraft'
    })
    const chips = computed(() => {
      const c = carrierContact.value || {}
      const list = []
      if (c.carrier?.name) list.push(c.carrier.name)
      if (c.email) list.push(c.email)
      if (c.phone) list.push(c.phone)
      return list
    })
    const childCount = computed(
      () => carrierContact.value?.children?.items?.length ?? 0
    )
    function goBack() {
      router.push({ name: 'CarrierContactOverview' })
    }

    // Mounted Hook
    onMounted(async () => {
      // Get the id from the route
      const id = route.params.id
      // Fetch the carrier details from AppSync
      await fetchCarrierContactDetails(id)
    })

    // Fetch the carrier details from AppSync
    async function fetchCarrierContactDetails(id) {
      try {
        isLoading.value = true
        // The sub for the carrier is the id
        const sub = id
        carrierContact.value = await store.dispatch(
          'fetchCarrierContactDetails',
          {
            sub
          }
        )
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
    function deleteCarrierContactTapped() {
      // Set the selected value to true to trigger the modal
      deleteSelected.value = true
    }

    // This method gets called, when the admin confirmed the deletion of the selected carrier
    async function confirmedDelete() {
      deleteSelected.value = false
      deleteIsLoading.value = true
      try {
        await store.dispatch('deleteCarrierContact', {
          carrierContact: carrierContact.value
        })
        deleteIsLoading.value = false
        // Show success window when user was successfully removed
        customSuccess.isPresent = true
        customSuccess.title = 'Erfolgreich gelöscht'
        customSuccess.message =
          'Sie haben die ASD-Fachkraft erfolgreich gelöscht!'
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
      router.push({ name: 'CarrierContactOverview' })
    }

    // Admin confirmed a error modal
    function customErrorConfirmed() {
      router.push({ name: 'CarrierContactOverview' })
    }

    // Gets called, whenever an carrier attribute is changed by the admin
    async function changeSubmitted(changeObject) {
      await updateCarrierContact(changeObject)
    }

    // Update the carrier attributes
    async function updateCarrierContact(changeObject) {
      // Set the target object to flag his loading
      propertyIsLoading.property = Object.keys(changeObject)[0]
      propertyIsLoading.isLoading = true
      try {
        // Update the carrier
        await store.dispatch('updateCarrierContact', {
          carrierContact: carrierContact.value,
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

    async function addChild(child) {
      // check if child is already connected to carrier
      const childIndex = carrierContact.value.children.items.findIndex(
        (childAttr) => {
          return childAttr.id === child.id
        }
      )

      // only add child if it isnt already connected
      if (childIndex < 0) {
        try {
          // Update the child
          await store.dispatch('updateChild', {
            child: child,
            changeObject: {
              carrierContactChildrenId: carrierContact.value.id
            }
          })
        } catch (err) {
          // Log the error
          console.log(err.response.data.message)
        } finally {
          // add child to carrier child items array
          carrierContact.value.children.items.push(child)
        }
      }
    }

    async function removeChild(child) {
      try {
        // Update the child
        await store.dispatch('updateChild', {
          child: child,
          changeObject: { carrierContactChildrenId: null }
        })
      } catch (err) {
        console.log(err)
      } finally {
        // get index of deleted object in carrier object
        const childIndex = carrierContact.value.children.items.findIndex(
          (childAttr) => {
            return childAttr.id === child.id
          }
        )
        // delete child from carrier object
        delete carrierContact.value.children.items.splice(childIndex, 1)
      }
    }

    // set new carrier to carrier contact
    async function setCarrier(carrier) {
      await updateCarrierContact({ carrierCarrierContactsId: carrier.id })
    }

    // remove carrier from carrier contact
    async function removeCarrier() {
      await updateCarrierContact({ carrierCarrierContactsId: null })
    }

    // Function to update the local label values after updating the backend values
    function updateUIValues(changeObject) {
      const changeKey = Object.keys(changeObject)[0]
      const changeValue = changeObject[changeKey]

      carrierContact.value[changeKey] = changeValue
    }

    // Return the setup object
    return {
      isLoading,
      userStateIsLoading,
      groupIsLoading,
      deleteIsLoading,
      propertyIsLoading,
      carrierContact,
      fullName,
      chips,
      childCount,
      goBack,
      deleteSelected,
      customError,
      customSuccess,
      customSuccessConfirmed,
      customErrorConfirmed,
      deleteCarrierContactTapped,
      confirmedDelete,
      changeSubmitted,
      addChild,
      removeChild,
      setCarrier,
      removeCarrier
    }
  }
}
</script>
