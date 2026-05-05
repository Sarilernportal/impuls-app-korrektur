/* eslint-disable */
// get AppSync URL
const appsyncUrl = process.env.API_CHILDCAREAPI_GRAPHQLAPIENDPOINTOUTPUT;
// get AppSync queries
const { getDailyReport } = require('../modules/appsync/graphql/queries.js')
const { deleteDailyReport } = require('../modules/appsync/graphql/mutations.js')
const { request } = require('../modules/appsync/appsyncRequest.js');
// Import the delete file from s3 helper function
const { deleteFile } = require('../modules/ses/s3Handler.js');

module.exports = {
  guardianDeleteDailyReport: async (ctx) => {
    console.log('#CTX-guardianDeleteDailyReport', ctx)
    try {
      // get identity of guardian
      const identity = ctx.identity.sub;
      // get id of about to be deleted daily report
      const dailyReportId = ctx.arguments.input.id;

      // get dailyreport from AppSync
      const response = await request(getDailyReport, 'GetDailyReport', { id: dailyReportId }, appsyncUrl);
      console.log('#R', response);
      const dailyReport = response.data.getDailyReport;
      console.log('#DAILY-REPORT', dailyReport);

      // get report key for s3
      const key = dailyReport.key

      // check if owner of dailyreport is same as request identity
      if (identity !== dailyReport.owner) {
        const unauthError = new Error("Not owner of report");
        unauthError.code = 403;
        throw unauthError;
      }

      // check if dailyReport status is "created"
      if (dailyReport.documentStatus !== 'created' && dailyReport.flag !== 'revise') {
        throw new Error("Report cannot be updated if not flagged or status is not created");
      }

      // delete appsync object
      const deleteResponse = await request(deleteDailyReport, 'DeleteDailyReport', { input: { id: dailyReportId } }, appsyncUrl);
      console.log('#DeleteResponse', deleteResponse);

      // delete s3 object
      const deleteFileResponse = await deleteFile('private/' + identity + '/' + key);
      console.log('#DeleteFileResponse', deleteFileResponse)


    } catch (err) {
      // Handle the error and make a user friendly response
      console.error(err);
      throw new Error(`Deletion was not successful`, err)
    }
  }
}