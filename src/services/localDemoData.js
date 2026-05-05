const currentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 8).toISOString()
const previousMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 12).toISOString()

const guardians = [
  {
    id: 'demo-guardian-1',
    name: 'Mira',
    familyName: 'Demir',
    email: 'mira.demir@example.test',
    phone: '+49 30 000000',
    professional: true,
    timeSheetDate: currentMonth,
    careAssignments: {
      items: []
    }
  },
  {
    id: 'demo-guardian-2',
    name: 'Jonas',
    familyName: 'Keller',
    email: 'jonas.keller@example.test',
    phone: '',
    professional: false,
    timeSheetDate: previousMonth,
    careAssignments: {
      items: []
    }
  }
]

const carriers = [
  {
    id: 'demo-carrier-1',
    name: 'Impuls Demo Träger',
    shortName: 'Demo Träger',
    street: 'Musterstraße',
    houseNumber: '12',
    postalCode: '10115',
    city: 'Berlin',
    phone: '+49 30 111111',
    email: 'traeger@example.test',
    carrierContacts: {
      items: []
    },
    children: {
      items: []
    }
  }
]

const carrierContacts = [
  {
    id: 'demo-contact-1',
    name: 'Samira',
    familyName: 'Yilmaz',
    email: 'samira.yilmaz@example.test',
    phone: '+49 30 222222',
    carrier: carriers[0]
  }
]

const children = [
  {
    id: 'demo-child-1',
    name: 'Lina',
    familyName: 'Beispiel',
    dateOfBirth: '2016-04-18',
    dateOfRegistration: '2025-09-01',
    weeklyHours: 12,
    weeklyHoursByPlan: 12,
    recordNumber: 'DEMO-001',
    dataComplete: true,
    school: 'Demo Schule',
    archiveStatus: 'unarchived',
    carrier: carriers[0],
    carrierContact: carrierContacts[0],
    careAssignments: {
      items: [
        {
          id: 'demo-care-1',
          guardian: guardians[0],
          guardianCareAssignmentsId: guardians[0].id,
          childCareAssignmentsId: 'demo-child-1'
        }
      ]
    }
  }
]

const calendars = [
  {
    id: 'demo-calendar-care',
    title: 'Betreuung',
    description: 'Klienten und Mitarbeitende',
    color: '#10b981',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    participations: {
      items: []
    }
  },
  {
    id: 'demo-calendar-admin',
    title: 'Verwaltung',
    description: 'Abrechnung, Fristen und Rückfragen',
    color: '#0ea5e9',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    participations: {
      items: []
    }
  }
]

const events = [
  {
    id: 'demo-event-1',
    title: 'Lina Beispiel',
    description: 'Schulbegleitung',
    link: '',
    calendarEventsId: 'demo-calendar-care',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 9, 0).toISOString(),
    durationInHours: 2,
    active: 'active'
  },
  {
    id: 'demo-event-2',
    title: 'Max Muster',
    description: 'Regeltermin',
    link: '',
    calendarEventsId: 'demo-calendar-care',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 11, 30).toISOString(),
    durationInHours: 1.5,
    active: 'active'
  }
]

guardians[0].careAssignments.items = [
  {
    id: 'demo-care-1',
    child: children[0],
    childCareAssignmentsId: children[0].id,
    guardianCareAssignmentsId: guardians[0].id
  }
]
guardians[0].children = {
  items: children
}
guardians[1].children = {
  items: []
}

carriers[0].children.items = children
carriers[0].carrierContacts.items = carrierContacts

const users = [
  {
    Username: 'demo@impuls.local',
    Enabled: true,
    UserCreateDate: new Date().toISOString(),
    Attributes: [
      { Name: 'email', Value: 'demo@impuls.local' },
      { Name: 'given_name', Value: 'Demo' },
      { Name: 'family_name', Value: 'Admin' }
    ]
  }
]

const emptyConnection = {
  items: [],
  nextToken: null
}

