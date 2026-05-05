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
        <!-- user items -->
        <div
          v-else
          class="w-full"
        >
          <div class="w-full divide-y-2 divide-tertiaryText">
            <user-list-item
              v-for="user in users"
              :key="user.Username"
              :user="user"
              :userType="userType"
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
import UserListItem from '@/components/Main/Admin/User/UserListItem.vue'
import SortingBar from '@/components/Others/SortingBar.vue'
import LoadingSpinnerIndigo from '@/components/UIComponents/Utilities/LoadingSpinnerIndigo.vue'

export default {
  name: 'UserList',
  props: {
    users: {
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
      type: String,
      required: true
    }
  },
  emit: ['sort-event'],
  setup(props, context) {
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
  },
  components: {
    UserListItem,
    LoadingSpinnerIndigo,
    SortingBar
  }
}
</script>
