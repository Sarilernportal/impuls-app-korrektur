<template>
  <div class="mx-auto max-w-5xl px-4 py-4 sm:px-6">
    <section class="rounded-xl border border-slate-200 bg-white p-4 shadow-card sm:p-5">
      <p class="text-sm font-medium text-impuls-blue">Kalender</p>
      <h2 class="mt-1 font-display text-2xl font-bold tracking-tight text-slate-900">Termine und Kalendergruppen</h2>
      <p class="mt-2 text-sm text-slate-600">
        Wählen Sie einen Tag, um die zugehörigen Termine zu sehen.
      </p>
    </section>

    <div class="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section class="rounded-xl border border-slate-200 bg-white p-4 shadow-card sm:p-5">
        <div
          v-if="isLoading"
          class="flex w-full justify-center p-6"
        >
          <LoadingSpinner size="h-12 w-12" />
        </div>
        <Calendar
          v-else
          :calendars="events"
          @date-selected="dateSelected"
        />
      </section>

      <section class="rounded-xl border border-slate-200 bg-white p-4 shadow-card sm:p-5">
        <div class="flex items-center justify-between">
          <h3 class="font-display text-lg font-bold text-slate-900">Termine</h3>
          <span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
            {{ filteredEvents.length }} geplant
          </span>
        </div>
        <div
          v-if="eventsLoading"
          class="flex w-full justify-center p-6"
        >
          <LoadingSpinner size="h-12 w-12" />
        </div>
        <div
          v-else-if="filteredEvents.length <= 0"
          class="mt-4 rounded-lg bg-slate-50 p-5 text-center"
        >
          <CalendarDaysIcon
            class="mx-auto h-9 w-9 text-slate-400"
            aria-hidden="true"
          />
          <p class="mt-2 font-semibold text-slate-900">Kein Termin ausgewählt</p>
          <p class="mt-1 text-sm text-slate-600">
            Tippe im Kalender auf einen Tag.
          </p>
        </div>
        <div
          v-else
          class="mt-4 grid gap-3"
        >
          <EventItem
            v-for="event of filteredEvents"
            :key="event.id"
            :event="event"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { CalendarDaysIcon } from '@heroicons/vue/24/outline'
import LoadingSpinner from '@/components/UIComponents/Utilities/LoadingSpinner.vue'
import Calendar from '@/components/Main/Guardian/Calendar/Calendar.vue'
import EventItem from '@/components/Main/Guardian/Calendar/EventItem.vue'

export default {
  components: {
    CalendarDaysIcon,
    LoadingSpinner,
    Calendar,
    EventItem
  },
  setup() {
    const events = ref([])
    const filteredEvents = ref([])
    const isLoading = ref(false)
    const eventsLoading = ref(false)
    const startDate = ref(
      new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    )
    const endDate = ref(
      new Date(new Date().getFullYear(), new Date().getMonth() + 3, 0)
    )

    const store = useStore()

    async function getEvents() {
      try {
        isLoading.value = true
        const response = await store.dispatch('guardianListEvents', {
          startDate: startDate.value,
          endDate: endDate.value
        })
        events.value = response
      } catch (error) {
        console.log(error)
      } finally {
        isLoading.value = false
      }
    }

    async function dateSelected(date) {
      try {
        eventsLoading.value = true
        const offset = new Date(date).getTimezoneOffset() * 60 * 1000
        const start = new Date(
          new Date(new Date(date).setHours(0)).valueOf() - offset
        ).toISOString()
        const end = new Date(
          new Date(new Date(date).setHours(24)).valueOf() - offset
        ).toISOString()

        const response = await store.dispatch('guardianListEvents', {
          startDate: start,
          endDate: end
        })

        filteredEvents.value = response.sort((a, b) =>
          new Date(a.startDate) > new Date(b.startDate)
            ? 1
            : new Date(b.startDate) > new Date(a.startDate)
              ? -1
              : 0
        )
      } catch (error) {
        console.log(error)
      } finally {
        eventsLoading.value = false
      }
    }

    onMounted(async () => {
      await getEvents()
    })

    return {
      events,
      filteredEvents,
      isLoading,
      eventsLoading,
      dateSelected
    }
  }
}
</script>
