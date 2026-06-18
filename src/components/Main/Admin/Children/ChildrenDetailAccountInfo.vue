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
        Informationen über die Accountdaten des Klienten.
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
        <!-- Archive Button -->
        <div
          class="flex flex-col pt-2"
          v-if="child.archiveStatus === 'unarchived' || !child.archiveStatus"
        >
          <StandardButton
            @button-tapped="archiveChildTapped"
            title="Klient archivieren"
            :isLoading="archiveIsLoading"
            :enabled="childIsArchivable"
          />
          <!-- archive info -->
          <div
            v-if="!childIsArchivable"
            class="text-sm font-thin text-secondaryText"
          >
            Die Archivierung von Klienten ist erst möglich, sobald sämtliche offenen Vorgänge erfolgreich abgeschlossen
            wurden. Diese Voraussetzung gewährleistet einen geordneten und vollständigen Archivierungsprozess.
          </div>
        </div>
      </dl>
    </div>
  </div>
</template>

<script>
// Vue imports
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
// Component imports
import UserInfoRow from '@/components/Main/Admin/User/UserInfoRow.vue'
import StandardButton from '@/components/UIComponents/Buttons/StandardButton.vue'

export default {
  name: 'ChildrenDetailAccountInfo',
  props: {
    child: {
      type: Object,
      required: true
    },
    archiveIsLoading: {
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
    StandardButton
  },
  emits: ['archive-child-tapped'],
  setup(props, { emit }) {
    // initialize refs
    const childIsArchivable = ref(false)

    // initialize store
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

    // Get the created date for the selected child
    const createdDate = computed(() => {
      return formatTimestamp(props.child.createdAt)
    })

    // Get the last modified date for the selected child
    const lastModifiedDate = computed(() => {
      return formatTimestamp(props.child.updatedAt)
    })

    // Called when the user wants to archive the selected child
    function archiveChildTapped() {
      emit('archive-child-tapped')
    }

    // check status for archiving client
    async function checkArchivableStatus() {
      try {
        const resp = await store.dispatch('adminCheckChildArchivePossibility', { id: props.child.id })
        childIsArchivable.value = resp.archivable
      } catch (error) {
        console.log(error)
      }
    }

    // check archivable status on load
    onMounted(async () => {
      await checkArchivableStatus()
    })

    // Return the setup object
    return {
      childIsArchivable,
      createdDate,
      lastModifiedDate,
      archiveChildTapped
    }
  }
}
</script>
