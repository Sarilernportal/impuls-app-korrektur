<template>
  <div
    :class="itemsCounter"
    class="w-full hidden lg:grid lg:grid-rows-1 lg:gap-4 grid-flow-col px-6 py-3 border-b-2 border-secondaryText"
  >
    <!-- header items -->
    <sorting-bar-item
      v-for="item in menuItems"
      :key="item.value"
      @sort-event="sortEvent"
      :menuItem="item"
    />
  </div>
</template>
<script>
// vue imports
import { computed } from 'vue'
// component imports
import SortingBarItem from '@/components/Others/SortingBarItem.vue'

export default {
  name: 'SortingBar',
  components: {
    SortingBarItem
  },
  props: {
    menuItems: {
      type: Array,
      required: true
    }
  },
  emits: ['sort-event'],
  setup(props, context) {
    // computed itemsCounter for getting col length in grid list
    const itemsCounter = computed(() => {
      let cols = 0
      for (const item in props.menuItems) {
        cols = cols + props.menuItems[item].spanValue
      }
      return `lg:grid-cols-${cols}`
    })

    // emit sort event further to next component
    function sortEvent(event) {
      context.emit('sort-event', event)
    }

    return {
      itemsCounter,
      sortEvent
    }
  }
}
</script>
