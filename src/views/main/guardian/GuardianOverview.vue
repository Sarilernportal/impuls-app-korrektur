<template>
  <div class="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-4 sm:px-6 lg:px-8">
    <section class="rounded-xl bg-gradient-to-br from-impuls-blue via-brand-700 to-brand-900 px-5 py-6 text-white shadow-soft sm:px-6">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-sm font-medium text-blue-100">{{ todayLabel }}</p>
          <h2 class="mt-1 font-display text-2xl font-bold tracking-tight sm:text-3xl">Hallo, Mira</h2>
          <p class="mt-2 max-w-2xl text-sm text-blue-100">
            Ihre wichtigsten Aufgaben, Termine und Klienten auf einen Blick.
          </p>
        </div>
        <button
          class="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-impuls-blue hover:bg-blue-50"
          @click="navigate('ReportSubMenu')"
        >
          Dokumentation starten
        </button>
      </div>
    </section>

    <section class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <button
        v-for="card in statusCards"
        :key="card.title"
        @click="navigate(card.route)"
        class="group rounded-xl border border-slate-200 bg-white p-4 text-left shadow-card transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-card-hover"
      >
        <div class="flex items-center justify-between">
          <span :class="['flex h-10 w-10 items-center justify-center rounded-xl', card.badgeClass]">
            <component
              :is="card.icon"
              class="h-5 w-5"
              aria-hidden="true"
            />
          </span>
          <span :class="['rounded-full px-2 py-0.5 text-xs font-semibold', card.badgeClass]">
            {{ card.badge }}
          </span>
        </div>
        <p class="mt-4 text-3xl font-bold tracking-tight text-slate-900 tabular-nums">{{ card.value }}</p>
        <p class="mt-1 text-sm font-medium text-slate-600">{{ card.title }}</p>
      </button>
    </section>

    <div class="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
      <div class="grid gap-5">
        <section class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-display text-lg font-bold text-slate-900">Priorität</h3>
              <p class="text-sm text-slate-500">Was zuerst erledigt werden sollte.</p>
            </div>
            <span class="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
              3 offen
            </span>
          </div>
          <div class="mt-4 grid gap-3">
            <button
              v-for="task in priorityTasks"
              :key="task.title"
              @click="navigate(task.route)"
              class="flex items-start gap-3 rounded-lg border border-slate-200 p-3 text-left hover:border-blue-200 hover:bg-blue-50"
            >
              <span :class="['mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg', task.bgClass]">
                <component
                  :is="task.icon"
                  class="h-5 w-5"
                  aria-hidden="true"
                />
              </span>
              <span class="min-w-0 flex-1">
                <span class="block font-semibold text-slate-900">{{ task.title }}</span>
                <span class="block text-sm text-slate-600">{{ task.description }}</span>
              </span>
              <ChevronRightIcon
                class="mt-2 h-4 w-4 text-slate-400"
                aria-hidden="true"
              />
            </button>
          </div>
        </section>

        <section class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-display text-lg font-bold text-slate-900">Heute</h3>
              <p class="text-sm text-slate-500">Termine und Arbeitsschritte.</p>
            </div>
            <button
              class="rounded-lg px-3 py-2 text-sm font-semibold text-impuls-blue hover:bg-blue-50"
              @click="navigate('GuardianCalendarOverview')"
            >
              Kalender
            </button>
          </div>
          <div class="mt-4 grid gap-3">
            <div
              v-for="item in todayItems"
              :key="item.time"
              class="grid grid-cols-[64px_minmax(0,1fr)] gap-3 rounded-lg bg-slate-50 p-3"
            >
              <div class="text-sm font-bold text-impuls-blue">{{ item.time }}</div>
              <div>
                <p class="font-semibold text-slate-900">{{ item.title }}</p>
                <p class="text-sm text-slate-600">{{ item.description }}</p>
              </div>
            </div>
          </div>
        </section>

        <section class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-display text-lg font-bold text-slate-900">Meine Klienten</h3>
              <p class="text-sm text-slate-500">Status pro Klient, ohne lange Suche.</p>
            </div>
            <span class="text-sm font-medium text-slate-500">2 aktiv</span>
          </div>
          <div class="mt-4 grid gap-3">
            <div
              v-for="client in clients"
              :key="client.name"
              class="rounded-lg border border-slate-200 p-3"
            >
              <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div class="flex items-center gap-3">
                  <InitialsAvatar :name="client.name" size-class="h-10 w-10 text-sm" />
                  <div class="min-w-0">
                    <p class="font-semibold text-slate-900">{{ client.name }}</p>
                    <p class="text-sm text-slate-600">{{ client.subtitle }}</p>
                  </div>
                </div>
                <span :class="['inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold', client.badgeClass]">
                  <span class="mr-1.5 h-1.5 w-1.5 rounded-full bg-current opacity-70"></span>
                  {{ client.status }}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <aside class="grid gap-5">
        <section class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <h3 class="font-display text-lg font-bold text-slate-900">Schnell starten</h3>
          <div class="mt-4 grid gap-3">
            <button
              v-for="action in quickActions"
              :key="action.title"
              @click="navigate(action.route)"
              class="flex items-center gap-3 rounded-lg border border-slate-200 p-3 text-left hover:border-blue-200 hover:bg-blue-50"
            >
              <span :class="['flex h-10 w-10 items-center justify-center rounded-lg', action.bgClass]">
                <component
                  :is="action.icon"
                  class="h-5 w-5"
                  aria-hidden="true"
                />
              </span>
              <span>
                <span class="block text-sm font-semibold text-slate-900">{{ action.title }}</span>
                <span class="block text-xs text-slate-500">{{ action.description }}</span>
              </span>
            </button>
          </div>
        </section>

        <section class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <h3 class="font-display text-lg font-bold text-slate-900">Rückgaben</h3>
          <div class="mt-4 rounded-lg bg-emerald-50 p-4 text-emerald-800">
            <CheckCircleIcon
              class="h-6 w-6"
              aria-hidden="true"
            />
            <p class="mt-2 font-semibold">Keine offenen Rückgaben</p>
            <p class="mt-1 text-sm text-emerald-700">
              Markierte Berichte erscheinen hier sofort mit nächstem Schritt.
            </p>
          </div>
        </section>

        <section class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <h3 class="font-display text-lg font-bold text-slate-900">Arbeitsstand</h3>
          <div class="mt-4 space-y-4">
            <div
              v-for="progress in progressItems"
              :key="progress.title"
            >
              <div class="flex justify-between text-sm">
                <span class="font-medium text-slate-700">{{ progress.title }}</span>
                <span class="text-slate-500">{{ progress.value }}%</span>
              </div>
              <div class="mt-2 h-2 rounded-full bg-slate-100">
                <div
                  class="h-2 rounded-full bg-impuls-blue"
                  :style="{ width: `${progress.value}%` }"
                ></div>
              </div>
            </div>
          </div>
        </section>
      </aside>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArchiveBoxIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  ClockIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  PencilSquareIcon,
  StarIcon
} from '@heroicons/vue/24/outline'
import InitialsAvatar from '@/components/UIComponents/InitialsAvatar.vue'

