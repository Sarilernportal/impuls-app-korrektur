/* eslint-disable */

// Package imports
const { v4: uuidv4 } = require('uuid');
// // Get the tables
const documentTableName = process.env.API_CHILDCAREAPI_TIMESHEETSTABLE_NAME;
const updateDocumentTableName =
  process.env.API_CHILDCAREAPI_DAILYREPORTTABLE_NAME;
const guardianTableName = process.env.API_CHILDCAREAPI_GUARDIANTABLE_NAME;
const docCreatorLambda = process.env.FUNCTION_CHILDCAREDOCUMENTCREATOR_NAME;
// // Initialize the dynamo db doc client
const {
  createTimesheet,
  updateDocumentTransmitted,
  updateDocumentTimeSheetLink,
  updateTimeSheetDate
} = require('../modules/dynamoDB/dynamodbClient.js');
// Initialize the lambda caller
const { callLambdaFunction } = require('../modules/lambda/lambdaCaller.js');
// Initialize Appsync queries
const { getChild } = require('../queries/getChild.js');
// import invoice creator
const { createInvoice } = require('./createInvoice.js');
// get AppSync URL
const appsyncUrl = process.env.API_CHILDCAREAPI_GRAPHQLAPIENDPOINTOUTPUT;
// get AppSync queries
const {
  getGuardian,
  getCarrier
} = require('../modules/appsync/graphql/queries.js');
const { request } = require('../modules/appsync/appsyncRequest.js');

module.exports = {
  createTimesheet: async (ctx) => {
    try {
      console.log('CTX TIMESHEET', ctx);
      // Get the data from the inputData
      const identity = ctx.identity.sub;
      var data = ctx.arguments.input;
      // create var for storing the highest timesheet date for guardian
      var highestTimesheetDate = null;
      // sort documents by children and months
      var childList = [];
      // validate that not report was created by an admin and not updated through the guardian
      for (const document of data.documents) {
        if (document.retrospectively) {
          throw new Error(
            `Zeitnachweis konnte nicht erstellt werden. Nicht alle Tagesberichte wurden korrekt ueberarbeitet. ; `,
            err
          );
        }
      }
      // get guardian object from identity
      const guardianResponse = await request(
        getGuardian,
        'GetGuardian',
        { id: identity },
        appsyncUrl
      );
      const guardianData = guardianResponse.data.getGuardian;
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
              guardian: guardianData,
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
            documentType: 'timeSheet',
            privatePath: data.privatePath,
            signatureImage: data.signatureImage,
            id: id
          };
          console.log('#-childDoc', childDoc.documents);
          // save date of last doc if its higher than the previously saved one
          if (highestTimesheetDate) {
            if (
              highestTimesheetDate <
              new Date(
                childDoc.documents[childDoc.documents.length - 1].documentDate
              )
            ) {
              highestTimesheetDate = new Date(
                childDoc.documents[childDoc.documents.length - 1].documentDate
              );
            }
          } else {
            highestTimesheetDate = new Date(
              childDoc.documents[childDoc.documents.length - 1].documentDate
            );
          }
          // Create the timesheet pdf file from the data
          const createTimesheetFileResult = await callLambdaFunction(
            docCreatorLambda,
            childDoc
          );
          // timesheet data object
          const timeSheetData = {
            child: child.child,
            documents: child.documents[monthList]
          };
          // Create the report database object
          const createTimesheetEntryResult = await createTimesheet(
            documentTableName,
            id,
            timeSheetData,
            identity,
            `${id}.pdf`
          );
          fileResult.push(createTimesheetFileResult);
          // update all used dailyReports, set transmitted to true
          for (const doc of childDoc.documents) {
            await updateDocumentTransmitted(updateDocumentTableName, doc.id);
            await updateDocumentTimeSheetLink(
              updateDocumentTableName,
              doc.id,
              id
            );
          }
        }
      }

      // update guardian timesheet date
      if (guardianData.timeSheetDate) {
        // check if its higher than the current one save in guardian object
        if (highestTimesheetDate > new Date(guardianData.timeSheetDate)) {
          await updateTimeSheetDate(
            guardianTableName,
            identity,
            highestTimesheetDate
          );
        }
      } else {
        // update timesheet date with highest found
        await updateTimeSheetDate(
          guardianTableName,
          identity,
          highestTimesheetDate
        );
      }

      return fileResult;
    } catch (err) {
      // Handle the error and make a user friendly response
      console.error(err);
      throw new Error(`Zeitnachweis konnte nicht erstellt werden. ; `, err);
    }
  }
};
