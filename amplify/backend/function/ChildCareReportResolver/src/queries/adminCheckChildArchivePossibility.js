/* eslint-disable */
const { request } = require('../modules/appsync/appsyncRequest.js');
const { reportsByChild } = require('../modules/appsync/graphql/queries.js');

const appsyncUrl = process.env.API_CHILDCAREAPI_GRAPHQLAPIENDPOINTOUTPUT;

module.exports = {
  adminCheckChildArchivePossibility: async (ctx) => {
    console.log('#CTX-adminCheckChildArchivePossibility', ctx);
    try {
      const id = ctx.arguments.input.id;
      const response = await request(
        reportsByChild,
        'ReportsByChild',
        {
          childDailyReportId: id,
          documentStatus: { eq: 'created' }
        },
        appsyncUrl
      );
      console.log('#R', response);
      const items = response.data.reportsByChild.items;
      console.log('#items', items);

      return JSON.stringify({ archivable: items.length <= 0 });
    } catch (err) {
      // Handle the error and make a user friendly response
      console.error(err);
      throw new Error(`Child archivable status could not be checked`, err);
    }
  }
};
