<template>
  <div class="w-full">
    <critical-action
      v-if="selectedRevomeChild !== null"
      :open="deleteSelected"
      title="Verknüpfung entfernen"
      :message="'Möchten Sie die Verknüpfung zu ' +
        selectedRevomeChild.name +
        ' ' +
        selectedRevomeChild.familyName +
        ' entfernen?'
        "
      buttonCancelTitle="Abbrechen"
      buttonConfirmTitle="Verknüpfung entfernen"
      @close="deleteSelected = false"
      @confirmed="removeChild"
    />
    <!-- Header section -->
    <div class="space-y-1 mb-6">
      <h3 class="font-display text-lg font-bold text-slate-900">Klienten</h3>
      <p class="max-w-2xl text-sm text-secondaryText">
        Informationen über verknüpfte Klienten.
      </p>
    </div>
    <div class="border-y-2 border-gray-700 divide-y divide-slate-200">
      <div
        v-for="child in children"
        :key="child.id"
        class="text-primaryText py-2 flex"
      >
        <div class="w-full">
          {{ child.name + ' ' + child.familyName }}
        </div>
        <button
          @click="openRemoveChild(child)"
          class="w-7 h-7 p-1 bg-red-500 hover:bg-red-400 rounded-full mr-2 cursor-pointer text-white"
        >
          <XMarkIcon />
        </button>
      </div>
    </div>
    <ChildSelection
      :enableAddButton="true"
      @child-selected="childSelected"
      class="mt-6"
    />
  </div>
</template>

<script>
// vue imports
import { computed, ref } from 'vue'

// heroicon imports
import { XMarkIcon } from '@heroicons/vue/24/outline'

// component imports
import ChildSelection from '@/components/Main/Admin/Guardian/ChildSelection.vue'
import CriticalAction from '@/components/UIComponents/Modals/CriticalAction.vue'

export default {
  components: {
    XMarkIcon,
    ChildSelection,
    CriticalAction
  },
  props: {
    carrierContact: {
      type: Object,
      required: true
    }
  },
  emits: ['child-selected', 'remove-child'],
  setup(props, { emit }) {
    // initialize refs
    const deleteSelected = ref(false)
    const selectedRevomeChild = ref(null)

    // get children from carrier
    const children = computed(() => {
      return props.carrierContact.children?.items || []
    })

    function childSelected(child) {
      emit('child-selected', child)
    }

    function openRemoveChild(child) {
      selectedRevomeChild.value = child
      deleteSelected.value = true
    }

    function removeChild() {
      emit('remove-child', selectedRevomeChild.value)
      deleteSelected.value = false
    }

    return {
      deleteSelected,
      children,
      selectedRevomeChild,
      openRemoveChild,
      childSelected,
      removeChild
    }
  }
}
</script>