export default {
  name: 'GuardianOverview',
  components: {
    InitialsAvatar,
    ArchiveBoxIcon,
    CalendarDaysIcon,
    CheckCircleIcon,
    ChevronRightIcon,
    ClockIcon,
    DocumentTextIcon,
    ExclamationTriangleIcon,
    PencilSquareIcon,
    StarIcon
  },
  setup() {
    const router = useRouter()

    const todayLabel = computed(() =>
      new Date().toLocaleDateString('de-DE', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      })
    )

    const statusCards = [
      {
        title: 'Dokumentationen offen',
        value: '2',
        badge: 'heute',
        route: 'ReportSubMenu',
        icon: DocumentTextIcon,
        iconClass: 'text-amber-500',
        badgeClass: 'bg-amber-100 text-amber-700'
      },
      {
        title: 'Nachweis offen',
        value: '1',
        badge: 'prüfen',
        route: 'ProofView',
        icon: ClockIcon,
        iconClass: 'text-blue-500',
        badgeClass: 'bg-blue-100 text-blue-700'
      },
      {
        title: 'Rückgaben',
        value: '0',
        badge: 'ok',
        route: 'GuardianFlaggedOverview',
        icon: CheckCircleIcon,
        iconClass: 'text-emerald-500',
        badgeClass: 'bg-emerald-100 text-emerald-700'
      },
      {
        title: 'Termine',
        value: '3',
        badge: 'Woche',
        route: 'GuardianCalendarOverview',
        icon: CalendarDaysIcon,
        iconClass: 'text-sky-500',
        badgeClass: 'bg-sky-100 text-sky-700'
      }
    ]

    const priorityTasks = [
      {
        title: 'Lina Beispiel dokumentieren',
        description: 'Termin heute 09:00, Eintrag noch offen',
        route: 'ReportSubMenu',
        icon: PencilSquareIcon,
        bgClass: 'bg-amber-100 text-amber-700'
      },
      {
        title: 'Nachweis prüfen',
        description: 'Ein offener Nachweis wartet auf Abschluss',
        route: 'ProofView',
        icon: ClockIcon,
        bgClass: 'bg-blue-100 text-blue-700'
      },
      {
        title: 'Teamsitzung vorbereiten',
        description: 'Heute 15:00 im Kalender',
        route: 'GuardianCalendarOverview',
        icon: CalendarDaysIcon,
        bgClass: 'bg-sky-100 text-sky-700'
      }
    ]

    const todayItems = [
      {
        time: '09:00',
        title: 'Lina Beispiel',
        description: 'Schulbegleitung, Dokumentation offen'
      },
      {
        time: '11:30',
        title: 'Max Muster',
        description: 'Regeltermin, alles aktuell'
      },
      {
        time: '15:00',
        title: 'Teamsitzung',
        description: 'Kalendergruppe Pädagogik'
      }
    ]

    const quickActions = [
      {
        title: 'Dokumentation',
        description: 'Tagesbericht schreiben',
        route: 'ReportSubMenu',
        icon: PencilSquareIcon,
        bgClass: 'bg-amber-100 text-amber-700'
      },
      {
        title: 'Sonderzeit',
        description: 'Urlaub, Krankheit, Teamsitzung',
        route: 'SpecialReportView',
        icon: StarIcon,
        bgClass: 'bg-violet-100 text-violet-700'
      },
      {
        title: 'Nachweis',
        description: 'Offene Stunden abschließen',
        route: 'ProofView',
        icon: ClockIcon,
        bgClass: 'bg-blue-100 text-blue-700'
      },
      {
        title: 'Sharebox',
        description: 'Dokumente öffnen',
        route: 'GuardianShareboxOverview',
        icon: ArchiveBoxIcon,
        bgClass: 'bg-emerald-100 text-emerald-700'
      }
    ]

    const clients = [
      {
        name: 'Lina Beispiel',
        subtitle: 'Nächster Termin heute 09:00',
        status: 'Doku offen',
        badgeClass: 'bg-amber-100 text-amber-700'
      },
      {
        name: 'Max Muster',
        subtitle: 'Nächster Termin heute 11:30',
        status: 'erledigt',
        badgeClass: 'bg-emerald-100 text-emerald-700'
      }
    ]

    const progressItems = [
      { title: 'Dokumentationen diese Woche', value: 67 },
      { title: 'Nachweise aktueller Monat', value: 82 },
      { title: 'Termine bestätigt', value: 100 }
    ]

    function navigate(routeName) {
      router.push({ name: routeName })
    }

    return {
      todayLabel,
      statusCards,
      priorityTasks,
      todayItems,
      quickActions,
      clients,
      progressItems,
      navigate
    }
  }
}
</script>
