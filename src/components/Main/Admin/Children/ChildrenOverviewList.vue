<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
19.09.2022

Scope:
User Overview List
-->

<template>
  <!-- Main Container -->
  <div class="w-full">
    <!-- Header for the overview list -->
    <children-overview-list-header
      :listContent="content"
      :childCount="childCount"
    />
    <!-- Search Bar -->
    <div
      v-if="!carrier"
      class="flex justify-center items-center w-full lg:w-1/2 mx-auto h-12"
    >
      <MagnifyingGlassIcon class="h-6 w-6 mt-2 mr-2 text-gray-400" />
      <text-textfield
        class="w-2/3 h-10 rounded-2xl"
        v-bind:elementID="elementId"
        name="searchfield"
        v-bind:placeholder="searchFieldText"
        @input-value="setSearchValue"
      />
    </div>
    <!-- Carrier selection -->
    <div class="flex mt-6 px-6 items-end sm:items-center">
      <DocumentCarrierSelection
        :enableAddButton="true"
        :selectedCarrier="carrier"
        @carrier-selected="carrierSelected"
      />
      <div>
        <button
          v-if="carrier"
          @click.prevent="clearCarrier"
          class="bg-indigo-600 rounded-full text-white p-1 ml-2"
        >
          <ArrowLeftIcon class="h-6 w-6" />
        </button>
      </div>
    </div>
    <!-- filter for clients with incomplete data -->
    <div v-if="!carrier" class="flex gap-2 px-6 items-end sm:items-center">
      <SwitchableInfo
        class="py-0 w-full"
        title="Nur Unvollständige Klienten anzeigen?"
        propertyKey="dataIncomplete"
        :isActive="showDataIncomplete"
        :value="showDataIncomplete ? 'Ja' : 'Nein'"
        @button-toggled="showDataIncompleteChanged"
        :isLoading="false"
      />
    </div>
    <!-- filter for archived clients -->
    <div v-if="!carrier" class="flex gap-2 px-6 items-end sm:items-center">
      <SwitchableInfo
        class="py-0 w-full"
        title="Archivierte Klienten anzeigen?"
        propertyKey="archiveStatus"
        :isActive="showArchived"
        :value="showArchived ? 'Ja' : 'Nein'"
        @button-toggled="showArchivedChanged"
        :isLoading="false"
      />
    </div>
    <!-- User List -->
    <children-list
      v-if="sortedUsers.length > 0 || isLoading"
      @sort-event="sortEvent"
      :children="sortedUsers"
      :userType="content"
      :menuItems="menuItems"
      :isLoading="isLoading"
      :currentSite="currentSite"
    />
    <!-- display if no other children were found -->
    <div v-else class="w-full h-full flex justify-center items-center py-6">
      <!-- title -->
      <h3 class="text-center font-semibold text-white text-xl">
        keine weiteren Klienten verfügbar
      </h3>
    </div>
    <!-- Pagination Bar -->
    <pagination-bar
      v-if="!isLoading && !carrier"
      @to-next="paginateToNextTapped"
      @to-previous="paginateToPreviousTapped"
      :page="currentSite"
      :nextPageAvailable="nextPageAvailable"
    />
  </div>
</template>

<script>
// Vue imports
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
// Component imports
import ChildrenOverviewListHeader from '@/components/Main/Admin/Children/ChildrenOverviewListHeader.vue'
import DocumentCarrierSelection from '@/components/Main/Admin/Documents/DocumentCarrierSelection.vue'
import PaginationBar from '@/components/Others/PaginationBar.vue'
import ChildrenList from '@/components/Main/Admin/Children/ChildrenList.vue'
import TextTextfield from '@/components/UIComponents/Inputs/TextTextfield.vue'
import SwitchableInfo from '@/components/UIComponents/Selections/SwitchableInfo.vue'
// heroicons imports
import { MagnifyingGlassIcon, ArrowLeftIcon } from '@heroicons/vue/24/outline'
import _ from 'lodash'

