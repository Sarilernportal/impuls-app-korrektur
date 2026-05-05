<template>
  <div class="relative mx-auto px-3 py-3 sm:px-6 lg:px-8">
    <div class="rounded-t-lg rounded-b-lg overflow-hidden">
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
        <!-- carrier items -->
        <div
          v-else
          class="w-full"
        >
          <div class="w-full divide-y-2 divide-tertiaryText">
            <children-list-item
              v-for="(children, index) in children"
              :key="children.name"
              :children="children"
              :childIndex="index + 1 + currentSite * 25"
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
import ChildrenListItem from '@/components/Main/Admin/Children/ChildrenListItem.vue'
import LoadingSpinnerIndigo from '@/components/UIComponents/Utilities/LoadingSpinnerIndigo.vue'

export default {
  name: 'UserList',
  props: {
    children: {
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
    },
    currentSite: {
      type: Number,
      required: true,
      default: 0
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
    ChildrenListItem,
    LoadingSpinnerIndigo
  }
}
</script>
