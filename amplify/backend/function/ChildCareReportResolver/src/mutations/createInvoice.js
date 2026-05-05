/* eslint-disable */

// Package imports
const { v4: uuidv4 } = require('uuid');
// // Get the table
const documentTableName = process.env.API_CHILDCAREAPI_INVOICESTABLE_NAME;
const updateDocumentTableName =
  process.env.API_CHILDCAREAPI_DAILYREPORTTABLE_NAME;
const docCreatorLambda = process.env.FUNCTION_CHILDCAREDOCUMENTCREATOR_NAME;
// // Initialize the dynamo db doc client
const {
  createInvoice,
  updateDocumentCharged,
  updateDocumentInvoiceLink
} = require('../modules/dynamoDB/dynamodbClient.js');
// Initialize the lambda caller
const { callLambdaFunction } = require('../modules/lambda/lambdaCaller.js');
// Initialize invoice number updater
const { invoiceNumberByYear } = require('../queries/getInvoiceNumberByYear.js');

module.exports = {
  createInvoice: async (ctx) => {
    try {
      console.log('CTX INVOICE', ctx);
      // Get the data from the inputData
      var data = ctx.arguments.input;
      console.log('#DATA', data);

      // create uuid for s3 and dynamoDB
      const id = uuidv4();

      // get year of documents
      // const invoiceYear = new Date().getFullYear();

      // get invoice number for year
      const internalNumber = await invoiceNumberByYear({
        year: data.invoiceYear
      });

      // create invoiceNumber string
      const invoiceNumber = `TH-${data.invoiceYear}-${internalNumber}`;

      // invoice data object
      const invoiceObjectData = {
        child: data.child,
        guardian: data.guardian,
        carrier: data.carrier,
        internalNumber: invoiceNumber
        // overwriteHours:
        //   data.overwriteHoursValidation && data.overwriteHours > 0
        //     ? data.overwriteHours
        //     : null
      };
      console.log('#-invoiceObjectData', invoiceObjectData);
      // Create the invoice database object
      const createInvoiceEntryResult = await createInvoice(
        documentTableName,
        id,
        invoiceObjectData,
        `${id}.pdf`
      );

      // create sorted document array --> sort by date, starting with the earliest --> VERY important for invoice payment calculation
      const sortedDocuments = data.documents.sort((a, b) =>
        new Date(a.documentDate) > new Date(b.documentDate)
          ? 1
          : new Date(b.documentDate) > new Date(a.documentDate)
          ? -1
          : 0
      );

      // create data object for lambda
      const invoiceData = {
        child: data.child,
        guardian: data.guardian,
        carrier: data.carrier,
        documents: sortedDocuments,
        month: data.invoiceMonth,
        year: data.invoiceYear,
        invoiceNumber: invoiceNumber,
        documentType: 'invoice',
        id: id
      };

      console.log('#invoiceData', invoiceData);

      // Create the invoice pdf file from the data
      const createInvoiceFileResult = await callLambdaFunction(
        docCreatorLambda,
        invoiceData
      );

      // update all used dailyReports, set charged to true
      for (const doc of data.documents) {
        await updateDocumentCharged(updateDocumentTableName, doc.id);
        await updateDocumentInvoiceLink(updateDocumentTableName, doc.id, id);
      }

      // return invoice
      return createInvoiceEntryResult;
    } catch (err) {
      // Handle the error and make a user friendly response
      console.error(err);
      throw new Error(`Rechnung konnte nicht erstellt werden. ; `, err);
    }
  }
};
