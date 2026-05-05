/* eslint-disable */
const { request } = require('../modules/appsync/appsyncRequest.js');
const {
  reportsByDocumentStatus
} = require('../modules/appsync/graphql/queries.js');

const appsyncUrl = process.env.API_CHILDCAREAPI_GRAPHQLAPIENDPOINTOUTPUT;

module.exports = {
  listSpecialDailyReportsByGuardian: async (ctx) => {
    console.log('#CTX-listSpecialDailyReportsByGuardian', ctx);
    try {
      // get identity of user
      const identity = ctx.identity.sub;
      // get data from request
      const data = ctx.arguments.input;

      // get reports by index reportType and by secondary index "guardianDailyReportId" -> identity, this provides dailyReports specifically from the guardian
      const r = await request(
        reportsByDocumentStatus,
        'ReportsByDocumentStatus',
        {
          limit: 1000,
          documentStatus: 'created',
          guardianDailyReportId: { eq: identity },
          filter: {
            reportType: { eq: 'special' }
          },
          nextToken: data.nextToken
        },
        appsyncUrl
      );
      console.log('#R', r);
      const reports = r.data.reportsByDocumentStatus;

      console.log('#REPORTS', reports);

      // create filtered report list
      var filteredReports = [];

      // delete keys from reports
      for (var report of reports.items) {
        // delete keys
        delete report.guardian;
        delete report.carrier;
        delete report.invoices;
        delete report.invoicesDailyReportId;
        delete report.timeSheets;
        delete report.timeSheetsDailyReportId;
        delete report.child;

        // push to new object
        filteredReports.push(report);
      }

      return JSON.stringify({
        items: filteredReports,
        nextToken: reports.nextToken
      });
    } catch (err) {
      // Handle the error and make a user friendly response
      console.error(err);
      throw new Error(`Tägliche Berichte konnten nicht gefunden werden.`, err);
    }
  }
};
