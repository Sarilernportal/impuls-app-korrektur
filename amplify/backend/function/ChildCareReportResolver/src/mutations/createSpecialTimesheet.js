/* eslint-disable */

// Package imports
const { v4: uuidv4 } = require('uuid');
// // Get the tables
const documentTableName = process.env.API_CHILDCAREAPI_TIMESHEETSTABLE_NAME;
const updateDocumentTableName =
  process.env.API_CHILDCAREAPI_DAILYREPORTTABLE_NAME;
const docCreatorLambda = process.env.FUNCTION_CHILDCAREDOCUMENTCREATOR_NAME;
// // Initialize the dynamo db doc client
const {
  createSpecialTimesheet,
  updateDocumentTransmitted,
  updateDocumentTimeSheetLink
} = require('../modules/dynamoDB/dynamodbClient.js');
// Initialize the lambda caller
const { callLambdaFunction } = require('../modules/lambda/lambdaCaller.js');
// get AppSync URL
const appsyncUrl = process.env.API_CHILDCAREAPI_GRAPHQLAPIENDPOINTOUTPUT;
// get AppSync queries
const { getGuardian } = require('../modules/appsync/graphql/queries.js');
const { request } = require('../modules/appsync/appsyncRequest.js');

module.exports = {
  createSpecialTimesheet: async (ctx) => {
    try {
      console.log('CTX-createSpecialTimesheet', ctx);
      // Get the data from the inputData
      const identity = ctx.identity.sub;
      var data = ctx.arguments.input;
      // sort documents by months
      var docList = {};
      // validate that no report was created by an admin and not updated through the guardian
      for (const document of data.documents) {
        if (document.retrospectively) {
          throw new Error(
            `Zeitnachweis konnte nicht erstellt werden. Nicht alle Tagesberichte wurden korrekt ueberarbeitet. ; `,
            err
          );
        }
      }

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

      for (const document of data.documents) {
        // check if child was already created, if not create new entry
        console.log('DOCUMENT', document);
        // get documentMonth by number
        const documentMonth = new Date(document.documentDate).getMonth() + 1;
        // get document year
        const documentYear = new Date(document.documentDate).getFullYear();
        // get guardian object from document guardian id
        const guardianResponse = await request(
          getGuardian,
          'GetGuardian',
          { id: identity },
          appsyncUrl
        );

        if (!(documentMonth in docList)) {
          // create new month object
          docList[documentMonth] = {
            guardian: guardianResponse.data.getGuardian,
            guardianID: document.guardianDailyReportId,
            documentYear: documentYear,
            documentMonth: months[documentMonth],
            documents: [document]
          };
        } else {
          // push document to monthlist
          docList[documentMonth].documents.push(document);
        }
      }
      // loop all alvailable children of guardian
      var fileResult = [];
      console.log('#doclist', docList);
      for (const [month, monthValue] of Object.entries(docList)) {
        const id = uuidv4();
        // create data object for lambda
        const monthDoc = {
          documents: docList[month].documents.sort((a, b) =>
            new Date(a.documentDate) > new Date(b.documentDate)
              ? 1
              : new Date(b.documentDate) > new Date(a.documentDate)
              ? -1
              : 0
          ),
          month: docList[month].documentMonth,
          documentYear: docList[month].documentYear,
          documentType: 'specialTimeSheet',
          guardian: docList[month].guardian,
          privatePath: data.privatePath,
          signatureImage: data.signatureImage,
          id: id
        };
        // Create the timesheet pdf file from the data
        const createTimesheetFileResult = await callLambdaFunction(
          docCreatorLambda,
          monthDoc
        );
        // Create the report database object
        const createTimesheetEntryResult = await createSpecialTimesheet(
          documentTableName,
          id,
          identity,
          `${id}.pdf`
        );
        fileResult.push(createTimesheetFileResult);
        // update all used dailyReports, set transmitted to true
        for (const doc of docList[month].documents) {
          await updateDocumentTransmitted(updateDocumentTableName, doc.id);
          await updateDocumentTimeSheetLink(
            updateDocumentTableName,
            doc.id,
            id
          );
        }
      }

      return fileResult;
    } catch (err) {
      // Handle the error and make a user friendly response
      console.error(err);
      throw new Error(`Zeitnachweis konnte nicht erstellt werden. ; `, err);
    }
  }
};
