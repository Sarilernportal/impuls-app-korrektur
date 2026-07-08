<template>
  <div class="min-h-full bg-app-bg px-4 py-5 sm:px-6 lg:px-8">
    <div class="flex w-full flex-col gap-5">
      <section class="rounded-xl bg-gradient-to-br from-impuls-blue via-brand-700 to-brand-900 p-5 text-white shadow-soft sm:px-6 sm:py-7">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-sm font-medium text-blue-100">Kostenträger</p>
            <h1 class="mt-1 font-display text-2xl font-black tracking-tight sm:text-3xl">Kontakte</h1>
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

      <!-- Master-Detail: Kontaktliste links, Detail rechts (DESIGN.md) -->
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
                placeholder="Kontakt, Kostenträger oder Klient suchen"
              />
            </label>
          </div>

          <div v-if="filteredContacts.length === 0" class="flex flex-col items-center px-5 py-12 text-center">
            <span class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100"><UserCircleIcon class="h-6 w-6 text-slate-400" aria-hidden="true" /></span>
            <p class="mt-3 text-sm font-semibold text-slate-900">Keine Kontakte gefunden</p>
            <p class="mt-1 text-sm text-slate-500">Passe Suche oder Statusfilter an.</p>
          </div>

          <div v-else data-testid="contacts-list" class="max-h-[72vh] overflow-auto">
            <button
              v-for="contact in filteredContacts"
              :key="contact.id"
              type="button"
              @click="selectContact(contact)"
              :class="['flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 text-left transition', selectedContact && selectedContact.id === contact.id ? 'bg-blue-50' : 'hover:bg-slate-50']"
            >
              <InitialsAvatar :name="contact.name || 'Kontakt'" size-class="h-9 w-9 text-xs" />
              <span class="min-w-0 flex-1">
                <span :class="['block truncate font-display font-bold', selectedContact && selectedContact.id === contact.id ? 'text-impuls-blue' : 'text-slate-900']">{{ contact.name || 'Ohne Namen' }}</span>
                <span class="block truncate text-xs text-slate-500">{{ contact.carrier }}</span>
              </span>
              <span :class="['shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold', contact.badgeClass]">{{ contact.status }}</span>
            </button>
          </div>
        </div>

        <!-- Detail -->
        <div v-if="selectedContact" data-testid="contact-detail" class="rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <h2 class="font-display text-xl font-black tracking-tight text-slate-900">{{ selectedContact.name || 'Ohne Namen' }}</h2>
              <p class="mt-0.5 break-words text-sm text-slate-500">{{ selectedContact.email }}</p>
            </div>
            <span :class="['shrink-0 rounded-lg px-3 py-1 text-xs font-semibold', selectedContact.badgeClass]">{{ selectedContact.status }}</span>
          </div>

          <div class="mt-5 grid gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 sm:grid-cols-2">
            <div class="bg-white px-4 py-4">
              <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Kostenträger</p>
              <p class="mt-1 break-words text-sm font-semibold text-slate-800">{{ selectedContact.carrier }}</p>
            </div>
            <div class="bg-white px-4 py-4">
              <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Klienten</p>
              <p class="mt-1 break-words text-sm font-semibold text-slate-800">{{ selectedContact.children }}</p>
            </div>
          </div>

          <div class="mt-5 flex flex-wrap gap-2">
            <button class="rounded-lg bg-impuls-blue px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700" @click="navigate('CarrierOverview')">Kostenträger öffnen</button>
            <button class="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" @click="navigate('ChildrenOverview')">Klienten</button>
            <button class="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" @click="writeEmail(selectedContact)">E-Mail schreiben</button>
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
  BuildingOfficeIcon,
  EnvelopeIcon,
  LinkIcon,
  MagnifyingGlassIcon,
  UserCircleIcon
} from '@heroicons/vue/24/outline'
import InitialsAvatar from '@/components/UIComponents/InitialsAvatar.vue'

export default {
  name: 'CarrierContactOverview',
  components: {
    ArrowRightIcon,
    MagnifyingGlassIcon,
    UserCircleIcon,
    InitialsAvatar
  },
  setup() {
    const router = useRouter()
    const searchValue = ref('')
    const selectedStatus = ref('all')

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

    const metrics = computed(() => {
      const withCarrier = contacts.filter((contact) => Boolean(contact.carrier))
      const withChildren = contacts.filter((contact) => Boolean(contact.children))
      const questions = contacts.filter((contact) => contact.status === 'Rückfrage')

      return [
        {
          title: 'Kontakte',
          value: contacts.length,
          filter: 'all',
          icon: UserCircleIcon,
          iconClass: 'text-blue-500',
          badgeClass: 'bg-blue-100 text-blue-700'
        },
        {
          title: 'Mit Kostenträger',
          value: withCarrier.length,
          filter: 'withCarrier',
          icon: BuildingOfficeIcon,
          iconClass: 'text-emerald-500',
          badgeClass: 'bg-emerald-100 text-emerald-700'
        },
        {
          title: 'Mit Klienten',
          value: withChildren.length,
          filter: 'withChildren',
          icon: LinkIcon,
          iconClass: 'text-sky-500',
          badgeClass: 'bg-sky-100 text-sky-700'
        },
        {
          title: 'Rückfragen',
          value: questions.length,
          filter: 'questions',
          icon: EnvelopeIcon,
          iconClass: 'text-orange-500',
          badgeClass: 'bg-amber-100 text-amber-700'
        }
      ]
    })

    const filteredContacts = computed(() => {
      const search = searchValue.value.toLowerCase().trim()
      return contacts.filter((contact) => {
        const matchesSearch = !search || [
          contact.name,
          contact.email,
          contact.carrier,
          contact.children
        ].filter(Boolean).some((value) => value.toLowerCase().includes(search))

        if (!matchesSearch) {
          return false
        }

        if (selectedStatus.value === 'withCarrier') {
          return Boolean(contact.carrier)
        }
        if (selectedStatus.value === 'withChildren') {
          return Boolean(contact.children)
        }
        if (selectedStatus.value === 'questions') {
          return contact.status === 'Rückfrage'
        }
        return true
      })
    })

    // Master-Detail: ausgewählter Kontakt (fällt auf den ersten der Liste zurück)
    const selectedContactId = ref(null)
    const selectedContact = computed(() => {
      const list = filteredContacts.value
      if (list.length === 0) return null
      return list.find((contact) => contact.id === selectedContactId.value) || list[0]
    })
    function selectContact(contact) {
      selectedContactId.value = contact.id
    }

    const quickLinks = [
      {
        title: 'Kostenträger',
        description: 'Kostenstellen und Kontakte öffnen',
        route: 'CarrierOverview'
      },
      {
        title: 'Klienten',
        description: 'Klienten nach Kostenträger prüfen',
        route: 'ChildrenOverview'
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

    function navigate(routeName) {
      router.push({ name: routeName })
    }

    function writeEmail(contact) {
      if (contact?.email) {
        window.location.href = `mailto:${contact.email}`
      }
    }

    return {
      contacts,
      filteredContacts,
      metrics,
      navigate,
      quickLinks,
      searchValue,
      selectedStatus,
      selectedContact,
      selectContact,
      writeEmail
    }
  }
}
</script>
