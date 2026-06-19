<template>
  <div class="w-full">
    <!-- guardians -->
    <UserSelectionModal
      :open="guardianOpen"
      :people="guardian"
      :showLoadMore="guardianLoadMoreAvailable"
      @person-selected="guardianSelected"
      @close-modal="guardianOpen = false"
      @load-more="fetchGuardians(false)"
      @query-set="setSearchValue"
    />
    <button
      type="button"
      @click="openGuardians"
      :disabled="!enableAddButton"
      class="group flex w-full items-center gap-2.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-left transition hover:border-impuls-blue/50 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <IdentificationIcon class="h-5 w-5 flex-shrink-0 text-slate-400" aria-hidden="true" />
      <span class="min-w-0 flex-1">
        <span class="block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Betreuer</span>
        <span
          class="block truncate text-sm font-semibold"
          :class="selectedGuardianName ? 'text-slate-900' : 'text-slate-400'"
        >
          {{ selectedGuardianName || 'Alle Betreuer' }}
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
import { IdentificationIcon, ChevronUpDownIcon } from '@heroicons/vue/24/outline'

export default {
  components: {
    UserSelectionModal,
    IdentificationIcon,
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
    selectedGuardian: {
      type: Object,
      required: false,
      default: null
    }
  },
  emits: ['guardian-selected'],
  setup(props, { emit }) {
    // initialize refs
    const guardianNextToken = ref(null)
    const guardian = ref([])
    const guardianOpen = ref(false)
    const searchValue = ref('')

    // Initialize the store
    const store = useStore()

    // compute selected child name
    const selectedGuardianName = computed(() => {
      if (props.selectedGuardian) {
        return `${props.selectedGuardian.name} ${props.selectedGuardian.familyName}`
      }
      return null
    })

    // get list of guardians
    async function openGuardians() {
      if (props.enableAddButton) {
        try {
          if (guardian.value.length === 0) {
            await fetchGuardians(true)
          }
          guardianOpen.value = true
        } catch (error) {
          console.log(error)
        }
      }
    }

    // fetch guardian from API
    async function fetchGuardians(initial) {
      try {
        const guardianResponse = await store.dispatch('fetchGuardiansSelection', {
          nextToken: guardianNextToken.value,
          filter: searchValue.value
        })
        // if it's the first request, overwrite the guardian object, else add to object array
        if (initial) {
          var tempGuardian = []
          for (const guardian of guardianResponse.items) {
            tempGuardian.push(guardian)
          }
          guardian.value = tempGuardian
        } else {
          for (const guardian of guardianResponse.items) {
            guardian.value.push(guardian)
          }
        }

        guardianNextToken.value = guardianResponse.nextToken
        // due to how the pagination works in AppSync, sometimes empty pages are returned if no filtered Object was found
        // if that happens, we pull again, unless the nextToken is null, indicating no more pullable objects
        if (
          guardianResponse.items.length <= 0 &&
          guardianResponse.nextToken !== null
        ) {
          await fetchGuardians()
        }
      } catch (error) {
        console.log(error)
      }
    }

    async function setSearchValue(value) {
      // set search value for ListItem
      searchValue.value = value
      guardianNextToken.value = null
      guardian.value = []
      await fetchGuardians(true)
    }

    // set selected guardian
    function guardianSelected(selection) {
      emit('guardian-selected', selection)
      guardianOpen.value = false
    }

    // check if more guardians can be loaded from API
    const guardianLoadMoreAvailable = computed(() => {
      if (guardianNextToken.value === null && guardian.value.length > 0) {
        return false
      }
      return true
    })

    return {
      guardian,
      guardianOpen,
      guardianLoadMoreAvailable,
      selectedGuardianName,
      openGuardians,
      guardianSelected,
      fetchGuardians,
      setSearchValue
    }
  }
}
</script>