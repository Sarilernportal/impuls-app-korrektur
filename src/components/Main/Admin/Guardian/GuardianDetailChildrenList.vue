<template>
  <div class="w-full">
    <critical-action
      v-if="selectedRemoveChild !== null"
      :open="deleteSelected"
      title="Verknüpfung entfernen"
      :message="'Möchten Sie die Verknüpfung zu ' +
        selectedRemoveChild.child.name +
        ' ' +
        selectedRemoveChild.child.familyName +
        ' entfernen?'
        "
      buttonCancelTitle="Abbrechen"
      buttonConfirmTitle="Verknüpfung entfernen"
      @close="deleteSelected = false"
      @confirmed="removeChild"
    />
    <!-- Header section -->
    <div class="space-y-1 mb-6">
      <h3 class="text-lg leading-6 font-medium text-primaryText">Klienten</h3>
      <p class="max-w-2xl text-sm text-secondaryText">
        Informationen über verknüpfte Klienten.
      </p>
    </div>
    <div class="border-y-2 border-gray-700 divide-y divide-gray-700">
      <div
        v-for="careAssignment in children"
        :key="careAssignment.id"
        class="text-primaryText py-2 flex"
      >
        <div class="w-full">
          {{ careAssignment.child.name + ' ' + careAssignment.child.familyName }}
        </div>
        <button
          @click="openRemoveChild(careAssignment)"
          class="w-7 h-7 p-1 bg-red-500 hover:bg-red-400 rounded-full mr-2 cursor-pointer text-white"
        >
          <XMarkIcon />
        </button>
      </div>
    </div>
    <ChildSelection
      :enableAddButton="enableAddButton"
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
    children: {
      type: Object,
      required: true
    }
  },
  emits: ['child-selected', 'remove-child'],
  setup(props, { emit }) {
    // initialize refs
    const deleteSelected = ref(false)
    const selectedRemoveChild = ref(null)

    const enableAddButton = computed(() => {
      return props.children.length < 5
    })

    function childSelected(child) {
      emit('child-selected', child)
    }

    function openRemoveChild(careAssignment) {
      selectedRemoveChild.value = careAssignment
      deleteSelected.value = true
    }

    function removeChild() {
      emit('remove-child', selectedRemoveChild.value)
      deleteSelected.value = false
    }

    return {
      deleteSelected,
      selectedRemoveChild,
      enableAddButton,
      openRemoveChild,
      childSelected,
      removeChild
    }
  }
}
</script>