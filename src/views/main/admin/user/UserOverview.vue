<template>
  <div class="min-h-full bg-app-bg px-4 py-5 sm:px-6 lg:px-8">
    <div class="flex w-full flex-col gap-5">
      <section class="rounded-xl bg-gradient-to-br from-impuls-blue via-brand-700 to-brand-900 p-5 text-white shadow-soft sm:px-6 sm:py-7">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-sm font-medium text-blue-100">System</p>
            <h1 class="mt-1 font-display text-2xl font-black tracking-tight sm:text-3xl">Administratoren</h1>
            <p class="mt-2 max-w-3xl text-sm text-blue-100">
              Rollen, Zugänge und Zuständigkeiten kompakt prüfen.
            </p>
          </div>
          <button
            class="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-impuls-blue hover:bg-blue-50"
            @click="newAdmin"
          >
            Neuer Admin
          </button>
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

      <!-- Master-Detail: Adminliste links, Detail rechts (DESIGN.md) -->
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
                placeholder="Name, E-Mail oder Bereich suchen"
              />
            </label>
          </div>

          <div v-if="filteredAdmins.length === 0" class="flex flex-col items-center px-5 py-12 text-center">
            <span class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100"><UsersIcon class="h-6 w-6 text-slate-400" aria-hidden="true" /></span>
            <p class="mt-3 text-sm font-semibold text-slate-900">Keine Administratoren gefunden</p>
            <p class="mt-1 text-sm text-slate-500">Passe Suche oder Rollenfilter an.</p>
          </div>

          <div v-else data-testid="user-list" class="max-h-[72vh] overflow-auto">
            <button
              v-for="admin in filteredAdmins"
              :key="admin.id"
              type="button"
              @click="selectAdmin(admin)"
              :class="['flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 text-left transition', selectedAdmin && selectedAdmin.id === admin.id ? 'bg-blue-50' : 'hover:bg-slate-50']"
            >
              <InitialsAvatar :name="admin.name" size-class="h-9 w-9 text-xs" />
              <span class="min-w-0 flex-1">
                <span :class="['block truncate font-display font-bold', selectedAdmin && selectedAdmin.id === admin.id ? 'text-impuls-blue' : 'text-slate-900']">{{ admin.name }}</span>
                <span class="block truncate text-xs text-slate-500">{{ admin.email }} · {{ admin.area }}</span>
              </span>
              <span :class="['shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold', admin.badgeClass]">{{ admin.role }}</span>
            </button>
          </div>
        </div>

        <!-- Detail -->
        <div v-if="selectedAdmin" data-testid="user-detail" class="rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <h2 class="font-display text-xl font-black tracking-tight text-slate-900">{{ selectedAdmin.name }}</h2>
              <p class="mt-0.5 text-sm text-slate-500">{{ selectedAdmin.email }}</p>
            </div>
            <span :class="['shrink-0 rounded-lg px-3 py-1 text-xs font-semibold', selectedAdmin.badgeClass]">{{ selectedAdmin.role }}</span>
          </div>

          <div class="mt-5 grid gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 sm:grid-cols-2">
            <div class="bg-white px-4 py-4">
              <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Bereich</p>
              <p class="mt-1 break-words text-sm font-semibold text-slate-800">{{ selectedAdmin.area }}</p>
            </div>
            <div class="bg-white px-4 py-4">
              <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Status</p>
              <p class="mt-1 text-sm font-semibold text-slate-800">{{ selectedAdmin.status }}</p>
            </div>
          </div>

          <div class="mt-5 flex flex-wrap gap-2">
            <button class="rounded-lg bg-impuls-blue px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700" @click="openAdmin(selectedAdmin)">Profil öffnen</button>
            <button class="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" @click="newAdmin">Neuer Admin</button>
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
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowRightIcon,
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  UsersIcon
} from '@heroicons/vue/24/outline'
import InitialsAvatar from '@/components/UIComponents/InitialsAvatar.vue'

