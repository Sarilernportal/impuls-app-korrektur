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
          {{ selectedChildName || 'Klient auswählen' }}
        </span>
      </span>
      <ChevronUpDownIcon class="h-5 w-5 flex-shrink-0 text-slate-400 group-hover:text-slate-500" aria-hidden="true" />
    </button>
  </div>
</template>

<script>
// vue imports
import { ref, computed, watch } from 'vue'
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
      if (props.selectedChild) {
        return `${props.selectedChild.name} ${props.selectedChild.familyName}`
      }
      return null
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