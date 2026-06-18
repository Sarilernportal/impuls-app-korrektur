<template>
  <div class="divide-y divide-slate-200">
    <!-- Header section -->
    <div class="space-y-1 mb-6">
      <h3 class="text-lg leading-6 font-medium text-primaryText">Verknüpfungen</h3>
      <p class="max-w-2xl text-sm text-secondaryText">
        Informationen über Verknüpfungen zum Klienten.
      </p>
    </div>
    <!-- Data section -->
    <div class="pt-4 divide divide-slate-200 space-y-5">
      <!-- Guardian Selection -->
      <GuardianSelection
        @guardian-selected="guardianSelected"
        @delete-care-assignment="DeleteCareAssignment"
        :preSelected="selectedGuardians"
      />
      <!-- Carrier Selection -->
      <CarrierContactSelection
        v-if="!carrierIsLoading"
        @carrier-contact-selected="carrierContactSelected"
        @carrier-contact-removed="carrierContactRemoved"
        :preSelected="selectedCarrierContact"
      />
      <div
        v-else
        class="text-white flex justify-center"
      >
        <LoadingSpinner />
      </div>
    </div>
  </div>
</template>

<script>
// vue imports
import { computed } from 'vue'
// component imports
import GuardianSelection from '@/components/Main/Admin/Children/GuardianSelection.vue'
import CarrierContactSelection from '@/components/Main/Admin/Children/CarrierContactSelection.vue'
import LoadingSpinner from '@/components/UIComponents/Utilities/LoadingSpinner.vue'

export default {
  components: {
    GuardianSelection,
    CarrierContactSelection,
    LoadingSpinner
  },
  props: {
    child: {
      type: Object,
      required: true
    },
    isLoading: {
      type: Object,
      required: true
    }
  },
  emits: ['connection-selected', 'guardian-connection-selected', 'delete-care-asignment'],
  setup(props, { emit }) {
    // compute selected guardians
    const selectedGuardians = computed(() => {
      try {
        return props.child.careAssignments.items
      } catch (error) {
        console.log(error)
        // fallback
        return []
      }
    })

    // compute selected carrier
    const selectedCarrierContact = computed(() => {
      if (props.child.carrierContact !== null) {
        return props.child.carrierContact
      }
      return null
    })

    // Get the loading status for the carrierChildrenId attribute
    const carrierIsLoading = computed(() => {
      if (
        props.isLoading.property === 'carrierChildrenId' &&
        props.isLoading.isLoading
      ) {
        return true
      }
      return false
    })

    function guardianSelected(guardian) {
      emit('guardian-connection-selected', {
        guardianId: guardian.id,
        data: guardian
      })
    }

    function DeleteCareAssignment(val) {
      emit('delete-care-asignment', val)
    }

    function carrierContactSelected(carrier) {
      emit('connection-selected', {
        carrierContactChildrenId: carrier.id,
        data: carrier
      })
    }

    function carrierContactRemoved() {
      emit('connection-selected', {
        carrierContactChildrenId: null,
        data: null
      })
    }

    return {
      selectedGuardians,
      selectedCarrierContact,
      carrierIsLoading,
      guardianSelected,
      DeleteCareAssignment,
      carrierContactSelected,
      carrierContactRemoved
    }
  }
}
</script>