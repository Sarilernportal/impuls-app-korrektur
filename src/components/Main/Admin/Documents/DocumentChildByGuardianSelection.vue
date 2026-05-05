<template>
  <div class="w-full">
    <!-- children -->
    <UserSelectionModal
      :open="childrenOpen"
      :people="children"
      :showLoadMore="false"
      @person-selected="childSelected"
      @close-modal="childrenOpen = false"
      @load-more="fetchChildren(false)"
    />
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex w-full rounded-xl border border-primaryText justify-center place-items-center order-2 sm:order-1">
        <div v-if="selectedChildName !== null">
          <p class="text-primaryText text-lg text-center">
            {{ selectedChildName }}
          </p>
        </div>
      </div>
      <!-- selection -->
      <div class="w-full flex gap-8 order-1 sm:order-2">
        <!-- add button-->
        <div class="w-full text-white flex justify-center">
          <div
            @click="openChildren"
            :class="[
              enableAddButton
                ? 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
                : 'bg-gray-600 hover:bg-gray-700 cursor-not-allowed',
              'w-full text-sm text-center flex justify-center font-medium text-white rounded-xl  py-2 px-4'
            ]"
          >
            <div class="self-center">Klient auswählen</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// vue imports
import { ref, computed, watch } from 'vue'
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
    selectedChild: {
      type: Object,
      required: false,
      default: null
    },
    guardianId: {
      type: String,
      required: true
    }
  },
  emits: ['child-selected'],
  setup(props, { emit }) {
    // initialize refs
    const children = ref([])
    const childrenOpen = ref(false)

    // Initialize the store
    const store = useStore()

    // compute selected child name
    const selectedChildName = computed(() => {
      if (props.selectedChild !== null) {
        return `${props.selectedChild.name} ${props.selectedChild.familyName}`
      }
      return 'Nicht ausgewählt'
    })

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
    async function fetchChildren() {
      try {
        // get care assignments by guardian
        const childrenResponse = await store.dispatch('getCareAssignmentByGuardian', {
          id: props.guardianId,
        })
        // get all linked children from assignments
        children.value = childrenResponse.map((assignment) => { return assignment.child })
      } catch (error) {
        console.log(error)
      }
    }

    // set selected child
    function childSelected(selection) {
      emit('child-selected', selection)
      childrenOpen.value = false
    }

    // watch for updates of guardian id --> on change pull client list
    watch(
      () => [props.guardianId],
      async () => {
        await fetchChildren()
      },
      { deep: true }
    )

    return {
      children,
      childrenOpen,
      selectedChildName,
      openChildren,
      childSelected,
      fetchChildren,
    }
  }
}
</script>