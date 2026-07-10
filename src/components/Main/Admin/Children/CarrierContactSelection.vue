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
    <div class="w-full flex gap-8 items-center">
      <!-- selected carrier contact -->
      <div class="w-1/2 flex flex-col md:flex-row gap-2">
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
      <!-- add carrier contact -->
      <div class="w-1/2 text-white flex justify-center">
        <div
          @click="openCarrierContacts"
          class="w-full text-sm text-center flex justify-center font-medium text-white rounded-xl bg-indigo-600 hover:bg-indigo-700 cursor-pointer py-2 px-4"
        >
          <div class="self-center">ASD-Fachkraft auswählen</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// vue imports
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

// component imports
import UserSelectionModal from '@/components/UIComponents/Modals/UserSelectionModal.vue'

// heroicons imports
import { XMarkIcon } from '@heroicons/vue/24/outline'

export default {
  components: {
    UserSelectionModal,
    XMarkIcon
  },
  props: {
    preSelected: {
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
      setSearchValue
    }
  }
}
</script>