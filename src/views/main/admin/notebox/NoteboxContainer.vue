<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
31.03.2023

Scope:
Notebox Container
-->

<template>
  <!-- Container to inject the current router view -->
  <div class="w-full h-full">
    <!-- loading spinner -->
    <div
      v-if="isLoading"
      class="flex w-full justify-center"
    >
      <LoadingSpinner size="h-12 w-12 mt-4" />
    </div>
    <!-- User router view -->
    <router-view
      v-else
      :userList="userList"
    />
  </div>
</template>

<script>
// vue imports
import { ref, onMounted } from "vue"
import { useStore } from "vuex"
// component imports
import LoadingSpinner from '@/components/UIComponents/Utilities/LoadingSpinner.vue'

export default {
  name: 'Notebox Container',
  components: {
    LoadingSpinner
  },
  setup() {
    // initialize refs
    const isLoading = ref(false)
    const userList = ref({})

    // initialize store
    const store = useStore()

    // generate disctionary of all cognito users --> required for displaying names on tiles
    async function getCognitoUsers() {
      try {
        // set loading state
        isLoading.value = true
        // get cognito users
        const userResponse = await store.dispatch('fetchAllUsers')
        // save into dictionary ref
        for (const user of userResponse.Users) {
          userList.value[user.Username] = user
        }
      } catch (error) {
        console.log(error)
      } finally {
        // reset loading state
        isLoading.value = false
      }
    }

    // get notes on component mount
    onMounted(async () => {
      await getCognitoUsers()
    })

    return {
      isLoading,
      userList
    }
  }
}
</script>