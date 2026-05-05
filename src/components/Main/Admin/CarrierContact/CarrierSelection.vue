<template>
  <div class="w-full">
    <!-- carriers -->
    <UserSelectionModal
      :open="carriersOpen"
      :people="carriers"
      :showLoadMore="carriersLoadMoreAvailable"
      @person-selected="carrierSelected"
      @close-modal="carriersOpen = false"
      @load-more="fetchCarriers(false)"
      @query-set="setSearchValue"
    />
    <div class="w-full flex gap-8">
      <!-- selected carrier -->
      <div class="w-1/2 flex flex-col md:flex-row gap-2">
        <p class="text-primaryText font-medium align-middle">Träger:</p>
        <div
          v-if="selectedCarrier !== null"
          class="text-primaryText flex gap-2"
        >
          {{ selectedCarrier.name }}
          <button
            @click="carrierRemoved"
            class="w-7 h-7 aspect-square p-1 text-white bg-red-500 hover:bg-red-400 rounded-full mr-2 cursor-pointer"
          >
            <XMarkIcon />
          </button>
        </div>
        <p
          v-else
          class="text-primaryText font-thin"
        >Nicht ausgewählt</p>
      </div>
      <!-- add carrier -->
      <div class="w-1/2 text-white flex justify-center">
        <div
          @click="openCarriers"
          class="w-full text-sm text-center flex justify-center font-medium text-white rounded-xl bg-indigo-600 hover:bg-indigo-700 cursor-pointer py-2 px-4"
        >
          <div class="self-center">Träger auswählen</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// vue imports
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

// component imports
import UserSelectionModal from '@/components/UIComponents/Modals/UserSelectionModal.vue'

// heroicons imports
import { XMarkIcon } from '@heroicons/vue/24/outline'

export default {
  components: {
    UserSelectionModal,
    XMarkIcon
  },
  props: {
    preSelected: {
      type: Object,
      required: false,
      default: null
    }
  },
  emits: ['carrier-selected', 'carrier-removed'],
  setup(props, { emit }) {
    // initialize refs
    const carrierNextToken = ref(null)
    const carriers = ref([])
    const carriersOpen = ref(false)
    const selectedCarrier = ref(null)
    const searchValue = ref('')

    // Initialize the store
    const store = useStore()

    // get list of carrier
    async function openCarriers() {
      try {
        if (carriers.value.length === 0) {
          await fetchCarriers(true)
        }
        carriersOpen.value = true
      } catch (error) {
        console.log(error)
      }
    }

    // fetch carriers from API
    async function fetchCarriers(initial) {
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
          carriers.value = tempCarrier
        } else {
          for (const carrier of carrierResponse.items) {
            carriers.value.push(carrier)
          }
        }

        carrierNextToken.value = carrierResponse.nextToken
        // due to how the pagination works in AppSync, sometimes empty pages are returned if no filtered Object was found
        // if that happens, we pull again, unless the nextToken is null, indicating no more pullable objects
        if (
          carrierResponse.items.length <= 0 &&
          carrierResponse.nextToken !== null
        ) {
          fetchCarriers()
        }
      } catch (error) {
        console.log(error)
      }
    }

    async function setSearchValue(value) {
      // set search value for ListItem
      searchValue.value = value
      carrierNextToken.value = null
      carriers.value = []
      await fetchCarriers(true)
    }

    // set selected carrier
    function carrierSelected(selection) {
      selectedCarrier.value = selection
      emit('carrier-selected', selection)
      carriersOpen.value = false
    }

    function carrierRemoved() {
      selectedCarrier.value = null
      emit('carrier-removed')
    }

    // check if more carriers can be loaded from API
    const carriersLoadMoreAvailable = computed(() => {
      if (carrierNextToken.value === null && carriers.value.length > 0) {
        return false
      }
      return true
    })

    function checkPreSelected() {
      if (props.preSelected !== null) {
        selectedCarrier.value = props.preSelected
      }
    }

    onMounted(() => {
      checkPreSelected()
    })

    return {
      carriers,
      carriersOpen,
      selectedCarrier,
      carriersLoadMoreAvailable,
      carrierSelected,
      carrierRemoved,
      openCarriers,
      fetchCarriers,
      setSearchValue
    }
  }
}
</script>