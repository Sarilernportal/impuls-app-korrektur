<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
19.01.2023

Scope:
Guardian List
-->

<template>
  <div class="relative mx-auto px-3 py-3 sm:px-6 lg:px-8">
    <div class="rounded-t-lg rounded-b-lg overflow-hidden">
      <!-- list header with header items -->
      <sorting-bar
        :menuItems="menuItems"
        @sort-event="sortEvent"
      />
      <!-- list item section -->
      <div class="w-full flex">
        <!-- loading indicator, while users are being fetched -->
        <div
          v-if="isLoading"
          class="w-full h-20 flex items-stretch"
        >
          <loading-spinner-indigo
            size="h-12 w-12"
            class="self-center mx-auto"
          />
        </div>
        <!-- guardians items -->
        <div
          v-else
          class="w-full"
        >
          <div class="w-full divide-y-2 divide-tertiaryText">
            <guardian-admin-list-item
              v-for="guardian in guardians"
              :key="guardian.id"
              :guardian="guardian"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Vue imports
import { computed } from 'vue'
// component import
import GuardianAdminListItem from '@/components/Main/Admin/Guardian/GuardianAdminListItem.vue'
import SortingBar from '@/components/Others/SortingBar.vue'
import LoadingSpinnerIndigo from '@/components/UIComponents/Utilities/LoadingSpinnerIndigo.vue'

export default {
  name: 'UserList',
  components: {
    GuardianAdminListItem,
    LoadingSpinnerIndigo,
    SortingBar
  },
  props: {
    guardians: {
      type: Object,
      required: true
    },
    isLoading: {
      type: Boolean,
      required: true
    },
    menuItems: {
      type: Array,
      required: true
    },
    userType: {
      type: Object,
      required: true
    }
  },
  emit: ['sort-event'],
  setup(props, context) {
    // initialize refs

    // emit sort event further to next component
    function sortEvent(event) {
      context.emit('sort-event', event)
    }

    // computed itemsCounter for getting col length in grid list
    const itemsCounter = computed(() => {
      let cols = 0
      for (const item in props.menuItems) {
        cols = cols + props.menuItems[item].spanValue
      }
      return `lg:grid-cols-${cols}`
    })

    return {
      sortEvent,
      itemsCounter
    }
  }
}
</script>
