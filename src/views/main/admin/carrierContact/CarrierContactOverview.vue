<template>
  <div class="min-h-full bg-app-bg px-4 py-5 sm:px-6 lg:px-8">
    <div class="flex w-full flex-col gap-5">
      <section class="rounded-xl bg-gradient-to-br from-impuls-blue via-brand-700 to-brand-900 p-5 text-white shadow-soft sm:px-6 sm:py-7">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-sm font-medium text-blue-100">Kostenträger</p>
            <h1 class="mt-1 font-display text-2xl font-black tracking-tight sm:text-3xl">Kontakt-Zentrale</h1>
            <p class="mt-2 max-w-3xl text-sm text-blue-100">
              Ansprechpartner für Kostenträger, Klienten und Rechnungsklärung übersichtlich verbinden.
            </p>
          </div>
          <button
            class="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-impuls-blue hover:bg-blue-50"
            @click="navigate('NewCarrierContact')"
          >
            Neuer Kontakt
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
            <h2 class="text-lg font-semibold text-slate-900">Ansprechpartner</h2>
            <p class="text-sm text-slate-500">Schnell sehen, welcher Kontakt zu welchem Kostenträger und Klient gehört.</p>
          </div>
          <div class="divide-y divide-slate-100">
            <article
              v-for="contact in contacts"
              :key="contact.id"
              class="grid gap-4 px-5 py-4 2xl:grid-cols-[minmax(0,1fr)_160px_150px_120px]"
            >
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <h3 class="font-semibold text-slate-900">{{ contact.name }}</h3>
                  <span :class="['rounded-full px-2.5 py-1 text-xs font-semibold', contact.badgeClass]">
                    {{ contact.status }}
                  </span>
                </div>
                <p class="mt-1 text-sm text-slate-600">{{ contact.email }}</p>
              </div>
              <div>
                <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Kostenträger</p>
                <p class="mt-1 text-sm font-semibold text-slate-800">{{ contact.carrier }}</p>
              </div>
              <div>
                <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Klienten</p>
                <p class="mt-1 text-sm font-semibold text-slate-800">{{ contact.children }}</p>
              </div>
              <div class="flex items-center lg:justify-end">
                <button
                  class="rounded-lg px-3 py-2 text-sm font-semibold text-impuls-blue hover:bg-blue-50"
                  @click="navigate('CarrierOverview')"
                >
                  Kostenträger
                </button>
              </div>
            </article>
          </div>
        </section>

        <aside class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 class="text-lg font-semibold text-slate-900">Wofür wichtig?</h2>
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
  BuildingOfficeIcon,
  EnvelopeIcon,
  LinkIcon,
  UserCircleIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'CarrierContactOverview',
  components: {
    BuildingOfficeIcon,
    EnvelopeIcon,
    LinkIcon,
    UserCircleIcon
  },
  setup() {
    const router = useRouter()

    const metrics = [
      {
        title: 'Kontakte',
        value: 7,
        icon: UserCircleIcon,
        iconClass: 'text-blue-500'
      },
      {
        title: 'Mit Kostenträger',
        value: 7,
        icon: BuildingOfficeIcon,
        iconClass: 'text-emerald-500'
      },
      {
        title: 'Mit Klienten',
        value: 5,
        icon: LinkIcon,
        iconClass: 'text-sky-500'
      },
      {
        title: 'Rückfragen',
        value: 2,
        icon: EnvelopeIcon,
        iconClass: 'text-orange-500'
      }
    ]

    const contacts = [
      {
        id: 'contact-1',
        name: 'Samira Yilmaz',
        email: 'samira.yilmaz@example.test',
        carrier: 'Impuls Demo Kostenträger',
        children: 'Lina Beispiel',
        status: 'aktiv',
        badgeClass: 'bg-emerald-100 text-emerald-700'
      },
      {
        id: 'contact-2',
        name: 'Herr Schneider',
        email: 'jugendamt@example.test',
        carrier: 'Jugendamt Mitte',
        children: 'Max Muster',
        status: 'Rückfrage',
        badgeClass: 'bg-amber-100 text-amber-700'
      },
      {
        id: 'contact-3',
        name: 'Frau Kaya',
        email: 'stadt@example.test',
        carrier: 'Stadt Muster',
        children: 'Noah Yilmaz',
        status: 'aktiv',
        badgeClass: 'bg-blue-100 text-blue-700'
      }
    ]

    const workflow = [
      {
        title: 'Rechnung',
        description: 'Wer erhält Rückfragen zu Betrag, Stunden und Zeitraum?',
        icon: EnvelopeIcon,
        bgClass: 'bg-blue-100 text-blue-700'
      },
      {
        title: 'Klient',
        description: 'Kontakt muss zum Klient und zum Kostenträger sichtbar sein.',
        icon: LinkIcon,
        bgClass: 'bg-emerald-100 text-emerald-700'
      },
      {
        title: 'Kostenträger',
        description: 'Adress- und Kommunikationsdaten hängen an diesem Kontakt.',
        icon: BuildingOfficeIcon,
        bgClass: 'bg-sky-100 text-sky-700'
      }
    ]

    function navigate(routeName) {
      router.push({ name: routeName })
    }

    return {
      contacts,
      metrics,
      navigate,
      workflow
    }
  }
}
</script>
