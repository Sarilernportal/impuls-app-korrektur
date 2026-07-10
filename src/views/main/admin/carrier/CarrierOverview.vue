<template>
  <div class="min-h-full bg-app-bg px-4 py-5 sm:px-6 lg:px-8">
    <div class="flex w-full flex-col gap-5">
      <section class="rounded-xl bg-gradient-to-br from-impuls-blue via-brand-700 to-brand-900 p-5 text-white shadow-soft sm:px-6 sm:py-7">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-sm font-medium text-blue-100">Verwaltung</p>
            <h1 class="mt-1 font-display text-2xl font-black tracking-tight sm:text-3xl">Kostenträger</h1>
            <p class="mt-2 max-w-3xl text-sm text-blue-100">
              Kostenträger, Kontakte, Klienten und Abrechnungswege sauber bündeln, damit Rechnungen später nicht hängen bleiben.
            </p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              class="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-impuls-blue hover:bg-blue-50"
              @click="navigate('NewCarrier')"
            >
              Neuer Kostenträger
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

      <!-- Master-Detail: Kostenträger links, Detail rechts (DESIGN.md) -->
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
                placeholder="Kostenträger, Stadt oder Kontakt suchen"
              />
            </label>
          </div>

          <div v-if="isLoading" class="divide-y divide-slate-100">
            <div v-for="n in 4" :key="n" class="flex items-center gap-3 px-4 py-3.5">
              <div class="h-9 w-9 flex-shrink-0 animate-pulse rounded-lg bg-slate-200"></div>
              <div class="flex-1 space-y-2"><div class="h-3.5 w-1/2 animate-pulse rounded bg-slate-200"></div><div class="h-3 w-2/3 animate-pulse rounded bg-slate-100"></div></div>
            </div>
          </div>
          <div v-else-if="filteredCarriers.length === 0" class="flex flex-col items-center px-5 py-12 text-center">
            <span class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100"><BuildingOfficeIcon class="h-6 w-6 text-slate-400" aria-hidden="true" /></span>
            <p class="mt-3 text-sm font-semibold text-slate-900">Keine Kostenträger gefunden</p>
            <p class="mt-1 text-sm text-slate-500">Passe Suche oder Statusfilter an.</p>
          </div>

          <div v-else data-testid="carriers-list" class="max-h-[72vh] overflow-auto">
            <button
              v-for="carrier in filteredCarriers"
              :key="carrier.id"
              type="button"
              @click="selectCarrier(carrier)"
              :class="['flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 text-left transition', selectedCarrier && selectedCarrier.id === carrier.id ? 'bg-blue-50' : 'hover:bg-slate-50']"
            >
              <InitialsAvatar :name="carrier.shortName || carrier.name || 'Kostenträger'" size-class="h-9 w-9 text-xs" />
              <span class="min-w-0 flex-1">
                <span :class="['block truncate font-display font-bold', selectedCarrier && selectedCarrier.id === carrier.id ? 'text-impuls-blue' : 'text-slate-900']">{{ carrier.name || 'Ohne Namen' }}</span>
                <span class="block truncate text-xs text-slate-500">{{ addressLine(carrier) }}</span>
              </span>
              <span :class="['shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold', carrierStatus(carrier).class]">{{ carrierStatus(carrier).label }}</span>
            </button>
          </div>
        </div>

        <!-- Detail -->
        <div v-if="selectedCarrier" data-testid="carrier-detail" class="rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <h2 class="font-display text-xl font-black tracking-tight text-slate-900">{{ selectedCarrier.name || 'Ohne Namen' }}</h2>
              <p class="mt-0.5 text-sm text-slate-500">{{ addressLine(selectedCarrier) }}</p>
            </div>
            <span :class="['shrink-0 rounded-lg px-3 py-1 text-xs font-semibold', carrierStatus(selectedCarrier).class]">{{ carrierStatus(selectedCarrier).label }}</span>
          </div>

          <div class="mt-5 grid gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 sm:grid-cols-2">
            <div class="bg-white px-4 py-4">
              <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Kontakte</p>
              <p class="mt-1 break-words text-sm font-semibold text-slate-800">{{ contactLine(selectedCarrier) }}</p>
            </div>
            <div class="bg-white px-4 py-4">
              <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Klienten</p>
              <p class="mt-1 text-sm font-semibold text-slate-800">{{ childCount(selectedCarrier) }} zugeordnet</p>
            </div>
          </div>

          <div class="mt-5 flex flex-wrap gap-2">
            <button class="rounded-lg bg-impuls-blue px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700" @click="openCarrier(selectedCarrier)">Kostenträger öffnen</button>
            <button class="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" @click="openChildren(selectedCarrier)">Klienten</button>
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
    BuildingOfficeIcon,
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
          title: 'Aktive Kostenträger',
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

    // Master-Detail: ausgewählter Kostenträger (fällt auf den ersten zurück)
    const selectedCarrierId = ref(null)
    const selectedCarrier = computed(() => {
      const list = filteredCarriers.value
      if (list.length === 0) return null
      return list.find((carrier) => carrier.id === selectedCarrierId.value) || list[0]
    })
    function selectCarrier(carrier) {
      selectedCarrierId.value = carrier.id
    }

    const quickLinks = [
      {
        title: 'Klienten',
        description: 'Klienten nach Kostenträger prüfen',
        route: 'ChildrenOverview'
      },
      {
        title: 'ASD-Fachkräfte',
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
      selectedCarrier,
      selectCarrier
    }
  }
}
</script>