export default {
  name: 'ChildrenCarrierOberviewList',
  components: {
    ChildrenOverviewListHeader,
    DocumentCarrierSelection,
    PaginationBar,
    ChildrenList,
    MagnifyingGlassIcon,
    ArrowLeftIcon,
    TextTextfield,
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
    const children = ref([])
    const childCount = ref(0)
    const sortDirection = ref('ascending')
    const sortValue = ref('Enabled')
    const menuItems = ref(props.content.menuItems)
    const searchValue = ref('')
    const elementId = ref(`searchfield-${props.content.name}`)
    const searchFieldText = ref('Suche hier...')
    const nextToken = ref([null])
    const currentSite = ref(0)
    const carrier = ref(null)
    const showDataIncomplete = ref(false)
    const preLoadingQueries = ref(false)
    const showArchived = ref(false)

    // Initialize Store
    const store = useStore()

    // Route initialization
    const route = useRoute()

    // Router initialization
    const router = useRouter()

    onMounted(async () => {
      await getFiltersFromURL()
    })

    // get filters from URL query if provided
    async function getFiltersFromURL() {
      try {
        // set loading state
        isLoading.value = true
        // create empty query params object
        const queryParams = route.query
        // check for carrier query --> pull full data via store, required for displaying info
        if (queryParams.carrierID) {
          carrier.value = await store.dispatch('fetchCarrierDetails', {
            sub: queryParams.carrierID
          })
          await fetchChildrenByCarrier()
          return
        }
        // set query params at the end, so nothing gets overwritten
        setQueryParams()
        // Get all children
        await fetchChildren(true)
        // count children
        await countChildren()
      } catch (error) {
        console.log(error)
      } finally {
        // reset loading state
        isLoading.value = false
      }
    }

    // set query parameters in URL according to used filters
    function setQueryParams() {
      // create empty query object
      const queryObject = {}
      // check if carrier was selected
      if (carrier.value) {
        queryObject.carrierID = carrier.value.id
      }
      // set query parameters in URL
      router.replace({ path: route.path, query: queryObject })
    }

    // Fetch the child as well check if we have a token for pagination
    const debouncedFetchChildren = _.debounce(async function (forward) {
      isLoading.value = true
      try {
        const payload = {
          nextToken: nextToken.value[currentSite.value],
          filter: searchValue.value,
          showDataIncomplete: showDataIncomplete.value,
          showArchived: showArchived.value
        }
        // Get the response
        const response = await store.dispatch('fetchChildren', payload)
        // Store the response data in the ref variables
        children.value = response.items
        if (forward) {
          nextToken.value.push(response.nextToken)
        }
      } catch (err) {
        console.log(err)
      } finally {
        isLoading.value = false
        setSearchFieldText()
        await countChildren()
      }
    }, 500)

    function fetchChildren(forward) {
      debouncedFetchChildren(forward)
    }

    // Fetch the child as well check if we have a token for pagination
    async function fetchChildrenByCarrier() {
      isLoading.value = true
      try {
        const payload = {
          carrierCarrierContactsId: carrier.value.id
        }
        // Get the response
        const response = await store.dispatch('fetchChildrenByCarrier', payload)
        // Store the response data in the ref variables
        children.value = response
        // update count
        childCount.value = response.length
      } catch (err) {
        console.log(err)
      } finally {
        isLoading.value = false
      }
    }

    // change status for showing special times reports
    async function showDataIncompleteChanged(val) {
      try {
        // update ref to display correct button status
        showDataIncomplete.value = val.dataIncomplete

        // set current site to 0
        currentSite.value = 0

        // set search value for ListItem
        searchValue.value = ''
        nextToken.value = [null]
        children.value = []
        await fetchChildren(true)
      } catch (error) {
        console.log(error)
      }
    }

    // change status for showing archived clients
    async function showArchivedChanged(val) {
      try {
        // update ref
        console.log(val)
        showArchived.value = val.archiveStatus

        // set current site to 0
        currentSite.value = 0

        // set search value for ListItem
        searchValue.value = ''
        nextToken.value = [null]
        children.value = []
        await fetchChildren(true)
      } catch (error) {
        console.log(error)
      }
    }

    // count all available children
    async function countChildren() {
      try {
        // count via store --> appsync
        const resp = await store.dispatch('countChildren', {
          carrier: carrier.value,
          searchValue: searchValue.value,
          showArchived: showArchived.value,
          showDataIncomplete: showDataIncomplete.value
        })
        // save number in ref
        childCount.value = resp
      } catch (error) {
        console.log(error)
      }
    }

    // Callback when the user wants to switch to the next site
    async function paginateToNextTapped() {
      currentSite.value += 1
      await fetchChildren(true)
    }

    // Callback when the user wants to switch to the previous site
    async function paginateToPreviousTapped() {
      currentSite.value -= 1
      await fetchChildren(false)
    }

    // reset pagination values
    function resetPagination() {
      currentSite.value = 0
      nextToken.value = [null]
    }

    async function setSearchValue(value) {
      // set current site to 0
      currentSite.value = 0

      // set search value for ListItem
      searchValue.value = value
      nextToken.value = [null]
      children.value = []
      await fetchChildren(true)
    }

    function setSearchFieldText() {
      // set search field text to values in menuItems of content, exclude values defined in exlude
      let searchText = 'Suche nach '
      const exclude = [
        'Status',
        'Bearbeiten',
        'Angemeldet',
        'Trägerkontakt',
        'Betreuer'
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

    async function carrierSelected(val) {
      // set carrier to ref
      carrier.value = val

      // reset values
      showDataIncomplete.value = false
      showArchived.value = false

      // reset pagnation values
      resetPagination()

      // get carrier from API
      await fetchChildrenByCarrier()
    }

    async function clearCarrier() {
      // set carrier ref to null
      carrier.value = null

      // reset search value
      searchValue.value = ''

      // reset pagnation values
      resetPagination()

      // set query parameters
      setQueryParams()

      // pull children
      await fetchChildren(true)
    }

    const sortedUsers = computed(() => {
      if (children.value.length === 0) {
        return []
      }

      const sortUsers = children.value
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

    // watch for updates of nav
    watch(
      () => [route],
      async () => {
        if (route.query.carrierID) {
          await getFiltersFromURL()
        } else {
          await clearCarrier()
        }
      },
      { deep: true }
    )

    return {
      isLoading,
      children,
      childCount,
      sortedUsers,
      nextPageAvailable,
      currentSite,
      menuItems,
      carrier,
      showDataIncomplete,
      showArchived,
      sortEvent,
      elementId,
      setSearchValue,
      searchFieldText,
      carrierSelected,
      clearCarrier,
      paginateToNextTapped,
      paginateToPreviousTapped,
      showDataIncompleteChanged,
      showArchivedChanged
    }
  }
}
</script>
