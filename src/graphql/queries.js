/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getGuardian = /* GraphQL */ `
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
      timeSheets {
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
            phone
            useBillingAddress
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
          dailyReport {
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
      invoices {
        items {
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
            school
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
          dailyReport {
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
        nextToken
        __typename
      }
      timeSheetDate
      archiveStatus
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listGuardians = /* GraphQL */ `
  query ListGuardians(
    $filter: ModelGuardianFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGuardians(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
      nextToken
      __typename
    }
  }
`;
export const listGuardianByState = /* GraphQL */ `
  query ListGuardianByState(
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
      nextToken
      __typename
    }
  }
`;
export const getCarrier = /* GraphQL */ `
  query GetCarrier($id: ID!) {
    getCarrier(id: $id) {
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
        nextToken
        __typename
      }
      dailyReports {
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
      timeSheets {
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
            phone
            useBillingAddress
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
          dailyReport {
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
      invoices {
        items {
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
            school
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
          dailyReport {
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
export const listCarriers = /* GraphQL */ `
  query ListCarriers(
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
        phone
        useBillingAddress
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
      nextToken
      __typename
    }
  }
`;
export const getCarrierContact = /* GraphQL */ `
  query GetCarrierContact($id: ID!) {
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
          careAssignments {
            nextToken
            __typename
          }
          dailyReport {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
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
      createdAt
      updatedAt
      carrierCarrierContactsId
      __typename
    }
  }
`;
export const listCarrierContacts = /* GraphQL */ `
  query ListCarrierContacts(
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
          phone
          useBillingAddress
          billingStreet
          billingAddressExtra
          billingHouseNumber
          billingPostalCode
          billingCity
          carrierContacts {
            nextToken
            __typename
          }
          dailyReports {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
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
      nextToken
      __typename
    }
  }
`;
export const getChild = /* GraphQL */ `
  query GetChild($id: ID!) {
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
          phone
          useBillingAddress
          billingStreet
          billingAddressExtra
          billingHouseNumber
          billingPostalCode
          billingCity
          carrierContacts {
            nextToken
            __typename
          }
          dailyReports {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
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
      timeSheets {
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
            phone
            useBillingAddress
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
          dailyReport {
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
      invoices {
        items {
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
            school
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
          dailyReport {
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
  }
`;
export const listChildren = /* GraphQL */ `
  query ListChildren(
    $filter: ModelChildFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listChildren(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
      nextToken
      __typename
    }
  }
`;
export const listChildrenByArchiveState = /* GraphQL */ `
  query ListChildrenByArchiveState(
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
      nextToken
      __typename
    }
  }
`;
export const getCareAssignment = /* GraphQL */ `
  query GetCareAssignment($id: ID!) {
    getCareAssignment(id: $id) {
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
      childCareAssignmentsId
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listCareAssignments = /* GraphQL */ `
  query ListCareAssignments(
    $filter: ModelCareAssignmentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCareAssignments(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
          careAssignments {
            nextToken
            __typename
          }
          dailyReport {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
            nextToken
            __typename
          }
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
          careAssignments {
            nextToken
            __typename
          }
          dailyReport {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
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
        childCareAssignmentsId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const careAssignmentsByGuardian = /* GraphQL */ `
  query CareAssignmentsByGuardian(
    $guardianCareAssignmentsId: String!
    $sortDirection: ModelSortDirection
    $filter: ModelCareAssignmentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    careAssignmentsByGuardian(
      guardianCareAssignmentsId: $guardianCareAssignmentsId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
          careAssignments {
            nextToken
            __typename
          }
          dailyReport {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
            nextToken
            __typename
          }
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
          careAssignments {
            nextToken
            __typename
          }
          dailyReport {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
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
        childCareAssignmentsId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const careAssignmentsByChild = /* GraphQL */ `
  query CareAssignmentsByChild(
    $childCareAssignmentsId: String!
    $sortDirection: ModelSortDirection
    $filter: ModelCareAssignmentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    careAssignmentsByChild(
      childCareAssignmentsId: $childCareAssignmentsId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
          careAssignments {
            nextToken
            __typename
          }
          dailyReport {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
            nextToken
            __typename
          }
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
          careAssignments {
            nextToken
            __typename
          }
          dailyReport {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
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
        childCareAssignmentsId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getDailyReport = /* GraphQL */ `
  query GetDailyReport($id: ID!) {
    getDailyReport(id: $id) {
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
          careAssignments {
            nextToken
            __typename
          }
          dailyReport {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
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
            nextToken
            __typename
          }
          dailyReport {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
            nextToken
            __typename
          }
          timeSheetDate
          archiveStatus
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
          phone
          useBillingAddress
          billingStreet
          billingAddressExtra
          billingHouseNumber
          billingPostalCode
          billingCity
          carrierContacts {
            nextToken
            __typename
          }
          dailyReports {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
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
            createdAt
            updatedAt
            carrierCarrierContactsId
            __typename
          }
          careAssignments {
            nextToken
            __typename
          }
          dailyReport {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
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
            nextToken
            __typename
          }
          dailyReport {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
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
          billingStreet
          billingAddressExtra
          billingHouseNumber
          billingPostalCode
          billingCity
          carrierContacts {
            nextToken
            __typename
          }
          dailyReports {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
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
  }
`;
export const listDailyReports = /* GraphQL */ `
  query ListDailyReports(
    $filter: ModelDailyReportFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDailyReports(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
          careAssignments {
            nextToken
            __typename
          }
          dailyReport {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
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
          careAssignments {
            nextToken
            __typename
          }
          dailyReport {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
            nextToken
            __typename
          }
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
          billingStreet
          billingAddressExtra
          billingHouseNumber
          billingPostalCode
          billingCity
          carrierContacts {
            nextToken
            __typename
          }
          dailyReports {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
            nextToken
            __typename
          }
          email
          allowAutoInvoice
          createdAt
          updatedAt
          __typename
        }
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
            phone
            useBillingAddress
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
          dailyReport {
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
        invoices {
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
            school
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
          dailyReport {
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
export const reportsByChild = /* GraphQL */ `
  query ReportsByChild(
    $childDailyReportId: String!
    $documentStatus: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelDailyReportFilterInput
    $limit: Int
    $nextToken: String
  ) {
    reportsByChild(
      childDailyReportId: $childDailyReportId
      documentStatus: $documentStatus
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
          careAssignments {
            nextToken
            __typename
          }
          dailyReport {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
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
          careAssignments {
            nextToken
            __typename
          }
          dailyReport {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
            nextToken
            __typename
          }
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
          billingStreet
          billingAddressExtra
          billingHouseNumber
          billingPostalCode
          billingCity
          carrierContacts {
            nextToken
            __typename
          }
          dailyReports {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
            nextToken
            __typename
          }
          email
          allowAutoInvoice
          createdAt
          updatedAt
          __typename
        }
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
            phone
            useBillingAddress
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
          dailyReport {
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
        invoices {
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
            school
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
          dailyReport {
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
export const reportsByDocumentStatus = /* GraphQL */ `
  query ReportsByDocumentStatus(
    $documentStatus: DocumentStatus!
    $guardianDailyReportId: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelDailyReportFilterInput
    $limit: Int
    $nextToken: String
  ) {
    reportsByDocumentStatus(
      documentStatus: $documentStatus
      guardianDailyReportId: $guardianDailyReportId
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
          careAssignments {
            nextToken
            __typename
          }
          dailyReport {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
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
          careAssignments {
            nextToken
            __typename
          }
          dailyReport {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
            nextToken
            __typename
          }
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
          billingStreet
          billingAddressExtra
          billingHouseNumber
          billingPostalCode
          billingCity
          carrierContacts {
            nextToken
            __typename
          }
          dailyReports {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
            nextToken
            __typename
          }
          email
          allowAutoInvoice
          createdAt
          updatedAt
          __typename
        }
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
            phone
            useBillingAddress
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
          dailyReport {
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
        invoices {
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
            school
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
          dailyReport {
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
export const dailyReportsByFlagStatus = /* GraphQL */ `
  query DailyReportsByFlagStatus(
    $flag: ReportFlag!
    $guardianDailyReportId: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelDailyReportFilterInput
    $limit: Int
    $nextToken: String
  ) {
    dailyReportsByFlagStatus(
      flag: $flag
      guardianDailyReportId: $guardianDailyReportId
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
          careAssignments {
            nextToken
            __typename
          }
          dailyReport {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
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
          careAssignments {
            nextToken
            __typename
          }
          dailyReport {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
            nextToken
            __typename
          }
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
          billingStreet
          billingAddressExtra
          billingHouseNumber
          billingPostalCode
          billingCity
          carrierContacts {
            nextToken
            __typename
          }
          dailyReports {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
            nextToken
            __typename
          }
          email
          allowAutoInvoice
          createdAt
          updatedAt
          __typename
        }
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
            phone
            useBillingAddress
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
          dailyReport {
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
        invoices {
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
            school
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
          dailyReport {
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
export const dailyReportsByReportType = /* GraphQL */ `
  query DailyReportsByReportType(
    $reportType: ReportType!
    $guardianDailyReportId: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelDailyReportFilterInput
    $limit: Int
    $nextToken: String
  ) {
    dailyReportsByReportType(
      reportType: $reportType
      guardianDailyReportId: $guardianDailyReportId
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
          careAssignments {
            nextToken
            __typename
          }
          dailyReport {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
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
          careAssignments {
            nextToken
            __typename
          }
          dailyReport {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
            nextToken
            __typename
          }
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
          billingStreet
          billingAddressExtra
          billingHouseNumber
          billingPostalCode
          billingCity
          carrierContacts {
            nextToken
            __typename
          }
          dailyReports {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
            nextToken
            __typename
          }
          email
          allowAutoInvoice
          createdAt
          updatedAt
          __typename
        }
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
            phone
            useBillingAddress
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
          dailyReport {
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
        invoices {
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
            school
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
          dailyReport {
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
export const dailyReportsByType = /* GraphQL */ `
  query DailyReportsByType(
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
          careAssignments {
            nextToken
            __typename
          }
          dailyReport {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
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
          careAssignments {
            nextToken
            __typename
          }
          dailyReport {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
            nextToken
            __typename
          }
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
          billingStreet
          billingAddressExtra
          billingHouseNumber
          billingPostalCode
          billingCity
          carrierContacts {
            nextToken
            __typename
          }
          dailyReports {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
            nextToken
            __typename
          }
          email
          allowAutoInvoice
          createdAt
          updatedAt
          __typename
        }
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
            phone
            useBillingAddress
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
          dailyReport {
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
        invoices {
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
            school
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
          dailyReport {
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
export const getTimeSheets = /* GraphQL */ `
  query GetTimeSheets($id: ID!) {
    getTimeSheets(id: $id) {
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
        phone
        useBillingAddress
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
  }
`;
export const listTimeSheets = /* GraphQL */ `
  query ListTimeSheets(
    $filter: ModelTimeSheetsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTimeSheets(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
          careAssignments {
            nextToken
            __typename
          }
          dailyReport {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
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
            nextToken
            __typename
          }
          dailyReport {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
            nextToken
            __typename
          }
          timeSheetDate
          archiveStatus
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
          phone
          useBillingAddress
          billingStreet
          billingAddressExtra
          billingHouseNumber
          billingPostalCode
          billingCity
          carrierContacts {
            nextToken
            __typename
          }
          dailyReports {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
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
export const timeSheetsByGuardian = /* GraphQL */ `
  query TimeSheetsByGuardian(
    $guardianTimeSheetsId: String!
    $documentDate: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTimeSheetsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    timeSheetsByGuardian(
      guardianTimeSheetsId: $guardianTimeSheetsId
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
          careAssignments {
            nextToken
            __typename
          }
          dailyReport {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
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
            nextToken
            __typename
          }
          dailyReport {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
            nextToken
            __typename
          }
          timeSheetDate
          archiveStatus
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
          phone
          useBillingAddress
          billingStreet
          billingAddressExtra
          billingHouseNumber
          billingPostalCode
          billingCity
          carrierContacts {
            nextToken
            __typename
          }
          dailyReports {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
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
export const timeSheetsByFlagStatus = /* GraphQL */ `
  query TimeSheetsByFlagStatus(
    $flag: TimSheetFlag!
    $guardianTimeSheetsId: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTimeSheetsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    timeSheetsByFlagStatus(
      flag: $flag
      guardianTimeSheetsId: $guardianTimeSheetsId
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
          careAssignments {
            nextToken
            __typename
          }
          dailyReport {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
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
            nextToken
            __typename
          }
          dailyReport {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
            nextToken
            __typename
          }
          timeSheetDate
          archiveStatus
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
          phone
          useBillingAddress
          billingStreet
          billingAddressExtra
          billingHouseNumber
          billingPostalCode
          billingCity
          carrierContacts {
            nextToken
            __typename
          }
          dailyReports {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
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
export const timeSheetsByType = /* GraphQL */ `
  query TimeSheetsByType(
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
          careAssignments {
            nextToken
            __typename
          }
          dailyReport {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
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
            nextToken
            __typename
          }
          dailyReport {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
            nextToken
            __typename
          }
          timeSheetDate
          archiveStatus
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
          phone
          useBillingAddress
          billingStreet
          billingAddressExtra
          billingHouseNumber
          billingPostalCode
          billingCity
          carrierContacts {
            nextToken
            __typename
          }
          dailyReports {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
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
export const listInvoices = /* GraphQL */ `
  query ListInvoices(
    $filter: ModelInvoicesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listInvoices(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
            createdAt
            updatedAt
            carrierCarrierContactsId
            __typename
          }
          careAssignments {
            nextToken
            __typename
          }
          dailyReport {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
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
            nextToken
            __typename
          }
          dailyReport {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
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
          billingStreet
          billingAddressExtra
          billingHouseNumber
          billingPostalCode
          billingCity
          carrierContacts {
            nextToken
            __typename
          }
          dailyReports {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
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
  }
`;
export const invoicesByType = /* GraphQL */ `
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
          careAssignments {
            nextToken
            __typename
          }
          dailyReport {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
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
            nextToken
            __typename
          }
          dailyReport {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
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
          billingStreet
          billingAddressExtra
          billingHouseNumber
          billingPostalCode
          billingCity
          carrierContacts {
            nextToken
            __typename
          }
          dailyReports {
            nextToken
            __typename
          }
          timeSheets {
            nextToken
            __typename
          }
          invoices {
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
  }
`;
export const getInvoiceNumber = /* GraphQL */ `
  query GetInvoiceNumber($id: ID!) {
    getInvoiceNumber(id: $id) {
      id
      year
      number
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listInvoiceNumbers = /* GraphQL */ `
  query ListInvoiceNumbers(
    $filter: ModelInvoiceNumberFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listInvoiceNumbers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        year
        number
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const invoiceNumberByYear = /* GraphQL */ `
  query InvoiceNumberByYear(
    $year: Int!
    $sortDirection: ModelSortDirection
    $filter: ModelInvoiceNumberFilterInput
    $limit: Int
    $nextToken: String
  ) {
    invoiceNumberByYear(
      year: $year
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        year
        number
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getCalendar = /* GraphQL */ `
  query GetCalendar($id: ID!) {
    getCalendar(id: $id) {
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
          calendar {
            id
            title
            description
            color
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
      participations {
        items {
          id
          participant
          type
          calendarParticipationsId
          calendar {
            id
            title
            description
            color
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
      createdAt
      updatedAt
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
        participations {
          items {
            id
            participant
            type
            calendarParticipationsId
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
export const getEvent = /* GraphQL */ `
  query GetEvent($id: ID!) {
    getEvent(id: $id) {
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
        participations {
          items {
            id
            participant
            type
            calendarParticipationsId
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
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listEvents = /* GraphQL */ `
  query ListEvents(
    $filter: ModelEventFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEvents(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
export const eventsByCalendar = /* GraphQL */ `
  query EventsByCalendar(
    $calendarEventsId: ID!
    $startDate: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelEventFilterInput
    $limit: Int
    $nextToken: String
  ) {
    eventsByCalendar(
      calendarEventsId: $calendarEventsId
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
export const eventsByActive = /* GraphQL */ `
  query EventsByActive(
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
export const getParticipation = /* GraphQL */ `
  query GetParticipation($id: ID!) {
    getParticipation(id: $id) {
      id
      participant
      type
      calendarParticipationsId
      calendar {
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
        participations {
          items {
            id
            participant
            type
            calendarParticipationsId
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
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listParticipations = /* GraphQL */ `
  query ListParticipations(
    $filter: ModelParticipationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listParticipations(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        participant
        type
        calendarParticipationsId
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
export const participationByParticipant = /* GraphQL */ `
  query ParticipationByParticipant(
    $participant: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelParticipationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    participationByParticipant(
      participant: $participant
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        participant
        type
        calendarParticipationsId
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
export const participationByCalendar = /* GraphQL */ `
  query ParticipationByCalendar(
    $calendarParticipationsId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelParticipationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    participationByCalendar(
      calendarParticipationsId: $calendarParticipationsId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        participant
        type
        calendarParticipationsId
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
export const getNote = /* GraphQL */ `
  query GetNote($id: ID!) {
    getNote(id: $id) {
      id
      title
      description
      owner
      status
      noteTags {
        items {
          id
          owner
          status
          note {
            id
            title
            description
            owner
            status
            createdAt
            updatedAt
            __typename
          }
          noteNoteTagsId
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
export const listNotes = /* GraphQL */ `
  query ListNotes(
    $filter: ModelNoteFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listNotes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        description
        owner
        status
        noteTags {
          items {
            id
            owner
            status
            noteNoteTagsId
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
export const notesByStatus = /* GraphQL */ `
  query NotesByStatus(
    $status: NoteStatus!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelNoteFilterInput
    $limit: Int
    $nextToken: String
  ) {
    notesByStatus(
      status: $status
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        title
        description
        owner
        status
        noteTags {
          items {
            id
            owner
            status
            noteNoteTagsId
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
export const getNoteTag = /* GraphQL */ `
  query GetNoteTag($id: ID!) {
    getNoteTag(id: $id) {
      id
      owner
      status
      note {
        id
        title
        description
        owner
        status
        noteTags {
          items {
            id
            owner
            status
            noteNoteTagsId
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
      noteNoteTagsId
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listNoteTags = /* GraphQL */ `
  query ListNoteTags(
    $filter: ModelNoteTagFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listNoteTags(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        owner
        status
        note {
          id
          title
          description
          owner
          status
          noteTags {
            nextToken
            __typename
          }
          createdAt
          updatedAt
          __typename
        }
        noteNoteTagsId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const noteTagsByStatus = /* GraphQL */ `
  query NoteTagsByStatus(
    $status: NoteTagStatus!
    $owner: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelNoteTagFilterInput
    $limit: Int
    $nextToken: String
  ) {
    noteTagsByStatus(
      status: $status
      owner: $owner
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        owner
        status
        note {
          id
          title
          description
          owner
          status
          noteTags {
            nextToken
            __typename
          }
          createdAt
          updatedAt
          __typename
        }
        noteNoteTagsId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const noteTagsByNote = /* GraphQL */ `
  query NoteTagsByNote(
    $noteNoteTagsId: String!
    $sortDirection: ModelSortDirection
    $filter: ModelNoteTagFilterInput
    $limit: Int
    $nextToken: String
  ) {
    noteTagsByNote(
      noteNoteTagsId: $noteNoteTagsId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        owner
        status
        note {
          id
          title
          description
          owner
          status
          noteTags {
            nextToken
            __typename
          }
          createdAt
          updatedAt
          __typename
        }
        noteNoteTagsId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listDailyReportsByGuardian = /* GraphQL */ `
  query ListDailyReportsByGuardian {
    listDailyReportsByGuardian
  }
`;
export const getDailyReportByGuardian = /* GraphQL */ `
  query GetDailyReportByGuardian($input: getDailyReportByGuardianInput!) {
    getDailyReportByGuardian(input: $input)
  }
`;
export const listTimeSheetsByGuardian = /* GraphQL */ `
  query ListTimeSheetsByGuardian($input: listTimeSheetsByGuardianInput!) {
    listTimeSheetsByGuardian(input: $input)
  }
`;
export const getGuardianByGuardian = /* GraphQL */ `
  query GetGuardianByGuardian {
    getGuardianByGuardian
  }
`;
export const getGuardianFlagStatusByGuardian = /* GraphQL */ `
  query GetGuardianFlagStatusByGuardian {
    getGuardianFlagStatusByGuardian
  }
`;
export const getFlaggedReportsByGuardian = /* GraphQL */ `
  query GetFlaggedReportsByGuardian {
    getFlaggedReportsByGuardian
  }
`;
export const getFlaggedReportsByTimesheet = /* GraphQL */ `
  query GetFlaggedReportsByTimesheet(
    $input: getFlaggedReportsByTimesheetInput!
  ) {
    getFlaggedReportsByTimesheet(input: $input)
  }
`;
export const getChildCarrierStatus = /* GraphQL */ `
  query GetChildCarrierStatus($input: getChildCarrierStatusInput!) {
    getChildCarrierStatus(input: $input)
  }
`;
export const listAdminSharebox = /* GraphQL */ `
  query ListAdminSharebox {
    listAdminSharebox
  }
`;
export const listGuardianSharebox = /* GraphQL */ `
  query ListGuardianSharebox {
    listGuardianSharebox
  }
`;
export const guardianDownloadShareboxItem = /* GraphQL */ `
  query GuardianDownloadShareboxItem(
    $input: guardianDownloadShareboxItemInput!
  ) {
    guardianDownloadShareboxItem(input: $input)
  }
`;
export const listChildrenByCarrier = /* GraphQL */ `
  query ListChildrenByCarrier($input: listChildrenByCarrierInput!) {
    listChildrenByCarrier(input: $input)
  }
`;
export const downloadTemporaryTimeSheet = /* GraphQL */ `
  query DownloadTemporaryTimeSheet($input: downloadTemporaryTimeSheetInput!) {
    downloadTemporaryTimeSheet(input: $input)
  }
`;
export const listEventsByIdentity = /* GraphQL */ `
  query ListEventsByIdentity($input: listEventsByIdentityInput!) {
    listEventsByIdentity(input: $input)
  }
`;
export const getNextEventByIdentity = /* GraphQL */ `
  query GetNextEventByIdentity {
    getNextEventByIdentity
  }
`;
export const checkUnreadNotesStatus = /* GraphQL */ `
  query CheckUnreadNotesStatus {
    checkUnreadNotesStatus
  }
`;
export const listSpecialDailyReportsByGuardian = /* GraphQL */ `
  query ListSpecialDailyReportsByGuardian(
    $input: listSpecialDailyReportsByGuardianInput!
  ) {
    listSpecialDailyReportsByGuardian(input: $input)
  }
`;
export const checkCreatedReportsCount = /* GraphQL */ `
  query CheckCreatedReportsCount {
    checkCreatedReportsCount
  }
`;
export const adminCheckChildArchivePossibility = /* GraphQL */ `
  query AdminCheckChildArchivePossibility(
    $input: adminCheckChildArchivePossibilityInput!
  ) {
    adminCheckChildArchivePossibility(input: $input)
  }
`;