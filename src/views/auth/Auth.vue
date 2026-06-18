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
  <div class="relative min-h-screen w-full overflow-hidden">
    <!-- Background Image -->
    <img
      class="absolute inset-0 h-full w-full object-cover"
      src="@/assets/img/impuls_mainbg.jpg"
      alt="Impuls Erziehungshilfe"
    />
    <!-- Branded color overlay for the background image -->
    <div class="absolute inset-0 bg-gradient-to-br from-impuls-blue/95 via-brand-700/90 to-brand-900/95" />
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_55%)]" />

    <!-- Container for the auth router views -->
    <div class="relative flex min-h-screen w-full items-center justify-center px-4 py-10">
      <div class="w-full max-w-md">
        <div class="rounded-2xl border border-white/15 bg-white/10 p-6 shadow-soft backdrop-blur-md sm:p-8">
          <!-- Content area -->
          <div class="space-y-4">
            <auth-header />
            <router-view />
          </div>
        </div>
        <div class="mt-6 flex flex-wrap justify-center gap-6 text-sm print:hidden">
          <router-link
            :to="{ name: 'Imprint' }"
            class="text-white/80 transition hover:text-white"
          >Impressum</router-link>
          <router-link
            :to="{ name: 'GDPR' }"
            class="text-white/80 transition hover:text-white"
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
