<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
22.02.2023

Scope:
Carrier Contact Overview List
-->

<template>
  <!-- Main Container -->
  <div class="w-full">
    <!-- Header for the overview list -->
    <carrier-contact-overview-list-header :listContent="content" />
    <!-- Search Bar -->
    <div class="flex justify-center items-center w-full lg:w-1/2 mx-auto h-12">
      <MagnifyingGlassIcon class="h-6 w-6 mt-2 mr-2 text-gray-400" />
      <text-textfield
        class="w-2/3 h-10 rounded-2xl"
        v-bind:elementID="elementId"
        name="searchfield"
        v-bind:placeholder="searchFieldText"
        @input-value="setSearchValue"
      />
    </div>
    <!-- User List -->
    <carrier-contact-list
      v-if="sortedUsers.length > 0 || isLoading"
      @sort-event="sortEvent"
      :carrierContacts="sortedUsers"
      :userType="content"
      :menuItems="menuItems"
      :isLoading="isLoading"
    />
    <!-- display if no other carrierContacts were found -->
    <div v-else class="w-full h-full flex justify-center items-center py-6">
      <!-- title -->
      <h3 class="text-center font-semibold text-white text-xl">
        keine weiteren Kostenträger verfügbar
      </h3>
    </div>
    <!-- Pagination Bar -->
    <pagination-bar
      v-if="!isLoading"
      @to-next="paginateToNextTapped"
      @to-previous="paginateToPreviousTapped"
      :page="currentSite"
      :nextPageAvailable="nextPageAvailable"
    />
  </div>
</template>

<script>
// Vue imports
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
// Component imports
import CarrierContactOverviewListHeader from '@/components/Main/Admin/CarrierContact/CarrierContactOverviewListHeader.vue'
import PaginationBar from '@/components/Others/PaginationBar.vue'
import CarrierContactList from '@/components/Main/Admin/CarrierContact/CarrierContactList.vue'
import TextTextfield from '@/components/UIComponents/Inputs/TextTextfield.vue'
// heroicons imports
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'CarrierOberviewList',
  components: {
    CarrierContactOverviewListHeader,
    PaginationBar,
    CarrierContactList,
    MagnifyingGlassIcon,
    TextTextfield
  },
  props: {
    content: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    // Initialize Refs
    const isLoading = ref(false)
    const carrierContacts = ref([])
    const sortDirection = ref('ascending')
    const sortValue = ref('Enabled')
    const menuItems = ref(props.content.menuItems)
    const searchValue = ref('')
    const elementId = ref(`searchfield-${props.content.name}`)
    const searchFieldText = ref('Suche hier...')
    const nextToken = ref([null])
    const currentSite = ref(0)
    const guardians = ref({})

    // Initialize Store
    const store = useStore()

    onMounted(() => {
      fetchCarrierContacts(true)
    })

    // Fetch the carrierContacts as well check if we have a token for pagination
    async function fetchCarrierContacts(forward) {
      isLoading.value = true
      try {
        const payload = {
          nextToken: nextToken.value[currentSite.value],
          filter: searchValue.value
        }
        // Get the response
        const response = await store.dispatch('fetchCarrierContacts', payload)
        // Store the response data in the ref variables
        carrierContacts.value = response.items

        if (forward) {
          nextToken.value.push(response.nextToken)
        }
      } catch (err) {
        console.log(err)
      } finally {
        isLoading.value = false
        setSearchFieldText()
      }
    }

    // Callback when the user wants to switch to the next site
    async function paginateToNextTapped() {
      currentSite.value += 1
      await fetchCarrierContacts(true)
    }

    // Callback when the user wants to switch to the previous site
    async function paginateToPreviousTapped() {
      currentSite.value -= 1
      await fetchCarrierContacts(false)
    }

    async function setSearchValue(value) {
      // set current site to 0
      currentSite.value = 0

      // set search value for ListItem
      searchValue.value = value
      nextToken.value = [null]
      carrierContacts.value = []
      await fetchCarrierContacts(true)
    }

    function setSearchFieldText() {
      // set search field text to values in menuItems of content, exclude values defined in exlude
      let searchText = 'Suche nach '
      const exclude = [
        'Status',
        'Bearbeiten',
        'Registriert',
        'Adresse',
        'Kontakt',
        'Kostenträger'
      ]
      const contentProp = props.content.menuItems
      for (const item in contentProp) {
        if (!exclude.includes(contentProp[item].value)) {
          // add " | " to end of string to seperate search parameters, expect after final element
          searchText = searchText + contentProp[item].value + ' | '
        }
      }
      // remove last separator --> |
      searchText = searchText.slice(0, -3)
      // set ref for displaying in html
      searchFieldText.value = searchText
    }

    const sortedUsers = computed(() => {
      if (carrierContacts.value.length === 0) {
        return []
      }

      const sortUsers = carrierContacts.value
      if (sortUsers.length === 0) {
        return []
      }
      // Sort the array to ascending or descending based on users desicion.
      if (sortDirection.value === 'ascending') {
        return sortUsers.sort(ascending)
      } else {
        return sortUsers.sort(descending)
      }
    })

    // sort items ascending by given value
    function ascending(a, b) {
      const aValue = a[sortValue.value];
      const bValue = b[sortValue.value];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue);
      }
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    }

    // sort items descending by given value
    function descending(a, b) {
      const aValue = a[sortValue.value];
      const bValue = b[sortValue.value];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return bValue.localeCompare(aValue);
      }
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }

    function sortEvent(event) {
      sortDirection.value = event.direction
      sortValue.value = event.value

      // iterate through menu header items and set sorted true
      // if the emitted value equals the header item, else set false
      // this is required for resetting the sort buttons of each header item
      for (const item in menuItems.value) {
        if (menuItems.value[item].emitValue === event.value) {
          menuItems.value[item].sorted = true
        } else {
          menuItems.value[item].sorted = false
        }
      }
    }

    // Check if the next page is available
    const nextPageAvailable = computed(() => {
      return nextToken.value[currentSite.value + 1] !== null ? true : false
    })

    return {
      isLoading,
      carrierContacts,
      guardians,
      sortedUsers,
      nextPageAvailable,
      currentSite,
      menuItems,
      sortEvent,
      elementId,
      setSearchValue,
      searchFieldText,
      paginateToNextTapped,
      paginateToPreviousTapped
    }
  }
}
</script>
