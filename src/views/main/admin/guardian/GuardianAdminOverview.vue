<template>
  <div class="min-h-full bg-app-bg px-4 py-5 sm:px-6 lg:px-8">
    <div class="flex w-full flex-col gap-5">
      <section class="rounded-xl bg-gradient-to-br from-impuls-blue via-brand-700 to-brand-900 p-5 text-white shadow-soft sm:px-6 sm:py-7">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-sm font-medium text-blue-100">Verwaltung</p>
            <h1 class="mt-1 font-display text-2xl font-black tracking-tight sm:text-3xl">Mitarbeiter</h1>
            <p class="mt-2 max-w-3xl text-sm text-blue-100">
              Zuständigkeiten, Fachkraftstatus, Kontaktlücken und Abgabestatus für die Abrechnung schnell erkennen.
            </p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              class="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-impuls-blue hover:bg-blue-50"
              @click="newGuardian"
            >
              Neuer Betreuer
            </button>
            <button
              class="rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/25"
              @click="navigate('Timesheets')"
            >
              Nachweise prüfen
            </button>
          </div>
        </div>
      </section>

      <section class="flex flex-wrap gap-2">
        <button
          v-for="metric in metrics"
          :key="metric.title"
          :class="[
            'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition',
            selectedStatus === metric.filter
              ? 'border-impuls-blue bg-blue-50 text-impuls-blue'
              : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200'
          ]"
          @click="selectedStatus = metric.filter"
        >
          {{ metric.title }}
          <span :class="['rounded-full px-2 py-0.5 text-xs font-bold tabular-nums', metric.badgeClass]">{{ metric.value }}</span>
        </button>
      </section>

      <div class="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.55fr)]">
        <section class="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div class="border-b border-slate-200 px-5 py-4">
            <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 class="text-lg font-semibold text-slate-900">Teamübersicht</h2>
                <p class="text-sm text-slate-500">Wer betreut wen, was fehlt, was ist für Mai abrechnungsrelevant?</p>
              </div>
              <label class="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <MagnifyingGlassIcon class="h-5 w-5 text-slate-400" aria-hidden="true" />
                <input
                  v-model="searchValue"
                  type="search"
                  class="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  placeholder="Name, Kontakt oder Klient suchen"
                />
              </label>
            </div>
          </div>

          <div v-if="isLoading" class="divide-y divide-slate-100">
            <div
              v-for="n in 4"
              :key="n"
              class="flex items-center gap-3 px-5 py-4"
            >
              <div class="h-10 w-10 flex-shrink-0 animate-pulse rounded-full bg-slate-200"></div>
              <div class="flex-1 space-y-2">
                <div class="h-3.5 w-1/3 animate-pulse rounded bg-slate-200"></div>
                <div class="h-3 w-1/2 animate-pulse rounded bg-slate-100"></div>
              </div>
            </div>
          </div>

          <div v-else-if="filteredGuardians.length === 0" class="flex flex-col items-center px-5 py-12 text-center">
            <span class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <UserGroupIcon class="h-6 w-6 text-slate-400" aria-hidden="true" />
            </span>
            <p class="mt-3 text-sm font-semibold text-slate-900">Keine Mitarbeiter gefunden</p>
            <p class="mt-1 text-sm text-slate-500">Passe Suche oder Statusfilter an.</p>
          </div>

          <div v-else class="divide-y divide-slate-100">
            <article
              v-for="guardian in filteredGuardians"
              :key="guardian.id"
              class="grid gap-4 px-5 py-4 2xl:grid-cols-[minmax(0,1fr)_minmax(190px,0.75fr)_minmax(180px,0.7fr)_160px]"
            >
              <div class="flex items-start gap-3">
                <InitialsAvatar :name="fullName(guardian)" size-class="h-10 w-10 text-sm" />
                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-2">
                    <h3 class="font-semibold text-slate-900">{{ fullName(guardian) }}</h3>
                    <span :class="['inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold', professionalStatus(guardian).class]">
                      <span class="mr-1.5 h-1.5 w-1.5 rounded-full bg-current opacity-70"></span>
                      {{ professionalStatus(guardian).label }}
                    </span>
                  </div>
                  <p class="mt-1 truncate text-sm text-slate-600">{{ guardian.email || 'E-Mail fehlt' }}</p>
                </div>
              </div>
              <div>
                <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Klienten</p>
                <p class="mt-1 text-sm font-semibold text-slate-800">{{ childrenLine(guardian) }}</p>
              </div>
              <div>
                <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Abgabe</p>
                <span :class="['mt-1 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold', timesheetStatus(guardian).class]">
                  <span class="mr-1.5 h-1.5 w-1.5 rounded-full bg-current opacity-70"></span>
                  {{ timesheetStatus(guardian).label }}
                </span>
              </div>
              <div class="flex items-center justify-between gap-2 lg:justify-end">
                <button
                  class="rounded-lg px-3 py-2 text-sm font-semibold text-impuls-blue hover:bg-blue-50"
                  @click="openTimesheets(guardian)"
                >
                  Nachweise
                </button>
                <button
                  class="rounded-lg bg-impuls-blue px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  @click="openGuardian(guardian)"
                >
                  Öffnen
                </button>
              </div>
            </article>
          </div>
        </section>

        <aside class="grid gap-5">
          <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 class="text-lg font-semibold text-slate-900">Teamprüfung</h2>
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
          </section>

          <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 class="text-lg font-semibold text-slate-900">Schnellzugriff</h2>
            <div class="mt-4 grid gap-2">
              <button
                v-for="link in quickLinks"
                :key="link.title"
                class="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-3 text-left hover:border-blue-200 hover:bg-blue-50"
                @click="navigate(link.route)"
              >
                <span>
                  <span class="block text-sm font-semibold text-slate-900">{{ link.title }}</span>
                  <span class="block text-xs text-slate-500">{{ link.description }}</span>
                </span>
                <ArrowRightIcon class="h-4 w-4 text-slate-400" aria-hidden="true" />
              </button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  IdentificationIcon,
  MagnifyingGlassIcon,
  UserGroupIcon
} from '@heroicons/vue/24/outline'
import InitialsAvatar from '@/components/UIComponents/InitialsAvatar.vue'

