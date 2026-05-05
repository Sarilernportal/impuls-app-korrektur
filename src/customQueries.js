export const getGuardianMini = /* GraphQL */ `
  query GetGuardian($id: ID!) {
    getGuardian(id: $id) {
      id
      name
      familyName
      email
      personalNumber
      phone
      professional
      owner
      timeSheetDate
      archiveStatus
      gender
      qualification
      careAssignments {
        items {
          id
          guardian {
            id
            name
            familyName
            email
            personalNumber
            phone
            professional
            owner
            timeSheetDate
            archiveStatus
            createdAt
            updatedAt
            __typename
          }
          guardianCareAssignmentsId
          child {
            id
            name
            familyName
            dateOfBirth
            dateOfRegistration
            weeklyHours
            weeklyHoursByPlan
            recordNumber
            dataComplete
            school
            archiveStatus
            createdAt
            updatedAt
            carrierContactChildrenId
            __typename
          }
          childCareAssignmentsId
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const listGuardiansOverviewList = /* GraphQL */ `
  query ListGuardianOverviewList(
    $archiveStatus: ArchiveStatus!
    $sortDirection: ModelSortDirection
    $filter: ModelGuardianFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGuardianByState(
      archiveStatus: $archiveStatus
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        familyName
        email
        personalNumber
        phone
        professional
        owner
        careAssignments {
          items {
            id
            guardianCareAssignmentsId
            childCareAssignmentsId
            child {
              id
              name
              familyName
              archiveStatus
              createdAt
              updatedAt
              __typename
          }
            createdAt
            updatedAt
            __typename
          }
          nextToken
          __typename
        }
        timeSheetDate
        archiveStatus
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;

export const listGuardiansSelection = /* GraphQL */ `
  query ListGuardiansSelection(
    $archiveStatus: ArchiveStatus!
    $sortDirection: ModelSortDirection
    $filter: ModelGuardianFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGuardianByState(
      archiveStatus: $archiveStatus
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        familyName
        email
        phone
        archiveStatus
        __typename
      }
      nextToken
      __typename
    }
  }
`;

export const listCarriersOverviewList = /* GraphQL */ `
  query ListCarriersOverviewList(
    $filter: ModelCarrierFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCarriers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        shortName
        street
        addressExtra
        houseNumber
        postalCode
        city
        poBox
        phone
        useBillingAddress
        billingName
        billingStreet
        billingAddressExtra
        billingHouseNumber
        billingPostalCode
        billingCity
        billingPoBox
        carrierContacts {
          items {
            id
            name
            familyName
            phone
            email
            createdAt
            updatedAt
            carrierCarrierContactsId
            __typename
          }
          nextToken
          __typename
        }
        email
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;

export const fetchCarrierDetail = /* GraphQL */ `
  query FetchCarrierDetail($id: ID!) {
    getCarrier(id: $id) {
      id
      name
      shortName
      street
      addressExtra
      houseNumber
      postalCode
      city
      poBox
      phone
      useBillingAddress
      billingName
      billingStreet
      billingAddressExtra
      billingHouseNumber
      billingPostalCode
      billingCity
      billingPoBox
      carrierContacts {
        items {
          id
          name
          familyName
          phone
          email
          children {
            nextToken
            __typename
          }
          carrier {
            id
            name
            shortName
            street
            addressExtra
            houseNumber
            postalCode
            city
            poBox
            phone
            useBillingAddress
            billingName
            billingStreet
            billingAddressExtra
            billingHouseNumber
            billingPostalCode
            billingCity
            billingPoBox
            email
            allowAutoInvoice
            createdAt
            updatedAt
            __typename
          }
          createdAt
          updatedAt
          carrierCarrierContactsId
          __typename
        }
        nextToken
        __typename
      }
      email
      allowAutoInvoice
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const fetchCarrierContactDetail = /* GraphQL */ `
  query FetchCarrierContactDetail($id: ID!) {
    getCarrierContact(id: $id) {
      id
      name
      familyName
      phone
      email
      children {
        items {
          id
          name
          familyName
          dateOfBirth
          dateOfRegistration
          weeklyHours
          weeklyHoursByPlan
          recordNumber
          dataComplete
          carrierContact {
            id
            name
            familyName
            phone
            email
            createdAt
            updatedAt
            carrierCarrierContactsId
            __typename
          }
          archiveStatus
          createdAt
          updatedAt
          carrierContactChildrenId
          __typename
        }
        nextToken
        __typename
      }
      carrier {
        id
        name
        shortName
        street
        addressExtra
        houseNumber
        postalCode
        city
        poBox
        phone
        useBillingAddress
        billingName
        billingStreet
        billingAddressExtra
        billingHouseNumber
        billingPostalCode
        billingCity
        billingPoBox
        carrierContacts {
          items {
            id
            name
            familyName
            phone
            email
            createdAt
            updatedAt
            carrierCarrierContactsId
            __typename
          }
          nextToken
          __typename
        }
        email
        allowAutoInvoice
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      carrierCarrierContactsId
      __typename
    }
  }
`;

export const fetchChildDetail = /* GraphQL */ `
  query FetchChildDetail($id: ID!) {
    getChild(id: $id) {
      id
      name
      familyName
      dateOfBirth
      dateOfRegistration
      weeklyHours
      weeklyHoursByPlan
      recordNumber
      dataComplete
      schoolLocation
      carrierContact {
        id
        name
        familyName
        phone
        email
        children {
          items {
            id
            name
            familyName
            dateOfBirth
            dateOfRegistration
            weeklyHours
            weeklyHoursByPlan
            recordNumber
            dataComplete
            school
            archiveStatus
            createdAt
            updatedAt
            carrierContactChildrenId
            __typename
          }
          nextToken
          __typename
        }
        carrier {
          id
          name
          shortName
          street
          addressExtra
          houseNumber
          postalCode
          city
          poBox
          phone
          useBillingAddress
          billingName
          billingStreet
          billingAddressExtra
          billingHouseNumber
          billingPostalCode
          billingCity
          billingPoBox
          carrierContacts {
            nextToken
            __typename
          }
          email
          allowAutoInvoice
          createdAt
          updatedAt
          __typename
        }
        createdAt
        updatedAt
        carrierCarrierContactsId
        __typename
      }
      careAssignments {
        items {
          id
          guardian {
            id
            name
            familyName
            email
            personalNumber
            phone
            professional
            owner
            timeSheetDate
            archiveStatus
            createdAt
            updatedAt
            __typename
          }
          guardianCareAssignmentsId
          child {
            id
            name
            familyName
            dateOfBirth
            dateOfRegistration
            weeklyHours
            weeklyHoursByPlan
            recordNumber
            dataComplete
            school
            archiveStatus
            createdAt
            updatedAt
            carrierContactChildrenId
            __typename
          }
          childCareAssignmentsId
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      school
      mother {
        name
        familyName
        phone
        primaryContact
        email
        __typename
      }
      father {
        name
        familyName
        phone
        email
        primaryContact
        __typename
      }
      schoolContact {
        name
        familyName
        phone
        gender
        email
        function
        __typename
      }
      archiveStatus
      createdAt
      updatedAt
      carrierContactChildrenId
      __typename
    }
  }
`;

export const listCarrierContactsSelection = /* GraphQL */ `
  query ListCarrierContactsSelection(
    $filter: ModelCarrierContactFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCarrierContacts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        familyName
        phone
        email
        createdAt
        updatedAt
        carrierCarrierContactsId
        __typename
      }
      nextToken
      __typename
    }
  }
`;

export const listChildrenOverviewList = /* GraphQL */ `
  query ListChildrenOverviewList(
    $archiveStatus: ArchiveStatus!
    $sortDirection: ModelSortDirection
    $filter: ModelChildFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listChildrenByArchiveState(
      archiveStatus: $archiveStatus
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        familyName
        dateOfBirth
        dateOfRegistration
        weeklyHours
        weeklyHoursByPlan
        recordNumber
        dataComplete
        carrierContact {
          id
          name
          familyName
          phone
          email
          carrier {
            id
            name
            shortName
            phone
            email
            createdAt
            updatedAt
            __typename
          }
          createdAt
          updatedAt
          carrierCarrierContactsId
          __typename
        }
        careAssignments {
          items {
            id
            guardianCareAssignmentsId
            childCareAssignmentsId
            guardian {
              id
              name
              familyName
              email
              personalNumber
              phone
              professional
              owner
              timeSheetDate
              archiveStatus
              createdAt
              updatedAt
              __typename
            }
            createdAt
            updatedAt
            __typename
          }
          nextToken
          __typename
        }
        school
        mother {
          name
          familyName
          phone
          email
          __typename
        }
        father {
          name
          familyName
          phone
          email
          __typename
        }
        schoolContact {
          name
          familyName
          phone
          email
          __typename
        }
        archiveStatus
        createdAt
        updatedAt
        carrierContactChildrenId
        __typename
      }
      nextToken
      __typename
    }
  }
`;

export const fetchNachweise = /* GraphQL */ `
  query FetchNachweise(
    $type: String!
    $documentDate: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTimeSheetsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    timeSheetsByType(
      type: $type
      documentDate: $documentDate
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        key
        child {
          id
          name
          familyName
          dateOfBirth
          dateOfRegistration
          weeklyHours
          weeklyHoursByPlan
          recordNumber
          dataComplete
          archiveStatus
          createdAt
          updatedAt
          carrierContactChildrenId
          __typename
        }
        guardian {
          id
          name
          familyName
          email
          personalNumber
          phone
          professional
          owner
          createdAt
          updatedAt
          __typename
        }
        guardianTimeSheetsId
        carrier {
          id
          name
          shortName
          street
          addressExtra
          houseNumber
          postalCode
          city
          poBox
          phone
          useBillingAddress
          billingName
          billingStreet
          billingAddressExtra
          billingHouseNumber
          billingPostalCode
          billingCity
          billingPoBox
          email
          allowAutoInvoice
          createdAt
          updatedAt
          __typename
        }
        dailyReport {
          items {
            id
            key
            documentDate
            documentEndDate
            documentStatus
            hourFrom
            hourTo
            minuteFrom
            minuteTo
            sick
            sickOnTime
            substitute
            homework
            report
            exchange
            parentreport
            mood
            reportActivity
            flag
            flagText
            flagDaySelection
            retrospectively
            reviseDate
            createdAt
            owner
            reportType
            type
            updatedAt
            carrierDailyReportsId
            timeSheetsDailyReportId
            invoicesDailyReportId
            __typename
          }
          nextToken
          __typename
        }
        documentDate
        transmitted
        charged
        reportType
        flag
        reviseDate
        createdAt
        owner
        type
        updatedAt
        carrierTimeSheetsId
        childTimeSheetsId
        __typename
      }
      nextToken
      __typename
    }
  }
`;

export const fetchDokumentationen = /* GraphQL */ `
  query FetchDokumentationen(
    $type: String!
    $documentDate: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelDailyReportFilterInput
    $limit: Int
    $nextToken: String
  ) {
    dailyReportsByType(
      type: $type
      documentDate: $documentDate
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        key
        child {
          id
          name
          familyName
          dateOfBirth
          dateOfRegistration
          weeklyHours
          weeklyHoursByPlan
          recordNumber
          dataComplete
          archiveStatus
          createdAt
          updatedAt
          carrierContactChildrenId
          __typename
        }
        childDailyReportId
        guardian {
          id
          name
          familyName
          email
          personalNumber
          phone
          professional
          owner
          timeSheetDate
          archiveStatus
          createdAt
          updatedAt
          __typename
        }
        guardianDailyReportId
        timeSheets {
          id
          key
          child {
            id
            name
            familyName
            dateOfBirth
            dateOfRegistration
            weeklyHours
            weeklyHoursByPlan
            recordNumber
            dataComplete
            school
            archiveStatus
            createdAt
            updatedAt
            carrierContactChildrenId
            __typename
          }
          guardianTimeSheetsId
          documentDate
          transmitted
          charged
          reportType
          flag
          reviseDate
          createdAt
          owner
          type
          updatedAt
          carrierTimeSheetsId
          childTimeSheetsId
          __typename
        }
        invoices {
          id
          key
          internalNumber
          __typename
        }
        documentDate
        documentEndDate
        documentStatus
        hourFrom
        hourTo
        minuteFrom
        minuteTo
        sick
        sickOnTime
        substitute
        homework
        report
        exchange
        parentreport
        mood
        reportActivity
        flag
        flagText
        flagDaySelection
        retrospectively
        reviseDate
        createdAt
        owner
        reportType
        type
        updatedAt
        carrierDailyReportsId
        timeSheetsDailyReportId
        invoicesDailyReportId
        __typename
      }
      nextToken
      __typename
    }
  }
`;

export const fetchEventsByActive = /* GraphQL */ `
  query FetchEventsByActive(
    $active: EventStatus!
    $startDate: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelEventFilterInput
    $limit: Int
    $nextToken: String
  ) {
    eventsByActive(
      active: $active
      startDate: $startDate
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        title
        description
        link
        calendarEventsId
        startDate
        durationInHours
        active
        calendar {
          id
          title
          description
          color
          events {
            nextToken
            __typename
          }
          participations {
            nextToken
            __typename
          }
          createdAt
          updatedAt
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;

export const listCalendars = /* GraphQL */ `
  query ListCalendars(
    $filter: ModelCalendarFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCalendars(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        description
        color
        events {
          items {
            id
            title
            description
            link
            calendarEventsId
            startDate
            durationInHours
            active
            createdAt
            updatedAt
            __typename
          }
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;

export const getInvoicesOVerview = /* GraphQL */ `
  query InvoicesByType(
    $type: String!
    $documentDate: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelInvoicesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    invoicesByType(
      type: $type
      documentDate: $documentDate
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        key
        internalNumber
        child {
          id
          name
          familyName
          createdAt
          updatedAt
          __typename
        }
        guardian {
          id
          name
          familyName
          createdAt
          updatedAt
          __typename
        }
        carrier {
          id
          name
          createdAt
          updatedAt
          __typename
        }
        dailyReport {
          items {
            id
            key
            childDailyReportId
            guardianDailyReportId
            documentDate
            documentEndDate
            documentStatus
            hourFrom
            hourTo
            minuteFrom
            minuteTo
            sick
            sickOnTime
            substitute
            report
            exchange
            parentreport
            mood
            reportActivity
            flag
            flagText
            flagDaySelection
            retrospectively
            reviseDate
            createdAt
            owner
            reportType
            type
            updatedAt
            __typename
          }
          nextToken
          __typename
        }
        documentDate
        transmitted
        reviseDate
        createdAt
        type
        updatedAt
        guardianInvoicesId
        carrierInvoicesId
        childInvoicesId
        __typename
      }
      nextToken
      __typename
    }
  }
`;

export const getInvoices = /* GraphQL */ `
  query GetInvoices($id: ID!) {
    getInvoices(id: $id) {
      id
      key
      internalNumber
      child {
        id
        name
        familyName
        dateOfBirth
        dateOfRegistration
        weeklyHours
        weeklyHoursByPlan
        recordNumber
        dataComplete
        carrierContact {
          id
          name
          familyName
          phone
          email
          children {
            nextToken
            __typename
          }
          carrier {
            id
            name
            shortName
            street
            addressExtra
            houseNumber
            postalCode
            city
            phone
            useBillingAddress
            billingName
            billingStreet
            billingAddressExtra
            billingHouseNumber
            billingPostalCode
            billingCity
            email
            allowAutoInvoice
            createdAt
            updatedAt
            __typename
          }
          createdAt
          updatedAt
          carrierCarrierContactsId
          __typename
        }
        careAssignments {
          items {
            id
            guardianCareAssignmentsId
            childCareAssignmentsId
            createdAt
            updatedAt
            __typename
          }
          nextToken
          __typename
        }
        dailyReport {
          items {
            id
            key
            childDailyReportId
            guardianDailyReportId
            documentDate
            documentEndDate
            documentStatus
            hourFrom
            hourTo
            minuteFrom
            minuteTo
            sick
            sickOnTime
            substitute
            homework
            report
            exchange
            parentreport
            mood
            reportActivity
            flag
            flagText
            flagDaySelection
            retrospectively
            reviseDate
            createdAt
            owner
            reportType
            type
            updatedAt
            carrierDailyReportsId
            timeSheetsDailyReportId
            invoicesDailyReportId
            __typename
          }
          nextToken
          __typename
        }
        timeSheets {
          items {
            id
            key
            guardianTimeSheetsId
            documentDate
            transmitted
            charged
            reportType
            flag
            reviseDate
            createdAt
            owner
            type
            updatedAt
            carrierTimeSheetsId
            childTimeSheetsId
            __typename
          }
          nextToken
          __typename
        }
        invoices {
          items {
            id
            key
            internalNumber
            documentDate
            transmitted
            charged
            reviseDate
            createdAt
            type
            updatedAt
            guardianInvoicesId
            carrierInvoicesId
            childInvoicesId
            __typename
          }
          nextToken
          __typename
        }
        school
        mother {
          name
          familyName
          phone
          email
          __typename
        }
        father {
          name
          familyName
          phone
          email
          __typename
        }
        schoolContact {
          name
          familyName
          phone
          email
          __typename
        }
        archiveStatus
        createdAt
        updatedAt
        carrierContactChildrenId
        __typename
      }
      guardian {
        id
        name
        familyName
        email
        personalNumber
        phone
        professional
        owner
        careAssignments {
          items {
            id
            guardianCareAssignmentsId
            childCareAssignmentsId
            createdAt
            updatedAt
            __typename
          }
          nextToken
          __typename
        }
        dailyReport {
          items {
            id
            key
            childDailyReportId
            guardianDailyReportId
            documentDate
            documentEndDate
            documentStatus
            hourFrom
            hourTo
            minuteFrom
            minuteTo
            sick
            sickOnTime
            substitute
            homework
            report
            exchange
            parentreport
            mood
            reportActivity
            flag
            flagText
            flagDaySelection
            retrospectively
            reviseDate
            createdAt
            owner
            reportType
            type
            updatedAt
            carrierDailyReportsId
            timeSheetsDailyReportId
            invoicesDailyReportId
            __typename
          }
          nextToken
          __typename
        }
        timeSheets {
          items {
            id
            key
            guardianTimeSheetsId
            documentDate
            transmitted
            charged
            reportType
            flag
            reviseDate
            createdAt
            owner
            type
            updatedAt
            carrierTimeSheetsId
            childTimeSheetsId
            __typename
          }
          nextToken
          __typename
        }
        invoices {
          items {
            id
            key
            internalNumber
            documentDate
            transmitted
            charged
            reviseDate
            createdAt
            type
            updatedAt
            guardianInvoicesId
            carrierInvoicesId
            childInvoicesId
            __typename
          }
          nextToken
          __typename
        }
        timeSheetDate
        archiveStatus
        createdAt
        updatedAt
        __typename
      }
      carrier {
        id
        name
        shortName
        street
        addressExtra
        houseNumber
        postalCode
        city
        phone
        useBillingAddress
        billingName
        billingStreet
        billingAddressExtra
        billingHouseNumber
        billingPostalCode
        billingCity
        carrierContacts {
          items {
            id
            name
            familyName
            phone
            email
            createdAt
            updatedAt
            carrierCarrierContactsId
            __typename
          }
          nextToken
          __typename
        }
        dailyReports {
          items {
            id
            key
            childDailyReportId
            guardianDailyReportId
            documentDate
            documentEndDate
            documentStatus
            hourFrom
            hourTo
            minuteFrom
            minuteTo
            sick
            sickOnTime
            substitute
            homework
            report
            exchange
            parentreport
            mood
            reportActivity
            flag
            flagText
            flagDaySelection
            retrospectively
            reviseDate
            createdAt
            owner
            reportType
            type
            updatedAt
            carrierDailyReportsId
            timeSheetsDailyReportId
            invoicesDailyReportId
            __typename
          }
          nextToken
          __typename
        }
        timeSheets {
          items {
            id
            key
            guardianTimeSheetsId
            documentDate
            transmitted
            charged
            reportType
            flag
            reviseDate
            createdAt
            owner
            type
            updatedAt
            carrierTimeSheetsId
            childTimeSheetsId
            __typename
          }
          nextToken
          __typename
        }
        invoices {
          items {
            id
            key
            internalNumber
            documentDate
            transmitted
            charged
            reviseDate
            createdAt
            type
            updatedAt
            guardianInvoicesId
            carrierInvoicesId
            childInvoicesId
            __typename
          }
          nextToken
          __typename
        }
        email
        allowAutoInvoice
        createdAt
        updatedAt
        __typename
      }
      dailyReport {
        items {
          id
          key
          child {
            id
            name
            familyName
            dateOfBirth
            dateOfRegistration
            weeklyHours
            weeklyHoursByPlan
            recordNumber
            dataComplete
            school
            archiveStatus
            createdAt
            updatedAt
            carrierContactChildrenId
            __typename
          }
          childDailyReportId
          guardian {
            id
            name
            familyName
            email
            personalNumber
            phone
            professional
            owner
            timeSheetDate
            archiveStatus
            createdAt
            updatedAt
            __typename
          }
          guardianDailyReportId
          carrier {
            id
            name
            shortName
            street
            addressExtra
            houseNumber
            postalCode
            city
            phone
            useBillingAddress
            billingName
            billingStreet
            billingAddressExtra
            billingHouseNumber
            billingPostalCode
            billingCity
            email
            allowAutoInvoice
            createdAt
            updatedAt
            __typename
          }
          timeSheets {
            id
            key
            guardianTimeSheetsId
            documentDate
            transmitted
            charged
            reportType
            flag
            reviseDate
            createdAt
            owner
            type
            updatedAt
            carrierTimeSheetsId
            childTimeSheetsId
            __typename
          }
          invoices {
            id
            key
            internalNumber
            documentDate
            transmitted
            charged
            reviseDate
            createdAt
            type
            updatedAt
            guardianInvoicesId
            carrierInvoicesId
            childInvoicesId
            __typename
          }
          documentDate
          documentEndDate
          documentStatus
          hourFrom
          hourTo
          minuteFrom
          minuteTo
          sick
          sickOnTime
          substitute
          homework
          report
          exchange
          parentreport
          mood
          reportActivity
          flag
          flagText
          flagDaySelection
          retrospectively
          reviseDate
          createdAt
          owner
          reportType
          type
          updatedAt
          carrierDailyReportsId
          timeSheetsDailyReportId
          invoicesDailyReportId
          __typename
        }
        nextToken
        __typename
      }
      documentDate
      transmitted
      charged
      reviseDate
      createdAt
      type
      updatedAt
      guardianInvoicesId
      carrierInvoicesId
      childInvoicesId
      __typename
    }
  }
`;
