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
    <button
      type="button"
      @click="openChildren"
      :disabled="!enableAddButton"
      class="group flex w-full items-center gap-2.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-left transition hover:border-impuls-blue/50 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <UserIcon class="h-5 w-5 flex-shrink-0 text-slate-400" aria-hidden="true" />
      <span class="min-w-0 flex-1">
        <span class="block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Klient</span>
        <span
          class="block truncate text-sm font-semibold"
          :class="selectedChildName ? 'text-slate-900' : 'text-slate-400'"
        >
          {{ selectedChildName || 'Alle Klienten' }}
        </span>
      </span>
      <ChevronUpDownIcon class="h-5 w-5 flex-shrink-0 text-slate-400 group-hover:text-slate-500" aria-hidden="true" />
    </button>
  </div>
</template>

<script>
// vue imports
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

// component imports
import UserSelectionModal from '@/components/UIComponents/Modals/UserSelectionModal.vue'
import { UserIcon, ChevronUpDownIcon } from '@heroicons/vue/24/outline'

export default {
  components: {
    UserSelectionModal,
    UserIcon,
    ChevronUpDownIcon
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
    },
    selectedChild: {
      type: Object,
      required: false,
      default: null
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

    // compute selected child name (null when nothing is selected)
    const selectedChildName = computed(() => {
      if (props.selectedChild) {
        return `${props.selectedChild.name} ${props.selectedChild.familyName}`
      }
      return null
    })

    // get list of children
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
      selectedChildName,
      openChildren,
      childSelected,
      fetchChildren,
      setSearchValue
    }
  }
}
</script>
