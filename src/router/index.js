/*
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
13.09.2022

Scope:
Router
*/
// Module Imports
import { createRouter, createWebHistory } from 'vue-router'
import { currentAuthenticatedUser } from '@/services/authService.js'

// !Page Imports!
// Auth
const AuthPage = () => import('@/views/auth/Auth.vue')
const Login = () => import('@/views/auth/Login.vue')
const PasswordForgot = () => import('@/views/auth/PasswordForgot.vue')
const PasswordForgotConfirm = () => import('@/views/auth/PasswordForgotConfirm.vue')
const NewPassword = () => import('@/views/auth/NewPassword.vue')
const ChangePassword = () => import('@/views/auth/ChangePassword.vue')

// Legal
const LegalContainer = () => import('@/views/legal/LegalContainer.vue')
const Imprint = () => import('@/views/legal/Imprint.vue')
const GDPR = () => import('@/views/legal/GDPR.vue')

// Main
// Admin
const AdminContainer = () => import('@/views/main/admin/AdminContainer.vue')
const BillingCenter = () => import('@/views/main/admin/BillingCenter.vue')
//  Admin Children
//  User
const UserContainer = () => import('@/views/main/admin/user/UserContainer.vue')
const UserOverview = () => import('@/views/main/admin/user/UserOverview.vue')
const UserDetails = () => import('@/views/main/admin/user/UserDetails.vue')
const NewUser = () => import('@/views/main/admin/user/NewUser.vue')
// Carrier
const CarrierContainer = () => import('@/views/main/admin/carrier/CarrierContainer.vue')
const CarrierOverview = () => import('@/views/main/admin/carrier/CarrierOverview.vue')
const CarrierDetails = () => import('@/views/main/admin/carrier/CarrierDetails.vue')
const NewCarrier = () => import('@/views/main/admin/carrier/NewCarrier.vue')
// Carrier Contact
const CarrierContactContainer = () => import('@/views/main/admin/carrierContact/CarrierContactContainer.vue')
const CarrierContactOverview = () => import('@/views/main/admin/carrierContact/CarrierContactOverview.vue')
const CarrierContactDetails = () => import('@/views/main/admin/carrierContact/CarrierContactDetails.vue')
const NewCarrierContact = () => import('@/views/main/admin/carrierContact/NewCarrierContact.vue')
// Guardian
const GuardianDetails = () => import('@/views/main/admin/guardian/GuardianDetails.vue')
const GuardianAdminContainer = () => import('@/views/main/admin/guardian/GuardianAdminContainer.vue')
const GuardianAdminOverview = () => import('@/views/main/admin/guardian/GuardianAdminOverview.vue')
// Children
const ChildrenContainer = () => import('@/views/main/admin/children/ChildrenContainer.vue')
const ChildrenOverview = () => import('@/views/main/admin/children/ChildrenOverview.vue')
const ChildDetails = () => import('@/views/main/admin/children/ChildDetails.vue')
const ChildDocumentsOverview = () => import('@/views/main/admin/children/ChildDocumentsOverview.vue')
const NewChild = () => import('@/views/main/admin/children/NewChild.vue')
// Documents
const DocumentsContainer = () => import('@/views/main/admin/documents/DocumentsContainer.vue')
const ReportsOverview = () => import('@/views/main/admin/documents/ReportsOverview.vue')
const ReportDetails = () => import('@/views/main/admin/documents/ReportDetails.vue')
const ReportCreateEmpty = () => import('@/views/main/admin/documents/ReportCreateEmpty.vue')
const TimesheetOverview = () => import('@/views/main/admin/documents/TimesheetOverview.vue')
const TimeSheetDetails = () => import('@/views/main/admin/documents/TimeSheetDetails.vue')
const InvoiceOverview = () => import('@/views/main/admin/documents/InvoiceOverview.vue')
const InvoiceDetails = () => import('@/views/main/admin/documents/InvoiceDetails.vue')
// Sharebox
const ShareboxContainer = () => import('@/views/main/admin/sharebox/ShareboxContainer.vue')
const ShareboxOverview = () => import('@/views/main/admin/sharebox/ShareboxOverview.vue')
const ShareboxUpload = () => import('@/views/main/admin/sharebox/ShareboxUpload.vue')
// Notebox
const NoteboxContainer = () => import('@/views/main/admin/notebox/NoteboxContainer.vue')
const NoteboxOverview = () => import('@/views/main/admin/notebox/NoteboxOverview.vue')
const NoteboxCreateNote = () => import('@/views/main/admin/notebox/NoteboxCreateNote.vue')
// Calendar
const CalendarContainer = () => import('@/views/main/admin/calendar/CalendarContainer.vue')
const CalendarOverview = () => import('@/views/main/admin/calendar/CalendarOverview.vue')
const NewCalendar = () => import('@/views/main/admin/calendar/NewCalendar.vue')
const CalendarDetails = () => import('@/views/main/admin/calendar/CalendarDetails.vue')
const NewEvent = () => import('@/views/main/admin/calendar/NewEvent.vue')

