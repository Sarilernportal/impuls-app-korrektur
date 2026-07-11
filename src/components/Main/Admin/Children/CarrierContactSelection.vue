<template>
  <div class="w-full">
    <!-- carrier contacts -->
    <UserSelectionModal
      :open="carrierContactsOpen"
      :people="carrierContacts"
      :showLoadMore="carriersLoadMoreAvailable"
      @person-selected="carrierSelected"
      @close-modal="carrierContactsOpen = false"
      @load-more="fetchCarrierContacts(false)"
      @query-set="setSearchValue"
    />

    <!-- create new ASD-Fachkraft modal -->
    <TransitionRoot :show="createOpen" as="template" appear>
      <HDialog as="div" class="relative z-20" @close="closeCreate">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-slate-900/40 transition-opacity" />
        </TransitionChild>
        <div class="fixed ml-0 md:ml-52 inset-0 z-20 overflow-y-auto p-4 sm:p-6 md:p-20 grid place-items-center">
          <TransitionChild
            class="w-full"
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="mx-auto w-full max-w-lg transform overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-200 transition-all"
            >
              <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <div>
                  <h3 class="font-display text-lg font-bold text-slate-900">Neue ASD-Fachkraft anlegen</h3>
                  <p class="text-sm text-secondaryText">Wird direkt mit diesem Klienten verknüpft.</p>
                </div>
                <button
                  class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                  @click="closeCreate"
                >
                  <XMarkIcon class="h-5 w-5" />
                </button>
              </div>
              <form class="space-y-4 px-6 py-5" @submit.prevent="submitCreate">
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label class="block text-xs font-medium text-slate-500">Vorname *</label>
                    <input
                      v-model="form.name"
                      data-testid="new-asd-name"
                      type="text"
                      class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-impuls-blue focus:ring-impuls-blue"
                      placeholder="Vorname"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-slate-500">Nachname *</label>
                    <input
                      v-model="form.familyName"
                      data-testid="new-asd-familyname"
                      type="text"
                      class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-impuls-blue focus:ring-impuls-blue"
                      placeholder="Nachname"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-slate-500">E-Mail</label>
                    <input
                      v-model="form.email"
                      type="email"
                      class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-impuls-blue focus:ring-impuls-blue"
                      placeholder="name@jugendamt.de"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-slate-500">Telefon</label>
                    <input
                      v-model="form.phone"
                      type="tel"
                      class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-impuls-blue focus:ring-impuls-blue"
                      placeholder="+49 …"
                    />
                  </div>
                </div>
                <p
                  v-if="carrier"
                  class="text-xs text-secondaryText"
                >Kostenträger: <span class="font-medium text-slate-700">{{ carrier.name }}</span></p>
                <p
                  v-if="createError"
                  class="text-sm text-red-600"
                >{{ createError }}</p>
                <div class="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                    @click="closeCreate"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    data-testid="new-asd-save"
                    :disabled="saving"
                    class="rounded-xl bg-impuls-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50"
                  >
                    {{ saving ? 'Speichern …' : 'Anlegen & verknüpfen' }}
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </HDialog>
    </TransitionRoot>

    <div class="w-full flex flex-col md:flex-row gap-4 md:gap-8 md:items-center">
      <!-- selected carrier contact -->
      <div class="w-full md:w-1/2 flex flex-col md:flex-row gap-2">
        <p class="text-primaryText font-medium align-middle">ASD-Fachkraft:</p>
        <div
          v-if="selectedCarrierContact !== null"
          class="text-primaryText flex gap-2"
        >
          <span
            v-if="carrierContactName"
            class="whitespace-pre-wrap break-words"
          >{{ carrierContactName }}</span>
          <span
            v-if="carrierContactFamilyName"
            class="whitespace-pre-wrap break-words"
          >{{ carrierContactFamilyName }}</span>
          <span
            v-if="!carrierContactFamilyName && !carrierContactName"
            class="whitespace-pre-wrap break-words"
          >Nicht angegeben</span>
          <button
            @click="carrierRemoved"
            class="w-7 h-7 aspect-square p-1 text-white bg-red-500 hover:bg-red-400 rounded-full mr-2 cursor-pointer"
          >
            <XMarkIcon />
          </button>
        </div>
        <p
          v-else
          class="text-primaryText font-thin"
        >Nicht ausgewählt</p>
      </div>
      <!-- select / create carrier contact -->
      <div class="w-full md:w-1/2 flex gap-2">
        <button
          type="button"
          @click="openCarrierContacts"
          class="flex-1 text-sm text-center font-medium text-white rounded-xl bg-indigo-600 hover:bg-indigo-700 cursor-pointer py-2 px-4"
        >
          ASD-Fachkraft auswählen
        </button>
        <button
          type="button"
          data-testid="new-asd-open"
          @click="openCreate"
          class="flex items-center justify-center gap-1 text-sm font-medium text-impuls-blue rounded-xl border border-impuls-blue/40 hover:bg-brand-50 cursor-pointer py-2 px-4"
        >
          <PlusIcon class="h-4 w-4" />
          Neu anlegen
        </button>
      </div>
    </div>
  </div>
</template>

