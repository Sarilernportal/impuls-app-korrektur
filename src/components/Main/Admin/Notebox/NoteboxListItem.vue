<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
19.01.2023

Scope:
Notebox List Item
-->

<template>
  <div
    class="flex flex-col gap-2 w-full p-6 lg:w-2/3 rounded-xl border bg-white border-slate-200 shadow-card divide-y divide-slate-200">
    <div class="flex pb-2">
      <div class="w-full">
        <!-- owner info -->
        <div class="w-full flex gap-2">
          <p class="text-primaryText">Erstellt von:</p>
          <NoteboxParticipationTile
            :key="note.owner"
            :participation="{ Username: note.owner }"
            :userList="userList"
            :allowDelete="false"
          />
        </div>
        <!-- createdAt date -->
        <div class="text-slate-500 text-sm whitespace-nowrap">{{ createdAt }}</div>
      </div>
      <!-- note interaction buttons -->
      <div>
        <!-- mark done button -->
        <button
          v-if="note.status === 'created' && !getMarkLoadingState"
          title="Notiz als Erledigt markieren"
          class="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white transition hover:bg-emerald-700"
          @click="doneTapped"
        >
          <CheckIcon class="h-5 w-5" />
        </button>
        <!-- delete button -->
        <button
          v-if="note.status === 'done' && !getMarkLoadingState"
          title="Notiz endgültig löschen"
          class="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
          @click="deleteTapped"
        >
          <XMarkIcon class="h-5 w-5" />
        </button>
      </div>
    </div>
    <!-- desctiption and title -->
    <div class="flex flex-col gap-2 text-primaryText pt-2">
      <h2 class="font-semibold text-xl">{{ title }}</h2>
      <p class="whitespace-pre-wrap">
        {{ description }}
      </p>
    </div>
    <!-- participants -->
    <div class="flex flex-wrap gap-2 pt-2">
      <NoteboxParticipationTile
        v-for="noteTag in note.noteTags.items"
        :key="noteTag.id"
        :participation="{ Username: noteTag.owner }"
        :userList="userList"
        :allowDelete="false"
      />
    </div>
    <!-- tag interaction row -->
    <div
      v-if="getTaggedStatus"
      class="flex justify-center pt-2"
    >
      <StandardButton
        @click="markNoteRead"
        class="w-1/2"
        title="Als gelesen markieren"
        :enabled="true"
        :isLoading="getNoteTagLoadingState"
      />
    </div>
  </div>
</template>

<script>
// vue imports
import { computed } from 'vue'
import { useStore } from 'vuex'

// component imports
import NoteboxParticipationTile from '@/components/Main/Admin/Notebox/NoteboxParticipationTile.vue'
import LoadingSpinner from '@/components/UIComponents/Utilities/LoadingSpinner.vue'
import StandardButton from '@/components/UIComponents/Buttons/StandardButton.vue'

// heroicon imports
import { CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'NoteboxListItem',
  components: {
    NoteboxParticipationTile,
    CheckIcon,
    XMarkIcon,
    LoadingSpinner,
    StandardButton
  },
  props: {
    note: {
      type: Object,
      required: true
    },
    noteMarkIsLoading: {
      type: Boolean,
      required: false,
      default: false
    },
    noteToBeDone: {
      type: Object,
      required: false,
      default: null
    },
    userList: {
      type: Object,
      required: true
    },
    noteTagMarkIsLoading: {
      type: Boolean,
      required: true,
      default: false
    },
    noteTagToBeMarked: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },
  emits: ['done-tapped', 'mark-note-read', 'delete-tapped'],
  setup(props, { emit }) {
    // initialize store
    const store = useStore()

    // compute title value
    const title = computed(() => {
      try {
        return props.note.title
      } catch (error) {
        console.log(error)
        // fallback
        return 'N/A'
      }
    })

    // compute description value
    const description = computed(() => {
      try {
        return props.note.description
      } catch (error) {
        console.log(error)
        // fallback
        return ''
      }
    })

    // Get the created at date from the data
    const createdAt = computed(() => {
      // Check if the created at object is in the data object
      if (props.note.createdAt) {
        // Get the raw date
        const rawDate = +new Date(props.note.createdAt)
        // Get the offset from the browser time zone
        const offset = new Date(+rawDate).getTimezoneOffset() * 60 * 1000
        // Create a new date with the offset
        const timeStamp = new Date(+rawDate - offset).toISOString()
        // Get the day name to a locale string
        const dayName = new Date(timeStamp).toLocaleDateString('de-DE')

        // Convert the timestamp to a more readable date
        const convertedTimeStamp = timeStamp.split('T')[1].split('.')[0]
        // Create the date string
        const friendlyDate = `${dayName}, ${convertedTimeStamp}`
        return friendlyDate
      }
      // Fallback
      return 'Keine Angabe'
    })

    // get loading status of note
    const getMarkLoadingState = computed(() => {
      try {
        if (props.noteToBeDone) {
          return props.noteToBeDone.id === props.note.id && props.noteMarkIsLoading
        }
        return false
      } catch (error) {
        console.log(error)
        // fallback
        return false
      }
    })

    // check if logged in user is tagged on note
    const getTaggedStatus = computed(() => {
      try {
        // get logged in user
        const user = store.getters.user
        // iterate all tags
        for (const tag of props.note.noteTags.items) {
          // check if tag is related to user and status is still new
          if (tag.owner === user.username && tag.status === 'new') {
            return true
          }
        }
        return false
      } catch (error) {
        console.log(error)
        // fallback
        return false
      }
    })

    // get loading status of notetag
    const getNoteTagLoadingState = computed(() => {
      try {
        if (props.noteTagToBeMarked) {
          return props.noteTagToBeMarked.id === props.note.id && props.noteTagMarkIsLoading
        }
        return false
      } catch (error) {
        console.log(error)
        // fallback
        return false
      }
    })

    // done button was tapped
    function doneTapped() {
      emit('done-tapped', props.note)
    }

    // delete button was tapped
    function deleteTapped() {
      emit('delete-tapped', props.note)
    }

    // emit notetag as read
    async function markNoteRead() {
      emit('mark-note-read', props.note)
    }

    return {
      title,
      description,
      createdAt,
      getMarkLoadingState,
      getTaggedStatus,
      getNoteTagLoadingState,
      doneTapped,
      deleteTapped,
      markNoteRead
    }
  }
}
</script>
