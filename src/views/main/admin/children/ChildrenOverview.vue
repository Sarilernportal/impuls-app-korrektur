<template>
  <div class="min-h-full bg-app-bg px-4 py-5 sm:px-6 lg:px-8">
    <div class="flex w-full flex-col gap-5">
      <section class="rounded-xl bg-gradient-to-br from-impuls-blue via-brand-700 to-brand-900 p-5 text-white shadow-soft sm:px-6 sm:py-7">
        <div class="flex flex-col gap-4 2xl:flex-row 2xl:items-end 2xl:justify-between">
          <div>
            <p class="text-sm font-medium text-blue-100">Verwaltung</p>
            <h1 class="mt-1 font-display text-2xl font-black tracking-tight sm:text-3xl">Klienten</h1>
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

      <!-- Master-Detail: Klientenliste links, Detail rechts (DESIGN.md) -->
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
                placeholder="Klient, Kostenträger oder Betreuer suchen"
              />
            </label>
          </div>

          <div v-if="isLoading" class="px-5 py-10 text-center text-sm font-semibold text-slate-500">
            Klienten werden geladen...
          </div>
          <div v-else-if="filteredChildren.length === 0" class="px-5 py-10 text-center">
            <p class="text-sm font-semibold text-slate-900">Keine Klienten gefunden</p>
            <p class="mt-1 text-sm text-slate-500">Passe Suche oder Statusfilter an.</p>
          </div>

          <div v-else data-testid="children-list" class="max-h-[72vh] overflow-auto">
            <button
              v-for="child in filteredChildren"
              :key="child.id"
              type="button"
              @click="selectChild(child)"
              :class="['flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 text-left transition', selectedChild && selectedChild.id === child.id ? 'bg-blue-50' : 'hover:bg-slate-50']"
            >
              <InitialsAvatar :name="fullName(child)" size-class="h-9 w-9 text-xs" />
              <span class="min-w-0 flex-1">
                <span :class="['block truncate font-display font-bold', selectedChild && selectedChild.id === child.id ? 'text-impuls-blue' : 'text-slate-900']">{{ fullName(child) }}</span>
                <span class="block truncate text-xs text-slate-500">{{ child.recordNumber || 'ohne Aktenzeichen' }} · {{ child.weeklyHours || 0 }} Std./Woche</span>
              </span>
              <span :class="['shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold', childStatus(child).class]">{{ childStatus(child).label }}</span>
            </button>
          </div>
        </div>

        <!-- Detail -->
        <div v-if="selectedChild" data-testid="child-detail" class="rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <h2 class="font-display text-xl font-black tracking-tight text-slate-900">{{ fullName(selectedChild) }}</h2>
              <p class="mt-0.5 text-sm text-slate-500">{{ selectedChild.recordNumber || 'ohne Aktenzeichen' }} · {{ selectedChild.weeklyHours || 0 }} Std./Woche</p>
            </div>
            <span :class="['shrink-0 rounded-lg px-3 py-1 text-xs font-semibold', childStatus(selectedChild).class]">{{ childStatus(selectedChild).label }}</span>
          </div>

          <div class="mt-5 grid gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 sm:grid-cols-2">
            <div class="bg-white px-4 py-4">
              <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Betreuung</p>
              <p class="mt-1 break-words text-sm font-semibold text-slate-800">{{ guardianNames(selectedChild) }}</p>
            </div>
            <div class="bg-white px-4 py-4">
              <p class="text-xs font-medium uppercase tracking-wide text-slate-400">ASD-Fachkraft</p>
              <p class="mt-1 break-words text-sm font-semibold text-slate-800">{{ carrierLine(selectedChild) }}</p>
            </div>
          </div>

          <div class="mt-5 flex flex-wrap gap-2">
            <button class="rounded-lg bg-impuls-blue px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700" @click="openChild(selectedChild)">Fallakte öffnen</button>
            <button class="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" @click="openDocuments(selectedChild)">Dokumente</button>
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
  DocumentCheckIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  UserIcon
} from '@heroicons/vue/24/outline'
import InitialsAvatar from '@/components/UIComponents/InitialsAvatar.vue'

export default {
  name: 'ChildrenOverview',
  components: {
    ArrowRightIcon,
    MagnifyingGlassIcon,
    InitialsAvatar
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

    // Master-Detail: ausgewählter Klient (fällt auf den ersten der Liste zurück)
    const selectedChildId = ref(null)
    const selectedChild = computed(() => {
      const list = filteredChildren.value
      if (list.length === 0) return null
      return list.find((child) => child.id === selectedChildId.value) || list[0]
    })
    function selectChild(child) {
      selectedChildId.value = child.id
    }

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
        title: 'Kostenträger',
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
        return `${[contact.name, contact.familyName].filter(Boolean).join(' ')} · ${carrier?.shortName || carrier?.name || 'Kostenträger'}`
      }
      return carrier?.name || 'keine ASD-Fachkraft'
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
        name: 'ChildDocumentsOverview',
        params: { id: child.id }
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
      selectedChild,
      selectChild
    }
  }
}
</script>
