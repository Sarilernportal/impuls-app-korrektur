<!--
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus
08.11.2022
Scope:
Admin Navigation View


TODO HTML DOCUMENTATION
-->

<template>
  <div class="flex h-screen overflow-hidden bg-app-bg">
    <TransitionRoot
      as="template"
      :show="sidebarOpen"
    >
      <HDialog
        as="div"
        class="relative z-40 lg:hidden"
        @close="sidebarOpen = false"
      >
        <TransitionChild
          as="template"
          enter="transition-opacity ease-linear duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </TransitionChild>
        <div class="fixed inset-0 z-40 flex">
          <TransitionChild
            as="template"
            enter="transition ease-in-out duration-300 transform"
            enter-from="-translate-x-full"
            enter-to="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leave-from="translate-x-0"
            leave-to="-translate-x-full"
          >
            <DialogPanel class="relative flex w-full max-w-[18rem] flex-1 flex-col bg-sand pt-4 pb-4 shadow-2xl sm:max-w-xs">
              <TransitionChild
                as="template"
                enter="ease-in-out duration-300"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="ease-in-out duration-300"
                leave-from="opacity-100"
                leave-to="opacity-0"
              >
                <div class="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    class="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    @click="sidebarOpen = false"
                  >
                    <span class="sr-only">Close sidebar</span>
                    <XMarkIcon
                      class="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </TransitionChild>
              <button class="flex flex-shrink-0 items-center px-4">
                <img
                  @click="navigationTabTapped('GuardianAdminOverview')"
                  class="w-52 max-w-full rounded-2xl bg-white p-2 shadow-sm hover:bg-white"
                  src="@/assets/img/logo_main.png"
                  alt="Impuls logo"
                />
              </button>
              <nav
                class="pt-5 h-full flex-shrink-0 divide-y bg-sand overflow-y-auto"
                aria-label="Sidebar"
              >
                <div class="flex flex-col gap-2 px-2 divide-y divide-stone-300/70">
                  <div
                    v-for="(nav, navIndex) in navigation" :key="navIndex"
                    class="pt-3"
                  >
                    <p class="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-stone-500">{{ nav.title }}</p>
                    <AdminNavigationSidebarArea
                      :navigation="nav.items"
                      @nav-tabbed="navigationTabTapped"
                      @nav-query-tabbed="navigationQueryTabTapped"
                    />
                  </div>
                </div>
                <div class="mt-6 pt-6">
                  <div class="space-y-1 px-2">
                    <!-- change password button -->
                    <button
                      v-for="item in secondaryNavigation"
                      :key="item.name"
                      @click="navigationTabTapped(item.route)"
                      class="group flex min-h-[2.75rem] w-full items-center rounded-lg px-3 py-2.5 text-base font-medium text-stone-700 hover:bg-black/5 hover:text-stone-900"
                    >
                      <component
                        :is="item.icon"
                        class="mr-4 h-6 w-6 text-stone-500"
                        aria-hidden="true"
                      />
                      {{ item.name }}
                    </button>
                    <!-- logout button -->
                    <button
                      @click="logoutTapped()"
                      class="group flex min-h-[2.75rem] w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium leading-6 text-stone-700 hover:bg-black/5 hover:text-stone-900"
                    >
                      <ArrowRightOnRectangleIcon
                        class="mr-4 h-6 w-6 text-stone-500"
                        aria-hidden="true"
                      />
                      Logout
                    </button>
                  </div>
                </div>
              </nav>
            </DialogPanel>
          </TransitionChild>
          <div
            class="w-14 flex-shrink-0"
            aria-hidden="true"
          >
            <!-- Dummy element to force sidebar to shrink to fit close icon -->
          </div>
        </div>
      </HDialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <div class="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col xl:w-72">
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div class="flex flex-grow flex-col overflow-y-auto bg-sand pt-5 pb-4">
        <button class="flex flex-shrink-0 items-center px-4">
          <img
            @click="navigationTabTapped('GuardianAdminOverview')"
            class="w-56 max-w-full rounded-2xl bg-white p-2 shadow-sm hover:bg-white xl:w-60"
            src="@/assets/img/logo_main.png"
            alt="Impuls logo"
          />
        </button>
        <nav
          class="pt-5 flex flex-1 flex-col divide-y divide-gray-200 overflow-y-auto"
          aria-label="Sidebar"
        >
          <!-- Navbar Sections -->
          <div class="flex flex-col gap-2 px-2 divide-y divide-stone-300/70">
            <div
              v-for="(nav, navIndex) in navigation" :key="navIndex"
              class="pt-3"
            >
              <p class="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-stone-500">{{ nav.title }}</p>
              <AdminNavigationSidebarArea
                :navigation="nav.items"
                @nav-tabbed="navigationTabTapped"
                @nav-query-tabbed="navigationQueryTabTapped"
              />
            </div>
          </div>
          <div class="pt-3 mt-3">
            <div class="space-y-1 px-2">
              <!-- change password button -->
              <button
                v-for="item in secondaryNavigation"
                :key="item.name"
                @click="directNavigationTabTapped(item.route)"
                class="group flex min-h-[2.75rem] w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium leading-6 text-stone-700 hover:bg-black/5 hover:text-stone-900"
              >
                <component
                  :is="item.icon"
                  class="mr-4 h-6 w-6 text-stone-500"
                  aria-hidden="true"
                />
                {{ item.name }}
              </button>
              <!-- logout button -->
              <button
                @click="logoutTapped()"
                class="group flex min-h-[2.75rem] w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium leading-6 text-stone-700 hover:bg-black/5 hover:text-stone-900"
              >
                <ArrowRightOnRectangleIcon
                  class="mr-4 h-6 w-6 text-stone-500"
                  aria-hidden="true"
                />
                Logout
              </button>
            </div>
          </div>
        </nav>
      </div>
    </div>
    <div class="flex min-w-0 flex-1 flex-col lg:pl-64 xl:pl-72">
      <div class="flex h-16 flex-shrink-0 items-center border-b border-stone-300/70 bg-sand text-stone-900 lg:hidden lg:border-none print:hidden">
        <button
          type="button"
          class="flex h-full w-14 items-center justify-center border-r border-stone-300/70 text-stone-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-impuls-blue lg:hidden"
          @click="sidebarOpen = true"
        >
          <span class="sr-only">Open sidebar</span>
          <Bars3CenterLeftIcon
            class="h-7 w-7"
            aria-hidden="true"
          />
        </button>
        <div class="flex min-w-0 flex-1 items-center justify-between gap-3 px-3">
          <button
            class="min-w-0 text-left"
            @click="navigationTabTapped('BillingCenter')"
          >
            <p class="truncate text-sm font-semibold leading-tight">Impuls</p>
            <p class="truncate text-xs text-stone-500">{{ routeTitle }}</p>
          </button>
          <img
            class="h-10 w-auto rounded-lg bg-white p-1"
            src="@/assets/img/logo_main.png"
            alt="Impuls logo"
          />
        </div>
      </div>
      <main class="z-0 min-w-0 flex-1 overflow-auto focus:outline-none">
        <div class="min-h-full w-full min-w-0">
          <!-- Slot for content aside the navbars -->
          <slot />
        </div>
      </main>
      <!-- Footer -->
      <div class="flex w-full flex-wrap justify-center gap-x-4 gap-y-1 border-t border-stone-300/70 bg-sand px-4 py-2 text-sm print:hidden sm:text-base">
        <router-link
          :to="{ name: 'AdminImprint' }"
          class="text-stone-600 hover:text-stone-900"
        >Impressum</router-link>
        <router-link
          :to="{ name: 'AdminGDPR' }"
          class="text-stone-600 hover:text-stone-900"
        >
          Datenschutzbestimmung
        </router-link>
        <!-- Footer im Sand-Ton (einheitlich mit Sidebar) -->
      </div>
      <!-- note notification -->
      <div
        v-if="unreadNotesStatus"
        class="print:hidden"
      >
        <NoteboxNotificationItem @close-clicked="closeNoteboxNotificationClicked" />
      </div>
    </div>
  </div>
