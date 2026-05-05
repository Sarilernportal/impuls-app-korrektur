<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
19.09.2022

Scope:
User Overview List Item
-->

<template>
  <button @click="showDetailsTapped" class="bg-red-800">EDIT</button>
</template>

<script>
import { useRouter } from "vue-router";
export default {
  name: "OverviewListItem",
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();

    function showDetailsTapped() {
      router.push({ name: "UserDetails", params: { id: props.user.Username } });
    }

    return { showDetailsTapped };
  },
};
</script>