function demoId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`
}

function matchesSearch(item, searchValue) {
  if (!searchValue) {
    return true
  }

  const value = searchValue.toLowerCase()
  return [item.name, item.familyName, item.email]
    .filter(Boolean)
    .some((entry) => entry.toLowerCase().includes(value))
}

export function listGuardians(payload = {}) {
  const items = guardians.filter((guardian) => matchesSearch(guardian, payload.filter))
  return {
    items,
    nextToken: null
  }
}

export function listGuardiansSelection(payload = {}) {
  return listGuardians(payload)
}

export function countGuardians(payload = {}) {
  return guardians.filter((guardian) => matchesSearch(guardian, payload.searchValue)).length
}

export function listCarriers(payload = {}) {
  const items = carriers.filter((carrier) => matchesSearch(carrier, payload.filter))
  return {
    items,
    nextToken: null
  }
}

export function listCarrierContacts(payload = {}) {
  const items = carrierContacts.filter((contact) => matchesSearch(contact, payload.filter))
  return {
    items,
    nextToken: null
  }
}

export function listChildren(payload = {}) {
  const items = children.filter((child) => matchesSearch(child, payload.filter))
  return {
    items,
    nextToken: null
  }
}

export function countChildren(payload = {}) {
  return children.filter((child) => matchesSearch(child, payload.searchValue)).length
}

export function getGuardian(id) {
  return guardians.find((guardian) => guardian.id === id) || guardians[0]
}

export function getCarrier(id) {
  return carriers.find((carrier) => carrier.id === id) || carriers[0]
}

export function getCarrierContact(id) {
  return carrierContacts.find((contact) => contact.id === id) || carrierContacts[0]
}

export function getChild(id) {
  return children.find((child) => child.id === id) || children[0]
}

export function listUsers() {
  return {
    Users: users,
    NextToken: undefined
  }
}

export function createUser({ attributes, groupname }) {
  const email = attributes.email
  const createdUser = {
    Username: email,
    Enabled: true,
    UserCreateDate: new Date().toISOString(),
    Attributes: [
      { Name: 'email', Value: email },
      { Name: 'given_name', Value: attributes.name },
      { Name: 'family_name', Value: attributes.familyName },
      { Name: 'phone_number', Value: attributes.phone || '' }
    ]
  }

  users.unshift(createdUser)

  if (groupname === 'guardian') {
    const guardian = {
      id: demoId('demo-guardian'),
      name: attributes.name,
      familyName: attributes.familyName,
      email,
      phone: attributes.phone || '',
      professional: attributes.professional !== 'Nicht-Fachkraft',
      timeSheetDate: null,
      careAssignments: {
        items: []
      },
      children: {
        items: []
      }
    }
    guardians.unshift(guardian)
  }

  return {
    Username: email,
    User: createdUser
  }
}

export function createCarrier(payload) {
  const carrier = {
    id: demoId('demo-carrier'),
    ...payload,
    carrierContacts: {
      items: []
    },
    children: {
      items: []
    }
  }

  carriers.unshift(carrier)

  return {
    data: {
      createCarrier: carrier
    }
  }
}

export function createCarrierContact(payload) {
  const carrier = payload.carrier || carriers[0]
  const contact = {
    id: demoId('demo-contact'),
    name: payload.name,
    familyName: payload.familyName,
    email: payload.email,
    phone: payload.phone,
    carrier
  }

  carrierContacts.unshift(contact)
  if (carrier?.carrierContacts?.items) {
    carrier.carrierContacts.items.unshift(contact)
  }

  return {
    data: {
      createCarrierContact: contact
    }
  }
}

export function createChild(payload) {
  const carrierContact = payload.carrierContact || carrierContacts[0]
  const carrier = carrierContact?.carrier || carriers[0]
  const child = {
    id: demoId('demo-child'),
    name: payload.name,
    familyName: payload.familyName,
    dateOfBirth: payload.dateOfBirth,
    dateOfRegistration: payload.dateOfRegistration,
    weeklyHours: payload.weeklyHours,
    weeklyHoursByPlan: payload.weeklyHoursByPlan,
    recordNumber: payload.recordNumber,
    dataComplete: payload.dataComplete ?? true,
    school: payload.school,
    archiveStatus: 'unarchived',
    mother: {
      name: payload.motherName,
      familyName: payload.motherFamilyName,
      phone: payload.motherPhone,
      email: payload.motherEmail
    },
    father: {
      name: payload.fatherName,
      familyName: payload.fatherFamilyName,
      phone: payload.fatherPhone,
      email: payload.fatherEmail
    },
    schoolContact: {
      name: payload.schoolContactName,
      familyName: payload.schoolContactFamilyName,
      phone: payload.schoolContactPhone,
      email: payload.schoolContactEmail
    },
    carrier,
    carrierContact,
    careAssignments: {
      items: []
    }
  }

  children.unshift(child)
  if (carrier?.children?.items) {
    carrier.children.items.unshift(child)
  }

  return {
    data: {
      createChild: child
    }
  }
}

export function createInvoice(payload) {
  return {
    data: {
      createInvoice: {
        id: demoId('demo-invoice'),
        status: 'created',
        invoiceYear: payload.invoiceYear,
        invoiceMonth: payload.invoiceMonth,
        createdAt: new Date().toISOString()
      }
    }
  }
}

export function listDocuments() {
  return emptyConnection
}

export function listDailyReports() {
  return []
}

export function listTimesheets() {
  return emptyConnection
}

export function listFiles() {
  return []
}

export function listCalendars() {
  return {
    items: calendars,
    nextToken: null
  }
}

export function createCalendar(payload) {
  const calendar = {
    id: demoId('demo-calendar'),
    title: payload.title,
    description: payload.description,
    color: payload.color,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    participations: {
      items: []
    }
  }

  calendars.unshift(calendar)

  return {
    data: {
      createCalendar: calendar
    }
  }
}

export function getCalendar(id) {
  return calendars.find((calendar) => calendar.id === id) || null
}

export function listEvents() {
  return events
}

export function listEventsByCalendar(id) {
  return events.filter((event) => event.calendarEventsId === id)
}

export function createEvent(payload) {
  const event = {
    id: demoId('demo-event'),
    ...payload
  }

  events.unshift(event)

  return {
    data: {
      createEvent: event
    }
  }
}

export function listParticipationsByCalendar() {
  return {
    data: {
      participationByCalendar: {
        items: []
      }
    }
  }
}

export function closestEvent() {
  return listEvents()[0]
}

export function listNotes() {
  return emptyConnection
}

export function unreadNotesStatus() {
  return {
    status: false
  }
}
