/* eslint-disable */
const { request } = require('../modules/appsync/appsyncRequest.js');
const {
  listCarrierContacts,
  getChild
} = require('../modules/appsync/graphql/queries.js');

const appsyncUrl = process.env.API_CHILDCAREAPI_GRAPHQLAPIENDPOINTOUTPUT;

module.exports = {
  listChildrenByCarrier: async (ctx) => {
    console.log('#CTX-listChildrenByCarrier', ctx);
    try {
      // get carrier id from ctx
      const carrierID = ctx.arguments.input.carrierCarrierContactsId;
      // get carrierContacts by carrier id --> this will provide a list of children, which we can enrich afterwards
      const r = await request(
        listCarrierContacts,
        'ListCarrierContacts',
        {
          limit: 1000,
          filter: { carrierCarrierContactsId: { eq: carrierID } }
        },
        appsyncUrl
      );
      console.log('#R', r);

      // get carrier contacts
      const carrierContacts = r.data.listCarrierContacts.items;

      // create emtpy child object
      var childList = [];

      // iterate all children of carrier contacts
      for (const carrierContact of carrierContacts) {
        for (const child of carrierContact.children.items) {
          // create custom query for child
          childQuery = `
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
          // pull full child object from API
          const childResponse = await request(
            childQuery,
            'GetChild',
            { id: child.id },
            appsyncUrl
          );
          // add child to child array
          childList.push(childResponse.data.getChild);
        }
      }

      return JSON.stringify(childList);
    } catch (err) {
      // Handle the error and make a user friendly response
      console.error(err);
      throw new Error(`Klienten konnten nicht gefunden werden.`, err);
    }
  }
};
