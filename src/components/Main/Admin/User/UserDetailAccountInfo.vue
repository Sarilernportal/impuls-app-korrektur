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
        Informationen über die Accountdaten des Nutzers.
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
        <!-- Enable user row with button-->
        <switchable-user-info-row
          title="Account aktiviert"
          :isActive="userEnabled"
          :value="userEnabledTitle"
          @button-toggled="activeButtonToggled"
          :isLoading="userStateIsLoading"
        />
        <!-- Delete Button -->
        <delete-button
          v-if="userIsAdmin"
          @button-tapped="deleteUserTapped"
          title="Nutzer löschen"
          :isLoading="deleteIsLoading"
          :enabled="!isCurrentUser"
        />
      </dl>
    </div>
  </div>
</template>

<script>
// Vue imports
import { computed } from 'vue'
import { useStore } from 'vuex'
// Component imports
import SwitchableUserInfoRow from '@/components/Main/Admin/User/SwitchableUserInfoRow.vue'
import UserInfoRow from '@/components/Main/Admin/User/UserInfoRow.vue'
import DeleteButton from '@/components/UIComponents/Buttons/DeleteButton.vue'

export default {
  name: 'UserDetailAccountInfo',
  props: {
    user: {
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
    SwitchableUserInfoRow,
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

    // Get the created date for the selected user
    const createdDate = computed(() => {
      return formatTimestamp(props.user.UserCreateDate || props.user.createdAt)
    })

    // Get the last modified date for the selected user
    const lastModifiedDate = computed(() => {
      return formatTimestamp(props.user.UserLastModifiedDate || props.user.updatedAt)
    })

    // Get the enabled status for the current user
    const userEnabled = computed(() => {
      const status = props.user.Enabled
      return status
    })

    // Get the title for the current user state
    const userEnabledTitle = computed(() => {
      const status = props.user.Enabled
      const title = status ? 'Aktiv' : 'Inaktiv'
      return title
    })

    // Check if the shown user is the current user
    const isCurrentUser = computed(() => {
      const shownUser = props.user.Username
      const currentUser = store.getters.user
        ? store.getters.user.username
        : null
      if (shownUser === currentUser) {
        return true
      } else {
        return false
      }
    })

    // Define the group possibilites
    const possibilities = computed(() => {
      // Set the possible groups
      const possibleGroups = [
        {
          name: 'Admin',
          title: 'Admin',
          description: 'Hat Vollzugriff auf die Plattform.'
        },
        {
          name: 'Guardian',
          title: 'Betreuer',
          description: 'Beschränkter Zugriff auf Aktionen'
        }
      ]
      // Loop through the groups and check which group the user has to flag it
      possibleGroups.forEach((possibleGroup) => {
        if (props.user.Group.GroupName === possibleGroup.name) {
          possibleGroup.current = true
        } else {
          possibleGroup.current = false
        }
      })
      return possibleGroups
    })

    // get group status of user
    const userIsAdmin = computed(() => {
      try {
        return props.user.Group.GroupName === 'Admin'
      } catch (error) {
        console.log(error)
        // fallback
        return false
      }
    })

    // The button to enable oder disable the user toggled
    function activeButtonToggled(value) {
      ctx.emit('active-button-toggled', value)
    }

    // Called when the user wants to delete the selected user
    function deleteUserTapped() {
      ctx.emit('delete-user-tapped')
    }

    // Return the setup object
    return {
      createdDate,
      lastModifiedDate,
      userEnabled,
      userEnabledTitle,
      isCurrentUser,
      possibilities,
      userIsAdmin,
      activeButtonToggled,
      deleteUserTapped
    }
  }
}
</script>
