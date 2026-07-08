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

      <!-- Master-Detail: Team links, Detail rechts (DESIGN.md) -->
      <div class="grid gap-4 lg:grid-cols-[minmax(320px,400px)_1fr] lg:items-start">
        <!-- Liste -->
        <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
          <div class="border-b border-slate-200 p-3">
            <label class="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <MagnifyingGlassIcon class="h-5 w-5 text-slate-400" aria-hidden="true" />
              <input
                v-model="searchValue"
                type="search"
                class="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                placeholder="Name, Kontakt oder Klient suchen"
              />
            </label>
          </div>

          <div v-if="isLoading" class="divide-y divide-slate-100">
            <div v-for="n in 4" :key="n" class="flex items-center gap-3 px-4 py-3.5">
              <div class="h-9 w-9 flex-shrink-0 animate-pulse rounded-lg bg-slate-200"></div>
              <div class="flex-1 space-y-2"><div class="h-3.5 w-1/2 animate-pulse rounded bg-slate-200"></div><div class="h-3 w-2/3 animate-pulse rounded bg-slate-100"></div></div>
            </div>
          </div>
          <div v-else-if="filteredGuardians.length === 0" class="flex flex-col items-center px-5 py-12 text-center">
            <span class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100"><UserGroupIcon class="h-6 w-6 text-slate-400" aria-hidden="true" /></span>
            <p class="mt-3 text-sm font-semibold text-slate-900">Keine Mitarbeiter gefunden</p>
            <p class="mt-1 text-sm text-slate-500">Passe Suche oder Statusfilter an.</p>
          </div>

          <div v-else data-testid="guardians-list" class="max-h-[72vh] overflow-auto">
            <button
              v-for="guardian in filteredGuardians"
              :key="guardian.id"
              type="button"
              @click="selectGuardian(guardian)"
              :class="['flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 text-left transition', selectedGuardian && selectedGuardian.id === guardian.id ? 'bg-blue-50' : 'hover:bg-slate-50']"
            >
              <InitialsAvatar :name="fullName(guardian)" size-class="h-9 w-9 text-xs" />
              <span class="min-w-0 flex-1">
                <span :class="['block truncate font-display font-bold', selectedGuardian && selectedGuardian.id === guardian.id ? 'text-impuls-blue' : 'text-slate-900']">{{ fullName(guardian) }}</span>
                <span class="block truncate text-xs text-slate-500">{{ guardian.email || 'E-Mail fehlt' }}</span>
              </span>
              <span :class="['shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold', professionalStatus(guardian).class]">{{ professionalStatus(guardian).label }}</span>
            </button>
          </div>
        </div>

        <!-- Detail -->
        <div v-if="selectedGuardian" data-testid="guardian-detail" class="rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <h2 class="font-display text-xl font-black tracking-tight text-slate-900">{{ fullName(selectedGuardian) }}</h2>
              <p class="mt-0.5 text-sm text-slate-500">{{ selectedGuardian.email || 'E-Mail fehlt' }}{{ selectedGuardian.phone ? ' · ' + selectedGuardian.phone : '' }}</p>
            </div>
            <span :class="['shrink-0 rounded-lg px-3 py-1 text-xs font-semibold', professionalStatus(selectedGuardian).class]">{{ professionalStatus(selectedGuardian).label }}</span>
          </div>

          <div class="mt-5 grid gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 sm:grid-cols-2">
            <div class="bg-white px-4 py-4">
              <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Klienten</p>
              <p class="mt-1 break-words text-sm font-semibold text-slate-800">{{ childrenLine(selectedGuardian) }}</p>
            </div>
            <div class="bg-white px-4 py-4">
              <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Abgabe Nachweis</p>
              <span :class="['mt-1 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold', timesheetStatus(selectedGuardian).class]">{{ timesheetStatus(selectedGuardian).label }}</span>
            </div>
          </div>

          <div class="mt-5 flex flex-wrap gap-2">
            <button class="rounded-lg bg-impuls-blue px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700" @click="openGuardian(selectedGuardian)">Profil öffnen</button>
            <button class="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" @click="openTimesheets(selectedGuardian)">Nachweise</button>
          </div>

          <div class="mt-6 border-t border-slate-100 pt-4">
            <p class="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Schnellzugriff</p>
            <div class="grid gap-2 sm:grid-cols-2">
              <button
                v-for="link in quickLinks"
                :key="link.title"
                class="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5 text-left hover:border-blue-200 hover:bg-blue-50"
                @click="navigate(link.route)"
              >
                <span class="block truncate text-sm font-semibold text-slate-900">{{ link.title }}</span>
                <ArrowRightIcon class="h-4 w-4 flex-shrink-0 text-slate-400" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
        <div v-else class="hidden rounded-2xl border border-dashed border-slate-200 lg:block"></div>
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

    // Master-Detail: ausgewählter Mitarbeiter (fällt auf den ersten zurück)
    const selectedGuardianId = ref(null)
    const selectedGuardian = computed(() => {
      const list = filteredGuardians.value
      if (list.length === 0) return null
      return list.find((guardian) => guardian.id === selectedGuardianId.value) || list[0]
    })
    function selectGuardian(guardian) {
      selectedGuardianId.value = guardian.id
    }

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
      selectedGuardian,
      selectGuardian,
      timesheetStatus
    }
  }
}
</script>
