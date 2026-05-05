<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
20.04.2023

Scope:
Calendar Details
-->

<template>
  <!-- Critical action modal for participation delete operation -->
  <div>
    <CriticalAction
      :open="deleteParticipationOpen"
      title="Teilnahme löschen"
      message="Möchten Sie die Teilnahme wirklich löschen? Dieser Vorgang ist nicht mehr umzukehren."
      buttonCancelTitle="Abbrechen"
      buttonConfirmTitle="Teilnahme löschen"
      @close="closeDeleteParticipation"
      @confirmed="confirmedParticipationDelete"
    />
    <!-- Error modal -->
    <error-window
      v-if="deleteParticipationSuccess === 'error'"
      :title="'Löschung fehlgeschlagen'"
      :message="'Die Teilnahme konnte leider nicht gelöscht werden. Bitte stellen Sie eine stabile Internetverbindung sicher.'"
      :open="deleteParticipationSuccess === 'error'"
      @close="closeParticipationDeleteModals"
    />
    <!-- Success modal -->
    <success-window
      v-if="deleteParticipationSuccess === 'success'"
      title="Löschung erfolgreich"
      message="Die ausgewählte Teilnahme wurde erfolgreich gelöscht"
      :open="deleteParticipationSuccess === 'success'"
      @close="closeParticipationDeleteModals"
    />
  </div>
  <!-- Critical action modal for calendar delete operation -->
  <div>
    <CriticalAction
      :open="deleteCalendarOpen"
      title="Kalender löschen"
      message="Möchten Sie den Kalender und alle damit verbundenen Teilnahmen und Events wirklich löschen? Dieser Vorgang ist nicht mehr umzukehren."
      buttonCancelTitle="Abbrechen"
      buttonConfirmTitle="Kalender löschen"
      @close="closeDeleteCalendar"
      @confirmed="confirmedCalendarnDelete"
    />
    <!-- Error modal -->
    <error-window
      v-if="deleteCalendarSuccess === 'error'"
      :title="'Löschung fehlgeschlagen'"
      :message="'Der Kalender konnte leider nicht gelöscht werden. Bitte stellen Sie eine stabile Internetverbindung sicher.'"
      :open="deleteCalendarSuccess === 'error'"
      @close="closeDeleteCalendarErrorModal"
    />
    <!-- Success modal -->
    <success-window
      v-if="deleteCalendarSuccess === 'success'"
      title="Löschung erfolgreich"
      message="Der ausgewählte Kalender wurde erfolgreich gelöscht"
      :open="deleteCalendarSuccess === 'success'"
      @close="closeDeleteCalendarSuccessModal"
    />
  </div>
  <!-- Main Container -->
  <div class="flex flex-col h-full w-full px-4 pb-2 pt-4 bg-primary items-center gap-8">
    <!-- Header section -->
    <div class="space-y-1 w-full lg:w-4/5">
      <h3 class="text-lg leading-6 font-medium text-primaryText">Kalender Details</h3>
      <p class="max-w-2xl text-sm text-secondaryText">
        Informationen über die Daten des Kalenders
      </p>
    </div>
    <!-- loading spinner container -->
    <div
      v-if="isLoading"
      class="flex w-full h-full justify-center mt-4"
    >
      <LoadingSpinner size="h-12 w-12" />
    </div>
    <!-- info -->
    <div
      v-else
      class="flex flex-col w-full lg:w-4/5 mt-4 divide-y divide-gray-800"
    >
      <!-- title -->
      <EditableTextRow
        class="w-full"
        title="Titel"
        propertyKey="title"
        :isLoading="valueIsLoading === 'title'"
        :value="calendar.title"
        buttonTitle="Updaten"
        @change-submit="updateCalendar"
      />
      <!-- description -->
      <EditableLargeTextRow
        class="w-full"
        title="Beschreibung"
        propertyKey="description"
        :isLoading="valueIsLoading === 'description'"
        :value="calendar.description"
        buttonTitle="Updaten"
        @change-submit="updateCalendar"
      />
      <!-- color picker -->
      <div class="py-4 sm:py-5">
        <input-label
          elementID="color"
          labelText="Farbe"
        />
        <!-- red -->
        <div class="py-2 flex gap-2 items-center">
          <p class="text-secondaryText">Farbe:</p>
          <!-- loading spinner for color selection -->
          <div
            v-if="valueIsLoading === 'color'"
            class="flex mt-4-center"
          >
            <LoadingSpinner size="h-6 w-6" />
          </div>
          <!-- color selection -->
          <input
            v-else
            class="bg-transparent cursor-pointer h-10 w-10"
            type="color"
            v-model="calendarColor"
            @change="updateCalendarColor"
          />
        </div>
      </div>
    </div>
    <!-- Header section connections -->
    <div
      v-if="!isLoading"
      class="space-y-1 w-full lg:w-4/5"
    >
      <h3 class="text-lg leading-6 font-medium text-primaryText">Teilnehmer</h3>
      <p class="max-w-2xl text-sm text-secondaryText">
        Liste der verbundenen Teilnehmer
      </p>
      <div class="w-full">
        <!-- active participants -->
        <div v-if="participations.length <= 0">
          <p class="text-center p-4 text-gray-600">
            Noch keine Teilnehmer verbunden
          </p>
        </div>
        <div
          v-else
          class="flex py-4 gap-2 flex-wrap"
        >
          <CalendarDetailsParticipationTile
            v-for="participation in participations"
            :key="participation.id"
            :participation="participation"
            @delete-tapped="openDeleteParticipation"
            :userList="userList"
          />
        </div>
        <!-- coloring legend -->
        <div class="flex justify-center w-full gap-6 py-2">
          <!-- guardian -->
          <div class="flex items-center gap-1">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <p class="text-secondaryText">Betreuer</p>
          </div>
          <!-- admin -->
          <div class="flex items-center gap-1">
            <div class="w-2 h-2 bg-red-500 rounded-full"></div>
            <p class="text-secondaryText">Administrator</p>
          </div>
        </div>
        <!-- add participants -->
        <CalendarUserSelection
          :enableAddButton="true"
          @contact-selected="newParticipation"
        />
      </div>
    </div>
    <!-- object info -->
    <div class="w-full lg:w-4/5">
      <CalendarDetailsObjectInfo
        class="pb-4"
        v-if="!isLoading"
        :calendar="calendar"
        :deleteIsLoading="deleteIsLoading"
        @delete-calendar-tapped="openDeleteCalendar"
      />
    </div>
  </div>
