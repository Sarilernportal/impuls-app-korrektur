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
    title="Kostenträger löschen"
    message="Möchten Sie den Kostenträger wirklich löschen? Dieser Vorgang ist nicht mehr umzukehren."
    buttonCancelTitle="Abbrechen"
    buttonConfirmTitle="Kostenträger löschen"
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
          <div class="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <!-- Hauptinhalt: gestapelte Sektionen -->
            <div class="min-w-0 space-y-6">
              <!-- Profil & Rechnungsadresse (nebeneinander) -->
              <div class="grid gap-5 sm:grid-cols-2">
                <!-- Profil -->
                <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
                  <h3 class="font-display text-lg font-bold text-slate-900">Profil</h3>
                  <p class="mt-1 text-sm text-slate-500">Persönliche Daten des Kostenträgers.</p>
                  <div class="mt-3">
                    <carrier-detail-data-info
                      :carrier="carrier"
                      :isLoading="propertyIsLoading"
                      @change-submit="changeSubmitted"
                    />
                  </div>
                </section>

                <!-- Rechnungsadresse -->
                <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
                  <h3 class="font-display text-lg font-bold text-slate-900">Rechnungsadresse</h3>
                  <p class="mt-1 text-sm text-slate-500">Informationen über die Rechnungsadresse des Kostenträgers.</p>
                  <div class="mt-3">
                    <CarrierBillingInfo
                      :carrier="carrier"
                      :isLoading="propertyIsLoading"
                      @change-submit="changeSubmitted"
                    />
                  </div>
                </section>
              </div>

              <!-- Kostenträger-Kontakte -->
              <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
                <CarrierDetailContactList
                  @contact-selected="addContact"
                  @remove-contact="removeContact"
                  :carrier="carrier"
                />
              </section>

              <!-- Konto -->
              <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
                <carrier-detail-account-info
                  :carrier="carrier"
                  :deleteIsLoading="deleteIsLoading"
                  :userStateIsLoading="userStateIsLoading"
                  @delete-carrier-tapped="deleteCarrierTapped"
                />
              </section>
            </div>
            <!-- Schnellzugriff (rechts, sticky) -->
            <aside class="space-y-6 lg:sticky lg:top-8 lg:self-start">
              <!-- Aktionen -->
              <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
                <h3 class="font-display text-base font-bold text-slate-900">Schnellzugriff</h3>
                <div class="mt-4 space-y-2">
                  <button type="button" @click="goToInvoices"
                    class="flex w-full items-center gap-3 rounded-xl bg-impuls-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700">
                    <DocumentTextIcon class="h-5 w-5" aria-hidden="true" /> Rechnungen
                  </button>
                  <button type="button" @click="goToBilling"
                    class="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                    <BanknotesIcon class="h-5 w-5 text-slate-400" aria-hidden="true" /> Abrechnung
                  </button>
                  <button type="button" @click="deleteCarrierTapped"
                    class="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50">
                    <TrashIcon class="h-5 w-5" aria-hidden="true" /> Kostenträger löschen
                  </button>
                </div>
              </div>
              <!-- Kennzahlen -->
              <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
                <h3 class="font-display text-base font-bold text-slate-900">Kennzahlen</h3>
                <dl class="mt-4 space-y-3 text-sm">
                  <div class="flex items-center justify-between">
                    <dt class="text-slate-500">Abkürzung</dt>
                    <dd class="font-semibold text-slate-900">{{ carrier.shortName || '—' }}</dd>
                  </div>
                  <div class="flex items-center justify-between">
                    <dt class="text-slate-500">Ort</dt>
                    <dd class="font-semibold text-slate-900">{{ carrier.city || '—' }}</dd>
                  </div>
                  <div class="flex items-center justify-between">
                    <dt class="text-slate-500">E-Mail</dt>
                    <dd class="truncate pl-3 font-semibold text-slate-900">{{ carrier.email || '—' }}</dd>
                  </div>
                  <div class="flex items-center justify-between">
                    <dt class="text-slate-500">Kontakte</dt>
                    <dd class="font-semibold tabular-nums text-slate-900">{{ contactCount }}</dd>
                  </div>
                </dl>
              </div>
              <!-- Einordnung -->
              <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
                <h3 class="font-display text-base font-bold text-slate-900">Einordnung</h3>
                <p class="mt-2 text-sm font-medium text-slate-700">Kostenträger</p>
                <p class="text-xs text-slate-400">Leistungsträger §35a SGB VIII</p>
              </div>
            </aside>
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
import { ArrowLeftIcon, DocumentTextIcon, BanknotesIcon, TrashIcon } from '@heroicons/vue/24/outline'
// Component imports
import InitialsAvatar from '@/components/UIComponents/InitialsAvatar.vue'
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
    ErrorWindow,
    InitialsAvatar,
    ArrowLeftIcon,
    DocumentTextIcon,
    BanknotesIcon,
    TrashIcon
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

    // --- Profil-Header (Anzeige) ---
    const fullName = computed(() => {
      const c = carrier.value
      if (!c) return ''
      return (c.name || '').trim() || 'Kostenträger'
    })
    const chips = computed(() => {
      const c = carrier.value || {}
      const list = []
      if (c.shortName) list.push(c.shortName)
      if (c.city) list.push(c.city)
      if (c.email) list.push(c.email)
      if (c.phone) list.push(c.phone)
      return list
    })
    const contactCount = computed(
      () => carrier.value?.carrierContacts?.items?.length ?? 0
    )
    function goBack() {
      router.push({ name: 'CarrierOverview' })
    }
    // Schnellzugriff-Navigation
    function goToInvoices() {
      router.push('/admin/documents/invoices')
    }
    function goToBilling() {
      router.push('/admin/documents/billing')
    }

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
        customSuccess.message = 'Sie haben den Kostenträger erfolgreich gelöscht!'
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
      fullName,
      chips,
      contactCount,
      goBack,
      goToInvoices,
      goToBilling,
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
