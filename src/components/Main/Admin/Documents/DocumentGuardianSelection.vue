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
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex w-full rounded-xl border border-primaryText justify-center place-items-center order-2 sm:order-1">
        <div v-if="selectedGuardianName !== null">
          <p class="text-primaryText text-lg text-center">
            {{ selectedGuardianName }}
          </p>
        </div>
      </div>
      <!-- selection -->
      <div class="w-full flex gap-8 order-1 sm:order-2">
        <!-- add button-->
        <div class="w-full text-white flex justify-center">
          <div
            @click="openGuardians"
            :class="[
              enableAddButton
                ? 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
                : 'bg-gray-600 hover:bg-gray-700 cursor-not-allowed',
              'w-full text-sm text-center flex justify-center font-medium text-white rounded-xl  py-2 px-4'
            ]"
          >
            <div class="self-center">Betreuer auswählen</div>
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
      if (props.selectedGuardian !== null) {
        return `${props.selectedGuardian.name} ${props.selectedGuardian.familyName}`
      }
      return 'Nicht ausgewählt'
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