/* eslint-disable */

// Package imports
const { v4: uuidv4 } = require('uuid');
// // Get the lambda functions
const docCreatorLambda = process.env.FUNCTION_CHILDCAREDOCUMENTCREATOR_NAME;
// Initialize the lambda caller
const { callLambdaFunction } = require('../modules/lambda/lambdaCaller.js');
// Initialize Appsync queries
const { getChild } = require('../queries/getChild.js');
// get AppSync URL
const appsyncUrl = process.env.API_CHILDCAREAPI_GRAPHQLAPIENDPOINTOUTPUT;
// get AppSync queries
const {
  getGuardian,
  getCarrier
} = require('../modules/appsync/graphql/queries.js');
const { request } = require('../modules/appsync/appsyncRequest.js');

module.exports = {
  downloadTemporaryTimeSheet: async (ctx) => {
    try {
      console.log('CTX-downloadTemporaryTimeSheet', ctx);
      // Get the data from the inputData
      const identity = ctx.identity.sub;
      var data = ctx.arguments.input;
      // sort documents by children and months
      var childList = [];
      for (const document of data.documents) {
        // check if child was already created, if not create new entry
        console.log('DOCUMENT', document);
        const childIndex = childList.findIndex(
          (child) => child.child.id === document.child.id
        );
        if (childIndex < 0) {
          // get document month by number
          const documentDate = new Date(document.documentDate).getMonth() + 1;
          // get document year
          const documentYear = new Date(document.documentDate).getFullYear();
          // set up month list
          var documentMonths = {};
          // add document to list
          documentMonths[documentDate] = [document];
          // get full child data
          const childData = await getChild({ id: document.child.id });
          // get guardian object from document guardian id
          const guardianResponse = await request(
            getGuardian,
            'GetGuardian',
            { id: document.guardianDailyReportId },
            appsyncUrl
          );
          // get carrier object from document carrier id
          const carrierResponse = await request(
            getCarrier,
            'GetCarrier',
            { id: document.carrierDailyReportsId },
            appsyncUrl
          );
          // create new child object
          childList.push({
            child: {
              id: document.child.id,
              data: childData,
              dateOfRegistration: document.child.dateOfRegistration,
              name: document.child.name,
              guardian: guardianResponse.data.getGuardian,
              guardianID: document.guardianDailyReportId,
              carrierID: document.carrierDailyReportsId,
              carrier: carrierResponse.data.getCarrier
            },
            documentYear: documentYear,
            documents: documentMonths
          });
        } else {
          // get document month by number
          const documentDate = new Date(document.documentDate).getMonth() + 1;
          // push document to month in child
          if (documentDate in childList[childIndex].documents) {
            childList[childIndex].documents[documentDate].push(document);
          } else {
            childList[childIndex].documents[documentDate] = [document];
          }
        }
      }
      // loop all alvailable children of guardian
      var fileResult = [];
      console.log('#CHILDLIST', childList);
      for (var child of childList) {
        for (const monthList in child.documents) {
          const id = uuidv4();
          // get month as string
          const months = {
            1: 'Januar',
            2: 'Februar',
            3: 'März',
            4: 'April',
            5: 'Mai',
            6: 'Juni',
            7: 'Juli',
            8: 'August',
            9: 'September',
            10: 'Oktober',
            11: 'November',
            12: 'Dezember'
          };
          // create data object for lambda
          const childDoc = {
            child: child.child,
            documents: child.documents[monthList].sort((a, b) =>
              new Date(a.documentDate) > new Date(b.documentDate)
                ? 1
                : new Date(b.documentDate) > new Date(a.documentDate)
                ? -1
                : 0
            ),
            month: months[monthList],
            documentYear: child.documentYear,
            documentType: 'tempTimeSheet',
            id: id
          };
          // get year of documents
          const invoiceYear = new Date(
            childDoc.documents[0].documentDate
          ).getFullYear();
          // Create the timesheet pdf file from the data
          const createTimesheetFileResult = await callLambdaFunction(
            docCreatorLambda,
            childDoc
          );
          // push file and name to file array
          fileResult.push({
            name: `${child.child.data.name}-${child.child.data.familyName}-${months[monthList]}-${invoiceYear}`,
            document: createTimesheetFileResult
          });
        }
      }
      return JSON.stringify(fileResult);
    } catch (err) {
      // Handle the error and make a user friendly response
      console.error(err);
      throw new Error(
        `Temporaerer Zeitnachweis konnte nicht erstellt werden. ; `,
        err
      );
    }
  }
};
