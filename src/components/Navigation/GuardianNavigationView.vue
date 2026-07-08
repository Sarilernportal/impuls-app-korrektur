<template>
  <div class="min-h-screen bg-app-bg flex flex-col">
    <Disclosure
      as="nav"
      class="sticky top-0 z-20 border-b border-slate-200 bg-white/95 pt-[env(safe-area-inset-top)] backdrop-blur"
      v-slot="{ open }"
    >
      <div class="px-4 sm:px-6">
        <div class="flex h-16 items-center justify-between">
          <button
            class="flex items-center gap-3 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-impuls-blue"
            @click="homeButtonTapped"
          >
            <img
              class="h-9 w-auto"
              src="@/assets/img/logo_main.png"
              alt="Impuls"
            />
            <div>
              <p class="text-xs font-medium uppercase tracking-wide text-slate-500">
                Mitarbeiter
              </p>
              <h1 class="font-display text-xl font-black tracking-tight text-impuls-blue">Impuls</h1>
            </div>
          </button>
          <DisclosureButton
            class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-impuls-blue"
          >
            <span class="sr-only">Menü öffnen</span>
            <Bars3Icon
              v-if="!open"
              class="h-6 w-6"
              aria-hidden="true"
            />
            <XCircleIcon
              v-else
              class="h-6 w-6"
              aria-hidden="true"
            />
          </DisclosureButton>
        </div>
      </div>
      <DisclosurePanel>
        <div class="border-t border-slate-200 px-4 py-3">
          <div class="grid gap-2">
            <button
              @click="changePasswordtapped"
              class="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Passwort ändern
            </button>
            <button
              @click="logoutButtonTapped"
              class="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Logout
            </button>
            <div class="flex gap-4 px-3 py-2 text-xs text-slate-500">
              <router-link
                :to="{ name: 'GuardianImprint' }"
                class="hover:text-impuls-blue"
              >Impressum</router-link>
              <router-link
                :to="{ name: 'GuardianGDPR' }"
                class="hover:text-impuls-blue"
              >Datenschutz</router-link>
            </div>
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>

    <main class="flex-1 pb-[calc(6rem+env(safe-area-inset-bottom))]">
      <slot />
    </main>

    <nav class="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-lg backdrop-blur">
      <div class="mx-auto grid max-w-3xl grid-cols-5 gap-1">
        <button
          v-for="item in navigationItems"
          :key="item.route"
          @click="navigationTapped(item.route)"
          :class="[
            isActive(item.route)
              ? 'bg-blue-50 text-impuls-blue'
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800',
            'flex flex-col items-center justify-center rounded-lg px-1 py-2 text-xs font-medium'
          ]"
        >
          <component
            :is="item.icon"
            class="mb-1 h-5 w-5"
            aria-hidden="true"
          />
          <span>{{ item.name }}</span>
        </button>
      </div>
    </nav>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import {
  ArchiveBoxIcon,
  Bars3Icon,
  CalendarDaysIcon,
  ClockIcon,
  DocumentTextIcon,
  HomeIcon,
  XCircleIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'GuardianNavigationView',
  components: {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    ArchiveBoxIcon,
    Bars3Icon,
    CalendarDaysIcon,
    ClockIcon,
    DocumentTextIcon,
    HomeIcon,
    XCircleIcon
  },
  setup() {
    const router = useRouter()
    const route = useRoute()

    const navigationItems = computed(() => [
      { name: 'Start', route: 'GuardianOverview', icon: HomeIcon },
      { name: 'Doku', route: 'ReportSubMenu', icon: DocumentTextIcon },
      { name: 'Nachweis', route: 'ProofView', icon: ClockIcon },
      { name: 'Kalender', route: 'GuardianCalendarOverview', icon: CalendarDaysIcon },
      { name: 'Dateien', route: 'GuardianShareboxOverview', icon: ArchiveBoxIcon }
    ])

    function homeButtonTapped() {
      router.push({ name: 'GuardianOverview' })
    }

    function navigationTapped(routeName) {
      router.push({ name: routeName })
    }

    function isActive(routeName) {
      return route.name === routeName
    }

    async function logoutButtonTapped() {
      try {
        await router.push({ name: 'Login' })
      } catch (err) {
        console.warn(err)
      }
    }

    function changePasswordtapped() {
      router.push({ name: 'ChangePassword' })
    }

    return {
      navigationItems,
      homeButtonTapped,
      navigationTapped,
      isActive,
      logoutButtonTapped,
      changePasswordtapped
    }
  }
}
</script>
