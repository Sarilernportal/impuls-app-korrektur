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

module.exports = {
  createSpecialReport: async (ctx) => {
    try {
      console.log('CTX-createSpecialReport', ctx);
      // Get the data from the inputData
      var data = ctx.arguments.input;
      data.documentType = 'specialReport';
      const id = uuidv4();
      const identity = ctx.identity.sub;
      data.id = id;

      // create documentStatus and reportType
      const documentStatus = 'created';
      const reportType = 'special';

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
