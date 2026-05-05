<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
13.09.2022
Scope:
Admin Container
-->
<template>
  <!-- Admin Navigation Bar -->
  <guardian-navigation-view>
    <!-- Loading Spinner Container -->
    <div v-if="isLoading">
      <!-- Loading Spinner -->
      <loading-spinner
        size="h-12 w-12"
        class="
          absolute
          top-1/2
          left-1/2
          transform
          -translate-x-1/2 -translate-y-1/2
        "
      />
    </div>
    <!-- Slot to integrate the router-view to the admin navigation bar -->
    <router-view v-else />
  </guardian-navigation-view>
</template>

<script>
// Vue imports
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
// Component imports
import GuardianNavigationView from "@/components/Navigation/GuardianNavigationView.vue"
import LoadingSpinner from '@/components/UIComponents/Utilities/LoadingSpinner.vue'

export default {
  name: "GuardianContainer",
  components: {
    GuardianNavigationView,
    LoadingSpinner
  },
  setup() {
    // Ref initialization
    const isLoading = ref(true)
    const store = useStore()

    // Mounted hook to perform actions when component is mounted
    onMounted(async() => {
      // Fetch data for the guardian
      await fetchGuardianData()
    })

    // Fetch data for the guardian from the backend
    async function fetchGuardianData() {
      try {
        isLoading.value = true
        // Fetch the data via store, it also performs setting it on the local storage to get the infos via getters
        await store.dispatch('fetchGuardianData')
      } catch (err) {
        console.log('err', err)
      } finally {
        isLoading.value = false
      }
    }

    // Return the setup object
    return { isLoading }
  }
};
</script>