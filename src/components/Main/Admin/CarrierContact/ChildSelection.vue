<template>
  <div class="w-full">
    <!-- children -->
    <UserSelectionModal
      :open="childrenOpen"
      :people="children"
      :showLoadMore="childrenLoadMoreAvailable"
      @person-selected="childSelected"
      @close-modal="childrenOpen = false"
      @load-more="fetchChildren(false)"
      @query-set="setSearchValue"
    />
    <!-- selection -->
    <div class="w-full flex gap-8">
      <!-- add button-->
      <div class="w-full text-white flex justify-center">
        <div
          @click="openChildren"
          :class="[
            enableAddButton
              ? 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
              : 'bg-gray-600 hover:bg-gray-700 cursor-not-allowed',
            'w-1/2 text-sm text-center flex justify-center font-medium text-white rounded-xl  py-2 px-4'
          ]"
        >
          <div class="self-center">Klient hinzufügen</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// vue imports
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

// component imports
import UserSelectionModal from '@/components/UIComponents/Modals/UserSelectionModal.vue'

export default {
  components: {
    UserSelectionModal
  },
  props: {
    preSelected: {
      type: Object,
      required: false,
      default: null
    },
    enableAddButton: {
      type: Boolean,
      required: true
    }
  },
  emits: ['child-selected'],
  setup(props, { emit }) {
    // initialize refs
    const childrenNextToken = ref(null)
    const children = ref([])
    const childrenOpen = ref(false)
    const searchValue = ref('')

    // Initialize the store
    const store = useStore()

    // get list of guardians
    async function openChildren() {
      if (props.enableAddButton) {
        try {
          if (children.value.length === 0) {
            await fetchChildren(true)
          }
          childrenOpen.value = true
        } catch (error) {
          console.log(error)
        }
      }
    }

    // fetch children from API
    async function fetchChildren(initial) {
      try {
        const childrenResponse = await store.dispatch('fetchChildren', {
          nextToken: childrenNextToken.value,
          filter: searchValue.value
        })
        // if it's the first request, overwrite the children object, else add to object array
        if (initial) {
          var tempChildren = []
          for (const child of childrenResponse.items) {
            tempChildren.push(child)
          }
          children.value = tempChildren
        } else {
          for (const child of childrenResponse.items) {
            children.value.push(child)
          }
        }

        childrenNextToken.value = childrenResponse.nextToken
        // due to how the pagination works in AppSync, sometimes empty pages are returned if no filtered Object was found
        // if that happens, we pull again, unless the nextToken is null, indicating no more pullable objects
        if (
          childrenResponse.items.length <= 0 &&
          childrenResponse.nextToken !== null
        ) {
          fetchChildren()
        }
      } catch (error) {
        console.log(error)
      }
    }

    async function setSearchValue(value) {
      // set search value for ListItem
      searchValue.value = value
      childrenNextToken.value = null
      children.value = []
      await fetchChildren(true)
    }

    // set selected child
    function childSelected(selection) {
      emit('child-selected', selection)
      childrenOpen.value = false
    }

    // check if more children can be loaded from API
    const childrenLoadMoreAvailable = computed(() => {
      if (childrenNextToken.value === null && children.value.length > 0) {
        return false
      }
      return true
    })

    return {
      children,
      childrenOpen,
      childrenLoadMoreAvailable,
      openChildren,
      childSelected,
      fetchChildren,
      setSearchValue
    }
  }
}
</script>