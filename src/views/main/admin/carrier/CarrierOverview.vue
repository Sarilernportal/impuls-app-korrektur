<template>
  <div class="min-h-full bg-slate-50 px-4 py-5 sm:px-6 lg:px-8">
    <div class="flex w-full flex-col gap-5">
      <section class="rounded-xl bg-gradient-to-br from-impuls-blue via-brand-700 to-brand-900 p-5 text-white shadow-soft sm:px-6 sm:py-7">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-sm font-medium text-blue-100">Verwaltung</p>
            <h1 class="mt-1 text-2xl font-bold sm:text-3xl">Träger-Zentrale</h1>
            <p class="mt-2 max-w-3xl text-sm text-blue-100">
              Träger, Kontakte, Klienten und Abrechnungswege sauber bündeln, damit Rechnungen später nicht hängen bleiben.
            </p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              class="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-impuls-blue hover:bg-blue-50"
              @click="navigate('NewCarrier')"
            >
              Neuer Träger
            </button>
            <button
              class="rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/25"
              @click="navigate('Invoices')"
            >
              Rechnungen öffnen
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
            <span :class="['flex h-10 w-10 items-center justify-center rounded-xl', metric.badgeClass]">
              <component :is="metric.icon" class="h-5 w-5" aria-hidden="true" />
            </span>
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
            <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 class="text-lg font-semibold text-slate-900">Träger prüfen</h2>
                <p class="text-sm text-slate-500">Kontakte, Adressen und Klienten für Rechnung und Kommunikation.</p>
              </div>
              <label class="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <MagnifyingGlassIcon class="h-5 w-5 text-slate-400" aria-hidden="true" />
                <input
                  v-model="searchValue"
                  type="search"
                  class="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  placeholder="Träger, Stadt oder Kontakt suchen"
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
              <div class="h-10 w-10 flex-shrink-0 animate-pulse rounded-xl bg-slate-200"></div>
              <div class="flex-1 space-y-2">
                <div class="h-3.5 w-1/3 animate-pulse rounded bg-slate-200"></div>
                <div class="h-3 w-1/2 animate-pulse rounded bg-slate-100"></div>
              </div>
            </div>
          </div>

          <div v-else-if="filteredCarriers.length === 0" class="flex flex-col items-center px-5 py-12 text-center">
            <span class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <BuildingOfficeIcon class="h-6 w-6 text-slate-400" aria-hidden="true" />
            </span>
            <p class="mt-3 text-sm font-semibold text-slate-900">Keine Träger gefunden</p>
            <p class="mt-1 text-sm text-slate-500">Passe Suche oder Statusfilter an.</p>
          </div>

          <div v-else class="divide-y divide-slate-100">
            <article
              v-for="carrier in filteredCarriers"
              :key="carrier.id"
              class="grid gap-4 px-5 py-4 2xl:grid-cols-[minmax(0,1fr)_minmax(190px,0.75fr)_minmax(180px,0.7fr)_160px]"
            >
              <div class="flex items-start gap-3">
                <InitialsAvatar :name="carrier.shortName || carrier.name || 'Träger'" size-class="h-10 w-10 text-sm" />
                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-2">
                    <h3 class="font-semibold text-slate-900">{{ carrier.name || 'Ohne Namen' }}</h3>
                    <span :class="['inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold', carrierStatus(carrier).class]">
                      <span class="mr-1.5 h-1.5 w-1.5 rounded-full bg-current opacity-70"></span>
                      {{ carrierStatus(carrier).label }}
                    </span>
                  </div>
                  <p class="mt-1 truncate text-sm text-slate-600">{{ addressLine(carrier) }}</p>
                </div>
              </div>
              <div>
                <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Kontakte</p>
                <p class="mt-1 text-sm font-semibold text-slate-800">{{ contactLine(carrier) }}</p>
              </div>
              <div>
                <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Klienten</p>
                <p class="mt-1 text-sm font-semibold text-slate-800">{{ childCount(carrier) }} zugeordnet</p>
              </div>
              <div class="flex items-center justify-between gap-2 lg:justify-end">
                <button
                  class="rounded-lg px-3 py-2 text-sm font-semibold text-impuls-blue hover:bg-blue-50"
                  @click="openChildren(carrier)"
                >
                  Klienten
                </button>
                <button
                  class="rounded-lg bg-impuls-blue px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  @click="openCarrier(carrier)"
                >
                  Öffnen
                </button>
              </div>
            </article>
          </div>
        </section>

        <aside class="grid gap-5">
          <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 class="text-lg font-semibold text-slate-900">Trägerprüfung</h2>
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
  BanknotesIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  LinkIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'
import InitialsAvatar from '@/components/UIComponents/InitialsAvatar.vue'

