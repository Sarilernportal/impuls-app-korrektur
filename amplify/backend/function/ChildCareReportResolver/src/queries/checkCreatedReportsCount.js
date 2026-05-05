/* eslint-disable */
const { request } = require('../modules/appsync/appsyncRequest.js');
const {
  reportsByDocumentStatus
} = require('../modules/appsync/graphql/queries.js');

const appsyncUrl = process.env.API_CHILDCAREAPI_GRAPHQLAPIENDPOINTOUTPUT;

module.exports = {
  checkCreatedReportsCount: async (ctx) => {
    console.log('#CTX-checkCreatedReportsCount', ctx);
    try {
      // get identity of user
      const identity = ctx.identity.sub;

      // create nextToken var --> starting with null for first request
      var nextToken = null;

      // get reports by main index "documentStatus" -> created and by secondary index "guardianDailyReportId" -> identity , this provides up to 1000 dailyReports specifically from the guardian
      const r = await request(
        reportsByDocumentStatus,
        'ReportsByDocumentStatus',
        {
          limit: 1000,
          documentStatus: 'created',
          guardianDailyReportId: { eq: identity },
          nextToken: nextToken
        },
        appsyncUrl
      );
      console.log('#R', r);
      const reports = r.data.reportsByDocumentStatus.items;

      console.log('#REPORTS', reports);

      // create filtered report list
      var reportCount = {
        standard: 0,
        special: 0
      };

      // count reports by type standard/special
      for (const report of reports) {
        if (report.reportType === 'special') {
          reportCount.special = reportCount.special + 1;
        } else {
          reportCount.standard = reportCount.standard + 1;
        }
      }

      return JSON.stringify(reportCount);
    } catch (err) {
      // Handle the error and make a user friendly response
      console.error(err);
      throw new Error(`Tägliche Berichte konnten nicht gezaehlt werden.`, err);
    }
  }
};
