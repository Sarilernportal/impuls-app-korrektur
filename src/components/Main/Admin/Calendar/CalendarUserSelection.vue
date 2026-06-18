<template>
  <div class="w-full">
    <!-- contacts -->
    <CognitoUserSelectionModal
      :open="contactsOpen"
      :people="contacts"
      :showLoadMore="contactsLoadMoreAvailable"
      @person-selected="contactSelected"
      @close-modal="contactsOpen = false"
      @load-more="fetchUser(false)"
      @query-set="setSearchValue"
    />
    <!-- selection -->
    <div class="w-full flex gap-8">
      <!-- add button-->
      <div class="w-full text-white flex justify-center">
        <!-- loading spinner container -->
        <div v-if="isLoading" class="flex w-full h-full justify-center mt-4">
          <LoadingSpinner size="h-8 w-8" />
        </div>
        <div
          v-else
          @click="openContacts"
          :class="[
            enableAddButton
              ? 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
              : 'bg-gray-600 hover:bg-gray-700 cursor-not-allowed',
            'w-1/2 text-sm text-center flex justify-center font-medium text-white rounded-xl  py-2 px-4'
          ]"
        >
          <div class="self-center">Teilnehmer hinzufügen</div>
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
import CognitoUserSelectionModal from '@/components/UIComponents/Modals/CognitoUserSelectionModal.vue'
import LoadingSpinner from '@/components/UIComponents/Utilities/LoadingSpinner.vue'

export default {
  components: {
    CognitoUserSelectionModal,
    LoadingSpinner
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
    const isLoading = ref(false)

    // Initialize the store
    const store = useStore()

    // get list of contacts
    async function openContacts() {
      if (props.enableAddButton) {
        try {
          if (contacts.value.length === 0) {
            await fetchUser(true)
          }
          contactsOpen.value = true
        } catch (error) {
          console.log(error)
        }
      }
    }

    // fetch contacts from API
    async function fetchUser(initial) {
      try {
        // set loading state
        isLoading.value = true

        const contactsResponse = await store.dispatch('calendarFetchUsers', {
          nextToken: contactNextToken.value,
          filter: searchValue.value
        })
        // if it's the first request, overwrite the contact object, else add to object array
        if (initial) {
          var tempContacts = []
          for (const contact of contactsResponse.Users) {
            tempContacts.push(contact)
          }
          contacts.value = tempContacts
        } else {
          for (const contact of contactsResponse.Users) {
            contacts.value.push(contact)
          }
        }
        contactNextToken.value = contactsResponse.NextToken
        // due to how the pagination works in AppSync, sometimes empty pages are returned if no filtered Object was found
        // if that happens, we pull again, unless the nextToken is null, indicating no more pullable objects
        if (
          contactsResponse.Users.length <= 0 &&
          contactNextToken.value !== null
        ) {
          fetchUser()
        }
      } catch (error) {
        console.log(error)
      } finally {
        // set loading state
        isLoading.value = false
      }
    }

    async function setSearchValue(value) {
      // set search value for ListItem
      searchValue.value = value
      contactNextToken.value = null
      contacts.value = []
      await fetchUser(true)
    }

    // set selected contact
    function contactSelected(selection) {
      emit('contact-selected', selection)
      contactsOpen.value = false
    }

    // check if more contacts can be loaded from API
    const contactsLoadMoreAvailable = computed(() => {
      if (!contactNextToken.value && contacts.value.length > 0) {
        return false
      }
      return true
    })

    return {
      contacts,
      contactsOpen,
      contactsLoadMoreAvailable,
      isLoading,
      openContacts,
      contactSelected,
      fetchUser,
      setSearchValue
    }
  }
}
</script>