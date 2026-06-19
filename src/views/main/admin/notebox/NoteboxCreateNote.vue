<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
31.03.2023

Scope:
Notebox Create Note
-->

<template>
  <div>
    <!-- Error modal -->
    <error-window
      v-if="createSuccess === 'error'"
      :title="'Notiz konnte nicht erstellt werden'"
      :message="'Während der Erstellung der Notiz ist ein Fehler aufgetreten.'"
      :open="createSuccess === 'error'"
      @close="closeErrorModal"
    />
    <!-- Success modal -->
    <success-window
      v-if="createSuccess === 'success'"
      title="Notiz erstellt"
      message="Die Notiz wurde erfolgreich erstellt."
      :open="createSuccess === 'success'"
      @close="closeSuccessModal"
    />
  </div>
  <div class="min-h-full bg-slate-50 px-4 pb-24 pt-5 sm:px-6 lg:px-8">
    <div class="flex w-full flex-col gap-5">
      <section class="rounded-xl bg-gradient-to-br from-impuls-blue via-brand-700 to-brand-900 p-5 text-white shadow-soft">
        <p class="text-sm font-semibold text-blue-100">Notebox</p>
        <h1 class="mt-1 text-2xl font-bold sm:text-3xl">Notiz erstellen</h1>
        <p class="mt-2 max-w-2xl text-sm text-blue-50">
          Interne Aufgabe oder Rückfrage mit Titel, Inhalt und zuständigen Personen anlegen.
        </p>
      </section>

      <form
        @submit.prevent="createNote"
        class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div class="border-b border-slate-100 pb-4">
          <h2 class="text-lg font-semibold text-slate-900">Notizdaten</h2>
          <p class="mt-1 text-sm text-slate-500">Kurzer Titel, klare Beschreibung und optional Teilnehmer auswählen.</p>
        </div>

        <div class="mt-5 grid gap-5">
          <div>
            <input-label
              elementID="title"
              labelText="Titel*"
            />
            <TextTextfield
              elementID="title"
              name="title"
              placeholder="Titel"
              enterButtonEvent="emitEvent"
              @input-value="setNoteTitle"
              @is-valid="setNoteTitleValidation"
            />
          </div>
          <div>
            <input-label
              elementID="description"
              labelText="Beschreibung*"
            />
            <TextLargeTextfield
              class="w-full"
              elementID="noteText"
              name="noteText"
              placeholder="Ihre Notiz"
              enterButtonEvent="none"
              @input-value="setNoteDescription"
              @is-valid="setNoteDescriptionValidation"
            />
          </div>
          <div class="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <input-label
              elementID="participants"
              labelText="Teilnehmer"
            />
            <div v-if="participants.length <= 0">
              <p class="py-4 text-sm text-slate-500">
                Noch keine Teilnehmer verbunden
              </p>
            </div>
            <div
              v-else
              class="flex py-4 gap-2 flex-wrap"
            >
              <NoteboxParticipationTile
                v-for="participant in participants"
                :key="participant.Username"
                :participation="participant"
                @delete-tapped="deleteParticipation"
                :userList="userList"
              />
            </div>
            <NoteboxUserSelection
              :enableAddButton="true"
              @contact-selected="newParticipation"
            />
          </div>
        </div>

        <div class="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <span class="text-sm font-medium text-slate-500">* Pflichtangabe</span>
          <div class="w-full sm:w-48">
            <StandardButton
              title="Notiz erstellen"
              :enabled="inputsValid"
              :isLoading="isLoading"
            />
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
// vue imports
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

// Component imports
import TextLargeTextfield from '@/components/UIComponents/Inputs/TextLargeTextfield.vue'
import TextTextfield from '@/components/UIComponents/Inputs/TextTextfield.vue'
import InputLabel from '@/components/UIComponents/Labels/InputLabel.vue'
import StandardButton from '@/components/UIComponents/Buttons/StandardButton.vue'
import ErrorWindow from '@/components/UIComponents/Modals/ErrorWindow.vue'
import SuccessWindow from '@/components/UIComponents/Modals/SuccessWindow.vue'
import NoteboxUserSelection from '@/components/Main/Admin/Notebox/NoteboxUserSelection.vue'
import NoteboxParticipationTile from '@/components/Main/Admin/Notebox/NoteboxParticipationTile.vue'

export default {
  name: 'NoteboxOverview',
  components: {
    TextLargeTextfield,
    TextTextfield,
    InputLabel,
    StandardButton,
    ErrorWindow,
    SuccessWindow,
    NoteboxUserSelection,
    NoteboxParticipationTile
  },
  props: {
    userList: {
      type: Object,
      required: true
    }
  },
  setup() {
    // initialize refs
    const isLoading = ref(false)
    const noteTitle = ref('')
    const noteTitleValidation = ref(false)
    const noteDescription = ref('')
    const noteDescriptionValidation = ref(false)
    const participants = ref([])
    const createSuccess = ref('none')

    // Initialze Store
    const store = useStore()

    // initialize rotuer
    const router = useRouter()

    async function createNote() {
      try {
        // set loading state
        isLoading.value = true
        // create participant id array since we only need their id for creating the linkage
        const participantIdArray = participants.value.map(participant => participant.Username)
        // call api via store
        const resp = await store.dispatch('createNoteAndNotetags', {
          noteTitle: noteTitle.value,
          noteDescription: noteDescription.value,
          participants: participantIdArray
        })
        // set success state
        createSuccess.value = 'success'
      } catch (error) {
        console.log(error)
        // set error state
        createSuccess.value = 'error'
      } finally {
        isLoading.value = false
      }
    }

    // setter function for note text
    function setNoteTitle(val) {
      noteTitle.value = val
    }

    // validation setter function for note text
    function setNoteTitleValidation(val) {
      noteTitleValidation.value = val
    }

    // setter function for note text
    function setNoteDescription(val) {
      noteDescription.value = val
    }

    // validation setter function for note text
    function setNoteDescriptionValidation(val) {
      noteDescriptionValidation.value = val
    }

    // save new participant to ref
    function newParticipation(val) {
      participants.value.push(val)
    }

    // delete participant in ref
    function deleteParticipation(val) {
      try {
        const participationIndex = participants.value.findIndex((participant) => participant.Username === val.Username)
        participants.value.splice(participationIndex, 1)
      } catch (error) {
        console.log(error)
      }
    }

    // function for closing error modal
    function closeErrorModal() {
      createSuccess.value = 'none'
    }

    // function for going back to notebox overview after successfull creation
    function closeSuccessModal() {
      router.push({ name: 'NoteboxOverview' })
    }

    // compute overall validation status
    const inputsValid = computed(() => {
      try {
        if (noteDescriptionValidation.value && noteTitleValidation.value) {
          return true
        }
        return false
      } catch (error) {
        console.log(error)
        // fallback
        return false
      }
    })

    return {
      isLoading,
      inputsValid,
      participants,
      createSuccess,
      createNote,
      setNoteTitle,
      setNoteTitleValidation,
      setNoteDescription,
      setNoteDescriptionValidation,
      newParticipation,
      deleteParticipation,
      closeErrorModal,
      closeSuccessModal
    }
  }
}
</script>