export default {
  name: 'UserOverview',
  components: {
    ArrowRightIcon,
    MagnifyingGlassIcon,
    UsersIcon,
    InitialsAvatar
  },
  setup() {
    const router = useRouter()
    const searchValue = ref('')
    const selectedStatus = ref('all')

    const admins = [
      {
        id: 'admin-1',
        name: 'Demo Admin',
        email: 'demo@impuls.local',
        role: 'Admin',
        area: 'Verwaltung',
        status: 'aktiv',
        badgeClass: 'bg-blue-100 text-blue-700'
      },
      {
        id: 'admin-2',
        name: 'GF Ansicht',
        email: 'gf@impuls.local',
        role: 'GF',
        area: 'Freigabe',
        status: 'aktiv',
        badgeClass: 'bg-emerald-100 text-emerald-700'
      },
      {
        id: 'admin-3',
        name: 'Päd. Leitung',
        email: 'paed@impuls.local',
        role: 'Päd.',
        area: 'Doku-Prüfung',
        status: 'aktiv',
        badgeClass: 'bg-orange-100 text-orange-700'
      }
    ]

    const metrics = computed(() => [
      {
        title: 'Alle',
        value: admins.length,
        filter: 'all',
        icon: UsersIcon,
        iconClass: 'text-blue-500',
        badgeClass: 'bg-blue-100 text-blue-700'
      },
      {
        title: 'Verwaltung',
        value: admins.filter((admin) => admin.role === 'Admin').length,
        filter: 'admin',
        icon: Cog6ToothIcon,
        iconClass: 'text-sky-500',
        badgeClass: 'bg-sky-100 text-sky-700'
      },
      {
        title: 'GF',
        value: admins.filter((admin) => admin.role === 'GF').length,
        filter: 'gf',
        icon: ShieldCheckIcon,
        iconClass: 'text-emerald-500',
        badgeClass: 'bg-emerald-100 text-emerald-700'
      },
      {
        title: 'Päd. Leitung',
        value: admins.filter((admin) => admin.role === 'Päd.').length,
        filter: 'paed',
        icon: UserCircleIcon,
        iconClass: 'text-orange-500',
        badgeClass: 'bg-orange-100 text-orange-700'
      }
    ])

    const filteredAdmins = computed(() => {
      const search = searchValue.value.toLowerCase().trim()
      return admins.filter((admin) => {
        const matchesSearch = !search || [
          admin.name,
          admin.email,
          admin.area,
          admin.role
        ].filter(Boolean).some((value) => value.toLowerCase().includes(search))

        if (!matchesSearch) {
          return false
        }

        if (selectedStatus.value === 'admin') {
          return admin.role === 'Admin'
        }
        if (selectedStatus.value === 'gf') {
          return admin.role === 'GF'
        }
        if (selectedStatus.value === 'paed') {
          return admin.role === 'Päd.'
        }
        return true
      })
    })

    // Master-Detail: ausgewählter Admin (fällt auf den ersten der Liste zurück)
    const selectedAdminId = ref(null)
    const selectedAdmin = computed(() => {
      const list = filteredAdmins.value
      if (list.length === 0) return null
      return list.find((admin) => admin.id === selectedAdminId.value) || list[0]
    })
    function selectAdmin(admin) {
      selectedAdminId.value = admin.id
    }

    const quickLinks = [
      {
        title: 'Mitarbeiter',
        description: 'Betreuung und Zuständigkeit ansehen',
        route: 'GuardianAdminOverview'
      },
      {
        title: 'Klienten',
        description: 'Stammdaten und Zuordnungen prüfen',
        route: 'ChildrenOverview'
      },
      {
        title: 'Kostenträger',
        description: 'Kostenstellen und Kontakte öffnen',
        route: 'CarrierOverview'
      },
      {
        title: 'Kostenträger-Kontakte',
        description: 'Ansprechpartner verwalten',
        route: 'CarrierContactOverview'
      }
    ]

    function navigate(routeName) {
      router.push({ name: routeName })
    }

    function newAdmin() {
      router.push({
        name: 'NewUser',
        params: { type: 'admin' }
      })
    }

    function openAdmin(admin) {
      router.push({
        name: 'UserDetails',
        params: { id: admin.id }
      })
    }

    return {
      admins,
      filteredAdmins,
      metrics,
      navigate,
      newAdmin,
      openAdmin,
      quickLinks,
      searchValue,
      selectedStatus,
      selectedAdmin,
      selectAdmin
    }
  }
}
</script>
