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
import AuthPage from '@/views/auth/Auth.vue'
import Login from '@/views/auth/Login.vue'
import PasswordForgot from '@/views/auth/PasswordForgot.vue'
import PasswordForgotConfirm from '@/views/auth/PasswordForgotConfirm.vue'
import NewPassword from '@/views/auth/NewPassword.vue'
import ChangePassword from '@/views/auth/ChangePassword.vue'

// Legal
import LegalContainer from '@/views/legal/LegalContainer.vue'
import Imprint from '@/views/legal/Imprint.vue'
import GDPR from '@/views/legal/GDPR.vue'

// Main
// Admin
import AdminContainer from '@/views/main/admin/AdminContainer.vue'
import BillingCenter from '@/views/main/admin/BillingCenter.vue'
//  Admin Children
//  User
import UserContainer from '@/views/main/admin/user/UserContainer.vue'
import UserOverview from '@/views/main/admin/user/UserOverview.vue'
import UserDetails from '@/views/main/admin/user/UserDetails.vue'
import NewUser from '@/views/main/admin/user/NewUser.vue'
// Carrier
import CarrierContainer from '@/views/main/admin/carrier/CarrierContainer.vue'
import CarrierOverview from '@/views/main/admin/carrier/CarrierOverview.vue'
import CarrierDetails from '@/views/main/admin/carrier/CarrierDetails.vue'
import NewCarrier from '@/views/main/admin/carrier/NewCarrier.vue'
// Carrier Contact
import CarrierContactContainer from '@/views/main/admin/carrierContact/CarrierContactContainer.vue'
import CarrierContactOverview from '@/views/main/admin/carrierContact/CarrierContactOverview.vue'
import CarrierContactDetails from '@/views/main/admin/carrierContact/CarrierContactDetails.vue'
import NewCarrierContact from '@/views/main/admin/carrierContact/NewCarrierContact.vue'
// Guardian
import GuardianDetails from '@/views/main/admin/guardian/GuardianDetails.vue'
import GuardianAdminContainer from '@/views/main/admin/guardian/GuardianAdminContainer.vue'
import GuardianAdminOverview from '@/views/main/admin/guardian/GuardianAdminOverview.vue'
// Children
import ChildrenContainer from '@/views/main/admin/children/ChildrenContainer.vue'
import ChildrenOverview from '@/views/main/admin/children/ChildrenOverview.vue'
import ChildDetails from '@/views/main/admin/children/ChildDetails.vue'
import ChildDocumentsOverview from '@/views/main/admin/children/ChildDocumentsOverview.vue'
import NewChild from '@/views/main/admin/children/NewChild.vue'
// Documents
import DocumentsContainer from '@/views/main/admin/documents/DocumentsContainer.vue'
import ReportsOverview from '@/views/main/admin/documents/ReportsOverview.vue'
import ReportDetails from '@/views/main/admin/documents/ReportDetails.vue'
import ReportCreateEmpty from '@/views/main/admin/documents/ReportCreateEmpty.vue'
import TimesheetOverview from '@/views/main/admin/documents/TimesheetOverview.vue'
import TimeSheetDetails from '@/views/main/admin/documents/TimeSheetDetails.vue'
import InvoiceOverview from '@/views/main/admin/documents/InvoiceOverview.vue'
import InvoiceDetails from '@/views/main/admin/documents/InvoiceDetails.vue'
// Sharebox
import ShareboxContainer from '@/views/main/admin/sharebox/ShareboxContainer.vue'
import ShareboxOverview from '@/views/main/admin/sharebox/ShareboxOverview.vue'
import ShareboxUpload from '@/views/main/admin/sharebox/ShareboxUpload.vue'
// Notebox
import NoteboxContainer from '@/views/main/admin/notebox/NoteboxContainer.vue'
import NoteboxOverview from '@/views/main/admin/notebox/NoteboxOverview.vue'
import NoteboxCreateNote from '@/views/main/admin/notebox/NoteboxCreateNote.vue'
// Calendar
import CalendarContainer from '@/views/main/admin/calendar/CalendarContainer.vue'
import CalendarOverview from '@/views/main/admin/calendar/CalendarOverview.vue'
import NewCalendar from '@/views/main/admin/calendar/NewCalendar.vue'
import CalendarDetails from '@/views/main/admin/calendar/CalendarDetails.vue'
import NewEvent from '@/views/main/admin/calendar/NewEvent.vue'

// Guardian
import GuardianContainer from '@/views/main/guardian/GuardianContainer.vue'
import GuardianOverview from '@/views/main/guardian/GuardianOverview.vue'
import ReportSubMenu from '@/views/main/guardian/ReportSubMenu.vue'
import ProofView from '@/views/main/guardian/ProofView.vue'
import ReportView from '@/views/main/guardian/ReportView.vue'
import SpecialReportView from '@/views/main/guardian/SpecialReportView.vue'
import EditReportView from '@/views/main/guardian/EditReportView.vue'
import EditSpecialReportView from '@/views/main/guardian/EditSpecialReportView.vue'
import GuardianShareboxOverview from '@/views/main/guardian/GuardianShareboxOverview.vue'
import GuardianFlaggedOverview from '@/views/main/guardian/GuardianFlaggedOverview.vue'
import GuardianFlaggedDetails from '@/views/main/guardian/GuardianFlaggedDetails.vue'
import GuardianCalendarOverview from '@/views/main/guardian/GuardianCalendarOverview.vue'

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

// Export the router
export default router
