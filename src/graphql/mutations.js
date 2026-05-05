/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createGuardian = /* GraphQL */ `
  mutation CreateGuardian(
    $input: CreateGuardianInput!
    $condition: ModelGuardianConditionInput
  ) {
    createGuardian(input: $input, condition: $condition) {
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
export const updateGuardian = /* GraphQL */ `
  mutation UpdateGuardian(
    $input: UpdateGuardianInput!
    $condition: ModelGuardianConditionInput
  ) {
    updateGuardian(input: $input, condition: $condition) {
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
export const deleteGuardian = /* GraphQL */ `
  mutation DeleteGuardian(
    $input: DeleteGuardianInput!
    $condition: ModelGuardianConditionInput
  ) {
    deleteGuardian(input: $input, condition: $condition) {
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
export const createCarrier = /* GraphQL */ `
  mutation CreateCarrier(
    $input: CreateCarrierInput!
    $condition: ModelCarrierConditionInput
  ) {
    createCarrier(input: $input, condition: $condition) {
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
export const updateCarrier = /* GraphQL */ `
  mutation UpdateCarrier(
    $input: UpdateCarrierInput!
    $condition: ModelCarrierConditionInput
  ) {
    updateCarrier(input: $input, condition: $condition) {
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
export const deleteCarrier = /* GraphQL */ `
  mutation DeleteCarrier(
    $input: DeleteCarrierInput!
    $condition: ModelCarrierConditionInput
  ) {
    deleteCarrier(input: $input, condition: $condition) {
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
export const createCarrierContact = /* GraphQL */ `
  mutation CreateCarrierContact(
    $input: CreateCarrierContactInput!
    $condition: ModelCarrierContactConditionInput
  ) {
    createCarrierContact(input: $input, condition: $condition) {
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
export const updateCarrierContact = /* GraphQL */ `
  mutation UpdateCarrierContact(
    $input: UpdateCarrierContactInput!
    $condition: ModelCarrierContactConditionInput
  ) {
    updateCarrierContact(input: $input, condition: $condition) {
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
export const deleteCarrierContact = /* GraphQL */ `
  mutation DeleteCarrierContact(
    $input: DeleteCarrierContactInput!
    $condition: ModelCarrierContactConditionInput
  ) {
    deleteCarrierContact(input: $input, condition: $condition) {
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
export const createChild = /* GraphQL */ `
  mutation CreateChild(
    $input: CreateChildInput!
    $condition: ModelChildConditionInput
  ) {
    createChild(input: $input, condition: $condition) {
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
export const updateChild = /* GraphQL */ `
  mutation UpdateChild(
    $input: UpdateChildInput!
    $condition: ModelChildConditionInput
  ) {
    updateChild(input: $input, condition: $condition) {
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
export const deleteChild = /* GraphQL */ `
  mutation DeleteChild(
    $input: DeleteChildInput!
    $condition: ModelChildConditionInput
  ) {
    deleteChild(input: $input, condition: $condition) {
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
export const createCareAssignment = /* GraphQL */ `
  mutation CreateCareAssignment(
    $input: CreateCareAssignmentInput!
    $condition: ModelCareAssignmentConditionInput
  ) {
    createCareAssignment(input: $input, condition: $condition) {
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
export const updateCareAssignment = /* GraphQL */ `
  mutation UpdateCareAssignment(
    $input: UpdateCareAssignmentInput!
    $condition: ModelCareAssignmentConditionInput
  ) {
    updateCareAssignment(input: $input, condition: $condition) {
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
export const deleteCareAssignment = /* GraphQL */ `
  mutation DeleteCareAssignment(
    $input: DeleteCareAssignmentInput!
    $condition: ModelCareAssignmentConditionInput
  ) {
    deleteCareAssignment(input: $input, condition: $condition) {
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
export const createDailyReport = /* GraphQL */ `
  mutation CreateDailyReport(
    $input: CreateDailyReportInput!
    $condition: ModelDailyReportConditionInput
  ) {
    createDailyReport(input: $input, condition: $condition) {
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
export const updateDailyReport = /* GraphQL */ `
  mutation UpdateDailyReport(
    $input: UpdateDailyReportInput!
    $condition: ModelDailyReportConditionInput
  ) {
    updateDailyReport(input: $input, condition: $condition) {
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
export const deleteDailyReport = /* GraphQL */ `
  mutation DeleteDailyReport(
    $input: DeleteDailyReportInput!
    $condition: ModelDailyReportConditionInput
  ) {
    deleteDailyReport(input: $input, condition: $condition) {
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
export const createTimeSheets = /* GraphQL */ `
  mutation CreateTimeSheets(
    $input: CreateTimeSheetsInput!
    $condition: ModelTimeSheetsConditionInput
  ) {
    createTimeSheets(input: $input, condition: $condition) {
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
export const updateTimeSheets = /* GraphQL */ `
  mutation UpdateTimeSheets(
    $input: UpdateTimeSheetsInput!
    $condition: ModelTimeSheetsConditionInput
  ) {
    updateTimeSheets(input: $input, condition: $condition) {
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
export const deleteTimeSheets = /* GraphQL */ `
  mutation DeleteTimeSheets(
    $input: DeleteTimeSheetsInput!
    $condition: ModelTimeSheetsConditionInput
  ) {
    deleteTimeSheets(input: $input, condition: $condition) {
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
export const createInvoices = /* GraphQL */ `
  mutation CreateInvoices(
    $input: CreateInvoicesInput!
    $condition: ModelInvoicesConditionInput
  ) {
    createInvoices(input: $input, condition: $condition) {
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
export const updateInvoices = /* GraphQL */ `
  mutation UpdateInvoices(
    $input: UpdateInvoicesInput!
    $condition: ModelInvoicesConditionInput
  ) {
    updateInvoices(input: $input, condition: $condition) {
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
export const deleteInvoices = /* GraphQL */ `
  mutation DeleteInvoices(
    $input: DeleteInvoicesInput!
    $condition: ModelInvoicesConditionInput
  ) {
    deleteInvoices(input: $input, condition: $condition) {
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
export const createInvoiceNumber = /* GraphQL */ `
  mutation CreateInvoiceNumber(
    $input: CreateInvoiceNumberInput!
    $condition: ModelInvoiceNumberConditionInput
  ) {
    createInvoiceNumber(input: $input, condition: $condition) {
      id
      year
      number
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateInvoiceNumber = /* GraphQL */ `
  mutation UpdateInvoiceNumber(
    $input: UpdateInvoiceNumberInput!
    $condition: ModelInvoiceNumberConditionInput
  ) {
    updateInvoiceNumber(input: $input, condition: $condition) {
      id
      year
      number
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteInvoiceNumber = /* GraphQL */ `
  mutation DeleteInvoiceNumber(
    $input: DeleteInvoiceNumberInput!
    $condition: ModelInvoiceNumberConditionInput
  ) {
    deleteInvoiceNumber(input: $input, condition: $condition) {
      id
      year
      number
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createCalendar = /* GraphQL */ `
  mutation CreateCalendar(
    $input: CreateCalendarInput!
    $condition: ModelCalendarConditionInput
  ) {
    createCalendar(input: $input, condition: $condition) {
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
export const updateCalendar = /* GraphQL */ `
  mutation UpdateCalendar(
    $input: UpdateCalendarInput!
    $condition: ModelCalendarConditionInput
  ) {
    updateCalendar(input: $input, condition: $condition) {
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
export const deleteCalendar = /* GraphQL */ `
  mutation DeleteCalendar(
    $input: DeleteCalendarInput!
    $condition: ModelCalendarConditionInput
  ) {
    deleteCalendar(input: $input, condition: $condition) {
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
export const createEvent = /* GraphQL */ `
  mutation CreateEvent(
    $input: CreateEventInput!
    $condition: ModelEventConditionInput
  ) {
    createEvent(input: $input, condition: $condition) {
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
export const updateEvent = /* GraphQL */ `
  mutation UpdateEvent(
    $input: UpdateEventInput!
    $condition: ModelEventConditionInput
  ) {
    updateEvent(input: $input, condition: $condition) {
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
export const deleteEvent = /* GraphQL */ `
  mutation DeleteEvent(
    $input: DeleteEventInput!
    $condition: ModelEventConditionInput
  ) {
    deleteEvent(input: $input, condition: $condition) {
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
export const createParticipation = /* GraphQL */ `
  mutation CreateParticipation(
    $input: CreateParticipationInput!
    $condition: ModelParticipationConditionInput
  ) {
    createParticipation(input: $input, condition: $condition) {
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
export const updateParticipation = /* GraphQL */ `
  mutation UpdateParticipation(
    $input: UpdateParticipationInput!
    $condition: ModelParticipationConditionInput
  ) {
    updateParticipation(input: $input, condition: $condition) {
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
export const deleteParticipation = /* GraphQL */ `
  mutation DeleteParticipation(
    $input: DeleteParticipationInput!
    $condition: ModelParticipationConditionInput
  ) {
    deleteParticipation(input: $input, condition: $condition) {
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
export const createNote = /* GraphQL */ `
  mutation CreateNote(
    $input: CreateNoteInput!
    $condition: ModelNoteConditionInput
  ) {
    createNote(input: $input, condition: $condition) {
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
export const updateNote = /* GraphQL */ `
  mutation UpdateNote(
    $input: UpdateNoteInput!
    $condition: ModelNoteConditionInput
  ) {
    updateNote(input: $input, condition: $condition) {
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
export const deleteNote = /* GraphQL */ `
  mutation DeleteNote(
    $input: DeleteNoteInput!
    $condition: ModelNoteConditionInput
  ) {
    deleteNote(input: $input, condition: $condition) {
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
export const createNoteTag = /* GraphQL */ `
  mutation CreateNoteTag(
    $input: CreateNoteTagInput!
    $condition: ModelNoteTagConditionInput
  ) {
    createNoteTag(input: $input, condition: $condition) {
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
export const updateNoteTag = /* GraphQL */ `
  mutation UpdateNoteTag(
    $input: UpdateNoteTagInput!
    $condition: ModelNoteTagConditionInput
  ) {
    updateNoteTag(input: $input, condition: $condition) {
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
export const deleteNoteTag = /* GraphQL */ `
  mutation DeleteNoteTag(
    $input: DeleteNoteTagInput!
    $condition: ModelNoteTagConditionInput
  ) {
    deleteNoteTag(input: $input, condition: $condition) {
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
export const createReport = /* GraphQL */ `
  mutation CreateReport($input: CreateReportInput!) {
    createReport(input: $input)
  }
`;
export const createSpecialReport = /* GraphQL */ `
  mutation CreateSpecialReport($input: CreateSpecialReportInput!) {
    createSpecialReport(input: $input)
  }
`;
export const createTimesheet = /* GraphQL */ `
  mutation CreateTimesheet($input: CreateTimeSheetInput!) {
    createTimesheet(input: $input)
  }
`;
export const createInvoice = /* GraphQL */ `
  mutation CreateInvoice($input: CreateInvoiceInput!) {
    createInvoice(input: $input)
  }
`;
export const createSpecialTimesheet = /* GraphQL */ `
  mutation CreateSpecialTimesheet($input: createSpecialTimesheetInput!) {
    createSpecialTimesheet(input: $input)
  }
`;
export const updateTimesheet = /* GraphQL */ `
  mutation UpdateTimesheet($input: UpdateTimeSheetInput!) {
    updateTimesheet(input: $input)
  }
`;
export const updateSpecialTimesheet = /* GraphQL */ `
  mutation UpdateSpecialTimesheet($input: updateSpecialTimesheetInput) {
    updateSpecialTimesheet(input: $input)
  }
`;
export const uploadShareboxItem = /* GraphQL */ `
  mutation UploadShareboxItem($input: uploadShareboxItemInput!) {
    uploadShareboxItem(input: $input)
  }
`;
export const deleteShareboxItem = /* GraphQL */ `
  mutation DeleteShareboxItem($input: deleteShareboxItemInput!) {
    deleteShareboxItem(input: $input)
  }
`;
export const confirmInvoice = /* GraphQL */ `
  mutation ConfirmInvoice($input: confirmInvoiceInput!) {
    confirmInvoice(input: $input)
  }
`;
export const guardianDeleteDailyReport = /* GraphQL */ `
  mutation GuardianDeleteDailyReport($input: guardianDeleteDailyReportInput!) {
    guardianDeleteDailyReport(input: $input)
  }
`;
export const guardianUpdateDailyReport = /* GraphQL */ `
  mutation GuardianUpdateDailyReport($input: UpdateReportInput!) {
    guardianUpdateDailyReport(input: $input)
  }
`;
export const guardianUpdateSpecialReport = /* GraphQL */ `
  mutation GuardianUpdateSpecialReport($input: UpdateSpecialReportInput!) {
    guardianUpdateSpecialReport(input: $input)
  }
`;
export const adminDeleteCalendar = /* GraphQL */ `
  mutation AdminDeleteCalendar($input: adminDeleteCalendarInput) {
    adminDeleteCalendar(input: $input)
  }
`;
export const createNoteAndNotetags = /* GraphQL */ `
  mutation CreateNoteAndNotetags($input: createNoteAndNotetagsInput) {
    createNoteAndNotetags(input: $input)
  }
`;
export const adminCreateEmptyReport = /* GraphQL */ `
  mutation AdminCreateEmptyReport($input: adminCreateEmptyReportInput) {
    adminCreateEmptyReport(input: $input)
  }
`;
export const adminRegenerateInvoice = /* GraphQL */ `
  mutation AdminRegenerateInvoice($input: adminRegenerateInvoiceInput) {
    adminRegenerateInvoice(input: $input)
  }
`;
export const adminArchiveClient = /* GraphQL */ `
  mutation AdminArchiveClient($input: adminArchiveClientInput!) {
    adminArchiveClient(input: $input)
  }
`;