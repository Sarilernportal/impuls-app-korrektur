<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
19.09.2022

Scope:
User Container
-->

<template>
  <!-- Container to inject the current router view -->
  <div class="w-full h-full">
    <!-- User router view -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: "UserContainer",
};
</script>
