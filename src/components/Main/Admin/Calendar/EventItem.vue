<template>
  <!-- main container -->
  <div
    :class="['w-full md:w-3/4 gap-2 rounded-xl border border-slate-200 p-3 shadow-card', showInPrint ? 'flex' : 'flex print:hidden bg-white']"
  >
    <!-- info section -->
    <div
      :id="event.id"
      class="w-full"
    >
      <!-- event title -->
      <div class="flex flex-col mb-2">
        <h3 class="w-full font-semibold text-primaryText">Titel</h3>
        <p class="w-full text-secondaryText">
          {{ event.title }}
        </p>
      </div>
      <!-- event description -->
      <div class="flex flex-col mb-2">
        <h3 class="w-full font-semibold text-primaryText">Beschreibung</h3>
        <p class="w-full text-secondaryText whitespace-pre-line">
          {{ event.description }}
        </p>
      </div>
      <!-- event link -->
      <div
        v-if="event.link !== '' && event.link"
        class="flex flex-col mb-2"
      >
        <h3 class="w-full font-semibold text-primaryText">Link</h3>
        <p class="w-full text-blue-500 hover:text-blue-400 break-all">
          <a
            :href="event.link"
            target="_blank"
            rel="noopener noreferrer"
          >{{ event.link }}</a>
        </p>
      </div>
      <!-- event date -->
      <div class="flex flex-col mb-2">
        <h3 class="w-full font-semibold text-primaryText">Datum</h3>
        <p class="w-full text-secondaryText">
          {{ eventDate }}
        </p>
      </div>
      <!-- participants -->
      <div class="border-t border-slate-200 flex pt-2 gap-2 flex-wrap">
        <h3 class="w-full font-semibold text-primaryText hidden print:flex">Teilnehmer</h3>
        <CalendarDetailsParticipationTile
          v-for="participation in participations"
          :participation="participation"
          :key="participation.id"
          :allowDelete="false"
          :userList="userList"
        />
      </div>
    </div>
    <!-- options section -->
    <div class="flex flex-col gap-2 print:hidden">
      <button
        @click="deleteTapped"
        title="Termin löschen"
        class="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
      >
        <XMarkIcon class="h-5 w-5" />
      </button>
      <button
        @click="printTapped"
        title="Drucken"
        class="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
      >
        <PrinterIcon class="h-5 w-5" />
      </button>
    </div>
  </div>
</template>

<script>
// vue imports
import { ref, computed, onMounted, nextTick } from 'vue'
import { useStore } from 'vuex'

// component imports
import CalendarDetailsParticipationTile from '@/components/Main/Admin/Calendar/CalendarDetailsParticipationTile.vue'

// icon imports
import { XMarkIcon, PrinterIcon } from '@heroicons/vue/24/outline'

export default {
  components: {
    XMarkIcon,
    PrinterIcon,
    CalendarDetailsParticipationTile
  },
  props: {
    event: {
      type: Object,
      required: true
    },
    userList: {
      type: Object,
      required: true
    }
  },
  emits: ['delete-tapped'],
  setup(props, { emit }) {
    // initialize refs
    const participations = ref([])
    const showInPrint = ref(false)

    // initialize soter
    const store = useStore()

    // Get the date of event
    const eventDate = computed(() => {
      try {
        const dayName = new Date(props.event.startDate).toLocaleDateString('de-DE')
        const pad = (n) => (n < 10 ? `0${n}` : `${n}`)
        // Startzeit in Minuten seit Mitternacht direkt aus dem ISO-Zeitanteil
        // (kein Zeitzonen-Hack), damit die Anzeige stabil bleibt.
        const [hours, minutes] = props.event.startDate.split('T')[1].split(':')
        const startTotal = Number(hours) * 60 + Number(minutes)
        const duration = Math.round((Number(props.event.durationInHours) || 0) * 60)
        const endTotal = startTotal + duration
        // korrekter Minuten-/Stunden-Ueberlauf (behebt z.B. "10:60")
        const fmt = (total) => `${pad(Math.floor(total / 60) % 24)}:${pad(total % 60)}`
        return `${dayName}, ${fmt(startTotal)} - ${fmt(endTotal)} Uhr`
      } catch (error) {
        console.log(error)
        // Fallback
        return 'Keine Angabe'
      }
    })

    // get participations from AppSync to display participants
    async function getParticipations() {
      try {
        // get participations via store
        const participationResp = await store.dispatch(
          'listParticipationByCalendar',
          { id: props.event.calendarEventsId }
        )

        // save participations in ref
        participations.value =
          participationResp.data.participationByCalendar.items
      } catch (error) {
        console.log(error)
      }
    }

    // emit delete tap
    function deleteTapped() {
      emit('delete-tapped', props.event)
    }

    // open print window for participations
    function printTapped() {
      // update to change tailwind properties
      showInPrint.value = true
      // wait for DOM to rerender with new properties, this is required to actually show the element with its new values
      nextTick(() => {
        window.print()
      })
      // wait for printing menu to open and pull DOM, only then reset tailwind properties as it doesn't effect the print view anymore
      nextTick(() => {
        showInPrint.value = false
      })
    }

    // reset print css properties
    function closePrint() {
      showInPrint.value = false
    }

    onMounted(async () => {
      getParticipations()
    })

    return {
      eventDate,
      participations,
      showInPrint,
      deleteTapped,
      printTapped,
      closePrint
    }
  }
}
</script>
