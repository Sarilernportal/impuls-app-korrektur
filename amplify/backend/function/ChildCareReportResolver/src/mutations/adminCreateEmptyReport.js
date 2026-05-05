/* eslint-disable */

// Package imports
const { v4: uuidv4 } = require('uuid');
// get AppSync URL
const appsyncUrl = process.env.API_CHILDCAREAPI_GRAPHQLAPIENDPOINTOUTPUT;
// get AppSync queries
const { getChild } = require('../modules/appsync/graphql/queries.js');
const {
  createDailyReport
} = require('../modules/appsync/graphql/mutations.js');
const { request } = require('../modules/appsync/appsyncRequest.js');

module.exports = {
  adminCreateEmptyReport: async (ctx) => {
    try {
      console.log('CTX', ctx);
      // Get the data from the inputData
      var data = ctx.arguments.input;
      console.log('#-data', data);
      // create id for saving key path
      const id = uuidv4();

      // get child object to pull carrier information over carrierContact --> required for linking in dailyReport
      const childResponse = await request(
        getChild,
        'GetChild',
        { id: data.child.id },
        appsyncUrl
      );
      // get carrier id from child object
      const carrierID = childResponse.data.getChild.carrierContact.carrier.id;

      // put carrier ID into data object
      data.carrierID = carrierID;

      // setup dailyReport object
      const reportParams = {
        id: id,
        key: `${id}.pdf`,
        childDailyReportId: data.child.id,
        guardianDailyReportId: data.guardian.id,
        carrierDailyReportsId: data.carrierID,
        documentDate: data.documentDate,
        documentStatus: 'created',
        hourFrom: 12,
        hourTo: 12,
        minuteFrom: 0,
        minuteTo: 0,
        sick: data.sick,
        homework: JSON.stringify({
          german: 'nichts',
          english: 'nichts',
          maths: 'nichts',
          individual1: {
            name: '',
            value: ''
          },
          individual2: {
            name: '',
            value: ''
          }
        }),
        report: '',
        exchange: '',
        parentreport: '',
        mood: data.sick ? 'sick' : 'happy',
        reportActivity: 'school',
        retrospectively: true,
        owner: data.guardian.id,
        reportType: 'standard',
        type: 'dailyReport'
      };

      // Create the report
      const reportResponse = await request(
        createDailyReport,
        'CreateDailyReport',
        { input: reportParams },
        appsyncUrl
      );

      return reportResponse;
    } catch (err) {
      // Handle the error and make a user friendly response
      console.error(err);
      throw new Error(`Report konnte nicht erstellt werden. ; `, err);
    }
  }
};
