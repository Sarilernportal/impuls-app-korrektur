<template>
  <div class="min-h-full bg-app-bg px-4 py-5 sm:px-6 lg:px-8">
    <div class="flex w-full flex-col gap-5">
      <section class="rounded-xl bg-gradient-to-br from-impuls-blue via-brand-700 to-brand-900 p-5 text-white shadow-soft sm:px-6 sm:py-7">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-sm font-medium text-blue-100">Dateien</p>
            <h1 class="mt-1 font-display text-2xl font-black tracking-tight sm:text-3xl">Sharebox</h1>
            <p class="mt-2 max-w-3xl text-sm text-blue-100">
              Unterlagen klar nach Verwaltung, Mitarbeitenden und Abrechnung sortieren.
            </p>
          </div>
          <button
            class="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-impuls-blue hover:bg-blue-50"
            @click="navigate('ShareboxUpload')"
          >
            Datei hochladen
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
            <h2 class="text-lg font-semibold text-slate-900">Dateien nach Zweck</h2>
            <p class="text-sm text-slate-500">Nicht nur Ablage, sondern klare Arbeitsordner.</p>
          </div>
          <div class="divide-y divide-slate-100">
            <article
              v-for="file in filteredFiles"
              :key="file.id"
              class="grid gap-4 px-5 py-4 2xl:grid-cols-[minmax(0,1fr)_160px_140px_120px]"
            >
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <h3 class="font-semibold text-slate-900">{{ file.name }}</h3>
                  <span :class="['rounded-full px-2.5 py-1 text-xs font-semibold', file.badgeClass]">
                    {{ file.area }}
                  </span>
                </div>
                <p class="mt-1 text-sm text-slate-600">{{ file.description }}</p>
              </div>
              <div>
                <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Besitzer</p>
                <p class="mt-1 text-sm font-semibold text-slate-800">{{ file.owner }}</p>
              </div>
              <div>
                <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Aktualisiert</p>
                <p class="mt-1 text-sm font-semibold text-slate-800">{{ file.updated }}</p>
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
          <h2 class="text-lg font-semibold text-slate-900">Ordnerlogik</h2>
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
  ArrowUpTrayIcon,
  DocumentIcon,
  FolderIcon,
  ShieldCheckIcon,
  UserGroupIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'ShareboxOverview',
  components: {
    ArrowUpTrayIcon,
    DocumentIcon,
    FolderIcon,
    ShieldCheckIcon,
    UserGroupIcon
  },
  setup() {
    const router = useRouter()
    const activeFilter = ref('all')

    const metrics = [
      {
        title: 'Alle Dateien',
        value: 18,
        filter: 'all',
        icon: FolderIcon,
        iconClass: 'text-blue-500'
      },
      {
        title: 'Für Mitarbeiter',
        value: 8,
        filter: 'team',
        icon: UserGroupIcon,
        iconClass: 'text-emerald-500'
      },
      {
        title: 'Verwaltung',
        value: 6,
        filter: 'admin',
        icon: ShieldCheckIcon,
        iconClass: 'text-sky-500'
      },
      {
        title: 'Neue Uploads',
        value: 4,
        filter: 'new',
        icon: ArrowUpTrayIcon,
        iconClass: 'text-orange-500'
      }
    ]

    const files = [
      {
        id: 'file-1',
        name: 'Leistungsnachweis Vorlage.pdf',
        description: 'Vorlage für Mitarbeitende',
        owner: 'Verwaltung',
        updated: '03.05.2026',
        area: 'team',
        badgeClass: 'bg-emerald-100 text-emerald-700'
      },
      {
        id: 'file-2',
        name: 'Abrechnung Mai.xlsx',
        description: 'Interne Vorbereitung für Rechnungslauf',
        owner: 'GF',
        updated: '04.05.2026',
        area: 'admin',
        badgeClass: 'bg-sky-100 text-sky-700'
      },
      {
        id: 'file-3',
        name: 'Kostenträger-Kontakt Übersicht.pdf',
        description: 'Kontakte und Zuständigkeiten',
        owner: 'Verwaltung',
        updated: 'neu',
        area: 'new',
        badgeClass: 'bg-orange-100 text-orange-700'
      }
    ]

    const filteredFiles = computed(() => {
      if (activeFilter.value === 'all') {
        return files
      }
      return files.filter((file) => file.area === activeFilter.value)
    })

    const workflow = [
      {
        title: 'Verwaltung',
        description: 'Interne Dateien bleiben getrennt von Mitarbeiter-Unterlagen.',
        icon: ShieldCheckIcon,
        bgClass: 'bg-blue-100 text-blue-700'
      },
      {
        title: 'Mitarbeiter',
        description: 'Vorlagen und Infos sind schnell auffindbar.',
        icon: UserGroupIcon,
        bgClass: 'bg-emerald-100 text-emerald-700'
      },
      {
        title: 'Uploads',
        description: 'Neue Dateien bekommen direkt einen Zweck und landen nicht lose in einer Liste.',
        icon: DocumentIcon,
        bgClass: 'bg-orange-100 text-orange-700'
      }
    ]

    function navigate(routeName) {
      router.push({ name: routeName })
    }

    return {
      activeFilter,
      filteredFiles,
      metrics,
      navigate,
      workflow
    }
  }
}
</script>