// Guardian
const GuardianContainer = () => import('@/views/main/guardian/GuardianContainer.vue')
const GuardianOverview = () => import('@/views/main/guardian/GuardianOverview.vue')
const ReportSubMenu = () => import('@/views/main/guardian/ReportSubMenu.vue')
const ProofView = () => import('@/views/main/guardian/ProofView.vue')
const ReportView = () => import('@/views/main/guardian/ReportView.vue')
const SpecialReportView = () => import('@/views/main/guardian/SpecialReportView.vue')
const EditReportView = () => import('@/views/main/guardian/EditReportView.vue')
const EditSpecialReportView = () => import('@/views/main/guardian/EditSpecialReportView.vue')
const GuardianShareboxOverview = () => import('@/views/main/guardian/GuardianShareboxOverview.vue')
const GuardianFlaggedOverview = () => import('@/views/main/guardian/GuardianFlaggedOverview.vue')
const GuardianFlaggedDetails = () => import('@/views/main/guardian/GuardianFlaggedDetails.vue')
const GuardianCalendarOverview = () => import('@/views/main/guardian/GuardianCalendarOverview.vue')

// Define the routes
const routes = [
  {
    // Redirect route for simple slash
    name: 'Home',
    path: '/',
    redirect: '/admin'
  },
  {
    // Auth
    name: 'Auth',
    path: '/auth',
    component: AuthPage,
    children: [
      {
        // Auth-Child Login
        name: 'Login',
        path: '/login',
        component: Login
      },
      {
        // Auth-Child Password-Forgot
        name: 'PasswordForgot',
        path: 'password-forgot',
        component: PasswordForgot
      },
      {
        // Auth-Child Password-Forgot-Confirm
        name: 'PasswordForgotConfirm',
        path: 'password-forgot-confirm',
        component: PasswordForgotConfirm
      },
      {
        // Auth-Child New-Password
        name: 'NewPassword',
        path: 'new-password',
        component: NewPassword
      },
      {
        // Change password
        name: 'ChangePassword',
        path: 'change-password',
        component: ChangePassword,
        meta: {
          requiresAuth: true,
          requiresAdmin: false
        }
      }
    ],
    meta: {
      requiresAuth: false
    }
  },
  {
    // Legal
    name: 'Legal',
    path: '/legal',
    component: LegalContainer,
    children: [
      {
        // Legal-Child imprint
        name: 'Imprint',
        path: 'impressum',
        component: Imprint
      },
      {
        // Legal-Child imprint
        name: 'GDPR',
        path: 'datenschutz',
        component: GDPR
      }
    ],
    meta: {
      requiresAuth: false
    }
  },
  {
    // Admin
    name: 'Admin',
    path: '/admin',
    component: AdminContainer,
    redirect: '/admin/billing',
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    },
    children: [
      {
        name: 'BillingCenter',
        path: 'billing',
        component: BillingCenter
      },
      {
        // Admin-Child User
        name: 'User',
        path: 'user',
        component: UserContainer,
        children: [
          {
            // User Child UserOverview
            name: 'UserOverview',
            path: '',
            component: UserOverview
          },
          {
            // User Child UserDetails
            name: 'UserDetails',
            path: ':id',
            props: true,
            component: UserDetails
          },
          {
            // User Child NewUser
            name: 'NewUser',
            path: 'add-:type',
            props: true,
            component: NewUser
          }
        ]
      },
      {
        // Admin-Child Carrier
        name: 'Carrier',
        path: 'carrier',
        component: CarrierContainer,
        meta: {
          requiresAuth: true,
          requiresAdmin: true
        },
        children: [
          {
            // User Child UserOverview
            name: 'CarrierOverview',
            path: '',
            component: CarrierOverview
          },
          {
            // User Child UserDetails
            name: 'CarrierDetails',
            path: ':id',
            props: true,
            component: CarrierDetails
          },
          {
            // User Child NewUser
            name: 'NewCarrier',
            path: 'add-carrier',
            component: NewCarrier
          }
        ]
      },
      {
        // Admin-Child Carrier Contact
        name: 'CarrierContact',
        path: 'carrier-contact',
        component: CarrierContactContainer,
        meta: {
          requiresAuth: true,
          requiresAdmin: true
        },
        children: [
          {
            // User Child UserOverview
            name: 'CarrierContactOverview',
            path: '',
            component: CarrierContactOverview
          },
          {
            // User Child UserDetails
            name: 'CarrierContactDetails',
            path: ':id',
            props: true,
            component: CarrierContactDetails
          },
          {
            // User Child NewUser
            name: 'NewCarrierContact',
            path: 'add-carrier-contact',
            component: NewCarrierContact
          }
        ]
      },
      {
        // Admin-Child Guardian
        name: 'GuardianAdmin',
        path: 'guardian',
        component: GuardianAdminContainer,
        meta: {
          requiresAuth: true,
          requiresAdmin: true
        },
        children: [
          {
            // Admin Child GuardianAdminOverview
            name: 'GuardianAdminOverview',
            path: '',
            component: GuardianAdminOverview
          }
        ]
      },
      {
        // Admin-Child Children
        name: 'Children',
        path: 'children',
        component: ChildrenContainer,
        meta: {
          requiresAuth: true,
          requiresAdmin: true
        },
        children: [
          {
            // User Child UserOverview
            name: 'ChildrenOverview',
            path: '',
            component: ChildrenOverview
          },
          {
            // User Child UserDetails
            name: 'ChildDetails',
            path: ':id',
            props: true,
            component: ChildDetails
          },
          {
            // User Child UserDetails
            name: 'ChildDocumentsOverview',
            path: ':id/documents',
            component: ChildDocumentsOverview
          },
          {
            // User Child NewUser
            name: 'NewChild',
            path: 'add-child',
            component: NewChild
          }
        ]
      },
      {
        // Admin-Documents
        name: 'Documents',
        path: 'documents',
        component: DocumentsContainer,
        meta: {
          requiresAuth: true,
          requiresAdmin: true
        },
        children: [
          // Admin-Documents Reports
          {
            name: 'Reports',
            path: 'reports',
            component: ReportsOverview
          },
          // Admin-Documents ReportCreateEmpty
          {
            name: 'ReportCreateEmpty',
            path: 'reports/create-empty',
            component: ReportCreateEmpty
          },
          // Admin-Documents Report Details
          {
            name: 'ReportDetails',
            path: 'reports/:id',
            component: ReportDetails,
            props: route => ({
              id: route.params.id,
              reportsIds: null,  // Will be populated during navigation
              currentIndex: null  // Will be populated during navigation
            })
          },
          // Admin-Documents Timesheets
          {
            name: 'Timesheets',
            path: 'timesheets',
            component: TimesheetOverview
          },
          // Admin-Documents Timesheets Details
          {
            name: 'TimeSheetDetails',
            path: 'timesheets/:id',
            component: TimeSheetDetails,
            props: route => ({
              id: route.params.id,
              reportsIds: null,  // Will be populated during navigation
              currentIndex: null  // Will be populated during navigation
            })
          },
          // Admin-Documents Invoices
          {
            name: 'Invoices',
            path: 'invoices',
            component: InvoiceOverview
          },
          // Admin-Documents Invoices Details
          {
            name: 'InvoiceDetails',
            path: 'invoices/:id',
            component: InvoiceDetails,
            props: route => ({
              id: route.params.id,
              invoicesIds: null,  // Will be populated during navigation
              currentIndex: null  // Will be populated during navigation
            })
          }
        ]
      },
      {
        // Admin Sharebox
        name: 'Sharebox',
        path: 'sharebox',
        component: ShareboxContainer,
        meta: {
          requiresAuth: true,
          requiresAdmin: true
        },
        children: [
          {
            // Admin ShareboxOverview
            name: 'ShareboxOverview',
            path: '',
            component: ShareboxOverview
          },
          {
            // Admin ShareboxUpload
            name: 'ShareboxUpload',
            path: 'upload',
            component: ShareboxUpload
          }
        ]
      },
      {
        // Admin Notebox
        name: 'Notebox',
        path: 'notebox',
        component: NoteboxContainer,
        meta: {
          requiresAuth: true,
          requiresAdmin: true
        },
        children: [
          {
            // Admin NoteboxOverview
            name: 'NoteboxOverview',
            path: '',
            component: NoteboxOverview
          },
          {
            // Admin NoteboxCreateNote
            name: 'NoteboxCreateNote',
            path: 'create',
            component: NoteboxCreateNote
          }
        ]
      },
      {
        // Admin Calendar
        name: 'Calendar',
        path: 'calendar',
        component: CalendarContainer,
        meta: {
          requiresAuth: true,
          requiresAdmin: true
        },
        children: [
          {
            // Admin CalendarOverview
            name: 'CalendarOverview',
            path: '',
            component: CalendarOverview
          },
          {
            // Admin NewCalendar
            name: 'NewCalendar',
            path: 'new',
            component: NewCalendar
          },
          {
            // Admin CalendarDetails
            name: 'CalendarDetails',
            path: 'details/:id',
            component: CalendarDetails
          },
          {
            // Admin CalendarDetails NewEvent
            name: 'NewEvent',
            path: 'new-event',
            component: NewEvent
          }
        ]
      },
      {
        // Legal
        name: 'AdminLegalContainer',
        path: '/legal',
        component: LegalContainer,
        children: [
          {
            // Auth-Child imprint
            name: 'AdminImprint',
            path: 'impressum',
            component: Imprint
          },
          {
            // Auth-Child imprint
            name: 'AdminGDPR',
            path: 'datenschutz',
            component: GDPR
          }
        ],
        meta: {
          requiresAuth: false
        }
      }
    ]
  },
  {
    // Guardian
    name: 'Guardian',
    path: '/guardian',
    component: GuardianContainer,
    meta: {
      requiresAuth: true,
      requiresAdmin: false
    },
    children: [
      // Guardian-Overview
      {
        name: 'GuardianOverview',
        path: '',
        component: GuardianOverview
      },
      // Guardian Report Submenu
      {
        name: 'ReportSubMenu',
        path: 'report-selection',
        component: ReportSubMenu
      },
      // Guardian-Proof
      {
        name: 'ProofView',
        path: 'proof',
        component: ProofView
      },
      // Guardian-Report
      {
        name: 'ReportView',
        path: 'report',
        component: ReportView
      },
      // Guardian-Report
      {
        name: 'SpecialReportView',
        path: 'special-report',
        component: SpecialReportView
      },
      // Guardian-Edit-Report
      {
        name: 'EditReportView',
        path: 'edit-report/:id',
        component: EditReportView
      },
      // Guardian-Edit-Special-Report
      {
        name: 'EditSpecialReportView',
        path: 'edit-special-report/:id',
        component: EditSpecialReportView
      },
      // Guardian-Sharebox GuardianShareboxOverview
      {
        name: 'GuardianShareboxOverview',
        path: 'sharebox',
        component: GuardianShareboxOverview
      },
      // Guardian-Flagged-Reports
      {
        name: 'GuardianFlaggedOverview',
        path: 'flagged-reports',
        component: GuardianFlaggedOverview
      },
      // Guardian-Flagged-Repors-Details
      {
        name: 'GuardianFlaggedDetails',
        path: 'flagged-reports/:id',
        component: GuardianFlaggedDetails
      },
      // Guardian-GuardianCalendarOverview
      {
        name: 'GuardianCalendarOverview',
        path: 'calendar',
        component: GuardianCalendarOverview
      },
      {
        // Legal
        name: 'GuardianLegalContainer',
        path: '/legal',
        component: LegalContainer,
        children: [
          {
            // Auth-Child imprint
            name: 'GuardianImprint',
            path: 'impressum',
            component: Imprint
          },
          {
            // Auth-Child imprint
            name: 'GuardianGDPR',
            path: 'datenschutz',
            component: GDPR
          }
        ],
        meta: {
          requiresAuth: false
        }
      }
    ]
  }
]

