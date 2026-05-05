<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
13.09.2022

Scope:
Auth Page
-->

<template>
  <!-- Main container -->
  <div class="relative h-screen w-full">
    <!-- Background Image -->
    <img
      class="h-full w-full object-cover"
      src="@/assets/img/impuls_mainbg.jpg"
      alt="Impuls Erziehungshilfe"
    />
    <!-- Color filter for background image -->
    <div
      class="absolute inset-0 bg-gradient-to-r from-blue-300 to-pink-400"
      style="mix-blend-mode: multiply"
    />
    <!-- Container for the auth router views -->
    <div class="
        absolute
        top-1/2
        left-1/2
        transform
        -translate-x-1/2 -translate-y-1/2
        max-w-md
        w-full
        bg-gray-800 bg-opacity-70
        rounded-xl
      ">
      <!-- Content area -->
      <div class="p-5 space-y-2">
        <auth-header />
        <router-view />
        <div class="flex flex-wrap justify-center pt-4 w-full gap-6 print:hidden">
          <router-link
            :to="{ name: 'Imprint' }"
            class="text-white hover:text-white"
          >Impressum</router-link>
          <router-link
            :to="{ name: 'GDPR' }"
            class="text-white hover:text-white"
          >
            Datenschutzbestimmung
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Component imports
import AuthHeader from "@/components/Auth/AuthHeader.vue";

export default {
  name: "Auth",
  components: {
    AuthHeader,
  },
};
</script>
