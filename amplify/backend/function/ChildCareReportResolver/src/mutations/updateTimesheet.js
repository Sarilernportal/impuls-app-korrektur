/* eslint-disable */

// // Get the tables
const documentTableName = process.env.API_CHILDCAREAPI_TIMESHEETSTABLE_NAME;
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
  getCarrier,
  getTimeSheets
} = require('../modules/appsync/graphql/queries.js');
const {
  updateDailyReport,
  updateTimeSheets
} = require('../modules/appsync/graphql/mutations.js');
const { request } = require('../modules/appsync/appsyncRequest.js');

module.exports = {
  updateTimesheet: async (ctx) => {
    try {
      console.log('CTX-updateTimesheet', ctx);
      // Get the data from the inputData
      const identity = ctx.identity.sub;
      var data = ctx.arguments.input;

      // get guardian object
      const guardianResponse = await request(
        getGuardian,
        'GetGuardian',
        { id: identity },
        appsyncUrl
      );
      const guardianData = guardianResponse.data.getGuardian;
      // get timesheet object
      const timeSheetResponse = await request(
        getTimeSheets,
        'GetTimeSheets',
        { id: data.timeSheetsDailyReportId },
        appsyncUrl
      );
      const timeSheetData = timeSheetResponse.data.getTimeSheets;
      // get carrier object
      const carrierResponse = await request(
        getCarrier,
        'GetCarrier',
        { id: timeSheetData.carrierTimeSheetsId },
        appsyncUrl
      );
      const carrierData = carrierResponse.data.getCarrier;
      // get child object
      const childResponse = await getChild({
        id: timeSheetData.child.id
      });

      // create timesheet update object
      var updateParams = {
        child: {
          id: timeSheetData.child.id,
          data: childResponse,
          dateOfRegistration: childResponse.dateOfRegistration,
          name: childResponse.name,
          guardian: guardianData,
          guardianID: guardianData.id,
          carrierID: carrierData.id,
          carrier: carrierData
        },
        timeSheetsDailyReportId: data.timeSheetsDailyReportId,
        invoicesDailyReportId: data.invoicesDailyReportId
      };

      // get document month by number
      const documentDate =
        new Date(timeSheetData.dailyReport.items[0].documentDate).getMonth() +
        1;

      // get document year
      const documentYear = new Date(
        timeSheetData.dailyReport.items[0].documentDate
      ).getFullYear();

      const id = data.timeSheetsDailyReportId;
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
      const childTimeSheetDoc = {
        child: updateParams.child,
        documents: timeSheetData.dailyReport.items,
        month: months[documentDate],
        documentYear: documentYear,
        documentType: 'timeSheet',
        privatePath: `private/${identity}/`,
        signatureImage: data.signatureImage,
        id: id
      };
      // Create the timesheet pdf file from the data
      const createTimesheetFileResult = await callLambdaFunction(
        docCreatorLambda,
        childTimeSheetDoc
      );

      // update documentDate and revisedate of timesheet
      const currentDate = new Date().toISOString();
      const timeSheetUpdateResponse = await request(
        updateTimeSheets,
        'UpdateTimeSheets',
        {
          input: {
            id: data.timeSheetsDailyReportId,
            documentDate: currentDate,
            reviseDate: currentDate,
            flag: null
          }
        },
        appsyncUrl
      );
      console.log('#R-timeSheetUpdateResponse', timeSheetUpdateResponse);

      // create sorted document array --> sort by date, starting with the earliest
      const sortedDocuments = timeSheetData.dailyReport.items.sort((a, b) =>
        new Date(a.documentDate) > new Date(b.documentDate)
          ? 1
          : new Date(b.documentDate) > new Date(a.documentDate)
          ? -1
          : 0
      );

      // filter reports from timesheet appsync call by reports that were flagged
      const filteredDocuments = sortedDocuments.filter((doc) => {
        return doc.flag === 'revise';
      });

      for (const report of filteredDocuments) {
        // create update param object for reports
        const reportUpdateParams = {
          id: report.id,
          flag: null,
          flagText: null,
          flagDaySelection: null,
          reviseDate: currentDate
        };
        // update dailyreport
        const reportUpdateResponse = await request(
          updateDailyReport,
          'UpdateDailyReport',
          { input: reportUpdateParams },
          appsyncUrl
        );
        console.log('#R-reportUpdateResponse', reportUpdateResponse);
      }
    } catch (err) {
      // Handle the error and make a user friendly response
      console.error(err);
      throw new Error(`Zeitnachweis konnte nicht erstellt werden. ; `, err);
    }
  }
};