export default {
  name: 'GuardianOverview',
  components: {
    ArrowRightIcon,
    CheckCircleIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    IdentificationIcon,
    MagnifyingGlassIcon,
    UserGroupIcon,
    InitialsAvatar
  },
  setup() {
    const router = useRouter()
    const store = useStore()
    const guardians = ref([])
    const isLoading = ref(false)
    const searchValue = ref('')
    const selectedStatus = ref('all')

    onMounted(fetchGuardians)

    async function fetchGuardians() {
      isLoading.value = true
      try {
        const response = await store.dispatch('fetchGuardians', {
          nextToken: null,
          filter: ''
        })
        guardians.value = response.items || []
      } catch (error) {
        console.log(error)
        guardians.value = []
      } finally {
        isLoading.value = false
      }
    }

    const metrics = computed(() => {
      const professionals = guardians.value.filter((guardian) => guardian.professional)
      const missingContact = guardians.value.filter((guardian) => !guardian.phone || !guardian.email)
      const lateTimesheets = guardians.value.filter((guardian) => timesheetStatus(guardian).level === 'late')
      const withClients = guardians.value.filter((guardian) => guardian.careAssignments?.items?.length)

      return [
        {
          title: 'Aktive Mitarbeiter',
          value: guardians.value.length,
          badge: 'alle',
          filter: 'all',
          icon: UserGroupIcon,
          iconClass: 'text-blue-500',
          badgeClass: 'bg-blue-100 text-blue-700'
        },
        {
          title: 'Fachkräfte',
          value: professionals.length,
          badge: 'Status',
          filter: 'professional',
          icon: IdentificationIcon,
          iconClass: 'text-emerald-500',
          badgeClass: 'bg-emerald-100 text-emerald-700'
        },
        {
          title: 'Kontakt offen',
          value: missingContact.length,
          badge: 'prüfen',
          filter: 'contact',
          icon: ExclamationTriangleIcon,
          iconClass: 'text-amber-500',
          badgeClass: 'bg-amber-100 text-amber-700'
        },
        {
          title: 'Nachweis verspätet',
          value: lateTimesheets.length,
          badge: 'offen',
          filter: 'late',
          icon: ClockIcon,
          iconClass: 'text-orange-500',
          badgeClass: 'bg-orange-100 text-orange-700'
        },
        {
          title: 'Mit Klienten',
          value: withClients.length,
          badge: 'zugeordnet',
          filter: 'withClients',
          icon: CheckCircleIcon,
          iconClass: 'text-sky-500',
          badgeClass: 'bg-sky-100 text-sky-700'
        }
      ]
    })

    const filteredGuardians = computed(() => {
      const search = searchValue.value.toLowerCase().trim()
      return guardians.value.filter((guardian) => {
        const matchesSearch = !search || [
          fullName(guardian),
          guardian.email,
          guardian.phone,
          childrenLine(guardian)
        ].filter(Boolean).some((value) => value.toLowerCase().includes(search))

        if (!matchesSearch) {
          return false
        }

        if (selectedStatus.value === 'professional') {
          return guardian.professional
        }
        if (selectedStatus.value === 'contact') {
          return !guardian.phone || !guardian.email
        }
        if (selectedStatus.value === 'late') {
          return timesheetStatus(guardian).level === 'late'
        }
        if (selectedStatus.value === 'withClients') {
          return guardian.careAssignments?.items?.length
        }
        return true
      })
    })

    const workflow = [
      {
        title: '1. Rolle klären',
        description: 'Fachkraftstatus und Zuständigkeit nachvollziehbar halten.',
        icon: IdentificationIcon,
        bgClass: 'bg-blue-100 text-blue-700'
      },
      {
        title: '2. Klienten zuordnen',
        description: 'Jede Betreuung muss für Doku, Nachweis und Rechnung verbunden sein.',
        icon: UserGroupIcon,
        bgClass: 'bg-emerald-100 text-emerald-700'
      },
      {
        title: '3. Abgabe verfolgen',
        description: 'Nachweise früh sehen, bevor die Verwaltung abrechnet.',
        icon: ClockIcon,
        bgClass: 'bg-orange-100 text-orange-700'
      }
    ]

    const quickLinks = [
      {
        title: 'Klienten',
        description: 'Betreuung und Stammdaten prüfen',
        route: 'ChildrenOverview'
      },
      {
        title: 'Dokumentationen',
        description: 'Pädagogische Doku nach Mitarbeiter filtern',
        route: 'Reports'
      },
      {
        title: 'Nachweise',
        description: 'Abgabestatus und Stunden öffnen',
        route: 'Timesheets'
      },
      {
        title: 'Abrechnung',
        description: 'Bereit zur Rechnung prüfen',
        route: 'BillingCenter'
      }
    ]

    function fullName(guardian) {
      return [guardian.name, guardian.familyName].filter(Boolean).join(' ') || 'Ohne Namen'
    }

    function childrenLine(guardian) {
      const assignments = guardian.careAssignments?.items || guardian.children?.items || []
      const children = assignments
        .map((assignment) => assignment.child || assignment)
        .filter(Boolean)
        .map((child) => [child.name, child.familyName].filter(Boolean).join(' '))

      return children.length ? children.join(', ') : 'noch keine Klienten'
    }

    function professionalStatus(guardian) {
      return guardian.professional
        ? { label: 'Fachkraft', class: 'bg-emerald-100 text-emerald-700' }
        : { label: 'Nicht-Fachkraft', class: 'bg-slate-100 text-slate-700' }
    }

    function timesheetStatus(guardian) {
      if (!guardian.timeSheetDate) {
        return {
          label: 'kein Nachweis',
          class: 'bg-red-100 text-red-700',
          level: 'late'
        }
      }

      const currentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime()
      const previousMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).getTime()
      const submitted = new Date(guardian.timeSheetDate).getTime()

      if (submitted >= currentMonth) {
        return {
          label: 'aktuell abgegeben',
          class: 'bg-emerald-100 text-emerald-700',
          level: 'ready'
        }
      }
      if (submitted >= previousMonth) {
        return {
          label: 'letzter Monat',
          class: 'bg-amber-100 text-amber-700',
          level: 'warning'
        }
      }
      return {
        label: 'verspätet',
        class: 'bg-red-100 text-red-700',
        level: 'late'
      }
    }

    function navigate(routeName) {
      router.push({ name: routeName })
    }

    function newGuardian() {
      router.push({
        name: 'NewUser',
        params: { type: 'guardian' }
      })
    }

    function openGuardian(guardian) {
      router.push({
        name: 'UserDetails',
        params: { id: guardian.id }
      })
    }

    function openTimesheets(guardian) {
      router.push({
        name: 'Timesheets',
        query: { guardianID: guardian.id }
      })
    }

    return {
      childrenLine,
      filteredGuardians,
      fullName,
      guardians,
      isLoading,
      metrics,
      navigate,
      newGuardian,
      openGuardian,
      openTimesheets,
      professionalStatus,
      quickLinks,
      searchValue,
      selectedStatus,
      timesheetStatus,
      workflow
    }
  }
}
</script>
