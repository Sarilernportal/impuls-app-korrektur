/* eslint-disable */

// // Get the table
const docCreatorLambda = process.env.FUNCTION_CHILDCAREDOCUMENTCREATOR_NAME;
// Initialize the lambda caller
const { callLambdaFunction } = require('../modules/lambda/lambdaCaller.js');
// get AppSync URL
const appsyncUrl = process.env.API_CHILDCAREAPI_GRAPHQLAPIENDPOINTOUTPUT;
// appsync queries
// const { getInvoices } = require('../modules/appsync/graphql/queries.js');
const { request } = require('../modules/appsync/appsyncRequest.js');
// const { getInvoices } = require('../../../../../../src/customQueries.js')

module.exports = {
  adminRegenerateInvoice: async (ctx) => {
    try {
      console.log('CTX-adminRegenerateInvoice', ctx);
      // Get the data from the inputData
      var data = ctx.arguments.input;
      console.log('#DATA', data);

      // create uuid for s3 and dynamoDB
      const id = data.invoiceID;

      // // get invoice data via appsync
      // const invoiceResponse = await request(
      //   getInvoices,
      //   'GetInvoices',
      //   { id: id },
      //   appsyncUrl
      // );
      const invoiceObjData = data.invoice.data.getInvoices;
      console.log('#-invoiceObjData', invoiceObjData);

      // create sorted document array --> sort by date, starting with the earliest --> VERY important for invoice payment calculation
      const sortedDocuments = invoiceObjData.dailyReport.items.sort((a, b) =>
        new Date(a.documentDate) > new Date(b.documentDate)
          ? 1
          : new Date(b.documentDate) > new Date(a.documentDate)
          ? -1
          : 0
      );

      // create data object for lambda
      const invoiceData = {
        child: invoiceObjData.child,
        guardian: invoiceObjData.guardian,
        carrier: invoiceObjData.carrier,
        // overwriteHours: invoiceObjData.overwriteHours,
        documents: sortedDocuments,
        month: data.invoiceMonth,
        year: data.invoiceYear,
        invoiceNumber: invoiceObjData.internalNumber,
        customInvoiceNumber: data.invoiceNumber,
        extraHours: data.extraHours,
        extraHourRate: data.extraHourRate,
        extraDescription: data.extraDescription,
        documentType: 'invoice',
        id: id
      };
      console.log('#invoiceData', invoiceData);

      // Create the invoice pdf file from the data
      const createInvoiceFileResult = await callLambdaFunction(
        docCreatorLambda,
        invoiceData
      );

      // return invoice
      return createInvoiceFileResult;
    } catch (err) {
      // Handle the error and make a user friendly response
      console.error(err);
      throw new Error(`Rechnung konnte nicht erstellt werden. ; `, err);
    }
  }
};