// Create the router with history mode
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'active',
  linkExactActiveClass: 'exact-active',
  routes
})

// Do Authentication processing, before the router resolves
router.beforeResolve((to, _, next) => {
  // Check if user needs to be authenticated.
  try {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      // If need authentication, get current auth state from backend.
      currentAuthenticatedUser()
        .then((user) => {
          const userGroup =
            user.signInUserSession.accessToken.payload['cognito:groups'][0]
          // If the user is admin let him pass to every page
          if (userGroup.includes('Admin')) {
            next()
            // If the user is guardian, check if the current page is for guardians
          } else if (userGroup.includes('Guardian')) {
            if (to.matched.some((record) => record.meta.requiresAdmin)) {
              next({ name: 'GuardianOverview' })
            } else {
              next()
            }
          } else {
            next({ name: 'Login' })
          }
        })
        // If user is unauthenticated, bring him also back to login, whatever he want to access in the authenticated area.
        .catch(() => {
          next({ name: 'Login' })
        })
      // If the area is reachable for unauthenticated users, bring them always to the site, whatever state they have.
    } else {
      next()
    }
    // If any error occurs, bring the user also back to the login page.
  } catch {
    next({ name: 'Login' })
  }
})

// Veraltete Lazy-Chunks nach einem Deploy (PWA / Service-Worker-Cache) führen
// beim Navigieren zu "Failed to fetch dynamically imported module". In dem Fall
// einmalig hart neu laden, damit der aktualisierte Service Worker die neuen
// Chunks ausliefert. Der sessionStorage-Schutz verhindert eine Reload-Schleife.
router.onError((error, to) => {
  const message = error?.message || ''
  const isChunkError =
    /dynamically imported module|Importing a module script failed|Failed to fetch|error loading dynamically imported module/i.test(
      message
    )
  if (!isChunkError) return

  const reloadKey = 'sayas-chunk-reload'
  if (sessionStorage.getItem(reloadKey)) return
  sessionStorage.setItem(reloadKey, '1')
  if (to?.fullPath) {
    window.location.assign(to.fullPath)
  } else {
    window.location.reload()
  }
})

// Erfolgreiche Navigation -> Reload-Schutz wieder freigeben.
router.afterEach(() => {
  sessionStorage.removeItem('sayas-chunk-reload')
})

// Export the router
export default router
