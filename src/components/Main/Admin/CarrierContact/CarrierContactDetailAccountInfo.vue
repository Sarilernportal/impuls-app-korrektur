<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
19.09.2022

Scope:
User Detail Account Info View
-->

<template>
  <div>
    <!-- Header section -->
    <div class="space-y-1">
      <h3 class="text-lg leading-6 font-medium text-primaryText">Account</h3>
      <p class="max-w-2xl text-sm text-secondaryText">
        Informationen über die Accountdaten des Kostenträger-Kontaktes.
      </p>
    </div>
    <!-- Data Section -->
    <div class="mt-6">
      <dl class="divide-y divide-slate-200">
        <!-- Created Date Property -->
        <user-info-row
          title="Erstellt am"
          :value="createdDate"
        />
        <!-- Last Modified Date Property -->
        <user-info-row
          title="Zuletzt aktualisiert"
          :value="lastModifiedDate"
        />
        <!-- Delete Button -->
        <!-- <delete-button
          @button-tapped="deleteCarrierContactTapped"
          title="Kostenträger-Kontakt löschen"
          :isLoading="deleteIsLoading"
          :enabled="true"
        /> -->
      </dl>
    </div>
  </div>
</template>

<script>
// Vue imports
import { computed } from 'vue'
import { useStore } from 'vuex'
// Component imports
import UserInfoRow from '@/components/Main/Admin/User/UserInfoRow.vue'
import DeleteButton from '@/components/UIComponents/Buttons/DeleteButton.vue'

export default {
  name: 'UserDetailAccountInfo',
  props: {
    carrier: {
      type: Object,
      required: true
    },
    deleteIsLoading: {
      type: Boolean,
      required: true,
      default: false
    },
    userStateIsLoading: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  components: {
    UserInfoRow,
    DeleteButton
  },
  setup(props, ctx) {
    const store = useStore()

    function formatTimestamp(value) {
      const date = value ? new Date(value) : null
      if (!date || Number.isNaN(date.getTime())) {
        return 'Nicht angegeben'
      }

      return date.toLocaleString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    // Get the created date for the selected carrier
    const createdDate = computed(() => {
      return formatTimestamp(props.carrier.createdAt)
    })

    // Get the last modified date for the selected carrier
    const lastModifiedDate = computed(() => {
      return formatTimestamp(props.carrier.updatedAt)
    })

    // Called when the user wants to delete the selected carrier
    function deleteCarrierContactTapped() {
      ctx.emit('delete-carrier-contact-tapped')
    }

    // Return the setup object
    return {
      createdDate,
      lastModifiedDate,
      deleteCarrierContactTapped
    }
  }
}
</script>
