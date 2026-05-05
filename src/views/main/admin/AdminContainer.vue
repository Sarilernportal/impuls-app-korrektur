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
  <admin-navigation-view>
    <!-- Slot to integrate the router-view to the admin navigation bar -->
    <router-view />
  </admin-navigation-view>
</template>

<script>
// Component imports
import AdminNavigationView from '@/components/Navigation/AdminNavigationView.vue'

export default {
  name: 'AdminContainer',
  components: {
    AdminNavigationView
  }
}
</script>