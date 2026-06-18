<template>
  <div class="w-full">
    <!-- contacts -->
    <UserSelectionModal
      :open="contactsOpen"
      :people="contacts"
      :showLoadMore="contactsLoadMoreAvailable"
      @person-selected="contactSelected"
      @close-modal="contactsOpen = false"
      @load-more="fetchCarrierContacts(false)"
      @query-set="setSearchValue"
    />
    <!-- selection -->
    <div class="w-full flex gap-8">
      <!-- add button-->
      <div class="w-full text-white flex justify-center">
        <div
          @click="openContacts"
          :class="[
            enableAddButton
              ? 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
              : 'bg-gray-600 hover:bg-gray-700 cursor-not-allowed',
            'w-1/2 text-sm text-center flex justify-center font-medium text-white rounded-xl  py-2 px-4'
          ]"
        >
          <div class="self-center">Kontakt hinzufügen</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// vue imports
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

// component imports
import UserSelectionModal from '@/components/UIComponents/Modals/UserSelectionModal.vue'

export default {
  components: {
    UserSelectionModal
  },
  props: {
    enableAddButton: {
      type: Boolean,
      required: true
    }
  },
  emits: ['contact-selected'],
  setup(props, { emit }) {
    // initialize refs
    const contactNextToken = ref(null)
    const contacts = ref([])
    const contactsOpen = ref(false)
    const searchValue = ref('')

    // Initialize the store
    const store = useStore()

    // get list of contacts
    async function openContacts() {
      if (props.enableAddButton) {
        try {
          if (contacts.value.length === 0) {
            await fetchCarrierContacts(true)
          }
          contactsOpen.value = true
        } catch (error) {
          console.log(error)
        }
      }
    }

    // fetch contacts from API
    async function fetchCarrierContacts(initial) {
      try {
        const contactsResponse = await store.dispatch('fetchCarrierContacts', {
          nextToken: contactNextToken.value,
          filter: searchValue.value
        })
        // if it's the first request, overwrite the contact object, else add to object array
        if (initial) {
          var tempContacts = []
          for (const contact of contactsResponse.items) {
            tempContacts.push(contact)
          }
          contacts.value = tempContacts
        } else {
          for (const contact of contactsResponse.items) {
            contacts.value.push(contact)
          }
        }

        contactNextToken.value = contactsResponse.nextToken
        // due to how the pagination works in AppSync, sometimes empty pages are returned if no filtered Object was found
        // if that happens, we pull again, unless the nextToken is null, indicating no more pullable objects
        if (
          contactsResponse.items.length <= 0 &&
          contactNextToken.value !== null
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
      contactNextToken.value = null
      contacts.value = []
      await fetchCarrierContacts(true)
    }

    // set selected contact
    function contactSelected(selection) {
      emit('contact-selected', selection)
      contactsOpen.value = false
    }

    // check if more contacts can be loaded from API
    const contactsLoadMoreAvailable = computed(() => {
      if (contactNextToken.value === null && contacts.value.length > 0) {
        return false
      }
      return true
    })

    return {
      contacts,
      contactsOpen,
      contactsLoadMoreAvailable,
      openContacts,
      contactSelected,
      fetchCarrierContacts,
      setSearchValue
    }
  }
}
</script>