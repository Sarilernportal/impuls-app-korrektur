<template>
  <div class="min-h-full bg-app-bg px-4 py-5 sm:px-6 lg:px-8">
    <div class="flex w-full flex-col gap-5">
      <section class="rounded-xl bg-gradient-to-br from-impuls-blue via-brand-700 to-brand-900 p-5 text-white shadow-soft sm:px-6 sm:py-7">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-sm font-medium text-blue-100">System</p>
            <h1 class="mt-1 font-display text-2xl font-black tracking-tight sm:text-3xl">Administratoren-Zentrale</h1>
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
            <h2 class="text-lg font-semibold text-slate-900">Zugänge</h2>
            <p class="text-sm text-slate-500">Wer darf was sehen und wer ist fachlich zuständig?</p>
          </div>
          <div class="divide-y divide-slate-100">
            <article
              v-for="admin in admins"
              :key="admin.id"
              class="grid gap-4 px-5 py-4 2xl:grid-cols-[minmax(0,1fr)_150px_150px_120px]"
            >
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <h3 class="font-semibold text-slate-900">{{ admin.name }}</h3>
                  <span :class="['rounded-full px-2.5 py-1 text-xs font-semibold', admin.badgeClass]">
                    {{ admin.role }}
                  </span>
                </div>
                <p class="mt-1 text-sm text-slate-600">{{ admin.email }}</p>
              </div>
              <div>
                <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Bereich</p>
                <p class="mt-1 text-sm font-semibold text-slate-800">{{ admin.area }}</p>
              </div>
              <div>
                <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Status</p>
                <p class="mt-1 text-sm font-semibold text-slate-800">{{ admin.status }}</p>
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
          <h2 class="text-lg font-semibold text-slate-900">Rollenmodell</h2>
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
import { useRouter } from 'vue-router'
import {
  Cog6ToothIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  UsersIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'UserOverview',
  components: {
    Cog6ToothIcon,
    ShieldCheckIcon,
    UserCircleIcon,
    UsersIcon
  },
  setup() {
    const router = useRouter()

    const metrics = [
      {
        title: 'Admins',
        value: 3,
        icon: UsersIcon,
        iconClass: 'text-blue-500'
      },
      {
        title: 'GF',
        value: 1,
        icon: ShieldCheckIcon,
        iconClass: 'text-emerald-500'
      },
      {
        title: 'Päd. Leitung',
        value: 1,
        icon: UserCircleIcon,
        iconClass: 'text-orange-500'
      },
      {
        title: 'Systemrollen',
        value: 4,
        icon: Cog6ToothIcon,
        iconClass: 'text-sky-500'
      }
    ]

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

    const workflow = [
      {
        title: 'Verwaltung',
        description: 'Bearbeitet Stammdaten, Nachweise und Rechnungen.',
        icon: Cog6ToothIcon,
        bgClass: 'bg-blue-100 text-blue-700'
      },
      {
        title: 'GF',
        description: 'Sieht Summen, offene Freigaben und Rechnungsläufe.',
        icon: ShieldCheckIcon,
        bgClass: 'bg-emerald-100 text-emerald-700'
      },
      {
        title: 'Päd. Leitung',
        description: 'Prüft Dokus und fachliche Rückfragen.',
        icon: UserCircleIcon,
        bgClass: 'bg-orange-100 text-orange-700'
      }
    ]

    function newAdmin() {
      router.push({
        name: 'NewUser',
        params: { type: 'admin' }
      })
    }

    return {
      admins,
      metrics,
      newAdmin,
      workflow
    }
  }
}
</script>