</template>

<script>
//Vue imports
import { computed, ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'

// component imports
import NoteboxNotificationItem from '@/components/Main/Admin/Notebox/NoteboxNotificationItem.vue'
import AdminNavigationSidebarArea from '@/components/Navigation/AdminNavigationSidebarArea.vue'

//Headles UI imports
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
  Disclosure,
  DisclosureButton,
  DisclosurePanel
} from '@headlessui/vue'
//Icon imports
import {
  ClockIcon,
  CogIcon,
  UsersIcon,
  UserIcon,
  BuildingOfficeIcon,
  HomeIcon,
  PresentationChartLineIcon,
  EnvelopeOpenIcon,
  Bars3CenterLeftIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
  IdentificationIcon,
  LinkIcon,
  DocumentTextIcon,
  DocumentIcon,
  DocumentCheckIcon,
  ClipboardDocumentListIcon,
  FolderIcon,
  PencilSquareIcon,
  CalendarDaysIcon,
  BanknotesIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'NavigationBar',
  components: {
    NoteboxNotificationItem,
    HDialog: Dialog,
    DialogPanel,
    TransitionChild,
    TransitionRoot,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    ClockIcon,
    CogIcon,
    BuildingOfficeIcon,
    HomeIcon,
    PresentationChartLineIcon,
    Bars3CenterLeftIcon,
    ArrowRightOnRectangleIcon,
    XMarkIcon,
    IdentificationIcon,
    LinkIcon,
    DocumentTextIcon,
    DocumentIcon,
    DocumentCheckIcon,
    ClipboardDocumentListIcon,
    FolderIcon,
    PencilSquareIcon,
    CalendarDaysIcon,
    BanknotesIcon,
    AdminNavigationSidebarArea
  },
  setup() {
    // Ref initialization
    const sidebarOpen = ref(false)
    const unreadNotesStatus = ref(false)

    // Router initialization
    const router = useRouter()
    const route = useRoute()

    // Store initialization
    const store = useStore()

    // Constant initialization
    // Init navigation routes – in thematische Gruppen mit Überschrift geteilt.
    // Die Gruppe "Leistung & Abrechnung" folgt dem Prozessfluss:
    // Dokumentationen → Nachweise → Abrechnung → Rechnungen.
    const navigation = ref([
      {
        title: 'Verwaltung',
        items: [
          {
            name: 'Klienten',
            route: 'ChildrenOverview',
            icon: UserIcon,
            current: false
          },
          {
            name: 'Betreuer',
            route: 'GuardianAdminOverview',
            icon: IdentificationIcon,
            current: false
          },
          {
            name: 'Kostenträger',
            route: 'CarrierOverview',
            icon: BuildingOfficeIcon,
            current: false
          }
        ]
      },
      {
        title: 'Leistung & Abrechnung',
        items: [
          {
            name: 'Dokumentationen',
            route: 'Reports',
            icon: ClipboardDocumentListIcon,
            current: false
          },
          {
            name: 'Nachweise',
            route: 'Timesheets',
            icon: DocumentCheckIcon,
            current: false
          },
          {
            name: 'Abrechnung',
            route: 'BillingCenter',
            icon: BanknotesIcon,
            current: false
          },
          {
            name: 'Rechnungen',
            route: 'Invoices',
            icon: DocumentTextIcon,
            current: false
          }
        ]
      },
      {
        title: 'Organisation',
        items: [
          {
            name: 'Kalender',
            route: 'CalendarOverview',
            icon: CalendarDaysIcon,
            current: false
          },
          {
            name: 'Sharebox',
            route: 'ShareboxOverview',
            icon: FolderIcon,
            current: false
          },
          {
            name: 'Notebox',
            route: 'NoteboxOverview',
            icon: PencilSquareIcon,
            current: false
          }
        ]
      }
    ])

    // Init secondary naviation routes
    const secondaryNavigation = ref([
      {
        name: 'Administratoren',
        route: 'UserOverview',
        icon: UsersIcon,
        current: true
      },
      {
        name: 'Passwort ändern',
        route: 'ChangePassword',
        icon: CogIcon,
        current: false
      }
    ])

    const routeTitle = computed(() => {
      const explicitTitles = {
        BillingCenter: 'Abrechnung',
        GuardianAdminOverview: 'Betreuer',
        UserOverview: 'Administratoren',
        NewUser: route.params.type === 'admin' ? 'Admin hinzufügen' : 'Betreuer hinzufügen',
        UserDetails: 'Benutzerprofil',
        CarrierOverview: 'Kostenträger',
        NewCarrier: 'Kostenträger hinzufügen',
        CarrierDetails: 'Kostenträgerdetails',
        CarrierContactOverview: 'Kostenträger-Kontakte',
        NewCarrierContact: 'Kostenträger-Kontakt hinzufügen',
        CarrierContactDetails: 'Kontaktdetails',
        ChildrenOverview: 'Klienten',
        NewChild: 'Klient hinzufügen',
        ChildDetails: 'Klientendetails',
        Reports: 'Dokumentationen',
        Timesheets: 'Nachweise',
        Invoices: 'Rechnungen',
        ShareboxOverview: 'Sharebox',
        ShareboxUpload: 'Datei hochladen',
        NoteboxOverview: 'Notebox',
        NoteboxCreateNote: 'Notiz erstellen',
        CalendarOverview: 'Kalender',
        NewCalendar: 'Kalender erstellen',
        NewEvent: 'Termin erstellen',
        ChangePassword: 'Passwort ändern'
      }
      if (explicitTitles[route.name]) {
        return explicitTitles[route.name]
      }
      const primaryItems = navigation.value.flatMap((group) => group.items)
      const allItems = [...primaryItems, ...secondaryNavigation.value]
      return allItems.find((item) => item.route === route.name)?.name || 'Impuls'
    })

    // Watcher for registration of route changes for visualitation of the current route
    watch(
      () => route.name,
      () => {
        // Refresh curront route when changes occurs
        refreshCurrentRouteInMenu(route.name)
        // check for unread notes everytime the user navigates
        checkForUnreadNotes()
      },
      { immediate: true }
    )

    // Callback when the user hits the navigtation tab
    async function navigationTabTapped(route) {
      try {
        // Get the selected navigation item
        const target = navigation.value.find((group) => {
          return group.items.some((item) => {
            return item.route === route
          })
        })
        if (!target) {
          router.push({ name: route })
          return
        }
        const targetNav = target.items.find((nav) => {
          return nav.route === route
        })
        // Close the sidebar only, when we tab no child navigation
        if (!targetNav || (targetNav && !targetNav.children && !targetNav.queryChildren)) {
          sidebarOpen.value = false
          // Push to the selected route
          router.push({ name: route })
        }
      } catch (error) {
        console.log(error)
      }
    }

    // user clicked on secondary navigation item
    function directNavigationTabTapped(route) {
      try {
        // close sidebar
        sidebarOpen.value = false
        // Push to the selected route
        router.push({ name: route })
      } catch (error) {
        console.log(error)
      }
    }

    async function navigationQueryTabTapped(routeData) {
      try {
        const { mainRoute, route } = routeData
        // Push to the selected route
        router.push({
          name: mainRoute.route,
          query: { [route.query]: route.value }
        })
      } catch (error) {
        console.log(error)
      }
    }

    // Refresh visualitation of the current route in the menu
    function refreshCurrentRouteInMenu(name) {
      const parentRoutes = {
        NewUser: 'GuardianAdminOverview',
        UserDetails: 'GuardianAdminOverview',
        NewCarrier: 'CarrierOverview',
        CarrierDetails: 'CarrierOverview',
        NewCarrierContact: 'CarrierContactOverview',
        CarrierContactDetails: 'CarrierContactOverview',
        NewChild: 'ChildrenOverview',
        ChildDetails: 'ChildrenOverview',
        ChildDocumentsOverview: 'ChildrenOverview',
        ReportDetails: 'Reports',
        ReportCreateEmpty: 'Reports',
        TimeSheetDetails: 'Timesheets',
        InvoiceDetails: 'Invoices',
        ShareboxUpload: 'ShareboxOverview',
        NoteboxCreateNote: 'NoteboxOverview',
        NewCalendar: 'CalendarOverview',
        NewEvent: 'CalendarOverview',
        CalendarDetails: 'CalendarOverview'
      }
      const activeRoute = parentRoutes[name] || name
      navigation.value.forEach((group) => {
        group.items.forEach((item) => {
          item.current = item.route === activeRoute
        })
      })
      secondaryNavigation.value.forEach((item) => {
        item.current = item.route === activeRoute
      })
    }

    // Sign the user out through the store
    async function logoutTapped() {
      try {
        await store.dispatch('signOut')
      } catch (err) {
        console.warn(err)
      } finally {
        router.push({ name: 'Login' })
      }
    }

    // check if user has unread notes
    async function checkForUnreadNotes() {
      try {
        if (route.name !== 'NoteboxOverview') {
          // get unread notes status via store
          const noteTagResponse = await store.dispatch('checkUnreadNotesStatus')
          // set status according to controller response
          unreadNotesStatus.value = noteTagResponse.status
        } else {
          unreadNotesStatus.value = false
        }
      } catch (error) {
        console.log(error)
        // fallback
        unreadNotesStatus.value = false
      }
    }

    // function for closing the notebox notification manually
    function closeNoteboxNotificationClicked() {
      unreadNotesStatus.value = false
    }

    // // pull carriers and save them in the nav ref
    // async function getCarriers() {
    //   try {
    //     // create payload obj
    //     const payload = {
    //       nextToken: null,
    //       filter: ''
    //     }
    //     // get carries via store
    //     const resp = await store.dispatch('fetchCarriers', payload)
    //     // get index of client list item
    //     const listIndex = navigation.value[0].findIndex((entry) => {
    //       return entry.name === 'Klienten'
    //     })
    //     // save carriers in nav
    //     navigation.value[0][listIndex].queryChildren = resp.items.map((item) => {
    //       return {
    //         name: item.shortName ? item.shortName :
    //           item.name.length > 29
    //             ? item.name.slice(0, 30) + '...'
    //             : item.name,
    //         route: {
    //           query: 'carrierID',
    //           value: item.id
    //         }
    //       }
    //     })
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }

    // get notes on component mount
    onMounted(async () => {
      checkForUnreadNotes()
      // await getCarriers()
    })

    // Return the setup object
    return {
      sidebarOpen,
      routeTitle,
      navigation,
      secondaryNavigation,
      unreadNotesStatus,
      navigationTabTapped,
      directNavigationTabTapped,
      navigationQueryTabTapped,
      logoutTapped,
      closeNoteboxNotificationClicked
    }
  }
}
</script>
