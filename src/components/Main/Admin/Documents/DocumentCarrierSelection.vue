<template>
  <div class="w-full">
    <!-- carrier -->
    <UserSelectionModal
      :open="carrierOpen"
      :people="carrier"
      :showLoadMore="carrierLoadMoreAvailable"
      @person-selected="carrierSelected"
      @close-modal="carrierOpen = false"
      @load-more="fetchCarrier(false)"
      @query-set="setSearchValue"
    />
    <button
      type="button"
      @click="openCarrier"
      :disabled="!enableAddButton"
      class="group flex w-full items-center gap-2.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-left transition hover:border-impuls-blue/50 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <BuildingOfficeIcon class="h-5 w-5 flex-shrink-0 text-slate-400" aria-hidden="true" />
      <span class="min-w-0 flex-1">
        <span class="block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Träger</span>
        <span
          class="block truncate text-sm font-semibold"
          :class="selectedCarrierName ? 'text-slate-900' : 'text-slate-400'"
        >
          {{ selectedCarrierName || 'Alle Träger' }}
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
import { BuildingOfficeIcon, ChevronUpDownIcon } from '@heroicons/vue/24/outline'

export default {
  components: {
    UserSelectionModal,
    BuildingOfficeIcon,
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
    selectedCarrier: {
      type: Object,
      required: false,
      default: null
    }
  },
  emits: ['carrier-selected'],
  setup(props, { emit }) {
    // initialize refs
    const carrierNextToken = ref(null)
    const carrier = ref([])
    const carrierOpen = ref(false)
    const searchValue = ref('')

    // Initialize the store
    const store = useStore()

    // compute selected carrier name
    const selectedCarrierName = computed(() => {
      if (props.selectedCarrier) {
        return props.selectedCarrier.name
      }
      return null
    })

    // get list of carrier
    async function openCarrier() {
      if (props.enableAddButton) {
        try {
          if (carrier.value.length === 0) {
            await fetchCarrier(true)
          }
          carrierOpen.value = true
        } catch (error) {
          console.log(error)
        }
      }
    }

    // fetch carrier from API
    async function fetchCarrier(initial) {
      try {
        const carrierResponse = await store.dispatch('fetchCarriers', {
          nextToken: carrierNextToken.value,
          filter: searchValue.value
        })
        // if it's the first request, overwrite the carrier object, else add to object array
        if (initial) {
          var tempCarrier = []
          for (const carrier of carrierResponse.items) {
            tempCarrier.push(carrier)
          }
          carrier.value = tempCarrier
        } else {
          for (const carrier of carrierResponse.items) {
            carrier.value.push(carrier)
          }
        }

        carrierNextToken.value = carrierResponse.nextToken
        // due to how the pagination works in AppSync, sometimes empty pages are returned if no filtered Object was found
        // if that happens, we pull again, unless the nextToken is null, indicating no more pullable objects
        if (
          carrierResponse.items.length <= 0 &&
          carrierResponse.nextToken !== null
        ) {
          fetchCarrier()
        }
      } catch (error) {
        console.log(error)
      }
    }

    async function setSearchValue(value) {
      // set search value for ListItem
      searchValue.value = value
      carrierNextToken.value = null
      carrier.value = []
      await fetchCarrier(true)
    }

    // set selected carrier
    function carrierSelected(selection) {
      emit('carrier-selected', selection)
      carrierOpen.value = false
    }

    // check if more carrier can be loaded from API
    const carrierLoadMoreAvailable = computed(() => {
      if (carrierNextToken.value === null && carrier.value.length > 0) {
        return false
      }
      return true
    })

    return {
      carrier,
      carrierOpen,
      carrierLoadMoreAvailable,
      selectedCarrierName,
      openCarrier,
      carrierSelected,
      fetchCarrier,
      setSearchValue
    }
  }
}
</script>