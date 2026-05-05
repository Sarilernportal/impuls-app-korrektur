<template>
  <div class="w-full">
    <!-- guardians -->
    <UserSelectionModal
      :open="guardiansOpen"
      :people="guardians"
      :showLoadMore="guardianLoadMoreAvailable"
      @person-selected="guardianSelected"
      @close-modal="guardiansOpen = false"
      @load-more="fetchGuardians(false)"
      @query-set="setSearchValue"
    />
    <!-- guardian selection -->
    <div class="w-full flex gap-8 items-center justify-items-center">
      <!-- selected guardian -->
      <div class="w-1/2 flex flex-col md:flex-row gap-2 items-start md:items-center">
        <p class="text-primaryText font-medium align-middle">Betreuer:</p>
        <div
          v-if="preSelected !== null && preSelected.length > 0"
          class="text-white flex gap-2"
        >
          <!-- participants -->
          <div class="flex flex-wrap gap-2 pt-2">
            <ChildGuardianParticipationTile
              v-for="guardian in preSelected"
              :key="guardian.id"
              :participation="guardian"
              :allowDelete="true"
              @delete-tapped="deleteCareAssignmentTapped"
            />
          </div>
        </div>
        <p
          v-else
          class="text-white font-thin"
        >Nicht ausgewählt</p>
      </div>
      <!-- add guardian -->
      <div class="w-1/2 text-white flex justify-center">
        <div
          @click="openGuardians"
          class="w-full text-sm text-center flex justify-center font-medium text-white rounded-xl bg-indigo-600 hover:bg-indigo-700 cursor-pointer py-2 px-4"
        >
          <div class="self-center">Betreuer auswählen</div>
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
import ChildGuardianParticipationTile from '@/components/Main/Admin/Children/ChildGuardianParticipationTile.vue'

// heroicons imports
import { XMarkIcon } from '@heroicons/vue/24/outline'

export default {
  components: {
    UserSelectionModal,
    ChildGuardianParticipationTile,
    XMarkIcon
  },
  props: {
    preSelected: {
      type: Object,
      required: false,
      default: null
    }
  },
  emits: ['guardian-selected', 'delete-care-assignment'],
  setup(props, { emit }) {
    // initialize refs
    const guardianNextToken = ref(null)
    const guardians = ref([])
    const guardiansOpen = ref(false)
    const searchValue = ref('')

    // Initialize the store
    const store = useStore()

    // get list of guardians
    async function openGuardians() {
      try {
        if (guardians.value.length === 0) {
          await fetchGuardians(true)
        }
        guardiansOpen.value = true
      } catch (error) {
        console.log(error)
      }
    }

    // fetch guardians from API
    async function fetchGuardians(initial) {
      try {
        const guardiansResponse = await store.dispatch('fetchGuardiansSelection', {
          nextToken: guardianNextToken.value,
          filter: searchValue.value
        })

        // if it's the first request, overwrite the guardians object, else add to object array
        if (initial) {
          var tempGuardians = []
          for (const guardian of guardiansResponse.items) {
            tempGuardians.push(guardian)
          }
          guardians.value = tempGuardians
        } else {
          for (const guardian of guardiansResponse.items) {
            guardians.value.push(guardian)
          }
        }

        guardianNextToken.value = guardiansResponse.nextToken
        // due to how the pagination works in AppSync, sometimes empty pages are returned if no filtered Object was found
        // if that happens, we pull again, unless the nextToken is null, indicating no more pullable objects
        if (
          guardiansResponse.items.length <= 0 &&
          guardiansResponse.nextToken !== null
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
      guardians.value = []
      await fetchGuardians(true)
    }

    // set selected guardian
    function guardianSelected(selection) {
      emit('guardian-selected', selection)
      guardiansOpen.value = false
    }

    function deleteCareAssignmentTapped(val) {
      emit('delete-care-assignment', val)
    }

    // check if more guardians can be loaded from API
    const guardianLoadMoreAvailable = computed(() => {
      if (guardianNextToken.value === null && guardians.value.length > 0) {
        return false
      }
      return true
    })

    return {
      guardians,
      guardiansOpen,
      guardianLoadMoreAvailable,
      guardianSelected,
      deleteCareAssignmentTapped,
      openGuardians,
      fetchGuardians,
      setSearchValue
    }
  }
}
</script>