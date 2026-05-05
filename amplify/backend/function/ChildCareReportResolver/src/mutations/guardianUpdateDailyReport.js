/* eslint-disable */

// Package imports
const docCreatorLambda = process.env.FUNCTION_CHILDCAREDOCUMENTCREATOR_NAME;
// Initialize the lambda caller
const { callLambdaFunction } = require('../modules/lambda/lambdaCaller.js');
// get AppSync URL
const appsyncUrl = process.env.API_CHILDCAREAPI_GRAPHQLAPIENDPOINTOUTPUT;
// get AppSync queries
const { getDailyReport } = require('../modules/appsync/graphql/queries.js');
// get AppSync mutation
const {
  updateDailyReport
} = require('../modules/appsync/graphql/mutations.js');
const { request } = require('../modules/appsync/appsyncRequest.js');

module.exports = {
  guardianUpdateDailyReport: async (ctx) => {
    try {
      console.log('CTX-guardianUpdateDailyReport', ctx);
      // Get the data from the inputData
      var data = ctx.arguments.input;
      data.documentType = 'dailyReport';
      const identity = ctx.identity.sub;

      // get dailyreport from AppSync
      const response = await request(
        getDailyReport,
        'GetDailyReport',
        { id: data.id },
        appsyncUrl
      );
      console.log('#R-response', response);
      const dailyReport = response.data.getDailyReport;
      console.log('#DAILY-REPORT', dailyReport);

      // check if owner of dailyreport is same as request identity
      if (identity !== dailyReport.owner) {
        const unauthError = new Error('Not owner of report');
        unauthError.code = 403;
        throw unauthError;
      }

      // check if dailyReport status is "created"
      if (
        dailyReport.documentStatus !== 'created' &&
        dailyReport.flag !== 'revise'
      ) {
        throw new Error(
          'Report cannot be updated if not flagged or status is not created'
        );
      }

      // check if report is of type special
      if (dailyReport.reportType === 'special') {
        throw new Error('Report cannot be of type special');
      }

      // Create the report pdf file from the data
      const createReportFileResult = await callLambdaFunction(
        docCreatorLambda,
        data
      );

      // create update param object
      const updateParams = {
        id: data.id,
        homework: JSON.stringify(data.homework),
        hourFrom: data.hourFrom,
        hourTo: data.hourTo,
        minuteFrom: data.minuteFrom,
        minuteTo: data.minuteTo,
        documentDate: data.date,
        sick: data.sick,
        sickOnTime: data.sickOnTime,
        substitute: data.substitute,
        report: data.report,
        exchange: data.exchange,
        parentreport: data.parentreport,
        mood: data.mood,
        reportActivity: data.reportActivity,
        retrospectively: false
      };

      // update dailyreport
      const updateResponse = await request(
        updateDailyReport,
        'UpdateDailyReport',
        { input: updateParams },
        appsyncUrl
      );
      console.log('#R-updateResponse', updateResponse);

      return createReportFileResult;
    } catch (err) {
      // Handle the error and make a user friendly response
      console.error(err);
      throw new Error(`Report konnte nicht aktualisiert werden.`, err);
    }
  }
};
