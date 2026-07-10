<template>
  <div class="w-full">
    <critical-action
      v-if="selectedRevomeContact !== null"
      :open="deleteSelected"
      title="Verknüpfung entfernen"
      :message="'Möchten Sie die Verknüpfung zu ' +
        (selectedRevomeContact.name ? selectedRevomeContact.name : 'N/A') +
        ' ' +
        (selectedRevomeContact.familyName
          ? selectedRevomeContact.familyName
          : 'N/A') +
        ' entfernen?'
        "
      buttonCancelTitle="Abbrechen"
      buttonConfirmTitle="Verknüpfung entfernen"
      @close="deleteSelected = false"
      @confirmed="removeCarrierContact"
    />
    <!-- Header section -->
    <div class="space-y-1 mb-6">
      <h3 class="font-display text-lg font-bold text-slate-900">Kontakte</h3>
      <p class="max-w-2xl text-sm text-secondaryText">
        Informationen über verknüpfte Kontakte.
      </p>
    </div>
    <div class="border-y-2 border-gray-700 divide-y divide-slate-200">
      <div
        v-for="contact in carrierContacts"
        :key="contact.id"
        class="text-primaryText py-2 flex"
      >
        <div class="w-full">
          {{
            (contact.name ? contact.name : 'N/A') +
            ' ' +
            (contact.familyName ? contact.familyName : 'N/A')
          }}
        </div>
        <button
          @click="openRemoveContact(contact)"
          class="w-7 h-7 p-1 bg-red-500 hover:bg-red-400 rounded-full mr-2 cursor-pointer text-white"
        >
          <XMarkIcon />
        </button>
      </div>
    </div>
    <CarrierContactSelection
      :enableAddButton="true"
      @contact-selected="carrierContactSelected"
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
import CarrierContactSelection from '@/components/Main/Admin/Carrier/CarrierContactSelection.vue'
import CriticalAction from '@/components/UIComponents/Modals/CriticalAction.vue'

export default {
  components: {
    XMarkIcon,
    CarrierContactSelection,
    CriticalAction
  },
  props: {
    carrier: {
      type: Object,
      required: true
    }
  },
  emits: ['contact-selected', 'remove-contact'],
  setup(props, { emit }) {
    // initialize refs
    const deleteSelected = ref(false)
    const selectedRevomeContact = ref(null)

    // get contacts from carrier
    const carrierContacts = computed(() => {
      return props.carrier.carrierContacts.items
    })

    function carrierContactSelected(contact) {
      emit('contact-selected', contact)
    }

    function openRemoveContact(contact) {
      selectedRevomeContact.value = contact
      deleteSelected.value = true
    }

    function removeCarrierContact() {
      emit('remove-contact', selectedRevomeContact.value)
      deleteSelected.value = false
    }

    return {
      deleteSelected,
      carrierContacts,
      selectedRevomeContact,
      openRemoveContact,
      carrierContactSelected,
      removeCarrierContact
    }
  }
}
</script>