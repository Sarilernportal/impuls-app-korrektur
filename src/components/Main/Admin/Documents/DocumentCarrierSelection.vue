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
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex w-full rounded-xl border border-primaryText justify-center place-items-center order-2 sm:order-1">
        <div v-if="selectedCarrierName !== null">
          <p class="text-primaryText text-lg text-center">
            {{ selectedCarrierName }}
          </p>
        </div>
      </div>
      <!-- selection -->
      <div class="w-full flex gap-8 order-1 sm:order-2">
        <!-- add button-->
        <div class="w-full text-primaryText flex justify-center">
          <div
            @click="openCarrier"
            :class="[
              enableAddButton
                ? 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
                : 'bg-gray-600 hover:bg-gray-700 cursor-not-allowed',
              'w-full text-sm text-center flex justify-center font-medium text-white rounded-xl  py-2 px-4'
            ]"
          >
            <div class="self-center">Träger auswählen</div>
          </div>
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
      return 'Nicht ausgewählt'
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