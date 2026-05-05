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
    <overview-list-header :listContent="content" />
    <!-- Search Bar -->
    <div class="flex justify-center items-center w-full lg:w-1/2 mx-auto h-12">
      <MagnifyingGlassIcon class="h-6 w-6 mt-2 mr-2 text-secondaryText" />
      <text-textfield
        class="w-2/3 h-10 rounded-2xl"
        v-bind:elementID="elementId"
        name="searchfield"
        v-bind:placeholder="searchFieldText"
        @input-value="setSearchValue"
      />
    </div>
    <!-- User List -->
    <user-list
      @sort-event="sortEvent"
      :users="sortedUsers"
      :userType="content.name"
      :menuItems="menuItems"
      :isLoading="isLoading"
    />
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
import OverviewListHeader from '@/components/Main/Admin/User/OverviewListHeader.vue'
import PaginationBar from '@/components/Others/PaginationBar.vue'
import UserList from '@/components/Main/Admin/User/UserList.vue'
import TextTextfield from '@/components/UIComponents/Inputs/TextTextfield.vue'
// heroicons imports
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'OverviewList',
  components: {
    OverviewListHeader,
    PaginationBar,
    UserList,
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
    const users = ref([])
    const sortDirection = ref('ascending')
    const sortValue = ref('Enabled')
    const menuItems = ref(props.content.menuItems)
    const searchValue = ref('')
    const elementId = ref(`searchfield-${props.content.name}`)
    const searchFieldText = ref('Suche hier...')
    const nextToken = ref(null)
    const currentSite = ref(0)

    // Initialize Store
    const store = useStore()

    onMounted(() => {
      fetchUser()
    })

    // Fetch the user as well check if we have a token for pagination
    async function fetchUser() {
      isLoading.value = true
      try {
        const payload = {
          groupname: props.content.name,
          nextToken: nextToken.value
        }
        // Get the response
        const response = await store.dispatch('fetchUser', payload)
        // Store the response data in the ref variables
        nextToken.value = response.NextToken

        if (response.Users.length <= 0) {
          return fetchUser()
        } else {
          await users.value.push(response.Users)
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
      if (currentSite.value + 1 >= users.value.length) {
        await fetchUser()
      }
      currentSite.value += 1
    }

    // Callback when the user wants to switch to the previous site
    async function paginateToPreviousTapped() {
      currentSite.value -= 1
    }

    async function setSearchValue(value) {
      // set search value for ListItem
      searchValue.value = value

      // set current site to 0 to display every user
      currentSite.value = 0
    }

    function setSearchFieldText() {
      // set search field text to values in menuItems of content, exclude values defined in exlude
      let searchText = 'Suche nach '
      const exclude = ['Status', 'Bearbeiten', 'Registriert']
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
      if (users.value.length === 0) {
        return []
      }
      var userList = [[]]
      // if no search value is given, show users with pagination
      if (searchValue.value === '') {
        userList = users.value
      } else {
        // if a search value is given, show all users on one page
        for (const list of users.value) {
          for (const entry of list) {
            userList[0].push(entry)
          }
        }
      }
      const searchedUsers = [...userList[currentSite.value]].filter((user) => {
        // Set the container properties to lowercase to ensure there are no missspelling based on uppercase lowercase issues
        // get Name Value, if not found in object return empty string
        let name = user.Attributes.find((attribute) => {
          return attribute.Name === 'name'
        })
        name = typeof name === 'object' ? name.Value.toLowerCase() : ''

        // get familyName Value, if not found in object return empty string
        let familyName = user.Attributes.find((attribute) => {
          return attribute.Name === 'family_name'
        })
        familyName =
          typeof familyName === 'object' ? familyName.Value.toLowerCase() : ''

        // get phone Value, if not found in object return empty string
        let phone = user.Attributes.find((attribute) => {
          return attribute.Name === 'phone_number'
        })
        phone = typeof phone === 'object' ? phone.Value.toLowerCase() : ''

        // get mail Value, if not found in object return empty string
        let mail = user.Attributes.find((attribute) => {
          return attribute.Name === 'email'
        })
        mail = typeof mail === 'object' ? mail.Value.toLowerCase() : ''

        // get licensePlate Value, if not found in object return empty string
        let licensePlate = user.Attributes.find((attribute) => {
          return attribute.Name === 'custom:license_plate'
        })
        licensePlate =
          typeof licensePlate === 'object'
            ? licensePlate.Value.toLowerCase()
            : ''

        const searchString = searchValue.value.toLowerCase()

        // Return if any of the given predicates matches, so the user can query against all of them at the search bar
        return (
          name.includes(searchString) ||
          familyName.includes(searchString) ||
          phone.includes(searchString) ||
          mail.includes(searchString) ||
          licensePlate.includes(searchString)
        )
      })

      const sortUsers = searchedUsers
      if (sortUsers.length === 0) {
        return []
      }
      // Sort the array to ascending or descending based on users desicion.
      if (sortDirection.value === 'ascending') {
        if (
          // if the item to sort is anything else then what is listed below,
          // it is an item in the Attributes Array and needs to be sorted by ascendingAttribute
          sortValue.value === 'Enabled' ||
          sortValue.value === 'UserCreateDate'
        ) {
          return sortUsers.sort(ascending)
        } else {
          return sortUsers.sort(ascendingAttribute)
        }
      } else {
        if (
          sortValue.value === 'Enabled' ||
          sortValue.value === 'UserCreateDate'
        ) {
          return sortUsers.sort(descending)
        } else {
          return sortUsers.sort(descendingAttribute)
        }
      }
    })

    function ascendingAttribute(a, b) {
      // Sort ascending
      // get first Value of item to compare
      let aValue = a.Attributes.find((attribute) => {
        return attribute.Name === sortValue.value
      })
      // if first Value is undefined --> return sort down
      if (typeof aValue === 'undefined') {
        return -1
      }

      // get second Value of item to compare
      let bValue = b.Attributes.find((attribute) => {
        return attribute.Name === sortValue.value
      })
      // if second Value is undefined --> return sort down
      if (typeof bValue === 'undefined') {
        return 1
      }

      // if no value is undefined compare values
      if (aValue.Value < bValue.Value) {
        return -1
      }
      if (aValue.Value > bValue.Value) {
        return 1
      }
      return 0
    }

    function descendingAttribute(a, b) {
      // Sort descending
      // get first Value of item to compare
      let aValue = a.Attributes.find((attribute) => {
        return attribute.Name === sortValue.value
      })
      // if first Value is undefined --> return sort down
      if (typeof aValue === 'undefined') {
        return 1
      }

      // get second Value of item to compare
      let bValue = b.Attributes.find((attribute) => {
        return attribute.Name === sortValue.value
      })
      // if second Value is undefined --> return sort down
      if (typeof bValue === 'undefined') {
        return -1
      }

      // if no value is undefined compare values
      if (aValue.Value > bValue.Value) {
        return -1
      }
      if (aValue.Value < bValue.Value) {
        return 1
      }
      return 0
    }

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
      if (searchValue.value === '') {
        return nextToken.value
          ? true
          : false || currentSite.value < users.value.length - 1
      } else {
        return false
      }
    })

    return {
      isLoading,
      users,
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