<script>
// vue imports
import { ref, reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

// component imports
import UserSelectionModal from '@/components/UIComponents/Modals/UserSelectionModal.vue'

// heroicons imports
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { PlusIcon } from '@heroicons/vue/20/solid'

// headlessui imports
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue'

export default {
  components: {
    UserSelectionModal,
    XMarkIcon,
    PlusIcon,
    HDialog: Dialog,
    DialogPanel,
    TransitionChild,
    TransitionRoot
  },
  props: {
    preSelected: {
      type: Object,
      required: false,
      default: null
    },
    // the client's current Kostenträger, so a newly created ASD-Fachkraft
    // is linked to the same carrier
    carrier: {
      type: Object,
      required: false,
      default: null
    }
  },
  emits: ['carrier-contact-selected', 'carrier-contact-removed'],
  setup(props, { emit }) {
    // initialize refs
    const carrierContactNextToken = ref(null)
    const carrierContacts = ref([])
    const carrierContactsOpen = ref(false)
    const selectedCarrierContact = ref(null)
    const searchValue = ref('')

    // create-new state
    const createOpen = ref(false)
    const saving = ref(false)
    const createError = ref('')
    const form = reactive({ name: '', familyName: '', email: '', phone: '' })

    // Initialize the store
    const store = useStore()

    // get list of carrier contacts
    async function openCarrierContacts() {
      try {
        if (carrierContacts.value.length === 0) {
          await fetchCarrierContacts(true)
        }
        carrierContactsOpen.value = true
      } catch (error) {
        console.log(error)
      }
    }

    // fetch carrier contacts from API
    async function fetchCarrierContacts(initial) {
      try {
        const carrierResponse = await store.dispatch('fetchCarrierContacts', {
          nextToken: carrierContactNextToken.value,
          filter: searchValue.value
        })
        // if it's the first request, overwrite the carrier contact object, else add to object array
        if (initial) {
          var tempCarrier = []
          for (const carrier of carrierResponse.items) {
            tempCarrier.push(carrier)
          }
          carrierContacts.value = tempCarrier
        } else {
          for (const carrier of carrierResponse.items) {
            carrierContacts.value.push(carrier)
          }
        }

        carrierContactNextToken.value = carrierResponse.nextToken
        // due to how the pagination works in AppSync, sometimes empty pages are returned if no filtered Object was found
        // if that happens, we pull again, unless the nextToken is null, indicating no more pullable objects
        if (
          carrierResponse.items.length <= 0 &&
          carrierResponse.nextToken !== null
        ) {
          fetchCarrierContacts()
        }
      } catch (error) {
        console.log(error)
      }
    }

    async function setSearchValue(value) {
      // set search value for ListItem
      searchValue.value = value
      carrierContactNextToken.value = null
      carrierContacts.value = []
      await fetchCarrierContacts(true)
    }

    // set selected carrier contact
    function carrierSelected(selection) {
      selectedCarrierContact.value = selection
      emit('carrier-contact-selected', selection)
      carrierContactsOpen.value = false
    }

    function carrierRemoved() {
      selectedCarrierContact.value = null
      emit('carrier-contact-removed')
    }

    // open the create-new form
    function openCreate() {
      createError.value = ''
      form.name = ''
      form.familyName = ''
      form.email = ''
      form.phone = ''
      createOpen.value = true
    }

    function closeCreate() {
      createOpen.value = false
    }

    // create a new ASD-Fachkraft and immediately link it to the client
    async function submitCreate() {
      createError.value = ''
      if (!form.name.trim() || !form.familyName.trim()) {
        createError.value = 'Bitte Vor- und Nachname angeben.'
        return
      }
      saving.value = true
      try {
        const response = await store.dispatch('addCarrierContact', {
          name: form.name.trim(),
          familyName: form.familyName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          carrier: props.carrier || null
        })
        const created = response?.data?.createCarrierContact
        if (!created) {
          throw new Error('Anlegen fehlgeschlagen.')
        }
        // make it available in the selection list for later, then link it
        carrierContacts.value.unshift(created)
        carrierSelected(created)
        createOpen.value = false
      } catch (error) {
        console.log(error)
        createError.value = 'Anlegen fehlgeschlagen. Bitte erneut versuchen.'
      } finally {
        saving.value = false
      }
    }

    // check if more carrierContacts can be loaded from API
    const carriersLoadMoreAvailable = computed(() => {
      if (
        carrierContactNextToken.value === null &&
        carrierContacts.value.length > 0
      ) {
        return false
      }
      return true
    })

    // get carrier contact name
    const carrierContactName = computed(() => {
      try {
        return selectedCarrierContact.value.name
      } catch (error) {
        return null
      }
    })

    // get carrier contact family name
    const carrierContactFamilyName = computed(() => {
      try {
        return selectedCarrierContact.value.familyName
      } catch (error) {
        return null
      }
    })

    function checkPreSelected() {
      if (props.preSelected !== null) {
        selectedCarrierContact.value = props.preSelected
      }
    }

    onMounted(() => {
      checkPreSelected()
    })

    return {
      carrierContacts,
      carrierContactsOpen,
      selectedCarrierContact,
      carriersLoadMoreAvailable,
      carrierContactName,
      carrierContactFamilyName,
      carrierSelected,
      carrierRemoved,
      openCarrierContacts,
      fetchCarrierContacts,
      setSearchValue,
      createOpen,
      saving,
      createError,
      form,
      openCreate,
      closeCreate,
      submitCreate
    }
  }
}
</script>
