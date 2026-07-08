<template>
  <div class="min-h-full bg-app-bg px-4 py-5 sm:px-6 lg:px-8">
    <div class="flex w-full flex-col gap-5">
      <section class="rounded-xl bg-gradient-to-br from-impuls-blue via-brand-700 to-brand-900 p-5 text-white shadow-soft sm:px-6 sm:py-7">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-sm font-medium text-blue-100">Kommunikation</p>
            <h1 class="mt-1 font-display text-2xl font-black tracking-tight sm:text-3xl">Notebox</h1>
            <p class="mt-2 max-w-3xl text-sm text-blue-100">
              Aufgaben, Rückfragen und interne Hinweise mit Status statt lose Nachrichten.
            </p>
          </div>
          <button
            class="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-impuls-blue hover:bg-blue-50"
            @click="navigate('NoteboxCreateNote')"
          >
            Neue Notiz
          </button>
        </div>
      </section>

      <section class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <button
          v-for="metric in metrics"
          :key="metric.title"
          :class="[
            'group rounded-xl border bg-white p-4 text-left shadow-card transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-card-hover',
            activeFilter === metric.filter ? 'border-blue-300 ring-2 ring-blue-100' : 'border-slate-200'
          ]"
          @click="activeFilter = metric.filter"
        >
          <span :class="['flex h-10 w-10 items-center justify-center rounded-xl', metric.badgeClass]"><component :is="metric.icon" class="h-5 w-5" aria-hidden="true" /></span>
          <p class="mt-4 text-3xl font-bold tracking-tight text-slate-900 tabular-nums">{{ metric.value }}</p>
          <p class="mt-1 text-sm font-medium text-slate-600">{{ metric.title }}</p>
        </button>
      </section>

      <div class="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.55fr)]">
        <section class="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div class="border-b border-slate-200 px-5 py-4">
            <h2 class="text-lg font-semibold text-slate-900">Offene Themen</h2>
            <p class="text-sm text-slate-500">Für Verwaltung, GF und Päd. Leitung nach Zuständigkeit sortiert.</p>
          </div>
          <div class="divide-y divide-slate-100">
            <article
              v-for="note in filteredNotes"
              :key="note.id"
              class="grid gap-4 px-5 py-4 2xl:grid-cols-[minmax(0,1fr)_150px_150px_120px]"
            >
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <h3 class="font-semibold text-slate-900">{{ note.title }}</h3>
                  <span :class="['rounded-full px-2.5 py-1 text-xs font-semibold', note.badgeClass]">
                    {{ note.status }}
                  </span>
                </div>
                <p class="mt-1 text-sm text-slate-600">{{ note.description }}</p>
              </div>
              <div>
                <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Zuständig</p>
                <p class="mt-1 text-sm font-semibold text-slate-800">{{ note.owner }}</p>
              </div>
              <div>
                <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Fällig</p>
                <p class="mt-1 text-sm font-semibold text-slate-800">{{ note.due }}</p>
              </div>
              <div class="flex items-center lg:justify-end">
                <button class="rounded-lg px-3 py-2 text-sm font-semibold text-impuls-blue hover:bg-blue-50">
                  Öffnen
                </button>
              </div>
            </article>
          </div>
        </section>

        <aside class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 class="text-lg font-semibold text-slate-900">Arbeitslogik</h2>
          <div class="mt-4 grid gap-3">
            <div
              v-for="step in workflow"
              :key="step.title"
              class="flex gap-3 rounded-lg bg-slate-50 p-3"
            >
              <span :class="['flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg', step.bgClass]">
                <component :is="step.icon" class="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p class="font-semibold text-slate-900">{{ step.title }}</p>
                <p class="text-sm text-slate-600">{{ step.description }}</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  PencilSquareIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'NoteboxOverview',
  components: {
    ChatBubbleLeftRightIcon,
    CheckCircleIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    PencilSquareIcon
  },
  setup() {
    const router = useRouter()
    const activeFilter = ref('open')

    const metrics = [
      {
        title: 'Offen',
        value: 6,
        filter: 'open',
        icon: ClockIcon,
        iconClass: 'text-blue-500'
      },
      {
        title: 'Rückfragen',
        value: 3,
        filter: 'question',
        icon: ExclamationTriangleIcon,
        iconClass: 'text-amber-500'
      },
      {
        title: 'Heute fällig',
        value: 2,
        filter: 'today',
        icon: ChatBubbleLeftRightIcon,
        iconClass: 'text-orange-500'
      },
      {
        title: 'Erledigt',
        value: 14,
        filter: 'done',
        icon: CheckCircleIcon,
        iconClass: 'text-emerald-500'
      }
    ]

    const notes = [
      {
        id: 'note-1',
        title: 'Doku Rückfrage Lina',
        description: 'Päd. Leitung soll Tagesdoku vor Rechnung prüfen.',
        owner: 'Päd. Leitung',
        due: 'heute',
        status: 'offen',
        filter: 'open',
        badgeClass: 'bg-blue-100 text-blue-700'
      },
      {
        id: 'note-2',
        title: 'Nachweis Max unterschreiben',
        description: 'Unterschrift fehlt, Verwaltung wartet auf Rückmeldung.',
        owner: 'Mira Demir',
        due: '05.05.2026',
        status: 'Rückfrage',
        filter: 'question',
        badgeClass: 'bg-amber-100 text-amber-700'
      },
      {
        id: 'note-3',
        title: 'Rechnungslauf Mai',
        description: 'GF prüft offene Summen im Rechnungsbereich.',
        owner: 'GF',
        due: 'heute',
        status: 'heute',
        filter: 'today',
        badgeClass: 'bg-orange-100 text-orange-700'
      }
    ]

    const filteredNotes = computed(() => {
      if (activeFilter.value === 'done') {
        return []
      }
      return notes.filter((note) => note.filter === activeFilter.value || activeFilter.value === 'open')
    })

    const workflow = [
      {
        title: 'Zuständig',
        description: 'Jede Notiz hat eine Person oder Rolle.',
        icon: PencilSquareIcon,
        bgClass: 'bg-blue-100 text-blue-700'
      },
      {
        title: 'Fällig',
        description: 'Rückfragen sollen vor Abrechnung sichtbar werden.',
        icon: ClockIcon,
        bgClass: 'bg-orange-100 text-orange-700'
      },
      {
        title: 'Erledigt',
        description: 'Abgehakte Themen verschwinden aus der Arbeitsliste.',
        icon: CheckCircleIcon,
        bgClass: 'bg-emerald-100 text-emerald-700'
      }
    ]

    function navigate(routeName) {
      router.push({ name: routeName })
    }

    return {
      activeFilter,
      filteredNotes,
      metrics,
      navigate,
      workflow
    }
  }
}
</script>
