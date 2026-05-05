/* eslint-disable */

// Package imports
const { v4: uuidv4 } = require('uuid');
// // Get the table
const documentTableName = process.env.API_CHILDCAREAPI_DAILYREPORTTABLE_NAME;
const docCreatorLambda = process.env.FUNCTION_CHILDCAREDOCUMENTCREATOR_NAME;
// // Initialize the dynamo db doc client
const { createReport } = require('../modules/dynamoDB/dynamodbClient.js');
// Initialize the lambda caller
const { callLambdaFunction } = require('../modules/lambda/lambdaCaller.js');
// get AppSync URL
const appsyncUrl = process.env.API_CHILDCAREAPI_GRAPHQLAPIENDPOINTOUTPUT;
// get AppSync queries
const { getChild } = require('../modules/appsync/graphql/queries.js');
const { request } = require('../modules/appsync/appsyncRequest.js');

module.exports = {
  createReport: async (ctx) => {
    try {
      console.log('CTX', ctx);
      // Get the data from the inputData
      var data = ctx.arguments.input;
      data.documentType = 'dailyReport';
      const id = uuidv4();
      const identity = ctx.identity.sub;
      data.id = id;
      // get child object to pull carrier information over carrierContact --> required for linking in dailyReport
      const childResponse = await request(
        getChild,
        'GetChild',
        { id: data.childID },
        appsyncUrl
      );
      console.log('#R-childResponse', childResponse);
      const carrierID = childResponse.data.getChild.carrierContact.carrier.id;

      // put carrier ID into data object
      data.carrierID = carrierID;

      // check reportactivity --> important for dailyReport documentStatus
      // create blacklist for report activities that result in the report status charged
      const blacklist = [
        'holiday',
        'vacation',
        'employeeSickness',
        'other',
        'supervision',
        'teamMeeting'
      ];
      // create documentStatus and reportType depending on blacklist check
      const documentStatus = 'created';
      const reportType = blacklist.includes(data.reportActivity)
        ? 'special'
        : 'standard';

      // Create the report pdf file from the data
      const createReportFileResult = await callLambdaFunction(
        docCreatorLambda,
        data
      );
      // Create the report database object
      const createReportEntryResult = await createReport(
        documentTableName,
        id,
        data,
        identity,
        `${id}.pdf`,
        documentStatus,
        reportType
      );
      return createReportFileResult;
    } catch (err) {
      // Handle the error and make a user friendly response
      console.error(err);
      throw new Error(`Report konnte nicht erstellt werden. ; `, err);
    }
  }
};
