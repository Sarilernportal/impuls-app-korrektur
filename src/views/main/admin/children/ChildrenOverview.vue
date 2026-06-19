<template>
  <div class="min-h-full bg-slate-50 px-4 py-5 sm:px-6 lg:px-8">
    <div class="flex w-full flex-col gap-5">
      <section class="rounded-xl bg-gradient-to-br from-impuls-blue via-brand-700 to-brand-900 p-5 text-white shadow-soft sm:px-6 sm:py-7">
        <div class="flex flex-col gap-4 2xl:flex-row 2xl:items-end 2xl:justify-between">
          <div>
            <p class="text-sm font-medium text-blue-100">Verwaltung</p>
            <h1 class="mt-1 text-2xl font-bold sm:text-3xl">Klienten-Zentrale</h1>
            <p class="mt-2 max-w-3xl text-sm text-blue-100">
              Stammdaten, Zuordnungen, Doku-Status und abrechnungsrelevante Hinweise an einem Ort.
            </p>
          </div>
          <div class="flex flex-wrap gap-2 sm:flex-nowrap">
            <button
              class="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-impuls-blue hover:bg-blue-50"
              @click="navigate('NewChild')"
            >
              Neuer Klient
            </button>
            <button
              class="rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/25"
              @click="navigate('BillingCenter')"
            >
              Abrechnung öffnen
            </button>
          </div>
        </div>
      </section>

      <section class="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <button
          v-for="metric in metrics"
          :key="metric.title"
          :class="[
            'group rounded-xl border bg-white p-4 text-left shadow-card transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-card-hover',
            selectedStatus === metric.filter ? 'border-blue-300 ring-2 ring-blue-100' : 'border-slate-200'
          ]"
          @click="selectedStatus = metric.filter"
        >
          <div class="flex items-center justify-between">
            <span :class="['flex h-10 w-10 items-center justify-center rounded-xl', metric.badgeClass]"><component :is="metric.icon" class="h-5 w-5" aria-hidden="true" /></span>
            <span :class="['rounded-full px-2 py-0.5 text-xs font-semibold', metric.badgeClass]">
              {{ metric.badge }}
            </span>
          </div>
          <p class="mt-4 text-3xl font-bold tracking-tight text-slate-900 tabular-nums">{{ metric.value }}</p>
          <p class="mt-1 text-sm font-medium text-slate-600">{{ metric.title }}</p>
        </button>
      </section>

      <div class="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.55fr)]">
        <section class="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div class="border-b border-slate-200 px-5 py-4">
            <div class="flex flex-col gap-3 2xl:flex-row 2xl:items-center 2xl:justify-between">
              <div>
                <h2 class="text-lg font-semibold text-slate-900">Klienten prüfen</h2>
                <p class="text-sm text-slate-500">Für Verwaltung, GF und Päd. Leitung auf dieselbe Sicht reduziert.</p>
              </div>
              <label class="flex w-full min-w-0 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 2xl:max-w-md">
                <MagnifyingGlassIcon class="h-5 w-5 text-slate-400" aria-hidden="true" />
                <input
                  v-model="searchValue"
                  type="search"
                  class="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  placeholder="Klient, Träger oder Betreuer suchen"
                />
              </label>
            </div>
          </div>

          <div v-if="isLoading" class="px-5 py-10 text-center text-sm font-semibold text-slate-500">
            Klienten werden geladen...
          </div>

          <div v-else-if="filteredChildren.length === 0" class="px-5 py-10 text-center">
            <p class="text-sm font-semibold text-slate-900">Keine Klienten gefunden</p>
            <p class="mt-1 text-sm text-slate-500">Passe Suche oder Statusfilter an.</p>
          </div>

          <div v-else class="divide-y divide-slate-100">
            <article
              v-for="child in filteredChildren"
              :key="child.id"
              class="grid gap-4 px-4 py-4 sm:px-5 md:grid-cols-2 2xl:grid-cols-[minmax(220px,1.15fr)_minmax(170px,0.75fr)_minmax(190px,0.8fr)_minmax(150px,auto)] 2xl:items-center"
            >
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <h3 class="min-w-0 break-words font-semibold leading-snug text-slate-900">{{ fullName(child) }}</h3>
                  <span :class="['shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold', childStatus(child).class]">
                    {{ childStatus(child).label }}
                  </span>
                </div>
                <p class="mt-1 break-words text-sm text-slate-600">
                  {{ child.recordNumber || 'ohne Aktenzeichen' }} · {{ child.weeklyHours || 0 }} Std./Woche
                </p>
              </div>
              <div class="min-w-0">
                <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Betreuung</p>
                <p class="mt-1 break-words text-sm font-semibold text-slate-800">{{ guardianNames(child) }}</p>
              </div>
              <div class="min-w-0">
                <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Trägerkontakt</p>
                <p class="mt-1 break-words text-sm font-semibold text-slate-800">{{ carrierLine(child) }}</p>
              </div>
              <div class="flex items-center justify-start gap-2 md:justify-end 2xl:justify-end">
                <button
                  class="rounded-lg px-3 py-2 text-sm font-semibold text-impuls-blue hover:bg-blue-50"
                  @click="openDocuments(child)"
                >
                  Doku
                </button>
                <button
                  class="rounded-lg bg-impuls-blue px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  @click="openChild(child)"
                >
                  Öffnen
                </button>
              </div>
            </article>
          </div>
        </section>

        <aside class="grid gap-5">
          <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 class="text-lg font-semibold text-slate-900">Prüfablauf</h2>
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
  DocumentCheckIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  UserIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'ChildrenOverview',
  components: {
    ArrowRightIcon,
    CheckCircleIcon,
    ClockIcon,
    DocumentCheckIcon,
    DocumentTextIcon,
    ExclamationTriangleIcon,
    MagnifyingGlassIcon,
    UserIcon
  },
  setup() {
    const router = useRouter()
    const store = useStore()
    const children = ref([])
    const isLoading = ref(false)
    const searchValue = ref('')
    const selectedStatus = ref('all')

    onMounted(fetchChildren)

    async function fetchChildren() {
      isLoading.value = true
      try {
        const response = await store.dispatch('fetchChildren', {
          nextToken: null,
          filter: '',
          showArchived: false
        })
        children.value = response.items || []
      } catch (error) {
        console.log(error)
        children.value = []
      } finally {
        isLoading.value = false
      }
    }

    const metrics = computed(() => {
      const active = children.value.filter((child) => child.archiveStatus !== 'archived')
      const incomplete = active.filter((child) => child.dataComplete === false)
      const withoutGuardian = active.filter((child) => !child.careAssignments?.items?.length)

      return [
        {
          title: 'Aktive Klienten',
          value: active.length,
          badge: 'alle',
          filter: 'all',
          icon: UserIcon,
          iconClass: 'text-blue-500',
          badgeClass: 'bg-blue-100 text-blue-700'
        },
        {
          title: 'Daten vollständig',
          value: active.length - incomplete.length,
          badge: 'bereit',
          filter: 'complete',
          icon: CheckCircleIcon,
          iconClass: 'text-emerald-500',
          badgeClass: 'bg-emerald-100 text-emerald-700'
        },
        {
          title: 'Stammdaten offen',
          value: incomplete.length,
          badge: 'prüfen',
          filter: 'incomplete',
          icon: ExclamationTriangleIcon,
          iconClass: 'text-amber-500',
          badgeClass: 'bg-amber-100 text-amber-700'
        },
        {
          title: 'Ohne Betreuung',
          value: withoutGuardian.length,
          badge: 'zuordnen',
          filter: 'withoutGuardian',
          icon: ClockIcon,
          iconClass: 'text-orange-500',
          badgeClass: 'bg-orange-100 text-orange-700'
        },
        {
          title: 'Für Abrechnung',
          value: active.length,
          badge: 'Mai',
          filter: 'billing',
          icon: DocumentCheckIcon,
          iconClass: 'text-sky-500',
          badgeClass: 'bg-sky-100 text-sky-700'
        }
      ]
    })

    const filteredChildren = computed(() => {
      const search = searchValue.value.toLowerCase().trim()
      return children.value.filter((child) => {
        const matchesSearch = !search || [
          fullName(child),
          guardianNames(child),
          carrierLine(child),
          child.recordNumber
        ].filter(Boolean).some((value) => value.toLowerCase().includes(search))

        if (!matchesSearch) {
          return false
        }

        if (selectedStatus.value === 'complete') {
          return child.dataComplete !== false
        }
        if (selectedStatus.value === 'incomplete') {
          return child.dataComplete === false
        }
        if (selectedStatus.value === 'withoutGuardian') {
          return !child.careAssignments?.items?.length
        }
        if (selectedStatus.value === 'billing') {
          return child.archiveStatus !== 'archived'
        }
        return child.archiveStatus !== 'archived'
      })
    })

    const workflow = [
      {
        title: '1. Stammdaten prüfen',
        description: 'Adresse, Trägerkontakt, Aktenzeichen und Wochenstunden komplett halten.',
        icon: UserIcon,
        bgClass: 'bg-blue-100 text-blue-700'
      },
      {
        title: '2. Betreuung zuordnen',
        description: 'Mitarbeitende mit Klienten verbinden, damit Doku und Nachweis sauber laufen.',
        icon: CheckCircleIcon,
        bgClass: 'bg-emerald-100 text-emerald-700'
      },
      {
        title: '3. Doku und Nachweis prüfen',
        description: 'Fehlende Unterlagen vor der Rechnung sichtbar machen.',
        icon: DocumentTextIcon,
        bgClass: 'bg-orange-100 text-orange-700'
      }
    ]

    const quickLinks = [
      {
        title: 'Dokumentationen',
        description: 'Dokus nach Klient oder Zeitraum prüfen',
        route: 'Reports'
      },
      {
        title: 'Nachweise',
        description: 'Stunden und Abgaben für Rechnung prüfen',
        route: 'Timesheets'
      },
      {
        title: 'Mitarbeiter',
        description: 'Betreuung und Zuständigkeit ansehen',
        route: 'GuardianAdminOverview'
      },
      {
        title: 'Träger',
        description: 'Kostenstellen und Kontakte öffnen',
        route: 'CarrierOverview'
      }
    ]

    function fullName(child) {
      return [child.name, child.familyName].filter(Boolean).join(' ') || 'Ohne Namen'
    }

    function guardianNames(child) {
      const assignments = child.careAssignments?.items || []
      const names = assignments
        .map((assignment) => assignment.guardian)
        .filter(Boolean)
        .map((guardian) => [guardian.name, guardian.familyName].filter(Boolean).join(' '))

      return names.length ? names.join(', ') : 'noch nicht zugeordnet'
    }

    function carrierLine(child) {
      const contact = child.carrierContact
      const carrier = child.carrier
      if (contact) {
        return `${[contact.name, contact.familyName].filter(Boolean).join(' ')} · ${carrier?.shortName || carrier?.name || 'Träger'}`
      }
      return carrier?.name || 'kein Trägerkontakt'
    }

    function childStatus(child) {
      if (child.dataComplete === false) {
        return {
          label: 'Stammdaten offen',
          class: 'bg-amber-100 text-amber-700'
        }
      }
      if (!child.careAssignments?.items?.length) {
        return {
          label: 'Betreuung fehlt',
          class: 'bg-orange-100 text-orange-700'
        }
      }
      return {
        label: 'abrechenbar prüfen',
        class: 'bg-emerald-100 text-emerald-700'
      }
    }

    function navigate(routeName) {
      router.push({ name: routeName })
    }

    function openChild(child) {
      router.push({
        name: 'ChildDetails',
        params: { id: child.id }
      })
    }

    function openDocuments(child) {
      router.push({
        name: 'Reports',
        query: { clientID: child.id }
      })
    }

    return {
      children,
      filteredChildren,
      fullName,
      guardianNames,
      carrierLine,
      childStatus,
      isLoading,
      metrics,
      navigate,
      openChild,
      openDocuments,
      quickLinks,
      searchValue,
      selectedStatus,
      workflow
    }
  }
}
</script>
