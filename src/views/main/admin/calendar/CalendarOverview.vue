<template>
  <div class="min-h-full bg-slate-50 px-4 py-5 sm:px-6 lg:px-8">
    <div class="flex w-full flex-col gap-5">
      <section class="rounded-xl bg-gradient-to-br from-impuls-blue via-brand-700 to-brand-900 p-5 text-white shadow-soft sm:px-6 sm:py-7">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-sm font-medium text-blue-100">Termine</p>
            <h1 class="mt-1 text-2xl font-bold sm:text-3xl">Kalender-Zentrale</h1>
            <p class="mt-2 max-w-3xl text-sm text-blue-100">
              Termine nach Klienten, Mitarbeitenden und Verwaltung sichtbar machen.
            </p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              class="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-impuls-blue hover:bg-blue-50"
              @click="navigate('NewEvent')"
            >
              Neuer Termin
            </button>
            <button
              class="rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/25"
              @click="navigate('NewCalendar')"
            >
              Neue Gruppe
            </button>
          </div>
        </div>
      </section>

      <section class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div
          v-for="metric in metrics"
          :key="metric.title"
          class="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-card"
        >
          <span :class="['flex h-10 w-10 items-center justify-center rounded-xl', metric.badgeClass]"><component :is="metric.icon" class="h-5 w-5" aria-hidden="true" /></span>
          <p class="mt-4 text-3xl font-bold tracking-tight text-slate-900 tabular-nums">{{ metric.value }}</p>
          <p class="mt-1 text-sm font-medium text-slate-600">{{ metric.title }}</p>
        </div>
      </section>

      <div class="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.55fr)]">
        <section class="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div class="border-b border-slate-200 px-5 py-4">
            <h2 class="text-lg font-semibold text-slate-900">Heute und diese Woche</h2>
            <p class="text-sm text-slate-500">Termine sind nach Zweck gruppiert, nicht nur nach Datum.</p>
          </div>
          <div class="divide-y divide-slate-100">
            <article
              v-for="event in events"
              :key="event.id"
              class="grid gap-4 px-5 py-4 2xl:grid-cols-[minmax(0,1fr)_150px_150px_120px]"
            >
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <h3 class="font-semibold text-slate-900">{{ event.title }}</h3>
                  <span :class="['rounded-full px-2.5 py-1 text-xs font-semibold', event.badgeClass]">
                    {{ event.type }}
                  </span>
                </div>
                <p class="mt-1 text-sm text-slate-600">{{ event.description }}</p>
              </div>
              <div>
                <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Zeit</p>
                <p class="mt-1 text-sm font-semibold text-slate-800">{{ event.time }}</p>
              </div>
              <div>
                <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Zuständig</p>
                <p class="mt-1 text-sm font-semibold text-slate-800">{{ event.owner }}</p>
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
          <h2 class="text-lg font-semibold text-slate-900">Kalendergruppen</h2>
          <div class="mt-4 grid gap-3">
            <button
              v-for="group in groups"
              :key="group.title"
              class="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-3 text-left hover:border-blue-200 hover:bg-blue-50"
            >
              <span class="flex items-center gap-3">
                <span :class="['h-3 w-3 rounded-full', group.color]" />
                <span>
                  <span class="block text-sm font-semibold text-slate-900">{{ group.title }}</span>
                  <span class="block text-xs text-slate-500">{{ group.description }}</span>
                </span>
              </span>
              <ArrowRightIcon class="h-4 w-4 text-slate-400" aria-hidden="true" />
            </button>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import {
  ArrowRightIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
  UsersIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'CalendarOverview',
  components: {
    ArrowRightIcon,
    CalendarDaysIcon,
    ClockIcon,
    UserGroupIcon,
    UsersIcon
  },
  setup() {
    const router = useRouter()

    const metrics = [
      {
        title: 'Termine heute',
        value: 5,
        icon: CalendarDaysIcon,
        iconClass: 'text-blue-500'
      },
      {
        title: 'Betreuung',
        value: 3,
        icon: UserGroupIcon,
        iconClass: 'text-emerald-500'
      },
      {
        title: 'Interne Termine',
        value: 2,
        icon: UsersIcon,
        iconClass: 'text-sky-500'
      },
      {
        title: 'Diese Woche',
        value: 18,
        icon: ClockIcon,
        iconClass: 'text-orange-500'
      }
    ]

    const events = [
      {
        id: 'event-1',
        title: 'Lina Beispiel',
        description: 'Schulbegleitung und Doku-Erinnerung',
        time: '09:00 bis 11:00',
        owner: 'Mira Demir',
        type: 'Betreuung',
        badgeClass: 'bg-emerald-100 text-emerald-700'
      },
      {
        id: 'event-2',
        title: 'Abrechnung Mai',
        description: 'Nachweise prüfen und offene Rückfragen klären',
        time: '13:00',
        owner: 'Verwaltung',
        type: 'Intern',
        badgeClass: 'bg-sky-100 text-sky-700'
      },
      {
        id: 'event-3',
        title: 'Päd. Fallbesprechung',
        description: 'Rückfrage zu Dokumentation Noah',
        time: '15:30',
        owner: 'Päd. Leitung',
        type: 'Päd.',
        badgeClass: 'bg-orange-100 text-orange-700'
      }
    ]

    const groups = [
      {
        title: 'Betreuung',
        description: 'Klienten und Mitarbeitende',
        color: 'bg-emerald-500'
      },
      {
        title: 'Verwaltung',
        description: 'Abrechnung, Fristen, Rückfragen',
        color: 'bg-sky-500'
      },
      {
        title: 'Päd. Leitung',
        description: 'Doku- und Fallbesprechungen',
        color: 'bg-orange-500'
      }
    ]

    function navigate(routeName) {
      router.push({ name: routeName })
    }

    return {
      events,
      groups,
      metrics,
      navigate
    }
  }
}
</script>
