<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
13.09.2022

Scope:
App Initialization
-->

<template>
  <!-- App Wrapper -->
  <div id="app">
    <!-- Router view for the content -->
    <router-view />
  </div>
</template>

<script>
// Vue Imports
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
// AWS Imports
import { Hub } from "aws-amplify";
import { currentAuthenticatedUser } from "@/services/authService.js";

export default {
  name: "app",
  setup() {
    // Initialize Store
    const store = useStore();
    // Initialize Router
    const router = useRouter();
    // Initialize Refs
    const isLoading = ref(true);

    // Set the title of the app
    document.title = "Impuls - Erziehungshilfe";

    // Set the Auth listener directly to the app
    setAuthListener();
    // Fetch the current user
    getCurrentUser();

    async function setAuthListener() {
      // Start the listener if the user is authenticated, when the app starts
      Hub.listen("auth", (data) => {
        const { payload } = data;
        if (payload.event === "signIn") {
          // When the user signed in push him to the User Overview
          // If he is not authenticated, router will handle this case
          router.push({ name: "Admin" });
        }
        if (payload.event === "signOut") {
          // When the user signed out push him to login view
          router.push({ name: "Login" });
        }
      });
    }

    // Check, if the user is authenticated, when he entered the app
    async function getCurrentUser() {
      try {
        // Get the user and if the user is authenticated, set him to the store
        const user = await currentAuthenticatedUser();
        await store.dispatch("setUser", { user });
      } catch (err) {
        // If not do nothing. The router handels further processing for unauthenticated users
        console.log(err);
      } finally {
        isLoading.value = false;
      }
    }

    // Return the setup object
    return { isLoading };
  },
};
</script>
