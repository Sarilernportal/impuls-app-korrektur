<template>
  <!-- Termin-Karte -->
  <div class="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
    <div class="flex items-start justify-between gap-3">
      <h3 class="min-w-0 break-words font-display text-base font-bold text-slate-900">
        {{ event.title || 'Termin' }}
      </h3>
      <span
        v-if="timeRange"
        class="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium tabular-nums text-slate-600"
      >{{ timeRange }}</span>
    </div>
    <p
      v-if="event.description"
      class="mt-1 text-sm text-slate-500"
    >{{ event.description }}</p>
    <p
      v-if="dayLabel"
      class="mt-2 text-xs text-slate-400"
    >{{ dayLabel }}</p>
    <a
      v-if="event.link"
      :href="event.link"
      target="_blank"
      rel="noopener noreferrer"
      class="mt-2 inline-flex items-center break-all text-sm font-medium text-impuls-blue hover:underline"
    >{{ event.link }}</a>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  props: {
    event: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const pad = (n) => (n < 10 ? `0${n}` : `${n}`)

    // Startzeit in Minuten seit Mitternacht – direkt aus dem ISO-Zeitanteil,
    // damit keine Zeitzonen-Verschiebung entsteht.
    const startMinutes = computed(() => {
      try {
        const [hours, minutes] = props.event.startDate
          .split('T')[1]
          .split(':')
        return Number(hours) * 60 + Number(minutes)
      } catch (error) {
        return null
      }
    })

    // Zeitspanne "HH:MM – HH:MM Uhr" mit korrektem Minuten-/Stunden-Überlauf.
    const timeRange = computed(() => {
      if (startMinutes.value === null) return ''
      const duration = Math.round((Number(props.event.durationInHours) || 0) * 60)
      const end = startMinutes.value + duration
      const fmt = (total) => `${pad(Math.floor(total / 60) % 24)}:${pad(total % 60)}`
      return `${fmt(startMinutes.value)} – ${fmt(end)} Uhr`
    })

    const dayLabel = computed(() => {
      try {
        return new Date(props.event.startDate).toLocaleDateString('de-DE', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      } catch (error) {
        return ''
      }
    })

    return {
      timeRange,
      dayLabel
    }
  }
}
</script>