</template>

<script>
// vue imports
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

// component imports
import LoadingSpinner from '@/components/UIComponents/Utilities/LoadingSpinner.vue'
import EditableTextRow from '@/components/UIComponents/Inputs/EditableTextRow.vue'
import EditableLargeTextRow from '@/components/UIComponents/Inputs/EditableLargeTextRow.vue'
import InputLabel from '@/components/UIComponents/Labels/InputLabel.vue'
import CalendarDetailsParticipationTile from '@/components/Main/Admin/Calendar/CalendarDetailsParticipationTile.vue'
import CalendarUserSelection from '@/components/Main/Admin/Calendar/CalendarUserSelection.vue'
import CriticalAction from '@/components/UIComponents/Modals/CriticalAction.vue'
import ErrorWindow from '@/components/UIComponents/Modals/ErrorWindow.vue'
import SuccessWindow from '@/components/UIComponents/Modals/SuccessWindow.vue'
import CalendarDetailsObjectInfo from '@/components/Main/Admin/Calendar/CalendarDetailsObjectInfo.vue'

export default {
  name: 'CalendarDetails',
  components: {
    LoadingSpinner,
    EditableTextRow,
    EditableLargeTextRow,
    InputLabel,
    CalendarDetailsParticipationTile,
    CalendarUserSelection,
    CriticalAction,
    ErrorWindow,
    SuccessWindow,
    CalendarDetailsObjectInfo
  },
  props: {
    userList: {
      type: Object,
      required: true
    }
  },
  setup() {
    // initialize refs
    const calendar = ref({})
    const isLoading = ref(false)
    const valueIsLoading = ref('none')
    const calendarColor = ref('#ffffff')
    const participations = ref([])
    const deleteParticipationOpen = ref(false)
    const deleteParticipationSuccess = ref('none')
    const participationDelete = ref(null)
    const deleteCalendarOpen = ref(false)
    const deleteCalendarSuccess = ref('none')
    const deleteIsLoading = ref(false)

    // initialize store
    const store = useStore()

    // initialize route
    const route = useRoute()

    // initialize router
    const router = useRouter()

    // get calendar info from API
    async function getCalendarDetails() {
      try {
        // set loading state
        isLoading.value = true

        // get info via store
        const calResp = await store.dispatch('getSingleCalendar', {
          id: route.params.id
        })
        // safe info in ref
        calendar.value = calResp
        // update color v-model
        calendarColor.value = calResp.color
        // get participants
        participations.value = calResp.participations.items
      } catch (error) {
        console.log(error)
      } finally {
        // reset loading state
        isLoading.value = false
      }
    }

    // get participants of calendar

    // update value of calendar via API
    async function updateCalendar(updateObject) {
      try {
        // set loading state
        valueIsLoading.value = Object.keys(updateObject)[0]

        // update calendar info
        const updateResp = await store.dispatch('updateCalendar', {
          id: route.params.id,
          updateObject: updateObject
        })
        // safe info in ref
        calendar.value = updateResp
        // update color v-model
        calendarColor.value = updateResp.color
      } catch (error) {
        console.log(error)
      } finally {
        valueIsLoading.value = 'none'
      }
    }

    async function updateCalendarColor(val) {
      // get color from selection
      const newColor = { color: val.target.value }

      // use update function to save new color
      await updateCalendar(newColor)
    }

    async function newParticipation(user) {
      try {
        // get userGroup of selected user
        const userGroupResp = await store.dispatch('fetchUserGroup', {
          username: user.Username
        })
        const userGroup = userGroupResp.Groups[0].GroupName.toLowerCase()

        // creat params object for participation
        const participationParams = {
          participantId: user.Username,
          calendarId: route.params.id,
          userType: userGroup
        }

        // create participation object via store
        const participationResp = await store.dispatch(
          'createParticipation',
          participationParams
        )
        // save new participation in array for immediate display
        const newParticipation = participationResp.data.createParticipation
        participations.value.push(newParticipation)
      } catch (error) {
        console.log(error)
      }
    }

    // open critical action, for participation deletion
    function openDeleteParticipation(participation) {
      // open model
      deleteParticipationOpen.value = true
      // save object that was selected
      participationDelete.value = participation
    }

    // close critical action, for participation deletion
    function closeDeleteParticipation() {
      // close modal
      deleteParticipationOpen.value = false
      // reset to-be-deleted object
      participationDelete.value = null
    }

    // open critical action, for calendar deletion
    function openDeleteCalendar() {
      // open model
      deleteCalendarOpen.value = true
    }

    // close critical action, for participation deletion
    function closeDeleteCalendar() {
      // close modal
      deleteCalendarOpen.value = false
    }

    // close calendar deletion error modal
    function closeDeleteCalendarErrorModal() {
      deleteCalendarSuccess.value = 'none'
    }

    // close calendar deletion success modal
    function closeDeleteCalendarSuccessModal() {
      deleteCalendarSuccess.value = 'none'
      router.push({ name: 'CalendarOverview' })
    }

    async function confirmedParticipationDelete() {
      try {
        // close critical action modal
        deleteParticipationOpen.value = false

        // delete participation via store
        const deleteResp = await store.dispatch('deleteParticipation', {
          id: participationDelete.value.id
        })

        // set success state
        deleteParticipationSuccess.value = 'success'

        // delete from array
        const deleteIndex = participations.value.findIndex(
          (attr) => attr.id === participationDelete.value.id
        )
        participations.value.splice(deleteIndex, 1)

        // reset to-be-deleted participation
        participationDelete.value = null
      } catch (error) {
        console.log(error)
        // set error state
        deleteParticipationSuccess.value = 'error'
      }
    }

    async function confirmedCalendarnDelete() {
      try {
        // set loading state
        deleteIsLoading.value = true
        // close critical action modal
        deleteCalendarOpen.value = false

        // delete participation via store
        const deleteResp = await store.dispatch('adminDeleteCalendar', {
          id: calendar.value.id
        })
        console.log(deleteResp)

        // set success state
        deleteCalendarSuccess.value = 'success'
      } catch (error) {
        console.log(error)
        // set error state
        deleteCalendarSuccess.value = 'error'
      } finally {
        deleteIsLoading.value = false
      }
    }

    // close success/error modals
    function closeParticipationDeleteModals() {
      deleteParticipationSuccess.value = 'none'
    }

    onMounted(async () => {
      // get calendar info on mounted
      await getCalendarDetails()
    })

    // Return the setup object
    return {
      isLoading,
      calendar,
      valueIsLoading,
      calendarColor,
      participations,
      deleteParticipationOpen,
      deleteParticipationSuccess,
      deleteCalendarOpen,
      deleteCalendarSuccess,
      deleteIsLoading,
      updateCalendar,
      updateCalendarColor,
      newParticipation,
      openDeleteParticipation,
      closeDeleteParticipation,
      confirmedParticipationDelete,
      closeParticipationDeleteModals,
      openDeleteCalendar,
      closeDeleteCalendar,
      confirmedCalendarnDelete,
      closeDeleteCalendarErrorModal,
      closeDeleteCalendarSuccessModal
    }
  }
}
</script>