export default {
  name: 'CarrierOverview',
  components: {
    ArrowRightIcon,
    BanknotesIcon,
    BuildingOfficeIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    LinkIcon,
    MagnifyingGlassIcon,
    InitialsAvatar
  },
  setup() {
    const router = useRouter()
    const store = useStore()
    const carriers = ref([])
    const isLoading = ref(false)
    const searchValue = ref('')
    const selectedStatus = ref('all')

    onMounted(fetchCarriers)

    async function fetchCarriers() {
      isLoading.value = true
      try {
        const response = await store.dispatch('fetchCarriersOverviewList', {
          nextToken: null,
          filter: ''
        })
        carriers.value = response.items || []
      } catch (error) {
        console.log(error)
        carriers.value = []
      } finally {
        isLoading.value = false
      }
    }

    const metrics = computed(() => {
      const missingContact = carriers.value.filter((carrier) => contactCount(carrier) === 0)
      const missingAddress = carriers.value.filter((carrier) => !carrier.street || !carrier.postalCode || !carrier.city)
      const withChildren = carriers.value.filter((carrier) => childCount(carrier) > 0)

      return [
        {
          title: 'Aktive Träger',
          value: carriers.value.length,
          badge: 'alle',
          filter: 'all',
          icon: BuildingOfficeIcon,
          iconClass: 'text-blue-500',
          badgeClass: 'bg-blue-100 text-blue-700'
        },
        {
          title: 'Mit Klienten',
          value: withChildren.length,
          badge: 'verbunden',
          filter: 'withChildren',
          icon: LinkIcon,
          iconClass: 'text-emerald-500',
          badgeClass: 'bg-emerald-100 text-emerald-700'
        },
        {
          title: 'Kontakt fehlt',
          value: missingContact.length,
          badge: 'offen',
          filter: 'missingContact',
          icon: ExclamationTriangleIcon,
          iconClass: 'text-amber-500',
          badgeClass: 'bg-amber-100 text-amber-700'
        },
        {
          title: 'Adresse offen',
          value: missingAddress.length,
          badge: 'prüfen',
          filter: 'missingAddress',
          icon: CheckCircleIcon,
          iconClass: 'text-orange-500',
          badgeClass: 'bg-orange-100 text-orange-700'
        },
        {
          title: 'Rechnungspartner',
          value: carriers.value.length,
          badge: 'bereit',
          filter: 'billing',
          icon: BanknotesIcon,
          iconClass: 'text-sky-500',
          badgeClass: 'bg-sky-100 text-sky-700'
        }
      ]
    })

    const filteredCarriers = computed(() => {
      const search = searchValue.value.toLowerCase().trim()
      return carriers.value.filter((carrier) => {
        const matchesSearch = !search || [
          carrier.name,
          carrier.shortName,
          carrier.city,
          contactLine(carrier),
          addressLine(carrier)
        ].filter(Boolean).some((value) => value.toLowerCase().includes(search))

        if (!matchesSearch) {
          return false
        }

        if (selectedStatus.value === 'withChildren') {
          return childCount(carrier) > 0
        }
        if (selectedStatus.value === 'missingContact') {
          return contactCount(carrier) === 0
        }
        if (selectedStatus.value === 'missingAddress') {
          return !carrier.street || !carrier.postalCode || !carrier.city
        }
        if (selectedStatus.value === 'billing') {
          return true
        }
        return true
      })
    })

    const workflow = [
      {
        title: '1. Kontakt vorhanden',
        description: 'Eine zuständige Person muss für Rückfragen erreichbar sein.',
        icon: BuildingOfficeIcon,
        bgClass: 'bg-blue-100 text-blue-700'
      },
      {
        title: '2. Klienten verbunden',
        description: 'Zuordnungen steuern Filter, Doku-Prüfung und Rechnungslisten.',
        icon: LinkIcon,
        bgClass: 'bg-emerald-100 text-emerald-700'
      },
      {
        title: '3. Rechnung vorbereiten',
        description: 'Adresse und Abrechnungsweg vor dem Export sauber halten.',
        icon: BanknotesIcon,
        bgClass: 'bg-sky-100 text-sky-700'
      }
    ]

    const quickLinks = [
      {
        title: 'Klienten',
        description: 'Klienten nach Träger prüfen',
        route: 'ChildrenOverview'
      },
      {
        title: 'Trägerkontakte',
        description: 'Ansprechpartner verwalten',
        route: 'CarrierContactOverview'
      },
      {
        title: 'Rechnungen',
        description: 'Erstellte Rechnungen filtern',
        route: 'Invoices'
      },
      {
        title: 'Abrechnung',
        description: 'Doku und Nachweise zusammenführen',
        route: 'BillingCenter'
      }
    ]

    function addressLine(carrier) {
      const street = [carrier.street, carrier.houseNumber].filter(Boolean).join(' ')
      const city = [carrier.postalCode, carrier.city].filter(Boolean).join(' ')
      return [street, city].filter(Boolean).join(', ') || 'Adresse fehlt'
    }

    function contactCount(carrier) {
      return carrier.carrierContacts?.items?.length || 0
    }

    function childCount(carrier) {
      return carrier.children?.items?.length || 0
    }

    function contactLine(carrier) {
      const contacts = carrier.carrierContacts?.items || []
      if (!contacts.length) {
        return 'kein Kontakt'
      }
      return contacts
        .map((contact) => [contact.name, contact.familyName].filter(Boolean).join(' '))
        .join(', ')
    }

    function carrierStatus(carrier) {
      if (!contactCount(carrier)) {
        return {
          label: 'Kontakt fehlt',
          class: 'bg-amber-100 text-amber-700'
        }
      }
      if (!carrier.street || !carrier.postalCode || !carrier.city) {
        return {
          label: 'Adresse prüfen',
          class: 'bg-orange-100 text-orange-700'
        }
      }
      return {
        label: 'abrechenbar',
        class: 'bg-emerald-100 text-emerald-700'
      }
    }

    function navigate(routeName) {
      router.push({ name: routeName })
    }

    function openCarrier(carrier) {
      router.push({
        name: 'CarrierDetails',
        params: { id: carrier.id }
      })
    }

    function openChildren(carrier) {
      router.push({
        name: 'ChildrenOverview',
        query: { carrierID: carrier.id }
      })
    }

    return {
      addressLine,
      carrierStatus,
      carriers,
      childCount,
      contactLine,
      filteredCarriers,
      isLoading,
      metrics,
      navigate,
      openCarrier,
      openChildren,
      quickLinks,
      searchValue,
      selectedStatus,
      workflow
    }
  }
}
</script>
