<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
19.01.2023

Scope:
Guardian Overview List
-->

<template>
  <!-- Main Container -->
  <div class="w-full">
    <!-- Header for the overview list -->
    <guardian-admin-overview-list-header
      :listContent="content"
      :guardianCount="guardianCount"
    />
    <!-- Search Bar -->
    <div class="flex justify-center items-center w-full lg:w-1/2 mx-auto h-12">
      <MagnifyingGlassIcon class="h-6 w-6 mt-2 mr-2 text-slate-400" />
      <text-textfield
        class="w-2/3 h-10 rounded-2xl"
        v-bind:elementID="elementId"
        name="searchfield"
        v-bind:placeholder="searchFieldText"
        @input-value="setSearchValue"
      />
    </div>
    <!-- filter for archived/unarchived -->
    <div class="flex gap-2 px-6 py-2 items-end sm:items-center">
      <SwitchableInfo
        class="py-0 w-full"
        title="Nur inaktive Betreuer anzeigen?"
        propertyKey="showArchived"
        :isActive="showArchived"
        :value="showArchived ? 'Ja' : 'Nein'"
        @button-toggled="showArchivedChanged"
        :isLoading="false"
      />
    </div>
    <!-- timesheet status filter -->
    <div class="flex justify-end p-2">
      <SimpleDropdown
        title="Abgegeben für"
        :properties="[
          'Alle',
          'Aktuellen Monat',
          'Letzten Monat',
          'Ältere Monate'
        ]"
        defaultSelected="Alle"
        @selection="setStatusFilter"
      />
    </div>
    <!-- User List -->
    <guardian-admin-list
      v-if="sortedUsers.length > 0 || isLoading"
      @sort-event="sortEvent"
      :guardians="sortedUsers"
      :userType="content"
      :menuItems="menuItems"
      :isLoading="isLoading"
    />
    <!-- display if no other guardians were found -->
    <div v-else class="w-full h-full flex justify-center items-center py-6">
      <!-- title -->
      <h3 class="text-center font-semibold text-secondaryText text-xl">
        keine weiteren Betreuer verfügbar
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
import GuardianAdminOverviewListHeader from '@/components/Main/Admin/Guardian/GuardianAdminOverviewListHeader.vue'
import PaginationBar from '@/components/Others/PaginationBar.vue'
import GuardianAdminList from '@/components/Main/Admin/Guardian/GuardianAdminList.vue'
import TextTextfield from '@/components/UIComponents/Inputs/TextTextfield.vue'
import SimpleDropdown from '@/components/UIComponents/Dropdowns/SimpleDropdown.vue'
import SwitchableInfo from '@/components/UIComponents/Selections/SwitchableInfo.vue'
// heroicons imports
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import _ from 'lodash'

export default {
  name: 'GuardianOverviewList',
  components: {
    GuardianAdminOverviewListHeader,
    PaginationBar,
    GuardianAdminList,
    MagnifyingGlassIcon,
    TextTextfield,
    SimpleDropdown,
    SwitchableInfo
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
    const guardians = ref([])
    const sortDirection = ref('ascending')
    const sortValue = ref('Enabled')
    const menuItems = ref(props.content.menuItems)
    const searchValue = ref('')
    const elementId = ref(`searchfield-${props.content.name}`)
    const searchFieldText = ref('Suche hier...')
    const nextToken = ref([null])
    const currentSite = ref(0)
    const filterStatus = ref(null)
    const showArchived = ref(false)
    const guardianCount = ref(0)

    // Initialize Store
    const store = useStore()

    onMounted(() => {
      fetchGuardians(true)
    })

    // Define the debounced function in your setup or methods section
    const debouncedFetchGuardians = _.debounce(async function (forward) {
      isLoading.value = true
      try {
        const payload = {
          showArchived: showArchived.value,
          nextToken: nextToken.value[currentSite.value],
          filter: searchValue.value
        }

        // Add status filter if selected by admin
        if (filterStatus.value) {
          payload.filterStatus = filterStatus.value
        }

        // Get the response
        const response = await store.dispatch('fetchGuardians', payload)

        // Store the response data in the ref variables
        guardians.value = response.items

        if (forward) {
          nextToken.value.push(response.nextToken)
        }
      } catch (err) {
        console.log(err)
      } finally {
        isLoading.value = false
        setSearchFieldText()
        await countGuardians()
      }
    }, 500) // Set debounce delay to 500ms

    // Call the debounced function in place of the original function
    function fetchGuardians(forward) {
      debouncedFetchGuardians(forward)
    }

    // count all available guardians
    async function countGuardians() {
      try {
        const payload = {
          searchValue: searchValue.value,
          showArchived: showArchived.value
        }
        // provide status filter if selected by admin
        if (filterStatus.value) {
          payload.filterStatus = filterStatus.value
        }

        // count via store --> appsync
        const resp = await store.dispatch('countGuardians', payload)
        // save number in ref
        guardianCount.value = resp
      } catch (error) {
        console.log(error)
      }
    }

    // Callback when the user wants to switch to the next site
    async function paginateToNextTapped() {
      currentSite.value += 1
      await fetchGuardians(true)
    }

    // Callback when the user wants to switch to the previous site
    async function paginateToPreviousTapped() {
      currentSite.value -= 1
      await fetchGuardians(false)
    }

    async function setSearchValue(value) {
      // set current site to 0
      currentSite.value = 0

      // set search value for ListItem
      searchValue.value = value
      nextToken.value = [null]
      guardians.value = []
      await fetchGuardians(true)
    }

    // set filter for timesheet hand in status
    async function setStatusFilter(event) {
      // create filter item
      if (event === 'Alle') {
        filterStatus.value = null
      } else {
        filterStatus.value =
          event === 'Aktuellen Monat'
            ? 'after'
            : event === 'Letzten Monat'
            ? 'between'
            : 'before'
      }

      // set current site to 0
      currentSite.value = 0

      // set search value for ListItem
      nextToken.value = [null]
      guardians.value = []
      await fetchGuardians(true)
    }

    function setSearchFieldText() {
      // set search field text to values in menuItems of content, exclude values defined in exlude
      let searchText = 'Suche nach '
      const exclude = ['Berichtstatus', 'Kontakt', 'Fachkraftstatus', 'Abgabestatus']
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
      if (guardians.value.length === 0) {
        return []
      }

      const sortUsers = guardians.value
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

    // change status for showing special times reports
    async function showArchivedChanged(val) {
      try {
        // update ref to display correct button status
        showArchived.value = val.showArchived

        // set current site to 0
        currentSite.value = 0

        // set search value for ListItem
        searchValue.value = ''
        nextToken.value = [null]
        guardians.value = []
        await fetchGuardians(true)
      } catch (error) {
        console.log(error)
      }
    }

    // Check if the next page is available
    const nextPageAvailable = computed(() => {
      return nextToken.value[currentSite.value + 1] !== null ? true : false
    })

    return {
      isLoading,
      guardians,
      sortedUsers,
      nextPageAvailable,
      currentSite,
      menuItems,
      showArchived,
      guardianCount,
      sortEvent,
      elementId,
      setSearchValue,
      searchFieldText,
      paginateToNextTapped,
      paginateToPreviousTapped,
      setStatusFilter,
      showArchivedChanged
    }
  }
}
</script>
